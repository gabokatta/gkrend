import { Sphere } from "./engine/shapes/sphere";
import { WebGL } from "./engine/webgl";

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
<html lang="en">
<head>
  <style>
    body{ background-color: grey; }
    canvas{ background-color: rgb(0, 0, 0);}
  </style>
</head>
<body>
  <center>
    <h1>gkrend - beta stage</h1>   		            
    <canvas id="my-canvas" width="1500" height="800">
      Your browser does not support the HTML5 canvas element.
    </canvas>    		
  </center>
</body>
</html>
`

const draw = async () => {
  var canvas = <HTMLCanvasElement> document.getElementById("my-canvas")!;
  var gl =  await new WebGL(canvas).init();
  var sphere = new Sphere(3)

  gl.draw(sphere)
}

draw();