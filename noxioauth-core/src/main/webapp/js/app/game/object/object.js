"use strict";
/* global main */

/* Define GameObject class */
/* GameObject is an abstract class and should never actually be created. 
 * Javascript doesn't really have any equivalent to 'abstract' so I'm 
 * just going to remind you that if you instaniate this class I will
 * come find you, and make you pay.
 * 
 * This class contains all required basic object functions and is
 * a mirror of the Java class located in the NoxioGame project.
 */
function GameObject(oid, pos, vel) {
  this.oid = oid;
  this.pos = pos;
  this.vel = vel;
};

GameObject.prototype.setPos = function(pos) {
  this.pos = pos;
};

GameObject.prototype.setVel = function(vel) {
  this.vel = vel;
};

GameObject.prototype.draw = function() {
  /* NO. */
};