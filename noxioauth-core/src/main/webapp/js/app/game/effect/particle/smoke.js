"use strict";
/* global main */
/* global util */
/* global Particle */

/* Define Smoke Particle System Class */
function ParticleSmoke(game, pos, vel) {
  Particle.call(this, game, pos, vel);
}

ParticleSmoke.prototype.create = function() {
  var square = this.game.display.getModel("multi.square");
  
  var smokeMat = this.game.display.getMaterial("character.shiek.effect.smoke");
  var shockwaveMat = this.game.display.getMaterial("character.shiek.effect.shockwave");
  var flashMat = this.game.display.getMaterial("character.shiek.effect.flash");
  
  var white = function(){ return {x: 1.0, y: 1.0, z: 1.0, w: 1.25}; };
  var lightwhite = function(){ return {x: 1.0, y: 1.0, z: 1.0, w: 0.5}; };
  var grey = function(){ return {x: 0.75, y: 0.75, z: 0.75, w: 1.0}; };
  
  var flash  = {model: square, material: flashMat, delay: 0, length: 5, update: function(pos){ this.properties.pos = util.vec3.add(pos, util.vec3.make(0,0,0.5)); this.properties.scale *= 1.25; this.properties.color.w -= 1.0/5.0;}, properties: {pos: util.vec3.add(this.pos, util.vec3.make(0,0,0.5)), scale: 1.5, color: white(), angle: 0.0}};
  var shockwave  = {model: square, material: shockwaveMat, delay: 0, length: 8, update: function(pos){ this.properties.pos = util.vec3.add(pos, util.vec3.make(0,0,0.05)); this.properties.scale *= 1.25; this.properties.color.w -= 0.5/8;}, properties: {pos: util.vec3.add(this.pos, util.vec3.make(0,0,0.05)), scale: 0.5, color: lightwhite(), angle: 0.0}};
  
  this.pushPart(shockwave);
  
  for(var i=0;i<9;i++) {
    var randPos = util.vec3.random(); randPos.z = Math.abs(randPos.z);
    var randVel = util.vec3.random(); randVel.z = Math.abs(randVel.z);
    var randAng = Math.random()*(Math.PI*2);
    this.pushPart({
      model: square,
      material: smokeMat,
      delay: 1,
      length: 33,
      update: function() {
        this.properties.pos = util.vec3.add(this.properties.pos, this.properties.vel);
        this.properties.vel = util.vec3.add(this.properties.vel, util.vec3.make(0,0,0.0015));
        this.properties.vel = util.vec3.scale(this.properties.vel, 0.93);
        this.properties.scale *= 1.05;
        this.properties.color.w -= 1.0/33.0;
      },
      properties: {pos: util.vec3.add(this.pos, util.vec3.scale(randPos, 0.15)), vel: util.vec3.scale(randVel, 0.05), scale: 0.35, color: grey(), angle: randAng}
    });
  }
  
  this.pushPart(flash);
};

ParticleSmoke.prototype.pushPart = Particle.prototype.pushPart;

ParticleSmoke.prototype.step = Particle.prototype.step;

ParticleSmoke.prototype.getDraw = function(geometry, decals, lights, bounds) {
  for(var i=0;i<this.particles.length;i++) {
    var part = this.particles[i];
    var partUniformData = [
      {name: "transform", data: util.vec3.toArray(part.properties.pos)},
      {name: "scale", data: part.properties.scale},
      {name: "color", data: util.vec4.toArray(part.properties.color)},
      {name: "rotation", data: part.properties.angle}
    ];
    geometry.push({model: part.model, material: part.material, uniforms: partUniformData});
  }
};

ParticleSmoke.prototype.active = Particle.prototype.active;

/* Used by EffectDefinition.js */
ParticleSmoke.fxId = "particle";