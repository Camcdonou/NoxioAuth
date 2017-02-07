"use strict";
/* global main */
/* global Matrix */

/* Define Model Data Class */
function Model(name, vertexBuffer, indexBuffer, shader) {
  this.name = name;
  this.vertexBuffer = vertexBuffer;
  this.indexBuffer = indexBuffer;
  this.shader = shader;
};

Model.prototype.draw = function(gl, perspective, pos, rot) { /* Please end my suffering... @FIXME Quaternion... */
  var transformMatrix;
  transformMatrix = Matrix.Rotation(rot.w, $V([rot.x, rot.y, rot.z])).ensure4x4();
  transformMatrix = transformMatrix.x(Matrix.Translation($V([pos.x, pos.y, pos.z])).ensure4x4());
  
  this.shader.use(gl); // Apply Default shader
  this.shader.setMatrixUniforms(gl, perspective, transformMatrix); //Set shader uniforms
  
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
  gl.vertexAttribPointer(this.shader.attributes.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
  
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
  gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
};