"use strict";
/* global main */
/* global util */
/* global Particle */

/* Define Blip Particle System Class */
function ParticleQuadReadyRainbow(game, pos, vel) {
  Particle.call(this, game, pos, vel);
}

ParticleQuadReadyRainbow.prototype.create = function() {
  var square = this.game.display.getModel("multi.square");
  
  var shockwaveMat = this.game.display.getMaterial("character.quad.effect.shockwaveGroundRB");

  var parent = this;
  
  var shockwaveGround  = {
    model: square,
    material: shockwaveMat,
    delay: 0,
    length: 5,
    update: function(pos) {
      this.properties.pos = util.vec3.add(pos, util.vec3.make(0,0,0.05));
      this.properties.scale *= 1.25;
      this.properties.alpha.x -= 0.75/5;
      this.properties.alpha.y -= 0.65/5;
    },
    properties: {
      pos: util.vec3.add(this.pos, util.vec3.make(0,0,0.05)), scale: 1.0, alpha: util.vec2.make(0.75,0.65), frame: Math.floor(Math.random()*256), angle: 0.0}
   };

  this.pushPart(shockwaveGround);
};

ParticleQuadReadyRainbow.prototype.pushPart = Particle.prototype.pushPart;

ParticleQuadReadyRainbow.prototype.step = Particle.prototype.step;

ParticleQuadReadyRainbow.prototype.getDraw = function(geometry, decals, lights, bounds) {
  for(var i=0;i<this.particles.length;i++) {
    var part = this.particles[i];
    var partUniformData = [
      {name: "transform", data: util.vec3.toArray(part.properties.pos)},
      {name: "scale", data: part.properties.scale},
      {name: "rotation", data: part.properties.angle},
      {name: "alpha", data: util.vec2.toArray(part.properties.alpha)},
      {name: "frame", data: Math.floor(this.game.frame + (part.properties.frame?part.properties.frame:0))}
    ];
    geometry.push({model: part.model, material: part.material, uniforms: partUniformData});
  }
};

ParticleQuadReadyRainbow.prototype.active = Particle.prototype.active;

/* Used by EffectDefinition.js */
ParticleQuadReadyRainbow.fxId = "particle";