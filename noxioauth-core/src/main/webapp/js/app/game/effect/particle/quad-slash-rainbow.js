"use strict";
/* global main */
/* global util */
/* global Particle */

/* Define Blip Particle System Class */
function ParticleQuadSlashRainbow(game, pos, vel) {
  Particle.call(this, game, pos, vel);
}

ParticleQuadSlashRainbow.prototype.create = function() {
  var square = this.game.display.getModel("multi.square");
  
  var slashMat = this.game.display.getMaterial("character.quad.effect.slashRB");
  
  var parent = this;
  
  var norm = util.vec3.normalize(this.vel);
  
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
  
  this.pushPart(slash);
};

ParticleQuadSlashRainbow.prototype.pushPart = Particle.prototype.pushPart;

ParticleQuadSlashRainbow.prototype.step = Particle.prototype.step;

ParticleQuadSlashRainbow.prototype.getDraw = function(geometry, decals, lights, bounds) {
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

ParticleQuadSlashRainbow.prototype.active = Particle.prototype.active;

/* Used by EffectDefinition.js */
ParticleQuadSlashRainbow.fxId = "particle";