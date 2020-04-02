"use strict";
/* global main */

/* Define Material Class */
/* castShadow values:
 * - 0 no shadow
 * - 1 cast full shadow
 * - 2 cast masked shadow
 */
function Material(name, shader, texture, cube, castShadow, bloomShader) {
  this.name = name;
  this.shader = shader;
  this.bloom = bloomShader;
  this.texture = texture;      // While this *could* be an array I prefer to use an object for index safety. EX: texture0 and texture3 are used but 1 and 2 are not.
  if(cube) { this.cube = cube; }
  switch(castShadow) {
    case "false" : { this.castShadow = 0; break; }
    case "mask" : { this.castShadow = 2; break; }
    default : { this.castShadow = 1; break; }
  };
}

Material.prototype.enable = function(gl, bloomFlag) {  // If bloomFlag is set to true then we apply texture uniforms to bloom shader
  var uniformMaterialData = [];
  if(this.texture.texture0) { this.texture.texture0.enable(gl, 0); uniformMaterialData.push({name: "texture0", data: 0}); }
  if(this.texture.texture1) { this.texture.texture1.enable(gl, 1); uniformMaterialData.push({name: "texture1", data: 1}); }
  if(this.texture.texture2) { this.texture.texture2.enable(gl, 2); uniformMaterialData.push({name: "texture2", data: 2}); }
  if(this.texture.texture3) { this.texture.texture3.enable(gl, 3); uniformMaterialData.push({name: "texture3", data: 3}); }
  if(this.texture.texture4) { this.texture.texture4.enable(gl, 4); uniformMaterialData.push({name: "texture4", data: 4}); }
  if(this.cube) { this.cube.enable(gl); uniformMaterialData.push({name: "cube", data: 8}); }
  if(bloomFlag) { this.bloom.applyUniforms(gl, uniformMaterialData); }
  else { this.shader.applyUniforms(gl, uniformMaterialData); }
};

Material.prototype.disable = function(gl) { 
  if(this.texture.texture0) { this.texture.texture0.disable(gl, 0); }
  if(this.texture.texture1) { this.texture.texture1.disable(gl, 1); }
  if(this.texture.texture2) { this.texture.texture2.disable(gl, 2); }
  if(this.texture.texture3) { this.texture.texture3.disable(gl, 3); }
  if(this.texture.texture4) { this.texture.texture4.disable(gl, 4); }
  if(this.cube) { this.cube.disable(gl); }
};