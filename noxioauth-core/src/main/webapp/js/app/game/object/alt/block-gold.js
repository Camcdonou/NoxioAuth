"use strict";
/* global main */
/* global util */
/* global GameObject */
/* global PlayerObject */
/* global NxFx */
/* global PlayerBlock */

/* Define PlayerBlockGold Class */
function PlayerBlockGold(game, oid, pos, team, color) {
  PlayerBlock.call(this, game, oid, pos, team, color);
  this.material = this.game.display.getMaterial("character.block.gold");
};

PlayerBlockGold.prototype.update = PlayerBlock.prototype.update;
PlayerBlockGold.prototype.parseUpd = PlayerBlock.prototype.parseUpd;
PlayerBlockGold.prototype.effectSwitch = PlayerBlock.prototype.effectSwitch;
PlayerBlockGold.prototype.timers = PlayerBlock.prototype.timers;
PlayerBlockGold.prototype.ui = PlayerBlock.prototype.ui;

PlayerBlockGold.prototype.air  = PlayerBlock.prototype.air;
PlayerBlockGold.prototype.jump = PlayerBlock.prototype.jump;
PlayerBlockGold.prototype.land = PlayerBlock.prototype.land;
PlayerBlockGold.prototype.toss = PlayerObject.prototype.toss;
PlayerBlockGold.prototype.pickup = PlayerObject.prototype.pickup;

PlayerBlockGold.prototype.stun = PlayerBlock.prototype.stun;

PlayerBlockGold.prototype.stunGeneric = PlayerBlock.prototype.stunGeneric;
PlayerBlockGold.prototype.stunSlash = PlayerBlock.prototype.stunSlash;
PlayerBlockGold.prototype.stunElectric = PlayerBlock.prototype.stunElectric;
PlayerBlockGold.prototype.stunFire = PlayerBlock.prototype.stunFire;
PlayerBlockGold.prototype.criticalHit = PlayerBlock.prototype.criticalHit;
PlayerBlockGold.prototype.explode = PlayerBlock.prototype.explode;
PlayerBlockGold.prototype.fall = PlayerBlock.prototype.fall;

PlayerBlockGold.prototype.rest = function() {
  this.restEffect = NxFx.block.alt.gold.rest.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed));
  this.effects.push(this.restEffect);
  this.effects.push(NxFx.block.alt.gold.wave.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec3.make(0, 0, 0)));
  this.restCooldown = PlayerBlock.REST_SLEEP_LENGTH;
};

PlayerBlockGold.prototype.restHit = PlayerBlock.prototype.restHit;

PlayerBlockGold.prototype.wake = function() {
  this.effects.push(NxFx.block.alt.gold.wake.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};

PlayerBlockGold.prototype.poundChannel = function() {
  this.poundCooldown = PlayerBlock.POUND_COOLDOWN_LENGTH;
  this.chargeEffect = NxFx.block.alt.gold.charge.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed));
  this.effects.push(this.chargeEffect);
};

PlayerBlockGold.prototype.poundDash = function() {
  this.effects.push(NxFx.block.alt.gold.dash.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.poundDirection = this.look;
};

PlayerBlockGold.prototype.pound = function() {
  this.effects.push(NxFx.block.alt.gold.wave.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(util.vec2.scale(this.poundDirection, PlayerBlock.POUND_OFFSET*2.), 0.1)));
};

PlayerBlockGold.prototype.poundHit = function() {
  this.effects.push(NxFx.block.alt.gold.slap.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(util.vec2.scale(this.poundDirection, PlayerBlock.POUND_OFFSET*2.), 0.1)));
};

PlayerBlockGold.prototype.taunt = PlayerBlock.prototype.taunt;

PlayerBlockGold.prototype.setPos = PlayerBlock.prototype.setPos;
PlayerBlockGold.prototype.setVel = PlayerBlock.prototype.setVel;
PlayerBlockGold.prototype.setHeight = PlayerBlock.prototype.setHeight;

PlayerBlockGold.prototype.setLook = PlayerBlock.prototype.setLook;
PlayerBlockGold.prototype.setSpeed = PlayerBlock.prototype.setSpeed;

PlayerBlockGold.prototype.getColor = PlayerObject.prototype.getColor;
PlayerBlockGold.prototype.getDraw = PlayerBlock.prototype.getDraw;

PlayerBlockGold.prototype.destroy = PlayerBlock.prototype.destroy;

PlayerBlockGold.prototype.type = PlayerBlock.prototype.type;
