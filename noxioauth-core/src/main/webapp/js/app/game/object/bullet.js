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

BulletObject.prototype.draw = function() {
  
};