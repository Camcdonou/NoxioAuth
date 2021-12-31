"use strict";
/* global main */
/* global util */
/* global NxFx */
/* global PointLight */
/* global ParticleBlip */
/* global ParticleDash */
/* global PlayerObject */
/* global PlayerBox */

/* Define Rainbow Box Alternate Class */
function PlayerBoxRainbow(game, oid, pos, team, color) {
  PlayerBox.call(this, game, oid, pos, team, color);
};

/* Constants */
PlayerBoxRainbow.LIGHT_COLOR_A = util.vec4.make(0.95, 0.95, 0.95, 1.0);
PlayerBoxRainbow.LIGHT_COLOR_B = util.vec4.make(0.7, 0.7, 0.7, 1.0);

PlayerBoxRainbow.prototype.update = PlayerBox.prototype.update;
PlayerBoxRainbow.prototype.parseUpd = PlayerBox.prototype.parseUpd;

PlayerBoxRainbow.prototype.effectSwitch = PlayerBox.prototype.effectSwitch;

PlayerBoxRainbow.prototype.timers = PlayerBox.prototype.timers;

PlayerBoxRainbow.prototype.ui = PlayerBox.prototype.ui;

PlayerBoxRainbow.prototype.air  = PlayerBox.prototype.air;
PlayerBoxRainbow.prototype.jump = PlayerBox.prototype.jump;
PlayerBoxRainbow.prototype.recover = PlayerObject.prototype.recover;
PlayerBoxRainbow.prototype.recoverJump = PlayerObject.prototype.recoverJump;
PlayerBoxRainbow.prototype.land = PlayerBox.prototype.land;
PlayerBoxRainbow.prototype.toss = PlayerObject.prototype.toss;
PlayerBoxRainbow.prototype.pickup = PlayerObject.prototype.pickup;

PlayerBoxRainbow.prototype.stun = PlayerBox.prototype.stun;
PlayerBoxRainbow.prototype.stunGeneric = PlayerBox.prototype.stunGeneric;
PlayerBoxRainbow.prototype.stunSlash = PlayerBox.prototype.stunSlash;
PlayerBoxRainbow.prototype.stunElectric = PlayerBox.prototype.stunElectric;
PlayerBoxRainbow.prototype.stunFire = PlayerBox.prototype.stunFire;
PlayerBoxRainbow.prototype.criticalHit = PlayerBox.prototype.criticalHit;
PlayerBoxRainbow.prototype.explode = PlayerBox.prototype.explode;
PlayerBoxRainbow.prototype.fall = PlayerBox.prototype.fall;

PlayerBoxRainbow.prototype.blip = function() {
  this.effects.push(NxFx.box.alt.rainbow.blip.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.blipCooldown = PlayerBox.BLIP_POWER_MAX;
};

PlayerBoxRainbow.prototype.dash = function() {
  this.effects.push(NxFx.box.alt.rainbow.dash.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.dashCooldown += PlayerBox.DASH_POWER_ADD;
};

PlayerBoxRainbow.prototype.taunt = PlayerBox.prototype.taunt;

PlayerBoxRainbow.prototype.setPos = PlayerBox.prototype.setPos;
PlayerBoxRainbow.prototype.setVel = PlayerBox.prototype.setVel;
PlayerBoxRainbow.prototype.setHeight = PlayerBox.prototype.setHeight;

PlayerBoxRainbow.prototype.setLook = PlayerBox.prototype.setLook;
PlayerBoxRainbow.prototype.setSpeed = PlayerBox.prototype.setSpeed;

PlayerBoxRainbow.prototype.getColor = PlayerObject.prototype.getColor;
PlayerBoxRainbow.prototype.getDraw = PlayerBox.prototype.getDraw;

PlayerBoxRainbow.prototype.destroy = PlayerBox.prototype.destroy;

PlayerBoxRainbow.prototype.type = PlayerBox.prototype.type;