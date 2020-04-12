"use strict";
/* global main */
/* global util */
/* global NxFx */
/* global PointLight */
/* global ParticleBlip */
/* global ParticleDash */
/* global PlayerObject */
/* global PlayerBox */

/* Define Gold Box Alternate Class */
function PlayerBoxGold(game, oid, pos, team, color) {
  PlayerBox.call(this, game, oid, pos, team, color);
  this.material = this.game.display.getMaterial("character.box.gold");
};

/* Constants */
PlayerBoxGold.BLIP_COLOR_A = util.vec4.lerp(util.vec4.make(0.521, 0.2, 1.0, 1.0), util.vec4.make(1,1,1,1), 0.925);
PlayerBoxGold.BLIP_COLOR_B = util.vec4.make(0.521, 0.2, 1.0, 1.0);

PlayerBoxGold.prototype.update = PlayerBox.prototype.update;
PlayerBoxGold.prototype.parseUpd = PlayerBox.prototype.parseUpd;

PlayerBoxGold.prototype.effectSwitch = PlayerBox.prototype.effectSwitch;

PlayerBoxGold.prototype.timers = PlayerBox.prototype.timers;

PlayerBoxGold.prototype.ui = PlayerBox.prototype.ui;

PlayerBoxGold.prototype.air  = PlayerBox.prototype.air;
PlayerBoxGold.prototype.jump = PlayerBox.prototype.jump;
PlayerBoxGold.prototype.land = PlayerBox.prototype.land;
PlayerBoxGold.prototype.toss = PlayerObject.prototype.toss;
PlayerBoxGold.prototype.pickup = PlayerObject.prototype.pickup;

PlayerBoxGold.prototype.stun = PlayerBox.prototype.stun;
PlayerBoxGold.prototype.stunGeneric = PlayerBox.prototype.stunGeneric;
PlayerBoxGold.prototype.stunSlash = PlayerBox.prototype.stunSlash;
PlayerBoxGold.prototype.stunElectric = PlayerBox.prototype.stunElectric;
PlayerBoxGold.prototype.stunFire = PlayerBox.prototype.stunFire;
PlayerBoxGold.prototype.criticalHit = PlayerBox.prototype.criticalHit;
PlayerBoxGold.prototype.explode = PlayerBox.prototype.explode;
PlayerBoxGold.prototype.fall = PlayerBox.prototype.fall;

PlayerBoxGold.prototype.blip = function() {
  this.effects.push(NxFx.box.alt.gold.blip.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.blipCooldown = PlayerBox.BLIP_POWER_MAX;
};

PlayerBoxGold.prototype.dash = function() {
  this.effects.push(NxFx.box.alt.gold.dash.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.dashCooldown += PlayerBox.DASH_POWER_ADD;
};

PlayerBoxGold.prototype.taunt = PlayerBox.prototype.taunt;

PlayerBoxGold.prototype.setPos = PlayerBox.prototype.setPos;
PlayerBoxGold.prototype.setVel = PlayerBox.prototype.setVel;
PlayerBoxGold.prototype.setHeight = PlayerBox.prototype.setHeight;

PlayerBoxGold.prototype.setLook = PlayerBox.prototype.setLook;
PlayerBoxGold.prototype.setSpeed = PlayerBox.prototype.setSpeed;

PlayerBoxGold.prototype.getColor = PlayerObject.prototype.getColor;
PlayerBoxGold.prototype.getDraw = PlayerBox.prototype.getDraw;

PlayerBoxGold.prototype.destroy = PlayerBox.prototype.destroy;

PlayerBoxGold.prototype.type = PlayerBox.prototype.type;