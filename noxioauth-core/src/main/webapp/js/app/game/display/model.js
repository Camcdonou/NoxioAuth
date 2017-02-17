"use strict";
/* global main */
/* global Matrix */

/* Define Model Data Class */
function Model(name, vertexBuffer, indexBuffer, indexSize) {
  this.name = name;
  this.vertexBuffer = vertexBuffer;
  this.indexBuffer = indexBuffer;
  this.indexSize = indexSize;
};

Model.prototype.draw = function(gl, shader, pos, rot, camera) { /* Please end my suffering... @FIXME Quaternion... */
  var transform = [pos.x+camera.pos.x, pos.y+camera.pos.y, pos.z+camera.pos.z];
  
  var uniformModelData = [
    {name: "transform", data: transform}
  ];
  
  shader.applyUniforms(gl, uniformModelData); // Apply draw specific uniforms EX: position, rotation, animation state
  
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
  if(shader.attributes.position) { gl.vertexAttribPointer(shader.attributes.position.location, 3, gl.FLOAT, false, 36, 0); }
  if(shader.attributes.texcoord) { gl.vertexAttribPointer(shader.attributes.texcoord.location, 3, gl.FLOAT, false, 36, 12); }
  if(shader.attributes.normal) { gl.vertexAttribPointer(shader.attributes.normal.location, 3, gl.FLOAT, false, 36, 24); }
  
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
  gl.drawElements(gl.TRIANGLES, this.indexSize, gl.UNSIGNED_SHORT, 0);
};