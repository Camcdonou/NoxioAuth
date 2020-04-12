"use strict";
/* global main */
/* global util */
/* global Particle */

/* Define Voxel Recall Rainbow Particle System Class */
function ParticleVoxelRecallRainbow(game, pos, vel) {
  Particle.call(this, game, pos, vel);
}

ParticleVoxelRecallRainbow.prototype.create = function() {
  var square = this.game.display.getModel("multi.square");
  var part2x = this.game.display.getModel("multi.fx.part2x");
  
  var flashMat = this.game.display.getMaterial("character.box.effect.flashRB");
  var sparkMat = this.game.display.getMaterial("multi.hit.sparkRB");
  var zapMat = this.game.display.getMaterial("multi.hit.zapRB");
  var markMat = this.game.display.getMaterial("character.voxel.effect.markwaveRB");
  
  var parent = this;
  
  var flash = {
    model: square,
    material: flashMat,
    delay: 0,
    length: 9,
    update: function(pos){
      this.properties.pos = pos;
      this.properties.scale += 0.155;
      this.properties.alpha.x *= 0.875;
      this.properties.alpha.y *= 0.825;
    },
    properties: {offset: util.vec3.make(0,0,0), scale: 1.15, rotation: 0, alpha: util.vec2.make(0.45,1), frame: Math.floor(Math.random()*256)}
  };
  
  this.pushPart(flash);
  
  var waveA  = {
    model: square,
    material: markMat,
    delay: 0,
    max: 13,
    length: 13,
    update: function(pos){
      this.properties.scale += 0.175;
      this.properties.rotation += 0.055;
      this.properties.alpha.x -= 0.75/this.length;
      this.properties.alpha.y -= 0.75/this.length;
    },
    properties: {offset: util.vec3.make(0,0,-0.45), scale: 1.1, alpha: util.vec2.make(1,1), frame: Math.floor(Math.random()*256), rotation: Math.random()*6.4}
  };
  
  this.pushPart(waveA);
  
  for(var i=0;i<32;i++) {
    var rand = util.vec3.random();
    rand.z *= 0.025; rand.z += 0.05;
    rand = util.vec3.scale(util.vec3.normalize(rand), Math.random()*0.525 + 0.075);
    var l = 16+Math.floor(Math.random()*7);
    this.pushPart({
      model: square,
      material: zapMat,
      delay: Math.floor(Math.random()*6),
      max: l,
      length: l,
      update: function() {
        this.properties.scale += 0.005;
        this.properties.rotation += 0.0125;
        this.properties.pos = util.vec3.add(this.properties.pos, this.properties.vel);
        this.properties.vel = util.vec3.scale(this.properties.vel, 0.975);
        this.properties.alpha.x -= 1.0/this.max;
        this.properties.alpha.y = this.properties.alpha.x;
      },
      properties: {pos: util.vec3.add(util.vec3.add(this.pos, rand), util.vec3.make(0, 0, -0.45)), vel: util.vec3.scale(util.vec3.normalize(util.vec3.make(rand.x, rand.y, 0)), 0.0085), scale: 0.265, rotation: Math.random()*6.28, alpha: util.vec2.make(1,1), rbFrame: Math.floor(Math.random()*256), frame: Math.floor(Math.random()*32)}
    });
  }
  
  var up = util.vec3.make(0.,0.,1.);
  for(var i=0;i<23;i++) {
    var rand = util.vec3.random();
    var speed = (Math.random()*0.125)+0.105;
    var cmbvel = util.vec3.add(util.vec3.scale(this.vel, 0.32), util.vec3.scale(rand, speed));
    var axAng = util.vec3.angle(up, cmbvel);
    var l = 30+Math.floor(Math.random()*19);
    this.pushPart({
      model: part2x,
      material: sparkMat,
      delay: Math.floor(Math.random()*3),
      max: l,
      length: l,
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
        
        this.properties.scale -= 0.00275;
        this.properties.vel = util.vec3.scale(util.vec3.add(this.properties.vel, {x: 0.0, y: 0.0, z: -0.0075}), 0.935);
        this.properties.pos = util.vec3.add(this.properties.pos, this.properties.vel);
        this.properties.angle = util.vec3.angle(up, this.properties.vel);
        this.properties.alpha.x -= 1/this.max;
        this.properties.alpha.y -= 1/this.max;
      },
      properties: {pos: util.vec3.add(this.pos, util.vec3.scale(rand, 0.25)), scale: 0.175, vel: cmbvel, angle: axAng, alpha: util.vec2.make(1,1), frame: Math.floor(Math.random()*256)}
    });
  }
};

ParticleVoxelRecallRainbow.prototype.pushPart = Particle.prototype.pushPart;

ParticleVoxelRecallRainbow.prototype.step = Particle.prototype.step;

ParticleVoxelRecallRainbow.prototype.getDraw = function(geometry, decals, lights, bounds) {
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

ParticleVoxelRecallRainbow.prototype.active = Particle.prototype.active;

/* Used by EffectDefinition.js */
ParticleVoxelRecallRainbow.fxId = "particle";