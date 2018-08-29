"use strict";
/* global main */
/* global util */
/* global GameObject */
/* global PlayerObject */
/* global PlayerFalco */
/* global NxFx */

/* Define PlayerFalcoVoice Class */
function PlayerFalcoVoice(game, oid, pos, team, color) {
  PlayerFalco.call(this, game, oid, pos, team, color);
};

/* Constants */
PlayerFalcoVoice.prototype.update = PlayerFalco.prototype.update;
PlayerFalcoVoice.prototype.parseUpd = PlayerFalco.prototype.parseUpd;

PlayerFalcoVoice.prototype.effectSwitch = PlayerFalco.prototype.effectSwitch;

PlayerFalcoVoice.prototype.timers = PlayerFalco.prototype.timers;

PlayerFalcoVoice.prototype.ui = PlayerFalco.prototype.ui;

PlayerFalcoVoice.prototype.air  = PlayerFalco.prototype.air;
PlayerFalcoVoice.prototype.jump = PlayerFalco.prototype.jump;
PlayerFalcoVoice.prototype.land = PlayerFalco.prototype.land;

PlayerFalcoVoice.prototype.stun = PlayerFalco.prototype.stun;

PlayerFalcoVoice.prototype.stunGeneric = PlayerFalco.prototype.stunGeneric;
PlayerFalcoVoice.prototype.stunSlash = PlayerFalco.prototype.stunSlash;
PlayerFalcoVoice.prototype.stunElectric = PlayerFalco.prototype.stunElectric;
PlayerFalcoVoice.prototype.stunFire = PlayerFalco.prototype.stunFire;
PlayerFalcoVoice.prototype.criticalHit = PlayerFalco.prototype.criticalHit;
PlayerFalcoVoice.prototype.explode = PlayerFalco.prototype.explode;
PlayerFalcoVoice.prototype.fall = PlayerFalco.prototype.fall;

PlayerFalcoVoice.prototype.blip = function() {
  PlayerFalco.prototype.blip.call(this);
};

PlayerFalcoVoice.prototype.dash = function() {
  PlayerFalco.prototype.dash.call(this);
};

PlayerFalcoVoice.prototype.charge = function() {
  PlayerFalco.prototype.charge.call(this);
};

PlayerFalcoVoice.prototype.taunt = PlayerFalco.prototype.taunt;

PlayerFalcoVoice.prototype.setPos = PlayerFalco.prototype.setPos;
PlayerFalcoVoice.prototype.setVel = PlayerFalco.prototype.setVel;
PlayerFalcoVoice.prototype.setHeight = PlayerFalco.prototype.setHeight;

PlayerFalcoVoice.prototype.setLook = PlayerFalco.prototype.setLook;
PlayerFalcoVoice.prototype.setSpeed = PlayerFalco.prototype.setSpeed;
PlayerFalcoVoice.prototype.getDraw = PlayerFalco.prototype.getDraw;

PlayerFalcoVoice.prototype.destroy = PlayerFalco.prototype.destroy;

PlayerFalcoVoice.prototype.type = PlayerFalco.prototype.type;
