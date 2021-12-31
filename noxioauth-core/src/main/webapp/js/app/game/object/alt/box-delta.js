"use strict";
/* global main */
/* global util */
/* global NxFx */
/* global PointLight */
/* global ParticleBlip */
/* global ParticleDash */
/* global PlayerObject */
/* global PlayerBox */

/* Define Delta Box Alternate Class */
function PlayerBoxDelta(game, oid, pos, team, color) {
  PlayerBox.call(this, game, oid, pos, team, color);
  this.material = this.game.display.getMaterial("character.box.delta");
};

/* Constants */
PlayerBoxDelta.COLOR_A = util.vec4.lerp(util.vec4.make(0.207,  0.301, 0.65, 1.0), util.vec4.make(1,1,1,1), 0.925);
PlayerBoxDelta.COLOR_B = util.vec4.make(0.237,  0.351, 0.85, 1.0);

PlayerBoxDelta.prototype.update = PlayerBox.prototype.update;
PlayerBoxDelta.prototype.parseUpd = PlayerBox.prototype.parseUpd;

PlayerBoxDelta.prototype.effectSwitch = PlayerBox.prototype.effectSwitch;

PlayerBoxDelta.prototype.timers = PlayerBox.prototype.timers;

PlayerBoxDelta.prototype.ui = PlayerBox.prototype.ui;

PlayerBoxDelta.prototype.air  = PlayerBox.prototype.air;
PlayerBoxDelta.prototype.jump = PlayerBox.prototype.jump;
PlayerBoxDelta.prototype.recover = PlayerObject.prototype.recover;
PlayerBoxDelta.prototype.recoverJump = PlayerObject.prototype.recoverJump;
PlayerBoxDelta.prototype.land = PlayerBox.prototype.land;
PlayerBoxDelta.prototype.toss = PlayerObject.prototype.toss;
PlayerBoxDelta.prototype.pickup = PlayerObject.prototype.pickup;

PlayerBoxDelta.prototype.stun = PlayerBox.prototype.stun;
PlayerBoxDelta.prototype.stunGeneric = PlayerBox.prototype.stunGeneric;
PlayerBoxDelta.prototype.stunSlash = PlayerBox.prototype.stunSlash;
PlayerBoxDelta.prototype.stunElectric = PlayerBox.prototype.stunElectric;
PlayerBoxDelta.prototype.stunFire = PlayerBox.prototype.stunFire;
PlayerBoxDelta.prototype.criticalHit = PlayerBox.prototype.criticalHit;
PlayerBoxDelta.prototype.explode = PlayerBox.prototype.explode;
PlayerBoxDelta.prototype.fall = PlayerBox.prototype.fall;

PlayerBoxDelta.prototype.blip = function() {
  this.effects.push(NxFx.box.alt.delta.blip.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.blipCooldown = PlayerBox.BLIP_POWER_MAX;
};

PlayerBoxDelta.prototype.dash = function() {
  this.effects.push(NxFx.box.alt.delta.dash.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.dashCooldown += PlayerBox.DASH_POWER_ADD;
};

PlayerBoxDelta.prototype.taunt = PlayerBox.prototype.taunt;

PlayerBoxDelta.prototype.setPos = PlayerBox.prototype.setPos;
PlayerBoxDelta.prototype.setVel = PlayerBox.prototype.setVel;
PlayerBoxDelta.prototype.setHeight = PlayerBox.prototype.setHeight;

PlayerBoxDelta.prototype.setLook = PlayerBox.prototype.setLook;
PlayerBoxDelta.prototype.setSpeed = PlayerBox.prototype.setSpeed;

PlayerBoxDelta.prototype.getColor = PlayerObject.prototype.getColor;
PlayerBoxDelta.prototype.getDraw = PlayerBox.prototype.getDraw;

PlayerBoxDelta.prototype.destroy = PlayerBox.prototype.destroy;

PlayerBoxDelta.prototype.type = PlayerBox.prototype.type;