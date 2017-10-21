"use strict";
/* global main */
/* global util */
/* global GameObject */
/* global Decal */

/* Define PlayerObject class */
/* PlayerObject is an abstract class and should never actually be created. 
 * Javascript doesn't really have any equivalent to 'abstract' so I'm 
 * just going to remind you that if you instaniate this class I will
 * come find you irl.
 * 
 * This class contains all required base settings and prototype functions
 * that a player object needs. These can (and should) be overidden in most cases.
 * The only thing that the PlayerObject constructor does not default is the 
 * model & material. Be sure you set them in the subclass.
 */
function PlayerObject(game, oid, pos, vel) {
  GameObject.call(this, game, oid, pos, vel);
  
  this.look = {x: 0.0, y: 1.0};  // Normalized direction player is facing
  this.speed = 0.0;              // Current scalar of max movement speed <0.0 to 1.0>
  this.effects = [];
  
  /* Settings */
  this.radius = 0.5; this.weight = 1.0; this.friction = 0.725;
  this.moveSpeed = 0.0375; this.jumpHeight = 0.175; this.cullRadius = 1.0;
  this.fatalImpactSpeed = 0.175;
  
  /* State */
  this.team = -1;

  /* Timers */

  /* Effects */
  this.targetCircle = new Decal(this.game, this.game.display.getMaterial("character.player.decal.targetcircle"), util.vec2.toVec3(this.pos, Math.min(this.height, 0.0)), util.vec3.make(0.0, 0.0, 1.0), 1.1, 0.0);
};

PlayerObject.prototype.update = function(data) {
  /* Apply update data to game */
  var team = parseInt(data.shift());
  var pos = util.vec2.parse(data.shift());
  var vel = util.vec2.parse(data.shift());
  var height = parseFloat(data.shift());
  var vspeed = parseFloat(data.shift());  
  var look = util.vec2.parse(data.shift());
  var speed = parseFloat(data.shift());
  var name = data.shift();
  var effects = data.shift().split(",");
  
  this.team = team;
  this.setPos(pos);
  this.setVel(vel);
  this.setHeight(height, vspeed);
  this.setLook(look);
  this.setSpeed(speed);
  this.name = !name ? undefined : name; 
  for(var i=0;i<effects.length-1;i++) {
    switch(effects[i]) {
      case "jmp" : { this.jump(); break; }
      case "stn" : { this.stun(); break; }
      default : { break; }
    }
  }
  
  /* Step Effects */
  this.targetCircle.move(util.vec2.toVec3(this.pos, Math.min(this.height, 0.0)), 1.1);
};

PlayerObject.prototype.jump = function() {
  this.jumpEffect.trigger(util.vec2.toVec3(this.pos, 0.5+this.height), util.vec2.toVec3(this.vel, 0.0));
};

PlayerObject.prototype.stun = function() {
  this.stunEffect.trigger(util.vec2.toVec3(this.pos, 0.75+this.height), util.vec2.toVec3(this.vel, 0.0));
};

PlayerObject.prototype.setPos = GameObject.prototype.setPos;
PlayerObject.prototype.setVel = GameObject.prototype.setVel;
PlayerObject.prototype.setHeight = GameObject.prototype.setHeight;

PlayerObject.prototype.setLook = function(look) {
  this.look = look;
};

PlayerObject.prototype.setSpeed = function(speed) {
  this.speed = speed;
};

PlayerObject.prototype.getDraw = function(geometry, decals, lights, bounds) {
  var exbounds = util.matrix.expandPolygon(bounds, this.cullRadius);
  if(util.intersection.pointPoly(this.pos, exbounds)) {
    var playerUniformData = [
      {name: "transform", data: [this.pos.x, this.pos.y, this.height]}
    ];
    geometry.push({model: this.model, material: this.team===0?this.material[1]:this.team===1?this.material[2]:this.material[0], uniforms: playerUniformData});
    for(var i=0;i<this.effects.length;i++) {
      this.effects[i].getDraw(geometry, decals, lights, bounds);
    }
    this.targetCircle.getDraw(decals, bounds);
  }
};

PlayerObject.prototype.destroy = function() {
  for(var i=0;i<this.effects.length;i++) {
    this.effects[i].destroy();
  }
};

PlayerObject.prototype.getType = function() {
  return "obj.player";
};