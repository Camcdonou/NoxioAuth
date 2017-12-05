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
  
  this.model = this.game.display.getModel("multi.smallBox");
  this.material = this.game.display.getMaterial("character.shiek.shiek");
  
  /* Constants */
  this.FLASH_CHARGE_LENGTH = 10;
  
  /* Settings */
  this.radius = 0.5; this.weight = 1.0; this.friction = 0.755;
  this.moveSpeed = 0.0385; this.jumpHeight = 0.175; this.cullRadius = 1.0;
  this.fatalImpactSpeed = 0.175;
  
  /* State */
  this.markLocation = undefined;

  /* Timers */
  this.chargeTimer = 0;

  /* Effects */
  this.attackEffect = new Effect([
    {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: ["character/shiek/attack0.wav", 0.5], update: function(snd){}, attachment: true, delay: 0, length: 33}
  ], false);
  
  this.markEffect = new Effect([
    {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: ["character/shiek/mark0.wav", 0.5], update: function(snd){}, attachment: true, delay: 0, length: 33}
  ], false);
  
  this.locationEffect = new Effect([
    {type: "light", class: PointLight, params: ["<vec3 pos>", util.vec4.make(0.45, 0.5, 1.0, 0.5), 1.0], update: function(lit){lit.color.w -= 0.5/25.0; lit.rad += 0.025;}, attachment: false, delay: 0, length: 25},
    {type: "particle", class: ParticleMark, params: [this.game, "<vec3 pos>", "<vec3 vel>"], update: function(prt){}, attachment: false, delay: 0, length: 25}
  ], true);
  
  this.noMarkEffect = new Effect([
    {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: ["character/shiek/mark1.wav", 0.5], update: function(snd){}, attachment: true, delay: 0, length: 33}
  ], false);
  
  this.chargeEffect = new Effect([
    {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: ["character/shiek/flash0.wav", 0.5], update: function(snd){}, attachment: true, delay: 0, length: 33}
  ], false);
  
  this.smokeEffect = new Effect([
    {type: "particle", class: ParticleSmoke, params: [this.game, "<vec3 pos>", "<vec3 vel>"], update: function(prt){}, attachment: false, delay: 0, length: 33}
  ], false);
  
  this.tauntEffect = new Effect([
    {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: ["character/shiek/taunt0.wav", 0.6], update: function(snd){}, attachment: true, delay: 0, length: 33}
  ], false);
  
  this.jumpEffect = new Effect([
    {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: [["character/shiek/jump0.wav", "character/shiek/jump1.wav", "character/shiek/jump2.wav", "character/shiek/jump3.wav"], 0.5], update: function(snd){}, attachment: true, delay: 0, length: 33}
  ], false);
  
  this.stunEffect = new Effect([
    {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: [["character/shiek/hit0.wav", "character/shiek/hit1.wav", "character/shiek/hit2.wav"], 0.8], update: function(snd){}, attachment: true, delay: 0, length: 33},
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
    {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: ["character/shiek/death0.wav", 0.8], update: function(snd){}, attachment: true, delay: 0, length: 60}
  ], false);
  
  this.fallDeathEffect = new Effect([
    {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: ["character/shiek/death1.wav", 0.8], update: function(snd){}, attachment: true, delay: 0, length: 99}
  ], false);
  
  this.effects.push(this.attackEffect); this.effects.push(this.chargeEffect); this.effects.push(this.markEffect); this.effects.push(this.noMarkEffect); this.effects.push(this.smokeEffect); this.effects.push(this.tauntEffect); this.effects.push(this.jumpEffect); this.effects.push(this.airEffect);
  this.effects.push(this.locationEffect); this.effects.push(this.stunEffect); this.effects.push(this.bloodEffect); this.effects.push(this.impactDeathEffect); this.effects.push(this.fallDeathEffect);
};

PlayerShiek.prototype.update = function(data) {
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
  
  var last = util.vec2.toVec3(this.pos, this.height); // Used to place smoke when teleporting
  
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
      case "jmp" : { this.jump(); break; }
      case "atk" : { this.attack(); break; }
      case "chr" : { this.charge(); break; }
      case "fsh" : { this.flash(last); break; }
      case "mrk" : { this.mark(); break; }
      case "nom" : { this.noMark(); break; }
      case "tnt" : { this.taunt(); break; }
      case "stn" : { this.stun(); break; }
      default : { break; }
    }
  }
  
  /* Update Timers */
  if(this.chargeTimer > 0) { this.chargeTimer--; }
  
  /* Step Effects */
  this.targetCircle.move(util.vec2.toVec3(this.pos, Math.min(this.height, 0.0)), 1.1);
  this.attackEffect.step(util.vec2.toVec3(this.pos, 0.25+this.height), util.vec2.toVec3(this.vel, 0.0));
  this.chargeEffect.step(util.vec2.toVec3(this.pos, 0.25+this.height), util.vec2.toVec3(this.vel, 0.0));
  this.markEffect.step(util.vec2.toVec3(this.pos, 0.25+this.height), util.vec2.toVec3(this.vel, 0.0));
  this.noMarkEffect.step(util.vec2.toVec3(this.pos, 0.25+this.height), util.vec2.toVec3(this.vel, 0.0));
  this.smokeEffect.step();
  this.locationEffect.step();
  this.airEffect.step();
  this.jumpEffect.step(util.vec2.toVec3(this.pos, 0.25+this.height), util.vec2.toVec3(this.vel, 0.0));
  this.tauntEffect.step(util.vec2.toVec3(this.pos, 0.25+this.height), util.vec2.toVec3(this.vel, 0.0));
  this.stunEffect.step(util.vec2.toVec3(this.pos, 0.75+this.height), util.vec2.toVec3(this.vel, 0.0));
  this.bloodEffect.step(util.vec2.toVec3(this.pos, 0.0+this.height), util.vec2.toVec3(this.vel, 0.0)); //@TODO remove?
};


PlayerShiek.prototype.air  = PlayerObject.prototype.air;
PlayerShiek.prototype.jump = PlayerObject.prototype.jump;
PlayerShiek.prototype.stun = function() {
  PlayerObject.prototype.stun.call(this);
  this.chargeEffect.destroy();
  this.chargeTimer = 0;
};

PlayerShiek.prototype.attack = function() {
  this.attackEffect.trigger(util.vec2.toVec3(this.pos, 0.25+this.height), util.vec2.toVec3(this.vel, 0.0));
};

PlayerShiek.prototype.charge = function() {
  this.chargeTimer = this.FLASH_CHARGE_LENGTH;
  this.chargeEffect.trigger(util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, 0.0));
};

PlayerShiek.prototype.flash = function(last) {
  this.smokeEffect.trigger(last, util.vec3.create());
  this.markLocation = undefined;
  this.locationEffect.destroy();
};

PlayerShiek.prototype.mark = function() {
  this.markEffect.trigger(util.vec2.toVec3(this.pos, 0.25+this.height), util.vec2.toVec3(this.vel, 0.0));
  this.markLocation = util.vec2.copy(this.pos);
  this.locationEffect.trigger(util.vec2.toVec3(this.pos, 0.0), util.vec2.toVec3(this.vel, 0.0));
};

PlayerShiek.prototype.noMark = function() {
  this.noMarkEffect.trigger(util.vec2.toVec3(this.pos, 0.25+this.height), util.vec2.toVec3(this.vel, 0.0));
};

PlayerShiek.prototype.taunt = function() {
  this.tauntEffect.trigger(util.vec2.toVec3(this.pos, 0.25+this.height), util.vec2.toVec3(this.vel, 0.0));
};

PlayerShiek.prototype.setPos = PlayerObject.prototype.setPos;
PlayerShiek.prototype.setVel = PlayerObject.prototype.setVel;
PlayerShiek.prototype.setHeight = PlayerObject.prototype.setHeight;

PlayerShiek.prototype.setLook = PlayerObject.prototype.setLook;
PlayerShiek.prototype.setSpeed = PlayerObject.prototype.setSpeed;
PlayerShiek.prototype.getDraw = function(geometry, decals, lights, bounds) {
  var exbounds = util.matrix.expandPolygon(bounds, this.cullRadius);
  if(util.intersection.pointPoly(this.pos, exbounds)) {
    var color;
    switch(this.team) {
      case  0 : { color = util.vec3.make(0.7539, 0.2421, 0.2421); break; }
      case  1 : { color = util.vec3.make(0.2421, 0.2421, 0.7539); break; }
      default : { color = util.vec3.make(0.5, 0.5, 0.5); break; }
    }
    if(this.chargeTimer > 0) {
      color = util.vec3.lerp(util.vec3.make(1.0, 1.0, 1.0), color, this.chargeTimer/this.FLASH_CHARGE_LENGTH);
    }
    
    var playerUniformData = [
      {name: "transform", data: [this.pos.x, this.pos.y, this.height]},
      {name: "color", data: util.vec3.toArray(color)}
    ];
    geometry.push({model: this.model, material: this.material, uniforms: playerUniformData});
    for(var i=0;i<this.effects.length;i++) {
      this.effects[i].getDraw(geometry, decals, lights, bounds);
    }
    this.targetCircle.getDraw(decals, bounds);
  }
};

PlayerShiek.prototype.destroy = function() {
  for(var i=0;i<this.effects.length;i++) {
    this.effects[i].destroy();
  }
  if(this.height > -1.0) {
    this.bloodEffect.trigger(util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, 0.0));
    this.impactDeathEffect.trigger(util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, 0.0));
  }
  else { this.fallDeathEffect.trigger(util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, 0.0)); }
};

PlayerShiek.prototype.getType = function() {
  return "obj.player.shiek";
};