precision highp float;

attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec3 aVertexTangent;
attribute vec3 aVertexBinormal;
attribute vec2 aVertexUV;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projMatrix;
uniform mat4 normalMatrix;

varying vec3 vPosWorld;
varying vec3 vNormal;
varying vec3 vTangent;
varying vec3 vBinormal;
varying vec2 vUV;

void main(void) {
  gl_Position = projMatrix * viewMatrix * modelMatrix * vec4(aVertexPosition, 1.0);

  vPosWorld=(modelMatrix*vec4(aVertexPosition,1.0)).xyz;
  vNormal=normalize((normalMatrix*vec4(aVertexNormal,1.0)).xyz);
  vTangent=normalize((normalMatrix*vec4(aVertexTangent,1.0)).xyz);
  vBinormal=normalize((normalMatrix*vec4(aVertexBinormal,1.0)).xyz);
  vUV=aVertexUV;
}