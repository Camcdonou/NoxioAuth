"use strict";
/* global main */
/* global util */
/* global GameObject */
/* global PlayerObject */
/* global PointLight */
/* global ParticleBlip */
/* global ParticleDash */
/* global ParticleStun */
/* global ParticleBloodSplat */
/* global Decal */

/* Define PlayerFox Class */
function PlayerFox(game, oid, pos, vel) {
  PlayerObject.call(this, game, oid, pos, vel);
  
  this.model = this.game.display.getModel("multi.smallBox");
  this.material = this.game.display.getMaterial("character.fox.fox");
  
  /* Constants */
  this.BLIP_COOLDOWN_MAX = 30;
  this.DASH_COOLDOWN_ADD = 30;
  this.DASH_COOLDOWN_MAX = 60;
  
  /* Settings */
  this.radius = 0.5; this.weight = 1.0; this.friction = 0.725;
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
    {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: ["character/fox/attack0.wav", 0.4], update: function(snd){}, attachment: true, delay: 0, length: 33},
    {type: "particle", class: ParticleBlip, params: [this.game, "<vec3 pos>", "<vec3 vel>"], update: function(prt){}, attachment: true, delay: 0, length: 33}
  ]);
  
  this.dashEffect = new Effect([
    {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: ["character/fox/dash0.wav", 0.8], update: function(snd){}, attachment: true, delay: 0, length: 33},
    {type: "light", class: PointLight, params: ["<vec3 pos>", util.vec4.make(0.45, 0.5, 1.0, 0.75), 2.5], update: function(lit){lit.color.w -= 1.0/45.0; lit.rad += 0.05; }, attachment: false, delay: 0, length: 30},
    {type: "particle", class: ParticleDash, params: [this.game, "<vec3 pos>", "<vec3 vel>"], update: function(prt){}, attachment: true, delay: 0, length: 60}
  ]);
  
  this.tauntEffect = new Effect([
    {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: [["character/fox/taunt0.wav", "character/fox/taunt1.wav"], 0.6], update: function(snd){}, attachment: true, delay: 0, length: 33}
  ]);
  
  this.jumpEffect = new Effect([
    {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: ["character/fox/jump0.wav", 0.6], update: function(snd){}, attachment: true, delay: 0, length: 33}
  ]);
  
  this.stunEffect = new Effect([
    {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: ["character/fox/hit0.wav", 0.8], update: function(snd){}, attachment: true, delay: 0, length: 33},
    {type: "particle", class: ParticleStun, params: [this.game, "<vec3 pos>", "<vec3 vel>"], update: function(prt){}, attachment: true, delay: 0, length: 45}
  ]);
  
  this.bloodEffect = new Effect([
    {type: "particle", class: ParticleBloodSplat, params: [this.game, "<vec3 pos>", "<vec3 vel>"], update: function(prt){}, attachment: true, delay: 0, length: 300},
    {type: "decal", class: Decal, params: [this.game, this.game.display.getMaterial("character.player.decal.bloodsplat"), "<vec3 pos>", util.vec3.make(0.0, 0.0, 1.0), 1.5, Math.random()*6.28319], update: function(dcl){}, attachment: false, delay: 0, length: 300}
  ]);
  
  this.impactDeathEffect = new Effect([
    {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: ["character/fox/death0.wav", 0.8], update: function(snd){}, attachment: true, delay: 0, length: 60}
  ]);
  
  this.fallDeathEffect = new Effect([
    {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: ["character/fox/death1.wav", 0.8], update: function(snd){}, attachment: true, delay: 0, length: 99}
  ]);
  
  this.effects.push(this.blipEffect); this.effects.push(this.dashEffect); this.effects.push(this.tauntEffect); this.effects.push(this.jumpEffect);
  this.effects.push(this.stunEffect); this.effects.push(this.bloodEffect); this.effects.push(this.impactDeathEffect); this.effects.push(this.fallDeathEffect);
};

PlayerFox.prototype.update = function(data) {
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
  this.tauntEffect.step(util.vec2.toVec3(this.pos, 0.5+this.height), util.vec2.toVec3(this.vel, 0.0));
  this.stunEffect.step(util.vec2.toVec3(this.pos, 0.75+this.height), util.vec2.toVec3(this.vel, 0.0));
  this.bloodEffect.step(util.vec2.toVec3(this.pos, 0.0+this.height), util.vec2.toVec3(this.vel, 0.0));
};

PlayerFox.prototype.jump = PlayerObject.prototype.jump;
PlayerFox.prototype.stun = PlayerObject.prototype.stun;

PlayerFox.prototype.blip = function() {
  this.blipEffect.trigger(util.vec2.toVec3(this.pos, 0.5+this.height), util.vec2.toVec3(this.vel, 0.0));
  this.blipCooldown = this.BLIP_COOLDOWN_MAX;
};

PlayerFox.prototype.dash = function() {
  this.dashEffect.trigger(util.vec2.toVec3(this.pos, 0.5+this.height), util.vec2.toVec3(this.vel, 0.0));
  this.dashCooldown += this.DASH_COOLDOWN_ADD;
};

PlayerFox.prototype.taunt = function() {
  this.tauntEffect.trigger(util.vec2.toVec3(this.pos, 0.5+this.height), util.vec2.toVec3(this.vel, 0.0));
};

PlayerFox.prototype.setPos = PlayerObject.prototype.setPos;
PlayerFox.prototype.setVel = PlayerObject.prototype.setVel;
PlayerFox.prototype.setHeight = PlayerObject.prototype.setHeight;

PlayerFox.prototype.setLook = PlayerObject.prototype.setLook;
PlayerFox.prototype.setSpeed = PlayerObject.prototype.setSpeed;
PlayerFox.prototype.getDraw = PlayerObject.prototype.getDraw;

PlayerFox.prototype.destroy = function() {
  for(var i=0;i<this.effects.length;i++) {
    this.effects[i].destroy();
  }
  if(this.height > -1.0) {
    this.bloodEffect.trigger(util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, 0.0));
    this.impactDeathEffect.trigger(util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, 0.0));
  }
  else { this.fallDeathEffect.trigger(util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, 0.0)); }
};

PlayerFox.prototype.getType = function() {
  return "obj.player.fox";
};