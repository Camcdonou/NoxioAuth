"use strict";
/* global main */
/* global GameObject */

/* Define Player Object Class */
function PlayerObject(oid, pos, vel) {
  this.oid = oid;
  this.pos = pos;
  this.vel = vel;
};

PlayerObject.prototype.setPos = GameObject.prototype.setPos;
PlayerObject.prototype.setVel = GameObject.prototype.setVel;

PlayerObject.prototype.draw = function() {
  
};