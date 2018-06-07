"use strict";
/* global main */
/* global util */
/* global Particle */

/* Define Blip Particle System Class */
function ParticleCharge(game, pos, vel) {
  Particle.call(this, game, pos, vel);
}

ParticleCharge.prototype.create = function() {
  var square = this.game.display.getModel("multi.square");
  var flareModel = this.game.display.getModel("character.falco.effect.flareGround");
  
  var blipMat = this.game.display.getMaterial("character.falco.effect.charge");
  
  var white = function(){ return {x: 1.0, y: 1.0, z: 1.0, w: 0.25}; };
  
  var flare = {
    model: flareModel,
    material: blipMat,
    delay: 0,
    length: 20,
    update: function(pos) {
      this.properties.pos = pos;
      this.properties.scale.x *= 1.015;
      this.properties.scale.y *= 1.015;
      this.properties.scale.z *= 1.075;
      this.properties.color.w = Math.min(this.properties.color.w + 0.1, 1.0);
    },
    properties: {
      pos: this.pos,
      scale: util.vec3.make(0.7, 0.7, 0.125),
      color: white()
    }
  };
  
  this.pushPart(flare);
};

ParticleCharge.prototype.pushPart = Particle.prototype.pushPart;

ParticleCharge.prototype.step = Particle.prototype.step;

ParticleCharge.prototype.getDraw = function(geometry, decals, lights, bounds) {
  for(var i=0;i<this.particles.length;i++) {
    var part = this.particles[i];
    var partUniformData = [
      {name: "transform", data: util.vec3.toArray(part.properties.pos)},
      {name: "scale", data: util.vec3.toArray(part.properties.scale)},
      {name: "color", data: util.vec4.toArray(part.properties.color)},
      {name: "frame", data: this.frame},
      {name: "rotation", data: 0.0}
    ];
    geometry.push({model: part.model, material: part.material, uniforms: partUniformData});
  }
};

ParticleCharge.prototype.active = Particle.prototype.active;

/* Used by EffectDefinition.js */
ParticleCharge.fxId = "particle";