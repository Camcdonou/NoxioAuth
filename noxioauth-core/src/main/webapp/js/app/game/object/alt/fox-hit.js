"use strict";
/* global main */
/* global util */
/* global NxFx */
/* global PointLight */
/* global ParticleBlip */
/* global ParticleDash */
/* global PlayerObject */
/* global PlayerFox */

/* Define Hitmarker Fox Alternate Class */
function PlayerFoxHit(game, oid, pos, team, color) {
  PlayerFox.call(this, game, oid, pos, team, color);
};

/* Constants */
PlayerFoxHit.COLOR_A = util.vec4.make(1, 1, 1, 1.0);
PlayerFoxHit.COLOR_B = util.vec4.make(0, 0, 0, 1.0);

PlayerFoxHit.prototype.update = PlayerFox.prototype.update;
PlayerFoxHit.prototype.parseUpd = PlayerFox.prototype.parseUpd;

PlayerFoxHit.prototype.effectSwitch = PlayerFox.prototype.effectSwitch;

PlayerFoxHit.prototype.timers = PlayerFox.prototype.timers;

PlayerFoxHit.prototype.ui = PlayerFox.prototype.ui;

PlayerFoxHit.prototype.air  = PlayerFox.prototype.air;
PlayerFoxHit.prototype.jump = PlayerFox.prototype.jump;
PlayerFoxHit.prototype.land = PlayerFox.prototype.land;
PlayerFoxHit.prototype.toss = PlayerObject.prototype.toss;
PlayerFoxHit.prototype.pickup = PlayerObject.prototype.pickup;

PlayerFoxHit.prototype.stun = PlayerFox.prototype.stun;
PlayerFoxHit.prototype.stunGeneric = PlayerFox.prototype.stunGeneric;
PlayerFoxHit.prototype.stunSlash = PlayerFox.prototype.stunSlash;
PlayerFoxHit.prototype.stunElectric = PlayerFox.prototype.stunElectric;
PlayerFoxHit.prototype.stunFire = PlayerFox.prototype.stunFire;
PlayerFoxHit.prototype.criticalHit = PlayerFox.prototype.criticalHit;
PlayerFoxHit.prototype.explode = PlayerFox.prototype.explode;
PlayerFoxHit.prototype.fall = PlayerFox.prototype.fall;

PlayerFoxHit.prototype.blip = function() {
  this.effects.push(NxFx.fox.alt.hit.blip.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.blipCooldown = PlayerFox.BLIP_POWER_MAX;
};

PlayerFoxHit.prototype.dash = function() {
  this.effects.push(NxFx.fox.alt.hit.dash.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.dashCooldown += PlayerFox.DASH_POWER_ADD;
};

PlayerFoxHit.prototype.taunt = PlayerFox.prototype.taunt;

PlayerFoxHit.prototype.setPos = PlayerFox.prototype.setPos;
PlayerFoxHit.prototype.setVel = PlayerFox.prototype.setVel;
PlayerFoxHit.prototype.setHeight = PlayerFox.prototype.setHeight;

PlayerFoxHit.prototype.setLook = PlayerFox.prototype.setLook;
PlayerFoxHit.prototype.setSpeed = PlayerFox.prototype.setSpeed;

PlayerFoxHit.prototype.getColor = PlayerObject.prototype.getColor;
PlayerFoxHit.prototype.getDraw = PlayerFox.prototype.getDraw;

PlayerFoxHit.prototype.destroy = PlayerFox.prototype.destroy;

PlayerFoxHit.prototype.type = PlayerFox.prototype.type;