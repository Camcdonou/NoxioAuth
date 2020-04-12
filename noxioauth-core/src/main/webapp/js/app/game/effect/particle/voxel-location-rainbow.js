"use strict";
/* global main */
/* global util */
/* global Particle */

/* Define Voxel Location Rainbow Particle System Class */
function ParticleVoxelLocationRainbow(game, pos, vel) {
  Particle.call(this, game, pos, vel);
}

ParticleVoxelLocationRainbow.prototype.create = function() {
  var square = this.game.display.getModel("multi.square");
  
  var markMat = this.game.display.getMaterial("character.voxel.effect.markRB");
  
  var mark  = {
    model: square,
    material: markMat,
    delay: 0,
    length: 25,
    update: function(pos) {
      this.properties.pos = util.vec3.add(pos, util.vec3.make(0,0,0.05));
      this.properties.scale *= 1.05;
      this.properties.alpha.x -= 0.5/25;
      this.properties.alpha.y -= 0.5/25;
      this.properties.angle += 0.001;
    },
    properties: {pos: util.vec3.add(this.pos, util.vec3.make(0,0,0.05)), scale: 0.25, rotation: 0.0, alpha: util.vec2.make(0.5,0.5), frame: Math.floor(Math.random()*256)}
  };

  this.pushPart(mark);
};

ParticleVoxelLocationRainbow.prototype.pushPart = Particle.prototype.pushPart;

ParticleVoxelLocationRainbow.prototype.step = Particle.prototype.step;

ParticleVoxelLocationRainbow.prototype.getDraw = function(geometry, decals, lights, bounds) {
  for(var i=0;i<this.particles.length;i++) {
    var part = this.particles[i];
    var partUniformData = [
      {name: "transform", data: util.vec3.toArray(part.properties.pos)},
      {name: "scale", data: part.properties.scale},
      {name: "rotation", data: part.properties.rotation},
      {name: "frame", data: this.game.frame + (part.properties.frame?part.properties.frame:0)},
      {name: "alpha", data: util.vec2.toArray(part.properties.alpha)}
    ];
    geometry.push({model: part.model, material: part.material, uniforms: partUniformData});
  }
};

ParticleVoxelLocationRainbow.prototype.active = Particle.prototype.active;

/* Used by EffectDefinition.js */
ParticleVoxelLocationRainbow.fxId = "particle";