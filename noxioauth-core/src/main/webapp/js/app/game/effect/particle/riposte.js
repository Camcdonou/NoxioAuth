"use strict";
/* global main */
/* global util */
/* global Particle */

/* Define Blip Particle System Class */
function ParticleRiposte(game, pos, vel, colorA, colorB) {
  /* Colors to use for particles */
  this.colorA = colorA;
  this.colorB = colorB;
  Particle.call(this, game, pos, vel);
}

ParticleRiposte.prototype.create = function() {
  var square = this.game.display.getModel("multi.square");
  var sheetVert = this.game.display.getModel("multi.sheetVert");
  
  var shockwaveMat = this.game.display.getMaterial("character.quad.effect.shockwave");
  var riposteMat = this.game.display.getMaterial("character.quad.effect.riposte");
  var slashMat = this.game.display.getMaterial("character.quad.effect.slash");
  
  var parent = this;
  var colorA = function() { return util.vec4.copy3(parent.colorA, 1.0); };
  var colorB = function() { return util.vec4.copy3(parent.colorB, 0.75); };
  var colorC = function() { return util.vec4.copy3(parent.colorA, 0.65); };
  var colorD = function() { return util.vec4.copy3(parent.colorB, 0.5); };
  
  var norm = util.vec3.normalize(this.vel);
  
  var shockwave  = {
    model: square,
    material: shockwaveMat,
    delay: 0,
    length: 5,
    update: function(pos) {
      this.properties.pos = util.vec3.add(pos, util.vec3.make(0,0,0.5));
      this.properties.scale *= 1.25;
      this.properties.color.w -= 0.65/5.0;
      this.properties.tone.w -= 0.5/5.0;
    }, 
    properties: {
      pos: util.vec3.add(this.pos, util.vec3.make(0,0,0.5)),
      scale: 1.0,
      color: colorC(),
      tone: colorD(),
      angle: 0.0
     }
   };
  var shockwaveGround  = {
    model: square,
    material: shockwaveMat,
    delay: 0,
    length: 5,
    update: function(pos) {
      this.properties.pos = util.vec3.add(pos, util.vec3.make(0,0,0.05));
      this.properties.scale *= 1.25;
      this.properties.color.w -= 0.65/5.0;
      this.properties.tone.w -= 0.5/5.0;
    },
    properties: {
      pos: util.vec3.add(this.pos, util.vec3.make(0,0,0.05)),
       scale: 1.0,
       color: colorC(),
       tone: colorD(),
       angle: 0.0
     }
   };
  
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
      color: colorA(),
      tone: colorB()
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
      color: colorA(),
      tone: colorB()
    }
  };
  
  this.pushPart(shockwave);
  this.pushPart(shockwaveGround);
  this.pushPart(slash);
  this.pushPart(riposte);
};

ParticleRiposte.prototype.pushPart = Particle.prototype.pushPart;

ParticleRiposte.prototype.step = Particle.prototype.step;

ParticleRiposte.prototype.getDraw = function(geometry, decals, lights, bounds) {
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

ParticleRiposte.prototype.active = Particle.prototype.active;

/* Used by EffectDefinition.js */
ParticleRiposte.fxId = "particle";