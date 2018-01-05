"use strict";
/* global main */
/* global util */
/* global GameObject */
/* global PlayerObject */
/* global PointLight */
/* global ParticleStun */
/* global ParticleSmoke */
/* global ParticleMark */
/* global ParticleAirJump */
/* global ParticleBloodSplat */
/* global Decal */

/* Define PlayerShiek Class */
function PlayerShiek(game, oid, pos, vel) {
  PlayerObject.call(this, game, oid, pos, vel);
  
  this.model = this.game.display.getModel("character.player.player");
  this.material = this.game.display.getMaterial("character.shiek.shiek");
  this.icon = this.game.display.getMaterial("character.shiek.ui.iconlarge");
  
  /* Constants */
  this.FLASH_CHARGE_LENGTH = 10;
  
  /* Settings */
  this.radius = 0.5; this.weight = 1.0; this.friction = 0.755;
  this.moveSpeed = 0.0385; this.jumpHeight = 0.175; this.cullRadius = 1.0;
  
  /* State */
  this.markLocation = undefined;

  /* Timers */
  this.chargeTimer = 0;

  /* Effects */
  this.attackEffect = {
    effect: new Effect([
      {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: ["character/shiek/grenade0.wav", 0.5], update: function(snd){}, attachment: true, delay: 0, length: 33}
    ], false),
    offset: util.vec3.make(0,0,0.25),
    trigger: PlayerObject.prototype.effectTrigger};
  this.effects.push(this.attackEffect);
  
  this.markEffect = {
    effect: new Effect([
      {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: ["character/shiek/mark0.wav", 0.5], update: function(snd){}, attachment: true, delay: 0, length: 33}
    ], false),
    offset: util.vec3.make(0,0,0.25),
    trigger: PlayerObject.prototype.effectTrigger};
  this.effects.push(this.markEffect);
  
  this.locationEffect = {
    effect: new Effect([
      {type: "light", class: PointLight, params: ["<vec3 pos>", util.vec4.make(0.45, 0.5, 1.0, 0.5), 1.0], update: function(lit){lit.color.w -= 0.5/25.0; lit.rad += 0.025;}, attachment: false, delay: 0, length: 25},
      {type: "particle", class: ParticleMark, params: [this.game, "<vec3 pos>", "<vec3 vel>"], update: function(prt){}, attachment: false, delay: 0, length: 25}
    ], true),
    offset: util.vec3.make(0,0,0),
    trigger: PlayerObject.prototype.effectTrigger};
  this.effects.push(this.locationEffect);
  
  this.noMarkEffect = {
    effect: new Effect([
      {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: ["character/shiek/mark1.wav", 0.5], update: function(snd){}, attachment: true, delay: 0, length: 33}
    ], false),
    offset: util.vec3.make(0,0,0.25),
    trigger: PlayerObject.prototype.effectTrigger};
  this.effects.push(this.noMarkEffect);
  
  this.chargeEffect = {
    effect: new Effect([
      {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: ["character/shiek/flash0.wav", 0.5], update: function(snd){}, attachment: true, delay: 0, length: 33}
    ], false),
    offset: util.vec3.make(0,0,0.25),
    trigger: PlayerObject.prototype.effectTrigger};
  this.effects.push(this.chargeEffect);
  
  this.smokeEffect = {
    effect: new Effect([
      {type: "particle", class: ParticleSmoke, params: [this.game, "<vec3 pos>", "<vec3 vel>"], update: function(prt){}, attachment: false, delay: 0, length: 33}
    ], false),
    offset: util.vec3.make(0,0,0),
    trigger: PlayerObject.prototype.effectTrigger};
  this.effects.push(this.smokeEffect);
  
  this.tauntEffect = {
    effect: new Effect([
      {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: ["character/shiek/taunt0.wav", 0.6], update: function(snd){}, attachment: true, delay: 0, length: 33}
    ], false),
    offset: util.vec3.make(0,0,0.25),
    trigger: PlayerObject.prototype.effectTrigger};
  this.effects.push(this.tauntEffect);
  
  this.jumpEffect = {
    effect: new Effect([
      {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: [["character/shiek/jump0.wav", "character/shiek/jump1.wav", "character/shiek/jump2.wav", "character/shiek/jump3.wav"], 0.5], update: function(snd){}, attachment: true, delay: 0, length: 33}
    ], false),
    offset: util.vec3.make(0,0,0.25),
    trigger: PlayerObject.prototype.effectTrigger};
  this.effects.push(this.jumpEffect);
  
  this.stunEffect = {
    effect: new Effect([
      {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: [["character/shiek/hit0.wav", "character/shiek/hit1.wav", "character/shiek/hit2.wav"], 0.8], update: function(snd){}, attachment: true, delay: 0, length: 33},
      {type: "particle", class: ParticleStun, params: [this.game, "<vec3 pos>", "<vec3 vel>"], update: function(prt){}, attachment: true, delay: 0, length: 45}
    ], false),
    offset: util.vec3.make(0,0,0.5),
    trigger: PlayerObject.prototype.effectTrigger};
  this.effects.push(this.stunEffect);
  
  this.impactDeathEffect = {
    effect: new Effect([
      {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: ["character/shiek/death0.wav", 0.8], update: function(snd){}, attachment: true, delay: 0, length: 60}
    ], false),
    offset: util.vec3.make(0,0,0.25),
    trigger: PlayerObject.prototype.effectTrigger};
  this.effects.push(this.impactDeathEffect);
  
  this.fallDeathEffect = {
    effect: new Effect([
      {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: ["character/shiek/death1.wav", 0.8], update: function(snd){}, attachment: true, delay: 0, length: 99}
    ], false),
    offset: util.vec3.make(0,0,0.25),
    trigger: PlayerObject.prototype.effectTrigger};
  this.effects.push(this.fallDeathEffect);

  /* UI */
  this.uiMeters = [
    {type: "bar", iconMat: this.game.display.getMaterial("character.player.ui.meterstub"), length: 8, scalar: 0.0}
  ];
};

PlayerShiek.prototype.update = PlayerObject.prototype.update;
PlayerShiek.prototype.parseUpd = PlayerObject.prototype.parseUpd;

PlayerShiek.prototype.effectSwitch = function(e) {
  switch(e) {
    case "air" : { this.air(); break; } 
    case "jmp" : { this.jump(); break; }
    case "atk" : { this.attack(); break; }
    case "chr" : { this.charge(); break; }
    case "fsh" : { this.flash(); break; }
    case "mrk" : { this.mark(); break; }
    case "nom" : { this.noMark(); break; }
    case "tnt" : { this.taunt(); break; }
    case "stn" : { this.stun(); break; }
    case "ult" : { this.ultimate = true; break; }
    default : { main.menu.warning.show("Invalid effect value: '" + e + "' @ Shiek.js :: effectSwitch()"); break; }
  }
};

PlayerShiek.prototype.timers = function() {
  if(this.chargeTimer > 0) { this.chargeTimer--; this.glow = 1-(this.chargeTimer/this.FLASH_CHARGE_LENGTH); }
  else { this.glow = 0; }
};

PlayerShiek.prototype.ui = function() {
  this.uiMeters[0].scalar = this.markLocation?1:0;
};

PlayerShiek.prototype.air  = PlayerObject.prototype.air;
PlayerShiek.prototype.jump = PlayerObject.prototype.jump;
PlayerShiek.prototype.stun = function() {
  PlayerObject.prototype.stun.call(this);
  this.chargeEffect.effect.destroy();
  this.chargeTimer = 0;
};

PlayerShiek.prototype.attack = function() {
  this.attackEffect.trigger(util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed));
};

PlayerShiek.prototype.charge = function() {
  this.chargeTimer = this.FLASH_CHARGE_LENGTH;
  this.chargeEffect.trigger(util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed));
};

PlayerShiek.prototype.flash = function() {
  this.smokeEffect.trigger(util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed));
  this.markLocation = undefined;
  this.locationEffect.effect.destroy();
};

PlayerShiek.prototype.mark = function() {
  this.markEffect.trigger(util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed));
  this.markLocation = util.vec2.copy(this.pos);
  this.locationEffect.trigger(util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed));
};

PlayerShiek.prototype.noMark = function() {
  this.noMarkEffect.trigger(util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed));
};

PlayerShiek.prototype.taunt = function() {
  this.tauntEffect.trigger(util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed));
};

PlayerShiek.prototype.setPos = PlayerObject.prototype.setPos;
PlayerShiek.prototype.setVel = PlayerObject.prototype.setVel;
PlayerShiek.prototype.setHeight = PlayerObject.prototype.setHeight;

PlayerShiek.prototype.setLook = PlayerObject.prototype.setLook;
PlayerShiek.prototype.setSpeed = PlayerObject.prototype.setSpeed;
PlayerShiek.prototype.getDraw = PlayerObject.prototype.getDraw;

PlayerShiek.prototype.destroy = PlayerObject.prototype.destroy;

PlayerShiek.prototype.type = function() { return "shk"; };