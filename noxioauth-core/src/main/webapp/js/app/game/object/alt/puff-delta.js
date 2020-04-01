"use strict";
/* global main */
/* global util */
/* global GameObject */
/* global PlayerObject */
/* global NxFx */
/* global PlayerPuff */

/* Define PlayerPuffDelta Class */
function PlayerPuffDelta(game, oid, pos, team, color) {
  PlayerPuff.call(this, game, oid, pos, team, color);
  this.material = this.game.display.getMaterial("character.puff.delta");
};

PlayerPuffDelta.prototype.update = PlayerPuff.prototype.update;
PlayerPuffDelta.prototype.parseUpd = PlayerPuff.prototype.parseUpd;
PlayerPuffDelta.prototype.effectSwitch = PlayerPuff.prototype.effectSwitch;
PlayerPuffDelta.prototype.timers = PlayerPuff.prototype.timers;
PlayerPuffDelta.prototype.ui = PlayerPuff.prototype.ui;

PlayerPuffDelta.prototype.air  = PlayerPuff.prototype.air;
PlayerPuffDelta.prototype.jump = PlayerPuff.prototype.jump;
PlayerPuffDelta.prototype.land = PlayerPuff.prototype.land;
PlayerPuffDelta.prototype.toss = PlayerObject.prototype.toss;
PlayerPuffDelta.prototype.pickup = PlayerObject.prototype.pickup;

PlayerPuffDelta.prototype.stun = PlayerPuff.prototype.stun;

PlayerPuffDelta.prototype.stunGeneric = PlayerPuff.prototype.stunGeneric;
PlayerPuffDelta.prototype.stunSlash = PlayerPuff.prototype.stunSlash;
PlayerPuffDelta.prototype.stunElectric = PlayerPuff.prototype.stunElectric;
PlayerPuffDelta.prototype.stunFire = PlayerPuff.prototype.stunFire;
PlayerPuffDelta.prototype.criticalHit = PlayerPuff.prototype.criticalHit;
PlayerPuffDelta.prototype.explode = PlayerPuff.prototype.explode;
PlayerPuffDelta.prototype.fall = PlayerPuff.prototype.fall;

PlayerPuffDelta.prototype.rest = PlayerPuff.prototype.rest;

PlayerPuffDelta.prototype.wake = PlayerPuff.prototype.wake;

PlayerPuffDelta.prototype.poundChannel = PlayerPuff.prototype.poundChannel;

PlayerPuffDelta.prototype.poundDash = PlayerPuff.prototype.poundDash;

PlayerPuffDelta.prototype.pound = PlayerPuff.prototype.pound;

PlayerPuffDelta.prototype.poundHit = PlayerPuff.prototype.poundHit;

PlayerPuffDelta.prototype.taunt = PlayerPuff.prototype.taunt;

PlayerPuffDelta.prototype.setPos = PlayerPuff.prototype.setPos;
PlayerPuffDelta.prototype.setVel = PlayerPuff.prototype.setVel;
PlayerPuffDelta.prototype.setHeight = PlayerPuff.prototype.setHeight;

PlayerPuffDelta.prototype.setLook = PlayerPuff.prototype.setLook;
PlayerPuffDelta.prototype.setSpeed = PlayerPuff.prototype.setSpeed;

PlayerPuffDelta.prototype.getColor = PlayerObject.prototype.getColor;
PlayerPuffDelta.prototype.getDraw = PlayerPuff.prototype.getDraw;

PlayerPuffDelta.prototype.destroy = PlayerPuff.prototype.destroy;

PlayerPuffDelta.prototype.type = PlayerPuff.prototype.type;
