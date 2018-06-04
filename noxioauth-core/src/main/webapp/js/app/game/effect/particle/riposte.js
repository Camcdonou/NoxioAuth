"use strict";
/* global main */
/* global util */
/* global Particle */

/* Define Blip Particle System Class */
function ParticleRiposte(game, pos, vel) {
  Particle.call(this, game, pos, vel);
  this.frame = 0;
}

ParticleRiposte.prototype.create = function() {
  var square = this.game.display.getModel("multi.square");
  var sheetVert = this.game.display.getModel("multi.sheetVert");
  
  var shockwaveMat = this.game.display.getMaterial("character.marth.effect.shockwave");
  var riposteMat = this.game.display.getMaterial("character.marth.effect.riposte");
  var slashMat = this.game.display.getMaterial("character.marth.effect.slash");
  
  var white = function(){ return {x: 0.65, y: 0.75, z: 1.0, w: 1.0}; };
  var lightwhite = function(){ return {x: 0.65, y: 0.75, z: 1.0, w: 0.5}; };
  
  var norm = util.vec3.normalize(this.vel);
  
  var shockwave  = {model: square, material: shockwaveMat, delay: 0, length: 5, update: function(pos){ this.properties.pos = util.vec3.add(pos, util.vec3.make(0,0,0.5)); this.properties.scale *= 1.25; this.properties.color.w -= 1.0/10.0;}, properties: {pos: util.vec3.add(this.pos, util.vec3.make(0,0,0.5)), scale: 1.0, color: lightwhite(), angle: 0.0}};
  var shockwaveGround  = {model: square, material: shockwaveMat, delay: 0, length: 5, update: function(pos){ this.properties.pos = util.vec3.add(pos, util.vec3.make(0,0,0.05)); this.properties.scale *= 1.25; this.properties.color.w -= 1.0/10.0;}, properties: {pos: util.vec3.add(this.pos, util.vec3.make(0,0,0.05)), scale: 1.0, color: lightwhite(), angle: 0.0}};
  
  var riposte = {
    model: sheetVert,
    material: riposteMat,
    delay: 0,
    length: 15,
    update: function(pos, vel) {
      this.properties.pos = pos;
    },
    properties: {
      pos: this.pos,
      scale: 1.25,
      angle: (util.vec2.angle(util.vec2.make(1, 0), norm)*(norm.y>0?-1:1)),
      color: white()
    }
  };
  
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
      color: white()
    }
  };
  
  this.pushPart(shockwave);
  this.pushPart(shockwaveGround);
  this.pushPart(slash);
  this.pushPart(riposte);
};

ParticleRiposte.prototype.pushPart = Particle.prototype.pushPart;

ParticleRiposte.prototype.step = function(pos, vel) {
  Particle.prototype.step.call(this, pos, vel);
  this.frame++;
};

ParticleRiposte.prototype.getDraw = function(geometry, decals, lights, bounds) {
  for(var i=0;i<this.particles.length;i++) {
    var part = this.particles[i];
    var partUniformData = [
      {name: "transform", data: util.vec3.toArray(part.properties.pos)},
      {name: "scale", data: part.properties.scale},
      {name: "color", data: util.vec4.toArray(part.properties.color)},
      {name: "frame", data: this.frame},
      {name: "rotation", data: part.properties.angle}
    ];
    geometry.push({model: part.model, material: part.material, uniforms: partUniformData});
  }
};

ParticleRiposte.prototype.active = Particle.prototype.active;

/* Used by EffectDefinition.js */
ParticleRiposte.fxId = "particle";