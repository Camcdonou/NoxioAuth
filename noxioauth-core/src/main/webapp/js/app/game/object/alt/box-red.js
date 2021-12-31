"use strict";
/* global main */
/* global util */
/* global NxFx */
/* global PointLight */
/* global ParticleBlip */
/* global ParticleDash */
/* global PlayerObject */
/* global PlayerBox */

/* Define Red Box Alternate Class */
function PlayerBoxRed(game, oid, pos, team, color) {
  PlayerBox.call(this, game, oid, pos, team, color);
};

/* Constants */
PlayerBoxRed.BLIP_COLOR_A = util.vec4.lerp(util.vec4.make(1.0, 0.3, 0.25, 1.0), util.vec4.make(1,1,1,1), 0.95);
PlayerBoxRed.BLIP_COLOR_B = util.vec4.make(1.0, 0.2, 0.15, 1.0);

PlayerBoxRed.prototype.update = PlayerBox.prototype.update;
PlayerBoxRed.prototype.parseUpd = PlayerBox.prototype.parseUpd;

PlayerBoxRed.prototype.effectSwitch = PlayerBox.prototype.effectSwitch;

PlayerBoxRed.prototype.timers = PlayerBox.prototype.timers;

PlayerBoxRed.prototype.ui = PlayerBox.prototype.ui;

PlayerBoxRed.prototype.air  = PlayerBox.prototype.air;
PlayerBoxRed.prototype.jump = PlayerBox.prototype.jump;
PlayerBoxRed.prototype.recover = PlayerObject.prototype.recover;
PlayerBoxRed.prototype.recoverJump = PlayerObject.prototype.recoverJump;
PlayerBoxRed.prototype.land = PlayerBox.prototype.land;
PlayerBoxRed.prototype.toss = PlayerObject.prototype.toss;
PlayerBoxRed.prototype.pickup = PlayerObject.prototype.pickup;

PlayerBoxRed.prototype.stun = PlayerBox.prototype.stun;
PlayerBoxRed.prototype.stunGeneric = PlayerBox.prototype.stunGeneric;
PlayerBoxRed.prototype.stunSlash = PlayerBox.prototype.stunSlash;
PlayerBoxRed.prototype.stunElectric = PlayerBox.prototype.stunElectric;
PlayerBoxRed.prototype.stunFire = PlayerBox.prototype.stunFire;
PlayerBoxRed.prototype.criticalHit = PlayerBox.prototype.criticalHit;
PlayerBoxRed.prototype.explode = PlayerBox.prototype.explode;
PlayerBoxRed.prototype.fall = PlayerBox.prototype.fall;

PlayerBoxRed.prototype.blip = function() {
  this.effects.push(NxFx.box.alt.red.blip.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.blipCooldown = PlayerBox.BLIP_POWER_MAX;
};

PlayerBoxRed.prototype.dash = function() {
  this.effects.push(NxFx.box.alt.red.dash.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.dashCooldown += PlayerBox.DASH_POWER_ADD;
};

PlayerBoxRed.prototype.taunt = PlayerBox.prototype.taunt;

PlayerBoxRed.prototype.setPos = PlayerBox.prototype.setPos;
PlayerBoxRed.prototype.setVel = PlayerBox.prototype.setVel;
PlayerBoxRed.prototype.setHeight = PlayerBox.prototype.setHeight;

PlayerBoxRed.prototype.setLook = PlayerBox.prototype.setLook;
PlayerBoxRed.prototype.setSpeed = PlayerBox.prototype.setSpeed;

PlayerBoxRed.prototype.getColor = PlayerObject.prototype.getColor;
PlayerBoxRed.prototype.getDraw = PlayerBox.prototype.getDraw;

PlayerBoxRed.prototype.destroy = PlayerBox.prototype.destroy;

PlayerBoxRed.prototype.type = PlayerBox.prototype.type;