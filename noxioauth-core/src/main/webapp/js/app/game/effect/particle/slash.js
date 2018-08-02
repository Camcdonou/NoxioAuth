"use strict";
/* global main */
/* global util */
/* global Particle */

/* Define Blip Particle System Class */
function ParticleSlash(game, pos, vel, colorA, colorB) {
  /* Colors to use for particles */
  this.colorA = colorA;
  this.colorB = colorB;
  Particle.call(this, game, pos, vel);
}

ParticleSlash.prototype.create = function() {
  var square = this.game.display.getModel("multi.square");
  
  var slashMat = this.game.display.getMaterial("character.marth.effect.slash");
  
  var parent = this;
  var colorA = function() { return util.vec4.copy3(parent.colorA, 1.0); };
  var colorB = function() { return util.vec4.copy3(parent.colorB, 0.75); };
  
  var norm = util.vec3.normalize(this.vel);
  
  var slash = {
    model: square,
    material: slashMat,
    delay: 0,
    length: 15,
    update: function(pos, vel) {
      this.properties.pos = pos;
    },
    properties: {
      pos: this.pos,
      scale: 2.0,
      angle: (util.vec2.angle(util.vec2.make(1, 0), norm)*(norm.y>0?-1:1))+(Math.PI*0.5),
      color: colorA(),
      tone: colorB()
    }
  };
  
  this.pushPart(slash);
};

ParticleSlash.prototype.pushPart = Particle.prototype.pushPart;

ParticleSlash.prototype.step = Particle.prototype.step;

ParticleSlash.prototype.getDraw = function(geometry, decals, lights, bounds) {
  for(var i=0;i<this.particles.length;i++) {
    var part = this.particles[i];
    var partUniformData = [
      {name: "transform", data: util.vec3.toArray(part.properties.pos)},
      {name: "scale", data: part.properties.scale},
      {name: "color", data: util.vec4.toArray(part.properties.color)},
      {name: "tone", data: util.vec4.toArray(part.properties.tone)},
      {name: "frame", data: this.frame},
      {name: "rotation", data: part.properties.angle}
    ];
    geometry.push({model: part.model, material: part.material, uniforms: partUniformData});
  }
};

ParticleSlash.prototype.active = Particle.prototype.active;

/* Used by EffectDefinition.js */
ParticleSlash.fxId = "particle";