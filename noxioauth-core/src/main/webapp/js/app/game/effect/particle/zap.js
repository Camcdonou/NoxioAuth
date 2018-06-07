"use strict";
/* global main */
/* global util */
/* global Particle */

/* Define Zap Hitstun Particle System Class */
function ParticleZap(game, pos, vel, colorA, colorB) {
  /* Colors to use for particles */
  this.colorA = colorA;
  this.colorB = colorB;
  Particle.call(this, game, pos, vel);
}

ParticleZap.prototype.create = function() {
  var square = this.game.display.getModel("multi.square");
  var part2x = this.game.display.getModel("multi.part2x");
  var zapMat = this.game.display.getMaterial("multi.hit.zap");
  var sparkMat = this.game.display.getMaterial("multi.hit.spark");
  
  var parent = this;
  var colorA = function() { return util.vec4.copy(parent.colorA); };
  var colorB = function() { return util.vec4.copy(parent.colorB); };
  
  for(var i=0;i<8;i++) {
    this.pushPart({
      model: square,
      material: zapMat,
      delay: Math.floor(Math.random()*8),
      length: 8+Math.floor(Math.random()*8),
      update: function() {
        this.properties.scale += 0.005;
        this.properties.rotation += 0.0075;
      },
      properties: {offset: util.vec3.scale(util.vec3.random(), 0.4), scale: 0.455, rotation: Math.random()*6.28, color: colorA(), tone: colorB(), frame: Math.floor(Math.random()*32)}
    });
  }
  
  var up = util.vec3.make(0.,0.,1.);
  for(var i=0;i<13;i++) {
    var rand = util.vec3.random();
    var speed = (Math.random()*0.125)+0.105;
    var cmbvel = util.vec3.add(util.vec3.scale(this.vel, 0.32), util.vec3.scale(rand, speed));
    var axAng = util.vec3.angle(up, cmbvel);
    
    this.pushPart({
      model: part2x,
      material: sparkMat,
      delay: Math.floor(Math.random()*3),
      length: 12+Math.floor(Math.random()*18),
      update: function() {
        var collision = parent.game.map.collideVec3(this.properties.pos, this.properties.vel);
        if(collision) { this.properties.vel = util.vec3.scale(collision.reflect, util.vec3.magnitude(this.properties.vel)); }
        
        this.properties.scale -= 0.0075;
        this.properties.vel = util.vec3.scale(util.vec3.add(this.properties.vel, {x: 0.0, y: 0.0, z: -0.0075}), 0.935);
        this.properties.pos = util.vec3.add(this.properties.pos, this.properties.vel);
        this.properties.angle = util.vec3.angle(up, this.properties.vel);
        this.properties.color.w -= 1/this.length;
        this.properties.tone.w -= 1/this.length;
      },
      properties: {pos: util.vec3.add(this.pos, util.vec3.scale(rand, 0.25)), scale: 0.175, vel: cmbvel, angle: axAng, color: colorA(), tone: colorB()}
    });
  }
};

ParticleZap.prototype.pushPart = Particle.prototype.pushPart;

ParticleZap.prototype.step = Particle.prototype.step;

ParticleZap.prototype.getDraw = function(geometry, decals, lights, bounds) {
  for(var i=0;i<this.particles.length;i++) {
    var part = this.particles[i];
    var partUniformData = [
      {name: "scale", data: part.properties.scale},
      {name: "totalSprites", data: 8},
      {name: "usedSprites", data: 8},
      {name: "color", data: util.vec4.toArray(part.properties.color)},
      {name: "tone", data: util.vec4.toArray(part.properties.tone)},
    ];
    if(part.properties.offset) { partUniformData.push({name: "transform", data: util.vec3.toArray(util.vec3.add(this.pos, part.properties.offset))}); }
    if(part.properties.pos) { partUniformData.push({name: "transform", data: util.vec3.toArray(part.properties.pos)}); }
    if(part.properties.rotation) { partUniformData.push({name: "rotation", data: part.properties.rotation}); }
    if(part.properties.angle) { partUniformData.push({name: "angle", data: util.vec3.toArray(part.properties.angle)}); }
    if(part.properties.frame) { partUniformData.push({name: "frame", data: Math.floor((part.properties.frame + this.frame) * 0.35)}); }
    geometry.push({model: part.model, material: part.material, uniforms: partUniformData});
  }
};

ParticleZap.prototype.active = Particle.prototype.active;

/* Used by EffectDefinition.js */
ParticleZap.fxId = "particle";