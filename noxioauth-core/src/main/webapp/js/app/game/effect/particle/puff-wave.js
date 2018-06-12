"use strict";
/* global main */
/* global util */
/* global Particle */

/* Define Ground shockwave on rest Particle System Class */
function ParticlePuffWave(game, pos, vel) {
  Particle.call(this, game, pos, vel);
}

ParticlePuffWave.prototype.create = function() {
  var square = this.game.display.getModel("multi.square");
  
  var waveMat = this.game.display.getMaterial("character.puff.effect.restwave");
  
  var white = function(){ return util.vec4.make(1, 1, 1, 0.75); };
  
  var groundWave  = {model: square,
    material: waveMat,
    delay: 0,
    length: 5,
    update: function(pos){
      this.properties.pos = util.vec3.add(pos, util.vec3.make(0,0,0.05));
      this.properties.scale *= 1.25; this.properties.color.w -= 0.75/5;
    },
    properties: {offset: util.vec3.add(this.vel, util.vec3.make(0,0,0.05)), scale: 0.55, color: white(), angle: 0.0}
  };

  this.pushPart(groundWave);
};

ParticlePuffWave.prototype.pushPart = Particle.prototype.pushPart;

ParticlePuffWave.prototype.step = Particle.prototype.step;

ParticlePuffWave.prototype.getDraw = function(geometry, decals, lights, bounds) {
  for(var i=0;i<this.particles.length;i++) {
    var part = this.particles[i];
    var partUniformData = [
      {name: "transform", data: util.vec3.toArray(util.vec3.add(this.pos, part.properties.offset))},
      {name: "scale", data: part.properties.scale},
      {name: "color", data: util.vec4.toArray(part.properties.color)},
      {name: "rotation", data: part.properties.angle}
    ];
    geometry.push({model: part.model, material: part.material, uniforms: partUniformData});
  }
};

ParticlePuffWave.prototype.active = Particle.prototype.active;

/* Used by EffectDefinition.js */
ParticlePuffWave.fxId = "particle";