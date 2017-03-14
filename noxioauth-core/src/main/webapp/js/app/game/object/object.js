"use strict";
/* global main */
/* global util */

/* Define GameObject class */
/* GameObject is an abstract class and should never actually be created. 
 * Javascript doesn't really have any equivalent to 'abstract' so I'm 
 * just going to remind you that if you instaniate this class I will
 * come find you irl.
 * 
 * This class contains all required basic object functions and is
 * a mirror of the Java class located in the NoxioGame project.
 * Be sure to override or inherit all functions here!
 */
function GameObject(game, oid, pos, vel) {
  this.game = game;
  
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

GameObject.prototype.update = function(data) {
  var pos = util.vec2.parse(data.shift());
  var vel = util.vec2.parse(data.shift());
  
  this.setPos(pos);
  this.setVel(vel);
};

GameObject.prototype.getDraw = function(geometry, lights, bounds) {
  /* NO. */
};