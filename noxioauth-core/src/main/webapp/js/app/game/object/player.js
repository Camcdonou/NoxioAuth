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
      var shineR = 50;

      context.beginPath();
      context.arc(this.pos.x, this.pos.y, r, 0, 2 * Math.PI, false);
      context.fillStyle = '#FFFFFF';
      context.fill();
      context.lineWidth = 10;
      context.strokeStyle = 'rgba(255, 255, 255, 0.33)';
      context.stroke();
      
      if(this.shineCooldown > 0) {
        context.beginPath();
        context.arc(this.pos.x, this.pos.y, shineR*((5-this.shineCooldown)/5), 0, 2 * Math.PI, false);
        context.fillStyle = 'rgba(255, 255, 255, 0.0)';
        context.fill();
        context.lineWidth = 10;
        context.strokeStyle = 'rgba(255, 255, 255, 0.33)';
        context.stroke();
        this.shineCooldown--;
      }
};