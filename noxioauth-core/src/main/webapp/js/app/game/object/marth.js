"use strict";
/* global main */
/* global util */
/* global GameObject */
/* global PlayerObject */
/* global PointLight */
/* global ParticleStun */
/* global ParticleSlash */
/* global ParticleRiposte */
/* global ParticleReady */
/* global ParticleAirJump */
/* global ParticleBloodSplat */
/* global Decal */

/* Define PlayerMarth Class */
function PlayerMarth(game, oid, pos, vel) {
  PlayerObject.call(this, game, oid, pos, vel);
  
  this.model = this.game.display.getModel("multi.smallBox");
  this.material = this.game.display.getMaterial("character.marth.marth");
  this.icon = this.game.display.getMaterial("character.marth.ui.iconlarge");
  
  /* Constants */
  this.SLASH_COOLDOWN_LENGTH = 20;
  this.SLASH_COMBO_LENGTH = 3;
  this.SLASH_COMBO_DEGEN = 90;
  
  this.COUNTER_COOLDOWN_LENGTH = 45;
  this.COUNTER_ACTIVE_LENGTH = 7;
  this.COUNTER_LAG_LENGTH = 30;
  
  /* Settings */
  this.radius = 0.5; this.weight = 1.0; this.friction = 0.725;
  this.moveSpeed = 0.0375; this.jumpHeight = 0.175; this.cullRadius = 1.0;
  this.fatalImpactSpeed = 0.175;
  
  /* State */
  this.slashCooldown = 0;
  this.comboTimer = 0;
  this.comboCounter = 0;
  
  this.counterCooldown = 0;
  this.counterTimer = 0;

  /* Timers */

  /* Effects */
  this.slashEffect = new Effect([
    {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: ["character/marth/attack0.wav", 0.5], update: function(snd){}, attachment: true, delay: 0, length: 33},
    {type: "particle", class: ParticleSlash, params: [this.game, "<vec3 pos>", "<vec3 vel>"], update: function(prt){}, attachment: true, delay: 0, length: 15}
  ], false);
  
  this.slashHitEffect = new Effect([
    {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: ["character/marth/slash0.wav", 0.5], update: function(snd){}, attachment: true, delay: 0, length: 33}
  ], false);
  
  this.readyEffect = new Effect([
    {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: ["character/marth/ready0.wav", 0.4], update: function(snd){}, attachment: true, delay: 0, length: 33},
    {type: "particle", class: ParticleReady, params: [this.game, "<vec3 pos>", "<vec3 vel>"], update: function(prt){}, attachment: true, delay: 0, length: 15}
  ], false);
  
  this.comboEffect = new Effect([
    {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: [["character/marth/combo0.wav", "character/marth/combo1.wav", "character/marth/combo2.wav", "character/marth/combo3.wav", "character/marth/combo4.wav"], 0.4], update: function(snd){}, attachment: true, delay: 0, length: 33},
    {type: "particle", class: ParticleReady, params: [this.game, "<vec3 pos>", "<vec3 vel>"], update: function(prt){}, attachment: true, delay: 0, length: 15}
  ], false);
  
  this.comboHitEffect = new Effect([
    {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: ["character/marth/slash1.wav", 0.5], update: function(snd){}, attachment: true, delay: 0, length: 33}
  ], false);
  
  this.counterEffect = new Effect([
    {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: ["character/marth/counter0.wav", 0.8], update: function(snd){}, attachment: true, delay: 0, length: 33}
  ], false);
  
  this.riposteEffect = new Effect([
    {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: ["character/marth/riposte0.wav", 0.5], update: function(snd){}, attachment: true, delay: 0, length: 33},
    {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: [["character/marth/riposte1.wav", "character/marth/riposte2.wav", "character/marth/riposte3.wav"], 0.8], update: function(snd){}, attachment: true, delay: 0, length: 33},
    {type: "particle", class: ParticleRiposte, params: [this.game, "<vec3 pos>", "<vec3 vel>"], update: function(prt){}, attachment: true, delay: 0, length: 15}
  ], false);
  
  this.tauntEffect = new Effect([
    {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: [["character/marth/taunt0.wav", "character/marth/taunt1.wav", "character/marth/taunt2.wav", "character/marth/taunt3.wav", "character/marth/taunt4.wav"], 0.6], update: function(snd){}, attachment: true, delay: 0, length: 33}
  ], false);
  
  this.jumpEffect = new Effect([
    {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: [["character/marth/jump0.wav", "character/marth/jump1.wav", "character/marth/jump2.wav"], 0.6], update: function(snd){}, attachment: true, delay: 0, length: 33}
  ], false);
  
  this.stunEffect = new Effect([
    {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: [["character/marth/hit0.wav", "character/marth/hit1.wav", "character/marth/hit2.wav", "character/marth/hit3.wav"], 0.8], update: function(snd){}, attachment: true, delay: 0, length: 33},
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
    {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: ["character/marth/death0.wav", 0.8], update: function(snd){}, attachment: true, delay: 0, length: 60}
  ], false);
  
  this.fallDeathEffect = new Effect([
    {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: ["character/marth/death1.wav", 0.8], update: function(snd){}, attachment: true, delay: 0, length: 99}
  ], false);
  
  this.effects.push(this.slashEffect); this.effects.push(this.slashHitEffect); this.effects.push(this.readyEffect); this.effects.push(this.comboEffect); this.effects.push(this.comboHitEffect);
  this.effects.push(this.counterEffect); this.effects.push(this.riposteEffect);
  this.effects.push(this.jumpEffect); this.effects.push(this.airEffect); this.effects.push(this.stunEffect); this.effects.push(this.bloodEffect); this.effects.push(this.impactDeathEffect); this.effects.push(this.fallDeathEffect);
  this.effects.push(this.tauntEffect);
  
  /* UI */
  this.uiMeters = [
    {type: "dbr", iconMat: this.game.display.getMaterial("character.marth.ui.meterslash"), length: 16, scalara: 1.0, scalarb: 1.0},
    {type: "bcc", iconMat: this.game.display.getMaterial("character.marth.ui.metercounter"), length: 14, scalar: 0.0, count: 0, max: this.SLASH_COMBO_LENGTH}
  ];
};

PlayerMarth.prototype.update = function(data) {
  /* Apply update data to game */
  var team = parseInt(data.shift());
  var pos = util.vec2.parse(data.shift());
  var vel = util.vec2.parse(data.shift());
  var height = parseFloat(data.shift());
  var vspeed = parseFloat(data.shift());  
  var look = util.vec2.parse(data.shift());
  var speed = parseFloat(data.shift());
  var name = data.shift();
  var counterDir = util.vec2.parse(data.shift());
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
      case "jmp" : { this.jump(); break; }
      case "atk" : { this.slash(); break; }
      case "sht" : { this.slashHit(); break; }
      case "rdy" : { this.ready(); break; }
      case "cmb" : { this.combo(); break; }
      case "cht" : { this.comboHit(); break; }
      case "cnt" : { this.counter(); break; }
      case "rip" : { this.riposte(counterDir); break; }
      case "tnt" : { this.taunt(); break; }
      case "stn" : { this.stun(); break; }
      default : { break; }
    }
  }
  
  /* Update Timers */
  if(this.slashCooldown > 0) { this.slashCooldown--; }
  if(this.comboTimer > 0) { this.comboTimer--; }
  else if(this.comboTimer < 1 && this.comboCounter > 0) { this.comboCounter--; this.comboTimer = this.comboCounter>0?this.SLASH_COMBO_DEGEN:0; }
  if(this.counterCooldown > 0) { this.counterCooldown--; }
  if(this.counterTimer > 0) { this.counterTimer--; }
  
  /* Step Effects */
  var angle = (util.vec2.angle(util.vec2.make(1, 0), this.look)*(this.look.y>0?-1:1))+(Math.PI*0.5);
  this.targetCircle.move(util.vec2.toVec3(this.pos, Math.min(this.height, 0.0)), 1.1, angle);
  this.slashEffect.step(util.vec2.toVec3(this.pos, 0.25+this.height), util.vec2.toVec3(this.look, 0.0));
  this.slashHitEffect.step(util.vec2.toVec3(this.pos, 0.25+this.height), util.vec2.toVec3(this.look, 0.0));
  this.readyEffect.step(util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, 0.0));
  this.comboEffect.step(util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, 0.0));
  this.comboHitEffect.step(util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, 0.0));
  this.counterEffect.step(util.vec2.toVec3(this.pos, 0.25+this.height), util.vec2.toVec3(this.vel, 0.0));
  this.riposteEffect.step(util.vec2.toVec3(this.pos, this.height), util.vec3.make(1, 0, 0));
  this.airEffect.step();
  this.jumpEffect.step(util.vec2.toVec3(this.pos, 0.25+this.height), util.vec2.toVec3(this.vel, 0.0));
  this.tauntEffect.step(util.vec2.toVec3(this.pos, 0.25+this.height), util.vec2.toVec3(this.vel, 0.0));
  this.stunEffect.step(util.vec2.toVec3(this.pos, 0.75+this.height), util.vec2.toVec3(this.vel, 0.0));
  this.bloodEffect.step(util.vec2.toVec3(this.pos, 0.0+this.height), util.vec2.toVec3(this.vel, 0.0));
  
  /* Update UI */
  this.uiMeters[0].scalara = this.counterTimer>0?0.0:(1.0-(this.counterCooldown/(this.COUNTER_COOLDOWN_LENGTH-this.COUNTER_ACTIVE_LENGTH)));
  this.uiMeters[0].scalarb = this.counterTimer>0?1.0:(1.0-(this.counterCooldown/(this.COUNTER_COOLDOWN_LENGTH-this.COUNTER_ACTIVE_LENGTH)));
  this.uiMeters[1].count = this.comboCounter;
  this.uiMeters[1].scalar = this.comboTimer/this.SLASH_COMBO_DEGEN;
};

PlayerMarth.prototype.air  = PlayerObject.prototype.air;
PlayerMarth.prototype.jump = PlayerObject.prototype.jump;
PlayerMarth.prototype.stun = PlayerObject.prototype.stun;

PlayerMarth.prototype.slash = function() {
  this.slashEffect.trigger(util.vec2.toVec3(this.pos, 0.25+this.height), util.vec2.toVec3(this.look, 0.0));
  this.slashCooldown = this.SLASH_COOLDOWN_LENGTH;
};

PlayerMarth.prototype.slashHit = function() {
  this.slashHitEffect.trigger(util.vec2.toVec3(this.pos, 0.25+this.height), util.vec2.toVec3(this.look, 0.0));
  this.comboCounter++;
  this.comboTimer = this.SLASH_COMBO_DEGEN;
};

PlayerMarth.prototype.ready = function() {
  this.readyEffect.trigger(util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, 0.0));
  this.comboCounter = this.SLASH_COMBO_LENGTH;
};

PlayerMarth.prototype.combo = function() {
  this.comboEffect.trigger(util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, 0.0));
  this.comboCounter = 0;
};

PlayerMarth.prototype.comboHit = function() {
  this.comboHitEffect.trigger(util.vec2.toVec3(this.pos, 0.25+this.height), util.vec2.toVec3(this.look, 0.0));
  this.comboCounter++;
  this.comboTimer = this.SLASH_COMBO_DEGEN;
};

PlayerMarth.prototype.counter = function() {
  this.counterEffect.trigger(util.vec2.toVec3(this.pos, 0.25+this.height), util.vec2.toVec3(this.vel, 0.0));
  this.counterTimer = this.COUNTER_ACTIVE_LENGTH;
  this.counterCooldown = this.COUNTER_COOLDOWN_LENGTH;
};

PlayerMarth.prototype.riposte = function(dir) {
  this.riposteEffect.trigger(util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(dir, 0.0));
  this.counterCooldown = 5;
};

PlayerMarth.prototype.taunt = function() {
  this.tauntEffect.trigger(util.vec2.toVec3(this.pos, 0.25+this.height), util.vec2.toVec3(this.vel, 0.0));
};

PlayerMarth.prototype.setPos = PlayerObject.prototype.setPos;
PlayerMarth.prototype.setVel = PlayerObject.prototype.setVel;
PlayerMarth.prototype.setHeight = PlayerObject.prototype.setHeight;

PlayerMarth.prototype.setLook = PlayerObject.prototype.setLook;
PlayerMarth.prototype.setSpeed = PlayerObject.prototype.setSpeed;

PlayerMarth.prototype.getDraw = function(geometry, decals, lights, bounds) {
  var exbounds = util.matrix.expandPolygon(bounds, this.cullRadius);
  if(util.intersection.pointPoly(this.pos, exbounds)) {
    var color;
    switch(this.team) {
      case  0 : { color = util.vec3.make(0.7539, 0.2421, 0.2421); break; }
      case  1 : { color = util.vec3.make(0.2421, 0.2421, 0.7539); break; }
      default : { color = util.vec3.make(0.5, 0.5, 0.5); break; }
    }
    if(this.counterTimer > 0) {
      color = util.vec3.lerp(util.vec3.make(1.0, 1.0, 1.0), color, 1-(this.counterTimer/this.COUNTER_ACTIVE_LENGTH));
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

PlayerMarth.prototype.destroy = function() {
  for(var i=0;i<this.effects.length;i++) {
    this.effects[i].destroy();
  }
  if(this.height > -1.0) {
    this.bloodEffect.trigger(util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, 0.0));
    this.impactDeathEffect.trigger(util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, 0.0));
  }
  else { this.fallDeathEffect.trigger(util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, 0.0)); }
};

PlayerMarth.prototype.getType = function() {
  return "obj.player.marth";
};