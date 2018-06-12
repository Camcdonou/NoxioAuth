"use strict";
/* global main */
/* global util */
/* global Particle */

/* Define Puff Dash Dust Particle System Class */
function ParticlePuffDash(game, pos, vel, colorA, colorB) {
  /* Colors to use for particles */
  this.colorA = colorA;
  this.colorB = colorB;
  Particle.call(this, game, pos, vel);
}

ParticlePuffDash.prototype.create = function() {
  var square = this.game.display.getModel("multi.square");
  var dashMat = this.game.display.getMaterial("character.shiek.effect.smoke");
  
  var parent = this;
  var colorA = function() { return util.vec4.copy3(parent.colorA, 0.6); };
  var colorB = function() { return util.vec4.copy3(parent.colorB, 0.6); };
  
  
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
        this.properties.color.w -= 0.6/this.max;
        this.properties.tone.w -= 0.6/this.max;
        this.properties.frame++;
        this.properties.angle += 0.012;
      },
      properties: {pos: util.vec3.add(this.pos, util.vec3.scale(randPos, 0.145)), vel: util.vec3.scale(randVel, 0.035), scale: 0.22+(Math.random()*0.05), color: colorA(), tone: colorB(), angle: randAng, frame: 0}
    });
  }
};

ParticlePuffDash.prototype.pushPart = Particle.prototype.pushPart;

ParticlePuffDash.prototype.step = Particle.prototype.step;

ParticlePuffDash.prototype.getDraw = function(geometry, decals, lights, bounds) {
  for(var i=0;i<this.particles.length;i++) {
    var part = this.particles[i];
    var partUniformData = [
      {name: "transform", data: util.vec3.toArray(part.properties.pos)},
      {name: "rotation", data: part.properties.angle},
      {name: "scale", data: part.properties.scale},
      {name: "totalSprites", data: 16},
      {name: "usedSprites", data: 16},
      {name: "color", data: util.vec4.toArray(part.properties.color)},
      {name: "tone", data: util.vec4.toArray(part.properties.tone)},
      {name: "frame", data: part.properties.frame}
    ];
    geometry.push({model: part.model, material: part.material, uniforms: partUniformData});
  }
};

ParticlePuffDash.prototype.active = Particle.prototype.active;

/* Used by EffectDefinition.js */
ParticlePuffDash.fxId = "particle";