"use strict";
/* global main */
/* global util */
/* global Particle */

/* Define Slash Hitstun Particle System Class */
function ParticleSlashHit(game, pos, vel, colorA, colorB) {
  /* Colors to use for particles */
  this.colorA = colorA;
  this.colorB = colorB;
  Particle.call(this, game, pos, vel);
}

ParticleSlashHit.prototype.create = function() {
  var square = this.game.display.getModel("multi.square");
  var part = this.game.display.getModel("multi.fx.part2x");
  var slashMat = this.game.display.getMaterial("multi.hit.slash");
  var lineMat = this.game.display.getMaterial("multi.hit.line");
  
  var parent = this;
  var colorA = function() { return util.vec4.copy(parent.colorA); };
  var colorB = function() { return util.vec4.copy(parent.colorB); };
  
  var srot = Math.random()*6.28;
  
  this.pushPart({
    model: square,
    material: slashMat,
    delay: 0,
    length: 8,
    update: function() {
      this.properties.scale += 0.005;
      this.properties.rotation += 0.0075;
      this.properties.frame++;
    },
    properties: {offset: util.vec3.make(0, 0, 0.6), scale: 0.9, rotation: srot, color: colorA(), tone: colorB(), frame: 0}
  });
  
  this.pushPart({
    model: square, 
    material: slashMat,
    delay: 6,
    length: 8,
    update: function() {
      this.properties.scale += 0.005;
      this.properties.rotation += 0.0075;
      this.properties.frame++;
    },
    properties: {offset: util.vec3.make(0, 0, 0.6), scale: 1.1, rotation: srot + 0.685398, color: colorA(), tone: colorB(), frame: 0}
  });
  
  var up = util.vec3.make(0.,0.,1.);
  for(var i=0;i<25;i++) {
    var r = util.vec3.random();
    var axAng = util.vec3.angle(up, r);
    
    this.pushPart({
      model: part,
      material: lineMat,
      delay: Math.floor(Math.random()*3),
      length: 12+Math.floor(Math.random()*4),
      update: function() {
        this.properties.scale += 0.005;
        this.properties.color.w -= 1/this.length;
        this.properties.tone.w -= 1/this.length;
        this.properties.offset = util.vec3.add(this.properties.offset, this.properties.vel);
        this.properties.vel = util.vec3.scale(this.properties.vel, 0.955);
      },
      properties: {offset: util.vec3.scale(r, 0.2), vel: util.vec3.scale(r, 0.155), scale: 0.35, angle: axAng, color: colorA(), tone: colorB()}
    });
  }
};

ParticleSlashHit.prototype.pushPart = Particle.prototype.pushPart;

ParticleSlashHit.prototype.step = Particle.prototype.step;

ParticleSlashHit.prototype.getDraw = function(geometry, decals, lights, bounds) {
  for(var i=0;i<this.particles.length;i++) {
    var part = this.particles[i];
    var partUniformData = [
      {name: "transform", data: util.vec3.toArray(util.vec3.add(this.pos, part.properties.offset))},
      {name: "scale", data: part.properties.scale},
      {name: "totalSprites", data: 4},
      {name: "usedSprites", data: 4},
      {name: "color", data: util.vec4.toArray(part.properties.color)},
      {name: "tone", data: util.vec4.toArray(part.properties.tone)}
    ];
    if(part.properties.rotation) { partUniformData.push({name: "rotation", data: part.properties.rotation}); }
    if(part.properties.angle) { partUniformData.push({name: "angle", data: util.vec3.toArray(part.properties.angle)}); }
    if(part.properties.frame) { partUniformData.push({name: "frame", data: part.properties.frame*0.5}); }
    
    geometry.push({model: part.model, material: part.material, uniforms: partUniformData});
  }
};

ParticleSlashHit.prototype.active = Particle.prototype.active;

/* Used by EffectDefinition.js */
ParticleSlashHit.fxId = "particle";