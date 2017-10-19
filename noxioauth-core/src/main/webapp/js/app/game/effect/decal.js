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
  
  this.geometry = this.game.map.getGeometryNear(this.pos, this.size);
}

Decal.prototype.move = function(pos, size) {
  this.pos = pos; this.size = 1.0/size;
  this.geometry = this.game.map.getGeometryNear(this.pos, this.size);
};

Decal.prototype.getDraw = function(decals, bounds) {
  decals.push({geometry: this.geometry, material: this.material, pos: this.pos, normal: this.normal, size: this.size, angle: this.angle});
};