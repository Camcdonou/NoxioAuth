"use strict";
/* global main */

/* Define Shader Container Class */
function Shader(name, program, attributes, uniforms) {
  this.name = name;
  this.program = program;
  this.attributes = attributes;
  this.uniforms = uniforms;
}

Shader.prototype.enable = function(gl) {
  gl.useProgram(this.program);
  
  if(this.attributes.position) { gl.enableVertexAttribArray(this.attributes.position.location); }
  if(this.attributes.texcoord) { gl.enableVertexAttribArray(this.attributes.texcoord.location); }
  if(this.attributes.normal) { gl.enableVertexAttribArray(this.attributes.normal.location); }
};

Shader.prototype.disable = function(gl) {
  if(this.attributes.position) { gl.disableVertexAttribArray(this.attributes.position.location); }
  if(this.attributes.texcoord) { gl.disableVertexAttribArray(this.attributes.texcoord.location); }
  if(this.attributes.normal) { gl.disableVertexAttribArray(this.attributes.normal.location); }
};

Shader.prototype.applyUniforms = function(gl, uniformData) {
  for(var i=0;i<uniformData.length;i++) {
    var uniform = this.uniforms[uniformData[i].name];
    if(!uniform) { continue; }
    switch(uniform.type) {
      case "int" : { gl.uniform1i(uniform.location, uniformData[i].data); break; }
      case "int[]" : { gl.uniform1i(uniform.location, uniformData[i].data); break; }
      case "float" : { gl.uniform1f(uniform.location, uniformData[i].data); break; }
      case "float[]" : { gl.uniform1fv(uniform.location, uniformData[i].data); break; }
      case "vec2" : { gl.uniform2fv(uniform.location, uniformData[i].data); break; }
      case "vec2[]" : { gl.uniform2fv(uniform.location, uniformData[i].data); break; }
      case "vec3" : { gl.uniform3fv(uniform.location, uniformData[i].data); break; }
      case "vec3[]" : { gl.uniform3fv(uniform.location, uniformData[i].data); break; }
      case "vec4" : { gl.uniform4fv(uniform.location, uniformData[i].data); break; }
      case "vec4[]" : { gl.uniform4fv(uniform.location, uniformData[i].data); break; }
      case "mat4" : { gl.uniformMatrix4fv(uniform.location, false, uniformData[i].data); break; }
      case "sampler2D" : { gl.uniform1i(uniform.location, uniformData[i].data); break; }
      default : { /* main.menu.warning.show("Shader Uniform Error: Invalid type '" + uniform.type + "' for variable '" + uniform.name + "'."); */ break; }
    }
  }
};
