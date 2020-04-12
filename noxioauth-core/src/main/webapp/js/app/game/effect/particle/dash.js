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
  var part2x = this.game.display.getModel("multi.fx.part2x");
  
  var shockwaveMat = this.game.display.getMaterial("character.box.effect.shockwave");
  var speedLineMat = this.game.display.getMaterial("character.box.effect.speedline");
  var sparkMat = this.game.display.getMaterial("multi.hit.spark");
  
  var parent = this;
  var colorA = function() { return util.vec4.copy(parent.colorA); };
  var colorB = function() { return util.vec4.copy(parent.colorB); };
  
  var shockwave  = {
    model: square,
    material: shockwaveMat,
    delay: 0,
    length: 9,
    update: function(){
      this.properties.scale *= 1.175;
      this.properties.color.w -= 0.55/9.0;
    },
    properties: {pos: util.vec3.add(this.pos, util.vec3.make(0, 0, -0.245)), scale: 0.525, rotation: 0.0, color: util.vec4.copy3(colorA(), 0.55)}, tone: util.vec4.copy3(colorB(), 0.55)};
  this.pushPart(shockwave);
  
  var norm = util.vec3.normalize(this.vel);
  var reverse = util.vec3.inverse(norm);
  for(var i=0;i<22;i++) {
    var rand = util.vec3.random();
    this.pushPart({
      model: square,
      material: speedLineMat,
      delay: Math.floor(Math.random()*7),
      length: 9,
      spawn: function(pos, vel) {
        var rand = util.vec3.random();
        var norm = util.vec3.normalize(vel);
        var reverse = util.vec3.inverse(norm);
        this.properties.pos = util.vec3.add(pos, util.vec3.scale(rand, 0.4));
        this.properties.vel = util.vec3.scale(reverse, 0.1);
        this.properties.rotation = -Math.atan(norm.y/norm.x);
      },
      update: function() {
        this.properties.pos = util.vec3.add(this.properties.pos, this.properties.vel);
        this.properties.vel = util.vec3.scale(this.properties.vel, 0.965);
        this.properties.color.w -= 1.0/9.0;
        this.properties.tone.w -= 1.0/9.0;
        
        var norm = util.vec3.normalize(util.vec3.inverse(this.properties.vel));
        this.properties.rotation = -Math.atan(norm.y/norm.x);
      },
      properties: {pos: util.vec3.add(this.pos, util.vec3.scale(rand, 0.4)), vel: util.vec3.scale(reverse, 0.1), scale: 0.525, color: colorA(), tone: colorB(), rotation: -Math.atan(norm.y/norm.x)}
    });
  }
  
  var up = util.vec3.make(0.,0.,1.);
  for(var i=0;i<13;i++) {
    var rand = util.vec3.random();
    var speed = (Math.random()*0.105)+0.075;
    var cmbvel = util.vec3.add(util.vec3.scale(this.vel, 0.1), util.vec3.scale(rand, speed));
    var axAng = util.vec3.angle(up, cmbvel);
    
    this.pushPart({
      model: part2x,
      material: sparkMat,
      delay: 0,
      length: 21+Math.floor(Math.random()*22),
      update: function() {
        var collision = parent.game.map.collideVec3(this.properties.pos, this.properties.vel);
        if(collision) { this.properties.vel = util.vec3.scale(collision.reflect, util.vec3.magnitude(this.properties.vel)); }
        
        this.properties.scale -= 0.0065;
        this.properties.vel = util.vec3.scale(util.vec3.add(this.properties.vel, {x: 0.0, y: 0.0, z: -0.0075}), 0.935);
        this.properties.pos = util.vec3.add(this.properties.pos, this.properties.vel);
        this.properties.angle = util.vec3.angle(up, this.properties.vel);
        this.properties.color.w -= 0.7/this.length;
        this.properties.tone.w -= 0.7/this.length;
      },
      properties: {pos: util.vec3.add(this.pos, util.vec3.scale(rand, 0.15)), scale: 0.155, vel: cmbvel, angle: axAng, color: colorA(), tone: colorB()}
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
    ];
    if(part.properties.rotation) { partUniformData.push({name: "rotation", data: part.properties.rotation - cameraZ}); }
    if(part.properties.angle) { partUniformData.push({name: "angle", data: util.vec3.toArray(part.properties.angle)}); }
    if(part.properties.tone) { partUniformData.push({name: "tone", data: util.vec4.toArray(part.properties.tone)}); } /* second color used by 2tone shader */
    geometry.push({model: part.model, material: part.material, uniforms: partUniformData});
  }
};

ParticleDash.prototype.active = Particle.prototype.active;

/* Used by EffectDefinition.js */
ParticleDash.fxId = "particle";