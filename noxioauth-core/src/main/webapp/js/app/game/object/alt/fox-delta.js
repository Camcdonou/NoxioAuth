"use strict";
/* global main */
/* global util */
/* global NxFx */
/* global PointLight */
/* global ParticleBlip */
/* global ParticleDash */
/* global PlayerObject */
/* global PlayerFox */

/* Define Delta Fox Alternate Class */
function PlayerFoxDelta(game, oid, pos, team, color) {
  PlayerFox.call(this, game, oid, pos, team, color);
  this.material = this.game.display.getMaterial("character.fox.delta");
};

/* Constants */
PlayerFoxDelta.COLOR_A = util.vec4.lerp(util.vec4.make(0.207,  0.301, 0.65, 1.0), util.vec4.make(1,1,1,1), 0.925);
PlayerFoxDelta.COLOR_B = util.vec4.make(0.237,  0.351, 0.85, 1.0);

PlayerFoxDelta.prototype.update = PlayerFox.prototype.update;
PlayerFoxDelta.prototype.parseUpd = PlayerFox.prototype.parseUpd;

PlayerFoxDelta.prototype.effectSwitch = PlayerFox.prototype.effectSwitch;

PlayerFoxDelta.prototype.timers = PlayerFox.prototype.timers;

PlayerFoxDelta.prototype.ui = PlayerFox.prototype.ui;

PlayerFoxDelta.prototype.air  = PlayerFox.prototype.air;
PlayerFoxDelta.prototype.jump = PlayerFox.prototype.jump;
PlayerFoxDelta.prototype.land = PlayerFox.prototype.land;

PlayerFoxDelta.prototype.stun = PlayerFox.prototype.stun;
PlayerFoxDelta.prototype.stunGeneric = PlayerFox.prototype.stunGeneric;
PlayerFoxDelta.prototype.stunSlash = PlayerFox.prototype.stunSlash;
PlayerFoxDelta.prototype.stunElectric = PlayerFox.prototype.stunElectric;
PlayerFoxDelta.prototype.stunFire = PlayerFox.prototype.stunFire;
PlayerFoxDelta.prototype.criticalHit = PlayerFox.prototype.criticalHit;
PlayerFoxDelta.prototype.explode = PlayerFox.prototype.explode;
PlayerFoxDelta.prototype.fall = PlayerFox.prototype.fall;

PlayerFoxDelta.prototype.blip = function() {
  this.effects.push(NxFx.fox.alt.delta.blip.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.blipCooldown = PlayerFox.BLIP_POWER_MAX;
};

PlayerFoxDelta.prototype.dash = function() {
  this.effects.push(NxFx.fox.alt.delta.dash.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.dashCooldown += PlayerFox.DASH_POWER_ADD;
};

PlayerFoxDelta.prototype.taunt = PlayerFox.prototype.taunt;

PlayerFoxDelta.prototype.setPos = PlayerFox.prototype.setPos;
PlayerFoxDelta.prototype.setVel = PlayerFox.prototype.setVel;
PlayerFoxDelta.prototype.setHeight = PlayerFox.prototype.setHeight;

PlayerFoxDelta.prototype.setLook = PlayerFox.prototype.setLook;
PlayerFoxDelta.prototype.setSpeed = PlayerFox.prototype.setSpeed;

PlayerFoxDelta.prototype.getColor = PlayerObject.prototype.getColor;
PlayerFoxDelta.prototype.getDraw = PlayerFox.prototype.getDraw;

PlayerFoxDelta.prototype.destroy = PlayerFox.prototype.destroy;

PlayerFoxDelta.prototype.type = PlayerFox.prototype.type;