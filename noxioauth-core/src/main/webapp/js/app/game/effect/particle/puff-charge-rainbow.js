"use strict";
/* global main */
/* global util */
/* global Particle */

/* Define Puff Charging Slap Particle System Class */
function ParticlePuffChargeRainbow(game, pos, vel, colorA, colorB) {
  this.colorA = colorA;
  this.colorB = colorB;
  Particle.call(this, game, pos, vel);
}

ParticlePuffChargeRainbow.prototype.create = function() {
  var square = this.game.display.getModel("multi.square");
  
  var shockwaveMat = this.game.display.getMaterial("character.puff.effect.shockwaveRB");

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

ParticlePuffChargeRainbow.prototype.pushPart = Particle.prototype.pushPart;

ParticlePuffChargeRainbow.prototype.step = Particle.prototype.step;

ParticlePuffChargeRainbow.prototype.getDraw = function(geometry, decals, lights, bounds) {
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

ParticlePuffChargeRainbow.prototype.active = Particle.prototype.active;

/* Used by EffectDefinition.js */
ParticlePuffChargeRainbow.fxId = "particle";