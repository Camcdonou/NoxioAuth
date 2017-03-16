"use strict";
/* global main */
/* global util */
/* global Particle */

/* Define Dash Particle System Class */
function ParticleDash(game, pos, dir) {
  Particle.call(this, game, pos, dir);
}

ParticleDash.prototype.create = function() {
  var square = this.game.display.getModel("model.multi.square");
  
  var shockwaveMat = this.game.display.getMaterial("material.effect.shockwave");
  var speedLineMat = this.game.display.getMaterial("material.effect.speedline");
  
  var white = function(){ return {x: 1.0, y: 1.0, z: 1.0, w: 1.0}; };
  var blue = function() { return {x: 0.42, y: 0.57, z: 1.0, w: 1.0}; };
  
  var shockwave  = {model: square, material: shockwaveMat, delay: 0, length: 7, update: function(){ this.properties.scale *= 1.15; this.properties.color.w -= 1.0/6.0;}, properties: {pos: this.pos, scale: 1.00, color: white()}};
  this.pushPart(shockwave);
  
  var norm = util.vec3.normalize(this.dir);
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
        this.properties.pos = util.vec3.add(this.properties.pos, util.vec3.scale(this.properties.dir, this.properties.speed));
        this.properties.color.w -= 1.0/18.0;
      },
      properties: {pos: util.vec3.add(util.vec3.add(this.pos, util.vec3.scale(norm, i/6)),util.vec3.scale(rand, 0.75)), dir: reverse, scale: 0.55, speed: 0.15, color: blue(), angle: -Math.atan(norm.y/norm.x)}
    });
  }
};

ParticleDash.prototype.pushPart = Particle.prototype.pushPart;

ParticleDash.prototype.step = Particle.prototype.step;

ParticleDash.prototype.getDraw = function(geometry, lights, bounds) {
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
};