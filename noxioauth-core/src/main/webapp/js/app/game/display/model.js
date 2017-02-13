"use strict";
/* global main */
/* global Matrix */

/* Define Model Data Class */
function Model(name, vertexBuffer, indexBuffer, indexSize, shader) {
  this.name = name;
  this.vertexBuffer = vertexBuffer;
  this.indexBuffer = indexBuffer;
  this.indexSize = indexSize;
  this.shader = shader; /* DEPRECATED @FIXME */
};

Model.prototype.draw = function(gl, shader, pos, rot, camera, uniformData) { /* Please end my suffering... @FIXME Quaternion... */
//  var transformMatrix = Matrix.I(4);
  /* @FIXME rotation code? */
  //transformMatrix = Matrix.Rotation(rot.w, $V([rot.x, rot.y, rot.z])).ensure4x4();
//  transformMatrix = transformMatrix.x(Matrix.Translation($V([pos.x, pos.y, pos.z])).ensure4x4());
//  transformMatrix = transformMatrix.x(Matrix.Translation($V([camera.pos.x, camera.pos.y, camera.pos.z])).ensure4x4());
  var transform = [pos.x+camera.pos.x, pos.y+camera.pos.y, pos.z+camera.pos.z];
  
  var uniformModelData = [
    {name: "transform", data: transform}
  ];
  
  shader.use(gl, uniformData, uniformModelData); // Apply Default shader and set uniforms
  
  if(shader.attributes.position) { gl.enableVertexAttribArray(shader.attributes.position.location); }
  if(shader.attributes.texcoord) { gl.enableVertexAttribArray(shader.attributes.texcoord.location); }
  if(shader.attributes.normal) { gl.enableVertexAttribArray(shader.attributes.normal.location); }
  
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
  if(shader.attributes.position) { gl.vertexAttribPointer(shader.attributes.position.location, 3, gl.FLOAT, false, 36, 0); }
  if(shader.attributes.texcoord) { gl.vertexAttribPointer(shader.attributes.texcoord.location, 3, gl.FLOAT, false, 36, 12); }
  if(shader.attributes.normal) { gl.vertexAttribPointer(shader.attributes.normal.location, 3, gl.FLOAT, false, 36, 24); }
  
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
  gl.drawElements(gl.TRIANGLES, this.indexSize, gl.UNSIGNED_SHORT, 0);
  
  if(shader.attributes.position) { gl.disableVertexAttribArray(shader.attributes.position.location); }
  if(shader.attributes.texcoord) { gl.disableVertexAttribArray(shader.attributes.texcoord.location); }
  if(shader.attributes.normal) { gl.disableVertexAttribArray(shader.attributes.normal.location); }
};