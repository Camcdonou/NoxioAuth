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
function PlayerInferno(game, oid, pos, vel) {
  PlayerObject.call(this, game, oid, pos, vel);
  
  this.model = this.game.display.getModel("character.player.player");
  this.material = this.game.display.getMaterial("character.inferno.inferno");
  this.icon = this.game.display.getMaterial("character.inferno.ui.iconlarge");
  
  /* Constants */
  this.GEN_COOLDOWN_LENGTH = 10;
  
  /* Settings */
  this.radius = 0.5; this.weight = 1.0; this.friction = 0.725;
  this.moveSpeed = 0.0350; this.jumpHeight = 0.250; this.cullRadius = 1.0;
  this.fatalImpactSpeed = 0.175;
  
  /* State */

  /* Timers */
  this.genCooldown = 0;
  
  /* Effects */
  this.tauntEffect = new Effect([
    {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: [["character/inferno/taunt0.wav", "character/inferno/taunt1.wav"], 0.8], update: function(snd){}, attachment: true, delay: 0, length: 33}
  ], false);
  
  this.jumpEffect = new Effect([
    {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: [["character/inferno/jump0.wav", "character/inferno/jump1.wav"], 0.5], update: function(snd){}, attachment: true, delay: 0, length: 33}
  ], false);
  
  this.stunEffect = new Effect([
    {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: [["character/inferno/hit0.wav", "character/inferno/hit1.wav"], 0.9], update: function(snd){}, attachment: true, delay: 0, length: 33},
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
    {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: ["character/inferno/death0.wav", 0.9], update: function(snd){}, attachment: true, delay: 0, length: 60}
  ], false);
  
  this.fallDeathEffect = new Effect([
    {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: ["character/inferno/death0.wav", 0.9], update: function(snd){}, attachment: true, delay: 0, length: 99}
  ], false);
  
  this.effects.push(this.tauntEffect); this.effects.push(this.jumpEffect); this.effects.push(this.airEffect);
  this.effects.push(this.stunEffect); this.effects.push(this.bloodEffect);
  this.effects.push(this.impactDeathEffect); this.effects.push(this.fallDeathEffect);
  
  /* UI */
  this.uiMeters = [
    {type: "bar", iconMat: this.game.display.getMaterial("character.player.ui.meterstub"), length: 16, scalar: 1.0}
  ];
};

PlayerInferno.prototype.update = function(data) {
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
      case "mov" : { this.ouch(); break; }
      case "jmp" : { this.jump(); break; }
      case "tnt" : { this.taunt(); break; }
      case "stn" : { this.stun(); break; }
      case "ult" : { this.ultimate = true; break; }
      default : { break; }
    }
  }
  
  /* Update Timers */
  if(this.genCooldown > 0) { this.genCooldown--; }
  
  /* Step Effects */
  var angle = (util.vec2.angle(util.vec2.make(1, 0), this.look)*(this.look.y>0?-1:1))+(Math.PI*0.5);
  this.targetCircle.move(util.vec2.toVec3(this.pos, Math.min(this.height, 0.0)), 1.1, angle);
  this.airEffect.step();
  this.jumpEffect.step(util.vec2.toVec3(this.pos, 0.25+this.height), util.vec2.toVec3(this.vel, 0.0));
  this.tauntEffect.step(util.vec2.toVec3(this.pos, 0.25+this.height), util.vec2.toVec3(this.vel, 0.0));
  this.stunEffect.step(util.vec2.toVec3(this.pos, 0.75+this.height), util.vec2.toVec3(this.vel, 0.0));
  this.bloodEffect.step(util.vec2.toVec3(this.pos, 0.0+this.height), util.vec2.toVec3(this.vel, 0.0));
  
  /* Update UI */
  this.uiMeters[0].scalar = 1.0-(this.genCooldown/this.GEN_COOLDOWN_LENGTH);
};

PlayerInferno.prototype.ouch = function() {
  this.genCooldown = this.GEN_COOLDOWN_LENGTH;
};

PlayerInferno.prototype.taunt = function() {
  this.tauntEffect.trigger(util.vec2.toVec3(this.pos, 0.25+this.height), util.vec2.toVec3(this.vel, 0.0));
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

PlayerInferno.prototype.destroy = function() {
  for(var i=0;i<this.effects.length;i++) {
    this.effects[i].destroy();
  }
  if(this.height > -1.0) {
    this.bloodEffect.trigger(util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, 0.0));
    this.impactDeathEffect.trigger(util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, 0.0));
  }
  else { this.fallDeathEffect.trigger(util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, 0.0)); }
};

PlayerInferno.prototype.getType = function() {
  return "obj.player.inferno";
};