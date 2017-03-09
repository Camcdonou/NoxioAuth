"use strict";
/* global main */
/* global util */
/* global Function */

/* Define Effect Abstract Class */
function Effect(components) {   
  this.components = components;   // List of things to create when trigger() is called
  
  this.particle = []; /* Spec: {obj: <Particle>, attachment: <boolean>} */
  this.sound = [];    /* Spec: {obj: <Sound>, attachment: <boolean>} */
  this.light = [];    /* Spec: {obj: <Light>, attachment: <boolean>} */
  this.decal = [];    /* Spec: {obj: <Decal>, attachment: <boolean>} */
}

/* Spawns all components of the effect and keeps up with them until they finish. */
/* Component structure spec:
   NON-SOUND: {type: <string TYPE>, class: <function constructor>, params: <var[]>, update: <function>, attachment: <boolean>}
   SOUND:     {type: <string TYPE>, class: <object parent>, func: <function call>, params: <var[]>, update: <function>, attachment: <boolean>}
   TYPE must be of one these values: ["particle", "sound", "light", "decal"]
*/
Effect.prototype.trigger = function(pos, dir) { /* @FIXME DELAY TIMER DELAY TIMER DELAY TIMER & MAX LIFE MAX LIFE MAX LIFE */
  for(var i=0;i<this.components.length;i++) {
    var paramgen = [];
    for(var j=0;j<this.components[i].params.length;j++) {
      switch(this.components[i].params[j]) {
        case "<vec3 pos>" : { paramgen.push(pos); break; }
        case "<vec3 dir>" : { paramgen.push(dir); break; }
        default : { paramgen.push(this.components[i].params[j]); break; }
      }
    }
    var gen;
    if(this.components[i].type === "sound") {
      gen = {obj: this.components[i].func.apply(this.components[i].class, paramgen), update: this.components[i].update, attachment: this.components[i].attachment};
      gen.obj.play();
    }
    else {
      paramgen.unshift(null);
      gen = {obj: new (Function.prototype.bind.apply(this.components[i].class, paramgen)), update: this.components[i].update, attachment: this.components[i].attachment};
    }
    this[this.components[i].type].push(gen);
  }
};

/* Updates components of the effect. */
Effect.prototype.step = function(pos, dir) {
  for(var i=0;i<this.sound.length;i++) {
    var snd = this.sound[i];
    if(snd.attachment && snd.obj.pos) { snd.obj.pos = pos; }
    snd.update(snd.obj);
  }
  for(var i=0;i<this.light.length;i++) {
    var lit = this.light[i];
    if(lit.attachment) { lit.obj.pos = pos; }
    lit.update(lit.obj);
  }
};

/* Returns all geometry and lights of this effects components. */
Effect.prototype.getDraw = function(geometry, lights, bounds) {
  for(var i=0;i<this.light.length;i++) {
    lights.push(this.light[i].obj);
  }
};