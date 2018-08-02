"use strict";
/* global main */
/* global util */
/* global Particle */

/* Define Ground shockwave on rest Particle System Class */
function ParticlePuffWaveRainbow(game, pos, vel) {
  Particle.call(this, game, pos, vel);
}

ParticlePuffWaveRainbow.prototype.create = function() {
  var square = this.game.display.getModel("multi.square");
  
  var waveMat = this.game.display.getMaterial("character.puff.effect.restwaveRB");
  
  var groundWave  = {model: square,
    material: waveMat,
    delay: 0,
    length: 5,
    update: function(pos){
      this.properties.scale *= 1.25;
      this.properties.alpha.x -= 0.75/5;
      this.properties.alpha.y -= 0.75/5;
    },
    properties: {offset: util.vec3.add(this.vel, util.vec3.make(0,0,0.05)), scale: 0.55, alpha: util.vec2.make(0.75,0.75), frame: Math.floor(Math.random()*256), angle: 0.0}
  };

  this.pushPart(groundWave);
};

ParticlePuffWaveRainbow.prototype.pushPart = Particle.prototype.pushPart;

ParticlePuffWaveRainbow.prototype.step = Particle.prototype.step;

ParticlePuffWaveRainbow.prototype.getDraw = function(geometry, decals, lights, bounds) {
  for(var i=0;i<this.particles.length;i++) {
    var part = this.particles[i];
    var partUniformData = [
      {name: "transform", data: util.vec3.toArray(util.vec3.add(this.pos, part.properties.offset))},
      {name: "scale", data: part.properties.scale},
      {name: "rotation", data: part.properties.angle},
      {name: "alpha", data: util.vec2.toArray(part.properties.alpha)},
      {name: "frame", data: this.game.frame + (part.properties.frame?part.properties.frame:0)}
    ];
    geometry.push({model: part.model, material: part.material, uniforms: partUniformData});
  }
};

ParticlePuffWaveRainbow.prototype.active = Particle.prototype.active;

/* Used by EffectDefinition.js */
ParticlePuffWaveRainbow.fxId = "particle";