"use strict";
/* global main */
/* global util */
/* global GameObject */
/* global PlayerObject */
/* global PlayerVoxel */
/* global NxFx */

/* Define PlayerVoxelVoice Class */
function PlayerVoxelVoice(game, oid, pos, team, color) {
  PlayerVoxel.call(this, game, oid, pos, team, color);
  this.material = this.game.display.getMaterial("character.voxel.reverse");
};

PlayerVoxelVoice.prototype.update = PlayerVoxel.prototype.update;

PlayerVoxelVoice.prototype.parseUpd = PlayerVoxel.prototype.parseUpd;

PlayerVoxelVoice.prototype.effectSwitch = PlayerVoxel.prototype.effectSwitch;

PlayerVoxelVoice.prototype.timers = PlayerVoxel.prototype.timers;

PlayerVoxelVoice.prototype.ui = PlayerVoxel.prototype.ui;

PlayerVoxelVoice.prototype.air  = PlayerVoxel.prototype.air;
PlayerVoxelVoice.prototype.jump = PlayerVoxel.prototype.jump;
PlayerVoxelVoice.prototype.recover = PlayerObject.prototype.recover;
PlayerVoxelVoice.prototype.recoverJump = PlayerObject.prototype.recoverJump;
PlayerVoxelVoice.prototype.land = PlayerVoxel.prototype.land;
PlayerVoxelVoice.prototype.toss = PlayerObject.prototype.toss;
PlayerVoxelVoice.prototype.pickup = PlayerObject.prototype.pickup;

PlayerVoxelVoice.prototype.stun = PlayerVoxel.prototype.stun;

PlayerVoxelVoice.prototype.stunGeneric = PlayerVoxel.prototype.stunGeneric;
PlayerVoxelVoice.prototype.stunSlash = PlayerVoxel.prototype.stunSlash;
PlayerVoxelVoice.prototype.stunElectric = PlayerVoxel.prototype.stunElectric;
PlayerVoxelVoice.prototype.stunFire = PlayerVoxel.prototype.stunFire;
PlayerVoxelVoice.prototype.criticalHit = PlayerVoxel.prototype.criticalHit;
PlayerVoxelVoice.prototype.explode = PlayerVoxel.prototype.explode;
PlayerVoxelVoice.prototype.fall = PlayerVoxel.prototype.fall;

PlayerVoxelVoice.prototype.blip = function() {
  PlayerVoxel.prototype.blip.call(this);
};

PlayerVoxelVoice.prototype.charge = function() {
  PlayerVoxel.prototype.charge.call(this);
};

PlayerVoxelVoice.prototype.pre = function() {
  PlayerVoxel.prototype.pre.call(this);
};

PlayerVoxelVoice.prototype.recall = function() {
  PlayerVoxel.prototype.recall.call(this);
};

PlayerVoxelVoice.prototype.mark = function() {
  PlayerVoxel.prototype.mark.call(this);
};

PlayerVoxelVoice.prototype.noMark = function() {
  PlayerVoxel.prototype.noMark.call(this);
};

PlayerVoxelVoice.prototype.taunt = PlayerVoxel.prototype.taunt;

PlayerVoxelVoice.prototype.setPos = PlayerVoxel.prototype.setPos;
PlayerVoxelVoice.prototype.setVel = PlayerVoxel.prototype.setVel;
PlayerVoxelVoice.prototype.setHeight = PlayerVoxel.prototype.setHeight;

PlayerVoxelVoice.prototype.setLook = PlayerVoxel.prototype.setLook;
PlayerVoxelVoice.prototype.setSpeed = PlayerVoxel.prototype.setSpeed;

PlayerVoxelVoice.prototype.getColor = PlayerObject.prototype.getColor;
PlayerVoxelVoice.prototype.getDraw = PlayerVoxel.prototype.getDraw;

PlayerVoxelVoice.prototype.destroy = PlayerVoxel.prototype.destroy;

PlayerVoxelVoice.prototype.type = PlayerVoxel.prototype.type;