"use strict";
/* global main */

/* Define Material Class */
function Material(name, shader, texture) {
  this.name = name;
  this.shader = shader;
  this.texture = texture; /* @FIXME The way this is compiled and stored is kind of weird, maybe change it to some kind of array with name ids or w/e */
}

Material.prototype.use = function(gl, uniformData, uniformModelData) {
  var uniformMaterialData = [];
  if(this.texture.texture0) { this.texture.texture0.bind(gl, 0); uniformMaterialData.push({name: "texture0", data: 0}); }
  if(this.texture.texture1) { this.texture.texture1.bind(gl, 1); uniformMaterialData.push({name: "texture1", data: 1}); }
  if(this.texture.texture2) { this.texture.texture2.bind(gl, 2); uniformMaterialData.push({name: "texture2", data: 2}); }
  if(this.texture.texture3) { this.texture.texture3.bind(gl, 3); uniformMaterialData.push({name: "texture3", data: 3}); }
  if(this.texture.texture4) { this.texture.texture4.bind(gl, 4); uniformMaterialData.push({name: "texture4", data: 4}); }
  this.shader.use(gl, uniformData, uniformModelData, uniformMaterialData);
};