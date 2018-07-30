"use strict";
/* global main */
/* global util */
/* global Particle */

/* Define Shiek Mark Rainbow Particle System Class */
function ParticleShiekMarkRainbow(game, pos, vel) {
  Particle.call(this, game, pos, vel);
}

ParticleShiekMarkRainbow.prototype.create = function() {
  var square = this.game.display.getModel("multi.square");
  var part = this.game.display.getModel("multi.fx.part2x");
  var markMat = this.game.display.getMaterial("character.shiek.effect.markwaveRB");
  var lineMat = this.game.display.getMaterial("character.shiek.effect.lineRB");
  
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
  for(var i=0;i<17;i++) {
    var r = util.vec3.random();
    var axAng = util.vec3.angle(up, r);
    var l = 8+Math.floor(Math.random()*2);
    this.pushPart({
      model: part,
      material: lineMat,
      delay: Math.floor(Math.random()*2),
      max: l,
      length: l,
      update: function() {
        this.properties.scale += 0.005;
        this.properties.alpha.x += (this.max*0.5)-this.length<=0?0.1:-0.1;
        this.properties.alpha.y = this.properties.alpha.x;
        this.properties.offset = util.vec3.add(this.properties.offset, this.properties.vel);
        this.properties.vel = util.vec3.scale(this.properties.vel, 0.965);
      },
      properties: {offset: util.vec3.scale(r, 1.45), vel: util.vec3.scale(r, -0.125), scale: 0.4, angle: axAng, alpha: util.vec2.make(0.35,35), frame: Math.floor(Math.random()*256)}
    });
  }
};

ParticleShiekMarkRainbow.prototype.pushPart = Particle.prototype.pushPart;

ParticleShiekMarkRainbow.prototype.step = Particle.prototype.step;

ParticleShiekMarkRainbow.prototype.getDraw = function(geometry, decals, lights, bounds) {
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

ParticleShiekMarkRainbow.prototype.active = Particle.prototype.active;

/* Used by EffectDefinition.js */
ParticleShiekMarkRainbow.fxId = "particle";