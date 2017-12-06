"use strict";
/* global main */
/* global util */
/* global GameObject */
/* global PlayerObject */
/* global PointLight */
/* global ParticleStun */
/* global ParticleAirJump */
/* global ParticleBloodSplat */
/* global Decal */

/* Define PlayerPuff Class */
function PlayerPuff(game, oid, pos, vel) {
  PlayerObject.call(this, game, oid, pos, vel);
  
  this.model = this.game.display.getModel("multi.smallBox");
  this.material = this.game.display.getMaterial("character.puff.puff");
  this.icon = this.game.display.getMaterial("character.puff.ui.iconlarge");
  
  /* Constants */
  this.REST_SLEEP_LENGTH = 99;
  this.POUND_COOLDOWN_LENGTH = 30;
  
  this.POUND_RADIUS = 0.45;
  this.POUND_OFFSET = 0.33;
  
  /* Settings */
  this.radius = 0.5; this.weight = 1.0; this.friction = 0.725;
  this.moveSpeed = 0.0375; this.jumpHeight = 0.175; this.cullRadius = 1.0;
  this.fatalImpactSpeed = 0.175;
  
  /* State */
  this.poundDirection = util.vec2.make(1, 0);

  /* Timers */
  this.restCooldown = 0;
  this.poundCooldown = 0;

  /* Effects */
  this.restEffect = new Effect([
    {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: ["character/puff/rest0.wav", 0.5], update: function(snd){}, attachment: true, delay: 0, length: 33},
    {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: ["character/puff/rest1.wav", 0.5], update: function(snd){}, attachment: true, delay: 99, length: 33}
  ], false);
  
  this.restHitEffect = new Effect([
    {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: ["character/puff/rest2.wav", 1.0], update: function(snd){}, attachment: true, delay: 0, length: 33}
  ], false);
  
  this.poundEffect = new Effect([
    {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: ["character/puff/pound0.wav", 0.5], update: function(snd){}, attachment: true, delay: 0, length: 33}
  ], false);
  
  this.poundHitEffect = new Effect([
    {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: ["character/puff/pound1.wav", 1.0], update: function(snd){}, attachment: true, delay: 0, length: 33}
  ], false);
  
  this.tauntEffect = new Effect([
    {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: [["character/puff/taunt0.wav", "character/puff/taunt1.wav"], 0.5], update: function(snd){}, attachment: true, delay: 0, length: 33}
  ], false);
  
  this.jumpEffect = new Effect([
    {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: ["character/puff/jump0.wav", 0.3], update: function(snd){}, attachment: true, delay: 0, length: 33}
  ], false);
  
  this.stunEffect = new Effect([
    {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: [["character/puff/hit0.wav", "character/puff/hit1.wav"], 0.8], update: function(snd){}, attachment: true, delay: 0, length: 33},
    {type: "particle", class: ParticleStun, params: [this.game, "<vec3 pos>", "<vec3 vel>"], update: function(prt){}, attachment: true, delay: 0, length: 45}
  ], false);
  
  this.airEffect = new Effect([
    {type: "particle", class: ParticleAirJump, params: [this.game, "<vec3 pos>", "<vec3 vel>"], update: function(prt){}, attachment: false, delay: 0, length: 30}
  ], false);
  
  this.bloodEffect = new Effect([
    {type: "particle", class: ParticleBloodSplat, params: [this.game, "<vec3 pos>", "<vec3 vel>"], update: function(prt){}, attachment: true, delay: 0, length: 300},
    {type: "decal", class: Decal, params: [this.game, this.game.display.getMaterial("character.player.decal.bloodsplat"), "<vec3 pos>", util.vec3.make(0.0, 0.0, 1.0), 1.5, Math.random()*6.28319], update: function(dcl){}, attachment: false, delay: 0, length: 300}
  ], false);
  
  this.impactDeathEffect = new Effect([
    {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: ["character/puff/death0.wav", 0.5], update: function(snd){}, attachment: true, delay: 0, length: 60}
  ], false);
  
  this.fallDeathEffect = new Effect([
    {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: ["character/puff/death1.wav", 0.5], update: function(snd){}, attachment: true, delay: 0, length: 99}
  ], false);
  
  this.effects.push(this.restEffect); this.effects.push(this.restHitEffect); this.effects.push(this.poundEffect); this.effects.push(this.poundHitEffect); this.effects.push(this.tauntEffect); this.effects.push(this.jumpEffect); this.effects.push(this.airEffect);
  this.effects.push(this.stunEffect); this.effects.push(this.bloodEffect); this.effects.push(this.impactDeathEffect); this.effects.push(this.fallDeathEffect);
  
  /* UI */
  this.uiMeters = [
    {type: "bar", iconMat: this.game.display.getMaterial("character.puff.ui.meterrest"), length: 16, scalar: 1.0},
    {type: "bar", iconMat: this.game.display.getMaterial("character.puff.ui.meterpound"), length: 14, scalar: 1.0}
  ];
  
  /* Visual Hitboxes */
  this.hitboxModel = this.game.display.getModel("multi.hitbox.circle");
};

PlayerPuff.prototype.update = function(data) {
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
      case "air" : { this.air(); break; } 
      case "jmp" : { this.jump(); break; }
      case "atk" : { this.rest(); break; }
      case "hta" : { this.restHit(); break; }
      case "mov" : { this.poundChannel(); break; }
      case "pnd" : { this.poundDash(); break; }
      case "pnh" : { this.pound(); break; }
      case "htb" : { this.poundHit(); break; }
      case "tnt" : { this.taunt(); break; }
      case "stn" : { this.stun(); break; }
      default : { break; }
    }
  }
  
  /* Update Timers */
  if(this.restCooldown > 0) { this.restCooldown--; }
  if(this.poundCooldown > 0) { this.poundCooldown--; }
  
  /* Step Effects */
  var angle = (util.vec2.angle(util.vec2.make(1, 0), this.look)*(this.look.y>0?-1:1))+(Math.PI*0.5);
  this.targetCircle.move(util.vec2.toVec3(this.pos, Math.min(this.height, 0.0)), 1.1, angle);
  this.restEffect.step(util.vec2.toVec3(this.pos, 0.25+this.height), util.vec2.toVec3(this.vel, 0.0));
  this.restHitEffect.step(util.vec2.toVec3(this.pos, 0.25+this.height), util.vec2.toVec3(this.vel, 0.0));
  this.poundEffect.step(util.vec2.toVec3(this.pos, 0.25+this.height), util.vec2.toVec3(this.vel, 0.0));
  this.poundHitEffect.step(util.vec2.toVec3(this.pos, 0.25+this.height), util.vec2.toVec3(this.vel, 0.0));
  this.airEffect.step();
  this.jumpEffect.step(util.vec2.toVec3(this.pos, 0.25+this.height), util.vec2.toVec3(this.vel, 0.0));
  this.tauntEffect.step(util.vec2.toVec3(this.pos, 0.25+this.height), util.vec2.toVec3(this.vel, 0.0));
  this.stunEffect.step(util.vec2.toVec3(this.pos, 0.75+this.height), util.vec2.toVec3(this.vel, 0.0));
  this.bloodEffect.step(util.vec2.toVec3(this.pos, 0.0+this.height), util.vec2.toVec3(this.vel, 0.0));
  
  /* Update UI */
  this.uiMeters[0].scalar = 1.0-(this.restCooldown/this.REST_SLEEP_LENGTH);
  this.uiMeters[1].scalar = 1.0-(this.poundCooldown/this.POUND_COOLDOWN_LENGTH);
};


PlayerPuff.prototype.air  = PlayerObject.prototype.air;
PlayerPuff.prototype.jump = PlayerObject.prototype.jump;
PlayerPuff.prototype.stun = function() {
  PlayerObject.prototype.stun.call(this);
  this.restCooldown = 0;
};

PlayerPuff.prototype.rest = function() {
  this.restEffect.trigger(util.vec2.toVec3(this.pos, 0.25+this.height), util.vec2.toVec3(this.vel, 0.0));
  this.restCooldown = this.REST_SLEEP_LENGTH;
  this.hitboxPos = this.pos;
  this.hitboxColor = util.vec4.make(1, 0, 0, 0.5);
  this.hitboxScale = this.radius;
  this.hitBoxAngle = 0;
  this.drawHitbox = this.hitboxModel;
};

PlayerPuff.prototype.restHit = function() {
  this.restHitEffect.trigger(util.vec2.toVec3(this.pos, 0.25+this.height), util.vec2.toVec3(this.vel, 0.0));
};

PlayerPuff.prototype.poundChannel = function() {
  this.poundCooldown = this.POUND_COOLDOWN_LENGTH;
};

PlayerPuff.prototype.poundDash = function() {
  this.poundEffect.trigger(util.vec2.toVec3(this.pos, 0.25+this.height), util.vec2.toVec3(this.vel, 0.0));
  this.poundDirection = this.look;
};

PlayerPuff.prototype.pound = function() {
  this.hitboxPos = util.vec2.add(this.pos, util.vec2.scale(this.poundDirection, this.POUND_OFFSET));
  this.hitboxColor = util.vec4.make(1, 0, 0, 0.5);
  this.hitboxScale = this.POUND_RADIUS;
  this.hitBoxAngle = 0;
  this.drawHitbox = this.hitboxModel;
};

PlayerPuff.prototype.poundHit = function() {
  this.poundHitEffect.trigger(util.vec2.toVec3(this.pos, 0.25+this.height), util.vec2.toVec3(this.vel, 0.0));
};

PlayerPuff.prototype.taunt = function() {
  this.tauntEffect.trigger(util.vec2.toVec3(this.pos, 0.25+this.height), util.vec2.toVec3(this.vel, 0.0));
};

PlayerPuff.prototype.setPos = PlayerObject.prototype.setPos;
PlayerPuff.prototype.setVel = PlayerObject.prototype.setVel;
PlayerPuff.prototype.setHeight = PlayerObject.prototype.setHeight;

PlayerPuff.prototype.setLook = PlayerObject.prototype.setLook;
PlayerPuff.prototype.setSpeed = PlayerObject.prototype.setSpeed;
PlayerPuff.prototype.getDraw = PlayerObject.prototype.getDraw;

PlayerPuff.prototype.destroy = function() {
  for(var i=0;i<this.effects.length;i++) {
    this.effects[i].destroy();
  }
  if(this.height > -1.0) {
    this.bloodEffect.trigger(util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, 0.0));
    this.impactDeathEffect.trigger(util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, 0.0));
  }
  else { this.fallDeathEffect.trigger(util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, 0.0)); }
};

PlayerPuff.prototype.getType = function() {
  return "obj.player.puff";
};