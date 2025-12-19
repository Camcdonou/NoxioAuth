"use strict";
/* global main */
/* global util */
/* global GameObject */
/* global PlayerObject */
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

  this.targetCircle = new Decal(this.game, "object.generic.decal.targetcirclesm", util.vec2.toVec3(this.pos, Math.min(this.height, 0.0)), {x: 0.0, y: 0.0, z: 1.0}, 1.0, 0.0, util.vec4.make(1,1,1,1), 15, 0, 0);
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
      case "hfxu" : { this.stunFire("blue"); return true; }
      case "hfxb" : { this.stunFire("black"); return true; }
      case "hfxrb" : { this.stunFire("rainbow"); return true; }
      case "hfxrt" : { this.stunFire("retro"); return true; }
      case "crt" : { this.criticalHit(); return true; }
      default : { main.menu.warning.show("Invalid effect value: '" + effects[i] + "' @ Flag.js :: update()"); break; }
    }
  }
  
  /* Step Effects */
  this.targetCircle.step(util.vec2.toVec3(this.pos, this.height > 0. ? 0. : this.height), 1.0, 0.0);
  for(var i=0;i<this.effects.length;i++) {
    if(this.effects[i].active()) { this.effects[i].step(util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)); }
    else { this.effects.splice(i--, 1); }
  }
};

FlagObject.prototype.land = function() {
  this.effects.push(NxFx.player.land.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};

FlagObject.prototype.stun = function() {
  
};

FlagObject.prototype.stunGeneric = PlayerObject.prototype.stunGeneric;
FlagObject.prototype.stunSlash = PlayerObject.prototype.stunSlash;
FlagObject.prototype.stunElectric = PlayerObject.prototype.stunElectric;
FlagObject.prototype.stunFire = PlayerObject.prototype.stunFire;
FlagObject.prototype.criticalHit = PlayerObject.prototype.criticalHit;

FlagObject.prototype.explode = function() { };
FlagObject.prototype.fall = function() { };

FlagObject.prototype.setPos = GameObject.prototype.setPos;
FlagObject.prototype.setVel = GameObject.prototype.setVel;
FlagObject.prototype.setHeight = GameObject.prototype.setHeight;

FlagObject.prototype.getColor = function() {
  var colors = this.team<0?util.kalide.getColorsAuto(util.kalide.compressColors(2, 4, 5, 6, 8), this.team):util.kalide.getColorsAuto(this.color, this.team);
  if(colors.length > 1) {
    var ind = Math.floor(this.game.frame/128)%(colors.length);
    return util.vec3.lerp(colors[ind], colors[ind+1<colors.length?ind+1:0], (this.game.frame%128)/128);
  }
  return colors[0];
};

FlagObject.prototype.getDraw = function(geometry, decals, lights, bounds, alpha) {
  var exbounds = util.matrix.expandPolygon(bounds, this.cullRadius);
  var rpos = util.vec2.lerp(this.prevPos, this.pos, alpha);
  var rh = (this.height * alpha) + (this.prevHeight * (1.0 - alpha));
  if(util.intersection.pointPoly(rpos, exbounds)) {
    var color = this.getColor();
    var dcolor = this.team === -1 && this.color === 0 ? util.vec3.make(1, 1, 1) : color; // Make decal white for default boys.
    
    this.targetCircle.setColor(util.vec3.toVec4(dcolor, 1));
    
    var flagUniformData = [
      {name: "transform", data: [rpos.x, rpos.y, rh]},
      {name: "color", data: util.vec3.toArray(color)},
      {name: "angle", data: [0., 0., 0.]}, 
      {name: "rotation", data: 0},           // Shadows still use old 1f z-rotation. @TODO: Convert shadows over to "angle" 3f rotation 
      {name: "scale", data: 1.0}
    ];
    geometry.push({model: this.model, material: this.material, uniforms: flagUniformData});
    for(var i=0;i<this.effects.length;i++) {
      this.effects[i].getDraw(geometry, decals, lights, bounds);
    }
    this.targetCircle.getDraw(decals, bounds, util.vec2.toVec3(rpos, Math.min(rh, 0.0)));
  }
};

FlagObject.prototype.destroy = function() {
  for(var i=0;i<this.effects.length;i++) {
    this.effects[i].destroy();
  }
};

FlagObject.prototype.type = function() { return "flg"; };