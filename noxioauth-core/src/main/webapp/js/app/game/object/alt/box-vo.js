"use strict";
/* global main */
/* global util */
/* global NxFx */
/* global PointLight */
/* global ParticleBlip */
/* global ParticleDash */
/* global PlayerObject */
/* global PlayerBox */

/* Define Voice Box Alternate Class */
function PlayerBoxVoice(game, oid, pos, team, color) {
  PlayerBox.call(this, game, oid, pos, team, color);
  this.material = this.game.display.getMaterial("character.box.reverse");
};

/* Constants */
PlayerBoxVoice.COLOR_A = util.vec4.lerp(util.vec4.make(0.2, 0.2, 1.0, 1.0), util.vec4.make(1,1,1,1), 0.925);
PlayerBoxVoice.COLOR_B = util.vec4.make(0.2, 0.2, 1.0, 1.0);

PlayerBoxVoice.prototype.update = PlayerBox.prototype.update;
PlayerBoxVoice.prototype.parseUpd = PlayerBox.prototype.parseUpd;

PlayerBoxVoice.prototype.effectSwitch = PlayerBox.prototype.effectSwitch;

PlayerBoxVoice.prototype.timers = PlayerBox.prototype.timers;

PlayerBoxVoice.prototype.ui = PlayerBox.prototype.ui;

PlayerBoxVoice.prototype.air  = PlayerBox.prototype.air;
PlayerBoxVoice.prototype.jump = PlayerBox.prototype.jump;
PlayerBoxVoice.prototype.land = PlayerBox.prototype.land;
PlayerBoxVoice.prototype.toss = PlayerObject.prototype.toss;
PlayerBoxVoice.prototype.pickup = PlayerObject.prototype.pickup;

PlayerBoxVoice.prototype.stun = PlayerBox.prototype.stun;
PlayerBoxVoice.prototype.stunGeneric = PlayerBox.prototype.stunGeneric;
PlayerBoxVoice.prototype.stunSlash = PlayerBox.prototype.stunSlash;
PlayerBoxVoice.prototype.stunElectric = PlayerBox.prototype.stunElectric;
PlayerBoxVoice.prototype.stunFire = PlayerBox.prototype.stunFire;
PlayerBoxVoice.prototype.criticalHit = PlayerBox.prototype.criticalHit;
PlayerBoxVoice.prototype.explode = PlayerBox.prototype.explode;
PlayerBoxVoice.prototype.fall = PlayerBox.prototype.fall;

PlayerBoxVoice.prototype.blip = function() {
  PlayerBox.prototype.blip.call(this);
};

PlayerBoxVoice.prototype.dash = function() {
  PlayerBox.prototype.dash.call(this);
};

PlayerBoxVoice.prototype.taunt = PlayerBox.prototype.taunt;

PlayerBoxVoice.prototype.setPos = PlayerBox.prototype.setPos;
PlayerBoxVoice.prototype.setVel = PlayerBox.prototype.setVel;
PlayerBoxVoice.prototype.setHeight = PlayerBox.prototype.setHeight;

PlayerBoxVoice.prototype.setLook = PlayerBox.prototype.setLook;
PlayerBoxVoice.prototype.setSpeed = PlayerBox.prototype.setSpeed;

PlayerBoxVoice.prototype.getColor = PlayerObject.prototype.getColor;
PlayerBoxVoice.prototype.getDraw = PlayerBox.prototype.getDraw;

PlayerBoxVoice.prototype.destroy = PlayerBox.prototype.destroy;

PlayerBoxVoice.prototype.type = PlayerBox.prototype.type;