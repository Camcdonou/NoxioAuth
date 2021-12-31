"use strict";
/* global main */
/* global util */
/* global GameObject */
/* global PlayerObject */
/* global PlayerVoxel */
/* global NxFx */

/* Define PlayerVoxelDelta Class */
function PlayerVoxelDelta(game, oid, pos, team, color) {
  PlayerVoxel.call(this, game, oid, pos, team, color);
  this.material = this.game.display.getMaterial("character.voxel.delta");
};

PlayerVoxelDelta.prototype.update = PlayerVoxel.prototype.update;

PlayerVoxelDelta.prototype.parseUpd = PlayerVoxel.prototype.parseUpd;

PlayerVoxelDelta.prototype.effectSwitch = PlayerVoxel.prototype.effectSwitch;

PlayerVoxelDelta.prototype.timers = PlayerVoxel.prototype.timers;

PlayerVoxelDelta.prototype.ui = PlayerVoxel.prototype.ui;

PlayerVoxelDelta.prototype.air  = PlayerVoxel.prototype.air;
PlayerVoxelDelta.prototype.jump = PlayerVoxel.prototype.jump;
PlayerVoxelDelta.prototype.recover = PlayerObject.prototype.recover;
PlayerVoxelDelta.prototype.recoverJump = PlayerObject.prototype.recoverJump;
PlayerVoxelDelta.prototype.land = PlayerVoxel.prototype.land;
PlayerVoxelDelta.prototype.toss = PlayerObject.prototype.toss;
PlayerVoxelDelta.prototype.pickup = PlayerObject.prototype.pickup;

PlayerVoxelDelta.prototype.stun = PlayerVoxel.prototype.stun;

PlayerVoxelDelta.prototype.stunGeneric = PlayerVoxel.prototype.stunGeneric;
PlayerVoxelDelta.prototype.stunSlash = PlayerVoxel.prototype.stunSlash;
PlayerVoxelDelta.prototype.stunElectric = PlayerVoxel.prototype.stunElectric;
PlayerVoxelDelta.prototype.stunFire = PlayerVoxel.prototype.stunFire;
PlayerVoxelDelta.prototype.criticalHit = PlayerVoxel.prototype.criticalHit;
PlayerVoxelDelta.prototype.explode = PlayerVoxel.prototype.explode;
PlayerVoxelDelta.prototype.fall = PlayerVoxel.prototype.fall;

PlayerVoxelDelta.prototype.blip = function() {
  this.effects.push(NxFx.box.alt.delta.blip.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.blipCooldown = PlayerVoxel.BLIP_POWER_MAX;
};

PlayerVoxelDelta.prototype.charge = function() {
  this.chargeEffect = NxFx.voxel.alt.delta.charge.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed));
  this.effects.push(this.chargeEffect);
  this.chargeTimer = PlayerVoxel.FLASH_CHARGE_LENGTH;
};

PlayerVoxelDelta.prototype.pre = function() {
  this.game.putEffect(NxFx.voxel.alt.delta.vanish.trigger(this.game, util.vec2.toVec3(this.pos, 0), util.vec3.create()));
};

PlayerVoxelDelta.prototype.recall = function() {
  this.effects.push(NxFx.voxel.alt.delta.recall.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.markLocation = undefined;
  if(this.locationEffect) { this.locationEffect.destroy(); this.locationEffect = undefined; }
};

PlayerVoxelDelta.prototype.mark = function() {
  this.effects.push(NxFx.voxel.alt.delta.mark.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.markLocation = util.vec2.copy(this.pos);
  this.markEffect = NxFx.voxel.alt.delta.location.trigger(this.game, util.vec2.toVec3(this.markLocation, 0), util.vec2.toVec3(this.vel, this.vspeed));
  this.effects.push(this.markEffect);
};

PlayerVoxelDelta.prototype.noMark = function() {
  this.effects.push(NxFx.voxel.alt.delta.no.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};

PlayerVoxelDelta.prototype.taunt = PlayerVoxel.prototype.taunt;

PlayerVoxelDelta.prototype.setPos = PlayerVoxel.prototype.setPos;
PlayerVoxelDelta.prototype.setVel = PlayerVoxel.prototype.setVel;
PlayerVoxelDelta.prototype.setHeight = PlayerVoxel.prototype.setHeight;

PlayerVoxelDelta.prototype.setLook = PlayerVoxel.prototype.setLook;
PlayerVoxelDelta.prototype.setSpeed = PlayerVoxel.prototype.setSpeed;

PlayerVoxelDelta.prototype.getColor = PlayerObject.prototype.getColor;
PlayerVoxelDelta.prototype.getDraw = PlayerVoxel.prototype.getDraw;

PlayerVoxelDelta.prototype.destroy = PlayerVoxel.prototype.destroy;

PlayerVoxelDelta.prototype.type = PlayerVoxel.prototype.type;