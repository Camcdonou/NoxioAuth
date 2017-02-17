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

Texture.prototype.enable = function(gl, location) {
  switch(location) {
    case 0 : { gl.activeTexture(gl.TEXTURE0); break; }
    case 1 : { gl.activeTexture(gl.TEXTURE1); break; }
    case 2 : { gl.activeTexture(gl.TEXTURE2); break; }
    case 3 : { gl.activeTexture(gl.TEXTURE3); break; }
    case 4 : { gl.activeTexture(gl.TEXTURE4); break; }
    default : { /* @FIXME major error! */ return; }
  }
  gl.bindTexture(gl.TEXTURE_2D, this.glTexture);
};

Texture.prototype.disable = function(gl, location) {
  switch(location) {
    case 0 : { gl.activeTexture(gl.TEXTURE0); break; }
    case 1 : { gl.activeTexture(gl.TEXTURE1); break; }
    case 2 : { gl.activeTexture(gl.TEXTURE2); break; }
    case 3 : { gl.activeTexture(gl.TEXTURE3); break; }
    case 4 : { gl.activeTexture(gl.TEXTURE4); break; }
    default : { /* @FIXME major error! */ return; }
  }
  gl.bindTexture(gl.TEXTURE_2D, null);
};

Texture.prototype.handleTextureLoaded = function(gl) {
  gl.bindTexture(gl.TEXTURE_2D, this.glTexture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.img);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.bindTexture(gl.TEXTURE_2D, null);
};