"use strict";
/* global main */
/* global util */
/* global GameObject */
/* global PlayerObject */
/* global PointLight */
/* global ParticleStun */
/* global ParticleSleep */
/* global Decal */

/* Define PlayerPuff Class */
function PlayerPuff(game, oid, pos, vel) {
  PlayerObject.call(this, game, oid, pos, vel);
  
  this.model = this.game.display.getModel("character.player.player");
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
  
  /* State */
  this.poundDirection = util.vec2.make(1, 0);

  /* Timers */
  this.restCooldown = 0;
  this.poundCooldown = 0;

  /* Effects */
  this.restEffect = {
    effect: new Effect([
      {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: ["character/puff/rest0.wav", 0.5], update: function(snd){}, attachment: true, delay: 0, length: 33},
      {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: ["character/puff/rest1.wav", 0.5], update: function(snd){}, attachment: true, delay: 99, length: 33},
      {type: "particle", class: ParticleSleep, params: [this.game, "<vec3 pos>", "<vec3 vel>"], update: function(prt){}, attachment: true, delay: 0, length: 100}
    ], false),
    offset: util.vec3.make(0.1,-0.2,0.55),
    trigger: PlayerObject.prototype.effectTrigger};
  this.effects.push(this.restEffect);
  
  this.restHitEffect = {
    effect: new Effect([
      {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: ["character/puff/rest2.wav", 1.0], update: function(snd){}, attachment: true, delay: 0, length: 33}
    ], false),
    offset: util.vec3.make(0,0,0.25),
    trigger: PlayerObject.prototype.effectTrigger};
  this.effects.push(this.restHitEffect);
  
  this.poundEffect = {
    effect: new Effect([
      {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: ["character/puff/pound0.wav", 0.4], update: function(snd){}, attachment: true, delay: 0, length: 33}
    ], false),
    offset: util.vec3.make(0,0,0.25),
    trigger: PlayerObject.prototype.effectTrigger};
  this.effects.push(this.poundEffect);
  
  this.poundHitEffect = {
    effect: new Effect([
      {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: ["character/puff/pound1.wav", 0.75], update: function(snd){}, attachment: true, delay: 0, length: 33}
    ], false),
    offset: util.vec3.make(0,0,0.25),
    trigger: PlayerObject.prototype.effectTrigger};
  this.effects.push(this.poundHitEffect);
  
  this.tauntEffect = {
    effect: new Effect([
      {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: [["character/puff/taunt0.wav", "character/puff/taunt1.wav"], 0.4], update: function(snd){}, attachment: true, delay: 0, length: 33}
    ], false),
    offset: util.vec3.make(0,0,0.25),
    trigger: PlayerObject.prototype.effectTrigger};
  this.effects.push(this.tauntEffect);
  
  this.jumpEffect = {
    effect: new Effect([
      {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: ["character/puff/jump0.wav", 0.15], update: function(snd){}, attachment: true, delay: 0, length: 33}
    ], false),
    offset: util.vec3.make(0,0,0.25),
    trigger: PlayerObject.prototype.effectTrigger};
  this.effects.push(this.jumpEffect);
  
  this.stunEffect = {
    effect: new Effect([
      {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: [["character/puff/hit0.wav", "character/puff/hit1.wav"], 0.45], update: function(snd){}, attachment: true, delay: 0, length: 33},
      {type: "particle", class: ParticleStun, params: [this.game, "<vec3 pos>", "<vec3 vel>"], update: function(prt){}, attachment: true, delay: 0, length: 45}
    ], false),
    offset: util.vec3.make(0,0,0.5),
    trigger: PlayerObject.prototype.effectTrigger};
  this.effects.push(this.stunEffect);
  
  this.impactDeathEffect = {
    effect: new Effect([
      {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: ["character/puff/death0.wav", 0.5], update: function(snd){}, attachment: true, delay: 0, length: 60}
    ], false),
    offset: util.vec3.make(0,0,0.25),
    trigger: PlayerObject.prototype.effectTrigger};
  this.effects.push(this.impactDeathEffect);
  
  this.fallDeathEffect = {
    effect: new Effect([
      {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: ["character/puff/death1.wav", 0.5], update: function(snd){}, attachment: true, delay: 0, length: 99}
    ], false),
    offset: util.vec3.make(0,0,0.25),
    trigger: PlayerObject.prototype.effectTrigger};
  this.effects.push(this.fallDeathEffect);
  
  /* UI */
  this.uiMeters = [
    {type: "bar", iconMat: this.game.display.getMaterial("character.puff.ui.meterrest"), length: 16, scalar: 1.0},
    {type: "bar", iconMat: this.game.display.getMaterial("character.puff.ui.meterpound"), length: 14, scalar: 1.0}
  ];
  
  /* Visual Hitboxes */
  this.hitboxModel = this.game.display.getModel("multi.hitbox.circle");
};

PlayerPuff.prototype.update = PlayerObject.prototype.update;
PlayerPuff.prototype.parseUpd = PlayerObject.prototype.parseUpd;

PlayerPuff.prototype.effectSwitch = function(e) {
  switch(e) {
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
    case "ult" : { this.ultimate = true; break; }
    default : { main.menu.warning.show("Invalid effect value: '" + e + "' @ Puff.js :: effectSwitch()"); break; }
  }
};

PlayerPuff.prototype.timers = function() {
  if(this.restCooldown > 0) { this.restCooldown--; }
  if(this.poundCooldown > 0) { this.poundCooldown--; }
};

PlayerPuff.prototype.ui = function() {
  this.uiMeters[0].scalar = 1.0-(this.restCooldown/this.REST_SLEEP_LENGTH);
  this.uiMeters[1].scalar = 1.0-(this.poundCooldown/this.POUND_COOLDOWN_LENGTH);
};

PlayerPuff.prototype.air  = PlayerObject.prototype.air;
PlayerPuff.prototype.jump = PlayerObject.prototype.jump;
PlayerPuff.prototype.stun = function() {
  PlayerObject.prototype.stun.call(this);
  this.restEffect.effect.destroy();
  this.restCooldown = 0;
};

PlayerPuff.prototype.rest = function() {
  this.restEffect.trigger(util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed));
  this.restCooldown = this.REST_SLEEP_LENGTH;
  this.hitboxPos = this.pos;
  this.hitboxColor = util.vec4.make(1, 0, 0, 0.5);
  this.hitboxScale = this.radius;
  this.hitBoxAngle = 0;
  this.drawHitbox = this.hitboxModel;
};

PlayerPuff.prototype.restHit = function() {
  this.restHitEffect.trigger(util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed));
};

PlayerPuff.prototype.poundChannel = function() {
  this.poundCooldown = this.POUND_COOLDOWN_LENGTH;
};

PlayerPuff.prototype.poundDash = function() {
  this.poundEffect.trigger(util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed));
  this.poundDirection = this.look;
};

PlayerPuff.prototype.pound = function() {
  this.hitboxPos = util.vec2.add(this.pos, util.vec2.scale(this.poundDirection, this.POUND_OFFSET));
  this.hitboxColor = util.vec4.make(1, 0, 0, 0.85);
  this.hitboxScale = this.POUND_RADIUS;
  this.hitBoxAngle = 0;
  this.drawHitbox = this.hitboxModel;
};

PlayerPuff.prototype.poundHit = function() {
  this.poundHitEffect.trigger(util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed));
};

PlayerPuff.prototype.taunt = function() {
  this.tauntEffect.trigger(util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed));
};

PlayerPuff.prototype.setPos = PlayerObject.prototype.setPos;
PlayerPuff.prototype.setVel = PlayerObject.prototype.setVel;
PlayerPuff.prototype.setHeight = PlayerObject.prototype.setHeight;

PlayerPuff.prototype.setLook = PlayerObject.prototype.setLook;
PlayerPuff.prototype.setSpeed = PlayerObject.prototype.setSpeed;
PlayerPuff.prototype.getDraw = PlayerObject.prototype.getDraw;

PlayerPuff.prototype.destroy = PlayerObject.prototype.destroy;

PlayerPuff.prototype.type = function() { return "puf"; };