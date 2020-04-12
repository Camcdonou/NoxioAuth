"use strict";
/* global main */
/* global util */
/* global NxFx */
/* global PointLight */
/* global ParticleBlip */
/* global ParticleDash */
/* global PlayerObject */
/* global PlayerBox */

/* Define Delta Box Alternate Class */
function PlayerBoxFour(game, oid, pos, team, color) {
  PlayerBox.call(this, game, oid, pos, team, color);
  this.hat = {
    model: this.game.display.getModel("character.box.hat"),
    material: this.game.display.getMaterial("character.box.hat")
  };
};

PlayerBoxFour.prototype.update = PlayerBox.prototype.update;
PlayerBoxFour.prototype.parseUpd = PlayerBox.prototype.parseUpd;

PlayerBoxFour.prototype.effectSwitch = PlayerBox.prototype.effectSwitch;

PlayerBoxFour.prototype.timers = PlayerBox.prototype.timers;

PlayerBoxFour.prototype.ui = PlayerBox.prototype.ui;

PlayerBoxFour.prototype.air  = PlayerBox.prototype.air;
PlayerBoxFour.prototype.jump = PlayerBox.prototype.jump;
PlayerBoxFour.prototype.land = PlayerBox.prototype.land;
PlayerBoxFour.prototype.toss = PlayerObject.prototype.toss;
PlayerBoxFour.prototype.pickup = PlayerObject.prototype.pickup;

PlayerBoxFour.prototype.stun = PlayerBox.prototype.stun;
PlayerBoxFour.prototype.stunGeneric = PlayerBox.prototype.stunGeneric;
PlayerBoxFour.prototype.stunSlash = PlayerBox.prototype.stunSlash;
PlayerBoxFour.prototype.stunElectric = PlayerBox.prototype.stunElectric;
PlayerBoxFour.prototype.stunFire = PlayerBox.prototype.stunFire;
PlayerBoxFour.prototype.criticalHit = PlayerBox.prototype.criticalHit;
PlayerBoxFour.prototype.explode = PlayerBox.prototype.explode;
PlayerBoxFour.prototype.fall = PlayerBox.prototype.fall;

PlayerBoxFour.prototype.blip = PlayerBox.prototype.blip;

PlayerBoxFour.prototype.dash = PlayerBox.prototype.dash;

PlayerBoxFour.prototype.taunt = PlayerBox.prototype.taunt;

PlayerBoxFour.prototype.setPos = PlayerBox.prototype.setPos;
PlayerBoxFour.prototype.setVel = PlayerBox.prototype.setVel;
PlayerBoxFour.prototype.setHeight = PlayerBox.prototype.setHeight;

PlayerBoxFour.prototype.setLook = PlayerBox.prototype.setLook;
PlayerBoxFour.prototype.setSpeed = PlayerBox.prototype.setSpeed;

PlayerBoxFour.prototype.getColor = PlayerObject.prototype.getColor;
PlayerBoxFour.prototype.getDraw = function(geometry, decals, lights, bounds) {
  PlayerBox.prototype.getDraw.call(this, geometry, decals, lights, bounds);
  var playerUniformData = [
    {name: "transform", data: [this.pos.x, this.pos.y, this.height+.5]},
    {name: "rotation", data: 0.0},
    {name: "scale", data: 1.0}
  ];
  geometry.push({model: this.hat.model, material: this.hat.material, uniforms: playerUniformData});
};

PlayerBoxFour.prototype.destroy = PlayerBox.prototype.destroy;

PlayerBoxFour.prototype.type = PlayerBox.prototype.type;