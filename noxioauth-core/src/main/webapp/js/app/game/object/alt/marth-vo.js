"use strict";
/* global main */
/* global util */
/* global GameObject */
/* global PlayerObject */
/* global NxFx */
/* global PlayerMarth */

/* Define PlayerMarthVoice Class */
function PlayerMarthVoice(game, oid, pos, team, color) {
  PlayerMarth.call(this, game, oid, pos, team, color);
};

PlayerMarthVoice.prototype.update = PlayerMarth.prototype.update;
PlayerMarthVoice.prototype.parseUpd = PlayerMarth.prototype.parseUpd;
PlayerMarthVoice.prototype.effectSwitch = PlayerMarth.prototype.effectSwitch;
PlayerMarthVoice.prototype.timers = PlayerMarth.prototype.timers;
PlayerMarthVoice.prototype.ui = PlayerMarth.prototype.ui;

PlayerMarthVoice.prototype.air  = PlayerMarth.prototype.air;
PlayerMarthVoice.prototype.jump = PlayerMarth.prototype.jump;
PlayerMarthVoice.prototype.land = PlayerMarth.prototype.land;

PlayerMarthVoice.prototype.stun = PlayerMarth.prototype.stun;
PlayerMarthVoice.prototype.stunGeneric = PlayerMarth.prototype.stunGeneric;
PlayerMarthVoice.prototype.stunSlash = PlayerMarth.prototype.stunSlash;
PlayerMarthVoice.prototype.stunElectric = PlayerMarth.prototype.stunElectric;
PlayerMarthVoice.prototype.stunFire = PlayerMarth.prototype.stunFire;
PlayerMarthVoice.prototype.criticalHit = PlayerMarth.prototype.criticalHit;
PlayerMarthVoice.prototype.explode = PlayerMarth.prototype.explode;
PlayerMarthVoice.prototype.fall = PlayerMarth.prototype.fall;

PlayerMarthVoice.prototype.slash = function() {
  PlayerMarth.prototype.slash.call(this);
};

PlayerMarthVoice.prototype.slashHit = function() {
  PlayerMarth.prototype.slashHit.call(this);
};

PlayerMarthVoice.prototype.ready = function() {
  PlayerMarth.prototype.ready.call(this);
};

PlayerMarthVoice.prototype.combo = function() {
  PlayerMarth.prototype.combo.call(this);
};

PlayerMarthVoice.prototype.comboHit = function() {
  PlayerMarth.prototype.comboHit.call(this);
};

PlayerMarthVoice.prototype.counter = function() {
  PlayerMarth.prototype.counter.call(this);
};

PlayerMarthVoice.prototype.riposte = function() {
  PlayerMarth.prototype.riposte.call(this);
};

PlayerMarthVoice.prototype.taunt = PlayerMarth.prototype.taunt;

PlayerMarthVoice.prototype.setPos = PlayerMarth.prototype.setPos;
PlayerMarthVoice.prototype.setVel = PlayerMarth.prototype.setVel;
PlayerMarthVoice.prototype.setHeight = PlayerMarth.prototype.setHeight;

PlayerMarthVoice.prototype.setLook = PlayerMarth.prototype.setLook;
PlayerMarthVoice.prototype.setSpeed = PlayerMarth.prototype.setSpeed;
PlayerMarthVoice.prototype.getDraw = PlayerMarth.prototype.getDraw;

PlayerMarthVoice.prototype.destroy = PlayerMarth.prototype.destroy;

PlayerMarthVoice.prototype.type = PlayerMarth.prototype.type;
