"use strict";
/* global main */
/* global util */
/* global Particle */

/* Define Blip Particle System Class */
function ParticleAirJump(game, pos, vel) {
  Particle.call(this, game, pos, vel);
}

ParticleAirJump.prototype.create = function() {
  var square = this.game.display.getModel("multi.square");
  
  var airmat = this.game.display.getMaterial("character.player.effect.airjump");

  var lightwhite = function(){ return {x: 1.0, y: 1.0, z: 1.0, w: 0.65}; };
  
  var norm = util.vec3.normalize(this.vel);
  
  var airA  = {model: square, material: airmat, delay: 0, length: 12, update: function(pos){ this.properties.pos = util.vec3.add(pos, util.vec3.make(0,0,0.05)); this.properties.scale *= 1+this.properties.growth; this.properties.growth *= 0.94; this.properties.color.w -= 0.65/12; this.properties.angle += 0.003; }, properties: {pos: util.vec3.add(this.pos, util.vec3.make(0,0,0.05)), scale: 0.23, growth: 0.24, color: lightwhite(), angle: 0.1}};
  var airB  = {model: square, material: airmat, delay: 0, length: 15, update: function(pos){ this.properties.pos = util.vec3.add(pos, util.vec3.make(0,0,0.05)); this.properties.scale *= 1+this.properties.growth; this.properties.growth *= 0.95; this.properties.color.w -= 0.65/15; this.properties.angle += 0.002; }, properties: {pos: util.vec3.add(this.pos, util.vec3.make(0,0,0.05)), scale: 0.21, growth: 0.21, color: lightwhite(), angle: -0.1}};
  var airC  = {model: square, material: airmat, delay: 0, length: 17, update: function(pos){ this.properties.pos = util.vec3.add(pos, util.vec3.make(0,0,0.05)); this.properties.scale *= 1+this.properties.growth; this.properties.growth *= 0.96; this.properties.color.w -= 0.65/17; this.properties.angle -= 0.004; }, properties: {pos: util.vec3.add(this.pos, util.vec3.make(0,0,0.05)), scale: 0.18, growth: 0.17, color: lightwhite(), angle: 0.0}};
  
  this.pushPart(airA); this.pushPart(airB);this.pushPart(airC);
};

ParticleAirJump.prototype.pushPart = Particle.prototype.pushPart;

ParticleAirJump.prototype.step = Particle.prototype.step;

ParticleAirJump.prototype.getDraw = function(geometry, decals, lights, bounds) {
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

ParticleAirJump.prototype.active = Particle.prototype.active;

/* Used by EffectDefinition.js */
ParticleAirJump.fxId = "particle";