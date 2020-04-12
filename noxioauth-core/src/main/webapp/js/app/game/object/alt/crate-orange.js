"use strict";
/* global main */
/* global util */
/* global GameObject */
/* global PlayerObject */
/* global PlayerCrate */
/* global NxFx */

/* Define PlayerCrateOrange Class */
function PlayerCrateOrange(game, oid, pos, team, color) {
  PlayerCrate.call(this, game, oid, pos, team, color);
};

/* Constants */
PlayerCrateOrange.BLIP_COLOR_A = util.vec4.lerp(util.vec4.make(0.9, 0.462, 0.223, 1.0), util.vec4.make(1,1,1,1), 0.9);
PlayerCrateOrange.BLIP_COLOR_B = util.vec4.make(0.9, 0.462, 0.223, 1.0);

PlayerCrateOrange.prototype.update = PlayerCrate.prototype.update;
PlayerCrateOrange.prototype.parseUpd = PlayerCrate.prototype.parseUpd;

PlayerCrateOrange.prototype.effectSwitch = PlayerCrate.prototype.effectSwitch;

PlayerCrateOrange.prototype.timers = PlayerCrate.prototype.timers;

PlayerCrateOrange.prototype.ui = PlayerCrate.prototype.ui;

PlayerCrateOrange.prototype.air  = PlayerCrate.prototype.air;
PlayerCrateOrange.prototype.jump = PlayerCrate.prototype.jump;
PlayerCrateOrange.prototype.land = PlayerCrate.prototype.land;
PlayerCrateOrange.prototype.toss = PlayerObject.prototype.toss;
PlayerCrateOrange.prototype.pickup = PlayerObject.prototype.pickup;

PlayerCrateOrange.prototype.stun = PlayerCrate.prototype.stun;

PlayerCrateOrange.prototype.stunGeneric = PlayerCrate.prototype.stunGeneric;
PlayerCrateOrange.prototype.stunSlash = PlayerCrate.prototype.stunSlash;
PlayerCrateOrange.prototype.stunElectric = PlayerCrate.prototype.stunElectric;
PlayerCrateOrange.prototype.stunFire = PlayerCrate.prototype.stunFire;
PlayerCrateOrange.prototype.criticalHit = PlayerCrate.prototype.criticalHit;
PlayerCrateOrange.prototype.explode = PlayerCrate.prototype.explode;
PlayerCrateOrange.prototype.fall = PlayerCrate.prototype.fall;

PlayerCrateOrange.prototype.blip = function() {
  this.effects.push(NxFx.crate.alt.orange.blip.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.blipCooldown = PlayerCrate.BLIP_POWER_MAX;
};

PlayerCrateOrange.prototype.dash = PlayerCrate.prototype.dash;

PlayerCrateOrange.prototype.charge = PlayerCrate.prototype.charge;

PlayerCrateOrange.prototype.taunt = PlayerCrate.prototype.taunt;

PlayerCrateOrange.prototype.setPos = PlayerCrate.prototype.setPos;
PlayerCrateOrange.prototype.setVel = PlayerCrate.prototype.setVel;
PlayerCrateOrange.prototype.setHeight = PlayerCrate.prototype.setHeight;

PlayerCrateOrange.prototype.setLook = PlayerCrate.prototype.setLook;
PlayerCrateOrange.prototype.setSpeed = PlayerCrate.prototype.setSpeed;

PlayerCrateOrange.prototype.getColor = PlayerObject.prototype.getColor;
PlayerCrateOrange.prototype.getDraw = PlayerCrate.prototype.getDraw;

PlayerCrateOrange.prototype.destroy = PlayerCrate.prototype.destroy;

PlayerCrateOrange.prototype.type = PlayerCrate.prototype.type;
