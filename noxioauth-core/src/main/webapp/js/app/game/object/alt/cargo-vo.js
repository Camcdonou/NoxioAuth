"use strict";
/* global main */
/* global util */
/* global GameObject */
/* global PlayerObject */
/* global NxFx */
/* global PlayerCargo */

/* Define PlayerCargoVoice Class */
function PlayerCargoVoice(game, oid, pos, team, color) {
  PlayerCargo.call(this, game, oid, pos, team, color);
  this.material = this.game.display.getMaterial("character.cargo.reverse");
};

PlayerCargoVoice.prototype.update = PlayerCargo.prototype.update;
PlayerCargoVoice.prototype.parseUpd = PlayerCargo.prototype.parseUpd;
PlayerCargoVoice.prototype.effectSwitch = PlayerCargo.prototype.effectSwitch;
PlayerCargoVoice.prototype.timers = PlayerCargo.prototype.timers;
PlayerCargoVoice.prototype.ui = PlayerCargo.prototype.ui;

PlayerCargoVoice.prototype.air  = function() {
  PlayerCargo.prototype.air.call(this);
  this.effects.push(NxFx.cargo.alt.voice.jump.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};

PlayerCargoVoice.prototype.jump = function() {
  PlayerCargo.prototype.jump.call(this);
  this.effects.push(NxFx.cargo.alt.voice.jump.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};

PlayerCargoVoice.prototype.land = PlayerCargo.prototype.land;
PlayerCargoVoice.prototype.toss = PlayerObject.prototype.toss;
PlayerCargoVoice.prototype.pickup = PlayerObject.prototype.pickup;

PlayerCargoVoice.prototype.stun = function() {
  PlayerCargo.prototype.stun.call(this);
  this.effects.push(NxFx.cargo.alt.voice.hit.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};

PlayerCargoVoice.prototype.stunGeneric = PlayerCargo.prototype.stunGeneric;
PlayerCargoVoice.prototype.stunSlash = PlayerCargo.prototype.stunSlash;
PlayerCargoVoice.prototype.stunElectric = PlayerCargo.prototype.stunElectric;
PlayerCargoVoice.prototype.stunFire = PlayerCargo.prototype.stunFire;
PlayerCargoVoice.prototype.criticalHit = PlayerCargo.prototype.criticalHit;

PlayerCargoVoice.prototype.explode = function() {
  PlayerCargo.prototype.explode.call(this);
  this.game.putEffect(NxFx.cargo.alt.voice.explode.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};
PlayerCargoVoice.prototype.fall = function() {
  PlayerCargo.prototype.fall.call(this);
  this.effects.push(NxFx.cargo.alt.voice.fall.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};

PlayerCargoVoice.prototype.charge = function() {
  PlayerCargo.prototype.charge.call(this);
  this.effects.push(NxFx.cargo.alt.voice.charge.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};

PlayerCargoVoice.prototype.punch = function() {
  PlayerCargo.prototype.punch.call(this);
  this.effects.push(NxFx.cargo.alt.voice.punch.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};

PlayerCargoVoice.prototype.kick = PlayerCargo.prototype.kick;
PlayerCargoVoice.prototype.kicking = PlayerCargo.prototype.kicking;

PlayerCargoVoice.prototype.taunt = function() {
  PlayerCargo.prototype.taunt.call(this);
  this.effects.push(NxFx.cargo.alt.voice.taunt.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};

PlayerCargoVoice.prototype.setPos = PlayerCargo.prototype.setPos;
PlayerCargoVoice.prototype.setVel = PlayerCargo.prototype.setVel;
PlayerCargoVoice.prototype.setHeight = PlayerCargo.prototype.setHeight;

PlayerCargoVoice.prototype.setLook = PlayerCargo.prototype.setLook;
PlayerCargoVoice.prototype.setSpeed = PlayerCargo.prototype.setSpeed;

PlayerCargoVoice.prototype.getColor = PlayerObject.prototype.getColor;
PlayerCargoVoice.prototype.getDraw = PlayerCargo.prototype.getDraw;

PlayerCargoVoice.prototype.destroy = PlayerObject.prototype.destroy;

PlayerCargoVoice.prototype.type = PlayerCargo.prototype.type;
