"use strict";
/* global main */

/* Define Model Data Class */
function Model(name, vertexBuffer, indexBuffer, indexSize) {
  this.name = name;
  this.vertexBuffer = vertexBuffer;
  this.indexBuffer = indexBuffer;
  this.indexSize = indexSize;
};

/** Bind sets up generic rendering stuff. This is called before we draw this particular model. **/
/** By seperately binding and drawing we can bind vertex attribs and buffers once and draw them multiple times. Saves overhead **/
Model.prototype.bind = function(gl, shader) {
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
  if(shader.attributes.position) { gl.vertexAttribPointer(shader.attributes.position.location, 3, gl.FLOAT, false, 36, 0); } 
  if(shader.attributes.texcoord) { gl.vertexAttribPointer(shader.attributes.texcoord.location, 3, gl.FLOAT, false, 36, 12); }
  if(shader.attributes.normal) { gl.vertexAttribPointer(shader.attributes.normal.location, 3, gl.FLOAT, false, 36, 24); }
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
};

Model.prototype.draw = function(gl, shader) {
  if(VBO_BIND_HACK_MODEL !== this || VBO_BIND_HACK_SHADER !== shader) { this.bind(gl, shader); VBO_BIND_HACK_MODEL = this; VBO_BIND_HACK_SHADER = shader; }
  gl.drawElements(gl.TRIANGLES, this.indexSize, gl.UNSIGNED_SHORT, 0);
};

/* @TODO: PERFORMANCE HACK!! */
var VBO_BIND_HACK_MODEL = undefined;
var VBO_BIND_HACK_SHADER = undefined;