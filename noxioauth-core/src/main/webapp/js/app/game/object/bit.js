"use strict";
/* global main */
/* global util */
/* global GameObject */
/* global PlayerObject */
/* global NxFx */

/* Define PlayerPolyBit Class */
function PlayerPolyBit(game, oid, pos, team, color) {
  PlayerObject.call(this, game, oid, pos, 0, team, color);
  
  this.model = this.game.display.getModel("character.poly.poly");
  this.material = this.game.display.getMaterial("character.box.box");
  this.icon = this.game.display.getMaterial("character.cube.ui.iconsmall");
  
  /* Settings */
  this.radius = 0.25; this.weight = 0.5; this.friction = 0.725;
  this.moveSpeed = 0.0375; this.jumpHeight = 0.175; this.cullRadius = 1.0;
  this.scale = 1.0; // Instead of setting the scale of bits to 0.5 we just use half size models and half size decals. works better imo
  this.targetCircle.material = this.game.display.getMaterial("character.poly.decal.targetcircle"); // Slightly hacky
  
  /* State */

  /* Timers */
  
  /* UI */
  this.uiMeters = [];
};

/* Constants */

PlayerPolyBit.prototype.update = PlayerObject.prototype.update;
PlayerPolyBit.prototype.parseUpd = PlayerObject.prototype.parseUpd;

PlayerPolyBit.prototype.effectSwitch = function(e) {
  switch(e) {
    case "atk" : { this.blip(); return true; }
    case "mov" : { this.dash(); return true; }
    default : { return PlayerObject.prototype.effectSwitch.call(this, e); }
  }
};

PlayerPolyBit.prototype.timers = function() {
  
};

PlayerPolyBit.prototype.ui = function() {
  
};

PlayerPolyBit.prototype.air  = PlayerObject.prototype.air;
PlayerPolyBit.prototype.jump = PlayerObject.prototype.jump;
PlayerPolyBit.prototype.recover = PlayerObject.prototype.recover;
PlayerPolyBit.prototype.recoverJump = PlayerObject.prototype.recoverJump;
PlayerPolyBit.prototype.land = PlayerObject.prototype.land;

PlayerPolyBit.prototype.stun = PlayerObject.prototype.stun;
PlayerPolyBit.prototype.stunGeneric = PlayerObject.prototype.stunGeneric;
PlayerPolyBit.prototype.stunSlash = PlayerObject.prototype.stunSlash;
PlayerPolyBit.prototype.stunElectric = PlayerObject.prototype.stunElectric;
PlayerPolyBit.prototype.stunFire = PlayerObject.prototype.stunFire;
PlayerPolyBit.prototype.criticalHit = PlayerObject.prototype.criticalHit;

/* Override so we can use the small shatter effect instead of normal size one */
PlayerPolyBit.prototype.explode = function() {
  var expl = NxFx.bit.shatter.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed));
  expl.particles[0].obj.colorS = this.getColor();
  this.game.putEffect(expl);
};

PlayerPolyBit.prototype.fall = PlayerObject.prototype.fall;
PlayerPolyBit.prototype.toss = PlayerObject.prototype.toss;
PlayerPolyBit.prototype.pickup = PlayerObject.prototype.pickup;

PlayerPolyBit.prototype.blip = function() {
  this.effects.push(NxFx.bit.blip.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};

PlayerPolyBit.prototype.dash = function() {
  this.effects.push(NxFx.bit.dash.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};

PlayerPolyBit.prototype.taunt = function() {
  
};

PlayerPolyBit.prototype.setPos = PlayerObject.prototype.setPos;
PlayerPolyBit.prototype.setVel = PlayerObject.prototype.setVel;
PlayerPolyBit.prototype.setHeight = PlayerObject.prototype.setHeight;

PlayerPolyBit.prototype.setLook = PlayerObject.prototype.setLook;
PlayerPolyBit.prototype.setSpeed = PlayerObject.prototype.setSpeed;

PlayerPolyBit.prototype.getColor = PlayerObject.prototype.getColor;
PlayerPolyBit.prototype.getDraw = PlayerObject.prototype.getDraw;

PlayerPolyBit.prototype.destroy = PlayerObject.prototype.destroy;

PlayerPolyBit.prototype.type = function() { return "bit"; };

/* Permutation dictionary */

/* global PlayerPolyBitVoice */
/* global PlayerPolyBitRed */
/* global PlayerPolyBitRainbow */
/* global PlayerPolyBitGold */
/* global PlayerPolyBitDelta */
/* global PlayerPolyBitFour */
/* global PlayerPolyBitHit */
PlayerPolyBit.classByPermutation = function(perm) {
  switch(perm) {
    default : { return PlayerPolyBit; }
  }
};