"use strict";
/* global main */
/* global util */
/* global Particle */

/* Define Voxel Teleport Charge Rainbow Particle System Class */
function ParticleVoxelChargeRainbow(game, pos, vel) {
  Particle.call(this, game, pos, vel);
}

ParticleVoxelChargeRainbow.prototype.create = function() {
  var square = this.game.display.getModel("multi.square");
  
  var zapMat = this.game.display.getMaterial("multi.hit.zapRB");
  var markMat = this.game.display.getMaterial("character.voxel.effect.markwaveRB");
  
  var parent = this;
  
  var waveA  = {
    model: square,
    material: markMat,
    delay: 0,
    max: 7,
    length: 7,
    update: function(pos){
      this.properties.scale *= 0.972;
      this.properties.rotation *= 0.95;
      this.properties.alpha.x += (this.max*0.5)-this.length<=0?0.15:-0.15;
      this.properties.alpha.y += (this.max*0.5)-this.length<=0?0.15:-0.15;
    },
    properties: {offset: util.vec3.make(0,0,-0.2), scale: 2.0, alpha: util.vec2.make(0.1,0.1), frame: Math.floor(Math.random()*256), rotation: Math.random()*6.4}
  };
  
  this.pushPart(waveA);
  
  for(var i=0;i<5;i++) {
    this.pushPart({
      model: square,
      material: zapMat,
      delay: Math.floor(Math.random()*3),
      length: 7+Math.floor(Math.random()*3),
      update: function() {
        this.properties.scale += 0.01;
        this.properties.rotation += 0.0125;
      },
      properties: {offset: util.vec3.scale(util.vec3.random(), 0.4), scale: 0.425, rotation: Math.random()*6.28, alpha: util.vec2.make(1,1), rbFrame: Math.floor(Math.random()*256), frame: Math.floor(Math.random()*32)}
    });
  }
};

ParticleVoxelChargeRainbow.prototype.pushPart = Particle.prototype.pushPart;

ParticleVoxelChargeRainbow.prototype.step = Particle.prototype.step;

ParticleVoxelChargeRainbow.prototype.getDraw = function(geometry, decals, lights, bounds) {
  for(var i=0;i<this.particles.length;i++) {
    var part = this.particles[i];
    var partUniformData = [
      {name: "scale", data: part.properties.scale},
      {name: "totalSprites", data: 8},
      {name: "usedSprites", data: 8},
      {name: "alpha", data: util.vec2.toArray(part.properties.alpha)}
    ];
    if(part.properties.pos) { partUniformData.push({name: "transform", data: util.vec3.toArray(part.properties.pos)}); }
    if(part.properties.offset) { partUniformData.push({name: "transform", data: util.vec3.toArray(util.vec3.add(this.pos, part.properties.offset))}); }
    if(part.properties.rotation) { partUniformData.push({name: "rotation", data: part.properties.rotation}); }
    if(part.properties.angle) { partUniformData.push({name: "angle", data: util.vec3.toArray(part.properties.angle)}); }
    if(part.properties.rbFrame === undefined) { partUniformData.push({name: "frame", data: this.game.frame + (part.properties.frame?part.properties.frame:0)}); }
    else {
      partUniformData.push({name: "frame", data: Math.floor((part.properties.frame + this.frame) * 0.35)});
      partUniformData.push({name: "rbFrame", data: this.game.frame + part.properties.rbFrame});
    }
    geometry.push({model: part.model, material: part.material, uniforms: partUniformData});
  }
};

ParticleVoxelChargeRainbow.prototype.active = Particle.prototype.active;

/* Used by EffectDefinition.js */
ParticleVoxelChargeRainbow.fxId = "particle";