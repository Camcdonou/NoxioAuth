"use strict";
/* global main */
/* global util */
/* global Particle */

/* Define Hitmarker Particle System Class */
function ParticleHitMarker(game, pos, vel, colorA, colorB) {
  /* Colors to use for particles */
  this.colorA = colorA;
  this.colorB = colorB;
  Particle.call(this, game, pos, vel);
}

ParticleHitMarker.prototype.create = function() {
  var square = this.game.display.getModel("multi.square");
  
  var hitAMat = this.game.display.getMaterial("character.box.effect.hitA");
  var hitBMat = this.game.display.getMaterial("character.box.effect.hitB");
  var sparkMat = this.game.display.getMaterial("character.box.effect.spark");
  
  var parent = this;
  var colorA = function() { return util.vec4.copy(parent.colorA); };
  var colorB = function() { return util.vec4.copy(parent.colorB); };
  
  var hitA = {
    model: square,
    material: hitAMat,
    delay: 0,
    length: 5,
    update: function(pos){},
    properties: {offset: util.vec3.create(), scale: 1.25, rotation: 0, color: colorA(), tone: colorB()}
  };
  
  var hitB = {
    model: square,
    material: hitBMat,
    delay: 1,
    length: 4,
    update: function(pos){
      this.properties.scale += 0.125;
    }, properties: {offset: util.vec3.create(), scale: 1.0, rotation: 0, color: colorA(), tone: colorB()}
  };
  
  this.pushPart(hitA);
  this.pushPart(hitB);
    
//  for(var i=0;i<12;i++) {
//    var rand = util.vec3.scale(util.vec3.random(), 0.225);
//    var l = 14 + Math.floor(Math.random() * 13);
//    this.pushPart({
//      model: square,
//      material: sparkMat,
//      delay: Math.floor(Math.random() * 4) + 1,
//      max: l,
//      length: l,
//      spawn: function(pos, vel) {
//        
//      },
//      update: function(pos) {
//        this.properties.scale += 0.005;
//        this.properties.offset = util.vec3.add(this.properties.offset, this.properties.vel);
//        this.properties.vel = util.vec3.scale(this.properties.vel, 0.925);
//        this.properties.color.w -= 1.0/this.max;
//        this.properties.tone.w -= 1.0/this.max;
//        this.properties.rotation += 0.01;
//      },
//      properties: {offset: rand, vel: util.vec3.scale(rand, 0.185), scale: 0.145, rotation: Math.random()*6.4, color: colorA(), tone: colorB()}
//    });
//  }
};

ParticleHitMarker.prototype.pushPart = Particle.prototype.pushPart;

ParticleHitMarker.prototype.step = Particle.prototype.step;

ParticleHitMarker.prototype.getDraw = function(geometry, decals, lights, bounds) {
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

ParticleHitMarker.prototype.active = Particle.prototype.active;

/* Used by EffectDefinition.js */
ParticleHitMarker.fxId = "particle";