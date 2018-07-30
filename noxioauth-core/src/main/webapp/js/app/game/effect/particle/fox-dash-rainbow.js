"use strict";
/* global main */
/* global util */
/* global Particle */

/* Define Dash Rainbow Particle System Class */
function ParticleDashRainbow(game, pos, vel) {
  /* Colors to use for particles */
  Particle.call(this, game, pos, vel);
}

ParticleDashRainbow.prototype.create = function() {
  var square = this.game.display.getModel("multi.square");
  var part2x = this.game.display.getModel("multi.fx.part2x");
  
  var shockwaveMat = this.game.display.getMaterial("character.fox.effect.shockwaveRB");
  var speedLineMat = this.game.display.getMaterial("character.fox.effect.speedlineRB");
  var sparkMat = this.game.display.getMaterial("multi.hit.sparkRB");
  
  var parent = this;
  var colorA = function() { return util.vec4.make(1,1,1,1); };
  var colorB = function() { return util.vec4.make(1,1,1,0.5); };
  
  var shockwave  = {
    model: square,
    material: shockwaveMat,
    delay: 0,
    length: 9,
    update: function(){
      this.properties.scale *= 1.175;
      this.properties.alpha.x -= 0.75/9.0;
      this.properties.alpha.y -= 0.75/9.0;
    },
    properties: {pos: util.vec3.add(this.pos, util.vec3.make(0, 0, 0)), scale: 0.525, rotation: 0.0, alpha: util.vec2.make(0.75, 0.75)}
  };
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
        this.properties.alpha.x -= 1.0/9.0;
        this.properties.alpha.y -= 1.0/9.0;
        
        var norm = util.vec3.normalize(util.vec3.inverse(this.properties.vel));
        this.properties.rotation = -Math.atan(norm.y/norm.x);
      },
      properties: {pos: util.vec3.add(this.pos, util.vec3.scale(rand, 0.4)), vel: util.vec3.scale(reverse, 0.1), scale: 0.525, rotation: -Math.atan(norm.y/norm.x), alpha: util.vec2.make(1, 1), frame: parseInt(Math.random()*256)}
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
        this.properties.alpha.x -= 0.7/this.length;
        this.properties.alpha.y -= 0.7/this.length;
      },
      properties: {pos: util.vec3.add(this.pos, util.vec3.scale(rand, 0.15)), scale: 0.155, vel: cmbvel, angle: axAng, alpha: util.vec2.make(1, 1), frame: parseInt(Math.random()*256)}
    });
  }
};

ParticleDashRainbow.prototype.pushPart = Particle.prototype.pushPart;

ParticleDashRainbow.prototype.step = Particle.prototype.step;

ParticleDashRainbow.prototype.getDraw = function(geometry, decals, lights, bounds) {
  var cameraZ = this.game.display.camera.rot.z;
  for(var i=0;i<this.particles.length;i++) {
    var part = this.particles[i];
    var partUniformData = [
      {name: "transform", data: util.vec3.toArray(part.properties.pos)},
      {name: "scale", data: part.properties.scale},
      {name: "frame", data: this.game.frame + (part.properties.frame?part.properties.frame:0)},
      {name: "alpha", data: util.vec2.toArray(part.properties.alpha)}
    ];
    if(part.properties.rotation) { partUniformData.push({name: "rotation", data: part.properties.rotation - cameraZ}); }
    if(part.properties.angle) { partUniformData.push({name: "angle", data: util.vec3.toArray(part.properties.angle)}); }
    if(part.properties.alpha) { partUniformData.push(); }
    geometry.push({model: part.model, material: part.material, uniforms: partUniformData});
  }
};

ParticleDashRainbow.prototype.active = Particle.prototype.active;

/* Used by EffectDefinition.js */
ParticleDashRainbow.fxId = "particle";