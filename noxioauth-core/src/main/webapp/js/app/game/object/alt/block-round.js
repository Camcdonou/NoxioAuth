"use strict";
/* global main */
/* global util */
/* global GameObject */
/* global PlayerObject */
/* global NxFx */
/* global PlayerBlock */

/* Define PlayerBlockRound Class */
function PlayerBlockRound(game, oid, pos, team, color) {
  PlayerBlock.call(this, game, oid, pos, team, color);
  this.model = this.game.display.getModel("character.block.round");
};

PlayerBlockRound.prototype.update = PlayerBlock.prototype.update;
PlayerBlockRound.prototype.parseUpd = PlayerBlock.prototype.parseUpd;
PlayerBlockRound.prototype.effectSwitch = PlayerBlock.prototype.effectSwitch;
PlayerBlockRound.prototype.timers = PlayerBlock.prototype.timers;
PlayerBlockRound.prototype.ui = PlayerBlock.prototype.ui;

PlayerBlockRound.prototype.air  = PlayerBlock.prototype.air;
PlayerBlockRound.prototype.jump = PlayerBlock.prototype.jump;
PlayerBlockRound.prototype.recover = PlayerObject.prototype.recover;
PlayerBlockRound.prototype.recoverJump = PlayerObject.prototype.recoverJump;
PlayerBlockRound.prototype.land = PlayerBlock.prototype.land;
PlayerBlockRound.prototype.toss = PlayerObject.prototype.toss;
PlayerBlockRound.prototype.pickup = PlayerObject.prototype.pickup;

PlayerBlockRound.prototype.stun = PlayerBlock.prototype.stun;

PlayerBlockRound.prototype.stunGeneric = PlayerBlock.prototype.stunGeneric;
PlayerBlockRound.prototype.stunSlash = PlayerBlock.prototype.stunSlash;
PlayerBlockRound.prototype.stunElectric = PlayerBlock.prototype.stunElectric;
PlayerBlockRound.prototype.stunFire = PlayerBlock.prototype.stunFire;
PlayerBlockRound.prototype.criticalHit = PlayerBlock.prototype.criticalHit;
PlayerBlockRound.prototype.explode = PlayerBlock.prototype.explode;
PlayerBlockRound.prototype.fall = PlayerBlock.prototype.fall;

PlayerBlockRound.prototype.rest = PlayerBlock.prototype.rest;
PlayerBlockRound.prototype.restHit = PlayerBlock.prototype.restHit;

PlayerBlockRound.prototype.wake = PlayerBlock.prototype.wake;

PlayerBlockRound.prototype.poundChannel = PlayerBlock.prototype.poundChannel;

PlayerBlockRound.prototype.poundDash = PlayerBlock.prototype.poundDash;

PlayerBlockRound.prototype.pound = PlayerBlock.prototype.pound;

PlayerBlockRound.prototype.poundHit = PlayerBlock.prototype.poundHit;

PlayerBlockRound.prototype.taunt = PlayerBlock.prototype.taunt;

PlayerBlockRound.prototype.setPos = PlayerBlock.prototype.setPos;
PlayerBlockRound.prototype.setVel = PlayerBlock.prototype.setVel;
PlayerBlockRound.prototype.setHeight = PlayerBlock.prototype.setHeight;

PlayerBlockRound.prototype.setLook = PlayerBlock.prototype.setLook;
PlayerBlockRound.prototype.setSpeed = PlayerBlock.prototype.setSpeed;

PlayerBlockRound.prototype.getColor = PlayerObject.prototype.getColor;
PlayerBlockRound.prototype.getDraw = PlayerBlock.prototype.getDraw;

PlayerBlockRound.prototype.destroy = PlayerBlock.prototype.destroy;

PlayerBlockRound.prototype.type = PlayerBlock.prototype.type;
