"use strict";
/* global main */
/* global util */
/* global GameObject */
/* global PointLight */
/* global ParticleBlip */
/* global ParticleDash */
/* global ParticleStun */

/* Define Player Object Class */
function PlayerObject(game, oid, pos, vel) {
  GameObject.call(this, game, oid, pos, vel);
  
  this.model = this.game.display.getModel("model.multi.smallBox");
  this.material = this.game.display.getMaterial("material.multi.default");
  
  this.MAX_SPEED = 0.025;        // Max movement speed
  this.FRICTION = 0.88;          // Friction Scalar
  
  this.look = {x: 0.0, y: 1.0};  // Normalized direction player is facing
  this.speed = 0.0;              // Current scalar of max movement speed <0.0 to 1.0>
  
  this.BLIP_COOLDOWN_MAX = 30;
  this.DASH_COOLDOWN_ADD = 30;
  this.DASH_COOLDOWN_MAX = 60;
  this.blipCooldown = 0;
  this.dashCooldown = 0;
  
  this.blipEffect = new Effect([ /* @FIXME Sound breaking format... */
    {type: "light", class: PointLight, params: ["<vec3 pos>", {r: 0.45, g: 0.5, b: 1.0, a: 1.0}, 3.0], update: function(lit){}, attachment: true, delay: 0, length: 3},
    {type: "light", class: PointLight, params: ["<vec3 pos>", {r: 0.45, g: 0.5, b: 1.0, a: 1.0}, 3.0], update: function(lit){lit.color.a -= 1.0/12.0; lit.rad += 0.1; }, attachment: true, delay: 3, length: 12},
    {type: "sound", class: this.game.sound, func: this.game.sound.getWorldSound, params: ["prank/blip.wav", 0.4], update: function(snd){}, attachment: true, delay: 0, length: 33},
    {type: "particle", class: ParticleBlip, params: [this.game, "<vec3 pos>", "<vec3 dir>"], update: function(prt){}, attachment: true, delay: 0, length: 33}
  ]);
  
  this.dashEffect = new Effect([ /* @FIXME Sound breaking format... */
    {type: "sound", class: this.game.sound, func: this.game.sound.getWorldSound, params: ["prank/ata.wav", 0.8], update: function(snd){}, attachment: true, delay: 0, length: 33},
    {type: "light", class: PointLight, params: ["<vec3 pos>", {r: 0.45, g: 0.5, b: 1.0, a: 0.75}, 2.5], update: function(lit){lit.color.a -= 1.0/45.0; lit.rad += 0.05; }, attachment: false, delay: 0, length: 30},
    {type: "particle", class: ParticleDash, params: [this.game, "<vec3 pos>", "<vec3 dir>"], update: function(prt){}, attachment: true, delay: 0, length: 60}
  ]);
  
  this.tauntEffect = new Effect([ /* @FIXME Sound breaking format... */
    {type: "sound", class: this.game.sound, func: this.game.sound.getWorldSound, params: ["prank/cumown.wav", 0.6], update: function(snd){}, attachment: true, delay: 0, length: 33}
  ]);
  
  this.stunEffect = new Effect([ /* @FIXME Sound breaking format... */
    {type: "sound", class: this.game.sound, func: this.game.sound.getWorldSound, params: ["prank/uheh.wav", 0.8], update: function(snd){}, attachment: true, delay: 0, length: 33},
    {type: "particle", class: ParticleStun, params: [this.game, "<vec3 pos>", "<vec3 dir>"], update: function(prt){}, attachment: true, delay: 0, length: 45}
  ]);
  
  this.deathEffect = new Effect([ /* @FIXME Sound breaking format... */
    {type: "sound", class: this.game.sound, func: this.game.sound.getWorldSound, params: ["prank/oowaa.wav", 0.8], update: function(snd){}, attachment: true, delay: 0, length: 99}
  ]);
};

PlayerObject.prototype.update = function(data) {
  var pos = util.vec2.parse(data.shift());
  var vel = util.vec2.parse(data.shift());
  var look = util.vec2.parse(data.shift());
  var speed = parseFloat(data.shift());
  var effects = data.shift().split(",");
  
  this.setPos(pos);
  this.setVel(vel);
  this.setLook(look);
  this.setSpeed(speed);
  for(var i=0;i<effects.length-1;i++) {
    switch(effects[i]) {
      case "blip" : { this.blip(); break; }
      case "dash" : { this.dash(); break; }
      case "taunt" : { this.taunt(); break; }
      case "stun" : { this.stun(); break; }
      default : { break; }
    }
  }
  
  if(this.blipCooldown > 0) { this.blipCooldown--; }
  if(this.dashCooldown > 0) { this.dashCooldown--; }
};

PlayerObject.prototype.step = function(delta) {
  var curmove = util.vec2.add(this.vel, util.vec2.scale(this.look, this.MAX_SPEED*this.speed));
  var nxtpos = util.vec2.add(this.pos, curmove);
  var nxtvel = util.vec2.scale(curmove, this.FRICTION);
  
  this.pos = util.vec2.lerp(this.pos, nxtpos, delta);
  this.vel = util.vec2.lerp(this.vel, nxtvel, delta);
  
  this.blipEffect.step(util.vec2.toVec3(this.pos, 0.5), util.vec2.toVec3(this.vel, 0.0));
  this.dashEffect.step(util.vec2.toVec3(this.pos, 0.5), util.vec2.toVec3(this.vel, 0.0));
  this.tauntEffect.step(util.vec2.toVec3(this.pos, 0.5), util.vec2.toVec3(this.vel, 0.0));
  this.stunEffect.step(util.vec2.toVec3(this.pos, 0.75), util.vec2.toVec3(this.vel, 0.0));
};

/* @FIXME DEBUG GAMEPLAY TEST */
PlayerObject.prototype.blip = function() {
  this.blipEffect.trigger(util.vec2.toVec3(this.pos, 0.5), util.vec2.toVec3(this.vel, 0.0));
  this.blipCooldown = this.BLIP_COOLDOWN_MAX;
};

/* @FIXME DEBUG GAMEPLAY TEST */
PlayerObject.prototype.dash = function() {
  this.dashEffect.trigger(util.vec2.toVec3(this.pos, 0.5), util.vec2.toVec3(this.vel, 0.0));
  this.dashCooldown += this.DASH_COOLDOWN_ADD;
};

/* @FIXME DEBUG GAMEPLAY TEST */
PlayerObject.prototype.taunt = function() {
  this.tauntEffect.trigger(util.vec2.toVec3(this.pos, 0.5), util.vec2.toVec3(this.vel, 0.0));
};

/* @FIXME DEBUG GAMEPLAY TEST */
PlayerObject.prototype.stun = function() {
  this.stunEffect.trigger(util.vec2.toVec3(this.pos, 0.75), util.vec2.toVec3(this.vel, 0.0));
};

PlayerObject.prototype.setPos = GameObject.prototype.setPos;
PlayerObject.prototype.setVel = GameObject.prototype.setVel;

PlayerObject.prototype.setLook = function(look) {
  this.look = look;
};

PlayerObject.prototype.setSpeed = function(speed) {
  this.speed = speed;
};

PlayerObject.prototype.getDraw = function(geometry, lights, bounds) {
  if(util.intersection.pointPoly(this.pos, bounds)) {
    var playerUniformData = [
      {name: "transform", data: [this.pos.x, this.pos.y, 0.0]}
    ];
    geometry.push({model: this.model, material: this.material, uniforms: playerUniformData});
    this.blipEffect.getDraw(geometry, lights, bounds);
    this.dashEffect.getDraw(geometry, lights, bounds);
    this.tauntEffect.getDraw(geometry, lights, bounds);
    this.stunEffect.getDraw(geometry, lights, bounds);
  }
};

PlayerObject.prototype.destroy = function() {
  this.blipEffect.destroy();
  this.dashEffect.destroy();
  this.tauntEffect.destroy();
  this.stunEffect.destroy();
  
  this.deathEffect.trigger(util.vec2.toVec3(this.pos, 0.5), util.vec2.toVec3(this.vel, 0.0));
};

PlayerObject.prototype.getType = function() {
  return "obj.player";
};