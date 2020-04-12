"use strict";
/* global main */
/* global util */
/* global GameObject */
/* global PlayerObject */
/* global PlayerVoxel */
/* global NxFx */

/* Define PlayerVoxelGreen Class */
function PlayerVoxelGreen(game, oid, pos, team, color) {
  PlayerVoxel.call(this, game, oid, pos, team, color);
};

/* Constants */
PlayerVoxelGreen.BLIP_COLOR_A = util.vec4.lerp(util.vec4.make(0.6, 1.0, 0.6, 1.0), util.vec4.make(1,1,1,1), 0.5);
PlayerVoxelGreen.BLIP_COLOR_B = util.vec4.make(0.4, 1.0, 0.4, 1.0);

PlayerVoxelGreen.prototype.update = PlayerVoxel.prototype.update;

PlayerVoxelGreen.prototype.parseUpd = PlayerVoxel.prototype.parseUpd;

PlayerVoxelGreen.prototype.effectSwitch = PlayerVoxel.prototype.effectSwitch;

PlayerVoxelGreen.prototype.timers = PlayerVoxel.prototype.timers;

PlayerVoxelGreen.prototype.ui = PlayerVoxel.prototype.ui;

PlayerVoxelGreen.prototype.air  = PlayerVoxel.prototype.air;
PlayerVoxelGreen.prototype.jump = PlayerVoxel.prototype.jump;
PlayerVoxelGreen.prototype.land = PlayerVoxel.prototype.land;
PlayerVoxelGreen.prototype.toss = PlayerObject.prototype.toss;
PlayerVoxelGreen.prototype.pickup = PlayerObject.prototype.pickup;

PlayerVoxelGreen.prototype.stun = PlayerVoxel.prototype.stun;

PlayerVoxelGreen.prototype.stunGeneric = PlayerVoxel.prototype.stunGeneric;
PlayerVoxelGreen.prototype.stunSlash = PlayerVoxel.prototype.stunSlash;
PlayerVoxelGreen.prototype.stunElectric = PlayerVoxel.prototype.stunElectric;
PlayerVoxelGreen.prototype.stunFire = PlayerVoxel.prototype.stunFire;
PlayerVoxelGreen.prototype.criticalHit = PlayerVoxel.prototype.criticalHit;
PlayerVoxelGreen.prototype.explode = PlayerVoxel.prototype.explode;
PlayerVoxelGreen.prototype.fall = PlayerVoxel.prototype.fall;

PlayerVoxelGreen.prototype.blip = function() {
  this.effects.push(NxFx.voxel.alt.green.blip.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.blipCooldown = PlayerVoxel.BLIP_POWER_MAX;
};

PlayerVoxelGreen.prototype.charge = function() {
  this.chargeEffect = NxFx.voxel.alt.green.charge.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed));
  this.effects.push(this.chargeEffect);
  this.chargeTimer = PlayerVoxel.FLASH_CHARGE_LENGTH;
};

PlayerVoxelGreen.prototype.pre = function() {
  this.game.putEffect(NxFx.voxel.alt.green.vanish.trigger(this.game, util.vec2.toVec3(this.pos, 0), util.vec3.create()));
};

PlayerVoxelGreen.prototype.recall = function() {
  this.effects.push(NxFx.voxel.alt.green.recall.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.markLocation = undefined;
  if(this.locationEffect) { this.locationEffect.destroy(); this.locationEffect = undefined; }
};

PlayerVoxelGreen.prototype.mark = function() {
  this.effects.push(NxFx.voxel.alt.green.mark.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.markLocation = util.vec2.copy(this.pos);
  this.markEffect = NxFx.voxel.alt.green.location.trigger(this.game, util.vec2.toVec3(this.markLocation, 0), util.vec2.toVec3(this.vel, this.vspeed));
  this.effects.push(this.markEffect);
};

PlayerVoxelGreen.prototype.noMark = function() {
  this.effects.push(NxFx.voxel.alt.green.no.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};

PlayerVoxelGreen.prototype.taunt = PlayerVoxel.prototype.taunt;

PlayerVoxelGreen.prototype.setPos = PlayerVoxel.prototype.setPos;
PlayerVoxelGreen.prototype.setVel = PlayerVoxel.prototype.setVel;
PlayerVoxelGreen.prototype.setHeight = PlayerVoxel.prototype.setHeight;

PlayerVoxelGreen.prototype.setLook = PlayerVoxel.prototype.setLook;
PlayerVoxelGreen.prototype.setSpeed = PlayerVoxel.prototype.setSpeed;

PlayerVoxelGreen.prototype.getColor = PlayerObject.prototype.getColor;
PlayerVoxelGreen.prototype.getDraw = PlayerVoxel.prototype.getDraw;

PlayerVoxelGreen.prototype.destroy = PlayerVoxel.prototype.destroy;

PlayerVoxelGreen.prototype.type = PlayerVoxel.prototype.type;