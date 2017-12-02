"use strict";
/* global main */
/* global util */
/* global Particle */

/* Define Blip Particle System Class */
function ParticleMark(game, pos, vel) {
  Particle.call(this, game, pos, vel);
  this.frame = 0;
}

ParticleMark.prototype.create = function() {
  var square = this.game.display.getModel("multi.square");
  
  var markMat = this.game.display.getMaterial("character.shiek.effect.mark");

  var lightwhite = function(){ return {x: 0.65, y: 0.75, z: 1.0, w: 0.5}; };
  
  var norm = util.vec3.normalize(this.vel);
  
  var mark  = {model: square, material: markMat, delay: 0, length: 25, update: function(pos){ this.properties.pos = util.vec3.add(pos, util.vec3.make(0,0,0.05)); this.properties.scale *= 1.05; this.properties.color.w -= 0.5/25; this.properties.angle += 0.001; }, properties: {pos: util.vec3.add(this.pos, util.vec3.make(0,0,0.05)), scale: 0.25, color: lightwhite(), angle: 0.0}};

  this.pushPart(mark);
};

ParticleMark.prototype.pushPart = Particle.prototype.pushPart;

ParticleMark.prototype.step = function(pos, vel) {
  Particle.prototype.step.call(this, pos, vel);
  this.frame++;
};

ParticleMark.prototype.getDraw = function(geometry, decals, lights, bounds) {
  for(var i=0;i<this.particles.length;i++) {
    var part = this.particles[i];
    var partUniformData = [
      {name: "transform", data: util.vec3.toArray(part.properties.pos)},
      {name: "scale", data: part.properties.scale},
      {name: "color", data: util.vec4.toArray(part.properties.color)},
      {name: "frame", data: this.frame},
      {name: "rotation", data: part.properties.angle}
    ];
    geometry.push({model: part.model, material: part.material, uniforms: partUniformData});
  }
};