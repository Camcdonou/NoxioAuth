"use strict";
/* global main */
/* global util */
/* global Particle */

/* Define Slash Hitstun Particle System Class */
function ParticleCubeCharge(game, pos, vel, colorA, colorB) {
  /* Colors to use for particles */
  this.colorA = colorA;
  this.colorB = colorB;
  Particle.call(this, game, pos, vel);
}

ParticleCubeCharge.prototype.create = function() {
  var square = this.game.display.getModel("multi.square");
  var part = this.game.display.getModel("multi.fx.part2x");
  var markMat = this.game.display.getMaterial("character.voxel.effect.markwave");
  var lineMat = this.game.display.getMaterial("character.voxel.effect.line");
  
  var parent = this;
  var colorA = function() { return util.vec4.copy(parent.colorA); };
  var colorB = function() { return util.vec4.copy(parent.colorB); };

  for(var i=0;i<9;i++) {
    this.pushPart({
      model: square,
      material: markMat,
      delay: i*7,
      max: 9,
      length: 9,
      update: function(pos){
        this.properties.scale *= 0.91;
        this.properties.rotation += 0.055;
        this.properties.color.w += (this.max*0.5)-this.length<=0?0.15:-0.15;
        this.properties.tone.w += (this.max*0.5)-this.length<=0?0.15:-0.15;
      },
      properties: {offset: util.vec3.make(0,0,-0.2), scale: .75 + (1.25-((i+1)/9)), color: util.vec4.copy3(colorA(), 0.05), tone: util.vec4.copy3(colorB(), 0.25), rotation: Math.random()*6.4}
    });
  }
  
  var up = util.vec3.make(0.,0.,1.);
  for(var i=0;i<60;i++) {
    var r = util.vec3.random();
    var axAng = util.vec3.angle(up, r);
    var l = 10+Math.floor(Math.random()*4);
    this.pushPart({
      model: part,
      material: lineMat,
      delay: Math.floor(i*.75),
      max: l,
      length: l,
      update: function() {
        this.properties.scale += 0.004;
        this.properties.color.w += (this.max*0.5)-this.length<=0?0.1:-0.1;
        this.properties.tone.w = this.properties.color.w;
        this.properties.offset = util.vec3.add(this.properties.offset, this.properties.vel);
        this.properties.vel = util.vec3.scale(this.properties.vel, 0.965);
      },
      properties: {offset: util.vec3.scale(r, 1. + (.75-((i+1)/60))), vel: util.vec3.scale(r, -0.075), scale: 0.4, angle: axAng, color: util.vec4.copy3(colorA(), 0.35), tone: util.vec4.copy3(colorB(), 0)}
    });
  }
};

ParticleCubeCharge.prototype.pushPart = Particle.prototype.pushPart;

ParticleCubeCharge.prototype.step = Particle.prototype.step;

ParticleCubeCharge.prototype.getDraw = function(geometry, decals, lights, bounds) {
  for(var i=0;i<this.particles.length;i++) {
    var part = this.particles[i];
    var partUniformData = [
      {name: "scale", data: part.properties.scale},
      {name: "totalSprites", data: 8},
      {name: "usedSprites", data: 8},
      {name: "color", data: util.vec4.toArray(part.properties.color)},
      {name: "tone", data: util.vec4.toArray(part.properties.tone)}
    ];
    if(part.properties.pos) { partUniformData.push({name: "transform", data: util.vec3.toArray(part.properties.pos)}); }
    if(part.properties.offset) { partUniformData.push({name: "transform", data: util.vec3.toArray(util.vec3.add(this.pos, part.properties.offset))}); }
    if(part.properties.rotation) { partUniformData.push({name: "rotation", data: part.properties.rotation}); }
    if(part.properties.angle) { partUniformData.push({name: "angle", data: util.vec3.toArray(part.properties.angle)}); }
    if(part.properties.frame) { partUniformData.push({name: "frame", data: part.properties.frame*0.5}); }
    
    geometry.push({model: part.model, material: part.material, uniforms: partUniformData});
  }
};

ParticleCubeCharge.prototype.active = Particle.prototype.active;

/* Used by EffectDefinition.js */
ParticleCubeCharge.fxId = "particle";