"use strict";
/* global main */
/* global util */
/* global GameObject */
/* global PlayerObject */
/* global NxFx */

/* Define PlayerShiek Class */
function PlayerShiek(game, oid, pos, team, color) {
  PlayerObject.call(this, game, oid, pos, 0, team, color);
  
  this.model = this.game.display.getModel("character.shiek.shiek");
  this.material = this.game.display.getMaterial("character.shiek.shiek");
  this.icon = this.game.display.getMaterial("character.shiek.ui.iconlarge");
  
  /* Settings */
  this.radius = 0.5; this.weight = 1.0; this.friction = 0.735;
  this.moveSpeed = 0.0380; this.jumpHeight = 0.175; this.cullRadius = 1.0;
  
  /* State */
  this.markLocation = undefined;

  /* Timers */
  this.chargeTimer = 0;
  this.blipCooldown = 0;

  /* UI */
  this.uiMeters = [
    {type: "bar", iconMat: this.game.display.getMaterial("character.shiek.ui.meterblip"), length: 12, scalar: 1.0},
    {type: "bar", iconMat: this.game.display.getMaterial("character.generic.ui.meterstub"), length: 8, scalar: 0.0}
  ];
};

/* Constants */
PlayerShiek.FLASH_CHARGE_LENGTH = 7;
PlayerShiek.BLIP_POWER_MAX = 30;

PlayerShiek.prototype.update = function(data) {
  PlayerObject.prototype.update.call(this, data);
};

PlayerShiek.prototype.parseUpd = PlayerObject.prototype.parseUpd;

PlayerShiek.prototype.effectSwitch = function(e) {
  switch(e) {
    case "atk" : { this.blip(); break; }
    case "chr" : { this.charge(); break; }
    case "pre" : { this.pre(); break; }
    case "fsh" : { this.recall(); break; }
    case "mrk" : { this.mark(); break; }
    case "nom" : { this.noMark(); break; }
    default : { return PlayerObject.prototype.effectSwitch.call(this, e); }
  }
};

PlayerShiek.prototype.timers = function() {
  if(this.chargeTimer > 0) { this.chargeTimer--; this.glow = 1-(this.chargeTimer/PlayerShiek.FLASH_CHARGE_LENGTH); }
  else { this.glow = 0; }
  if(this.blipCooldown > 0) { this.blipCooldown--; }
};

PlayerShiek.prototype.ui = function() {
  this.uiMeters[0].scalar = 1.0-(this.blipCooldown/PlayerShiek.BLIP_POWER_MAX);
  this.uiMeters[1].scalar = this.markLocation?1:0;
};

PlayerShiek.prototype.air  = PlayerObject.prototype.air;
PlayerShiek.prototype.jump = PlayerObject.prototype.jump;
PlayerShiek.prototype.land = PlayerObject.prototype.land;

PlayerShiek.prototype.stun = function() {
  PlayerObject.prototype.stun.call(this);
  if(this.chargeEffect) { this.chargeEffect.destroy(); this.chargeEffect = undefined; }
  this.chargeTimer = 0;
};

PlayerShiek.prototype.stunGeneric = PlayerObject.prototype.stunGeneric;
PlayerShiek.prototype.stunSlash = PlayerObject.prototype.stunSlash;
PlayerShiek.prototype.stunElectric = PlayerObject.prototype.stunElectric;
PlayerShiek.prototype.stunFire = PlayerObject.prototype.stunFire;
PlayerShiek.prototype.criticalHit = PlayerObject.prototype.criticalHit;
PlayerShiek.prototype.explode = PlayerObject.prototype.explode;
PlayerShiek.prototype.fall = PlayerObject.prototype.fall;

PlayerShiek.prototype.blip = function() {
  this.effects.push(NxFx.fox.blip.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.blipCooldown = PlayerShiek.BLIP_POWER_MAX;
};

PlayerShiek.prototype.charge = function() {
  this.chargeEffect = NxFx.shiek.charge.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed));
  this.effects.push(this.chargeEffect);
  this.chargeTimer = PlayerShiek.FLASH_CHARGE_LENGTH;
};

PlayerShiek.prototype.pre = function() {
  this.game.putEffect(NxFx.shiek.vanish.trigger(this.game, util.vec2.toVec3(this.pos, 0), util.vec3.create()));
};

PlayerShiek.prototype.recall = function() {
  this.effects.push(NxFx.shiek.recall.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.markLocation = undefined;
  if(this.locationEffect) { this.locationEffect.destroy(); this.locationEffect = undefined; }
};

PlayerShiek.prototype.mark = function() {
  this.effects.push(NxFx.shiek.mark.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.markLocation = util.vec2.copy(this.pos);
  this.markEffect = NxFx.shiek.location.trigger(this.game, util.vec2.toVec3(this.markLocation, 0), util.vec2.toVec3(this.vel, this.vspeed));
  this.effects.push(this.markEffect);
};

PlayerShiek.prototype.noMark = function() {
  this.effects.push(NxFx.shiek.no.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};

PlayerShiek.prototype.taunt = function() {

};

PlayerShiek.prototype.setPos = PlayerObject.prototype.setPos;
PlayerShiek.prototype.setVel = PlayerObject.prototype.setVel;
PlayerShiek.prototype.setHeight = PlayerObject.prototype.setHeight;

PlayerShiek.prototype.setLook = PlayerObject.prototype.setLook;
PlayerShiek.prototype.setSpeed = PlayerObject.prototype.setSpeed;
PlayerShiek.prototype.getDraw = PlayerObject.prototype.getDraw;

PlayerShiek.prototype.destroy = PlayerObject.prototype.destroy;

PlayerShiek.prototype.type = function() { return "vox"; };

/* Permutation dictionary */

/* global PlayerShiekVoice */
/* global PlayerShiekRainbow */
/* global PlayerShiekGold */
/* global PlayerShiekGreen */
/* global PlayerShiekBlack */
/* global PlayerShiekDelta */
PlayerShiek.classByPermutation = function(perm) {
  switch(perm) {
    case 1 : { return PlayerShiekVoice; }
    case 2 : { return PlayerShiekGreen; }
    case 3 : { return PlayerShiekRainbow; }
    case 4 : { return PlayerShiekGold; }
    case 5 : { return PlayerShiekDelta; }
    case 6 : { return PlayerShiekBlack; }
    default : { return PlayerShiek; }
  }
};