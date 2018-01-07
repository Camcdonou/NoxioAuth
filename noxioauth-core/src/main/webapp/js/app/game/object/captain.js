"use strict";
/* global main */
/* global util */
/* global GameObject */
/* global PlayerObject */
/* global PointLight */
/* global ParticleBlip */
/* global ParticleDash */
/* global ParticleStun */
/* global ParticleAirJump */
/* global ParticleBloodSplat */
/* global Decal */

/* Define PlayerFox Class */
function PlayerCaptain(game, oid, pos, vel) {
  PlayerObject.call(this, game, oid, pos, vel);
  
  this.model = this.game.display.getModel("character.player.player");
  this.material = this.game.display.getMaterial("character.captain.captain");
  this.icon = this.game.display.getMaterial("character.captain.ui.iconlarge");
  
  /* Constants */
  this.PUNCH_COOLDOWN_LENGTH = 45;
  this.PUNCH_CHARGE_LENGTH = 35;
  this.KICK_COOLDOWN_LENGTH = 60;
  this.KICK_LENGTH = 8;
  this.KICK_RADIUS = 0.65;
  this.KICK_OFFSET = 0.1;
  
  this.PUNCH_HITBOX_SIZE = 0.75;
  this.PUNCH_HITBOX_OFFSET = 0.5;
  
  /* Settings */
  this.radius = 0.5; this.weight = 1.0; this.friction = 0.725;
  this.moveSpeed = 0.0375; this.jumpHeight = 0.175; this.cullRadius = 1.0;
  
  /* State */
  this.punchDirection = util.vec2.make(1,0);
  this.kickDirection = util.vec2.make(1,0);

  /* Timers */
  this.charging = false;
  this.chargeTimer = 0;
  this.punchCooldown = 0;
  this.kickActive = 0;
  this.kickCooldown = 0;

  /* Effects */
  this.chargeEffect = {
    effect: new Effect([
      {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: ["character/captain/punch0.wav", 0.45], update: function(snd){}, attachment: true, delay: 0, length: 33}
    ], false),
    offset: util.vec3.make(0,0,0.25),
    trigger: PlayerObject.prototype.effectTrigger};
  this.effects.push(this.chargeEffect);
  
  this.punchEffect = {
    effect: new Effect([
      {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: ["character/captain/punch1.wav", 0.5], update: function(snd){}, attachment: true, delay: 0, length: 33},
      {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: ["character/captain/punch2.wav", 0.5], update: function(snd){}, attachment: true, delay: 0, length: 33}
    ], false),
    offset: util.vec3.make(0,0,0.25),
    trigger: PlayerObject.prototype.effectTrigger};
  this.effects.push(this.punchEffect);
  
  this.kickEffect = {
    effect: new Effect([
      {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: ["character/captain/kick1.wav", 0.25], update: function(snd){}, attachment: true, delay: 0, length: 33}
    ], false),
    offset: util.vec3.make(0,0,0.25),
    trigger: PlayerObject.prototype.effectTrigger};
  this.effects.push(this.kickEffect);
  
  this.tauntEffect = {
    effect: new Effect([
      {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: [["character/captain/taunt0.wav", "character/captain/taunt1.wav", "character/captain/taunt2.wav", "character/captain/taunt3.wav"], 0.4], update: function(snd){}, attachment: true, delay: 0, length: 33}
    ], false),
    offset: util.vec3.make(0,0,0.25),
    trigger: PlayerObject.prototype.effectTrigger};
  this.effects.push(this.tauntEffect);
  
  this.jumpEffect = {
    effect: new Effect([
      {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: [["character/captain/jump0.wav", "character/captain/jump1.wav"], 0.25], update: function(snd){}, attachment: true, delay: 0, length: 33}
    ], false),
    offset: util.vec3.make(0,0,0.25),
    trigger: PlayerObject.prototype.effectTrigger};
  this.effects.push(this.jumpEffect);
  
  this.stunEffect = {
    effect: new Effect([
      {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: [["character/captain/hit0.wav", "character/captain/hit1.wav"], 0.35], update: function(snd){}, attachment: true, delay: 0, length: 33},
      {type: "particle", class: ParticleStun, params: [this.game, "<vec3 pos>", "<vec3 vel>"], update: function(prt){}, attachment: true, delay: 0, length: 45}
    ], false),
    offset: util.vec3.make(0,0,0.5),
    trigger: PlayerObject.prototype.effectTrigger};
  this.effects.push(this.stunEffect);

  this.impactDeathEffect = {
    effect: new Effect([
      {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: ["character/captain/death0.wav", 0.7], update: function(snd){}, attachment: true, delay: 0, length: 60}
    ], false),
    offset: util.vec3.make(0,0,0.25),
    trigger: PlayerObject.prototype.effectTrigger};
  this.effects.push(this.impactDeathEffect);
  
  this.fallDeathEffect = {
    effect: new Effect([
      {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: ["character/captain/death1.wav", 0.7], update: function(snd){}, attachment: true, delay: 0, length: 99}
    ], false),
    offset: util.vec3.make(0,0,0.25),
    trigger: PlayerObject.prototype.effectTrigger};
  this.effects.push(this.fallDeathEffect);
    
  /* Visual Hitboxes */
  this.hitboxModelA = this.game.display.getModel("multi.hitbox.eqtriY");
  this.hitboxModelB = this.game.display.getModel("multi.hitbox.circle");
  
  /* UI */
  this.uiMeters = [
    {type: "bar", iconMat: this.game.display.getMaterial("character.captain.ui.meterkick"), length: 16, scalar: 1.0},
    {type: "bar", iconMat: this.game.display.getMaterial("character.captain.ui.meterpunch"), length: 14, scalar: 0.0}
  ];
};

PlayerCaptain.prototype.update = PlayerObject.prototype.update;
PlayerCaptain.prototype.parseUpd = PlayerObject.prototype.parseUpd;

PlayerCaptain.prototype.effectSwitch = function(e) {
  switch(e) {
      case "jmp" : { this.jump(); break; }
      case "air" : { this.air(); break; } 
      case "atk" : { this.charge(); break; }
      case "pun" : { this.punch(); break; }
      case "mov" : { this.kick(); break; }
      case "tnt" : { this.taunt(); break; }
      case "stn" : { this.stun(); break; }
      case "ult" : { this.ultimate = true; break; }
    default : { main.menu.warning.show("Invalid effect value: '" + e + "' @ Captain.js :: effectSwitch()"); break; }
  }
};

PlayerCaptain.prototype.timers = function() {
  if(this.kickActive > 0) { this.kicking(); this.kickActive--; }
  if(this.kickCooldown > 0) { this.kickCooldown--; }
  if(this.chargeTimer > 0) { this.chargeTimer--; }
  if(this.punchCooldown > 0) { this.punchCooldown--; }
  if(this.charging) {
    this.hitboxPos = util.vec2.add(this.pos, util.vec2.scale(this.punchDirection, this.PUNCH_HITBOX_OFFSET));
    this.hitboxColor = util.vec4.make(0, 1, 0, 0.5);
    this.hitboxScale = this.PUNCH_HITBOX_SIZE;
    this.hitBoxAngle = (util.vec2.angle(util.vec2.make(1, 0), this.punchDirection)*(this.punchDirection.y>0?-1:1))+(Math.PI*0.5);
    this.drawHitbox = this.hitboxModelA;
  }
};

PlayerCaptain.prototype.ui = function() {
  this.uiMeters[0].scalar = this.kickActive>0?this.kickActive/this.KICK_LENGTH:1-(this.kickCooldown/(this.KICK_COOLDOWN_LENGTH-this.KICK_LENGTH));
  this.uiMeters[1].scalar = this.chargeTimer>0?1-(this.chargeTimer/this.PUNCH_CHARGE_LENGTH):this.punchCooldown/(this.PUNCH_COOLDOWN_LENGTH-this.PUNCH_CHARGE_LENGTH);
};

PlayerCaptain.prototype.air  = PlayerObject.prototype.air;
PlayerCaptain.prototype.jump = PlayerObject.prototype.jump;
PlayerCaptain.prototype.stun = function() {
  PlayerObject.prototype.stun.call(this);
  this.charging = false;
  this.chargeTimer = 0;
  this.punchCooldown = 0;
  this.kickActive = 0;
  this.kickCooldown = 0;
};

PlayerCaptain.prototype.charge = function() {
  this.chargeEffect.trigger(util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed));
  this.charging = true;
  this.chargeTimer = this.PUNCH_CHARGE_LENGTH;
  this.punchCooldown = this.PUNCH_COOLDOWN_LENGTH;
  this.punchDirection = this.look;
};

PlayerCaptain.prototype.punch = function() {
  this.punchEffect.trigger(util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed));
  this.charging = false;
  this.hitboxPos = util.vec2.add(this.pos, util.vec2.scale(this.punchDirection, this.PUNCH_HITBOX_OFFSET));
  this.hitboxColor = util.vec4.make(1, 0, 0, 0.5);
  this.hitboxScale = this.PUNCH_HITBOX_SIZE;
  this.hitBoxAngle = (util.vec2.angle(util.vec2.make(1, 0), this.punchDirection)*(this.punchDirection.y>0?-1:1))+(Math.PI*0.5);
  this.drawHitbox = this.hitboxModelA;
};

PlayerCaptain.prototype.kick = function() {
  this.kickEffect.trigger(util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed));
  this.kickDirection = this.look;
  this.kickActive = this.KICK_LENGTH;
  this.kickCooldown = this.KICK_COOLDOWN_LENGTH;
};

PlayerCaptain.prototype.kicking = function() {
  this.hitboxPos = util.vec2.add(this.pos, util.vec2.scale(this.kickDirection, this.KICK_OFFSET));
  this.hitboxColor = util.vec4.make(1, 0, 0, 0.5);
  this.hitboxScale = this.KICK_RADIUS;
  this.hitBoxAngle = 0;
  this.drawHitbox = this.hitboxModelB;
};

PlayerCaptain.prototype.taunt = function() {
  this.tauntEffect.trigger(util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed));
};

PlayerCaptain.prototype.setPos = PlayerObject.prototype.setPos;
PlayerCaptain.prototype.setVel = PlayerObject.prototype.setVel;
PlayerCaptain.prototype.setHeight = PlayerObject.prototype.setHeight;

PlayerCaptain.prototype.setLook = PlayerObject.prototype.setLook;
PlayerCaptain.prototype.setSpeed = PlayerObject.prototype.setSpeed;
PlayerCaptain.prototype.getDraw = PlayerObject.prototype.getDraw;

PlayerCaptain.prototype.destroy = PlayerObject.prototype.destroy;

PlayerCaptain.prototype.type = function() { return "cap"; };