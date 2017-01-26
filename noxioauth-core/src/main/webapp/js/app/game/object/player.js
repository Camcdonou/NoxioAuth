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

PlayerObject.prototype.draw = function(context) {
      var r = 10;

      context.beginPath();
      context.arc(this.pos.x, this.pos.y, r, 0, 2 * Math.PI, false);
      context.fillStyle = '#FFFFFF';
      context.fill();
      context.lineWidth = 10;
      context.strokeStyle = 'rgba(255, 255, 255, 0.33)';
      context.stroke();
};