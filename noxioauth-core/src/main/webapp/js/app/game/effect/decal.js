"use strict";
/* global main */
/* global util */

function Decal(game, material, pos, angle) {
  this.game = game;
  
  this.material = material;
  this.pos = pos;
  this.angle = angle;
}

Decal.prototype.getDraw = function(decals) {
  decals.push({material: this.material, pos: this.pos, angle: this.angle});
};