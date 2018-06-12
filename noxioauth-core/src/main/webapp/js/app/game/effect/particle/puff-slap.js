"use strict";
/* global main */
/* global util */
/* global Particle */

/* Define Puff Slap Hit Particle System Class */
function ParticlePuffSlap(game, pos, vel, colorA, colorB) {
  /* Colors to use for particles */
  this.colorA = colorA;
  this.colorB = colorB;
  Particle.call(this, game, pos, vel);
}

ParticlePuffSlap.prototype.create = function() {
  var square = this.game.display.getModel("multi.square");
  var part = this.game.display.getModel("multi.fx.part2x");
  var waveMat = this.game.display.getMaterial("character.puff.effect.hitwave");
  var hitMat = this.game.display.getMaterial("character.puff.effect.hit");
  var lineMat = this.game.display.getMaterial("character.puff.effect.line");
  
  var parent = this;
  var colorA = function() { return util.vec4.copy(parent.colorA); };
  var colorB = function() { return util.vec4.copy(parent.colorB); };

  this.pushPart({
    model: square,
    material: waveMat,
    delay: 0,
    max: 10,
    length: 10,
    update: function() {
      this.properties.scale += 0.15;
      this.properties.rotation += 0.0075;
      this.properties.color.w -= 1.0/this.max;
      this.properties.tone.w -= 1.0/this.max;
    },
    properties: {offset: this.vel, scale: 0.15, rotation: Math.random()*6.28, color: colorA(), tone: colorB()}
  });
  
  this.pushPart({
    model: square,
    material: hitMat,
    delay: 0,
    length: 5,
    update: function() {
      this.properties.scale *= 1.15;
      this.properties.rotation -= 0.0075;
      this.properties.frame++;
      if(this.length <= 1) {
        this.properties.color.w = 0.5;
        this.properties.tone.w = 0.5;
      }
    },
    properties: {offset: this.vel, scale: 0.75, rotation: Math.random()*6.28, color: colorA(), tone: colorB()}
  });
  
  var up = util.vec3.make(0.,0.,1.);
  for(var i=0;i<22;i++) {
    var r = util.vec3.random();
    var axAng = util.vec3.angle(up, r);
    var l = 8+Math.floor(Math.random()*5);
    this.pushPart({
      model: part,
      material: lineMat,
      delay: Math.floor(Math.random()*2),
      max: l,
      length: l,
      update: function() {
        this.properties.scale += 0.005;
        this.properties.color.w -= 1/this.max;
        this.properties.tone.w -= 1/this.max;
        this.properties.offset = util.vec3.add(this.properties.offset, this.properties.vel);
        this.properties.vel = util.vec3.scale(this.properties.vel, 0.935);
      },
      properties: {offset: this.vel, vel: util.vec3.scale(r, 0.15), scale: 0.35, angle: axAng, color: colorA(), tone: colorB()}
    });
  }
};

ParticlePuffSlap.prototype.pushPart = Particle.prototype.pushPart;

ParticlePuffSlap.prototype.step = Particle.prototype.step;

ParticlePuffSlap.prototype.getDraw = function(geometry, decals, lights, bounds) {
  for(var i=0;i<this.particles.length;i++) {
    var part = this.particles[i];
    var partUniformData = [
      {name: "transform", data: util.vec3.toArray(util.vec3.add(this.pos, part.properties.offset))},
      {name: "scale", data: part.properties.scale},
      {name: "color", data: util.vec4.toArray(part.properties.color)},
      {name: "tone", data: util.vec4.toArray(part.properties.tone)}
    ];
    if(part.properties.rotation) { partUniformData.push({name: "rotation", data: part.properties.rotation}); }
    if(part.properties.angle) { partUniformData.push({name: "angle", data: util.vec3.toArray(part.properties.angle)}); }
    
    geometry.push({model: part.model, material: part.material, uniforms: partUniformData});
  }
};

ParticlePuffSlap.prototype.active = Particle.prototype.active;

/* Used by EffectDefinition.js */
ParticlePuffSlap.fxId = "particle";