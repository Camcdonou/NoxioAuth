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
function PlayerFoxFour(game, oid, pos, team, color) {
  PlayerFox.call(this, game, oid, pos, team, color);
  this.hat = {
    model: this.game.display.getModel("character.fox.hat"),
    material: this.game.display.getMaterial("character.fox.hat")
  };
};

PlayerFoxFour.prototype.update = PlayerFox.prototype.update;
PlayerFoxFour.prototype.parseUpd = PlayerFox.prototype.parseUpd;

PlayerFoxFour.prototype.effectSwitch = PlayerFox.prototype.effectSwitch;

PlayerFoxFour.prototype.timers = PlayerFox.prototype.timers;

PlayerFoxFour.prototype.ui = PlayerFox.prototype.ui;

PlayerFoxFour.prototype.air  = PlayerFox.prototype.air;
PlayerFoxFour.prototype.jump = PlayerFox.prototype.jump;
PlayerFoxFour.prototype.land = PlayerFox.prototype.land;

PlayerFoxFour.prototype.stun = PlayerFox.prototype.stun;
PlayerFoxFour.prototype.stunGeneric = PlayerFox.prototype.stunGeneric;
PlayerFoxFour.prototype.stunSlash = PlayerFox.prototype.stunSlash;
PlayerFoxFour.prototype.stunElectric = PlayerFox.prototype.stunElectric;
PlayerFoxFour.prototype.stunFire = PlayerFox.prototype.stunFire;
PlayerFoxFour.prototype.criticalHit = PlayerFox.prototype.criticalHit;
PlayerFoxFour.prototype.explode = PlayerFox.prototype.explode;
PlayerFoxFour.prototype.fall = PlayerFox.prototype.fall;

PlayerFoxFour.prototype.blip = PlayerFox.prototype.blip;

PlayerFoxFour.prototype.dash = PlayerFox.prototype.dash;

PlayerFoxFour.prototype.taunt = PlayerFox.prototype.taunt;

PlayerFoxFour.prototype.setPos = PlayerFox.prototype.setPos;
PlayerFoxFour.prototype.setVel = PlayerFox.prototype.setVel;
PlayerFoxFour.prototype.setHeight = PlayerFox.prototype.setHeight;

PlayerFoxFour.prototype.setLook = PlayerFox.prototype.setLook;
PlayerFoxFour.prototype.setSpeed = PlayerFox.prototype.setSpeed;

PlayerFoxFour.prototype.getColor = PlayerObject.prototype.getColor;
PlayerFoxFour.prototype.getDraw = function(geometry, decals, lights, bounds) {
  PlayerFox.prototype.getDraw.call(this, geometry, decals, lights, bounds);
  var playerUniformData = [
    {name: "transform", data: [this.pos.x, this.pos.y, this.height+.5]},
    {name: "rotation", data: 0.0},
    {name: "scale", data: 1.0}
  ];
  geometry.push({model: this.hat.model, material: this.hat.material, uniforms: playerUniformData});
};

PlayerFoxFour.prototype.destroy = PlayerFox.prototype.destroy;

PlayerFoxFour.prototype.type = PlayerFox.prototype.type;