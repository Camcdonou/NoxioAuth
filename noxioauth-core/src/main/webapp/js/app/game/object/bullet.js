"use strict";
/* global main */
/* global GameObject */

/* Define Bullet Object Class */
function BulletObject(oid, pos, vel) {
  this.oid = oid;
  this.pos = pos;
  this.vel = vel;
};

BulletObject.prototype.setPos = GameObject.prototype.setPos;
BulletObject.prototype.setVel = GameObject.prototype.setVel;

BulletObject.prototype.draw = function(context) {
      var r = 5;

      context.beginPath();
      context.arc(this.pos.x, this.pos.y, r, 0, 2 * Math.PI, false);
      context.fillStyle = 'rgba(255, 255, 255, 0.00)';
      context.fill();
      context.lineWidth = 5;
      context.strokeStyle = 'rgba(255, 255, 255, 0.33)';
      context.stroke();
};