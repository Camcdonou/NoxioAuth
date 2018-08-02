"use strict";
/* global main */
/* global util */
/* global Particle */

/* Define Blip Particle System Class */
function ParticleMarthRiposteRainbow(game, pos, vel) {
  Particle.call(this, game, pos, vel);
}

ParticleMarthRiposteRainbow.prototype.create = function() {
  var square = this.game.display.getModel("multi.square");
  var sheetVert = this.game.display.getModel("multi.sheetVert");
  
  var shockwaveMat = this.game.display.getMaterial("character.marth.effect.shockwaveRB");
  var riposteMat = this.game.display.getMaterial("character.marth.effect.riposteRB");
  var slashMat = this.game.display.getMaterial("character.marth.effect.slashRB");
  
  var parent = this;
  
  var norm = util.vec3.normalize(this.vel);
  
  var shockwave  = {
    model: square,
    material: shockwaveMat,
    delay: 0,
    length: 5,
    update: function(pos) {
      this.properties.pos = util.vec3.add(pos, util.vec3.make(0,0,0.5));
      this.properties.scale *= 1.25;
      this.properties.alpha.x -= 0.65/5.0;
      this.properties.alpha.y -= 0.5/5.0;
    }, 
    properties: { 
      pos: util.vec3.add(this.pos, util.vec3.make(0,0,0.5)),
      scale: 1.0,
      alpha: util.vec2.make(0.65,0.5),
      frame: Math.floor(Math.random()*256),
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
      this.properties.alpha.x -= 0.65/5.0;
      this.properties.alpha.y -= 0.5/5.0;
    },
    properties: {
      pos: util.vec3.add(this.pos, util.vec3.make(0,0,0.05)),
       scale: 1.0,
       alpha: util.vec2.make(0.65,0.5),
       frame: Math.floor(Math.random()*256),
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
      alpha: util.vec2.make(1,0.75),
      rbFrame: Math.floor(Math.random()*256)
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
      alpha: util.vec2.make(1,0.75),
      rbFrame: Math.floor(Math.random()*256)
    }
  };
  
  this.pushPart(shockwave);
  this.pushPart(shockwaveGround);
  this.pushPart(slash);
  this.pushPart(riposte);
};

ParticleMarthRiposteRainbow.prototype.pushPart = Particle.prototype.pushPart;

ParticleMarthRiposteRainbow.prototype.step = Particle.prototype.step;

ParticleMarthRiposteRainbow.prototype.getDraw = function(geometry, decals, lights, bounds) {
  for(var i=0;i<this.particles.length;i++) {
    var part = this.particles[i];
    var partUniformData = [
      {name: "transform", data: util.vec3.toArray(part.properties.pos)},
      {name: "scale", data: part.properties.scale},
      {name: "rotation", data: part.properties.angle},
      {name: "alpha", data: util.vec2.toArray(part.properties.alpha)}
    ];
    if(part.properties.rbFrame === undefined) { partUniformData.push({name: "frame", data: this.game.frame + (part.properties.frame?part.properties.frame:0)}); }
    else {
      partUniformData.push({name: "frame", data: this.frame});
      partUniformData.push({name: "rbFrame", data: this.game.frame + part.properties.rbFrame});
    }
    geometry.push({model: part.model, material: part.material, uniforms: partUniformData});
  }
};

ParticleMarthRiposteRainbow.prototype.active = Particle.prototype.active;

/* Used by EffectDefinition.js */
ParticleMarthRiposteRainbow.fxId = "particle";