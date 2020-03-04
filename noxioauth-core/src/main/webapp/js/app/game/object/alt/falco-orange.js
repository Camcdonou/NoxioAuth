"use strict";
/* global main */
/* global util */
/* global GameObject */
/* global PlayerObject */
/* global PlayerFalco */
/* global NxFx */

/* Define PlayerFalcoOrange Class */
function PlayerFalcoOrange(game, oid, pos, team, color) {
  PlayerFalco.call(this, game, oid, pos, team, color);
};

/* Constants */
PlayerFalcoOrange.BLIP_COLOR_A = util.vec4.lerp(util.vec4.make(0.8, 0.666, 0.1, 1.0), util.vec4.make(1,1,1,1), 0.5);
PlayerFalcoOrange.BLIP_COLOR_B = util.vec4.make(0.8, 0.666, 0.1, 1.0);

PlayerFalcoOrange.prototype.update = PlayerFalco.prototype.update;
PlayerFalcoOrange.prototype.parseUpd = PlayerFalco.prototype.parseUpd;

PlayerFalcoOrange.prototype.effectSwitch = PlayerFalco.prototype.effectSwitch;

PlayerFalcoOrange.prototype.timers = PlayerFalco.prototype.timers;

PlayerFalcoOrange.prototype.ui = PlayerFalco.prototype.ui;

PlayerFalcoOrange.prototype.air  = PlayerFalco.prototype.air;
PlayerFalcoOrange.prototype.jump = PlayerFalco.prototype.jump;
PlayerFalcoOrange.prototype.land = PlayerFalco.prototype.land;

PlayerFalcoOrange.prototype.stun = PlayerFalco.prototype.stun;

PlayerFalcoOrange.prototype.stunGeneric = PlayerFalco.prototype.stunGeneric;
PlayerFalcoOrange.prototype.stunSlash = PlayerFalco.prototype.stunSlash;
PlayerFalcoOrange.prototype.stunElectric = PlayerFalco.prototype.stunElectric;
PlayerFalcoOrange.prototype.stunFire = PlayerFalco.prototype.stunFire;
PlayerFalcoOrange.prototype.criticalHit = PlayerFalco.prototype.criticalHit;
PlayerFalcoOrange.prototype.explode = PlayerFalco.prototype.explode;
PlayerFalcoOrange.prototype.fall = PlayerFalco.prototype.fall;

PlayerFalcoOrange.prototype.blip = function() {
  this.effects.push(NxFx.falco.alt.orange.blip.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.blipCooldown = PlayerFalco.BLIP_POWER_MAX;
};

PlayerFalcoOrange.prototype.dash = PlayerFalco.prototype.dash;

PlayerFalcoOrange.prototype.charge = PlayerFalco.prototype.charge;

PlayerFalcoOrange.prototype.taunt = PlayerFalco.prototype.taunt;

PlayerFalcoOrange.prototype.setPos = PlayerFalco.prototype.setPos;
PlayerFalcoOrange.prototype.setVel = PlayerFalco.prototype.setVel;
PlayerFalcoOrange.prototype.setHeight = PlayerFalco.prototype.setHeight;

PlayerFalcoOrange.prototype.setLook = PlayerFalco.prototype.setLook;
PlayerFalcoOrange.prototype.setSpeed = PlayerFalco.prototype.setSpeed;

PlayerFalcoOrange.prototype.getColor = PlayerObject.prototype.getColor;
PlayerFalcoOrange.prototype.getDraw = PlayerFalco.prototype.getDraw;

PlayerFalcoOrange.prototype.destroy = PlayerFalco.prototype.destroy;

PlayerFalcoOrange.prototype.type = PlayerFalco.prototype.type;
