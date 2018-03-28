"use strict";
/* global main */
/* global util */
/* global Particle */

/* Define Dash Particle System Class */
function ParticleDash(game, pos, vel, colorA, colorB) {
  /* Colors to use for particles */
  this.colorA = colorA;
  this.colorB = colorB;
  Particle.call(this, game, pos, vel);
}

ParticleDash.prototype.create = function() {
  var square = this.game.display.getModel("multi.square");
  
  var shockwaveMat = this.game.display.getMaterial("character.fox.effect.shockwave");
  var speedLineMat = this.game.display.getMaterial("character.fox.effect.speedline");
  
  var parent = this;
  var colorA = function() { return util.vec4.copy(parent.colorA); };
  var colorB = function() { return util.vec4.copy(parent.colorB); };
  var white = function(){ return util.vec4.make(1.0, 1.0, 1.0, 1.0); };
  
  var shockwave  = {model: square, material: shockwaveMat, delay: 0, length: 7, update: function(){ this.properties.scale *= 1.15; this.properties.color.w -= 1.0/6.0;}, properties: {pos: this.pos, scale: 1.00, color: white()}};
  this.pushPart(shockwave);
  
  var norm = util.vec3.normalize(this.vel);
  var reverse = util.vec3.inverse(norm);
  for(var i=0;i<12;i++) {
    var rand = util.vec3.random();
    this.pushPart({
      model: square,
      material: speedLineMat,
      delay: i,
      length: 18,
      update: function() {
        this.properties.speed *= 0.91;
        this.properties.pos = util.vec3.add(this.properties.pos, util.vec3.scale(this.properties.vel, this.properties.speed));
        this.properties.color.w -= 1.0/18.0;
      },
      properties: {pos: util.vec3.add(util.vec3.add(this.pos, util.vec3.scale(norm, i/6)),util.vec3.scale(rand, 0.75)), vel: reverse, scale: 0.55, speed: 0.15, color: colorA(), tone: colorB(), angle: -Math.atan(norm.y/norm.x)}
    });
  }
};

ParticleDash.prototype.pushPart = Particle.prototype.pushPart;

ParticleDash.prototype.step = Particle.prototype.step;

ParticleDash.prototype.getDraw = function(geometry, decals, lights, bounds) {
  var cameraZ = this.game.display.camera.rot.z;
  for(var i=0;i<this.particles.length;i++) {
    var part = this.particles[i];
    var partUniformData = [
      {name: "transform", data: util.vec3.toArray(part.properties.pos)},
      {name: "scale", data: part.properties.scale},
      {name: "color", data: util.vec4.toArray(part.properties.color)},
      {name: "rotation", data: part.properties.angle - cameraZ}
    ];
    if(part.properties.tone) { partUniformData.push({name: "tone", data: util.vec4.toArray(part.properties.tone)}); } /* second color used by 2tone shader */
    geometry.push({model: part.model, material: part.material, uniforms: partUniformData});
  }
};