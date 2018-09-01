"use strict";
/* global main */
/* global util */
/* global GameObject */
/* global PlayerObject */
/* global NxFx */
/* global PlayerPuff */

/* Define PlayerPuffVoice Class */
function PlayerPuffVoice(game, oid, pos, team, color) {
  PlayerPuff.call(this, game, oid, pos, team, color);
  this.material = this.game.display.getMaterial("character.puff.reverse");
};

PlayerPuffVoice.prototype.update = PlayerPuff.prototype.update;
PlayerPuffVoice.prototype.parseUpd = PlayerPuff.prototype.parseUpd;
PlayerPuffVoice.prototype.effectSwitch = PlayerPuff.prototype.effectSwitch;
PlayerPuffVoice.prototype.timers = PlayerPuff.prototype.timers;
PlayerPuffVoice.prototype.ui = PlayerPuff.prototype.ui;

PlayerPuffVoice.prototype.air  = PlayerPuff.prototype.air;
PlayerPuffVoice.prototype.jump = PlayerPuff.prototype.jump;
PlayerPuffVoice.prototype.land = PlayerPuff.prototype.land;

PlayerPuffVoice.prototype.stun = PlayerPuff.prototype.stun;

PlayerPuffVoice.prototype.stunGeneric = PlayerPuff.prototype.stunGeneric;
PlayerPuffVoice.prototype.stunSlash = PlayerPuff.prototype.stunSlash;
PlayerPuffVoice.prototype.stunElectric = PlayerPuff.prototype.stunElectric;
PlayerPuffVoice.prototype.stunFire = PlayerPuff.prototype.stunFire;
PlayerPuffVoice.prototype.criticalHit = PlayerPuff.prototype.criticalHit;
PlayerPuffVoice.prototype.explode = PlayerPuff.prototype.explode;
PlayerPuffVoice.prototype.fall = PlayerPuff.prototype.fall;

PlayerPuffVoice.prototype.rest = PlayerPuff.prototype.rest;

PlayerPuffVoice.prototype.wake = PlayerPuff.prototype.wake;

PlayerPuffVoice.prototype.poundChannel = PlayerPuff.prototype.poundChannel;

PlayerPuffVoice.prototype.poundDash = PlayerPuff.prototype.poundDash;

PlayerPuffVoice.prototype.pound = PlayerPuff.prototype.pound;

PlayerPuffVoice.prototype.poundHit = PlayerPuff.prototype.poundHit;

PlayerPuffVoice.prototype.taunt = PlayerPuff.prototype.taunt;

PlayerPuffVoice.prototype.setPos = PlayerPuff.prototype.setPos;
PlayerPuffVoice.prototype.setVel = PlayerPuff.prototype.setVel;
PlayerPuffVoice.prototype.setHeight = PlayerPuff.prototype.setHeight;

PlayerPuffVoice.prototype.setLook = PlayerPuff.prototype.setLook;
PlayerPuffVoice.prototype.setSpeed = PlayerPuff.prototype.setSpeed;
PlayerPuffVoice.prototype.getDraw = PlayerPuff.prototype.getDraw;

PlayerPuffVoice.prototype.destroy = PlayerPuff.prototype.destroy;

PlayerPuffVoice.prototype.type = PlayerPuff.prototype.type;
