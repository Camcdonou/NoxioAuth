"use strict";
/* global main */
/* global util */
/* global Function */

/* NOTE: This class might be best described as "magic". You were warned. */

/* Define Effect Definition Class */
function EffectDefinition(name, offset, length, attachment, components) {
  this.name = name;
  this.offset = offset;
  this.length = length;           // Max length in frames, 0 = infinite
  this.attachment = attachment;
  this.components = components;   // List of things to create when trigger() is called
}

  /* Component parameters 
   * {class: <Supported Class>, params: [<Constructor params...>], update: <function(obj)>, attachment: <boolean>, delay: <int> }
   */

/* Returns an effect object, the class that called this trigger is responsible for
   that effect object. It must be updated (call effect.step()) and drawn by that class. */
EffectDefinition.prototype.trigger = function(game, pos, vel) {
  var lights = [];
  var particles = [];
  var decals = [];
  var sounds = [];
  
  for(var i=0;i<this.components.length;i++) {
    var comp = this.components[i];
    if(!comp.update) { comp.update = function(obj) { }; }
    
    var paramgen = [];
    for(var j=0;j<comp.params.length;j++) {
      var param = comp.params[j];
      switch(param) {
        case "<vec3 pos>" : { paramgen.push(pos); break; }
        case "<vec3 vel>" : { paramgen.push(vel); break; }
        case "<sound *>" : { paramgen.push(game.sound); break; }
        case "<display *>" : { paramgen.push(game.display); break; }
        case "<game *>" : { paramgen.push(game); break; }
        default : { paramgen.push(param); break; }
      }
    }
    
    switch(comp.class.fxId) {
      case "light" : {
        paramgen.unshift(null);
        lights.push({
          obj: new (Function.prototype.bind.apply(comp.class, paramgen)),
          update: comp.update,
          delay: comp.delay,
          attachment: comp.attachment,
          length: comp.length
        });
        break;
      }
      case "particle" : {
        paramgen.unshift(null);
        particles.push({
          obj: new (Function.prototype.bind.apply(comp.class, paramgen)),
          update: comp.update,
          delay: comp.delay,
          attachment: comp.attachment,
          length: comp.length
        });
        break;
      }
      case "decal" : {
        paramgen.unshift(null);
        decals.push({
          obj: new (Function.prototype.bind.apply(comp.class, paramgen)),
          update: comp.update,
          delay: comp.delay,
          attachment: comp.attachment,
          length: comp.length
        });
        break;
      }
      case "sound" : {
        var clas = paramgen.shift();
        var func = clas.getSpatialSound;
        if(Array.isArray(paramgen[0])) { paramgen[0] = paramgen[0][Math.floor(Math.random()*paramgen[0].length)]; } /* Choose from sound permutations. */
        var gen = {
          obj: func.apply(clas, paramgen),
          update: comp.update,
          delay: comp.delay,
          attachment: comp.attachment,
          length: comp.length,
          comp: comp
        };
        if(gen.delay < 1) { gen.obj.play(pos); }
        sounds.push(gen);
        break;
      }
      default : { main.menu.warning.show("Invalid component class in EffectDefinition :: " + this.name); }
    }
  }
  
  var effect = new Effect(this.name, this.offset, this.attachment, this.length, pos, vel, lights, particles, decals, sounds);
  return effect;
};

/* An instance of an EffectDefinition */
function Effect(name, offset, attachment, length, pos, vel, l, p, d, s) {
  this.name = name;
  this.attachment= attachment;
  this.offset = offset;
  this.length = length;
  
  this.pos = util.vec3.add(pos, offset);
  this.vel = vel;
  this.age = 0;
  
  this.lights = l;
  this.particles = p;
  this.decals = d;
  this.sounds = s;
}

Effect.prototype.step = function(pos, vel) {
  if(this.age++ > this.length && this.length > 0) { this.destroy(); }
  
  if(pos) { this.pos = util.vec3.add(pos, this.offset); }
  if(vel) { this.vel = vel; }
  
  for(var i=0;i<this.lights.length;i++) {
    var l = this.lights[i];
    if(l.delay > 0) { l.delay--; continue; }
    if(!l.obj.active()) { this.lights.splice(i--, 1); continue; }
    
    if(l.attachment) { l.obj.step(this.pos, this.vel); }
    else { l.obj.step(); }
    l.update(l.obj);
  }
  for(var i=0;i<this.particles.length;i++) {
    var p = this.particles[i];
    if(p.delay > 0) { p.delay--; continue; }
    if(!p.obj.active()) { this.particles.splice(i--, 1); continue; }
    
    if(p.attachment) { p.obj.step(this.pos, this.vel); }
    else { p.obj.step(); }
    p.update(p.obj);
  }
  for(var i=0;i<this.decals.length;i++) {
    var d = this.decals[i];
    if(d.delay > 0) { d.delay--; continue; }
    if(!d.obj.active()) { this.decals.splice(i--, 1); continue; }
    
    if(d.attachment) { d.obj.step(this.pos, this.vel); }
    else { d.obj.step(); }
    d.update(d.obj);
  }
  for(var i=0;i<this.sounds.length;i++) {
    var s = this.sounds[i];
    if(s.delay > 0) { s.delay--; continue; }
    if(!s.obj.played) { s.obj.play(this.pos); }
    if(!s.obj.playing && s.obj.played) { this.sounds.splice(i--, 1); continue; }
    
    if(s.attachment) { s.obj.position(this.pos); }
    s.update(s.obj);
  }
};

Effect.prototype.getDraw = function(geometry, decals, lights, bounds) {
  for(var i=0;i<this.lights.length;i++) {
    var l = this.lights[i]; 
    if(l.delay < 1) { lights.push(l.obj); }
  }
  for(var i=0;i<this.particles.length;i++) {
    var p = this.particles[i];
    if(p.delay <1) { p.obj.getDraw(geometry, decals, lights, bounds); }
  }
  for(var i=0;i<this.decals.length;i++) {
    var d = this.decals[i];
    if(d.delay < 1) { d.obj.getDraw(decals, bounds); }
  }
};

/* Returns true if the effect is still doing something. */
Effect.prototype.active = function() {
  return this.particles.length > 0 || this.sounds.length > 0 || this.lights.length > 0 || this.decals.length > 0;
};

/* Destroys this effect. */
Effect.prototype.destroy = function() {
  for(var i=0;i<this.sounds.length;i++) {
    this.sounds[i].obj.stop();
  }
  this.particles = [];
  this.sounds = [];
  this.lights = [];
  this.decals = [];
};