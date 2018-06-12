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
  
  var flashMat = this.game.display.getMaterial("character.fox.effect.blipFlash");
  var initMat = this.game.display.getMaterial("character.fox.effect.blipInitial");
  var blipMat = this.game.display.getMaterial("character.fox.effect.blip");
  var sparkMat = this.game.display.getMaterial("character.fox.effect.spark");
  
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
      this.properties.scale += 0.15;
      this.properties.color.w *= 0.85;
      this.properties.tone.w *= 0.8;
    },
    properties: {pos: this.pos, scale: 2.05, rotation: 0, color: colorC(), tone: colorB()}
  };
  
  var blipInit = {
    model: square,
    material: initMat,
    delay: 0,
    length: 4,
    update: function(pos){
      this.properties.pos = pos;
      this.properties.scale += 0.15;
      if(this.length <= 1) { this.properties.color.w = 0.5; this.properties.tone.w = 0.5; }
    },
    properties: {pos: this.pos, scale: 1.0, rotation: 0, color: colorC(), tone: colorB()}
  };
  
  var blip = {
    model: square,
    material: blipMat,
    delay: 3,
    length: 5,
    update: function(pos){
      this.properties.pos = pos;
      this.properties.scale += 0.175;
      this.properties.color.w = 1.0; this.properties.tone.w = 1.0;
    }, properties: {pos: this.pos, scale: 0.95, rotation: 0, color: colorA(), tone: colorB()}
  };
  
  this.pushPart(blip);
  this.pushPart(blipInit);
  this.pushPart(flash);
    
  for(var i=0;i<12;i++) {
    var rand = util.vec3.random();
    var l = 15 + Math.floor(Math.random() * 15);
    this.pushPart({
      model: square,
      material: sparkMat,
      delay: Math.floor(Math.random() * 4) + 1,
      max: l,
      length: l,
      spawn: function(pos, vel) {
        this.properties.pos = util.vec3.add(pos, util.vec3.scale(this.properties.pos, 0.2));
        this.properties.vel = util.vec3.add(this.properties.vel, util.vec3.scale(vel, 0.5));
      },
      update: function(pos) {
        this.properties.scale += 0.005;
        this.properties.pos = util.vec3.add(this.properties.pos, this.properties.vel);
        this.properties.vel = util.vec3.scale(this.properties.vel, 0.91);
        this.properties.color.w -= 1.0/this.max;
        this.properties.tone.w -= 1.0/this.max;
        this.properties.rotation += 0.01;
      },
      properties: {pos: rand, vel: util.vec3.scale(rand, 0.075), scale: 0.175, rotation: Math.random()*6.4, color: colorA(), tone: colorB()}
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
      {name: "rotation", data: part.properties.rotation},
      {name: "color", data: util.vec4.toArray(part.properties.color)},
      {name: "tone", data: util.vec4.toArray(part.properties.tone)}
    ];
    geometry.push({model: part.model, material: part.material, uniforms: partUniformData});
  }
};

ParticleBlip.prototype.active = Particle.prototype.active;

/* Used by EffectDefinition.js */
ParticleBlip.fxId = "particle";