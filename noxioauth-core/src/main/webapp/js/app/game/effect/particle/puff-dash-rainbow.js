"use strict";
/* global main */
/* global util */
/* global Particle */

/* Define Puff Dash Dust Particle System Class */
function ParticlePuffDashRainbow(game, pos, vel, colorA, colorB) {
  /* Colors to use for particles */
  this.colorA = colorA;
  this.colorB = colorB;
  Particle.call(this, game, pos, vel);
}

ParticlePuffDashRainbow.prototype.create = function() {
  var square = this.game.display.getModel("multi.square");
  var dashMat = this.game.display.getMaterial("character.puff.effect.smokeRB");
  
  var parent = this;
  
  
  for(var i=0;i<66;i++) {
    var randPos = util.vec3.random(); randPos.z = Math.abs(randPos.z);
    var randVel = util.vec3.random(); randVel.z = Math.abs(randVel.z);
    var randAng = Math.random()*(Math.PI*2);
    this.pushPart({
      model: square,
      material: dashMat,
      delay: Math.random()*6,
      max: 18,
      length: 18,
      spawn: function(pos) {
        var randPos2 = util.vec3.random(); randPos.z = Math.abs(randPos.z);
        this.properties.pos = util.vec3.add(pos, util.vec3.scale(randPos2, 0.15));
      },
      update: function() {
        this.properties.pos = util.vec3.add(this.properties.pos, this.properties.vel);
        this.properties.vel = util.vec3.add(this.properties.vel, util.vec3.make(0,0,0.00125));
        this.properties.vel = util.vec3.scale(this.properties.vel, 0.93);
        this.properties.scale *= 1.035;
        this.properties.alpha.x -= 0.6/this.max;
        this.properties.alpha.y -= 0.6/this.max;
        this.properties.frame++;
        this.properties.angle += 0.012;
      },
      properties: {pos: util.vec3.add(this.pos, util.vec3.scale(randPos, 0.145)), vel: util.vec3.scale(randVel, 0.035), scale: 0.22+(Math.random()*0.05), alpha: util.vec2.make(0.6,0.6), angle: randAng, frame: 0}
    });
  }
};

ParticlePuffDashRainbow.prototype.pushPart = Particle.prototype.pushPart;

ParticlePuffDashRainbow.prototype.step = Particle.prototype.step;

ParticlePuffDashRainbow.prototype.getDraw = function(geometry, decals, lights, bounds) {
  for(var i=0;i<this.particles.length;i++) {
    var part = this.particles[i];
    var partUniformData = [
      {name: "transform", data: util.vec3.toArray(part.properties.pos)},
      {name: "rotation", data: part.properties.angle},
      {name: "scale", data: part.properties.scale},
      {name: "alpha", data: util.vec2.toArray(part.properties.alpha)},
      {name: "rbFrame", data: this.game.frame + part.properties.rbFrame}
    ];
    geometry.push({model: part.model, material: part.material, uniforms: partUniformData});
  }
};

ParticlePuffDashRainbow.prototype.active = Particle.prototype.active;

/* Used by EffectDefinition.js */
ParticlePuffDashRainbow.fxId = "particle";