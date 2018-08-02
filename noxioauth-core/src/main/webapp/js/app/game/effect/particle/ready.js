"use strict";
/* global main */
/* global util */
/* global Particle */

/* Define Blip Particle System Class */
function ParticleReady(game, pos, vel, colorA, colorB) {
  /* Colors to use for particles */
  this.colorA = colorA;
  this.colorB = colorB;
  Particle.call(this, game, pos, vel);
}

ParticleReady.prototype.create = function() {
  var square = this.game.display.getModel("multi.square");
  
  var shockwaveMat = this.game.display.getMaterial("character.marth.effect.shockwaveGround");

  var parent = this;
  var colorA = function() { return util.vec4.copy3(parent.colorA, 0.75); };
  var colorB = function() { return util.vec4.copy3(parent.colorB, 0.65); };
  
  var shockwaveGround  = {
    model: square,
    material: shockwaveMat,
    delay: 0,
    length: 5,
    update: function(pos) {
      this.properties.pos = util.vec3.add(pos, util.vec3.make(0,0,0.05));
      this.properties.scale *= 1.25;
      this.properties.color.w -= 0.75/5;
      this.properties.tone.w -= 0.65/5;
    },
    properties: {
      pos: util.vec3.add(this.pos, util.vec3.make(0,0,0.05)),
       scale: 1.0,
       color: colorA(),
       tone: colorB(),
       angle: 0.0
     }
   };

  this.pushPart(shockwaveGround);
};

ParticleReady.prototype.pushPart = Particle.prototype.pushPart;

ParticleReady.prototype.step = Particle.prototype.step;

ParticleReady.prototype.getDraw = function(geometry, decals, lights, bounds) {
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

ParticleReady.prototype.active = Particle.prototype.active;

/* Used by EffectDefinition.js */
ParticleReady.fxId = "particle";