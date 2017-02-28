"use strict";
/* global main */
/* global util */
/* global GameObject */

/* Define Player Object Class */
function PlayerObject(game, oid, pos, vel) {
  this.game = game;
  
  this.oid = oid;
  this.pos = pos;
  this.vel = vel;
  
  this.model = this.game.display.getModel("model.multi.box");
  this.material = this.game.display.getMaterial("material.multi.default");
};

PlayerObject.prototype.setPos = GameObject.prototype.setPos;
PlayerObject.prototype.setVel = GameObject.prototype.setVel;

PlayerObject.prototype.update = function(data) {
  var pos = util.vec2.parse(data.shift());
  var vel = util.vec2.parse(data.shift());
  
  this.setPos(pos);
  this.setVel(vel);
};

PlayerObject.prototype.getDraw = function(geometry, camera) {
  if(util.vec2.distance(this.pos, {x: -camera.pos.x, y: -camera.pos.y}) < 8.0) {
    var pos = {x: this.pos.x, y: this.pos.y, z: 0.0}; /* To Vec3 */
    geometry.push({model: this.model, material: this.material, pos: pos, rot: {x: 0.0, y: 0.0, z: 0.0, w: 1.0}});
  }
};