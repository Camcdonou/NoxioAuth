"use strict";
/* global main */
/* global util */
/* global Particle */

/* Define Smoke Particle System Class */
function ParticleSleep(game, pos, vel) {
  Particle.call(this, game, pos, vel);
}

ParticleSleep.prototype.create = function() {
  var square = this.game.display.getModel("multi.square");
  
  var sleepMat = this.game.display.getMaterial("character.block.effect.sleep");
  
  var rainbow = [
    function() { return util.vec4.make(0.631,0.435,0.706,1.0); },
    function() { return util.vec4.make(0.651,0.851,0.416,1.0); },
    function() { return util.vec4.make(0.404,0.69,0.914,1.0); }
  ];

  var parent = this;

  this.pushPart({
    model: square,
    material: sleepMat,
    delay: 0,
    length: 100,
    update: function(pos, vel) {
      this.properties.pos = util.vec3.add(pos, util.vec3.make(-0.125, 0.125, 0));
      this.properties.scale = ((Math.sin((parent.frame*0.1)+this.properties.wave)+1)*0.025)+0.125;
      //this.properties.color.w -= 1.0/90.0;
    },
    properties: {pos: util.vec3.add(this.pos, util.vec3.make(-0.125, 0.125, 0)), wave: 0.0, scale: 0.15, color: rainbow[0](), angle: 0}
  });

  this.pushPart({
    model: square,
    material: sleepMat,
    delay: 0,
    length: 100,
    update: function(pos, vel) {
      this.properties.pos = util.vec3.add(pos, util.vec3.make(0, 0, 0.125));
      this.properties.scale = ((Math.sin((parent.frame*0.1)+this.properties.wave)+1)*0.025)+0.15;
      //this.properties.color.w -= 1.0/90.0;
    },
    properties: {pos: util.vec3.add(this.pos, util.vec3.make(0, 0, 0)), wave: 0.33, scale: 0.15, color: rainbow[1](), angle: 0}
  });
  
  this.pushPart({
    model: square,
    material: sleepMat,
    delay: 0,
    length: 100,
    update: function(pos, vel) {
      this.properties.pos = util.vec3.add(pos, util.vec3.make(0.125, -0.125, 0.25));
      this.properties.scale = ((Math.sin((parent.frame*0.1)+this.properties.wave)+1)*0.025)+0.175;
      //this.properties.color.w -= 1.0/90.0;
    },
    properties: {pos: util.vec3.add(this.pos, util.vec3.make(0.125, -0.125, 0)), wave: 0.66, scale: 0.15, color: rainbow[2](), angle: 0}
  });
};

ParticleSleep.prototype.pushPart = Particle.prototype.pushPart;

ParticleSleep.prototype.step = Particle.prototype.step;

ParticleSleep.prototype.getDraw = function(geometry, decals, lights, bounds) {
  for(var i=0;i<this.particles.length;i++) {
    var part = this.particles[i];
    var partUniformData = [
      {name: "transform", data: util.vec3.toArray(part.properties.pos)},
      {name: "scale", data: part.properties.scale},
      {name: "color", data: util.vec4.toArray(part.properties.color)},
      {name: "rotation", data: part.properties.angle}
    ];
    geometry.push({model: part.model, material: part.material, uniforms: partUniformData});
  }
};

ParticleSleep.prototype.active = Particle.prototype.active;

/* Used by EffectDefinition.js */
ParticleSleep.fxId = "particle";