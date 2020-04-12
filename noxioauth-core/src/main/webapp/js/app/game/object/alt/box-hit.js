"use strict";
/* global main */
/* global util */
/* global NxFx */
/* global PointLight */
/* global ParticleBlip */
/* global ParticleDash */
/* global PlayerObject */
/* global PlayerBox */

/* Define Hitmarker Box Alternate Class */
function PlayerBoxHit(game, oid, pos, team, color) {
  PlayerBox.call(this, game, oid, pos, team, color);
};

/* Constants */
PlayerBoxHit.COLOR_A = util.vec4.make(1, 1, 1, 1.0);
PlayerBoxHit.COLOR_B = util.vec4.make(0, 0, 0, 1.0);

PlayerBoxHit.prototype.update = PlayerBox.prototype.update;
PlayerBoxHit.prototype.parseUpd = PlayerBox.prototype.parseUpd;

PlayerBoxHit.prototype.effectSwitch = PlayerBox.prototype.effectSwitch;

PlayerBoxHit.prototype.timers = PlayerBox.prototype.timers;

PlayerBoxHit.prototype.ui = PlayerBox.prototype.ui;

PlayerBoxHit.prototype.air  = PlayerBox.prototype.air;
PlayerBoxHit.prototype.jump = PlayerBox.prototype.jump;
PlayerBoxHit.prototype.land = PlayerBox.prototype.land;
PlayerBoxHit.prototype.toss = PlayerObject.prototype.toss;
PlayerBoxHit.prototype.pickup = PlayerObject.prototype.pickup;

PlayerBoxHit.prototype.stun = PlayerBox.prototype.stun;
PlayerBoxHit.prototype.stunGeneric = PlayerBox.prototype.stunGeneric;
PlayerBoxHit.prototype.stunSlash = PlayerBox.prototype.stunSlash;
PlayerBoxHit.prototype.stunElectric = PlayerBox.prototype.stunElectric;
PlayerBoxHit.prototype.stunFire = PlayerBox.prototype.stunFire;
PlayerBoxHit.prototype.criticalHit = PlayerBox.prototype.criticalHit;
PlayerBoxHit.prototype.explode = PlayerBox.prototype.explode;
PlayerBoxHit.prototype.fall = PlayerBox.prototype.fall;

PlayerBoxHit.prototype.blip = function() {
  this.effects.push(NxFx.box.alt.hit.blip.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.blipCooldown = PlayerBox.BLIP_POWER_MAX;
};

PlayerBoxHit.prototype.dash = function() {
  this.effects.push(NxFx.box.alt.hit.dash.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.dashCooldown += PlayerBox.DASH_POWER_ADD;
};

PlayerBoxHit.prototype.taunt = PlayerBox.prototype.taunt;

PlayerBoxHit.prototype.setPos = PlayerBox.prototype.setPos;
PlayerBoxHit.prototype.setVel = PlayerBox.prototype.setVel;
PlayerBoxHit.prototype.setHeight = PlayerBox.prototype.setHeight;

PlayerBoxHit.prototype.setLook = PlayerBox.prototype.setLook;
PlayerBoxHit.prototype.setSpeed = PlayerBox.prototype.setSpeed;

PlayerBoxHit.prototype.getColor = PlayerObject.prototype.getColor;
PlayerBoxHit.prototype.getDraw = PlayerBox.prototype.getDraw;

PlayerBoxHit.prototype.destroy = PlayerBox.prototype.destroy;

PlayerBoxHit.prototype.type = PlayerBox.prototype.type;