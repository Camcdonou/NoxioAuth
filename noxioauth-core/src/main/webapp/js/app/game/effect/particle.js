"use strict";
/* global main */
/* global util */
/* global Function */

/* Define Particle Abstract Class */
function Particle(game, pos) {
  this.game = game;
  this.pos = pos;
  
  this.model = this.game.display.getModel("model.multi.square");
  this.material = this.game.display.getMaterial("material.prank.blip");
}

Particle.prototype.step = function(pos, dir) {
  this.pos = pos;
};

Particle.prototype.getDraw = function(geometry, lights, bounds) {
    var pos = {x: this.pos.x, y: this.pos.y, z: 1.0}; /* To Vec3 */ /* @FIXME SCALE */
    geometry.push({model: this.model, material: this.material, pos: pos, rot: util.quat.create()});
};