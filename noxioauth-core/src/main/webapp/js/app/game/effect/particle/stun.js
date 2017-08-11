"use strict";
/* global main */
/* global util */
/* global Particle */

/* Define Stunned Particle System Class */
function ParticleStun(game, pos, dir) {
  Particle.call(this, game, pos, dir);
}

ParticleStun.prototype.create = function() {
  var square = this.game.display.getModel("model.multi.square");
  
  var shockwaveMat = this.game.display.getMaterial("material.effect.shockwave");
  var speedLineMat = this.game.display.getMaterial("material.effect.star");
  
  var yellow = function() { return {x: 1.00, y: 0.96, z: 0.45, w: 1.0}; };
  
  var shockwave  = {model: square, material: shockwaveMat, delay: 0, length: 7, update: function(){ this.properties.scale *= 1.15; this.properties.color.w -= 1.0/6.0;}, properties: {pos: this.pos, scale: 0.5, color: yellow()}};
  this.pushPart(shockwave);
  
  for(var i=0;i<6;i++) {
    var rand = 6.28319*(i/6);
    var speed = (0.03*Math.random()) + 0.06;
    this.pushPart({
      model: square,
      material: speedLineMat,
      delay: 0,
      length: 45,
      update: function(pos) {
        this.properties.angle += this.properties.speed;
        this.properties.pos = util.vec3.add(pos, util.vec3.scale({x: Math.sin(this.properties.angle), y: Math.cos(this.properties.angle), z: 0.0}, 0.3));
        this.properties.color.w -= 1.0/45.0;
      },
      properties: {pos: util.vec3.add(this.pos, util.vec3.scale({x: Math.sin(rand), y: Math.cos(rand), z: 0.0}, 0.3)), scale: 0.25, speed: speed, color: yellow(), angle: rand}
    });
  }
};

ParticleStun.prototype.pushPart = Particle.prototype.pushPart;

ParticleStun.prototype.step = Particle.prototype.step;

ParticleStun.prototype.getDraw = function(geometry, decals, lights, bounds) {
  var cameraZ = this.game.display.camera.rot.z;
  for(var i=0;i<this.particles.length;i++) {
    var part = this.particles[i];
    var partUniformData = [
      {name: "transform", data: util.vec3.toArray(part.properties.pos)},
      {name: "scale", data: part.properties.scale},
      {name: "color", data: util.vec4.toArray(part.properties.color)},
      {name: "rotation", data: (part.properties.angle*3.3) - cameraZ}
    ];
    geometry.push({model: part.model, material: part.material, uniforms: partUniformData});
  }
};