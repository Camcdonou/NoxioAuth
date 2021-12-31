"use strict";
/* global main */
/* global util */
/* global GameObject */
/* global PlayerObject */
/* global PlayerVoxel */
/* global NxFx */

/* Define PlayerVoxelGold Class */
function PlayerVoxelGold(game, oid, pos, team, color) {
  PlayerVoxel.call(this, game, oid, pos, team, color);
  this.material = this.game.display.getMaterial("character.voxel.gold");
};

PlayerVoxelGold.prototype.update = PlayerVoxel.prototype.update;

PlayerVoxelGold.prototype.parseUpd = PlayerVoxel.prototype.parseUpd;

PlayerVoxelGold.prototype.effectSwitch = PlayerVoxel.prototype.effectSwitch;

PlayerVoxelGold.prototype.timers = PlayerVoxel.prototype.timers;

PlayerVoxelGold.prototype.ui = PlayerVoxel.prototype.ui;

PlayerVoxelGold.prototype.air  = PlayerVoxel.prototype.air;
PlayerVoxelGold.prototype.jump = PlayerVoxel.prototype.jump;
PlayerVoxelGold.prototype.recover = PlayerObject.prototype.recover;
PlayerVoxelGold.prototype.recoverJump = PlayerObject.prototype.recoverJump;
PlayerVoxelGold.prototype.land = PlayerVoxel.prototype.land;
PlayerVoxelGold.prototype.toss = PlayerObject.prototype.toss;
PlayerVoxelGold.prototype.pickup = PlayerObject.prototype.pickup;

PlayerVoxelGold.prototype.stun = PlayerVoxel.prototype.stun;

PlayerVoxelGold.prototype.stunGeneric = PlayerVoxel.prototype.stunGeneric;
PlayerVoxelGold.prototype.stunSlash = PlayerVoxel.prototype.stunSlash;
PlayerVoxelGold.prototype.stunElectric = PlayerVoxel.prototype.stunElectric;
PlayerVoxelGold.prototype.stunFire = PlayerVoxel.prototype.stunFire;
PlayerVoxelGold.prototype.criticalHit = PlayerVoxel.prototype.criticalHit;
PlayerVoxelGold.prototype.explode = PlayerVoxel.prototype.explode;
PlayerVoxelGold.prototype.fall = PlayerVoxel.prototype.fall;

PlayerVoxelGold.prototype.blip = function() {
  this.effects.push(NxFx.box.alt.gold.blip.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.blipCooldown = PlayerVoxel.BLIP_POWER_MAX;
};

PlayerVoxelGold.prototype.charge = function() {
  this.chargeEffect = NxFx.voxel.alt.gold.charge.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed));
  this.effects.push(this.chargeEffect);
  this.chargeTimer = PlayerVoxel.FLASH_CHARGE_LENGTH;
};

PlayerVoxelGold.prototype.pre = function() {
  this.game.putEffect(NxFx.voxel.alt.gold.vanish.trigger(this.game, util.vec2.toVec3(this.pos, 0), util.vec3.create()));
};

PlayerVoxelGold.prototype.recall = function() {
  this.effects.push(NxFx.voxel.alt.gold.recall.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.markLocation = undefined;
  if(this.locationEffect) { this.locationEffect.destroy(); this.locationEffect = undefined; }
};

PlayerVoxelGold.prototype.mark = function() {
  this.effects.push(NxFx.voxel.alt.gold.mark.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.markLocation = util.vec2.copy(this.pos);
  this.markEffect = NxFx.voxel.alt.gold.location.trigger(this.game, util.vec2.toVec3(this.markLocation, 0), util.vec2.toVec3(this.vel, this.vspeed));
  this.effects.push(this.markEffect);
};

PlayerVoxelGold.prototype.noMark = function() {
  this.effects.push(NxFx.voxel.alt.gold.no.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};

PlayerVoxelGold.prototype.taunt = PlayerVoxel.prototype.taunt;

PlayerVoxelGold.prototype.setPos = PlayerVoxel.prototype.setPos;
PlayerVoxelGold.prototype.setVel = PlayerVoxel.prototype.setVel;
PlayerVoxelGold.prototype.setHeight = PlayerVoxel.prototype.setHeight;

PlayerVoxelGold.prototype.setLook = PlayerVoxel.prototype.setLook;
PlayerVoxelGold.prototype.setSpeed = PlayerVoxel.prototype.setSpeed;

PlayerVoxelGold.prototype.getColor = PlayerObject.prototype.getColor;
PlayerVoxelGold.prototype.getDraw = PlayerVoxel.prototype.getDraw;

PlayerVoxelGold.prototype.destroy = PlayerVoxel.prototype.destroy;

PlayerVoxelGold.prototype.type = PlayerVoxel.prototype.type;