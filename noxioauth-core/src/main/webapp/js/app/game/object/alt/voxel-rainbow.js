"use strict";
/* global main */
/* global util */
/* global GameObject */
/* global PlayerObject */
/* global PlayerVoxel */
/* global NxFx */

/* Define PlayerVoxelRainbow Class */
function PlayerVoxelRainbow(game, oid, pos, team, color) {
  PlayerVoxel.call(this, game, oid, pos, team, color);
};

PlayerVoxelRainbow.prototype.update = PlayerVoxel.prototype.update;

PlayerVoxelRainbow.prototype.parseUpd = PlayerVoxel.prototype.parseUpd;

PlayerVoxelRainbow.prototype.effectSwitch = PlayerVoxel.prototype.effectSwitch;

PlayerVoxelRainbow.prototype.timers = PlayerVoxel.prototype.timers;

PlayerVoxelRainbow.prototype.ui = PlayerVoxel.prototype.ui;

PlayerVoxelRainbow.prototype.air  = PlayerVoxel.prototype.air;
PlayerVoxelRainbow.prototype.jump = PlayerVoxel.prototype.jump;
PlayerVoxelRainbow.prototype.land = PlayerVoxel.prototype.land;
PlayerVoxelRainbow.prototype.toss = PlayerObject.prototype.toss;
PlayerVoxelRainbow.prototype.pickup = PlayerObject.prototype.pickup;

PlayerVoxelRainbow.prototype.stun = PlayerVoxel.prototype.stun;

PlayerVoxelRainbow.prototype.stunGeneric = PlayerVoxel.prototype.stunGeneric;
PlayerVoxelRainbow.prototype.stunSlash = PlayerVoxel.prototype.stunSlash;
PlayerVoxelRainbow.prototype.stunElectric = PlayerVoxel.prototype.stunElectric;
PlayerVoxelRainbow.prototype.stunFire = PlayerVoxel.prototype.stunFire;
PlayerVoxelRainbow.prototype.criticalHit = PlayerVoxel.prototype.criticalHit;
PlayerVoxelRainbow.prototype.explode = PlayerVoxel.prototype.explode;
PlayerVoxelRainbow.prototype.fall = PlayerVoxel.prototype.fall;

PlayerVoxelRainbow.prototype.blip = function() {
  this.effects.push(NxFx.box.alt.rainbow.blip.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.blipCooldown = PlayerVoxel.BLIP_POWER_MAX;
};

PlayerVoxelRainbow.prototype.charge = function() {
  this.chargeEffect = NxFx.voxel.alt.rainbow.charge.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed));
  this.effects.push(this.chargeEffect);
  this.chargeTimer = PlayerVoxel.FLASH_CHARGE_LENGTH;
};

PlayerVoxelRainbow.prototype.pre = function() {
  this.game.putEffect(NxFx.voxel.alt.rainbow.vanish.trigger(this.game, util.vec2.toVec3(this.pos, 0), util.vec3.create()));
};

PlayerVoxelRainbow.prototype.recall = function() {
  this.effects.push(NxFx.voxel.alt.rainbow.recall.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.markLocation = undefined;
  if(this.locationEffect) { this.locationEffect.destroy(); this.locationEffect = undefined; }
};

PlayerVoxelRainbow.prototype.mark = function() {
  this.effects.push(NxFx.voxel.alt.rainbow.mark.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.markLocation = util.vec2.copy(this.pos);
  this.markEffect = NxFx.voxel.alt.rainbow.location.trigger(this.game, util.vec2.toVec3(this.markLocation, 0), util.vec2.toVec3(this.vel, this.vspeed));
  this.effects.push(this.markEffect);
};

PlayerVoxelRainbow.prototype.noMark = function() {
  this.effects.push(NxFx.voxel.alt.rainbow.no.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};

PlayerVoxelRainbow.prototype.taunt = PlayerVoxel.prototype.taunt;

PlayerVoxelRainbow.prototype.setPos = PlayerVoxel.prototype.setPos;
PlayerVoxelRainbow.prototype.setVel = PlayerVoxel.prototype.setVel;
PlayerVoxelRainbow.prototype.setHeight = PlayerVoxel.prototype.setHeight;

PlayerVoxelRainbow.prototype.setLook = PlayerVoxel.prototype.setLook;
PlayerVoxelRainbow.prototype.setSpeed = PlayerVoxel.prototype.setSpeed;

PlayerVoxelRainbow.prototype.getColor = PlayerObject.prototype.getColor;
PlayerVoxelRainbow.prototype.getDraw = PlayerVoxel.prototype.getDraw;

PlayerVoxelRainbow.prototype.destroy = PlayerVoxel.prototype.destroy;

PlayerVoxelRainbow.prototype.type = PlayerVoxel.prototype.type;