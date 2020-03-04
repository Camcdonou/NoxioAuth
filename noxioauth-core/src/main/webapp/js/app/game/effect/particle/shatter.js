"use strict";
/* global main */
/* global util */
/* global Particle */

/* Define Shatter Particle System Class */
function ParticleShatter(game, pos, vel, colorA, colorB) {
  /* Colors to use for particles */
  this.colorA = colorA;
  this.colorB = colorB;
  this.colorS = util.vec3.make(.5, .5, .5); // Special hack to have color change
  Particle.call(this, game, pos, vel);
}

ParticleShatter.prototype.create = function() {
  var square = this.game.display.getModel("multi.square");
  var part2x = this.game.display.getModel("multi.fx.part2x");
  var fragSm = this.game.display.getModel("character.generic.fragmentSm");
  var fragMd = this.game.display.getModel("character.generic.fragmentMd");
  var fragLg = this.game.display.getModel("character.generic.fragmentLg");
  
  var sparkMat = this.game.display.getMaterial("multi.hit.spark");
  var flashMat = this.game.display.getMaterial("multi.hit.critflare");
  var splitMat = this.game.display.getMaterial("character.fox.effect.spark");
  
  var whiteMat = this.game.display.getMaterial("character.generic.white");
  var greyMat = this.game.display.getMaterial("character.generic.grey");
  
  var parent = this;
  var colorA = function() { return util.vec4.copy(parent.colorA); };
  var colorB = function() { return util.vec4.copy(parent.colorB); };
    
  this.pushPart({
    model: square,
    material: flashMat,
    delay: 0,
    max: 8,
    length: 8,
    update: function(){
      this.properties.scale *= 1.175;
      this.properties.color.w -= this.length<=(this.max*.5)?.25/this.max:.75/this.max;
    },
    properties: {offset: util.vec3.make(0.,0.,.5), scale: 1.35, color: colorA(), rotation: 0.}
  });
  
  var up = util.vec3.make(0.,0.,1.);
  var genSpark = function(pos, vel) {
    var rand = util.vec3.random();
    var speed = (Math.random()*0.15)+0.175;
    var cmbvel = util.vec3.add(util.vec3.scale(vel, 0.5), util.vec3.scale(rand, speed));
    var axAng = util.vec3.angle(up, cmbvel);
    
    return {
      model: part2x,
      material: sparkMat,
      delay: 0,
      length: 28+Math.floor(Math.random()*35),
      update: function() {
        var collision = parent.game.map.collideVec3(this.properties.pos, this.properties.vel);
        if(collision) { this.properties.vel = util.vec3.scale(collision.reflect, util.vec3.magnitude(this.properties.vel)); }
        
        this.properties.scale -= 0.0035;
        this.properties.vel = util.vec3.scale(util.vec3.add(this.properties.vel, {x: 0.0, y: 0.0, z: -0.0075}), 0.89);
        this.properties.pos = util.vec3.add(this.properties.pos, this.properties.vel);
        this.properties.angle = util.vec3.angle(up, this.properties.vel);
        this.properties.color.w -= 0.5/this.length;
        this.properties.tone.w -= 0.5/this.length;
      },
      properties: {pos: util.vec3.add(pos, util.vec3.scale(rand, 0.125)), scale: 0.135, vel: cmbvel, angle: axAng, color: colorA(), tone: colorB()}
    };
  };
 
  for(var i=0;i<44;i++) {
    this.pushPart(genSpark(this.pos, this.vel));
  }
  
  var genSparkSm = function(pos, vel) {
    var rand = util.vec3.random();
    var speed = (Math.random()*0.075)+0.075;
    var cmbvel = util.vec3.add(util.vec3.scale(vel, 0.6), util.vec3.scale(rand, speed));
    var axAng = util.vec3.angle(up, cmbvel);
    
    return {
      model: part2x,
      material: sparkMat,
      delay: 0,
      length: 15+Math.floor(Math.random()*18),
      update: function() {
        var collision = parent.game.map.collideVec3(this.properties.pos, this.properties.vel);
        if(collision) { this.properties.vel = util.vec3.scale(collision.reflect, util.vec3.magnitude(this.properties.vel)); }
        
        this.properties.scale -= 0.0025;
        this.properties.vel = util.vec3.scale(util.vec3.add(this.properties.vel, {x: 0.0, y: 0.0, z: -0.0075}), 0.89);
        this.properties.pos = util.vec3.add(this.properties.pos, this.properties.vel);
        this.properties.angle = util.vec3.angle(up, this.properties.vel);
        this.properties.color.w -= 0.5/this.length;
        this.properties.tone.w -= 0.5/this.length;
      },
      properties: {pos: util.vec3.add(pos, util.vec3.scale(rand, 0.)), scale: 0.065, vel: cmbvel, angle: axAng, color: colorA(), tone: colorB()}
    };
  };
  
  var genSplitSm = function(pos) {
    return {
      model: square,
      material: splitMat,
      delay: 0,
      max: 3,
      length: 3,
      update: function(){
        this.properties.scale *= 1.475;
        this.properties.color.w *= .8;
      },
      properties: {pos: util.vec3.add(pos, util.vec3.make(0., 0., .01)), scale: 0.055, color: colorA(), tone: colorB(), rotation: Math.random()}
    };
  };
  
  var genSplitMd = function(pos) {
    return {
      model: square,
      material: splitMat,
      delay: 0,
      max: 3,
      length: 3,
      update: function(){
        this.properties.scale *= 1.475;
        this.properties.color.w *= .8;
      },
      properties: {pos: util.vec3.add(pos, util.vec3.make(0., 0., .03)), scale: 0.085, color: colorA(), tone: colorB(), rotation: Math.random()}
    };
  };
  
  var genFragSm = function(pos, vel) {
    var rand = util.vec3.random();
    var speed = (Math.random()*0.075)+0.075;
    var cmbvel = util.vec3.add(util.vec3.scale(vel, 0.9), util.vec3.scale(rand, speed));
    var angvel = util.vec3.scale(util.vec3.normalize(util.vec3.make(Math.random(), Math.random(), Math.random())), (Math.random()*0.15)+0.1); // Tiny chance to NaN, in theory...
    return {
      model: fragSm,
      material: (Math.random()>.5)?whiteMat:greyMat,
      delay: 0,
      length: 14+Math.floor(Math.random()*12),
      hoff: -0.03,// Collision height offset
      update: function() {
        var collision = parent.game.map.collideVec3(util.vec3.add(this.properties.pos, util.vec3.make(0., 0., this.hoff)), this.properties.vel);
        if(collision) {
          this.properties.vel = util.vec3.scale(collision.reflect, util.vec3.magnitude(this.properties.vel) * .75);
          if(collision.grounded) { this.properties.pos.z = 0.; }
        }
        if((collision && Math.random() > .25) || this.length <= 1) {
          this.length = 0;
          parent.pushPart(genSplitSm(this.properties.pos));
          for(var i=0;i<2;i++) { parent.pushPart(genSparkSm(this.properties.pos, this.properties.vel)); }
        }
        
        this.properties.vel = util.vec3.scale(util.vec3.add(this.properties.vel, {x: 0.0, y: 0.0, z: -0.0085}), 0.95);
        this.properties.pos = util.vec3.add(this.properties.pos, this.properties.vel);
        this.properties.avel = util.vec3.scale(this.properties.avel, 0.98);
        this.properties.angle = util.vec3.add(this.properties.angle, this.properties.avel);
      },
      properties: {pos: pos, vel: cmbvel, avel: angvel, angle: util.vec3.create(), scale: 1., color3: true}
    };
  };
  
  var genFragMd = function(pos, vel) {
    var rand = util.vec3.random();
    var speed = (Math.random()*0.075)+0.075;
    var cmbvel = util.vec3.add(util.vec3.scale(vel, 0.45), util.vec3.scale(rand, speed));
    var angvel = util.vec3.scale(util.vec3.normalize(util.vec3.make(Math.random(), Math.random(), Math.random())), (Math.random()*0.15)+0.1); // Tiny chance to NaN, in theory...
    return {
      model: fragMd,
      material: (Math.random()>.5)?whiteMat:greyMat,
      delay: 0,
      length: 17+Math.floor(Math.random()*13),
      hoff: -0.06,// Collision height offset
      update: function() {
        var collision = parent.game.map.collideVec3(util.vec3.add(this.properties.pos, util.vec3.make(0., 0., this.hoff)), this.properties.vel);
        if(collision) {
          if(collision.grounded) { this.properties.pos.z = 0.; }
          this.properties.vel = util.vec3.scale(collision.reflect, util.vec3.magnitude(this.properties.vel) * .65);
        }
        if((collision && Math.random() > .5) || this.length <= 1) {
          this.length = 0;
          for(var i=0;i<3;i++) {
            parent.pushPart(genFragSm(this.properties.pos, this.properties.vel));
          }
          parent.pushPart(genSplitMd(this.properties.pos));
        }
        
        this.properties.vel = util.vec3.scale(util.vec3.add(this.properties.vel, {x: 0.0, y: 0.0, z: -0.0085}), 0.95);
        this.properties.pos = util.vec3.add(this.properties.pos, this.properties.vel);
        this.properties.avel = util.vec3.scale(this.properties.avel, 0.98);
        this.properties.angle = util.vec3.add(this.properties.angle, this.properties.avel);
      },
      properties: {pos: pos, vel: cmbvel, avel: angvel, angle: util.vec3.create(), scale: 1., color3: true}
    };
  };
  
  var boff = .25; // Offset to middle
  var bs = .125; // Size of md fragment
  var voff = 0.05; // Extra height for reasons
  var center = util.vec3.add(this.pos, util.vec3.make(0., 0., boff)); // Worldspace center of object
  for(var i=0;i<4;i++) {
    for(var j=0;j<4;j++) {
      for(var k=0;k<4;k++) {
        this.pushPart(genFragMd(util.vec3.add(center, util.vec3.make((i*bs)-boff, (j*bs)-boff, (k*bs)-boff+voff)), this.vel));
      }
    }
  }
  
};

ParticleShatter.prototype.pushPart = Particle.prototype.pushPart;

ParticleShatter.prototype.step = Particle.prototype.step;

ParticleShatter.prototype.getDraw = function(geometry, decals, lights, bounds) {
  var cameraZ = this.game.display.camera.rot.z;
  for(var i=0;i<this.particles.length;i++) {
    var part = this.particles[i];
    var partUniformData = [
      {name: "scale", data: part.properties.scale}
    ];
    if(part.properties.color) { partUniformData.push({name: "color", data: util.vec4.toArray(part.properties.color)}); }
    if(part.properties.color3) { partUniformData.push({name: "color", data: util.vec3.toArray(this.colorS)}); }
    if(part.properties.tone) { partUniformData.push({name: "tone", data: util.vec4.toArray(part.properties.tone)}); } /* second color used by 2tone shader */
    if(part.properties.offset) { partUniformData.push({name: "transform", data: util.vec3.toArray(util.vec3.add(this.pos, part.properties.offset))}); }
    if(part.properties.pos) { partUniformData.push({name: "transform", data: util.vec3.toArray(part.properties.pos)}); }
    if(part.properties.rotation) { partUniformData.push({name: "rotation", data: part.properties.rotation}); }
    if(part.properties.angle) { partUniformData.push({name: "angle", data: util.vec3.toArray(part.properties.angle)}); }
    geometry.push({model: part.model, material: part.material, uniforms: partUniformData});
  }
};

ParticleShatter.prototype.active = Particle.prototype.active;

/* Used by EffectDefinition.js */
ParticleShatter.fxId = "particle";