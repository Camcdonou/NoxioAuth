"use strict";
/* global main */
/* global util */
/* global Particle */

/* Define Critical Hit Particle System Class */
function ParticleCrit(game, pos, vel, colorA) {
  /* Colors to use for particles */
  this.colorA = colorA;
  Particle.call(this, game, pos, vel);
}

ParticleCrit.prototype.create = function() {
  var square = this.game.display.getModel("multi.square");
  
  var flareMat = this.game.display.getMaterial("multi.hit.critflare");
  var sparkMat = this.game.display.getMaterial("multi.hit.critspark");
  
  var parent = this;
  var colorA = function() { return util.vec4.copy(parent.colorA); };
  
  var flareA  = {model: square, material: flareMat, delay: 0, length: 7, update: function(pos){ this.properties.scale *= 1.155; this.properties.color.w = Math.min(1., this.properties.opacity); this.properties.opacity -= 2.0/this.length; this.properties.rotation -= 0.05; }, properties: {offset: util.vec3.make(0,0,0.4), scale: 1.85, color: colorA(), rotation: Math.random()*6.4, opacity: 2.0}};
  var flareB  = {model: square, material: flareMat, delay: 0, length: 8, update: function(pos){ this.properties.scale *= 1.17; this.properties.color.w = Math.min(1., this.properties.opacity); this.properties.opacity -= 2.0/this.length; this.properties.rotation += 0.04; }, properties: {offset: util.vec3.make(0,0,0.4), scale: 2.15, color: colorA(), rotation: Math.random()*6.4, opacity: 2.0}};
  var flareC  = {model: square, material: flareMat, delay: 0, length: 9, update: function(pos){ this.properties.scale *= 1.185; this.properties.color.w = Math.min(1., this.properties.opacity); this.properties.opacity -= 2.0/this.length; this.properties.rotation -= 0.03; }, properties: {offset: util.vec3.make(0,0,0.4), scale: 2.25, color: colorA(), rotation: Math.random()*6.4, opacity: 2.0}};
  this.pushPart(flareA);
  this.pushPart(flareB);
  this.pushPart(flareC);
  for(var i=0;i<22;i++) {
    var rand = util.vec3.random();
    this.pushPart({
      model: square,
      material: sparkMat,
      delay: 1,
      length: 21,
      update: function() {
        this.properties.scale -= 0.015;
        this.properties.speed *= 0.98;
        this.properties.pos = util.vec3.add(this.properties.pos, util.vec3.scale(this.properties.vel, this.properties.speed));
        this.properties.color.w -= 1.0/this.length;
        this.properties.rotation += 0.05;
      },
      properties: {pos: util.vec3.add(this.pos, util.vec3.scale(rand, 0.25)), vel: rand, scale: 0.225, speed: 0.155, color: colorA(), rotation: Math.random()*6.4}
    });
  }
};

ParticleCrit.prototype.pushPart = Particle.prototype.pushPart;

ParticleCrit.prototype.step = Particle.prototype.step;

ParticleCrit.prototype.getDraw = function(geometry, decals, lights, bounds) {
  for(var i=0;i<this.particles.length;i++) {
    var part = this.particles[i];
    var partUniformData = [
      {name: "scale", data: part.properties.scale},
      {name: "color", data: util.vec4.toArray(part.properties.color)},
      {name: "rotation", data: part.properties.rotation}
    ];
      
    if(part.properties.pos) { partUniformData.push({name: "transform", data: util.vec3.toArray(part.properties.pos)}); }
    if(part.properties.offset) { partUniformData.push({name: "transform", data: util.vec3.toArray(util.vec3.add(this.pos, part.properties.offset))}); }
    geometry.push({model: part.model, material: part.material, uniforms: partUniformData});
  }
};

ParticleCrit.prototype.active = Particle.prototype.active;

/* Used by EffectDefinition.js */
ParticleCrit.fxId = "particle";