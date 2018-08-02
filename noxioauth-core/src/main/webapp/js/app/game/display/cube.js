"use strict";
/* global main */

/* Define TextureCube Classes */
function TextureCube(gl, glTexture, path) {
  var tmp = this; /* I FUCKING HATE JAVASCRIPT SCOPES */
  this.glTexture = glTexture;
  this.path = path[0]; // path to first texture of the cubemap, this is used to id it
  this.ready = false;
  
  this.loadCount = 0;
  this.img = [];

  for(var i=0;i<6;i++) {
    var ni = new Image();
    ni.onload = function() { tmp.handleTextureLoaded(gl); tmp.ready = true; };
    ni.src = "img/game/" + path[i] + ".png";
    this.img.push(ni);
  }
}

/* Texture location usage:
   0, 1, 2, 3, 4 - Free to use for general shading (diffuse/specular/glow/etc)
   5 - Shadow depth texture
   6 - World FBO render texture
   7 - UI FBO render texture
   8 - Cubemap
   9 - Unused
 */

TextureCube.prototype.enable = function(gl) {
  gl.activeTexture(gl.TEXTURE8);
  gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.glTexture);
};

TextureCube.prototype.disable = function(gl) {
  gl.activeTexture(gl.TEXTURE8);
  gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
};

TextureCube.prototype.handleTextureLoaded = function(gl) {
  if(++this.loadCount < 6) { return; }

  gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.glTexture);

  for (var i = 0; i < 6; i++) {
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.img[i]);
  }

  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
};