"use strict";
/* global main */
/* global util */
/* global Particle */

/* Define Blip Particle System Class */
function ParticleShiekCharge(game, pos, vel, colorA, colorB) {
  /* Colors to use for particles */
  this.colorA = colorA;
  this.colorB = colorB;
  Particle.call(this, game, pos, vel);
}

ParticleShiekCharge.prototype.create = function() {
  var square = this.game.display.getModel("multi.square");
  
  var zapMat = this.game.display.getMaterial("multi.hit.zap");
  var markMat = this.game.display.getMaterial("character.shiek.effect.markwave");
  
  var parent = this;
  var colorA = function() { return util.vec4.copy(parent.colorA); };
  var colorB = function() { return util.vec4.copy(parent.colorB); };
  
  var waveA  = {
    model: square,
    material: markMat,
    delay: 0,
    max: 7,
    length: 7,
    update: function(pos){
      this.properties.scale *= 0.972;
      this.properties.rotation *= 0.95;
      this.properties.color.w += (this.max*0.5)-this.length<=0?0.15:-0.15;
      this.properties.tone.w += (this.max*0.5)-this.length<=0?0.15:-0.15;
    },
    properties: {offset: util.vec3.make(0,0,-0.2), scale: 2.0, color: util.vec4.copy3(colorA(), 0.05), tone: util.vec4.copy3(colorB(), 0.25), rotation: Math.random()*6.4}
  };
  
  this.pushPart(waveA);
  
  for(var i=0;i<5;i++) {
    this.pushPart({
      model: square,
      material: zapMat,
      delay: Math.floor(Math.random()*3),
      length: 7+Math.floor(Math.random()*3),
      update: function() {
        this.properties.scale += 0.01;
        this.properties.rotation += 0.0125;
      },
      properties: {offset: util.vec3.scale(util.vec3.random(), 0.4), scale: 0.425, rotation: Math.random()*6.28, color: colorA(), tone: colorB(), frame: Math.floor(Math.random()*32)}
    });
  }
};

ParticleShiekCharge.prototype.pushPart = Particle.prototype.pushPart;

ParticleShiekCharge.prototype.step = Particle.prototype.step;

ParticleShiekCharge.prototype.getDraw = function(geometry, decals, lights, bounds) {
  for(var i=0;i<this.particles.length;i++) {
    var part = this.particles[i];
    var partUniformData = [
      {name: "scale", data: part.properties.scale},
      {name: "color", data: util.vec4.toArray(part.properties.color)},
      {name: "tone", data: util.vec4.toArray(part.properties.tone)},
      {name: "totalSprites", data: 8},
      {name: "usedSprites", data: 8}
    ];
    if(part.properties.pos) { partUniformData.push({name: "transform", data: util.vec3.toArray(part.properties.pos)}); }
    if(part.properties.offset) { partUniformData.push({name: "transform", data: util.vec3.toArray(util.vec3.add(this.pos, part.properties.offset))}); }
    if(part.properties.rotation) { partUniformData.push({name: "rotation", data: part.properties.rotation}); }
    if(part.properties.angle) { partUniformData.push({name: "angle", data: util.vec3.toArray(part.properties.angle)}); }
    if(part.properties.frame) { partUniformData.push({name: "frame", data: Math.floor((part.properties.frame + this.frame) * 0.35)}); }
    geometry.push({model: part.model, material: part.material, uniforms: partUniformData});
  }
};

ParticleShiekCharge.prototype.active = Particle.prototype.active;

/* Used by EffectDefinition.js */
ParticleShiekCharge.fxId = "particle";