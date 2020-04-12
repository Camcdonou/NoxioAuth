"use strict";
/* global main */
/* global util */
/* global Particle */

/* Define ParticleBlockSleepRainbow Particle System Class */
function ParticleBlockSleepRainbow(game, pos, vel) {
  Particle.call(this, game, pos, vel);
}

ParticleBlockSleepRainbow.prototype.create = function() {
  var square = this.game.display.getModel("multi.square");
  
  var sleepMat = this.game.display.getMaterial("character.block.effect.sleepRB");

  var parent = this;

  this.pushPart({
    model: square,
    material: sleepMat,
    delay: 0,
    length: 100,
    update: function(pos, vel) {
      this.properties.pos = util.vec3.add(pos, util.vec3.make(-0.125, 0.125, 0));
      this.properties.scale = ((Math.sin((parent.frame*0.1)+this.properties.wave)+1)*0.025)+0.125;
    },
    properties: {pos: util.vec3.add(this.pos, util.vec3.make(-0.125, 0.125, 0)), wave: 0.0, scale: 0.15, alpha: util.vec2.make(1,1), frame: Math.floor(Math.random()*256), angle: 0}
  });

  this.pushPart({
    model: square,
    material: sleepMat,
    delay: 0,
    length: 100,
    update: function(pos, vel) {
      this.properties.pos = util.vec3.add(pos, util.vec3.make(0, 0, 0.125));
      this.properties.scale = ((Math.sin((parent.frame*0.1)+this.properties.wave)+1)*0.025)+0.15;
    },
    properties: {pos: util.vec3.add(this.pos, util.vec3.make(0, 0, 0)), wave: 0.33, scale: 0.15, alpha: util.vec2.make(1,1), frame: Math.floor(Math.random()*256), angle: 0}
  });
  
  this.pushPart({
    model: square,
    material: sleepMat,
    delay: 0,
    length: 100,
    update: function(pos, vel) {
      this.properties.pos = util.vec3.add(pos, util.vec3.make(0.125, -0.125, 0.25));
      this.properties.scale = ((Math.sin((parent.frame*0.1)+this.properties.wave)+1)*0.025)+0.175;
    },
    properties: {pos: util.vec3.add(this.pos, util.vec3.make(0.125, -0.125, 0)), wave: 0.66, scale: 0.15, alpha: util.vec2.make(1,1), frame: Math.floor(Math.random()*256), angle: 0}
  });
};

ParticleBlockSleepRainbow.prototype.pushPart = Particle.prototype.pushPart;

ParticleBlockSleepRainbow.prototype.step = Particle.prototype.step;

ParticleBlockSleepRainbow.prototype.getDraw = function(geometry, decals, lights, bounds) {
  for(var i=0;i<this.particles.length;i++) {
    var part = this.particles[i];
    var partUniformData = [
      {name: "transform", data: util.vec3.toArray(part.properties.pos)},
      {name: "scale", data: part.properties.scale},
      {name: "rotation", data: part.properties.angle},
      {name: "alpha", data: util.vec2.toArray(part.properties.alpha)},
      {name: "frame", data: Math.floor(this.game.frame*0.33 + (part.properties.frame?part.properties.frame:0))}
    ];
    geometry.push({model: part.model, material: part.material, uniforms: partUniformData});
  }
};

ParticleBlockSleepRainbow.prototype.active = Particle.prototype.active;

/* Used by EffectDefinition.js */
ParticleBlockSleepRainbow.fxId = "particle";