"use strict";
/* global main */
/* global util */

function Decal(game, material, pos, normal, size, angle, color, fin, length, fout) {
  this.game = game;
  
  this.material = game.display.getMaterial(material);
  this.pos = pos;
  this.normal = normal;
  this.size = 1.0/size;
  this.angle = angle;
  this.color = color;
  
  this.age = 0;
  this.fade = 1;
  this.fin = fin;
  this.length = length;
  this.fout = fout;
  
  this.geometry = this.game.map.getGeometryNear(this.pos, this.size);
}

Decal.prototype.step = function(pos, size, angle) {
  if(pos || size || angle) { this.move(pos?pos:this.pos, size?size:this.size, angle?angle:this.angle); }
  if(this.fin > this.age) {
    this.fade = this.age/this.fin;
  }
  else if(this.age-this.length+this.fout > 0 && this.length !== 0) {
    this.fade = 1-((this.age-this.length+this.fout)/this.fout);
  }
  else {
    this.fade = 1;
  }
  this.age++;
};

Decal.prototype.move = function(pos, size, angle) {
  this.pos = pos; this.size = 1.0/size;
  this.geometry = this.game.map.getGeometryNear(this.pos, this.size);
  this.angle = angle;
};

Decal.prototype.setColor = function(color) { this.color = color; };

Decal.prototype.getDraw = function(decals, bounds) {
  decals.push({geometry: this.geometry, material: this.material, pos: this.pos, normal: this.normal, size: this.size, angle: this.angle, color: util.vec4.copy3(this.color, this.color.w*this.fade)});
};

Decal.prototype.active = function() {
  return this.age <= this.length || this.length === 0;
};

/* Used by EffectDefinition.js */
Decal.fxId = "decal";