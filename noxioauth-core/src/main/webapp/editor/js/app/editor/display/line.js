"use strict";
/* global main */

/* Define Line Data Class */
function Line(gl, line) {
  
  var data = {
    vertices: [line.a.x, line.a.y, line.b.x, line.b.y],
    indices: [0,1]
  };
  
  this.vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data.vertices), gl.STATIC_DRAW);
  
  this.indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data.indices), gl.STATIC_DRAW);
  
  this.indexSize = data.indices.length;
};

/* @FIXME in theory we could optimize draws by having seperate bind() and draw() calls. Might consider it in the future. */
Line.prototype.draw = function(gl, shader) {
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
  if(shader.attributes.position) { gl.vertexAttribPointer(shader.attributes.position.location, 2, gl.FLOAT, false, 0, 0); }
  
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
  gl.drawElements(gl.LINES, this.indexSize, gl.UNSIGNED_SHORT, 0);
};