"use strict";
/* global main */
/* global util */
/* global GameObject */
/* global PlayerObject */
/* global NxFx */
/* global PlayerBlock */

/* Define PlayerBlockDelta Class */
function PlayerBlockDelta(game, oid, pos, team, color) {
  PlayerBlock.call(this, game, oid, pos, team, color);
  this.material = this.game.display.getMaterial("character.block.delta");
};

PlayerBlockDelta.prototype.update = PlayerBlock.prototype.update;
PlayerBlockDelta.prototype.parseUpd = PlayerBlock.prototype.parseUpd;
PlayerBlockDelta.prototype.effectSwitch = PlayerBlock.prototype.effectSwitch;
PlayerBlockDelta.prototype.timers = PlayerBlock.prototype.timers;
PlayerBlockDelta.prototype.ui = PlayerBlock.prototype.ui;

PlayerBlockDelta.prototype.air  = PlayerBlock.prototype.air;
PlayerBlockDelta.prototype.jump = PlayerBlock.prototype.jump;
PlayerBlockDelta.prototype.recover = PlayerObject.prototype.recover;
PlayerBlockDelta.prototype.recoverJump = PlayerObject.prototype.recoverJump;
PlayerBlockDelta.prototype.land = PlayerBlock.prototype.land;
PlayerBlockDelta.prototype.toss = PlayerObject.prototype.toss;
PlayerBlockDelta.prototype.pickup = PlayerObject.prototype.pickup;

PlayerBlockDelta.prototype.stun = PlayerBlock.prototype.stun;

PlayerBlockDelta.prototype.stunGeneric = PlayerBlock.prototype.stunGeneric;
PlayerBlockDelta.prototype.stunSlash = PlayerBlock.prototype.stunSlash;
PlayerBlockDelta.prototype.stunElectric = PlayerBlock.prototype.stunElectric;
PlayerBlockDelta.prototype.stunFire = PlayerBlock.prototype.stunFire;
PlayerBlockDelta.prototype.criticalHit = PlayerBlock.prototype.criticalHit;
PlayerBlockDelta.prototype.explode = PlayerBlock.prototype.explode;
PlayerBlockDelta.prototype.fall = PlayerBlock.prototype.fall;

PlayerBlockDelta.prototype.rest = PlayerBlock.prototype.rest;
PlayerBlockDelta.prototype.restHit = PlayerBlock.prototype.restHit;

PlayerBlockDelta.prototype.wake = PlayerBlock.prototype.wake;

PlayerBlockDelta.prototype.poundChannel = PlayerBlock.prototype.poundChannel;

PlayerBlockDelta.prototype.poundDash = PlayerBlock.prototype.poundDash;

PlayerBlockDelta.prototype.pound = PlayerBlock.prototype.pound;

PlayerBlockDelta.prototype.poundHit = PlayerBlock.prototype.poundHit;

PlayerBlockDelta.prototype.taunt = PlayerBlock.prototype.taunt;

PlayerBlockDelta.prototype.setPos = PlayerBlock.prototype.setPos;
PlayerBlockDelta.prototype.setVel = PlayerBlock.prototype.setVel;
PlayerBlockDelta.prototype.setHeight = PlayerBlock.prototype.setHeight;

PlayerBlockDelta.prototype.setLook = PlayerBlock.prototype.setLook;
PlayerBlockDelta.prototype.setSpeed = PlayerBlock.prototype.setSpeed;

PlayerBlockDelta.prototype.getColor = PlayerObject.prototype.getColor;
PlayerBlockDelta.prototype.getDraw = PlayerBlock.prototype.getDraw;

PlayerBlockDelta.prototype.destroy = PlayerBlock.prototype.destroy;

PlayerBlockDelta.prototype.type = PlayerBlock.prototype.type;
