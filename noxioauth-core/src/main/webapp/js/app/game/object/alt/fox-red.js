"use strict";
/* global main */
/* global util */
/* global PointLight */
/* global ParticleBlip */
/* global ParticleDash */
/* global PlayerObject */
/* global PlayerFox */

/* Define Red Fox Alternate Class */
function PlayerFoxRed(game, oid, pos, team, color) {
  PlayerFox.call(this, game, oid, pos, team, color);
  
  /* Constants */
  this.BLIP_COLOR_A = util.vec4.make(0.9647, 0.6392, 0.6117, 1.0);
  this.BLIP_COLOR_B = util.vec4.make(1.0, 0.2666, 0.2666, 1.0);
  this.DASH_LIGHT_COLOR = util.vec4.make(0.9647, 0.6392, 0.6117, 0.75);
};

PlayerFoxRed.prototype.update = PlayerFox.prototype.update;
PlayerFoxRed.prototype.parseUpd = PlayerFox.prototype.parseUpd;

PlayerFoxRed.prototype.effectSwitch = PlayerFox.prototype.effectSwitch;

PlayerFoxRed.prototype.timers = PlayerFox.prototype.timers;

PlayerFoxRed.prototype.ui = PlayerFox.prototype.ui;

PlayerFoxRed.prototype.air  = PlayerFox.prototype.air;
PlayerFoxRed.prototype.jump = PlayerFox.prototype.jump;
PlayerFoxRed.prototype.stun = PlayerFox.prototype.stun;

PlayerFoxRed.prototype.blip = PlayerFox.prototype.blip;

PlayerFoxRed.prototype.dash = PlayerFox.prototype.dash;

PlayerFoxRed.prototype.taunt = PlayerFox.prototype.taunt;

PlayerFoxRed.prototype.setPos = PlayerFox.prototype.setPos;
PlayerFoxRed.prototype.setVel = PlayerFox.prototype.setVel;
PlayerFoxRed.prototype.setHeight = PlayerFox.prototype.setHeight;

PlayerFoxRed.prototype.setLook = PlayerFox.prototype.setLook;
PlayerFoxRed.prototype.setSpeed = PlayerFox.prototype.setSpeed;
PlayerFoxRed.prototype.getDraw = PlayerFox.prototype.getDraw;

PlayerFoxRed.prototype.destroy = PlayerFox.prototype.destroy;

PlayerFoxRed.prototype.type = PlayerFox.prototype.type;