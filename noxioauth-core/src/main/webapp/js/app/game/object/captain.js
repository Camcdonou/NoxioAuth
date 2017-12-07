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
  
  this.model = this.game.display.getModel("multi.smallBox");
  this.material = this.game.display.getMaterial("character.captain.captain");
  this.icon = this.game.display.getMaterial("character.captain.ui.iconlarge");
  
  /* Constants */
  this.PUNCH_COOLDOWN_LENGTH = 45;
  this.PUNCH_CHARGE_LENGTH = 35;
  this.KICK_COOLDOWN_LENGTH = 45;
  this.KICK_LENGTH = 12;
  
  this.PUNCH_HITBOX_SIZE = 0.75;
  this.PUNCH_HITBOX_OFFSET = 0.5;
  
  /* Settings */
  this.radius = 0.5; this.weight = 1.0; this.friction = 0.725;
  this.moveSpeed = 0.0375; this.jumpHeight = 0.175; this.cullRadius = 1.0;
  this.fatalImpactSpeed = 0.175;
  
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
  this.chargeEffect = new Effect([
    {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: ["character/captain/punch0.wav", 0.5], update: function(snd){}, attachment: true, delay: 0, length: 33}
  ], false);
  
  this.punchEffect = new Effect([
    {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: ["character/captain/punch1.wav", 0.5], update: function(snd){}, attachment: true, delay: 0, length: 33},
    {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: ["character/captain/punch2.wav", 0.5], update: function(snd){}, attachment: true, delay: 0, length: 33}
  ], false);
  
  this.kickEffect = new Effect([
    {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: ["character/captain/kick1.wav", 0.25], update: function(snd){}, attachment: true, delay: 0, length: 33}
  ], false);
  
  this.tauntEffect = new Effect([
    {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: [["character/captain/taunt0.wav", "character/captain/taunt1.wav", "character/captain/taunt2.wav", "character/captain/taunt3.wav"], 0.5], update: function(snd){}, attachment: true, delay: 0, length: 33}
  ], false);
  
  this.jumpEffect = new Effect([
    {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: [["character/captain/jump0.wav", "character/captain/jump1.wav"], 0.5], update: function(snd){}, attachment: true, delay: 0, length: 33}
  ], false);
  
  this.stunEffect = new Effect([
    {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: [["character/captain/hit0.wav", "character/captain/hit1.wav"], 0.5], update: function(snd){}, attachment: true, delay: 0, length: 33},
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
    {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: ["character/captain/death0.wav", 0.8], update: function(snd){}, attachment: true, delay: 0, length: 60}
  ], false);
  
  this.fallDeathEffect = new Effect([
    {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: ["character/captain/death1.wav", 0.8], update: function(snd){}, attachment: true, delay: 0, length: 99}
  ], false);
  
  this.effects.push(this.chargeEffect); this.effects.push(this.punchEffect); this.effects.push(this.kickEffect); this.effects.push(this.tauntEffect); this.effects.push(this.jumpEffect); this.effects.push(this.airEffect);
  this.effects.push(this.stunEffect); this.effects.push(this.bloodEffect); this.effects.push(this.impactDeathEffect); this.effects.push(this.fallDeathEffect);
  
  /* Visual Hitboxes */
  this.hitboxModel = this.game.display.getModel("multi.hitbox.eqtriY");
  
  /* UI */
  this.uiMeters = [
    {type: "bar", iconMat: this.game.display.getMaterial("character.captain.ui.meterkick"), length: 16, scalar: 1.0},
    {type: "bar", iconMat: this.game.display.getMaterial("character.captain.ui.meterpunch"), length: 14, scalar: 0.0}
  ];
};

PlayerCaptain.prototype.update = function(data) {
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
      case "air" : { this.air(); break; } 
      case "atk" : { this.charge(); break; }
      case "pun" : { this.punch(); break; }
      case "mov" : { this.kick(); break; }
      case "tnt" : { this.taunt(); break; }
      case "stn" : { this.stun(); break; }
      case "ult" : { this.ultimate = true; break; }
      default : { break; }
    }
  }
  
  /* Update Timers */
  if(this.charging) {
    this.hitboxPos = util.vec2.add(this.pos, util.vec2.scale(this.punchDirection, this.PUNCH_HITBOX_OFFSET));
    this.hitboxColor = util.vec4.make(0, 1, 0, 0.5);
    this.hitboxScale = this.PUNCH_HITBOX_SIZE;
    this.hitBoxAngle = (util.vec2.angle(util.vec2.make(1, 0), this.punchDirection)*(this.punchDirection.y>0?-1:1))+(Math.PI*0.5);
    this.drawHitbox = this.hitboxModel;
  }
  if(this.chargeTimer > 0) { this.chargeTimer--; }
  if(this.punchCooldown > 0) { this.punchCooldown--; }
  if(this.kickActive > 0) { this.kickActive--; }
  if(this.kickCooldown > 0) { this.kickCooldown--; }
  
  /* Step Effects */
  var angle = (util.vec2.angle(util.vec2.make(1, 0), this.look)*(this.look.y>0?-1:1))+(Math.PI*0.5);
  this.targetCircle.move(util.vec2.toVec3(this.pos, Math.min(this.height, 0.0)), 1.1, angle);
  this.chargeEffect.step(util.vec2.toVec3(this.pos, 0.5+this.height), util.vec2.toVec3(this.vel, 0.0));
  this.punchEffect.step(util.vec2.toVec3(this.pos, 0.5+this.height), util.vec2.toVec3(this.vel, 0.0));
  this.kickEffect.step(util.vec2.toVec3(this.pos, 0.5+this.height), util.vec2.toVec3(this.vel, 0.0));
  this.airEffect.step();
  this.jumpEffect.step(util.vec2.toVec3(this.pos, 0.25+this.height), util.vec2.toVec3(this.vel, 0.0));
  this.tauntEffect.step(util.vec2.toVec3(this.pos, 0.25+this.height), util.vec2.toVec3(this.vel, 0.0));
  this.stunEffect.step(util.vec2.toVec3(this.pos, 0.75+this.height), util.vec2.toVec3(this.vel, 0.0));
  this.bloodEffect.step(util.vec2.toVec3(this.pos, 0.0+this.height), util.vec2.toVec3(this.vel, 0.0));
  
  /* Update UI */
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
  this.chargeEffect.trigger(util.vec2.toVec3(this.pos, 0.5+this.height), util.vec2.toVec3(this.vel, 0.0));
  this.charging = true;
  this.chargeTimer = this.PUNCH_CHARGE_LENGTH;
  this.punchCooldown = this.PUNCH_COOLDOWN_LENGTH;
  this.punchDirection = this.look;
};

PlayerCaptain.prototype.punch = function() {
  this.punchEffect.trigger(util.vec2.toVec3(this.pos, 0.5+this.height), util.vec2.toVec3(this.vel, 0.0));
  this.charging = false;
  this.hitboxPos = util.vec2.add(this.pos, util.vec2.scale(this.punchDirection, this.PUNCH_HITBOX_OFFSET));
  this.hitboxColor = util.vec4.make(1, 0, 0, 0.5);
  this.hitboxScale = this.PUNCH_HITBOX_SIZE;
  this.hitBoxAngle = (util.vec2.angle(util.vec2.make(1, 0), this.punchDirection)*(this.punchDirection.y>0?-1:1))+(Math.PI*0.5);
  this.drawHitbox = this.hitboxModel;
};

PlayerCaptain.prototype.kick = function() {
  this.kickEffect.trigger(util.vec2.toVec3(this.pos, 0.5+this.height), util.vec2.toVec3(this.vel, 0.0));
  this.kickDirection = this.look;
  this.kickActive = this.KICK_LENGTH;
  this.kickCooldown = this.KICK_COOLDOWN_LENGTH;
};

PlayerCaptain.prototype.taunt = function() {
  this.tauntEffect.trigger(util.vec2.toVec3(this.pos, 0.25+this.height), util.vec2.toVec3(this.vel, 0.0));
};

PlayerCaptain.prototype.setPos = PlayerObject.prototype.setPos;
PlayerCaptain.prototype.setVel = PlayerObject.prototype.setVel;
PlayerCaptain.prototype.setHeight = PlayerObject.prototype.setHeight;

PlayerCaptain.prototype.setLook = PlayerObject.prototype.setLook;
PlayerCaptain.prototype.setSpeed = PlayerObject.prototype.setSpeed;
PlayerCaptain.prototype.getDraw = PlayerObject.prototype.getDraw;

PlayerCaptain.prototype.destroy = function() {
  for(var i=0;i<this.effects.length;i++) {
    this.effects[i].destroy();
  }
  if(this.height > -1.0) {
    this.bloodEffect.trigger(util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, 0.0));
    this.impactDeathEffect.trigger(util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, 0.0));
  }
  else { this.fallDeathEffect.trigger(util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, 0.0)); }
};

PlayerCaptain.prototype.getType = function() {
  return "obj.player.captain";
};