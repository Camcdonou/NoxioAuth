"use strict";
/* global main */
/* global util */
/* global NxFx */
/* global PointLight */
/* global ParticleBlip */
/* global ParticleDash */
/* global PlayerObject */
/* global PlayerFox */

/* Define Red Fox Alternate Class */
function PlayerFoxRed(game, oid, pos, team, color) {
  PlayerFox.call(this, game, oid, pos, team, color);
};

/* Constants */
PlayerFoxRed.BLIP_COLOR_A = util.vec4.lerp(util.vec4.make(1.0, 0.9058, 0.6666, 1.0), util.vec4.make(1,1,1,1), 0.5);
PlayerFoxRed.BLIP_COLOR_B = util.vec4.make(1.0, 0.5450, 0.4, 1.0);

PlayerFoxRed.prototype.update = PlayerFox.prototype.update;
PlayerFoxRed.prototype.parseUpd = PlayerFox.prototype.parseUpd;

PlayerFoxRed.prototype.effectSwitch = PlayerFox.prototype.effectSwitch;

PlayerFoxRed.prototype.timers = PlayerFox.prototype.timers;

PlayerFoxRed.prototype.ui = PlayerFox.prototype.ui;

PlayerFoxRed.prototype.air  = PlayerFox.prototype.air;
PlayerFoxRed.prototype.jump = PlayerFox.prototype.jump;
PlayerFoxRed.prototype.land = PlayerFox.prototype.land;

PlayerFoxRed.prototype.stun = PlayerFox.prototype.stun;
PlayerFoxRed.prototype.stunGeneric = PlayerFox.prototype.stunGeneric;
PlayerFoxRed.prototype.stunSlash = PlayerFox.prototype.stunSlash;
PlayerFoxRed.prototype.stunElectric = PlayerFox.prototype.stunElectric;
PlayerFoxRed.prototype.stunFire = PlayerFox.prototype.stunFire;
PlayerFoxRed.prototype.criticalHit = PlayerFox.prototype.criticalHit;
PlayerFoxRed.prototype.explode = PlayerFox.prototype.explode;
PlayerFoxRed.prototype.fall = PlayerFox.prototype.fall;

PlayerFoxRed.prototype.blip = function() {
  this.effects.push(NxFx.fox.alt.red.blip.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.blipCooldown = PlayerFox.BLIP_POWER_MAX;
};

PlayerFoxRed.prototype.dash = function() {
  this.effects.push(NxFx.fox.alt.red.dash.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.dashCooldown += PlayerFox.DASH_POWER_ADD;
};

PlayerFoxRed.prototype.taunt = PlayerFox.prototype.taunt;

PlayerFoxRed.prototype.setPos = PlayerFox.prototype.setPos;
PlayerFoxRed.prototype.setVel = PlayerFox.prototype.setVel;
PlayerFoxRed.prototype.setHeight = PlayerFox.prototype.setHeight;

PlayerFoxRed.prototype.setLook = PlayerFox.prototype.setLook;
PlayerFoxRed.prototype.setSpeed = PlayerFox.prototype.setSpeed;
PlayerFoxRed.prototype.getDraw = PlayerFox.prototype.getDraw;

PlayerFoxRed.prototype.destroy = PlayerFox.prototype.destroy;

PlayerFoxRed.prototype.type = PlayerFox.prototype.type;