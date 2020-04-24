"use strict";
/* global main */

/* Define Model Data Class */
function Model(name, vertexBuffer, indexBuffer, indexSize) {
  this.name = name;
  this.vertexBuffer = vertexBuffer;
  this.indexBuffer = indexBuffer;
  this.indexSize = indexSize;
};

/** @FIXME in theory we could optimize draws by having seperate bind() and draw() calls. Might consider it in the future. **/
Model.prototype.draw = function(gl, shader) {
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
  if(shader.attributes.position) { gl.vertexAttribPointer(shader.attributes.position.location, 3, gl.FLOAT, false, 36, 0); } 
  if(shader.attributes.texcoord) { gl.vertexAttribPointer(shader.attributes.texcoord.location, 3, gl.FLOAT, false, 36, 12); }
  if(shader.attributes.normal) { gl.vertexAttribPointer(shader.attributes.normal.location, 3, gl.FLOAT, false, 36, 24); }
  
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
  gl.drawElements(gl.TRIANGLES, this.indexSize, gl.UNSIGNED_SHORT, 0);
};