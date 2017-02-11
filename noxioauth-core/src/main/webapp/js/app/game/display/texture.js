"use strict";
/* global main */

/* Define Texture Class */
function Texture(gl, glTexture, path) {
  var tmp = this; /* I FUCKING HATE JAVASCRIPT SCOPES */
  this.glTexture = glTexture;
  this.path = path;
  this.img = new Image();
  this.img.onload = function() { tmp.handleTextureLoaded(gl); };
  this.img.src = this.path;
}

Texture.prototype.bind = function(gl) {
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, this.glTexture);
  //gl.uniform1i(gl.getUniformLocation(shaderProgram, "texture"), 0); /* @FIXME stubby */
};

Texture.prototype.handleTextureLoaded = function(gl) {
  console.log("handleTextureLoaded, image = " + this.img);
  gl.bindTexture(gl.TEXTURE_2D, this.glTexture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.img);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.bindTexture(gl.TEXTURE_2D, null);
};