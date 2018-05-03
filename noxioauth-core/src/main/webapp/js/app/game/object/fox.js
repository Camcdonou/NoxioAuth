"use strict";
/* global main */
/* global util */
/* global GameObject */
/* global PlayerObject */
/* global PointLight */
/* global ParticleBlip */
/* global ParticleDash */
/* global ParticleStun */
/* global Decal */
/* global PlayerFoxRed */

/* Define PlayerFox Class */
function PlayerFox(game, oid, pos, team, color) {
  PlayerObject.call(this, game, oid, pos, 0, team, color);
  
  this.model = this.game.display.getModel("character.player.player");
  this.material = this.game.display.getMaterial("character.fox.fox");
  this.icon = this.game.display.getMaterial("character.fox.ui.iconlarge");
  
  /* Constants */
  this.BLIP_POWER_MAX = 30;
  this.DASH_POWER_ADD = 30;
  this.DASH_POWER_MAX = 60;
  this.BLIP_COLOR_A = util.vec4.make(0.6666, 0.9058, 1.0, 1.0);
  this.BLIP_COLOR_B = util.vec4.make(0.4, 0.5450, 1.0, 1.0);
  this.DASH_LIGHT_COLOR = util.vec4.make(0.6666, 0.9058, 1.0, 0.75);
  
  /* Settings */
  this.radius = 0.5; this.weight = 1.0; this.friction = 0.725;
  this.moveSpeed = 0.0375; this.jumpHeight = 0.175; this.cullRadius = 1.0;
  
  /* State */

  /* Timers */
  this.blipCooldown = 0;
  this.dashCooldown = 0;

  /* Effects */
  this.blipEffect = {
    effect: new Effect([
      {type: "light", class: PointLight, params: ["<vec3 pos>", this.BLIP_COLOR_A, 3.0], update: function(lit){}, attachment: true, delay: 0, length: 3},
      {type: "light", class: PointLight, params: ["<vec3 pos>", this.BLIP_COLOR_B, 3.0], update: function(lit){lit.color.w -= 1.0/12.0; lit.rad += 0.1; }, attachment: true, delay: 3, length: 12},
      {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: ["character/fox/attack0.wav", 0.35], update: function(snd){}, attachment: true, delay: 0, length: 33},
      {type: "particle", class: ParticleBlip, params: [this.game, "<vec3 pos>", "<vec3 vel>", this.BLIP_COLOR_A, this.BLIP_COLOR_B], update: function(prt){}, attachment: true, delay: 0, length: 33}
    ], false),
    offset: util.vec3.make(0,0,0.5),
    trigger: PlayerObject.prototype.effectTrigger};
  this.effects.push(this.blipEffect);
  
  this.dashEffect = {
    effect: new Effect([
      {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: ["character/fox/dash0.wav", 0.65], update: function(snd){}, attachment: true, delay: 0, length: 33},
      {type: "light", class: PointLight, params: ["<vec3 pos>", this.DASH_LIGHT_COLOR, 2.5], update: function(lit){lit.color.w -= 1.0/45.0; lit.rad += 0.05; }, attachment: false, delay: 0, length: 30},
      {type: "particle", class: ParticleDash, params: [this.game, "<vec3 pos>", "<vec3 vel>", this.BLIP_COLOR_A, this.BLIP_COLOR_B], update: function(prt){}, attachment: true, delay: 0, length: 60}
    ], false),
    offset: util.vec3.make(0,0,0.25),
    trigger: PlayerObject.prototype.effectTrigger};
  this.effects.push(this.dashEffect);
  
  this.tauntEffect = {
    effect: new Effect([
      {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: [["character/fox/taunt0.wav", "character/fox/taunt1.wav"], 0.5], update: function(snd){}, attachment: true, delay: 0, length: 33}
    ], false),
    offset: util.vec3.make(0,0,0.25),
    trigger: PlayerObject.prototype.effectTrigger};
  this.effects.push(this.tauntEffect);
  
  this.jumpEffect = {
    effect: new Effect([
      {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: ["character/fox/jump0.wav", 0.35], update: function(snd){}, attachment: true, delay: 0, length: 33}
    ], false),
    offset: util.vec3.make(0,0,0.25),
    trigger: PlayerObject.prototype.effectTrigger};
  this.effects.push(this.jumpEffect);
  
  this.stunEffect = {
    effect: new Effect([
      {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: ["character/fox/hit0.wav", 0.6], update: function(snd){}, attachment: true, delay: 0, length: 33},
      {type: "particle", class: ParticleStun, params: [this.game, "<vec3 pos>", "<vec3 vel>"], update: function(prt){}, attachment: true, delay: 0, length: 45}
    ], false),
    offset: util.vec3.make(0,0,0.5),
    trigger: PlayerObject.prototype.effectTrigger};
  this.effects.push(this.stunEffect);
  
  this.impactDeathEffect = {
    effect: new Effect([
      {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: ["character/fox/death0.wav", 0.7], update: function(snd){}, attachment: true, delay: 0, length: 60}
    ], false),
    offset: util.vec3.make(0,0,0.25),
    trigger: PlayerObject.prototype.effectTrigger};
  this.effects.push(this.impactDeathEffect);
  
  this.fallDeathEffect = {
    effect: new Effect([
      {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: ["character/fox/death1.wav", 0.7], update: function(snd){}, attachment: true, delay: 0, length: 99}
    ], false),
    offset: util.vec3.make(0,0,0.25),
    trigger: PlayerObject.prototype.effectTrigger};
  this.effects.push(this.fallDeathEffect);
  
  /* UI */
  this.uiMeters = [
    {type: "bar", iconMat: this.game.display.getMaterial("character.fox.ui.meterblip"), length: 16, scalar: 1.0},
    {type: "bar", iconMat: this.game.display.getMaterial("character.fox.ui.meterdash"), length: 14, scalar: 1.0}
  ];
};

PlayerFox.prototype.update = PlayerObject.prototype.update;
PlayerFox.prototype.parseUpd = PlayerObject.prototype.parseUpd;

PlayerFox.prototype.effectSwitch = function(e) {
  switch(e) {
    case "jmp" : { this.jump(); break; }
    case "air" : { this.air(); break; } 
    case "atk" : { this.blip(); break; }
    case "mov" : { this.dash(); break; }
    case "tnt" : { this.taunt(); break; }
    case "stn" : { this.stun(); break; }
    case "obj" : { this.objective = true; this.color = util.kalide.compressColors(2, 4, 5, 6, 8); break; }
    default : { main.menu.warning.show("Invalid effect value: '" + e + "' @ Fox.js :: effectSwitch()"); break; }
  }
};

PlayerFox.prototype.timers = function() {
  if(this.blipCooldown > 0) { this.blipCooldown--; }
  if(this.dashCooldown > 0) { this.dashCooldown--; }
};

PlayerFox.prototype.ui = function() {
  this.uiMeters[0].scalar = 1.0-(this.blipCooldown/this.BLIP_POWER_MAX);
  this.uiMeters[1].scalar = Math.max(0, 1.0-(this.dashCooldown/this.DASH_POWER_MAX));
};

PlayerFox.prototype.air  = PlayerObject.prototype.air;
PlayerFox.prototype.jump = PlayerObject.prototype.jump;
PlayerFox.prototype.stun = PlayerObject.prototype.stun;

PlayerFox.prototype.blip = function() {
  this.blipEffect.trigger(util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed));
  this.blipCooldown = this.BLIP_POWER_MAX;
};

PlayerFox.prototype.dash = function() {
  this.dashEffect.trigger(util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed));
  this.dashCooldown += this.DASH_POWER_ADD;
};

PlayerFox.prototype.taunt = function() {
  this.tauntEffect.trigger(util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed));
};

PlayerFox.prototype.setPos = PlayerObject.prototype.setPos;
PlayerFox.prototype.setVel = PlayerObject.prototype.setVel;
PlayerFox.prototype.setHeight = PlayerObject.prototype.setHeight;

PlayerFox.prototype.setLook = PlayerObject.prototype.setLook;
PlayerFox.prototype.setSpeed = PlayerObject.prototype.setSpeed;
PlayerFox.prototype.getDraw = PlayerObject.prototype.getDraw;

PlayerFox.prototype.destroy = PlayerObject.prototype.destroy;

PlayerFox.prototype.type = function() { return "box"; };

/* Permutation dictionary */
PlayerFox.classByPermutation = function(perm) {
  switch(perm) {
    case 1 : { return PlayerFoxRed; }
    default : { return PlayerFox; }
  }
};