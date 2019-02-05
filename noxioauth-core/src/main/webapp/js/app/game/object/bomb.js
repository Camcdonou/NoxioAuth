"use strict";
/* global main */
/* global util */
/* global GameObject */
/* global PlayerObject */
/* global NxFx */

/* Define Bomb Object Class */
function BombObject(game, oid, pos, permutation, team, color) {
  GameObject.call(this, game, oid, pos, permutation, team, color);
  
  this.model = this.game.display.getModel("object.bomb.bomb");
  this.material = this.game.display.getMaterial("object.bomb.bomb");
  
  /* Settings */
  this.radius = 0.25; this.weight = 0.5; this.friction = 0.725;
  this.cullRadius = 1.0;

  /* State */
  this.onBase = 1;                 // 1 -> Bomb is on start point | 0 -> Bomb is not on the start point and should draw on hud
  this.armed = false;
  this.timer = 0;
  
  /* Decal */
  this.targetCircle = new Decal(this.game, "object.target.targetcircle", util.vec2.toVec3(this.pos, Math.min(this.height, 0.0)), {x: 0.0, y: 0.0, z: 1.0}, 0.4, 0.0, util.vec4.make(1,1,1,1), 15, 0, 0);
};

BombObject.prototype.update = function(data) {
  /* Apply update data to object */
  var pos = util.vec2.parse(data.shift());
  var vel = util.vec2.parse(data.shift());
  var height = parseFloat(data.shift());
  var vspeed = parseFloat(data.shift());
  var onBase = parseInt(data.shift());
  var detTimer = parseInt(data.shift());
  var effects = data.shift().split(",");
  
  this.setPos(pos);
  this.setVel(vel);
  this.setHeight(height, vspeed);
  this.onBase = onBase;
  this.armed = detTimer>=0;
  this.timer = this.armed?detTimer:0;
  for(var i=0;i<effects.length-1;i++) {
    switch(effects[i]) {
      case "lnd" : { this.land(); break; }
      case "fal" : { this.fall(); break; }
      case "xpl" : { this.explode(); break; }
      case "hg" : { this.stunGeneric(); return true; }
      case "hs" : { this.stunSlash(); return true; }
      case "hsxp" : { this.stunSlash("purple"); return true; }
      case "hsxf" : { this.stunSlash("fire"); return true; }
      case "hsxrb" : { this.stunSlash("rainbow"); return true; }
      case "he" : { this.stunElectric(); return true; }
      case "hexr" : { this.stunElectric("red"); return true; }
      case "hexo" : { this.stunElectric("orange"); return true; }
      case "hexg" : { this.stunElectric("green"); return true; }
      case "hexp" : { this.stunElectric("purple"); return true; }
      case "hexb" : { this.stunElectric("black"); return true; }
      case "hexrb" : { this.stunElectric("rainbow"); return true; }
      case "hf" : { this.stunFire(); return true; }
      case "hfxp" : { this.stunFire("purple"); return true; }
      case "hfxb" : { this.stunFire("black"); return true; }
      case "hfxrb" : { this.stunFire("rainbow"); return true; }
      case "hfxrt" : { this.stunFire("retro"); return true; }
      case "crt" : { this.criticalHit(); return true; }
      case "imp" : { this.impact(); break; }
      case "arm" : { this.arm(); break; }
      case "det" : { this.detonate(); break; }
      default : { main.menu.warning.show("Invalid effect value: '" + effects[i] + "' @ Bomb.js :: update()"); break; }
    }
  }
  
  /* Timers */
  
  /* Step Effects */
  this.targetCircle.step(util.vec2.toVec3(this.pos, 0.0), 0.4, 0.0);
  for(var i=0;i<this.effects.length;i++) {
    if(this.effects[i].active()) { this.effects[i].step(util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)); }
    else { this.effects.splice(i--, 1); }
  }
};

BombObject.prototype.land = function() {
  this.effects.push(NxFx.player.land.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};

BombObject.prototype.stun = function() {
  
};

BombObject.prototype.stunGeneric = PlayerObject.prototype.stunGeneric;
BombObject.prototype.stunSlash = PlayerObject.prototype.stunSlash;
BombObject.prototype.stunElectric = PlayerObject.prototype.stunElectric;
BombObject.prototype.stunFire = PlayerObject.prototype.stunFire;
BombObject.prototype.criticalHit = PlayerObject.prototype.criticalHit;

BombObject.prototype.explode = function() { };
BombObject.prototype.fall = function() { };

BombObject.prototype.setPos = GameObject.prototype.setPos;
BombObject.prototype.setVel = GameObject.prototype.setVel;
BombObject.prototype.setHeight = GameObject.prototype.setHeight;

BombObject.prototype.impact = function() {

};

BombObject.prototype.arm = function() {

};

BombObject.prototype.detonate = function() {

};

BombObject.prototype.getDraw = function(geometry, decals, lights, bounds) {
  var exbounds = util.matrix.expandPolygon(bounds, this.cullRadius);
  if(util.intersection.pointPoly(this.pos, exbounds)) {
    var color, dcolor;
    switch(this.team) {
      case  0 : { color = util.vec3.make(0.7539, 0.2421, 0.2421); break; }
      case  1 : { color = util.vec3.make(0.2421, 0.2421, 0.7539); break; }
      default : { color = util.vec3.make(0.5, 0.5, 0.5); break; }
    }
    dcolor = this.team === -1 && this.color === 0 ? util.vec3.make(1, 1, 1) : color; // Make decal white for default boys.
    
    this.targetCircle.setColor(util.vec3.toVec4(dcolor, 1));
    
    var bombUniformData = [
      {name: "transform", data: [this.pos.x, this.pos.y, this.height]},
      {name: "color", data: util.vec3.toArray(color)},
      {name: "rotation", data: 0.0},
      {name: "scale", data: 1.0}
    ];
    geometry.push({model: this.model, material: this.material, uniforms: bombUniformData});
    for(var i=0;i<this.effects.length;i++) {
      this.effects[i].getDraw(geometry, decals, lights, bounds);
    }
    this.targetCircle.getDraw(decals, bounds);
  }
};

BombObject.prototype.destroy = function() {
  for(var i=0;i<this.effects.length;i++) {
    this.effects[i].effect.destroy();
  }
};

BombObject.prototype.type = function() { return "bmb"; };