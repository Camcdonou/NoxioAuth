"use strict";
/* global main */
/* global util */
/* global Function */

/* Define Effect Handler Class */
function Effect(components) {   
  this.components = components;   // List of things to create when trigger() is called
  
  this.delayed = [];  /* Spec: {component: <obj>, delay: <int frames>} */
  
  this.particle = []; /* Spec: {obj: <Particle>, update: <function>, attachment: <boolean>, length: <int frames>} */
  this.sound = [];    /* Spec: {obj: <Sound>, update: <function>, attachment: <boolean>, length: <int frames>} */
  this.light = [];    /* Spec: {obj: <Light>, update: <function>, attachment: <boolean>, length: <int frames>} */
  this.decal = [];    /* Spec: {obj: <Decal>, update: <function>, attachment: <boolean>, length: <int frames>} */
}

/* Spawns all components of the effect and keeps up with them until they finish. */
/* Component structure spec:
   NON-SOUND: {type: <string TYPE>, class: <function constructor>, params: <var[]>, update: <function>, attachment: <boolean>, delay: <int frames>, length: <int frames>}
   SOUND:     {type: <string TYPE>, class: <object parent>, func: <function call>, params: <var[]>, update: <function>, attachment: <boolean>, delay: <int frames>, length: <int frames>}
   TYPE must be of one these values: ["particle", "sound", "light", "decal"]
*/
Effect.prototype.trigger = function(pos, dir) {
  for(var i=0;i<this.components.length;i++) {
    if(this.components[i].delay > 0) {
      this.delayed.push({component: this.components[i], delay: this.components[i].delay});
    }
    else {
      this.spawn(this.components[i], pos, dir);
    }
  }
};

/* Internal function! Call Trigger to trigger the effect. */
Effect.prototype.spawn = function(comp, pos, dir) {
  var paramgen = [];
  for(var j=0;j<comp.params.length;j++) {
    switch(comp.params[j]) {
      case "<vec3 pos>" : { paramgen.push(pos); break; }
      case "<vec3 dir>" : { paramgen.push(dir); break; }
      default : { paramgen.push(comp.params[j]); break; }
    }
  }
  var gen;
  if(comp.type === "sound") {
    gen = {obj: comp.func.apply(comp.class, paramgen), update: comp.update, attachment: comp.attachment, length: comp.length};
    if(gen.attachment) { gen.obj.position(pos); } /* @FIXME Let's talk about how this can cause exceptions... */
    gen.obj.play(pos);
  }
  else {
    paramgen.unshift(null);
    gen = {obj: new (Function.prototype.bind.apply(comp.class, paramgen)), update: comp.update, attachment: comp.attachment, length: comp.length};
  }
  this[comp.type].push(gen);
};

/* Updates components of the effect. */
Effect.prototype.step = function(pos, dir) {
  /* Update Sounds */
  for(var i=0;i<this.sound.length;i++) {
    var snd = this.sound[i];
    if(--snd.length <= 0) { this.sound.splice(i, 1); }
    else {
      if(snd.attachment) { snd.obj.position(pos); }
      snd.update(snd.obj);
    }
  }
  /* Update Lights */
  for(var i=0;i<this.light.length;i++) {
    var lit = this.light[i];
    if(--lit.length <= 0) { this.light.splice(i, 1); }
    else {
      if(lit.attachment) { lit.obj.pos = pos; }
      lit.update(lit.obj);
    }
  }
  /* Update Particles */
  for(var i=0;i<this.particle.length;i++) {
    var prt = this.particle[i];
    if(--prt.length <= 0) { this.particle.splice(i, 1); }
    else {
      if(prt.attachment) { prt.obj.step(pos, dir); }
      else { prt.obj.step(); }
      prt.update(prt.obj);
    }
  }
  /* Spawn Delayed */
  for(var i=0;i<this.delayed.length;i++) {
    if(--this.delayed[i].delay <= 0) {
      this.spawn(this.delayed[i].component, pos, dir);
      this.delayed.splice(i, 1);
    }
  }
};

/* Returns all geometry and lights of this effects components. */
Effect.prototype.getDraw = function(geometry, lights, bounds) {
  for(var i=0;i<this.light.length;i++) {
    lights.push(this.light[i].obj);
  }
  for(var i=0;i<this.particle.length;i++) {
    this.particle[i].obj.getDraw(geometry, lights, bounds);
  }
};

/* Destroys this effect. Stops sound and unloads components. */
Effect.prototype.destroy = function() {
  for(var i=0;i<this.sound.length;i++) {
    this.sound[i].obj.stop();
  }
};