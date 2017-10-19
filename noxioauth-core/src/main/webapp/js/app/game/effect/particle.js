"use strict";
/* global main */
/* global util */
/* global Function */

/* Define Particle Abstract Class */
/* Particle is an abstract class and should never actually be created. 
 * Javascript doesn't really have any equivalent to 'abstract' so I'm 
 * just going to remind you that if you instaniate this class I will
 * come find you irl.
 */
function Particle(game, pos, vel) {
  this.game = game;
  this.pos = pos;
  this.vel = vel;
  
  this.delayed = [];    // Particles waiting to be active
  this.particles = [];  // Active particles
  this.create();
}

/* Creates the particles, override to define a particle system */
/* Particles Spec: {model: <Model>, material: <Material>, delay: <int frames>, length: <int frames>, update: <function>, properties: <obj>} */
Particle.prototype.create = function() {
  
};

/* Final. Inherit this. */
Particle.prototype.pushPart = function(part) {
  if(part.delay > 0) { this.delayed.push(part); }
  else { this.particles.push(part); }
};

/* Final. Inherit this. */
/* if <vec3 pos> and <vec3 vel> are passed then they update the particle systems values. */
Particle.prototype.step = function(pos, vel) {
  /* Update position if passed */
  if(pos) { this.pos = pos; }
  if(vel) { this.vel = vel; }
  /* Update Particles */
  for(var i=0;i<this.particles.length;i++) {
    if(--this.particles[i].length <= 0) { this.particles.splice(i,1); }
    else {
      this.particles[i].update(pos, vel);
    }
  }
  /* Spawn Delayed */
  for(var i=0;i<this.delayed.length;i++) {
    if(--this.delayed[i].delay <= 0) {
      this.particles.push(this.delayed[i]);
      this.delayed.splice(i,1);
    }
  }
};

/* Override. Gets draw data for this particle system. */
Particle.prototype.getDraw = function(geometry, decals, lights, bounds) {
    /* NO. */
};