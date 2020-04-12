"use strict";
/* global main */
/* global util */
/* global Particle */

/* Define Blip Rainbow Particle System Class */
function ParticleBlipRainbow(game, pos, vel) {
  Particle.call(this, game, pos, vel);
}

ParticleBlipRainbow.prototype.create = function() {
  var square = this.game.display.getModel("multi.square");
  
  var flashMat = this.game.display.getMaterial("character.box.effect.flashRB");
  var initMat = this.game.display.getMaterial("character.box.effect.initialRB");
  var blipMat = this.game.display.getMaterial("character.box.effect.blipRB");
  var sparkMat = this.game.display.getMaterial("character.box.effect.sparkRB");
  
  var parent = this;
  
  var flash = {
    model: square,
    material: flashMat,
    delay: 0,
    max: 13,
    length: 8,
    update: function(pos){
      this.properties.pos = pos;
      this.properties.scale += 0.15;
      this.properties.alpha.x *= 0.85;
      this.properties.alpha.y *= 0.8;
    },
    properties: {pos: this.pos, scale: 2.05, rotation: 0, alpha: util.vec2.make(1, 1)}
  };
  
  var blipInit = {
    model: square,
    material: initMat,
    delay: 0,
    length: 4,
    update: function(pos){
      this.properties.pos = pos;
      this.properties.scale += 0.15;
      if(this.length <= 1) { this.properties.alpha.x = 0.5; this.properties.alpha.y = 0.5; }
    },
    properties: {pos: this.pos, scale: 1.0, rotation: 0, alpha: util.vec2.make(1, 1)}
  };
  
  var blip = {
    model: square,
    material: blipMat,
    delay: 3,
    length: 5,
    update: function(pos){
      this.properties.pos = pos;
      this.properties.scale += 0.175;
      this.properties.alpha.x = 1.0; this.properties.alpha.y = 1.0;
    }, properties: {pos: this.pos, scale: 0.95, rotation: 0, alpha: util.vec2.make(1, 1)}
  };
  
  this.pushPart(blip);
  this.pushPart(blipInit);
  this.pushPart(flash);
    
  for(var i=0;i<12;i++) {
    var rand = util.vec3.scale(util.vec3.random(), 0.225);
    var l = 14 + Math.floor(Math.random() * 13);
    this.pushPart({
      model: square,
      material: sparkMat,
      delay: Math.floor(Math.random() * 4) + 1,
      max: l,
      length: l,
      spawn: function(pos, vel) {
        
      },
      update: function(pos) {
        this.properties.scale += 0.005;
        this.properties.offset = util.vec3.add(this.properties.offset, this.properties.vel);
        this.properties.vel = util.vec3.scale(this.properties.vel, 0.925);
        this.properties.alpha.x -= 1.0/this.max;
        this.properties.alpha.y -= 1.0/this.max;
        this.properties.rotation += 0.01;
      },
      properties: {offset: rand, vel: util.vec3.scale(rand, 0.185), scale: 0.145, rotation: Math.random()*6.4, alpha: util.vec2.make(1, 1), frame: parseInt(Math.random()*256)}
    });
  }
};

ParticleBlipRainbow.prototype.pushPart = Particle.prototype.pushPart;

ParticleBlipRainbow.prototype.step = Particle.prototype.step;

ParticleBlipRainbow.prototype.getDraw = function(geometry, decals, lights, bounds) {
  for(var i=0;i<this.particles.length;i++) {
    var part = this.particles[i];
    var partUniformData = [
      {name: "scale", data: part.properties.scale},
      {name: "rotation", data: part.properties.rotation},
      {name: "alpha", data: util.vec2.toArray(part.properties.alpha)},
      {name: "frame", data: this.game.frame + (part.properties.frame?part.properties.frame:0)}
    ];
    if(part.properties.pos) { partUniformData.push({name: "transform", data: util.vec3.toArray(part.properties.pos)}); }
    if(part.properties.offset) { partUniformData.push({name: "transform", data: util.vec3.toArray(util.vec3.add(this.pos, part.properties.offset))}); }
    geometry.push({model: part.model, material: part.material, uniforms: partUniformData});
  }
};

ParticleBlipRainbow.prototype.active = Particle.prototype.active;

/* Used by EffectDefinition.js */
ParticleBlipRainbow.fxId = "particle";