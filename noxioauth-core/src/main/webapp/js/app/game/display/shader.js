"use strict";
/* global main */

var ECHECHECH = 25;

/* Define Shader Container Class */
function Shader(name, program, attributes, uniforms) {
  this.name = name;
  this.program = program;
  this.attributes = attributes;
  this.uniforms = uniforms;
}

Shader.prototype.use = function(gl, uniformData, uniformModelData) {
  gl.useProgram(this.program);
   
  this.applyUniformData(gl, uniformData);
  this.applyUniformData(gl, uniformModelData);
};

Shader.prototype.applyUniformData = function(gl, uniformData) {
  for(var i=0;i<uniformData.length;i++) {
    var uniform = this.uniforms[uniformData[i].name];
    if(!uniform) { continue; }
    switch(uniform.type) {
      case "vec3" : { gl.uniform3fv(uniform.location, uniformData[i].data); break; }
      case "vec4" : { gl.uniform4fv(uniform.location, uniformData[i].data); break; }
      case "mat4" : { gl.uniformMatrix4fv(uniform.location, false, uniformData[i].data); break; }
      case "sampler2D" : { gl.uniform1i(uniform.location, uniformData[i].data); break; }
      default : { main.menu.warning.show("Shader Uniform Error: Invalid type '" + uniform.type + "' for variable '" + uniform.name + "'."); break; }
    }
  }
};
