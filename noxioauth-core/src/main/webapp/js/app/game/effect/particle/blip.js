"use strict";
/* global main */
/* global util */
/* global Particle */

/* Define Blip Particle System Class */
function ParticleBlip(game, pos, vel, colorA, colorB) {
  /* Colors to use for particles */
  this.colorA = colorA;
  this.colorB = colorB;
  Particle.call(this, game, pos, vel);
}

ParticleBlip.prototype.create = function() {
  var square = this.game.display.getModel("multi.square");
  
  var shockwaveMat = this.game.display.getMaterial("character.fox.effect.shockwave");
  var blipBrightMat = this.game.display.getMaterial("character.fox.effect.blipBright");
  var blipMat = this.game.display.getMaterial("character.fox.effect.blip");
  var sparkMat = this.game.display.getMaterial("character.fox.effect.spark");
  
  var parent = this;
  var colorA = function() { return util.vec4.copy(parent.colorA); };
  var colorB = function() { return util.vec4.copy(parent.colorB); };
  
  var shockwave  = {model: square, material: shockwaveMat, delay: 0, length: 5, update: function(pos){ this.properties.pos = pos; this.properties.scale *= 1.25; this.properties.color.w -= 1.0/5.0;}, properties: {pos: this.pos, scale: 1.25, color: colorA()}};
  var blipBright = {model: square, material: blipBrightMat, delay: 0, length: 3, update: function(pos){ this.properties.pos = pos; }, properties: {pos: this.pos, scale: 1.25, color: colorA(), tone: colorB()}};
  var blip       = {model: square, material: blipMat, delay: 2, length: 4, update: function(pos){ this.properties.pos = pos; this.properties.scale += 0.2;}, properties: {pos: this.pos, scale: 1.25, color: colorA(), tone: colorB()}};
  this.pushPart(shockwave);
  this.pushPart(blipBright);
  this.pushPart(blip);
  for(var i=0;i<6;i++) {
    var rand = util.vec3.random();
    this.pushPart({
      model: square,
      material: sparkMat,
      delay: 1,
      length: 22,
      update: function() {
        this.properties.scale += 0.005;
        this.properties.speed *= 0.95;
        this.properties.pos = util.vec3.add(this.properties.pos, util.vec3.scale(this.properties.vel, this.properties.speed));
        this.properties.color.w -= 1.0/22.0;
      },
      properties: {pos: util.vec3.add(this.pos, util.vec3.scale(rand, 0.3)), vel: rand, scale: 0.175, speed: 0.1, color: colorA()}
    });
  }
};

ParticleBlip.prototype.pushPart = Particle.prototype.pushPart;

ParticleBlip.prototype.step = Particle.prototype.step;

ParticleBlip.prototype.getDraw = function(geometry, decals, lights, bounds) {
  for(var i=0;i<this.particles.length;i++) {
    var part = this.particles[i];
    var partUniformData = [
      {name: "transform", data: util.vec3.toArray(part.properties.pos)},
      {name: "scale", data: part.properties.scale},
      {name: "color", data: util.vec4.toArray(part.properties.color)},
      {name: "rotation", data: 0.0}
    ];
    if(part.properties.tone) { partUniformData.push({name: "tone", data: util.vec4.toArray(part.properties.tone)}); } /* second color used by 2tone shader */
    geometry.push({model: part.model, material: part.material, uniforms: partUniformData});
  }
};

ParticleBlip.prototype.active = Particle.prototype.active;

/* Used by EffectDefinition.js */
ParticleBlip.fxId = "particle";