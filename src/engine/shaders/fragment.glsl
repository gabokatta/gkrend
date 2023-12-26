precision highp float;

uniform vec3 modelColor;
uniform bool normalColoring;
uniform bool useTexture;

uniform sampler2D texture;

varying vec3 vPosWorld;
varying vec3 vNormal;
varying vec3 vTangent;
varying vec3 vBinormal;
varying vec2 vUV;

void main(void) {

  vec3 normalColor = vec3(0.5, 0.5, 0.5) + 0.5 * vNormal;
  float lightIntensity = 0.6 + 0.15*vNormal.y + 0.05 * vNormal.z + 0.05 * vNormal.x; 

  if (useTexture) {     
    vec4 textureColor=texture2D(texture, vUV); 
    gl_FragColor = vec4(textureColor.xyz,1.0);
  }
  else if ( normalColoring ) {
    gl_FragColor = vec4(normalColor, 1.0);
  } 
  else {
    gl_FragColor = vec4(modelColor*lightIntensity, 1.0);
  }
}