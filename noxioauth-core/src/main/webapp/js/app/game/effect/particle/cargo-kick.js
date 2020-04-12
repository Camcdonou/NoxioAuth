"use strict";
/* global main */
/* global util */
/* global Particle */
/* global PlayerCargo*/

/* Define Cargo Kick Particle System Class */
function ParticleCargoKick(game, pos, vel, colorA, colorB) {
  /* Colors to use for particles */
  this.colorA = colorA;
  this.colorB = colorB;
  Particle.call(this, game, pos, vel);
}

ParticleCargoKick.prototype.create = function() {
  var square = this.game.display.getModel("multi.square");
  var part2x = this.game.display.getModel("multi.fx.part2x");
  
  var fireMat = this.game.display.getMaterial("multi.hit.burn");
  var sparkMat = this.game.display.getMaterial("multi.hit.spark");
  var flashMat = this.game.display.getMaterial("character.cargo.effect.flash");
  var blastMat = this.game.display.getMaterial("character.cargo.effect.blast");
  
  var parent = this;
  var colorA = function() { return util.vec4.copy(parent.colorA); };
  var colorB = function() { return util.vec4.copy(parent.colorB); };
  
  this.pushPart({
    model: square,
    material: blastMat,
    delay: 0,
    max: 14,
    length: 14,
    update: function(){
      this.properties.scale *= 1.155;
      this.properties.color.w -= 1.0/this.max;
      this.properties.tone.w -= 1.0/this.max;
    },
    properties: {offset: util.vec3.make(0,0,0.15), scale: 0.45, color: colorB(), tone: colorA(), rotation: 0.0}
  });
    
  this.pushPart({
    model: square,
    material: flashMat,
    delay: 0,
    max: 12,
    length: 12,
    update: function(){
      this.properties.scale *= 1.175;
      this.properties.color.w -= this.length<=(this.max*0.5)?0.25/this.max:0.75/this.max;
    },
    properties: {offset: util.vec3.make(0,0,0.15), scale: 0.7, color: colorA(), rotation: 0.0}
  });
  
  var off = util.vec2.toVec3(util.vec2.scale(util.vec2.normalize(this.vel), 0.3), 0);
  for(var i=0;i<65;i++) {
    this.pushPart({
      model: square,
      material: fireMat,
      delay: Math.floor(Math.random()*10),
      length: 6+Math.floor(Math.random()*12),
      spawn: function(pos, vel) {
        this.properties.pos = util.vec3.add(util.vec3.add(pos, util.vec3.scale(util.vec3.random(), 0.2)), off);
        var veldir = util.vec3.normalize(util.vec3.add(util.vec3.scale(util.vec3.random(), 0.25), util.vec3.inverse(util.vec3.normalize(vel))));
        this.properties.vel = util.vec3.scale(veldir, 0.05+(Math.random()*0.025));
      },
      update: function() {
        this.properties.pos = util.vec3.add(this.properties.pos, this.properties.vel);
        this.properties.vel = util.vec3.scale(this.properties.vel, 0.945);
        
        this.properties.scale += 0.035;
        this.properties.rotation += 0.0095;
        this.properties.opacity -= 2/this.length;
        this.properties.color.w = Math.min(1, this.properties.opacity);
        this.properties.tone.w = Math.min(1, this.properties.opacity);
      },
      properties: {pos: util.vec3.add(util.vec3.add(this.pos, util.vec3.scale(util.vec3.random(), 0.2)), off), vel: util.vec3.scale(util.vec3.inverse(util.vec3.normalize(this.vel)), 0.05+(Math.random()*0.025)), scale: 0.475, rotation: Math.random()*6.28, color: colorA(), tone: colorB(), frame: Math.floor(Math.random()*32), opacity: 2}
    });
  }
  
  var up = util.vec3.make(0.,0.,1.);
  for(var i=0;i<35;i++) {
    var l = 20+Math.floor(Math.random()*15);
    this.pushPart({
      model: part2x,
      material: sparkMat,
      delay: 1+Math.floor(Math.random()*16),
      max: l,
      length: l,
      spawn: function(pos, vel) {
        var p = util.vec3.add(pos, util.vec3.scale(util.vec3.random(), 0.15));
        var v = util.vec3.normalize(util.vec3.add(util.vec3.scale(util.vec3.random(), 0.35), util.vec3.inverse(util.vec3.normalize(vel))));
        v = util.vec3.scale(v, 0.1+(Math.random()*0.05));
        
        var axAng = util.vec3.angle(up, v);
        this.properties.pos = p;
        this.properties.vel = v;
        this.properties.angle = axAng;
      },
      update: function() {
        //var collision = parent.game.map.collideVec3(this.properties.pos, this.properties.vel);
        //if(collision) { this.properties.vel = util.vec3.scale(collision.reflect, util.vec3.magnitude(this.properties.vel)); }
        
        this.properties.scale -= 0.0035;
        this.properties.vel = util.vec3.scale(util.vec3.add(this.properties.vel, {x: 0.0, y: 0.0, z: -0.0005}), 0.935);
        this.properties.pos = util.vec3.add(this.properties.pos, this.properties.vel);
        this.properties.angle = util.vec3.angle(up, this.properties.vel);
        if(this.length <= this.max*0.9) {
          this.properties.color.w -= 1/Math.floor(this.max*0.9);
          this.properties.tone.w -= 1/Math.floor(this.max*0.9);
        }
      },
      properties: {pos: undefined, scale: 0.145, vel: undefined, angle: undefined, color: colorA(), tone: colorB()}
    });
  }
  
};

ParticleCargoKick.prototype.pushPart = Particle.prototype.pushPart;

ParticleCargoKick.prototype.step = Particle.prototype.step;

ParticleCargoKick.prototype.getDraw = function(geometry, decals, lights, bounds) {
  var cameraZ = this.game.display.camera.rot.z;
  for(var i=0;i<this.particles.length;i++) {
    var part = this.particles[i];
    var partUniformData = [
      {name: "scale", data: part.properties.scale},
      {name: "color", data: util.vec4.toArray(part.properties.color)},
      {name: "totalSprites", data: 16},
      {name: "usedSprites", data: 16}
    ];
    if(part.properties.tone) { partUniformData.push({name: "tone", data: util.vec4.toArray(part.properties.tone)}); } /* second color used by 2tone shader */
    if(part.properties.offset) { partUniformData.push({name: "transform", data: util.vec3.toArray(util.vec3.add(this.pos, part.properties.offset))}); }
    if(part.properties.pos) { partUniformData.push({name: "transform", data: util.vec3.toArray(part.properties.pos)}); }
    if(part.properties.rotation) { partUniformData.push({name: "rotation", data: part.properties.rotation}); }
    if(part.properties.angle) { partUniformData.push({name: "angle", data: util.vec3.toArray(part.properties.angle)}); }
    if(part.properties.frame) { partUniformData.push({name: "frame", data: Math.floor((part.properties.frame + this.frame) * 0.35)}); }
    geometry.push({model: part.model, material: part.material, uniforms: partUniformData});
  }
};

ParticleCargoKick.prototype.active = Particle.prototype.active;

/* Used by EffectDefinition.js */
ParticleCargoKick.fxId = "particle";