"use strict";
/* global main */

/* Define Shader Container Class */
function Shader(gl, name, program, attributes) {
  this.name = name;
  this.program = program;
  this.attributes = attributes;
  this.uniform = {
    uPMatrix: gl.getUniformLocation(this.program, "uPMatrix"),
    uMVMatrix: gl.getUniformLocation(this.program, "uMVMatrix"), /* @FIXME move this to createShader */
    texture: gl.getUniformLocation(this.program, "texture")
  };
}

Shader.prototype.use = function(gl) {
  gl.useProgram(this.program);
};

Shader.prototype.setMatrixUniforms = function(gl, perspective, mvMatrix) {
  gl.uniformMatrix4fv(this.uniform.uPMatrix, false, new Float32Array(perspective.flatten()));
  gl.uniformMatrix4fv(this.uniform.uMVMatrix, false, new Float32Array(mvMatrix.flatten()));
  gl.uniform1i(this.uniform.texture, 0);
};