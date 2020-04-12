"use strict";
/* global main */
/* global util */
/* global Particle */

/* Define Blip Particle System Class */
function ParticleMark(game, pos, vel, colorA, colorB) {
  /* Colors to use for particles */
  this.colorA = colorA;
  this.colorB = colorB;
  Particle.call(this, game, pos, vel);
}

ParticleMark.prototype.create = function() {
  var square = this.game.display.getModel("multi.square");
  
  var markMat = this.game.display.getMaterial("character.voxel.effect.mark");

  var parent = this;
  var colorA = function() { return util.vec4.copy3(parent.colorA, 0.5); };
  
  var mark  = {model: square, material: markMat, delay: 0, length: 25, update: function(pos){ this.properties.pos = util.vec3.add(pos, util.vec3.make(0,0,0.05)); this.properties.scale *= 1.05; this.properties.color.w -= 0.5/25; this.properties.angle += 0.001; }, properties: {pos: util.vec3.add(this.pos, util.vec3.make(0,0,0.05)), scale: 0.25, color: colorA(), angle: 0.0}};

  this.pushPart(mark);
};

ParticleMark.prototype.pushPart = Particle.prototype.pushPart;

ParticleMark.prototype.step = Particle.prototype.step;

ParticleMark.prototype.getDraw = function(geometry, decals, lights, bounds) {
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

ParticleMark.prototype.active = Particle.prototype.active;

/* Used by EffectDefinition.js */
ParticleMark.fxId = "particle";