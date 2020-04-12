"use strict";
/* global main */
/* global util */
/* global GameObject */
/* global PlayerObject */
/* global PlayerVoxel */
/* global NxFx */

/* Define PlayerVoxelBlack Class */
function PlayerVoxelBlack(game, oid, pos, team, color) {
  PlayerVoxel.call(this, game, oid, pos, team, color);
};

PlayerVoxelBlack.prototype.update = PlayerVoxel.prototype.update;

PlayerVoxelBlack.prototype.parseUpd = PlayerVoxel.prototype.parseUpd;

PlayerVoxelBlack.prototype.effectSwitch = PlayerVoxel.prototype.effectSwitch;

PlayerVoxelBlack.prototype.timers = PlayerVoxel.prototype.timers;

PlayerVoxelBlack.prototype.ui = PlayerVoxel.prototype.ui;

PlayerVoxelBlack.prototype.air  = PlayerVoxel.prototype.air;
PlayerVoxelBlack.prototype.jump = PlayerVoxel.prototype.jump;
PlayerVoxelBlack.prototype.land = PlayerVoxel.prototype.land;
PlayerVoxelBlack.prototype.toss = PlayerObject.prototype.toss;
PlayerVoxelBlack.prototype.pickup = PlayerObject.prototype.pickup;

PlayerVoxelBlack.prototype.stun = PlayerVoxel.prototype.stun;

PlayerVoxelBlack.prototype.stunGeneric = PlayerVoxel.prototype.stunGeneric;
PlayerVoxelBlack.prototype.stunSlash = PlayerVoxel.prototype.stunSlash;
PlayerVoxelBlack.prototype.stunElectric = PlayerVoxel.prototype.stunElectric;
PlayerVoxelBlack.prototype.stunFire = PlayerVoxel.prototype.stunFire;
PlayerVoxelBlack.prototype.criticalHit = PlayerVoxel.prototype.criticalHit;
PlayerVoxelBlack.prototype.explode = PlayerVoxel.prototype.explode;
PlayerVoxelBlack.prototype.fall = PlayerVoxel.prototype.fall;

PlayerVoxelBlack.prototype.blip = function() {
  this.effects.push(NxFx.crate.alt.black.blip.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.blipCooldown = PlayerVoxel.BLIP_POWER_MAX;
};

PlayerVoxelBlack.prototype.charge = function() {
  this.chargeEffect = NxFx.voxel.alt.black.charge.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed));
  this.effects.push(this.chargeEffect);
  this.chargeTimer = PlayerVoxel.FLASH_CHARGE_LENGTH;
};

PlayerVoxelBlack.prototype.pre = function() {
  this.game.putEffect(NxFx.voxel.alt.black.vanish.trigger(this.game, util.vec2.toVec3(this.pos, 0), util.vec3.create()));
};

PlayerVoxelBlack.prototype.recall = function() {
  this.effects.push(NxFx.voxel.alt.black.recall.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.markLocation = undefined;
  if(this.locationEffect) { this.locationEffect.destroy(); this.locationEffect = undefined; }
};

PlayerVoxelBlack.prototype.mark = function() {
  this.effects.push(NxFx.voxel.alt.black.mark.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.markLocation = util.vec2.copy(this.pos);
  this.markEffect = NxFx.voxel.alt.black.location.trigger(this.game, util.vec2.toVec3(this.markLocation, 0), util.vec2.toVec3(this.vel, this.vspeed));
  this.effects.push(this.markEffect);
};

PlayerVoxelBlack.prototype.noMark = function() {
  this.effects.push(NxFx.voxel.alt.black.no.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};

PlayerVoxelBlack.prototype.taunt = PlayerVoxel.prototype.taunt;

PlayerVoxelBlack.prototype.setPos = PlayerVoxel.prototype.setPos;
PlayerVoxelBlack.prototype.setVel = PlayerVoxel.prototype.setVel;
PlayerVoxelBlack.prototype.setHeight = PlayerVoxel.prototype.setHeight;

PlayerVoxelBlack.prototype.setLook = PlayerVoxel.prototype.setLook;
PlayerVoxelBlack.prototype.setSpeed = PlayerVoxel.prototype.setSpeed;

PlayerVoxelBlack.prototype.getColor = PlayerObject.prototype.getColor;
PlayerVoxelBlack.prototype.getDraw = PlayerVoxel.prototype.getDraw;

PlayerVoxelBlack.prototype.destroy = PlayerVoxel.prototype.destroy;

PlayerVoxelBlack.prototype.type = PlayerVoxel.prototype.type;