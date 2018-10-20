"use strict";
/* global main */
/* global util */
/* global GameObject */
/* global PlayerObject */
/* global PlayerFalco */
/* global NxFx */

/* Define PlayerFalcoVoice Class */
function PlayerFalcoVoice(game, oid, pos, team, color) {
  PlayerFalco.call(this, game, oid, pos, team, color);
  this.material = this.game.display.getMaterial("character.falco.reverse");
};

PlayerFalcoVoice.prototype.update = PlayerFalco.prototype.update;
PlayerFalcoVoice.prototype.parseUpd = PlayerFalco.prototype.parseUpd;
PlayerFalcoVoice.prototype.effectSwitch = PlayerFalco.prototype.effectSwitch;
PlayerFalcoVoice.prototype.timers = PlayerFalco.prototype.timers;
PlayerFalcoVoice.prototype.ui = PlayerFalco.prototype.ui;

PlayerFalcoVoice.prototype.air  = function() {
  PlayerFalco.prototype.air.call(this);
  this.effects.push(NxFx.falco.alt.voice.jump.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};

PlayerFalcoVoice.prototype.jump = function() {
  PlayerFalco.prototype.jump.call(this);
  this.effects.push(NxFx.falco.alt.voice.jump.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};

PlayerFalcoVoice.prototype.land = PlayerFalco.prototype.land;

PlayerFalcoVoice.prototype.stun = function() {
  PlayerFalco.prototype.stun.call(this);
  this.effects.push(NxFx.falco.alt.voice.hit.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};

PlayerFalcoVoice.prototype.stunGeneric = PlayerFalco.prototype.stunGeneric;
PlayerFalcoVoice.prototype.stunSlash = PlayerFalco.prototype.stunSlash;
PlayerFalcoVoice.prototype.stunElectric = PlayerFalco.prototype.stunElectric;
PlayerFalcoVoice.prototype.stunFire = PlayerFalco.prototype.stunFire;
PlayerFalcoVoice.prototype.criticalHit = PlayerFalco.prototype.criticalHit;

PlayerFalcoVoice.prototype.explode = function() {
  PlayerFalco.prototype.explode.call(this);
  this.game.putEffect(NxFx.falco.alt.voice.explode.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};

PlayerFalcoVoice.prototype.fall = function() {
  PlayerFalco.prototype.fall.call(this);
  this.effects.push(NxFx.falco.alt.voice.fall.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};

PlayerFalcoVoice.prototype.blip = PlayerFalco.prototype.blip;

PlayerFalcoVoice.prototype.dash = function() {
  PlayerFalco.prototype.dash.call(this);
  this.effects.push(NxFx.falco.alt.voice.dash.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};

PlayerFalcoVoice.prototype.charge = PlayerFalco.prototype.charge;

PlayerFalcoVoice.prototype.taunt = function() {
  PlayerFalco.prototype.taunt.call(this);
  this.effects.push(NxFx.falco.alt.voice.taunt.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};

PlayerFalcoVoice.prototype.setPos = PlayerFalco.prototype.setPos;
PlayerFalcoVoice.prototype.setVel = PlayerFalco.prototype.setVel;
PlayerFalcoVoice.prototype.setHeight = PlayerFalco.prototype.setHeight;

PlayerFalcoVoice.prototype.setLook = PlayerFalco.prototype.setLook;
PlayerFalcoVoice.prototype.setSpeed = PlayerFalco.prototype.setSpeed;
PlayerFalcoVoice.prototype.getDraw = PlayerFalco.prototype.getDraw;

PlayerFalcoVoice.prototype.destroy = PlayerFalco.prototype.destroy;

PlayerFalcoVoice.prototype.type = PlayerFalco.prototype.type;
