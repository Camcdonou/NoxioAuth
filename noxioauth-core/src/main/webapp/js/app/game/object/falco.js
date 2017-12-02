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
/* global ParticleBloodSplat */
/* global Decal */

/* Define PlayerFalco Class */
function PlayerFalco(game, oid, pos, vel) {
  PlayerObject.call(this, game, oid, pos, vel);
  
  this.model = this.game.display.getModel("multi.smallBox");
  this.material = this.game.display.getMaterial("character.falco.falco");
  
  /* Constants */
  this.BLIP_COOLDOWN_MAX = 30;
  this.DASH_COOLDOWN_MAX = 45;
  
  /* Settings */
  this.radius = 0.5; this.weight = 1.1; this.friction = 0.725;
  this.moveSpeed = 0.0375; this.jumpHeight = 0.175; this.cullRadius = 1.0;
  this.fatalImpactSpeed = 0.175;
  
  /* State */

  /* Timers */
  this.blipCooldown = 0;
  this.dashCooldown = 0;

  /* Effects */
  this.blipEffect = new Effect([
    {type: "light", class: PointLight, params: ["<vec3 pos>", util.vec4.make(0.45, 0.5, 1.0, 1.0), 3.0], update: function(lit){}, attachment: true, delay: 0, length: 3},
    {type: "light", class: PointLight, params: ["<vec3 pos>", util.vec4.make(0.45, 0.5, 1.0, 1.0), 3.0], update: function(lit){lit.color.w -= 1.0/12.0; lit.rad += 0.1; }, attachment: true, delay: 3, length: 12},
    {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: ["character/falco/attack0.wav", 0.4], update: function(snd){}, attachment: true, delay: 0, length: 33},
    {type: "particle", class: ParticleBlip, params: [this.game, "<vec3 pos>", "<vec3 vel>"], update: function(prt){}, attachment: true, delay: 0, length: 33}
  ], false);
  
  this.chargeEffect = new Effect([
    {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: ["character/falco/charge0.wav", 0.8], update: function(snd){}, attachment: true, delay: 0, length: 33},
    {type: "light", class: PointLight, params: ["<vec3 pos>", util.vec4.make(0.8, 0.45, 0.25, 0.15), 1.0], update: function(lit){lit.color.w += 1.0/25.0; lit.rad += 0.05; }, attachment: true, delay: 0, length: 20},
    {type: "particle", class: ParticleCharge, params: [this.game, "<vec3 pos>", "<vec3 vel>"], update: function(prt){}, attachment: true, delay: 0, length: 20}
  ], false);
  
  this.dashEffect = new Effect([
    {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: ["character/falco/dash0.wav", 0.8], update: function(snd){}, attachment: true, delay: 0, length: 33},
    {type: "light", class: PointLight, params: ["<vec3 pos>", util.vec4.make(0.45, 0.5, 1.0, 0.75), 2.5], update: function(lit){lit.color.w -= 1.0/45.0; lit.rad += 0.05; }, attachment: false, delay: 0, length: 30},
    {type: "particle", class: ParticleDash, params: [this.game, "<vec3 pos>", "<vec3 vel>"], update: function(prt){}, attachment: true, delay: 0, length: 60}
  ], false);
  
  this.tauntEffect = new Effect([
    {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: ["character/falco/taunt0.wav", 0.6], update: function(snd){}, attachment: true, delay: 0, length: 33}
  ], false);
  
  this.jumpEffect = new Effect([
    {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: ["character/falco/jump0.wav", 0.6], update: function(snd){}, attachment: true, delay: 0, length: 33}
  ], false);
  
  this.stunEffect = new Effect([
    {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: [["character/falco/hit0.wav","character/falco/hit1.wav"], 0.8], update: function(snd){}, attachment: true, delay: 0, length: 33},
    {type: "particle", class: ParticleStun, params: [this.game, "<vec3 pos>", "<vec3 vel>"], update: function(prt){}, attachment: true, delay: 0, length: 45}
  ], false);
  
  this.bloodEffect = new Effect([
    {type: "particle", class: ParticleBloodSplat, params: [this.game, "<vec3 pos>", "<vec3 vel>"], update: function(prt){}, attachment: true, delay: 0, length: 300},
    {type: "decal", class: Decal, params: [this.game, this.game.display.getMaterial("character.player.decal.bloodsplat"), "<vec3 pos>", util.vec3.make(0.0, 0.0, 1.0), 1.5, Math.random()*6.28319], update: function(dcl){}, attachment: false, delay: 0, length: 300}
  ], false);
  
  this.impactDeathEffect = new Effect([
    {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: ["character/falco/death0.wav", 0.8], update: function(snd){}, attachment: true, delay: 0, length: 60}
  ], false);
  
  this.fallDeathEffect = new Effect([
    {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: ["character/falco/death1.wav", 0.8], update: function(snd){}, attachment: true, delay: 0, length: 99}
  ], false);
  
  this.effects.push(this.blipEffect); this.effects.push(this.dashEffect); this.effects.push(this.tauntEffect); this.effects.push(this.jumpEffect);
  this.effects.push(this.stunEffect); this.effects.push(this.bloodEffect); this.effects.push(this.impactDeathEffect); this.effects.push(this.fallDeathEffect);
  this.effects.push(this.chargeEffect);
};

PlayerFalco.prototype.update = function(data) {
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
      case "atk" : { this.blip(); break; }
      case "mov" : { this.dash(); break; }
      case "chr" : { this.charge(); break; }
      case "tnt" : { this.taunt(); break; }
      case "stn" : { this.stun(); break; }
      default : { break; }
    }
  }
  
  /* Update Timers */
  if(this.blipCooldown > 0) { this.blipCooldown--; }
  if(this.dashCooldown > 0) { this.dashCooldown--; }
  
  /* Step Effects */
  this.targetCircle.move(util.vec2.toVec3(this.pos, Math.min(this.height, 0.0)), 1.1);
  this.blipEffect.step(util.vec2.toVec3(this.pos, 0.5+this.height), util.vec2.toVec3(this.vel, 0.0));
  this.dashEffect.step(util.vec2.toVec3(this.pos, 0.5+this.height), util.vec2.toVec3(this.vel, 0.0));
  this.chargeEffect.step(util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, 0.0));
  this.jumpEffect.step(util.vec2.toVec3(this.pos, 0.25+this.height), util.vec2.toVec3(this.vel, 0.0));
  this.tauntEffect.step(util.vec2.toVec3(this.pos, 0.25+this.height), util.vec2.toVec3(this.vel, 0.0));
  this.stunEffect.step(util.vec2.toVec3(this.pos, 0.75+this.height), util.vec2.toVec3(this.vel, 0.0));
  this.bloodEffect.step(util.vec2.toVec3(this.pos, 0.0+this.height), util.vec2.toVec3(this.vel, 0.0));
};

PlayerFalco.prototype.jump = PlayerObject.prototype.jump;
PlayerFalco.prototype.stun = function() {
  PlayerObject.prototype.stun.call(this);
  this.chargeEffect.destroy(); //@TODO: maybe change from 'destroy' to 'clear' or 'stop'
};

PlayerFalco.prototype.blip = function() {
  this.blipEffect.trigger(util.vec2.toVec3(this.pos, 0.5+this.height), util.vec2.toVec3(this.vel, 0.0));
  this.blipCooldown = this.BLIP_COOLDOWN_MAX;
};

PlayerFalco.prototype.dash = function() {
  this.dashEffect.trigger(util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, 0.0));
};

PlayerFalco.prototype.charge = function() {
  this.chargeEffect.trigger(util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, 0.0));
  this.dashCooldown = this.DASH_COOLDOWN_MAX;
};

PlayerFalco.prototype.taunt = function() {
  this.tauntEffect.trigger(util.vec2.toVec3(this.pos, 0.25+this.height), util.vec2.toVec3(this.vel, 0.0));
};

PlayerFalco.prototype.setPos = PlayerObject.prototype.setPos;
PlayerFalco.prototype.setVel = PlayerObject.prototype.setVel;
PlayerFalco.prototype.setHeight = PlayerObject.prototype.setHeight;

PlayerFalco.prototype.setLook = PlayerObject.prototype.setLook;
PlayerFalco.prototype.setSpeed = PlayerObject.prototype.setSpeed;
PlayerFalco.prototype.getDraw = PlayerObject.prototype.getDraw;

PlayerFalco.prototype.destroy = function() {
  for(var i=0;i<this.effects.length;i++) {
    this.effects[i].destroy();
  }
  if(this.height > -1.0) {
    this.bloodEffect.trigger(util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, 0.0));
    this.impactDeathEffect.trigger(util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, 0.0));
  }
  else { this.fallDeathEffect.trigger(util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, 0.0)); }
};

PlayerFalco.prototype.getType = function() {
  return "obj.player.falco";
};