"use strict";
/* global main */
/* global util */
/* global NxFx */
/* global PointLight */
/* global ParticleBlip */
/* global ParticleDash */
/* global PlayerObject */
/* global PlayerFox */

/* Define Rainbow Fox Alternate Class */
function PlayerFoxRainbow(game, oid, pos, team, color) {
  PlayerFox.call(this, game, oid, pos, team, color);
};

/* Constants */
PlayerFoxRainbow.LIGHT_COLOR_A = util.vec4.make(0.95, 0.95, 0.95, 1.0);
PlayerFoxRainbow.LIGHT_COLOR_B = util.vec4.make(0.7, 0.7, 0.7, 1.0);

PlayerFoxRainbow.prototype.update = PlayerFox.prototype.update;
PlayerFoxRainbow.prototype.parseUpd = PlayerFox.prototype.parseUpd;

PlayerFoxRainbow.prototype.effectSwitch = PlayerFox.prototype.effectSwitch;

PlayerFoxRainbow.prototype.timers = PlayerFox.prototype.timers;

PlayerFoxRainbow.prototype.ui = PlayerFox.prototype.ui;

PlayerFoxRainbow.prototype.air  = PlayerFox.prototype.air;
PlayerFoxRainbow.prototype.jump = PlayerFox.prototype.jump;
PlayerFoxRainbow.prototype.land = PlayerFox.prototype.land;

PlayerFoxRainbow.prototype.stun = PlayerFox.prototype.stun;
PlayerFoxRainbow.prototype.stunGeneric = PlayerFox.prototype.stunGeneric;
PlayerFoxRainbow.prototype.stunSlash = PlayerFox.prototype.stunSlash;
PlayerFoxRainbow.prototype.stunElectric = PlayerFox.prototype.stunElectric;
PlayerFoxRainbow.prototype.stunFire = PlayerFox.prototype.stunFire;
PlayerFoxRainbow.prototype.criticalHit = PlayerFox.prototype.criticalHit;
PlayerFoxRainbow.prototype.explode = PlayerFox.prototype.explode;
PlayerFoxRainbow.prototype.fall = PlayerFox.prototype.fall;

PlayerFoxRainbow.prototype.blip = function() {
  this.effects.push(NxFx.fox.alt.rainbow.blip.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.blipCooldown = PlayerFox.BLIP_POWER_MAX;
};

PlayerFoxRainbow.prototype.dash = function() {
  this.effects.push(NxFx.fox.alt.rainbow.dash.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.dashCooldown += PlayerFox.DASH_POWER_ADD;
};

PlayerFoxRainbow.prototype.taunt = PlayerFox.prototype.taunt;

PlayerFoxRainbow.prototype.setPos = PlayerFox.prototype.setPos;
PlayerFoxRainbow.prototype.setVel = PlayerFox.prototype.setVel;
PlayerFoxRainbow.prototype.setHeight = PlayerFox.prototype.setHeight;

PlayerFoxRainbow.prototype.setLook = PlayerFox.prototype.setLook;
PlayerFoxRainbow.prototype.setSpeed = PlayerFox.prototype.setSpeed;
PlayerFoxRainbow.prototype.getDraw = PlayerFox.prototype.getDraw;

PlayerFoxRainbow.prototype.destroy = PlayerFox.prototype.destroy;

PlayerFoxRainbow.prototype.type = PlayerFox.prototype.type;