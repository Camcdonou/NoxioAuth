"use strict";
/* global main */
/* global util */
/* global Particle */

/* Define Blip Particle System Class */
function ParticleBloodSplat(game, pos, dir) {
  Particle.call(this, game, pos, dir);
  
  this.decals = [];
}

ParticleBloodSplat.prototype.create = function() {
  var square = this.game.display.getModel("model.multi.square");
  
  var splashMat = this.game.display.getMaterial("material.effect.bloodsplash");
  var dropMat = this.game.display.getMaterial("material.effect.blooddrop");
  
  var center = util.vec3.add(this.pos, {x: 0.0, y: 0.0, z: 0.5});
  
  var white = function(){ return {x: 1.0, y: 1.0, z: 1.0, w: 1.0}; };
  
  var splashA  = {model: square, material: splashMat, delay: 0, length: 8, update: function(pos){ this.properties.scale *= 1.20; this.properties.color.w -= 1.0/8.0;}, properties: {pos: center, scale: 1.0, angle: 0.0, color: white()}};
  var splashB  = {model: square, material: splashMat, delay: 0, length: 12, update: function(pos){ this.properties.scale *= 1.15; this.properties.color.w -= 1.0/12.0;}, properties: {pos: center, scale: 0.8, angle: 0.5, color: white()}};
  this.pushPart(splashA);
  this.pushPart(splashB);
  var tmp = this;
  for(var i=0;i<6;i++) {
    var rand = util.vec3.random(); rand.z = Math.abs(rand.z);
    var speed = (Math.random()*0.125)+0.075;
    this.pushPart({
      model: square,
      material: dropMat,
      delay: 1,
      length: 60,
      update: function() {
        var collision = tmp.game.map.collideVec3(this.properties.pos, this.properties.vel);
        if(collision) { tmp.createBloodSplat(collision.intersection, collision.normal); this.length = 0; }
        
        this.properties.scale += 0.005;
        this.properties.vel = util.vec3.scale(util.vec3.add(this.properties.vel, {x: 0.0, y: 0.0, z: -0.0175}), 0.95);
        this.properties.pos = util.vec3.add(this.properties.pos, this.properties.vel);
        this.properties.color.w -= 1.0/60.0;
      },
      properties: {pos: util.vec3.add(this.pos, util.vec3.scale(rand, 0.25)), scale: (Math.random()*0.5)+0.35, vel: util.vec3.scale(rand, speed), angle: Math.random()*6.28319, color: white()}
    });
  }
};

ParticleBloodSplat.prototype.createBloodSplat = function(pos, dir) {
  var decal = new Decal(this.game, this.game.display.getMaterial("material.effect.decal.bloodsplatsmall"), pos, dir, (Math.random()*0.5)+0.35, Math.random()*6.28319);
  this.decals.push(decal);
};

ParticleBloodSplat.prototype.pushPart = Particle.prototype.pushPart;

ParticleBloodSplat.prototype.step = Particle.prototype.step;

ParticleBloodSplat.prototype.getDraw = function(geometry, decals, lights, bounds) {
  var cameraZ = this.game.display.camera.rot.z;
  for(var i=0;i<this.particles.length;i++) {
    var part = this.particles[i];
    var partUniformData = [
      {name: "transform", data: util.vec3.toArray(part.properties.pos)},
      {name: "scale", data: part.properties.scale},
      {name: "color", data: util.vec4.toArray(part.properties.color)},
      {name: "rotation", data: part.properties.angle - cameraZ}
    ];
    geometry.push({model: part.model, material: part.material, uniforms: partUniformData});
  }
  for(var i=0;i<this.decals.length;i++) {
    this.decals[i].getDraw(decals, bounds);
  }
};