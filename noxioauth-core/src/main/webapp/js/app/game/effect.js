"use strict";
/* global main */
/* global util */
/* global Function */

/* NOTE: This class might be best described as "magic". You were warned. */

/* Define Effect Handler Class */
function Effect(components, loop) {
  this.loop = loop;
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
   !!TYPE must be of one these values: ["particle", "sound", "light", "decal"]!!
   NOTE: If an item of 'params' is an array the paramgen will randomly select an item from that array and use it as that param. This was added for easy sound perms.
*/
Effect.prototype.trigger = function(pos, vel) {
  for(var i=0;i<this.components.length;i++) {
    if(this.components[i].delay > 0) {
      this.delayed.push({component: this.components[i], delay: this.components[i].delay});
    }
    else {
      this.spawn(this.components[i], pos, vel);
    }
  }
};

/* Internal function! Call Trigger to trigger the effect. */
Effect.prototype.spawn = function(comp, pos, vel) {
  var paramgen = [];
  for(var j=0;j<comp.params.length;j++) {
    var param;
    if(Array.isArray(comp.params[j])) { param = comp.params[j][Math.floor(Math.random()*comp.params[j].length)]; }
    else { param = comp.params[j]; }
    switch(param) {
      case "<vec3 pos>" : { paramgen.push(pos); break; }
      case "<vec3 vel>" : { paramgen.push(vel); break; }
      default : { paramgen.push(param); break; }
    }
  }
  var gen;
  if(comp.type === "sound") {
    gen = {obj: comp.func.apply(comp.class, paramgen), update: comp.update, attachment: comp.attachment, length: comp.length, comp: comp};
    if(gen.attachment) { gen.obj.position(pos); }
    gen.obj.play(pos);
  }
  else {
    paramgen.unshift(null);
    gen = {obj: new (Function.prototype.bind.apply(comp.class, paramgen)), update: comp.update, attachment: comp.attachment, length: comp.length, comp: comp};
  }
  this[comp.type].push(gen);
};

/* @TODO LOOPING EFFECTS HAS BROUGHT UP A MAJOR PROBLEM, HAVE COMPONTENTS FLAG THEM SELVES FOR DISCARDING AND USE LENGTH AS A FUNCTION LOOPING ONLY! */
/* Updates components of the effect. */
Effect.prototype.step = function(pos, vel) {
  /* Update Sounds */
  for(var i=0;i<this.sound.length;i++) {
    var snd = this.sound[i];
    if(--snd.length <= 0) { 
      var remv = this.sound.splice(i, 1);
      if(this.loop) { this.spawn(remv[0].comp, snd.attachment?pos:remv[0].obj.pos, snd.attachment?vel:remv[0].obj.vel); }
    }
    else {
      if(snd.attachment) { snd.obj.position(pos); }
      snd.update(snd.obj);
    }
  }
  /* Update Lights */
  for(var i=0;i<this.light.length;i++) {
    var lit = this.light[i];
    if(--lit.length <= 0) { 
      var remv = this.light.splice(i, 1);
      if(this.loop) { this.spawn(remv[0].comp, lit.attachment?pos:remv[0].obj.pos, lit.attachment?vel:remv[0].obj.vel); }
    }
    else {
      if(lit.attachment) { lit.obj.pos = pos; }
      lit.update(lit.obj);
    }
  }
  /* Update Particles */
  for(var i=0;i<this.particle.length;i++) {
    var prt = this.particle[i];
    if(--prt.length <= 0) { 
      var remv = this.particle.splice(i, 1);
      if(this.loop) { this.spawn(remv[0].comp, prt.attachment?pos:remv[0].obj.pos, prt.attachment?vel:remv[0].obj.vel); }
    }
    else {
      if(prt.attachment) { prt.obj.step(pos, vel); }
      else { prt.obj.step(); }
      prt.update(prt.obj);
    }
  }
  /* Update Decals */
  for(var i=0;i<this.decal.length;i++) {
    var dcl = this.decal[i];
    if(--dcl.length <= 0) { 
      var remv = this.decal.splice(i, 1);
      if(this.loop) { this.spawn(remv[0].comp, dcl.attachment?pos:remv[0].obj.pos, dcl.attachment?vel:remv[0].obj.vel); }
    }
    else {
      if(dcl.attachment) { dcl.obj.step(pos, vel); }
      dcl.update(dcl.obj);
    }
  }
  /* Spawn Delayed */
  for(var i=0;i<this.delayed.length;i++) {
    if(--this.delayed[i].delay <= 0) {
      this.spawn(this.delayed[i].component, pos, vel);
      this.delayed.splice(i, 1);
    }
  }
};

/* Returns all geometry and lights of this effects components. */
Effect.prototype.getDraw = function(geometry, decals, lights, bounds) {
  for(var i=0;i<this.light.length;i++) {
    lights.push(this.light[i].obj);
  }
  for(var i=0;i<this.particle.length;i++) {
    this.particle[i].obj.getDraw(geometry, decals, lights, bounds);
  }
  for(var i=0;i<this.decal.length;i++) {
    this.decal[i].obj.getDraw(decals, bounds);
  }
};

/* Returns true if the effect is currently playing. */
Effect.prototype.active = function() {
  return this.particle.length > 0 || this.sound.length > 0 || this.light.length > 0 || this.decal.length > 0;
};

/* Destroys this effect. Stops sound and unloads components. */
Effect.prototype.destroy = function() {
  for(var i=0;i<this.sound.length;i++) {
    this.sound[i].obj.stop();
  }
  this.particle = [];
  this.sound = [];
  this.light = [];
  this.decal = [];
};