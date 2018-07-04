"use strict";
/* global main */
/* global util */
/* global Particle */
/* global PlayerCaptain */

/* Define Captain Punch Particle System Class */
function ParticleCaptainPunch(game, pos, vel, colorA, colorB) {
  /* Colors to use for particles */
  this.colorA = colorA;
  this.colorB = colorB;
  Particle.call(this, game, pos, vel);
}

ParticleCaptainPunch.prototype.create = function() {
  var square = this.game.display.getModel("multi.square");
  var part2x = this.game.display.getModel("multi.fx.part2x");
  
  var fireMat = this.game.display.getMaterial("multi.hit.burn");
  var sparkMat = this.game.display.getMaterial("multi.hit.spark");
  var flashMat = this.game.display.getMaterial("character.captain.effect.flash");
  var blastMat = this.game.display.getMaterial("character.captain.effect.blast");
  
  var parent = this;
  var colorA = function() { return util.vec4.copy(parent.colorA); };
  var colorB = function() { return util.vec4.copy(parent.colorB); };
  
  var off = util.vec2.toVec3(util.vec2.scale(util.vec2.normalize(this.vel), PlayerCaptain.PUNCH_HITBOX_OFFSET), 0);

  this.pushPart({
    model: square,
    material: blastMat,
    delay: 0,
    max: 9,
    length: 9,
    update: function(){
      this.properties.scale *= 1.185;
      this.properties.color.w -= 1.0/this.max;
      this.properties.tone.w -= 1.0/this.max;
    },
    properties: {offset: util.vec3.add(off, util.vec3.make(0,0,0.15)), scale: 0.7, color: colorB(), tone: colorA(), rotation: 0.0}
  });
  
  this.pushPart({
    model: square,
    material: blastMat,
    delay: 0,
    max: 9,
    length: 9,
    update: function(){
      this.properties.scale *= 1.185;
      this.properties.color.w -= 1.0/this.max;
      this.properties.tone.w -= 1.0/this.max;
    },
    properties: {offset: util.vec3.add(off, util.vec3.make(0,0,0.15)), scale: 0.65, color: colorB(), tone: colorA(), rotation: 0.0}
  });
    
  this.pushPart({
    model: square,
    material: flashMat,
    delay: 0,
    max: 7,
    length: 7,
    update: function(){
      this.properties.scale *= 1.175;
      this.properties.color.w -= this.length<=(this.max*0.5)?0.25/this.max:0.75/this.max;
    },
    properties: {offset: util.vec3.add(off, util.vec3.make(0,0,0.15)), scale: 1.1, color: colorA(), rotation: 0.0}
  });
  
  
  for(var i=0;i<44;i++) {
    var r = util.vec3.random();
    var v = util.vec3.scale(util.vec3.add(util.vec3.normalize(util.vec2.toVec3(this.vel, (Math.random()-0.5)*0.25)), util.vec3.scale(util.vec3.random(), 0.5)), 0.055+(Math.random()*0.123));
    this.pushPart({
      model: square,
      material: fireMat,
      delay: Math.floor(Math.random()*4),
      length: 12+Math.floor(Math.random()*18),
      update: function() {
        this.properties.offset = util.vec3.add(this.properties.offset, this.properties.vel);
        this.properties.vel = util.vec3.scale(this.properties.vel, 0.86);
        if(this.properties.offset.z <= -0.2) { this.properties.vel.z *= -0.85; }
        this.properties.scale += 0.0155;
        this.properties.rotation += 0.0195;
        this.properties.opacity -= 2/this.length;
        this.properties.color.w = Math.min(1, this.properties.opacity);
        this.properties.tone.w = Math.min(1, this.properties.opacity);
      },
      properties: {offset: util.vec3.add(util.vec3.scale(off, 0.45), util.vec3.scale(r, 0.2)), vel: v, scale: 0.425, rotation: Math.random()*6.28, color: colorA(), tone: colorB(), frame: Math.floor(Math.random()*32), opacity: 2}
    });
  }
  
  var up = util.vec3.make(0.,0.,1.);
  for(var i=0;i<44;i++) {
    var rand = util.vec3.random();
    var speed = (Math.random()*0.135)+0.095;
    var cmbvel = util.vec3.scale(util.vec3.normalize(util.vec3.add(util.vec3.normalize(this.vel), util.vec3.scale(rand, 0.5))), speed);
    var axAng = util.vec3.angle(up, cmbvel);
    
    this.pushPart({
      model: part2x,
      material: sparkMat,
      delay: Math.floor(Math.random()*3),
      length: 25+Math.floor(Math.random()*25),
      spawn: function(pos, vel) {
        var rand = util.vec3.random();
        var speed = (Math.random()*0.1)+0.075;
        var cmbvel = util.vec3.add(util.vec3.scale(vel, 0.2), util.vec3.scale(rand, speed));
        var axAng = util.vec3.angle(up, cmbvel);
        this.properties.pos = util.vec3.add(off, util.vec3.add(pos, util.vec3.scale(rand, 0.15)))
        this.properties.vel = cmbvel;
        this.properties.angle = axAng;
      },
      update: function() {
        var collision = parent.game.map.collideVec3(this.properties.pos, this.properties.vel);
        if(collision) { this.properties.vel = util.vec3.scale(collision.reflect, util.vec3.magnitude(this.properties.vel)); }
        
        this.properties.scale -= 0.0035;
        this.properties.vel = util.vec3.scale(util.vec3.add(this.properties.vel, {x: 0.0, y: 0.0, z: -0.0075}), 0.84);
        this.properties.pos = util.vec3.add(this.properties.pos, this.properties.vel);
        this.properties.angle = util.vec3.angle(up, this.properties.vel);
        this.properties.color.w -= 1/this.length;
        this.properties.tone.w -= 1/this.length;
      },
      properties: {pos: util.vec3.add(off, util.vec3.add(this.pos, util.vec3.scale(rand, 0.15))), scale: 0.165, vel: cmbvel, angle: axAng, color: colorA(), tone: colorB()}
    });
  }
  
};

ParticleCaptainPunch.prototype.pushPart = Particle.prototype.pushPart;

ParticleCaptainPunch.prototype.step = Particle.prototype.step;

ParticleCaptainPunch.prototype.getDraw = function(geometry, decals, lights, bounds) {
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

ParticleCaptainPunch.prototype.active = Particle.prototype.active;

/* Used by EffectDefinition.js */
ParticleCaptainPunch.fxId = "particle";