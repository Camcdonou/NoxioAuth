"use strict";
/* global main */
/* global util */
/* global Particle */

/* Define Dash Particle System Class */
function ParticleCrateCharge(game, pos, vel, colorA, colorB) {
  /* Colors to use for particles */
  this.colorA = colorA;
  this.colorB = colorB;
  Particle.call(this, game, pos, vel);
}

ParticleCrateCharge.prototype.create = function() {
  var square = this.game.display.getModel("multi.square");
  var part2x = this.game.display.getModel("multi.fx.part2x");
  
  var fireMat = this.game.display.getMaterial("multi.hit.burn");
  var shockwaveMat = this.game.display.getMaterial("character.crate.effect.shockwave");
  var sparkMat = this.game.display.getMaterial("multi.hit.spark");
  
  var parent = this;
  var colorA = function() { return util.vec4.copy(parent.colorA); };
  var colorB = function() { return util.vec4.copy(parent.colorB); };
  
  for(var i=0;i<3;i++) {
    this.pushPart({
      model: square,
      material: shockwaveMat,
      delay: i*5,
      max: 15,
      length: 15,
      update: function(){
        this.properties.scale += 0.125;
        this.properties.color.w -= 0.7/this.max;
        this.properties.tone.w -= 0.7/this.max;
      },
      properties: {offset: util.vec3.make(0,0,0.05), scale: 0.5, color: util.vec4.copy3(colorB(), 0.7), tone: util.vec4.copy3(colorA(), 0.7), rotation: 0.0}
    });
  }
  
  for(var i=0;i<55;i++) {
    this.pushPart({
      model: square,
      material: fireMat,
      delay: Math.floor(Math.random()*18),
      length: 15+Math.floor(Math.random()*24),
      update: function() {
        this.properties.offset = util.vec2.toVec3(util.vec2.add(this.properties.offset, util.vec2.scale(this.properties.offset, 0.06)), 0.1);
        
        this.properties.scale += 0.015;
        this.properties.rotation += 0.0095;
        this.properties.opacity -= 2/this.length;
        this.properties.color.w = Math.min(1, this.properties.opacity);
        this.properties.tone.w = Math.min(1, this.properties.opacity);
      },
      properties: {offset: util.vec2.toVec3(util.vec2.scale(util.vec2.random(), 0.3), 0.1), scale: 0.3, rotation: Math.random()*6.28, color: colorA(), tone: colorB(), frame: Math.floor(Math.random()*32), opacity: 2}
    });
  }
  
  var up = util.vec3.make(0.,0.,1.);
  for(var i=0;i<45;i++) {
    var rand = util.vec3.normalize(util.vec2.toVec3(util.vec2.random(), Math.abs(Math.random()*0.125) + 0.05));
    var speed = (Math.random()*0.125)+0.105;
    var cmbvel = util.vec3.add(util.vec3.scale(this.vel, 0.5), util.vec3.scale(rand, speed));
    var axAng = util.vec3.angle(up, cmbvel);
    
    this.pushPart({
      model: part2x,
      material: sparkMat,
      delay: Math.floor(Math.random()*20),
      length: 5+Math.floor(Math.random()*65),
      spawn: function(p, v) {
        var pos = p?p:parent.pos;
        var vel = v?v:parent.vel;
        var rand = util.vec3.normalize(util.vec2.toVec3(util.vec2.random(), Math.abs(Math.random()*0.125) + 0.05));
        var speed = (Math.random()*0.125)+0.105;
        var cmbvel = util.vec3.add(util.vec3.scale(vel, 0.5), util.vec3.scale(rand, speed));
        var axAng = util.vec3.angle(up, cmbvel);
        this.properties.pos = util.vec3.add(pos, util.vec3.scale(rand, 0.25));
        this.properties.vel = cmbvel;
        this.properties.angle = axAng;
      },
      update: function() {
        var collision = parent.game.map.collideVec3(this.properties.pos, this.properties.vel);
        if(collision) { this.properties.vel = util.vec3.scale(collision.reflect, util.vec3.magnitude(this.properties.vel)); }
        
        this.properties.scale -= 0.0075;
        this.properties.vel = util.vec3.scale(util.vec3.add(this.properties.vel, {x: 0.0, y: 0.0, z: -0.0075}), 0.84);
        this.properties.pos = util.vec3.add(this.properties.pos, this.properties.vel);
        this.properties.angle = util.vec3.angle(up, this.properties.vel);
        this.properties.color.w -= 1/this.length;
        this.properties.tone.w -= 1/this.length;
      },
      properties: {pos: util.vec3.add(this.pos, util.vec3.scale(rand, 0.25)), scale: 0.165, vel: cmbvel, angle: axAng, color: colorA(), tone: colorB()}
    });
  }
  
};

ParticleCrateCharge.prototype.pushPart = Particle.prototype.pushPart;

ParticleCrateCharge.prototype.step = Particle.prototype.step;

ParticleCrateCharge.prototype.getDraw = function(geometry, decals, lights, bounds) {
  var cameraZ = this.game.display.camera.rot.z;
  for(var i=0;i<this.particles.length;i++) {
    var part = this.particles[i];
    var partUniformData = [
      {name: "scale", data: part.properties.scale},
      {name: "color", data: util.vec4.toArray(part.properties.color)},
      {name: "totalSprites", data: 16},
      {name: "usedSprites", data: 16}
    ];
    if(part.properties.tone) { partUniformData.push({name: "tone", data: util.vec4.toArray(part.properties.tone)}); } /* second color used by 2tone shader */
    if(part.properties.offset) { partUniformData.push({name: "transform", data: util.vec3.toArray(util.vec3.add(this.pos, part.properties.offset))}); }
    if(part.properties.pos) { partUniformData.push({name: "transform", data: util.vec3.toArray(part.properties.pos)}); }
    if(part.properties.rotation) { partUniformData.push({name: "rotation", data: part.properties.rotation}); }
    if(part.properties.angle) { partUniformData.push({name: "angle", data: util.vec3.toArray(part.properties.angle)}); }
    if(part.properties.frame) { partUniformData.push({name: "frame", data: Math.floor((part.properties.frame + this.frame) * 0.35)}); }
    geometry.push({model: part.model, material: part.material, uniforms: partUniformData});
  }
};

ParticleCrateCharge.prototype.active = Particle.prototype.active;

/* Used by EffectDefinition.js */
ParticleCrateCharge.fxId = "particle";