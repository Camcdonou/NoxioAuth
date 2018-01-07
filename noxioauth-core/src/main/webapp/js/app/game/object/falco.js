"use strict";
/* global main */
/* global util */
/* global GameObject */
/* global PlayerObject */
/* global PointLight */
/* global ParticleBlip */
/* global ParticleStun */
/* global ParticleDash */
/* global ParticleCharge */
/* global ParticleAirJump */
/* global ParticleBloodSplat */
/* global Decal */

/* Define PlayerFalco Class */
function PlayerFalco(game, oid, pos, vel) {
  PlayerObject.call(this, game, oid, pos, vel);
  
  this.model = this.game.display.getModel("character.player.player");
  this.material = this.game.display.getMaterial("character.falco.falco");
  this.icon = this.game.display.getMaterial("character.falco.ui.iconlarge");
  
  /* Constants */
  this.BLIP_POWER_MAX = 30;
  this.DASH_COOLDOWN_LENGTH = 45;
  this.CHARGE_TIME_LENGTH = 20;
  
  /* Settings */
  this.radius = 0.5; this.weight = 1.1; this.friction = 0.725;
  this.moveSpeed = 0.0375; this.jumpHeight = 0.175; this.cullRadius = 1.0;
  
  /* State */

  /* Timers */
  this.channelTimer = 0;
  this.blipCooldown = 0;
  this.dashCooldown = 0;

  /* Effects */
  this.blipEffect = {
    effect: new Effect([
      {type: "light", class: PointLight, params: ["<vec3 pos>", util.vec4.make(0.45, 0.5, 1.0, 1.0), 3.0], update: function(lit){}, attachment: true, delay: 0, length: 3},
      {type: "light", class: PointLight, params: ["<vec3 pos>", util.vec4.make(0.45, 0.5, 1.0, 1.0), 3.0], update: function(lit){lit.color.w -= 1.0/12.0; lit.rad += 0.1; }, attachment: true, delay: 3, length: 12},
      {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: ["character/falco/attack0.wav", 0.35], update: function(snd){}, attachment: true, delay: 0, length: 33},
      {type: "particle", class: ParticleBlip, params: [this.game, "<vec3 pos>", "<vec3 vel>"], update: function(prt){}, attachment: true, delay: 0, length: 33}
    ], false),
    offset: util.vec3.make(0,0,0.5),
    trigger: PlayerObject.prototype.effectTrigger};
  this.effects.push(this.blipEffect);
  
  this.chargeEffect = {
    effect: new Effect([
      {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: ["character/falco/charge0.wav", 0.75], update: function(snd){}, attachment: true, delay: 0, length: 33},
      {type: "light", class: PointLight, params: ["<vec3 pos>", util.vec4.make(0.8, 0.45, 0.25, 0.15), 1.0], update: function(lit){lit.color.w += 1.0/25.0; lit.rad += 0.05; }, attachment: true, delay: 0, length: 20},
      {type: "particle", class: ParticleCharge, params: [this.game, "<vec3 pos>", "<vec3 vel>"], update: function(prt){}, attachment: true, delay: 0, length: 20}
    ], false),
    offset: util.vec3.make(0,0,0),
    trigger: PlayerObject.prototype.effectTrigger};
  this.effects.push(this.chargeEffect);
  
  this.dashEffect = {
    effect: new Effect([
      {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: ["character/falco/dash0.wav", 0.6], update: function(snd){}, attachment: true, delay: 0, length: 33},
      {type: "light", class: PointLight, params: ["<vec3 pos>", util.vec4.make(0.45, 0.5, 1.0, 0.75), 2.5], update: function(lit){lit.color.w -= 1.0/45.0; lit.rad += 0.05; }, attachment: false, delay: 0, length: 30},
      {type: "particle", class: ParticleDash, params: [this.game, "<vec3 pos>", "<vec3 vel>"], update: function(prt){}, attachment: true, delay: 0, length: 60}
    ], false),
    offset: util.vec3.make(0,0,0.25),
    trigger: PlayerObject.prototype.effectTrigger};
  this.effects.push(this.dashEffect);
  
  this.tauntEffect = {
    effect: new Effect([
      {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: ["character/falco/taunt0.wav", 0.5], update: function(snd){}, attachment: true, delay: 0, length: 33}
    ], false),
    offset: util.vec3.make(0,0,0.25),
    trigger: PlayerObject.prototype.effectTrigger};
  this.effects.push(this.tauntEffect);
  
  this.jumpEffect = {
    effect: new Effect([
      {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: ["character/falco/jump0.wav", 0.35], update: function(snd){}, attachment: true, delay: 0, length: 33}
    ], false),
    offset: util.vec3.make(0,0,0.25),
    trigger: PlayerObject.prototype.effectTrigger};
  this.effects.push(this.jumpEffect);
  
  this.stunEffect = {
    effect: new Effect([
      {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: [["character/falco/hit0.wav","character/falco/hit1.wav"], 0.5], update: function(snd){}, attachment: true, delay: 0, length: 33},
      {type: "particle", class: ParticleStun, params: [this.game, "<vec3 pos>", "<vec3 vel>"], update: function(prt){}, attachment: true, delay: 0, length: 45}
    ], false),
    offset: util.vec3.make(0,0,0.5),
    trigger: PlayerObject.prototype.effectTrigger};
  this.effects.push(this.stunEffect);
  
  this.impactDeathEffect = {
    effect: new Effect([
      {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: ["character/falco/death0.wav", 0.7], update: function(snd){}, attachment: true, delay: 0, length: 60}
    ], false),
    offset: util.vec3.make(0,0,0.25),
    trigger: PlayerObject.prototype.effectTrigger};
  this.effects.push(this.impactDeathEffect);
  
  this.fallDeathEffect = {
    effect: new Effect([
      {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: ["character/falco/death1.wav", 0.7], update: function(snd){}, attachment: true, delay: 0, length: 99}
    ], false),
    offset: util.vec3.make(0,0,0.25),
    trigger: PlayerObject.prototype.effectTrigger};
  this.effects.push(this.fallDeathEffect);
  
  /* UI */
  this.uiMeters = [
    {type: "bar", iconMat: this.game.display.getMaterial("character.falco.ui.meterblip"), length: 16, scalar: 1.0},
    {type: "bar", iconMat: this.game.display.getMaterial("character.falco.ui.meterdash"), length: 14, scalar: 1.0}
  ];
};


PlayerFalco.prototype.update = PlayerObject.prototype.update;
PlayerFalco.prototype.parseUpd = PlayerObject.prototype.parseUpd;

PlayerFalco.prototype.effectSwitch = function(e) {
  switch(e) {
    case "air" : { this.air(); break; } 
    case "jmp" : { this.jump(); break; }
    case "atk" : { this.blip(); break; }
    case "mov" : { this.dash(); break; }
    case "chr" : { this.charge(); break; }
    case "tnt" : { this.taunt(); break; }
    case "stn" : { this.stun(); break; }
    case "ult" : { this.ultimate = true; break; }
    default : { main.menu.warning.show("Invalid effect value: '" + e + "' @ Falco.js :: effectSwitch()"); break; }
  }
};

PlayerFalco.prototype.timers = function() {
  if(this.blipCooldown > 0) { this.blipCooldown--; }
  if(this.dashCooldown > 0) { this.dashCooldown--; }
  if(this.channelTimer > 0) { this.channelTimer--; }
};

PlayerFalco.prototype.ui = function() {
  this.uiMeters[0].scalar = 1-(this.blipCooldown/this.BLIP_POWER_MAX);
  this.uiMeters[1].scalar = this.channelTimer>0?(this.channelTimer/this.CHARGE_TIME_LENGTH):(1-(this.dashCooldown/(this.DASH_COOLDOWN_LENGTH-this.CHARGE_TIME_LENGTH)));
};

PlayerFalco.prototype.air  = PlayerObject.prototype.air;
PlayerFalco.prototype.jump = PlayerObject.prototype.jump;
PlayerFalco.prototype.stun = function() {
  PlayerObject.prototype.stun.call(this);
  this.chargeEffect.effect.destroy(); //@TODO: maybe change from 'destroy' to 'clear' or 'stop'
  this.channelTimer = 0;
  this.dashCooldown = 0;
};

PlayerFalco.prototype.blip = function() {
  this.blipEffect.trigger(util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed));
  this.blipCooldown = this.BLIP_POWER_MAX;
};

PlayerFalco.prototype.dash = function() {
  this.dashEffect.trigger(util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed));
};

PlayerFalco.prototype.charge = function() {
  this.chargeEffect.trigger(util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed));
  this.channelTimer = this.CHARGE_TIME_LENGTH;
  this.dashCooldown = this.DASH_COOLDOWN_LENGTH;
};

PlayerFalco.prototype.taunt = function() {
  this.tauntEffect.trigger(util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed));
};

PlayerFalco.prototype.setPos = PlayerObject.prototype.setPos;
PlayerFalco.prototype.setVel = PlayerObject.prototype.setVel;
PlayerFalco.prototype.setHeight = PlayerObject.prototype.setHeight;

PlayerFalco.prototype.setLook = PlayerObject.prototype.setLook;
PlayerFalco.prototype.setSpeed = PlayerObject.prototype.setSpeed;
PlayerFalco.prototype.getDraw = PlayerObject.prototype.getDraw;

PlayerFalco.prototype.destroy = PlayerObject.prototype.destroy;

PlayerFalco.prototype.type = function() { return "flc"; };