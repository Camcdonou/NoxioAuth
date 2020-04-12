"use strict";
/* global main */
/* global util */
/* global Particle */

/* Define Block Charging Slap Particle System Class */
function ParticleBlockChargeRainbow(game, pos, vel, colorA, colorB) {
  this.colorA = colorA;
  this.colorB = colorB;
  Particle.call(this, game, pos, vel);
}

ParticleBlockChargeRainbow.prototype.create = function() {
  var square = this.game.display.getModel("multi.square");
  
  var shockwaveMat = this.game.display.getMaterial("character.block.effect.shockwaveRB");

  var parent = this;
  
  var waveA  = {
    model: square,
    material: shockwaveMat,
    delay: 0,
    max: 9,
    length: 9,
    update: function(pos){
      this.properties.pos = util.vec3.add(pos, util.vec3.make(0,0,0.05));
      this.properties.scale *= 0.93;
      this.properties.angle += 0.055;
      this.properties.alpha.x += 1.0/this.max;
      this.properties.alpha.y += 1.0/this.max;
    },
    properties: {pos: util.vec3.add(this.pos, util.vec3.make(0,0,0.05)), scale: 2.7, alpha: util.vec2.make(0,0), frame: Math.floor(Math.random()*256), angle: Math.random()*6.4}
  };
  
  var waveB  = {
    model: square,
    material: shockwaveMat,
    delay: 0,
    max: 9,
    length: 9,
    update: function(pos){
      this.properties.pos = util.vec3.add(pos, util.vec3.make(0,0,0.05));
      this.properties.scale *= 0.93;
      this.properties.angle -= 0.045;
      this.properties.alpha.x += 0.7/this.max;
      this.properties.alpha.y += 0.7/this.max;
    },
    properties: {pos: util.vec3.add(this.pos, util.vec3.make(0,0,0.05)), scale: 2.55, alpha: util.vec2.make(0,0), frame: Math.floor(Math.random()*256), angle: Math.random()*6.4}
  };

  this.pushPart(waveA);
  this.pushPart(waveB);
};

ParticleBlockChargeRainbow.prototype.pushPart = Particle.prototype.pushPart;

ParticleBlockChargeRainbow.prototype.step = Particle.prototype.step;

ParticleBlockChargeRainbow.prototype.getDraw = function(geometry, decals, lights, bounds) {
  for(var i=0;i<this.particles.length;i++) {
    var part = this.particles[i];
    var partUniformData = [
      {name: "transform", data: util.vec3.toArray(part.properties.pos)},
      {name: "scale", data: part.properties.scale},
      {name: "rotation", data: part.properties.angle},
      {name: "alpha", data: util.vec2.toArray(part.properties.alpha)},
      {name: "frame", data: this.game.frame + (part.properties.frame?part.properties.frame:0)}
    ];
    geometry.push({model: part.model, material: part.material, uniforms: partUniformData});
  }
};

ParticleBlockChargeRainbow.prototype.active = Particle.prototype.active;

/* Used by EffectDefinition.js */
ParticleBlockChargeRainbow.fxId = "particle";