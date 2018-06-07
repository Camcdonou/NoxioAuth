"use strict";
/* global main */
/* global util */
/* global Particle */

/* Define Fire Hitstun Particle System Class */
function ParticleBurn(game, pos, vel, colorA, colorB) {
  /* Colors to use for particles */
  this.colorA = colorA;
  this.colorB = colorB;
  Particle.call(this, game, pos, vel);
}

ParticleBurn.prototype.create = function() {
  var square = this.game.display.getModel("multi.square");
  var part2x = this.game.display.getModel("multi.fx.part2x");
  var fireMat = this.game.display.getMaterial("multi.hit.burn");
  var sparkMat = this.game.display.getMaterial("multi.hit.spark");
  
  var parent = this;
  var colorA = function() { return util.vec4.copy(parent.colorA); };
  var colorB = function() { return util.vec4.copy(parent.colorB); };
  var white = function() { return util.vec4.make(1, 1, 1, 1); };
  
  for(var i=0;i<12;i++) {
    this.pushPart({
      model: square,
      material: fireMat,
      delay: Math.floor(Math.random()*5),
      length: 15+Math.floor(Math.random()*24),
      update: function() {
        this.properties.scale += 0.005;
        this.properties.rotation += 0.0095;
        this.properties.opacity -= 2/this.length;
        this.properties.color.w = this.properties.opacity;
        this.properties.tone.w = this.properties.opacity;
      },
      properties: {offset: util.vec3.scale(util.vec3.random(), 0.4), scale: 0.4, rotation: Math.random()*6.28, color: colorA(), tone: colorB(), frame: Math.floor(Math.random()*32), opacity: 2}
    });
  }
  
  var up = util.vec3.make(0.,0.,1.);
  for(var i=0;i<19;i++) {
    var rand = util.vec3.random();
    var speed = (Math.random()*0.125)+0.105;
    var cmbvel = util.vec3.add(util.vec3.scale(this.vel, 0.5), util.vec3.scale(rand, speed));
    var axAng = util.vec3.angle(up, cmbvel);
    
    this.pushPart({
      model: part2x,
      material: sparkMat,
      delay: Math.floor(Math.random()*3),
      length: 5+Math.floor(Math.random()*65),
      update: function() {
        var collision = parent.game.map.collideVec3(this.properties.pos, this.properties.vel);
        if(collision) { this.properties.vel = util.vec3.scale(collision.reflect, util.vec3.magnitude(this.properties.vel)); }
        
        this.properties.scale -= 0.0075;
        this.properties.vel = util.vec3.scale(util.vec3.add(this.properties.vel, {x: 0.0, y: 0.0, z: -0.0075}), 0.84);
        this.properties.pos = util.vec3.add(this.properties.pos, this.properties.vel);
        this.properties.angle = util.vec3.angle(up, this.properties.vel);
        this.properties.color.w -= 1/this.length;
        this.properties.tone.w -= 1/this.length;
      },
      properties: {pos: util.vec3.add(this.pos, util.vec3.scale(rand, 0.25)), scale: 0.165, vel: cmbvel, angle: axAng, color: colorA(), tone: colorB()}
    });
  }
};

ParticleBurn.prototype.pushPart = Particle.prototype.pushPart;

ParticleBurn.prototype.step = Particle.prototype.step;

ParticleBurn.prototype.getDraw = function(geometry, decals, lights, bounds) {
  for(var i=0;i<this.particles.length;i++) { 
    var part = this.particles[i];
    var partUniformData = [
      {name: "scale", data: part.properties.scale},
      {name: "totalSprites", data: 16},
      {name: "usedSprites", data: 16},
      {name: "color", data: util.vec4.toArray(part.properties.color)},
      {name: "tone", data: util.vec4.toArray(part.properties.tone)},
      {name: "rotation", data: part.properties.rotation}
    ];
    if(part.properties.offset) { partUniformData.push({name: "transform", data: util.vec3.toArray(util.vec3.add(this.pos, part.properties.offset))}); }
    if(part.properties.pos) { partUniformData.push({name: "transform", data: util.vec3.toArray(part.properties.pos)}); }
    if(part.properties.rotation) { partUniformData.push({name: "rotation", data: part.properties.rotation}); }
    if(part.properties.angle) { partUniformData.push({name: "angle", data: util.vec3.toArray(part.properties.angle)}); }
    if(part.properties.frame) { partUniformData.push({name: "frame", data: Math.floor((part.properties.frame + this.frame) * 0.35)}); }
    
    geometry.push({model: part.model, material: part.material, uniforms: partUniformData});
  }
};

ParticleBurn.prototype.active = Particle.prototype.active;

/* Used by EffectDefinition.js */
ParticleBurn.fxId = "particle";