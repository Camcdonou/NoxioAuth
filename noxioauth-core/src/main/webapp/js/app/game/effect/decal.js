"use strict";
/* global main */
/* global util */

function Decal(game, material, pos, normal, size, angle) {
  this.game = game;
  
  this.material = material;
  this.pos = pos;
  this.normal = normal;
  this.size = 1.0/size;
  this.angle = angle;
  
  this.color = util.vec4.make(1,1,1,1);
  
  this.geometry = this.game.map.getGeometryNear(this.pos, this.size);
}

Decal.prototype.move = function(pos, size, angle) {
  this.pos = pos; this.size = 1.0/size;
  this.geometry = this.game.map.getGeometryNear(this.pos, this.size);
  this.angle = angle;
};

Decal.prototype.getDraw = function(decals, bounds) {
  decals.push({geometry: this.geometry, material: this.material, pos: this.pos, normal: this.normal, size: this.size, angle: this.angle, color: this.color});
};

function ColorDecal(game, material, pos, normal, size, angle, color) {
  Decal.call(this, game, material, pos, normal, size, angle);
  
  this.color = color;
}

ColorDecal.prototype.move = Decal.prototype.move;

ColorDecal.prototype.setColor = function(color) { this.color = color; };

ColorDecal.prototype.getDraw = Decal.prototype.getDraw;