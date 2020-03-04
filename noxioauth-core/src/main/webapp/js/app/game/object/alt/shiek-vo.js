"use strict";
/* global main */
/* global util */
/* global GameObject */
/* global PlayerObject */
/* global PlayerShiek */
/* global NxFx */

/* Define PlayerShiekVoice Class */
function PlayerShiekVoice(game, oid, pos, team, color) {
  PlayerShiek.call(this, game, oid, pos, team, color);
  this.material = this.game.display.getMaterial("character.shiek.reverse");
};

PlayerShiekVoice.prototype.update = PlayerShiek.prototype.update;

PlayerShiekVoice.prototype.parseUpd = PlayerShiek.prototype.parseUpd;

PlayerShiekVoice.prototype.effectSwitch = PlayerShiek.prototype.effectSwitch;

PlayerShiekVoice.prototype.timers = PlayerShiek.prototype.timers;

PlayerShiekVoice.prototype.ui = PlayerShiek.prototype.ui;

PlayerShiekVoice.prototype.air  = PlayerShiek.prototype.air;
PlayerShiekVoice.prototype.jump = PlayerShiek.prototype.jump;
PlayerShiekVoice.prototype.land = PlayerShiek.prototype.land;

PlayerShiekVoice.prototype.stun = PlayerShiek.prototype.stun;

PlayerShiekVoice.prototype.stunGeneric = PlayerShiek.prototype.stunGeneric;
PlayerShiekVoice.prototype.stunSlash = PlayerShiek.prototype.stunSlash;
PlayerShiekVoice.prototype.stunElectric = PlayerShiek.prototype.stunElectric;
PlayerShiekVoice.prototype.stunFire = PlayerShiek.prototype.stunFire;
PlayerShiekVoice.prototype.criticalHit = PlayerShiek.prototype.criticalHit;
PlayerShiekVoice.prototype.explode = PlayerShiek.prototype.explode;
PlayerShiekVoice.prototype.fall = PlayerShiek.prototype.fall;

PlayerShiekVoice.prototype.blip = function() {
  PlayerShiek.prototype.blip.call(this);
};

PlayerShiekVoice.prototype.charge = function() {
  PlayerShiek.prototype.charge.call(this);
};

PlayerShiekVoice.prototype.pre = function() {
  PlayerShiek.prototype.pre.call(this);
};

PlayerShiekVoice.prototype.recall = function() {
  PlayerShiek.prototype.recall.call(this);
};

PlayerShiekVoice.prototype.mark = function() {
  PlayerShiek.prototype.mark.call(this);
};

PlayerShiekVoice.prototype.noMark = function() {
  PlayerShiek.prototype.noMark.call(this);
};

PlayerShiekVoice.prototype.taunt = PlayerShiek.prototype.taunt;

PlayerShiekVoice.prototype.setPos = PlayerShiek.prototype.setPos;
PlayerShiekVoice.prototype.setVel = PlayerShiek.prototype.setVel;
PlayerShiekVoice.prototype.setHeight = PlayerShiek.prototype.setHeight;

PlayerShiekVoice.prototype.setLook = PlayerShiek.prototype.setLook;
PlayerShiekVoice.prototype.setSpeed = PlayerShiek.prototype.setSpeed;

PlayerShiekVoice.prototype.getColor = PlayerObject.prototype.getColor;
PlayerShiekVoice.prototype.getDraw = PlayerShiek.prototype.getDraw;

PlayerShiekVoice.prototype.destroy = PlayerShiek.prototype.destroy;

PlayerShiekVoice.prototype.type = PlayerShiek.prototype.type;