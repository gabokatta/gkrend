import { mat4, vec3 } from "gl-matrix";

const vertexShaderPath = 'src/engine/shaders/vertex.glsl';
const fragmentShaderPath = 'src/engine/shaders/fragment.glsl';
const uvTexturePath = 'dist/assets/uv.jpg';

export class WebGL {

    public canvas: HTMLCanvasElement;
    public gl: WebGLRenderingContext;
    public program: WebGLProgram;

    public modelMatrix: mat4;
    public viewMatrix: mat4;
    public projMatrix: mat4;
    public normalMatrix: mat4;

    public method: DrawMethod;

    public color: number[];

    public useTexture: boolean = false;
    public normalColoring: boolean = false;
    public showLines: boolean = false;
    public showSurface: boolean = true;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.modelMatrix = mat4.create();
        this.viewMatrix = mat4.create();
        this.projMatrix = mat4.create();
        this.normalMatrix = mat4.create();
        this.method = DrawMethod.Smooth;
        this.color = [0.8,0.8,1]

        if (!canvas) throw Error("Your browser does not support WebGL");
        this.gl = canvas.getContext("webgl")!;
        this.program = this.gl.createProgram()!;

        this.cleanGL();
    };

    cleanGL() {
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.clearColor(0.1, 0.1, 0.2, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    };

    async init(vertexShader = vertexShaderPath, fragmentShader = fragmentShaderPath) {
        
        await this.setUpShaders(vertexShader, fragmentShader);
        this.setUpMatrices();
        this.cleanGL();
        this.setColor(this.color);
        this.setNormalColoring(this.normalColoring);
        
        return this;
    }

    async initTextures(texturePaths: string[] = [uvTexturePath]) {
        for (let path of texturePaths) {
            let texture = await this.loadTexture(path)
            this.setTexture(texture)
        }
        return this;
    }

    async loadTexture(file: string){
        let gl: WebGLRenderingContext =  this.gl;
        let image: HTMLImageElement = await loadImage(file);
        let texture: WebGLTexture = gl.createTexture()!;
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true); 					// invierto el ejeY					
        gl.bindTexture(gl.TEXTURE_2D, texture); 						// activo la textura
            
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);	// cargo el bitmap en la GPU
            
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);					// selecciono filtro de magnificacion
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);	// selecciono filtro de minificacion
            
        gl.generateMipmap(gl.TEXTURE_2D);		// genero los mipmaps
        gl.bindTexture(gl.TEXTURE_2D, null);
        return texture;
    }

    setUpMatrices() {
        mat4.perspective(this.projMatrix, 45, this.canvas.width / this.canvas.height, 0.1, 500.0);
        
        mat4.identity(this.viewMatrix);
        mat4.translate(this.viewMatrix, this.viewMatrix, [0.0, 0.0, -10.0]);

        this.setMatrixUniforms();
    };

    setMatrixUniforms() {
        this.setMatrix("modelMatrix", this.modelMatrix);
        this.setMatrix("viewMatrix", this.viewMatrix);
        this.setMatrix("normalMatrix", this.normalMatrix);
        this.setMatrix("projMatrix", this.projMatrix);
    }

    async setUpShaders(vertexFile: string, fragmentFile: string) {
        const [vertex, fragment] = await Promise.all([
           fetch(vertexFile).then(handleResponse),
           fetch(fragmentFile).then(handleResponse)
        ]);

        const vertexShader = makeShader(this.gl, vertex, this.gl.VERTEX_SHADER);
        const fragmentShader = makeShader(this.gl, fragment, this.gl.FRAGMENT_SHADER);

        this.gl.attachShader(this.program, vertexShader);
        this.gl.attachShader(this.program, fragmentShader);
        this.gl.linkProgram(this.program);

        if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
            throw new Error("Unable to initialize the shader program.");
        }

        this.gl.useProgram(this.program);
    }

    draw(geometry: any, method: DrawMethod =  this.method) {
        this.setMatrixUniforms();
        const vertexBuffer = this.createBuffer(geometry.position);
        const normalBuffer = this.createBuffer(geometry.normal);
        const binormalBuffer = this.createBuffer(geometry.binormal);
        const tangentBuffer = this.createBuffer(geometry.tangent);
        const uvBuffer = this.createBuffer(geometry.uv);
        const indexBuffer = this.createIndexBuffer(geometry.index);

        this.setAttribute(vertexBuffer, 3 , "aVertexPosition");
        this.setAttribute(normalBuffer, 3 , "aVertexNormal");
        this.setAttribute(binormalBuffer, 3 , "aVertexBinormal");
        this.setAttribute(tangentBuffer, 3 , "aVertexTangent");
        this.setAttribute(uvBuffer, 2 , "aVertexUV");

        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

        if (this.showSurface) this.gl.drawElements(method, geometry.index.length, this.gl.UNSIGNED_SHORT, 0);
        if (this.showLines) {
            this.setDrawColor([0.5, 0.5, 0.5]);
            this.gl.drawElements(this.gl.LINE_STRIP, geometry.index.length, this.gl.UNSIGNED_SHORT, 0);
            this.setDrawColor(this.color);
        }
    }

    drawObjectNormals(n: vec3[]) {
        for (let i= 0; i < n.length; i += 24) {
            this.drawLine(n[i], n[i + 1]);
        }
    }

    drawLine(p1: vec3, p2: vec3, normals: number[] = [0,0,0,0,0,0]) {
        this.draw({
                position: [...p1, ...p2],
                index: [0,1],
                normal: normals
            },
        DrawMethod.Lines);
    }

    // Utility Methods

    createBuffer(array: Array<number>): WebGLBuffer {
        const buffer = this.gl.createBuffer()!;
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(array), this.gl.STATIC_DRAW);
        return buffer!;
    };

    createIndexBuffer(index: Array<number>): WebGLBuffer {
        const buffer = this.gl.createBuffer()!;
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, buffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(index), this.gl.STATIC_DRAW);
        return buffer;
    };

    setDrawMethod(method: DrawMethod) {
        this.method = method;
        return this;
    }

    setAttribute(buffer: WebGLBuffer, size: number, name: string) {
        const attributeLocation = this.gl.getAttribLocation(this.program, name);
        this.gl.enableVertexAttribArray(attributeLocation);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.gl.vertexAttribPointer(attributeLocation, size, this.gl.FLOAT, false, 0 , 0); 
    }

    setColor(color: number[]) {
        this.color = color;
        this.setDrawColor(this.color);
        return this;
      }

    setDrawColor(color: number[]) {
        const modelColor = color.length == 0 ? [1.0, 0, 1.0] : color;
    
        const colorUniform = this.gl.getUniformLocation(
          this.program,
          "modelColor"
        );
        this.gl.uniform3fv(colorUniform, vec3.fromValues(modelColor[0], modelColor[1], modelColor[2]));
    }

    setNormalColoring(bool: boolean) {
        this.normalColoring = bool;
        const normalColoringUniform = this.gl.getUniformLocation(
          this.program,
          "normalColoring"
        );
        this.gl.uniform1i(normalColoringUniform, Number(bool));
        return this;
    }

    setShowLines(bool: boolean) {
        this.showLines = bool;
        return this;
    }

    setShowSurfaces(bool: boolean) {
        this.showSurface = bool;
        return this;
    }

    setTexture(texture: WebGLTexture) {
        this.gl.uniform1i(this.gl.getUniformLocation(this.program, "texture"), 0);
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
    }

    setUseTexture(bool: boolean) {
        this.useTexture = bool;
        const useTextureUniform = this.gl.getUniformLocation(
          this.program,
          "useTexture"
        );
        this.gl.uniform1i(useTextureUniform, Number(bool));
        return this;
    }

    setView(view: mat4) {
        this.viewMatrix = view;
        this.setMatrix("viewMatrix", view);
    }

    setModel(model: mat4) {
        this.modelMatrix = model;
        this.setMatrix("modelMatrix", model);
        this.setNormal();
    }

    setNormal() {
        var normal = this.normalMatrix;
        var model = this.modelMatrix;
        var view = this.viewMatrix;

        mat4.identity(this.normalMatrix);
        mat4.multiply(normal,view,model);
        mat4.invert(normal,normal);
        mat4.transpose(normal,normal);

        this.normalMatrix = normal;
        this.setMatrix("normalMatrix", normal);
    }

    setMatrix(name: string, matrix: mat4) {
        var matrixUniform: WebGLUniformLocation = this.gl.getUniformLocation(this.program, name)!;
        this.gl.uniformMatrix4fv(matrixUniform, false, matrix);
    }

}

function makeShader( gl: WebGLRenderingContext ,src: string, type: GLenum) {
    //compile the vertex shader
    var shader: WebGLShader = gl.createShader(type)!;
    gl.shaderSource(shader, src);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.log("Error compiling shader: " + gl.getShaderInfoLog(shader));
    }
    return shader;
}

function handleResponse(response: Response) {
    if (!response.ok) throw new Error("Error fetching resource");
    return response.text();
};

export enum DrawMethod {
    Smooth = WebGLRenderingContext.TRIANGLE_STRIP,
    LineStrip = WebGLRenderingContext.LINE_STRIP,
    Fan = WebGLRenderingContext.TRIANGLE_FAN,
    Lines = WebGLRenderingContext.LINES
}


export function loadImage(path: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = path;
      img.onload = () => {
        resolve(img);
      };
      img.onerror = (e) => {
        reject(e);
      };
    });
  };