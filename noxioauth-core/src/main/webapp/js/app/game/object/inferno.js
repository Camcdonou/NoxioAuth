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

/* Define PlayerInferno Class */
function PlayerInferno(game, oid, pos, team, color) {
  PlayerObject.call(this, game, oid, pos, 0, team, color);
  
  this.model = this.game.display.getModel("character.player.player");
  this.material = this.game.display.getMaterial("character.inferno.inferno");
  this.icon = this.game.display.getMaterial("character.inferno.ui.iconlarge");
  
  /* Constants */
  this.GEN_COOLDOWN_LENGTH = 10;
  
  /* Settings */
  this.radius = 0.5; this.weight = 1.0; this.friction = 0.725;
  this.moveSpeed = 0.0350; this.jumpHeight = 0.250; this.cullRadius = 1.0;
  
  /* State */

  /* Timers */
  this.genCooldown = 0;
  
  /* Effects */
  this.tauntEffect = {
    effect: new Effect([
      {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: [["character/inferno/taunt0.wav", "character/inferno/taunt1.wav"], 0.8], update: function(snd){}, attachment: true, delay: 0, length: 33}
    ], false),
    offset: util.vec3.make(0,0,0.25),
    trigger: PlayerObject.prototype.effectTrigger};
  this.effects.push(this.tauntEffect);
  
  this.jumpEffect = {
    effect: new Effect([
      {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: [["character/inferno/jump0.wav", "character/inferno/jump1.wav"], 0.5], update: function(snd){}, attachment: true, delay: 0, length: 33}
    ], false),
    offset: util.vec3.make(0,0,0.25),
    trigger: PlayerObject.prototype.effectTrigger};
  this.effects.push(this.jumpEffect);
  
  this.stunEffect = {
    effect: new Effect([
      {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: [["character/inferno/hit0.wav", "character/inferno/hit1.wav"], 0.9], update: function(snd){}, attachment: true, delay: 0, length: 33},
      {type: "particle", class: ParticleStun, params: [this.game, "<vec3 pos>", "<vec3 vel>"], update: function(prt){}, attachment: true, delay: 0, length: 45}
    ], false),
    offset: util.vec3.make(0,0,0.5),
    trigger: PlayerObject.prototype.effectTrigger};
  this.effects.push(this.stunEffect);
  
  this.impactDeathEffect = {
    effect: new Effect([
      {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: ["character/inferno/death0.wav", 0.9], update: function(snd){}, attachment: true, delay: 0, length: 60}
    ], false),
    offset: util.vec3.make(0,0,0.25),
    trigger: PlayerObject.prototype.effectTrigger};
  this.effects.push(this.impactDeathEffect);
  
  this.fallDeathEffect = {
    effect: new Effect([
      {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: ["character/inferno/death0.wav", 0.9], update: function(snd){}, attachment: true, delay: 0, length: 99}
    ], false),
    offset: util.vec3.make(0,0,0.25),
    trigger: PlayerObject.prototype.effectTrigger};
  this.effects.push(this.fallDeathEffect);

  /* UI */
  this.uiMeters = [
    {type: "bar", iconMat: this.game.display.getMaterial("character.player.ui.meterstub"), length: 16, scalar: 1.0}
  ];
};

PlayerInferno.prototype.update = PlayerObject.prototype.update;
PlayerInferno.prototype.parseUpd = PlayerObject.prototype.parseUpd;

PlayerInferno.prototype.effectSwitch = function(e) {
  switch(e) {
    case "air" : { this.air(); break; } 
    case "mov" : { this.ouch(); break; }
    case "jmp" : { this.jump(); break; }
    case "tnt" : { this.taunt(); break; }
    case "stn" : { this.stun(); break; }
    case "obj" : { this.objective = true; this.color = util.kalide.compressColors(2, 4, 5, 6, 8); break; }
    default : { main.menu.warning.show("Invalid effect value: '" + e + "' @ Inferno.js :: effectSwitch()"); break; }
  }
};

PlayerInferno.prototype.timers = function() {
  if(this.genCooldown > 0) { this.genCooldown--; }
};

PlayerInferno.prototype.ui = function() {
  this.uiMeters[0].scalar = 1.0-(this.genCooldown/this.GEN_COOLDOWN_LENGTH);
};

PlayerInferno.prototype.ouch = function() {
  this.genCooldown = this.GEN_COOLDOWN_LENGTH;
};

PlayerInferno.prototype.taunt = function() {
  this.tauntEffect.trigger(util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed));
};

PlayerInferno.prototype.air  = PlayerObject.prototype.air;
PlayerInferno.prototype.jump = PlayerObject.prototype.jump;
PlayerInferno.prototype.stun = PlayerObject.prototype.stun;

PlayerInferno.prototype.setPos = PlayerObject.prototype.setPos;
PlayerInferno.prototype.setVel = PlayerObject.prototype.setVel;
PlayerInferno.prototype.setHeight = PlayerObject.prototype.setHeight;

PlayerInferno.prototype.setLook = PlayerObject.prototype.setLook;
PlayerInferno.prototype.setSpeed = PlayerObject.prototype.setSpeed;

PlayerInferno.prototype.getDraw = PlayerObject.prototype.getDraw;

PlayerInferno.prototype.destroy = PlayerObject.prototype.destroy;

PlayerInferno.prototype.type = function() { return "inf"; };

/* Permutation dictionary */
PlayerInferno.classByPermutation = function(perm) {
  switch(perm) {
    default : { return PlayerInferno; }      
  }
};