import { mat4, vec3 } from "gl-matrix";
import { buildBuffers, buildIndex,  Geometry } from "../geometry";
import { DrawMethod, WebGL } from "../webgl";

export class Cylinder implements Geometry {

    index: number[] = [];
    position: number[] = [];
    normal: number[] = [];
    binormal: number[] = [];
    tangent: number[] = [];

    reverseUV: boolean = false;
    uvFactors: number[] = [1,1];
    uv: number[] = [];

    covers: {
        position: number[],
        normal: number[],
        binormal: number[],
        tangent: number[],
        uv: number[],
        index: number[]
    }[] = [];

    rows: number = 75;
    cols: number = 75;

    radius: number;
    height: number;

    constructor(radius: number, height: number) {
        this.radius = radius;
        this.height = height;
        buildBuffers(this);
        buildIndex(this);
        this.buildCovers();
    }
    
    
    getPointData(alfa: number, beta: number) {

        let applyRot = (angle: number, axis: vec3) => {
            return mat4.fromRotation(mat4.create(), angle, axis)
        }

        let transformVec = (vec: number[], transform: mat4) => {
            let _vec = vec3.fromValues(vec[0], vec[1], vec[2]);
            vec3.transformMat4(_vec, _vec, transform)
            return [_vec[0], _vec[1], _vec[2]];
        }

        let crossVec = (vec1: number[], vec2: number[]) => {
            let _vecF = vec3.create();
            vec3.cross(_vecF, vec3.fromValues(vec1[0], vec1[1], vec1[2]), vec3.fromValues(vec2[0], vec2[1], vec2[2]));
            return [_vecF[0], _vecF[1], _vecF[2]];
        }

        let _beta = beta > 0.5 ? 1: 0;
        const rot = applyRot(2 * Math.PI * alfa, [0, 0, 1]);

        let p = [this.radius, 0, (_beta - 0.5)*this.height];
        p = transformVec(p, rot);

        let n = [1,0,0];
        n = transformVec(n, rot);

        let t = [0, 1, 0];
        t = transformVec(t, rot);

        const b: number[] = crossVec(n,t);

        return {p, n, u: alfa, v: beta, t, b };
    }
;

    buildCovers() {
        this.covers.push(fillTop(this), fillBottom(this));
    }

    draw(gl: WebGL): void {
        gl.draw(this);
        this.covers.forEach((c) => {
            gl.draw({position: c.position, 
                index:  c.index, 
                normal: c.normal,
                binormal: c.binormal,
                tangent: c.tangent,
                uv: c.uv
            }, 
            DrawMethod.Fan);
        })
    }
    
}

function fillBottom(cylinder:  Cylinder): {
    position: number[],
    normal: number[],
    binormal: number[],
    tangent: number[],
    uv: number[],
    index: number[]
} {
    var bottom:  {
        position: number[],
        normal: number[],
        binormal: number[],
        tangent: number[],
        uv: number[],
        index: number[]
    }  = {position: [], normal: [], binormal: [], tangent: [], uv: [], index: []};

    let v = 0;

    const n = [0, 0, 2 * v - 1];
    const t = [1, 0, 0];
    const b = [0, 2 * v - 1, 0];

    let points = [...[0, 0, v - cylinder.height/2]];
    let normals = [...n];
    let tangents = [...t];
    let biNormals = [...b];
    let uv = [0.5, 0.5];

    for (let i = 0; i <= cylinder.cols; i++) {
        const u = i / cylinder.cols;
        const { p } = cylinder.getPointData(u, v);

        points.push(...p);
        normals.push(...n);
        tangents.push(...t);
        biNormals.push(...b);
        uv.push(
          (-Math.cos(u * Math.PI * 2) * cylinder.uvFactors[0] + 1) / 2, // u
          (Math.sin(u * Math.PI * 2) * cylinder.uvFactors[1] + 1) / 2 // v
        );
    }
    const idx = [...Array(points.length / 3).keys()];

    bottom.position = points;
    bottom.normal = normals;
    bottom.tangent = tangents;
    bottom.binormal = biNormals;
    bottom.uv = uv;
    bottom.index = idx;

    return bottom;
}

function fillTop(cylinder: Cylinder): {
    position: number[],
    normal: number[],
    binormal: number[],
    tangent: number[],
    uv: number[],
    index: number[]
} {
    var top:  {
        position: number[],
        normal: number[],
        binormal: number[],
        tangent: number[],
        uv: number[],
        index: number[]
    }  = {position: [], normal: [], binormal: [], tangent: [], uv: [], index: []};

    let v = 1;

    const n = [0, 0, 2 * v - 1];
    const t = [1, 0, 0];
    const b = [0, 2 * v - 1, 0];

    let points = [...[0, 0, v + cylinder.height/2 - 1]];
    let normals = [...n];
    let tangents = [...t];
    let biNormals = [...b];
    let uv = [0.5, 0.5];

    for (let i = 0; i <= cylinder.cols; i++) {
        const u = i / cylinder.cols;
        const { p } = cylinder.getPointData(u, v);

        points.push(...p);
        normals.push(...n);
        tangents.push(...t);
        biNormals.push(...b);
        uv.push(
          (-Math.cos(u * Math.PI * 2) * cylinder.uvFactors[0] + 1) / 2, // u
          (Math.sin(u * Math.PI * 2) * cylinder.uvFactors[1] + 1) / 2 // v
        );
    }
    const idx = [...Array(points.length / 3).keys()];

    top.position = points;
    top.normal = normals;
    top.tangent = tangents;
    top.binormal = biNormals;
    top.uv = uv;
    top.index = idx;

    return top;
}