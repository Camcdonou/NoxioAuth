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
  
  /* Effects */
  this.blipEffect = {
    effect: new Effect([
      {type: "light", class: PointLight, params: ["<vec3 pos>", this.BLIP_COLOR_A, 3.0], update: function(lit){}, attachment: true, delay: 0, length: 3},
      {type: "light", class: PointLight, params: ["<vec3 pos>", this.BLIP_COLOR_B, 3.0], update: function(lit){lit.color.w -= 1.0/12.0; lit.rad += 0.1; }, attachment: true, delay: 3, length: 12},
      {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: ["character/fox/attack0.wav", 0.35], update: function(snd){}, attachment: true, delay: 0, length: 33},
      {type: "particle", class: ParticleBlip, params: [this.game, "<vec3 pos>", "<vec3 vel>", this.BLIP_COLOR_A, this.BLIP_COLOR_B], update: function(prt){}, attachment: true, delay: 0, length: 33}
    ], false),
    offset: util.vec3.make(0,0,0.5),
    trigger: PlayerObject.prototype.effectTrigger};
  this.effects.push(this.blipEffect);
  
  this.dashEffect = {
    effect: new Effect([
      {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: ["character/fox/dash0.wav", 0.65], update: function(snd){}, attachment: true, delay: 0, length: 33},
      {type: "light", class: PointLight, params: ["<vec3 pos>", this.DASH_LIGHT_COLOR, 2.5], update: function(lit){lit.color.w -= 1.0/45.0; lit.rad += 0.05; }, attachment: false, delay: 0, length: 30},
      {type: "particle", class: ParticleDash, params: [this.game, "<vec3 pos>", "<vec3 vel>", this.BLIP_COLOR_A, this.BLIP_COLOR_B], update: function(prt){}, attachment: true, delay: 0, length: 60}
    ], false),
    offset: util.vec3.make(0,0,0.25),
    trigger: PlayerObject.prototype.effectTrigger};
  this.effects.push(this.dashEffect);
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