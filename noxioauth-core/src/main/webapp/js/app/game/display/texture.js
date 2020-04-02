"use strict";
/* global main */

/* Define Texture & RenderTexture Classes */
function Texture(gl, glTexture, path) {
  var tmp = this; /* I FUCKING HATE JAVASCRIPT SCOPES */
  this.glTexture = glTexture;
  this.path = path;
  this.ready = false;
  
  this.img = new Image();
  this.img.onload = function() { tmp.handleTextureLoaded(gl); tmp.ready = true; };
  this.img.src = "img/game/" + this.path + ".png?v=_" + _VER() + "_";
}

/* Texture location usage:
   0, 1, 2, 3, 4 - Free to use for general shading (diffuse/specular/glow/etc)
   5 - Shadow depth texture
   6 - World FBO render texture
   7 - UI FBO render texture
   8 - Cubemap
   9 - Unused
 */

Texture.prototype.enable = function(gl, location) {
  switch(location) {
    case 0 : { gl.activeTexture(gl.TEXTURE0); break; }
    case 1 : { gl.activeTexture(gl.TEXTURE1); break; }
    case 2 : { gl.activeTexture(gl.TEXTURE2); break; }
    case 3 : { gl.activeTexture(gl.TEXTURE3); break; }
    case 4 : { gl.activeTexture(gl.TEXTURE4); break; }
    case 5 : { gl.activeTexture(gl.TEXTURE5); break; }
    case 6 : { gl.activeTexture(gl.TEXTURE6); break; }
    case 7 : { gl.activeTexture(gl.TEXTURE7); break; }
    case 8 : { gl.activeTexture(gl.TEXTURE8); break; }
    case 9 : { gl.activeTexture(gl.TEXTURE9); break; }
    case 10 : { gl.activeTexture(gl.TEXTURE10); break; }
    case 11 : { gl.activeTexture(gl.TEXTURE11); break; }
    case 12 : { gl.activeTexture(gl.TEXTURE12); break; }
    case 13 : { gl.activeTexture(gl.TEXTURE13); break; }
    case 14 : { gl.activeTexture(gl.TEXTURE14); break; }
    case 15 : { gl.activeTexture(gl.TEXTURE15); break; }
    default : { main.menu.warning.show("Texture.enable() invalid texture location: " + location); return; }
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
    case 5 : { gl.activeTexture(gl.TEXTURE5); break; }
    case 6 : { gl.activeTexture(gl.TEXTURE6); break; }
    case 7 : { gl.activeTexture(gl.TEXTURE7); break; }
    case 8 : { gl.activeTexture(gl.TEXTURE8); break; }
    case 9 : { gl.activeTexture(gl.TEXTURE9); break; }
    case 10 : { gl.activeTexture(gl.TEXTURE10); break; }
    case 11 : { gl.activeTexture(gl.TEXTURE11); break; }
    case 12 : { gl.activeTexture(gl.TEXTURE12); break; }
    case 13 : { gl.activeTexture(gl.TEXTURE13); break; }
    case 14 : { gl.activeTexture(gl.TEXTURE14); break; }
    case 15 : { gl.activeTexture(gl.TEXTURE15); break; }
    default : { main.menu.warning.show("Texture.disable() invalid texture location: " + location); return; }
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

function RenderTexture(glTexture) {
  this.glTexture = glTexture;
  this.ready = true;
}

RenderTexture.prototype.enable = Texture.prototype.enable;

RenderTexture.prototype.disable = Texture.prototype.disable;