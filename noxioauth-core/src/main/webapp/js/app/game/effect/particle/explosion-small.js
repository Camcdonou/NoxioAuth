"use strict";
/* global main */
/* global util */
/* global Particle */

/* Define Blip Particle System Class */
function ParticleExplosionSmall(game, pos, vel) {
  Particle.call(this, game, pos, vel);
}

ParticleExplosionSmall.prototype.create = function() {
  var square = this.game.display.getModel("multi.square");
  
  var explodeMat = this.game.display.getMaterial("character.voxel.effect.explode");
  
  var white = function(){ return {x: 0.65, y: 0.75, z: 1.0, w: 0.95}; };
  
  var explosion  = {model: square, material: explodeMat, delay: 0, length: 7, update: function(pos){ this.properties.pos = pos; this.properties.scale *= 1.15; this.properties.color.w += 0.05;}, properties: {pos: this.pos, scale: 0.7, color: white(), angle: 0.0}};
  
  this.pushPart(explosion);
};

ParticleExplosionSmall.prototype.pushPart = Particle.prototype.pushPart;

ParticleExplosionSmall.prototype.step = Particle.prototype.step;

ParticleExplosionSmall.prototype.getDraw = function(geometry, decals, lights, bounds) {
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

ParticleExplosionSmall.prototype.active = Particle.prototype.active;

/* Used by EffectDefinition.js */
ParticleExplosionSmall.fxId = "particle";