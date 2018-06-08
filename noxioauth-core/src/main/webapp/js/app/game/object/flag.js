"use strict";
/* global main */
/* global util */
/* global GameObject */
/* global NxFx */

/* Define Flag Object Class */
function FlagObject(game, oid, pos, permutation, team, color) {
  GameObject.call(this, game, oid, pos, permutation, team, color);
  
  this.model = this.game.display.getModel("object.flag.flag");
  this.material = this.game.display.getMaterial("object.flag.flag");

  /* Settings */
  this.radius = 0.1; this.friction = 0.725;
  this.cullRadius = 3.0;

  /* State */
  this.onBase = 1;                 // 1 -> Flag is on flagstand | 0 -> Flag is not on the flag stand and should draw on hud

  this.targetCircle = new Decal(this.game, "object.target.targetcircle", util.vec2.toVec3(this.pos, Math.min(this.height, 0.0)), {x: 0.0, y: 0.0, z: 1.0}, 0.4, 0.0, util.vec4.make(1,1,1,1), 15, 0, 0);
};

FlagObject.prototype.update = function(data) {
  var pos = util.vec2.parse(data.shift());
  var vel = util.vec2.parse(data.shift());
  var height = parseFloat(data.shift());
  var vspeed = parseFloat(data.shift()); 
  var onBase = parseInt(data.shift());
  var effects = data.shift().split(",");
  
  this.setPos(pos);
  this.setVel(vel);
  this.setHeight(height, vspeed);
  this.onBase = onBase;
  for(var i=0;i<effects.length-1;i++) {
    switch(effects[i]) {
      case "lnd" : { this.land(); break; }
      case "htg" : { this.stunGeneric(); return true; }
      case "hts" : { this.stunSlash(); return true; }
      case "hte" : { this.stunElectric(); return true; }
      case "htf" : { this.stunFire(); return true; }
      case "crt" : { this.criticalHit(); return true; }
      default : { main.menu.warning.show("Invalid effect value: '" + effects[i] + "' @ Bomb.js :: update()"); break; }
    }
  }
  
  /* Step Effects */
  this.targetCircle.step(util.vec2.toVec3(this.pos, Math.min(this.height, 0.0)), 0.4, 0.0);
  for(var i=0;i<this.effects.length;i++) {
    this.effects[i].effect.step(util.vec3.add(this.effects[i].offset, util.vec2.toVec3(this.pos, this.height)), util.vec2.toVec3(this.vel, this.vspeed));
  }
};

FlagObject.prototype.land = function() {
  this.effects.push(NxFx.player.land.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};

FlagObject.prototype.stun = function() {
  
};

FlagObject.prototype.stunGeneric = function() {
  this.effects.push(NxFx.hit.generic.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.stun();
};

FlagObject.prototype.stunSlash = function() {
  this.effects.push(NxFx.hit.slash.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.stun();
};

FlagObject.prototype.stunElectric = function() {
  this.effects.push(NxFx.hit.electric.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.stun();
};

FlagObject.prototype.stunFire = function() {
  this.effects.push(NxFx.hit.fire.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.stun();
};

FlagObject.prototype.criticalHit = function() {
  this.effects.push(NxFx.hit.critical.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};

FlagObject.prototype.explode = function() { };
FlagObject.prototype.fall = function() { };

FlagObject.prototype.setPos = GameObject.prototype.setPos;
FlagObject.prototype.setVel = GameObject.prototype.setVel;
FlagObject.prototype.setHeight = GameObject.prototype.setHeight;

FlagObject.prototype.getDraw = function(geometry, decals, lights, bounds) {
  var exbounds = util.matrix.expandPolygon(bounds, this.cullRadius);
  if(util.intersection.pointPoly(this.pos, exbounds)) {
    var colors, color, dcolor;
    colors = util.kalide.getColorsAuto(this.color, this.team);
    if(colors.length > 1) {
      var ind = Math.floor(this.game.frame/128)%(colors.length);
      color = util.vec3.lerp(colors[ind], colors[ind+1<colors.length?ind+1:0], (this.game.frame%128)/128);
    }
    else { color = colors[0]; }
    dcolor = this.team === -1 && this.color === 0 ? util.vec3.make(1, 1, 1) : color; // Make decal white for default boys.
    
    this.targetCircle.setColor(util.vec3.toVec4(dcolor, 1));
    
    var flagUniformData = [
      {name: "transform", data: [this.pos.x, this.pos.y, this.height]},
      {name: "color", data: util.vec3.toArray(color)},
      {name: "rotation", data: 0.0},
      {name: "scale", data: 1.0}
    ];
    geometry.push({model: this.model, material: this.material, uniforms: flagUniformData});
    for(var i=0;i<this.effects.length;i++) {
      this.effects[i].effect.getDraw(geometry, decals, lights, bounds);
    }
    this.targetCircle.getDraw(decals, bounds);
  }
};

FlagObject.prototype.destroy = function() {
  for(var i=0;i<this.effects.length;i++) {
    this.effects[i].destroy();
  }
};

FlagObject.prototype.type = function() { return "flg"; };