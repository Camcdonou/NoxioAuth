"use strict";
/* global main */
/* global util */
/* global GameObject */
/* global PointLight */
/* global ParticleExplosionSmall */

/* Define Bomb Object Class */
function BombObject(game, oid, pos, vel) {
  GameObject.call(this, game, oid, pos, vel);
  
  this.model = this.game.display.getModel("object.bomb.bomb");
  this.material = this.game.display.getMaterial("object.bomb.bomb");
  
  /* Settings */
  this.radius = 0.1; this.weight = 1.0; this.friction = 0.625;
  this.cullRadius = 1.0;

  /* State */
  this.team = -1;
  
  /* Effects */
  this.impactEffect = {
    effect: new Effect([
      {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: ["character/shiek/grenade1.wav", 0.3], update: function(snd){}, attachment: true, delay: 0, length: 33}
    ], false),
    offset: util.vec3.make(0,0,0.05),
    trigger: PlayerObject.prototype.effectTrigger};
  this.effects.push(this.impactEffect);
  
  this.detonateEffect = {
    effect: new Effect([
      {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: ["character/shiek/grenade2.wav", 0.2], update: function(snd){}, attachment: false, delay: 0, length: 33},
      {type: "light", class: PointLight, params: ["<vec3 pos>", util.vec4.make(0.972, 0.820, 0.523, 0.95), 1.05], update: function(lit){lit.color.w -= 0.95/7.0; lit.rad += 0.065;}, attachment: false, delay: 0, length: 7},
      {type: "particle", class: ParticleExplosionSmall, params: [this.game, "<vec3 pos>", "<vec3 vel>"], update: function(prt){}, attachment: false, delay: 0, length: 7}
    ], false),
    offset: util.vec3.make(0,0,0.05),
    trigger: PlayerObject.prototype.effectTrigger};
  this.effects.push(this.detonateEffect);
};

BombObject.prototype.update = function(data) {
  /* Apply update data to object */
  var team = parseInt(data.shift());
  var pos = util.vec2.parse(data.shift());
  var vel = util.vec2.parse(data.shift());
  var height = parseFloat(data.shift());
  var vspeed = parseFloat(data.shift()); 
  var effects = data.shift().split(",");
  
  this.team = team;
  this.setPos(pos);
  this.setVel(vel);
  this.setHeight(height, vspeed);
  for(var i=0;i<effects.length-1;i++) {
    switch(effects[i]) {
      case "imp" : { this.impact(); break; }
      default : { main.menu.warning.show("Invalid effect value: '" + effects[i] + "' @ Bomb.js :: update()"); break; }
    }
  }
  
  /* Timers */
  
  /* Step Effects */
  for(var i=0;i<this.effects.length;i++) {
    this.effects[i].effect.step(util.vec3.add(this.effects[i].offset, util.vec2.toVec3(this.pos, this.height)), util.vec2.toVec3(this.vel, this.vspeed));
  }
};

BombObject.prototype.setPos = GameObject.prototype.setPos;
BombObject.prototype.setVel = GameObject.prototype.setVel;
BombObject.prototype.setHeight = GameObject.prototype.setHeight;

BombObject.prototype.impact = function() {
  this.impactEffect.trigger(util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed));
};

BombObject.prototype.getDraw = function(geometry, decals, lights, bounds) {
  var exbounds = util.matrix.expandPolygon(bounds, this.cullRadius);
  if(util.intersection.pointPoly(this.pos, exbounds)) {
    var color;
    switch(this.team) {
      case  0 : { color = util.vec3.make(0.7539, 0.2421, 0.2421); break; }
      case  1 : { color = util.vec3.make(0.2421, 0.2421, 0.7539); break; }
      default : { color = util.vec3.make(0.5, 0.5, 0.5); break; }
    }
    
    var bombUniformData = [
      {name: "transform", data: [this.pos.x, this.pos.y, this.height]},
      {name: "color", data: util.vec3.toArray(color)},
      {name: "rotation", data: 0.0},
      {name: "scale", data: 1.0}
    ];
    geometry.push({model: this.model, material: this.material, uniforms: bombUniformData});
    for(var i=0;i<this.effects.length;i++) {
      this.effects[i].effect.getDraw(geometry, decals, lights, bounds);
    }
  }
};

BombObject.prototype.destroy = function() {
  for(var i=0;i<this.effects.length;i++) {
    this.effects[i].effect.destroy();
  }
  this.detonateEffect.trigger(util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed));
};

BombObject.prototype.type = function() { return "bmb"; };