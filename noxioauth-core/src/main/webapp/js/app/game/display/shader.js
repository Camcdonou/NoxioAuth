"use strict";
/* global main */

/* Define Shader Container Class */
function Shader(name, program, attributes) {
  this.name = name;
  this.program = program;
  this.attributes = attributes;
}

Shader.prototype.use = function(gl) {
  gl.useProgram(this.program);
};

Shader.prototype.setMatrixUniforms = function(gl, perspective, mvMatrix) {
  var pUniform = gl.getUniformLocation(this.program, "uPMatrix");
  gl.uniformMatrix4fv(pUniform, false, new Float32Array(perspective.flatten()));

  var mvUniform = gl.getUniformLocation(this.program, "uMVMatrix");
  gl.uniformMatrix4fv(mvUniform, false, new Float32Array(mvMatrix.flatten()));
};