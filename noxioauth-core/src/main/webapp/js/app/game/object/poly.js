"use strict";
/* global main */
/* global util */
/* global GameObject */
/* global PlayerObject */
/* global NxFx */

/* Define PlayerPoly Class */
function PlayerPoly(game, oid, pos, team, color) {
  PlayerObject.call(this, game, oid, pos, 0, team, color);
  
  this.icon = this.game.display.getMaterial("character.poly.ui.iconsmall");
  
  /* Settings */
  this.radius = 0.5; this.weight = 1.0; this.friction = 0.725;
  this.moveSpeed = 0.0375; this.jumpHeight = 0.175; this.cullRadius = 1.0;
  this.scale = 1.0;
  
  /* State */

  /* Timers */
  this.blipCooldown = 0;
  this.dashCooldown = 0;
  
  /* UI */
  this.uiMeters = [];
};

/* Constants */
PlayerPoly.BLIP_POWER_MAX = 30;
PlayerPoly.DASH_POWER_ADD = 35;
PlayerPoly.DASH_POWER_MAX = 60;

PlayerPoly.prototype.update = PlayerObject.prototype.update;
PlayerPoly.prototype.parseUpd = PlayerObject.prototype.parseUpd;

PlayerPoly.prototype.effectSwitch = function(e) {
  switch(e) {
    case "atk" : { this.blip(); return true; }
    case "mov" : { this.dash(); return true; }
    default : { return PlayerObject.prototype.effectSwitch.call(this, e); }
  }
};

PlayerPoly.prototype.timers = function() {
  if(this.blipCooldown > 0) { this.blipCooldown--; }
  if(this.dashCooldown > 0) { this.dashCooldown--; }
};

PlayerPoly.prototype.ui = function() {
  
};

PlayerPoly.prototype.air  = PlayerObject.prototype.air;
PlayerPoly.prototype.jump = PlayerObject.prototype.jump;
PlayerPoly.prototype.recover = PlayerObject.prototype.recover;
PlayerPoly.prototype.recoverJump = PlayerObject.prototype.recoverJump;
PlayerPoly.prototype.land = PlayerObject.prototype.land;

PlayerPoly.prototype.stun = PlayerObject.prototype.stun;
PlayerPoly.prototype.stunGeneric = PlayerObject.prototype.stunGeneric;
PlayerPoly.prototype.stunSlash = PlayerObject.prototype.stunSlash;
PlayerPoly.prototype.stunElectric = PlayerObject.prototype.stunElectric;
PlayerPoly.prototype.stunFire = PlayerObject.prototype.stunFire;
PlayerPoly.prototype.criticalHit = PlayerObject.prototype.criticalHit;
PlayerPoly.prototype.explode = PlayerObject.prototype.explode;
PlayerPoly.prototype.fall = PlayerObject.prototype.fall;
PlayerPoly.prototype.toss = PlayerObject.prototype.toss;
PlayerPoly.prototype.pickup = PlayerObject.prototype.pickup;

PlayerPoly.prototype.blip = function() {
  this.blipCooldown = PlayerPoly.BLIP_POWER_MAX;
};

PlayerPoly.prototype.dash = function() {
  this.dashCooldown += PlayerPoly.DASH_POWER_ADD;
};

PlayerPoly.prototype.taunt = function() {
  
};

PlayerPoly.prototype.setPos = PlayerObject.prototype.setPos;
PlayerPoly.prototype.setVel = PlayerObject.prototype.setVel;
PlayerPoly.prototype.setHeight = PlayerObject.prototype.setHeight;

PlayerPoly.prototype.setLook = PlayerObject.prototype.setLook;
PlayerPoly.prototype.setSpeed = PlayerObject.prototype.setSpeed;

PlayerPoly.prototype.getColor = PlayerObject.prototype.getColor;
PlayerPoly.prototype.getDraw = function(geometry, decals, lights, bounds) {
    /* Null for the main poly class, nothing to draw, bits draw themselves */
};

PlayerPoly.prototype.destroy = PlayerObject.prototype.destroy;

PlayerPoly.prototype.type = function() { return "pol"; };

/* Permutation dictionary */

/* global PlayerPolyVoice */
/* global PlayerPolyRed */
/* global PlayerPolyRainbow */
/* global PlayerPolyGold */
/* global PlayerPolyDelta */
/* global PlayerPolyFour */
/* global PlayerPolyHit */
PlayerPoly.classByPermutation = function(perm) {
  switch(perm) {
    default : { return PlayerPoly; }
  }
};