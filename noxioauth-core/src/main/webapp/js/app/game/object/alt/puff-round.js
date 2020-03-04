"use strict";
/* global main */
/* global util */
/* global GameObject */
/* global PlayerObject */
/* global NxFx */
/* global PlayerPuff */

/* Define PlayerPuffRound Class */
function PlayerPuffRound(game, oid, pos, team, color) {
  PlayerPuff.call(this, game, oid, pos, team, color);
  this.model = this.game.display.getModel("character.puff.round");
};

PlayerPuffRound.prototype.update = PlayerPuff.prototype.update;
PlayerPuffRound.prototype.parseUpd = PlayerPuff.prototype.parseUpd;
PlayerPuffRound.prototype.effectSwitch = PlayerPuff.prototype.effectSwitch;
PlayerPuffRound.prototype.timers = PlayerPuff.prototype.timers;
PlayerPuffRound.prototype.ui = PlayerPuff.prototype.ui;

PlayerPuffRound.prototype.air  = PlayerPuff.prototype.air;
PlayerPuffRound.prototype.jump = PlayerPuff.prototype.jump;
PlayerPuffRound.prototype.land = PlayerPuff.prototype.land;

PlayerPuffRound.prototype.stun = PlayerPuff.prototype.stun;

PlayerPuffRound.prototype.stunGeneric = PlayerPuff.prototype.stunGeneric;
PlayerPuffRound.prototype.stunSlash = PlayerPuff.prototype.stunSlash;
PlayerPuffRound.prototype.stunElectric = PlayerPuff.prototype.stunElectric;
PlayerPuffRound.prototype.stunFire = PlayerPuff.prototype.stunFire;
PlayerPuffRound.prototype.criticalHit = PlayerPuff.prototype.criticalHit;
PlayerPuffRound.prototype.explode = PlayerPuff.prototype.explode;
PlayerPuffRound.prototype.fall = PlayerPuff.prototype.fall;

PlayerPuffRound.prototype.rest = PlayerPuff.prototype.rest;

PlayerPuffRound.prototype.wake = PlayerPuff.prototype.wake;

PlayerPuffRound.prototype.poundChannel = PlayerPuff.prototype.poundChannel;

PlayerPuffRound.prototype.poundDash = PlayerPuff.prototype.poundDash;

PlayerPuffRound.prototype.pound = PlayerPuff.prototype.pound;

PlayerPuffRound.prototype.poundHit = PlayerPuff.prototype.poundHit;

PlayerPuffRound.prototype.taunt = PlayerPuff.prototype.taunt;

PlayerPuffRound.prototype.setPos = PlayerPuff.prototype.setPos;
PlayerPuffRound.prototype.setVel = PlayerPuff.prototype.setVel;
PlayerPuffRound.prototype.setHeight = PlayerPuff.prototype.setHeight;

PlayerPuffRound.prototype.setLook = PlayerPuff.prototype.setLook;
PlayerPuffRound.prototype.setSpeed = PlayerPuff.prototype.setSpeed;

PlayerPuffRound.prototype.getColor = PlayerObject.prototype.getColor;
PlayerPuffRound.prototype.getDraw = PlayerPuff.prototype.getDraw;

PlayerPuffRound.prototype.destroy = PlayerPuff.prototype.destroy;

PlayerPuffRound.prototype.type = PlayerPuff.prototype.type;
