"use strict";
/* global main */

/* Define Line Grid Data Class */
function Grid(gl, size) {
  
  var data = {
    vertices: [],
    indices: []
  };
  
  var j = 0;
  for(var i=1;i<size.x;i++) {
    data.vertices.push(...[i, 0.0, i, size.y]);
    data.indices.push(...[j++,j++]);
  }
  for(var i=1;i<size.y;i++) {
    data.vertices.push(...[0.0, i, size.x, i]);
    data.indices.push(...[j++,j++]);
  }
  
  this.vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data.vertices), gl.STATIC_DRAW);
  
  this.indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data.indices), gl.STATIC_DRAW);
  
  this.indexSize = data.indices.length;
};

/* @FIXME in theory we could optimize draws by having seperate bind() and draw() calls. Might consider it in the future. */
Grid.prototype.draw = function(gl, shader) {
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
  if(shader.attributes.position) { gl.vertexAttribPointer(shader.attributes.position.location, 2, gl.FLOAT, false, 0, 0); }
  
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
  gl.drawElements(gl.LINES, this.indexSize, gl.UNSIGNED_SHORT, 0);
};