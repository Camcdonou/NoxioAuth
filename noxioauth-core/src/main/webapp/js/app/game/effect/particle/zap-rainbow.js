"use strict";
/* global main */
/* global util */
/* global Particle */

/* Define Zap Hitstun Rainbow Particle System Class */
function ParticleZapRainbow(game, pos, vel, colorA, colorB) {
  /* Colors to use for particles */
  this.colorA = colorA;
  this.colorB = colorB;
  Particle.call(this, game, pos, vel);
}

ParticleZapRainbow.prototype.create = function() {
  var square = this.game.display.getModel("multi.square");
  var part2x = this.game.display.getModel("multi.fx.part2x");
  var zapMat = this.game.display.getMaterial("multi.hit.zapRB");
  var sparkMat = this.game.display.getMaterial("multi.hit.sparkRB");
  
  var parent = this;
  
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
      properties: {offset: util.vec3.scale(util.vec3.random(), 0.4), scale: 0.455, rotation: Math.random()*6.28, alpha: util.vec2.make(1, 1), frame: Math.floor(Math.random()*32), rbFrame: parseInt(Math.random()*256)}
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
      spawn: function(pos, vel) {
        var rand = util.vec3.random();
        var speed = (Math.random()*0.125)+0.105;
        var cmbvel = util.vec3.add(util.vec3.scale(vel, 0.5), util.vec3.scale(rand, speed));
        var axAng = util.vec3.angle(up, cmbvel);
        this.properties.pos = util.vec3.add(pos, util.vec3.scale(rand, 0.25));
        this.properties.vel = cmbvel;
        this.properties.angle = axAng;
      },
      update: function() {
        var collision = parent.game.map.collideVec3(this.properties.pos, this.properties.vel);
        if(collision) { this.properties.vel = util.vec3.scale(collision.reflect, util.vec3.magnitude(this.properties.vel)); }
        
        this.properties.scale -= 0.0075;
        this.properties.vel = util.vec3.scale(util.vec3.add(this.properties.vel, {x: 0.0, y: 0.0, z: -0.0075}), 0.935);
        this.properties.pos = util.vec3.add(this.properties.pos, this.properties.vel);
        this.properties.angle = util.vec3.angle(up, this.properties.vel);
        this.properties.alpha.x -= 1/this.length;
        this.properties.alpha.y -= 1/this.length;
      },
      properties: {pos: util.vec3.add(this.pos, util.vec3.scale(rand, 0.25)), scale: 0.175, vel: cmbvel, angle: axAng, alpha: util.vec2.make(1, 1), frame: parseInt(Math.random()*256)}
    });
  }
};

ParticleZapRainbow.prototype.pushPart = Particle.prototype.pushPart;

ParticleZapRainbow.prototype.step = Particle.prototype.step;

ParticleZapRainbow.prototype.getDraw = function(geometry, decals, lights, bounds) {
  for(var i=0;i<this.particles.length;i++) {
    var part = this.particles[i];
    var partUniformData = [
      {name: "scale", data: part.properties.scale},
      {name: "totalSprites", data: 8},
      {name: "usedSprites", data: 8},
      {name: "alpha", data: util.vec2.toArray(part.properties.alpha)}
    ];
    if(part.properties.offset) { partUniformData.push({name: "transform", data: util.vec3.toArray(util.vec3.add(this.pos, part.properties.offset))}); }
    if(part.properties.pos) { partUniformData.push({name: "transform", data: util.vec3.toArray(part.properties.pos)}); }
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

ParticleZapRainbow.prototype.active = Particle.prototype.active;

/* Used by EffectDefinition.js */
ParticleZapRainbow.fxId = "particle";