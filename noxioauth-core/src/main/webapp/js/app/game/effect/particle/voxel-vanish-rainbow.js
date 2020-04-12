"use strict";
/* global main */
/* global util */
/* global Particle */

/* Define Voxel Vanish Rainbow Particle System Class */
function ParticleVoxelVanishRainbow(game, pos, vel) {
  Particle.call(this, game, pos, vel);
}

ParticleVoxelVanishRainbow.prototype.create = function() {
  var square = this.game.display.getModel("multi.square");
  var part2x = this.game.display.getModel("multi.fx.part2x");
  
  var sparkMat = this.game.display.getMaterial("multi.hit.sparkRB");
  var markMat = this.game.display.getMaterial("character.voxel.effect.markwaveRB");
  
  var parent = this;
  
  var waveA  = {
    model: square,
    material: markMat,
    delay: 0,
    max: 9,
    length: 9,
    update: function(pos){
      this.properties.scale *= 0.91;
      this.properties.rotation += 0.055;
      this.properties.alpha.x += (this.max*0.5)-this.length<=0?0.15:-0.15;
      this.properties.alpha.y += (this.max*0.5)-this.length<=0?0.15:-0.15;
    },
    properties: {offset: util.vec3.make(0,0,-0.2), scale: 2.0, alpha: util.vec2.make(0.05,0.25), frame: Math.floor(Math.random()*256), rotation: Math.random()*6.4}
  };
  
  this.pushPart(waveA);
  
  var up = util.vec3.make(0.,0.,1.);
  for(var i=0;i<16;i++) {
    var rand = util.vec3.random();
    var speed = (Math.random()*0.055)+0.035;
    var cmbvel = util.vec3.add(util.vec3.scale(this.vel, 0.32), util.vec3.scale(rand, speed));
    var axAng = util.vec3.angle(up, cmbvel);
    var l = 24+Math.floor(Math.random()*12);
    this.pushPart({
      model: part2x,
      material: sparkMat,
      delay: Math.floor(Math.random()*3),
      max: l,
      length: l,
      spawn: function(pos, vel) {
        var rand = util.vec3.random();
        var speed = (Math.random()*0.055)+0.035;
        var cmbvel = util.vec3.add(util.vec3.scale(vel, 0.5), util.vec3.scale(rand, speed));
        var axAng = util.vec3.angle(up, cmbvel);
        this.properties.pos = util.vec3.add(pos, util.vec3.scale(rand, 0.25));
        this.properties.vel = cmbvel;
        this.properties.angle = axAng;
      },
      update: function() {
        var collision = parent.game.map.collideVec3(this.properties.pos, this.properties.vel);
        if(collision) { this.properties.vel = util.vec3.scale(collision.reflect, util.vec3.magnitude(this.properties.vel)); }
        
        this.properties.scale -= 0.0035;
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

ParticleVoxelVanishRainbow.prototype.pushPart = Particle.prototype.pushPart;

ParticleVoxelVanishRainbow.prototype.step = Particle.prototype.step;

ParticleVoxelVanishRainbow.prototype.getDraw = function(geometry, decals, lights, bounds) {
  for(var i=0;i<this.particles.length;i++) {
    var part = this.particles[i];
    var partUniformData = [
      {name: "scale", data: part.properties.scale},
      {name: "frame", data: this.game.frame + (part.properties.frame?part.properties.frame:0)},
      {name: "alpha", data: util.vec2.toArray(part.properties.alpha)}
    ];
    if(part.properties.pos) { partUniformData.push({name: "transform", data: util.vec3.toArray(part.properties.pos)}); }
    if(part.properties.offset) { partUniformData.push({name: "transform", data: util.vec3.toArray(util.vec3.add(this.pos, part.properties.offset))}); }
    if(part.properties.rotation) { partUniformData.push({name: "rotation", data: part.properties.rotation}); }
    if(part.properties.angle) { partUniformData.push({name: "angle", data: util.vec3.toArray(part.properties.angle)}); }
    geometry.push({model: part.model, material: part.material, uniforms: partUniformData});
  }
};

ParticleVoxelVanishRainbow.prototype.active = Particle.prototype.active;

/* Used by EffectDefinition.js */
ParticleVoxelVanishRainbow.fxId = "particle";