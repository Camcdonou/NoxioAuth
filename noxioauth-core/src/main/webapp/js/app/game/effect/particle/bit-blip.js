"use strict";
/* global main */
/* global util */
/* global Particle */

/* Define Blip Particle System Class */
function ParticleBitBlip(game, pos, vel, colorA, colorB) {
  /* Colors to use for particles */
  this.colorA = colorA;
  this.colorB = colorB;
  Particle.call(this, game, pos, vel);
}

ParticleBitBlip.prototype.create = function() {
  var square = this.game.display.getModel("multi.square");
  
  var flashMat = this.game.display.getMaterial("character.box.effect.flash");
  var initMat = this.game.display.getMaterial("character.box.effect.initial");
  var blipMat = this.game.display.getMaterial("character.box.effect.blip");
  var sparkMat = this.game.display.getMaterial("character.box.effect.spark");
  
  var parent = this;
  var colorA = function() { return util.vec4.copy(parent.colorA); };
  var colorB = function() { return util.vec4.copy(parent.colorB); };
  var colorC = function() { return util.vec4.lerp(parent.colorA, util.vec4.make(1,1,1,1), 0.25); };
  
  var flash = {
    model: square,
    material: flashMat,
    delay: 0,
    max: 13,
    length: 8,
    update: function(pos){
      this.properties.pos = pos;
      this.properties.scale += 0.1;
      this.properties.color.w *= 0.85;
      this.properties.tone.w *= 0.8;
    },
    properties: {pos: this.pos, scale: 1.125, rotation: 0, color: colorC(), tone: colorB()}
  };
  
  var blipInit = {
    model: square,
    material: initMat,
    delay: 0,
    length: 4,
    update: function(pos){
      this.properties.pos = pos;
      this.properties.scale += 0.1;
      if(this.length <= 1) { this.properties.color.w = 0.5; this.properties.tone.w = 0.5; }
    },
    properties: {pos: this.pos, scale: 0.6, rotation: 0, color: colorC(), tone: colorB()}
  };
  
  var blip = {
    model: square,
    material: blipMat,
    delay: 3,
    length: 5,
    update: function(pos){
      this.properties.pos = pos;
      this.properties.scale += 0.1;
      this.properties.color.w = 1.0; this.properties.tone.w = 1.0;
    }, properties: {pos: this.pos, scale: 0.525, rotation: 0, color: colorA(), tone: colorB()}
  };
  
  this.pushPart(blip);
  this.pushPart(blipInit);
  this.pushPart(flash);
    
  for(var i=0;i<12;i++) {
    var rand = util.vec3.scale(util.vec3.random(), 0.125);
    var l = 14 + Math.floor(Math.random() * 13);
    this.pushPart({
      model: square,
      material: sparkMat,
      delay: Math.floor(Math.random() * 4) + 1,
      max: l,
      length: l,
      spawn: function(pos, vel) {
        
      },
      update: function(pos) {
        this.properties.scale += 0.004;
        this.properties.offset = util.vec3.add(this.properties.offset, this.properties.vel);
        this.properties.vel = util.vec3.scale(this.properties.vel, 0.925);
        this.properties.color.w -= 1.0/this.max;
        this.properties.tone.w -= 1.0/this.max;
        this.properties.rotation += 0.01;
      },
      properties: {offset: rand, vel: util.vec3.scale(rand, 0.125), scale: 0.09, rotation: Math.random()*6.4, color: colorA(), tone: colorB()}
    });
  }
};

ParticleBitBlip.prototype.pushPart = Particle.prototype.pushPart;

ParticleBitBlip.prototype.step = Particle.prototype.step;

ParticleBitBlip.prototype.getDraw = function(geometry, decals, lights, bounds) {
  for(var i=0;i<this.particles.length;i++) {
    var part = this.particles[i];
    var partUniformData = [
      {name: "scale", data: part.properties.scale},
      {name: "rotation", data: part.properties.rotation},
      {name: "color", data: util.vec4.toArray(part.properties.color)},
      {name: "tone", data: util.vec4.toArray(part.properties.tone)}
    ];
    if(part.properties.pos) { partUniformData.push({name: "transform", data: util.vec3.toArray(part.properties.pos)}); }
    if(part.properties.offset) { partUniformData.push({name: "transform", data: util.vec3.toArray(util.vec3.add(this.pos, part.properties.offset))}); }
    geometry.push({model: part.model, material: part.material, uniforms: partUniformData});
  }
};

ParticleBitBlip.prototype.active = Particle.prototype.active;

/* Used by EffectDefinition.js */
ParticleBitBlip.fxId = "particle";