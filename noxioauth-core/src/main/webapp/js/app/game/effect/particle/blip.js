"use strict";
/* global main */
/* global util */
/* global Particle */

/* Define Blip Particle System Class */
function ParticleBlip(game, pos, vel) {
  Particle.call(this, game, pos, vel);
}

ParticleBlip.prototype.create = function() {
  var square = this.game.display.getModel("model.multi.square");
  
  var shockwaveMat = this.game.display.getMaterial("material.effect.shockwave");
  var blipBrightMat = this.game.display.getMaterial("material.prank.blipBright");
  var blipMat = this.game.display.getMaterial("material.prank.blip");
  var sparkMat = this.game.display.getMaterial("material.effect.spark");
  
  var white = function(){ return {x: 1.0, y: 1.0, z: 1.0, w: 1.0}; };
  var blue = function() { return {x: 0.81, y: 0.94, z: 1.0, w: 1.0}; };
  
  var shockwave  = {model: square, material: shockwaveMat, delay: 0, length: 5, update: function(pos){ this.properties.pos = pos; this.properties.scale *= 1.25; this.properties.color.w -= 1.0/5.0;}, properties: {pos: this.pos, scale: 1.25, color: blue()}};
  var blipBright = {model: square, material: blipBrightMat, delay: 0, length: 2, update: function(pos){ this.properties.pos = pos; }, properties: {pos: this.pos, scale: 1.25, color: white()}};
  var blip       = {model: square, material: blipMat, delay: 2, length: 4, update: function(pos){ this.properties.pos = pos; this.properties.scale += 0.2;}, properties: {pos: this.pos, scale: 1.25, color: white()}};
  this.pushPart(shockwave);
  this.pushPart(blipBright);
  this.pushPart(blip);
  for(var i=0;i<6;i++) {
    var rand = util.vec3.random();
    this.pushPart({
      model: square,
      material: sparkMat,
      delay: 1,
      length: 22,
      update: function() {
        this.properties.scale += 0.005;
        this.properties.speed *= 0.95;
        this.properties.pos = util.vec3.add(this.properties.pos, util.vec3.scale(this.properties.vel, this.properties.speed));
        this.properties.color.w -= 1.0/22.0;
      },
      properties: {pos: util.vec3.add(this.pos, util.vec3.scale(rand, 0.3)), vel: rand, scale: 0.175, speed: 0.1, color: blue()}
    });
  }
};

ParticleBlip.prototype.pushPart = Particle.prototype.pushPart;

ParticleBlip.prototype.step = Particle.prototype.step;

ParticleBlip.prototype.getDraw = function(geometry, decals, lights, bounds) {
  for(var i=0;i<this.particles.length;i++) {
    var part = this.particles[i];
    var partUniformData = [
      {name: "transform", data: util.vec3.toArray(part.properties.pos)},
      {name: "scale", data: part.properties.scale},
      {name: "color", data: util.vec4.toArray(part.properties.color)},
      {name: "rotation", data: 0.0}
    ];
    geometry.push({model: part.model, material: part.material, uniforms: partUniformData});
  }
};