"use strict";
/* global main */
/* global util */
/* global NxFx */
/* global PointLight */
/* global ParticleBlip */
/* global ParticleDash */
/* global PlayerObject */
/* global PlayerFox */

/* Define Gold Fox Alternate Class */
function PlayerFoxGold(game, oid, pos, team, color) {
  PlayerFox.call(this, game, oid, pos, team, color);
  this.material = this.game.display.getMaterial("character.fox.gold");
};

/* Constants */
PlayerFoxGold.BLIP_COLOR_A = util.vec4.lerp(util.vec4.make(0.521, 0.2, 1.0, 1.0), util.vec4.make(1,1,1,1), 0.925);
PlayerFoxGold.BLIP_COLOR_B = util.vec4.make(0.521, 0.2, 1.0, 1.0);

PlayerFoxGold.prototype.update = PlayerFox.prototype.update;
PlayerFoxGold.prototype.parseUpd = PlayerFox.prototype.parseUpd;

PlayerFoxGold.prototype.effectSwitch = PlayerFox.prototype.effectSwitch;

PlayerFoxGold.prototype.timers = PlayerFox.prototype.timers;

PlayerFoxGold.prototype.ui = PlayerFox.prototype.ui;

PlayerFoxGold.prototype.air  = PlayerFox.prototype.air;
PlayerFoxGold.prototype.jump = PlayerFox.prototype.jump;
PlayerFoxGold.prototype.land = PlayerFox.prototype.land;

PlayerFoxGold.prototype.stun = PlayerFox.prototype.stun;
PlayerFoxGold.prototype.stunGeneric = PlayerFox.prototype.stunGeneric;
PlayerFoxGold.prototype.stunSlash = PlayerFox.prototype.stunSlash;
PlayerFoxGold.prototype.stunElectric = PlayerFox.prototype.stunElectric;
PlayerFoxGold.prototype.stunFire = PlayerFox.prototype.stunFire;
PlayerFoxGold.prototype.criticalHit = PlayerFox.prototype.criticalHit;
PlayerFoxGold.prototype.explode = PlayerFox.prototype.explode;
PlayerFoxGold.prototype.fall = PlayerFox.prototype.fall;

PlayerFoxGold.prototype.blip = function() {
  this.effects.push(NxFx.fox.alt.gold.blip.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.blipCooldown = PlayerFox.BLIP_POWER_MAX;
};

PlayerFoxGold.prototype.dash = function() {
  this.effects.push(NxFx.fox.alt.gold.dash.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.dashCooldown += PlayerFox.DASH_POWER_ADD;
};

PlayerFoxGold.prototype.taunt = PlayerFox.prototype.taunt;

PlayerFoxGold.prototype.setPos = PlayerFox.prototype.setPos;
PlayerFoxGold.prototype.setVel = PlayerFox.prototype.setVel;
PlayerFoxGold.prototype.setHeight = PlayerFox.prototype.setHeight;

PlayerFoxGold.prototype.setLook = PlayerFox.prototype.setLook;
PlayerFoxGold.prototype.setSpeed = PlayerFox.prototype.setSpeed;

PlayerFoxGold.prototype.getColor = PlayerObject.prototype.getColor;
PlayerFoxGold.prototype.getDraw = PlayerFox.prototype.getDraw;

PlayerFoxGold.prototype.destroy = PlayerFox.prototype.destroy;

PlayerFoxGold.prototype.type = PlayerFox.prototype.type;