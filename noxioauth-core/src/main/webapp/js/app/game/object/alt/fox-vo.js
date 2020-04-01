"use strict";
/* global main */
/* global util */
/* global NxFx */
/* global PointLight */
/* global ParticleBlip */
/* global ParticleDash */
/* global PlayerObject */
/* global PlayerFox */

/* Define Voice Fox Alternate Class */
function PlayerFoxVoice(game, oid, pos, team, color) {
  PlayerFox.call(this, game, oid, pos, team, color);
  this.material = this.game.display.getMaterial("character.fox.reverse");
};

/* Constants */
PlayerFoxVoice.COLOR_A = util.vec4.lerp(util.vec4.make(0.2, 0.2, 1.0, 1.0), util.vec4.make(1,1,1,1), 0.925);
PlayerFoxVoice.COLOR_B = util.vec4.make(0.2, 0.2, 1.0, 1.0);

PlayerFoxVoice.prototype.update = PlayerFox.prototype.update;
PlayerFoxVoice.prototype.parseUpd = PlayerFox.prototype.parseUpd;

PlayerFoxVoice.prototype.effectSwitch = PlayerFox.prototype.effectSwitch;

PlayerFoxVoice.prototype.timers = PlayerFox.prototype.timers;

PlayerFoxVoice.prototype.ui = PlayerFox.prototype.ui;

PlayerFoxVoice.prototype.air  = PlayerFox.prototype.air;
PlayerFoxVoice.prototype.jump = PlayerFox.prototype.jump;
PlayerFoxVoice.prototype.land = PlayerFox.prototype.land;
PlayerFoxVoice.prototype.toss = PlayerObject.prototype.toss;
PlayerFoxVoice.prototype.pickup = PlayerObject.prototype.pickup;

PlayerFoxVoice.prototype.stun = PlayerFox.prototype.stun;
PlayerFoxVoice.prototype.stunGeneric = PlayerFox.prototype.stunGeneric;
PlayerFoxVoice.prototype.stunSlash = PlayerFox.prototype.stunSlash;
PlayerFoxVoice.prototype.stunElectric = PlayerFox.prototype.stunElectric;
PlayerFoxVoice.prototype.stunFire = PlayerFox.prototype.stunFire;
PlayerFoxVoice.prototype.criticalHit = PlayerFox.prototype.criticalHit;
PlayerFoxVoice.prototype.explode = PlayerFox.prototype.explode;
PlayerFoxVoice.prototype.fall = PlayerFox.prototype.fall;

PlayerFoxVoice.prototype.blip = function() {
  PlayerFox.prototype.blip.call(this);
};

PlayerFoxVoice.prototype.dash = function() {
  PlayerFox.prototype.dash.call(this);
};

PlayerFoxVoice.prototype.taunt = PlayerFox.prototype.taunt;

PlayerFoxVoice.prototype.setPos = PlayerFox.prototype.setPos;
PlayerFoxVoice.prototype.setVel = PlayerFox.prototype.setVel;
PlayerFoxVoice.prototype.setHeight = PlayerFox.prototype.setHeight;

PlayerFoxVoice.prototype.setLook = PlayerFox.prototype.setLook;
PlayerFoxVoice.prototype.setSpeed = PlayerFox.prototype.setSpeed;

PlayerFoxVoice.prototype.getColor = PlayerObject.prototype.getColor;
PlayerFoxVoice.prototype.getDraw = PlayerFox.prototype.getDraw;

PlayerFoxVoice.prototype.destroy = PlayerFox.prototype.destroy;

PlayerFoxVoice.prototype.type = PlayerFox.prototype.type;