"use strict";
/* global main */
/* global util */
/* global GameObject */
/* global Decal */
/* global ColorDecal */
/* global NxFx */

/* Define PlayerObject class */
/* PlayerObject is an abstract class and should never actually be created. 
 * Javascript doesn't really have any equivalent to 'abstract' so I'm 
 * just going to remind you that if you instaniate this class I will
 * come find you irl.
 * 
 * This class contains all required base settings and prototype functions
 * that a player object needs. These can (and should) be overidden in most cases.
 * The only thing that the PlayerObject constructor does not default is the 
 * model & material. Be sure you set them in the subclass.
 */
function PlayerObject(game, oid, pos, permutation, team, color) {
  GameObject.call(this, game, oid, pos, permutation, team, color);
  
  this.look = util.vec2.make(0.0, 1.0);  // Normalized direction player is facing
  this.prevLook = this.look;
  this.speed = 0.0;                      // Current scalar of max movement speed <0.0 to 1.0>
  
  /* Settings */
  this.radius = 0.5; this.weight = 1.0; this.friction = 0.725;
  this.moveSpeed = 0.0375; this.jumpHeight = 0.175; this.cullRadius = 1.5;
  this.scale = 1.0;
  
  /* State */
  this.glow = 0.0;          // Scalar from 0 to 1, used to shift color to white for things like quads counter
  this.objective = false;   // If this is flagged then this played is considered a gametype "objective" and will be globally visible and marked.

  /* Timers */
  this.recoverGlow = 0.;
  
  /* Decal */
  var angle = (util.vec2.angle(util.vec2.make(1, 0), this.look)*(this.look.y>0?-1:1))+(Math.PI*0.5);
  this.targetCircle = new Decal(this.game, "character.generic.decal.targetcircle", util.vec2.toVec3(this.pos, Math.min(this.height, 0.)), util.vec3.make(0.0, 0.0, 1.0), 1.1, angle, util.vec4.make(1,1,1,0), 15, 0, 0);
};

PlayerObject.CAMERA_SHAKE_LIGHT = 0.075;
PlayerObject.CAMERA_SHAKE_MEDIUM = 0.1;
PlayerObject.CAMERA_SHAKE_HEAVY = 0.25;
PlayerObject.CAMERA_SHAKE_CRITICAL = 0.45;
PlayerObject.RECOVERY_IMPACT = 4;

PlayerObject.prototype.update = function(data) {
  /* Apply update data to object */
  this.parseUpd(data);
  
  /* Timers */
  this.timers();
  
  /* Step Effects */
  var angle = (util.vec2.angle(util.vec2.make(1, 0), this.look)*(this.look.y>0?-1:1))+(Math.PI*0.5);
  this.targetCircle.step(util.vec2.toVec3(this.pos, Math.min(this.height, 0.)), 1.1*this.scale, angle);
  for(var i=0;i<this.effects.length;i++) {
    if(this.effects[i].active()) { this.effects[i].step(util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)); }
    else { this.effects.splice(i--, 1); }
  }
  
  if(this.recoverGlow > 0. ) {
    this.recoverGlow -= .075;
    this.recoverGlow = Math.max(0., this.recoverGlow);
    this.glow = this.recoverGlow;
  }
  
  
  /* UI */
  this.ui();
};

PlayerObject.prototype.parseUpd = function(data) {
  var pos = util.vec2.parse(data.shift());
  var vel = util.vec2.parse(data.shift());
  var height = parseFloat(data.shift());
  var vspeed = parseFloat(data.shift());  
  var look = util.vec2.parse(data.shift());
  var speed = parseFloat(data.shift());
  var name = data.shift();
  var objective = parseInt(data.shift());
  var effects = data.shift().split(",");
  
  this.setPos(pos);
  this.setVel(vel);
  this.setHeight(height, vspeed);
  this.setLook(look);
  this.setSpeed(speed);
  this.name = !name ? undefined : name;
  this.objective = objective;
  for(var i=0;i<effects.length-1;i++) {
    this.effectSwitch(effects[i]);
  }
};

PlayerObject.prototype.effectSwitch = function(e) {
  switch(e) {
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
    case "xpl" : { this.explode(); return true; }
    case "fal" : { this.fall(); return true; }
    case "air" : { this.air(); return true; }
    case "rcv" : { this.recover(); return true; }
    case "rcvj" : { this.recoverJump(); return true; }
    case "jmp" : { this.jump(); return true; }
    case "lnd" : { this.land(); return true; }
    case "tos" : { this.toss(); return true; }
    case "pik" : { this.pickup(); return true; }
    case "stn" : { this.stun(); return true; }
    case "tnt" : { this.taunt(); return true; }
    case "csa" : { this.game.putCameraShake(this, PlayerObject.CAMERA_SHAKE_LIGHT); return true; }
    case "csb" : { this.game.putCameraShake(this, PlayerObject.CAMERA_SHAKE_MEDIUM); return true; }
    case "csc" : { this.game.putCameraShake(this, PlayerObject.CAMERA_SHAKE_HEAVY); return true; }
    case "csd" : { this.game.putCameraShake(this, PlayerObject.CAMERA_SHAKE_CRITICAL); return true; }
    case "tbst" : { this.effects.push(NxFx.player.tossBoost.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed))); return true; }
    case "pbst" : { this.effects.push(NxFx.player.pickupBoost.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed))); return true; }
    default : { main.menu.warning.show("Invalid effect value: '" + e + "' @ Player.js :: effectSwitch()"); return false; }
  }
};

PlayerObject.prototype.timers = function() { /* Override me daddy~ */ };
PlayerObject.prototype.ui = function() { /* Me too daddy~ */ };

PlayerObject.prototype.air = function() {
  this.effects.push(NxFx.player.airJump.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};

PlayerObject.prototype.jump = function() {
  this.effects.push(NxFx.player.jump.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};

// Begin charging recover jump
PlayerObject.prototype.recover = function() {
  this.effects.push(NxFx.player.recover.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.recoverGlow = 1.0;
};

// Actual recovery jump
PlayerObject.prototype.recoverJump = function() {
  this.effects.push(NxFx.player.recoverJump.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  //this.game.putCameraShake(this, PlayerObject.CAMERA_SHAKE_LIGHT);
};

PlayerObject.prototype.land = function() {
  this.effects.push(NxFx.player.land.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};

PlayerObject.prototype.pickup = function() {
  this.effects.push(NxFx.player.pickup.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};

PlayerObject.prototype.toss = function() {
  this.effects.push(NxFx.player.toss.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};

PlayerObject.prototype.stun = function() {

};

PlayerObject.prototype.stunGeneric = function(perm) {
  var p = util.vec2.toVec3(this.pos, this.height);
  var v = util.vec2.toVec3(this.vel, this.vspeed);
  switch(perm) {
    default : { this.effects.push(NxFx.hit.generic.trigger(this.game, p, v)); break; }
  }
  this.stun();
};

PlayerObject.prototype.stunSlash = function(perm) {
  var p = util.vec2.toVec3(this.pos, this.height);
  var v = util.vec2.toVec3(this.vel, this.vspeed);
  switch(perm) {
    case "purple" : { this.effects.push(NxFx.hit.alt.slash.purple.trigger(this.game, p, v)); break; }
    case "fire" : { this.effects.push(NxFx.hit.alt.slash.fire.trigger(this.game, p, v)); break; }
    case "rainbow" : { this.effects.push(NxFx.hit.alt.slash.rainbow.trigger(this.game, p, v)); break; }
    default : { this.effects.push(NxFx.hit.slash.trigger(this.game, p, v)); break; }
  }
  this.stun();
};

PlayerObject.prototype.stunElectric = function(perm) {
  var p = util.vec2.toVec3(this.pos, this.height);
  var v = util.vec2.toVec3(this.vel, this.vspeed);
  switch(perm) {
    case "red" : { this.effects.push(NxFx.hit.alt.electric.red.trigger(this.game, p, v)); break; }
    case "orange" : { this.effects.push(NxFx.hit.alt.electric.orange.trigger(this.game, p, v)); break; }
    case "green" : { this.effects.push(NxFx.hit.alt.electric.green.trigger(this.game, p, v)); break; }
    case "purple" : { this.effects.push(NxFx.hit.alt.electric.purple.trigger(this.game, p, v)); break; }
    case "black" : { this.effects.push(NxFx.hit.alt.electric.black.trigger(this.game, p, v)); break; }
    case "rainbow" : { this.effects.push(NxFx.hit.alt.electric.rainbow.trigger(this.game, p, v)); break; }
    default : { this.effects.push(NxFx.hit.electric.trigger(this.game, p, v)); break; }
  }
  this.stun();
};

PlayerObject.prototype.stunFire = function(perm) {
  var p = util.vec2.toVec3(this.pos, this.height);
  var v = util.vec2.toVec3(this.vel, this.vspeed);
  switch(perm) {
    case "purple" : { this.effects.push(NxFx.hit.alt.fire.purple.trigger(this.game, p, v)); break; }
    case "blue" : { this.effects.push(NxFx.hit.alt.fire.blue.trigger(this.game, p, v)); break; }
    case "black" : { this.effects.push(NxFx.hit.alt.fire.black.trigger(this.game, p, v)); break; }
    case "rainbow" : { this.effects.push(NxFx.hit.alt.fire.rainbow.trigger(this.game, p, v)); break; }
    case "retro" : { break; }
    default : { this.effects.push(NxFx.hit.fire.trigger(this.game, p, v)); break; }
  }
  this.stun();
};

PlayerObject.prototype.criticalHit = function() {
  this.effects.push(NxFx.hit.critical.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};

PlayerObject.prototype.explode = function() {
  var expl = NxFx.player.shatter.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed));
  expl.particles[0].obj.colorS = this.getColor();
  this.game.putEffect(expl);
};

PlayerObject.prototype.fall = function() {
  this.effects.push(NxFx.player.fall.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};

PlayerObject.prototype.taunt = function() {
  
};

PlayerObject.prototype.setPos = GameObject.prototype.setPos;
PlayerObject.prototype.setVel = GameObject.prototype.setVel;
PlayerObject.prototype.setHeight = GameObject.prototype.setHeight;

PlayerObject.prototype.setLook = function(look) {
  this.prevLook = this.look;
  this.look = look;
};

PlayerObject.prototype.setSpeed = function(speed) {
  this.speed = speed;
};

PlayerObject.prototype.getColor = function() {
  var colors = this.objective?util.kalide.getColorsAuto(util.kalide.compressColors(2, 4, 5, 6, 8), this.team):util.kalide.getColorsAuto(this.color, this.team);
  if(colors.length > 1) {
    var ind = Math.floor(this.game.frame/128)%(colors.length);
    return util.vec3.lerp(colors[ind], colors[ind+1<colors.length?ind+1:0], (this.game.frame%128)/128);
  }
  return colors[0];
};

PlayerObject.prototype.getDraw = function(geometry, decals, lights, bounds, alpha) {
  var exbounds = util.matrix.expandPolygon(bounds, this.cullRadius);
  var rpos = util.vec2.lerp(this.prevPos, this.pos, alpha);
  var rh = (this.height * alpha) + (this.prevHeight * (1.0 - alpha));
  if(util.intersection.pointPoly(rpos, exbounds)) {
    var color = this.getColor();
    var dcolor = this.team === -1 && this.color === 0 ? util.vec3.make(1, 1, 1) : color; // Make decal white for default boys.
    color = util.vec3.lerp(color, util.vec3.make(1.0, 1.0, 1.0), this.glow); // Mix that glow in~
    
    this.targetCircle.setColor(util.vec3.toVec4(dcolor, 1));
    
    var playerUniformData = [
      {name: "transform", data: [rpos.x, rpos.y, rh]},
      {name: "color", data: util.vec3.toArray(color)},
      {name: "angle", data: [0., 0., 0.]},
      {name: "rotation", data: 0},           // Shadows still use old 1f z-rotation. @TODO: Convert shadows over to "angle" 3f rotation 
      {name: "scale", data: this.scale}
    ];
    geometry.push({model: this.model, material: this.material, uniforms: playerUniformData});
    
    /* Decal Interpolation */
    var rlook = util.vec2.normalize(util.vec2.lerp(this.prevLook, this.look, alpha));
    var rangle = (util.vec2.angle(util.vec2.make(1, 0), rlook)*(rlook.y>0?-1:1))+(Math.PI*0.5);
    
    for(var i=0;i<this.effects.length;i++) {
      this.effects[i].getDraw(geometry, decals, lights, bounds);
    }
    this.targetCircle.getDraw(decals, bounds, util.vec2.toVec3(rpos, Math.min(rh, 0.)), rangle);
  }
};

PlayerObject.prototype.destroy = function() {
  for(var i=0;i<this.effects.length;i++) {
    this.effects[i].destroy();
  }
};

PlayerObject.prototype.type = function() { return "nul"; };