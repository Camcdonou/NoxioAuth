"use strict";
/* global main */
/* global util */
/* global GameObject */
/* global PlayerObject */
/* global NxFx */
/* global PlayerCaptain */

/* Define PlayerCaptainVoice Class */
function PlayerCaptainVoice(game, oid, pos, team, color) {
  PlayerCaptain.call(this, game, oid, pos, team, color);
};

PlayerCaptainVoice.prototype.update = PlayerCaptain.prototype.update;
PlayerCaptainVoice.prototype.parseUpd = PlayerCaptain.prototype.parseUpd;
PlayerCaptainVoice.prototype.effectSwitch = PlayerCaptain.prototype.effectSwitch;
PlayerCaptainVoice.prototype.timers = PlayerCaptain.prototype.timers;
PlayerCaptainVoice.prototype.ui = PlayerCaptain.prototype.ui;

PlayerCaptainVoice.prototype.air  = PlayerCaptain.prototype.air;
PlayerCaptainVoice.prototype.jump = PlayerCaptain.prototype.jump;
PlayerCaptainVoice.prototype.land = PlayerCaptain.prototype.land;

PlayerCaptainVoice.prototype.stun = PlayerCaptain.prototype.stun;

PlayerCaptainVoice.prototype.stunGeneric = PlayerCaptain.prototype.stunGeneric;
PlayerCaptainVoice.prototype.stunSlash = PlayerCaptain.prototype.stunSlash;
PlayerCaptainVoice.prototype.stunElectric = PlayerCaptain.prototype.stunElectric;
PlayerCaptainVoice.prototype.stunFire = PlayerCaptain.prototype.stunFire;
PlayerCaptainVoice.prototype.criticalHit = PlayerCaptain.prototype.criticalHit;
PlayerCaptainVoice.prototype.explode = PlayerCaptain.prototype.explode;
PlayerCaptainVoice.prototype.fall = PlayerCaptain.prototype.fall;

PlayerCaptainVoice.prototype.charge = function() {
  PlayerCaptain.prototype.charge.call(this);
};

PlayerCaptainVoice.prototype.punch = function() {
  PlayerCaptain.prototype.punch.call(this);
};

PlayerCaptainVoice.prototype.kick = function() {
  PlayerCaptain.prototype.kick.call(this);
};

PlayerCaptainVoice.prototype.kicking = PlayerCaptain.prototype.kicking;

PlayerCaptainVoice.prototype.taunt = PlayerCaptain.prototype.taunt;

PlayerCaptainVoice.prototype.setPos = PlayerCaptain.prototype.setPos;
PlayerCaptainVoice.prototype.setVel = PlayerCaptain.prototype.setVel;
PlayerCaptainVoice.prototype.setHeight = PlayerCaptain.prototype.setHeight;

PlayerCaptainVoice.prototype.setLook = PlayerCaptain.prototype.setLook;
PlayerCaptainVoice.prototype.setSpeed = PlayerCaptain.prototype.setSpeed;
PlayerCaptainVoice.prototype.getDraw = PlayerCaptain.prototype.getDraw;

PlayerCaptainVoice.prototype.destroy = PlayerObject.prototype.destroy;

PlayerCaptainVoice.prototype.type = PlayerCaptain.prototype.type;
