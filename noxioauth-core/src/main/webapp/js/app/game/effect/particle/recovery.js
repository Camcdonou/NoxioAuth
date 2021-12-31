"use strict";
/* global main */
/* global util */
/* global Particle */
/* global PlayerCargo*/

/* Define Cargo Kick Particle System Class */
function ParticleRecovery(game, pos, vel) {
  Particle.call(this, game, pos, vel);
}

ParticleRecovery.prototype.create = function() {
  var square = this.game.display.getModel("multi.square");
  
  var flashMat = this.game.display.getMaterial("character.cargo.effect.flash");
  
  var lightwhite = function(){ return {x: 1.0, y: 1.0, z: 1.0, w: 4}; };
      
  this.pushPart({
    model: square,
    material: flashMat,
    delay: 0,
    max: 7,
    length: 7,
    update: function(){
      this.properties.scale *= 1.275;
      this.properties.color.w -= 4./7.;
    },
    properties: {offset: util.vec3.make(0,0,0.55), scale: 1.1, color: lightwhite(), rotation: 0.0}
  });
};

ParticleRecovery.prototype.pushPart = Particle.prototype.pushPart;

ParticleRecovery.prototype.step = Particle.prototype.step;

ParticleRecovery.prototype.getDraw = function(geometry, decals, lights, bounds) {
  var cameraZ = this.game.display.camera.rot.z;
  for(var i=0;i<this.particles.length;i++) {
    var part = this.particles[i];
    var partUniformData = [
      {name: "scale", data: part.properties.scale},
      {name: "color", data: util.vec4.toArray(part.properties.color)}
    ];
    if(part.properties.offset) { partUniformData.push({name: "transform", data: util.vec3.toArray(util.vec3.add(this.pos, part.properties.offset))}); }
    if(part.properties.rotation) { partUniformData.push({name: "rotation", data: part.properties.rotation}); }
    if(part.properties.angle) { partUniformData.push({name: "angle", data: util.vec3.toArray(part.properties.angle)}); }
    geometry.push({model: part.model, material: part.material, uniforms: partUniformData});
  }
};

ParticleRecovery.prototype.active = Particle.prototype.active;

/* Used by EffectDefinition.js */
ParticleRecovery.fxId = "particle";