"use strict";
/* global main */
/* global util */
/* global Particle */

/* Define Puff Charging Slap Particle System Class */
function ParticlePuffCharge(game, pos, vel, colorA, colorB) {
  this.colorA = colorA;
  this.colorB = colorB;
  Particle.call(this, game, pos, vel);
}

ParticlePuffCharge.prototype.create = function() {
  var square = this.game.display.getModel("multi.square");
  
  var shockwaveMat = this.game.display.getMaterial("character.puff.effect.shockwave");

  var parent = this;
  var colorA = function() { return util.vec4.copy3(parent.colorA, 0); };
  var colorB = function() { return util.vec4.copy3(parent.colorB, 0); };
  
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
      this.properties.color.w += 1.0/this.max;
    },
    properties: {pos: util.vec3.add(this.pos, util.vec3.make(0,0,0.05)), scale: 2.7, color: colorA(), angle: Math.random()*6.4}
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
      this.properties.color.w += 0.7/this.max;
    },
    properties: {pos: util.vec3.add(this.pos, util.vec3.make(0,0,0.05)), scale: 2.55, color: colorA(), angle: Math.random()*6.4}
  };

  this.pushPart(waveA);
  this.pushPart(waveB);
};

ParticlePuffCharge.prototype.pushPart = Particle.prototype.pushPart;

ParticlePuffCharge.prototype.step = Particle.prototype.step;

ParticlePuffCharge.prototype.getDraw = function(geometry, decals, lights, bounds) {
  for(var i=0;i<this.particles.length;i++) {
    var part = this.particles[i];
    var partUniformData = [
      {name: "transform", data: util.vec3.toArray(part.properties.pos)},
      {name: "scale", data: part.properties.scale},
      {name: "color", data: util.vec4.toArray(part.properties.color)},
      {name: "frame", data: this.frame},
      {name: "rotation", data: part.properties.angle}
    ];
    geometry.push({model: part.model, material: part.material, uniforms: partUniformData});
  }
};

ParticlePuffCharge.prototype.active = Particle.prototype.active;

/* Used by EffectDefinition.js */
ParticlePuffCharge.fxId = "particle";