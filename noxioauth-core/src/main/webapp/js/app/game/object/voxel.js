"use strict";
/* global main */
/* global util */
/* global GameObject */
/* global PlayerObject */
/* global NxFx */

/* Define PlayerVoxel Class */
function PlayerVoxel(game, oid, pos, team, color) {
  PlayerObject.call(this, game, oid, pos, 0, team, color);
  
  this.model = this.game.display.getModel("character.voxel.voxel");
  this.material = this.game.display.getMaterial("character.voxel.voxel");
  this.icon = this.game.display.getMaterial("character.voxel.ui.iconsmall");
  
  /* Settings */
  this.radius = 0.5; this.weight = 1.0; this.friction = 0.735;
  this.moveSpeed = 0.0380; this.jumpHeight = 0.175; this.cullRadius = 1.0;
  
  /* State */
  this.markLocation = undefined;

  /* Timers */
  this.chargeTimer = 0;
  this.blipCooldown = 0;
  
  /* Decal */
  this.indicator = new Decal(this.game, "character.xob.decal.rewindpoint", util.vec2.toVec3(this.pos, Math.min(this.height, 0.)), util.vec3.make(0.0, 0.0, 1.0), 1.0, 0, util.vec4.make(1,1,1,0), 0, 0, 0);
  
  /* UI */
  this.uiMeters = [
    {type: "bar", iconMat: this.game.display.getMaterial("character.generic.ui.metera"), length: 12, scalar: 1.0},
    {type: "bar", iconMat: this.game.display.getMaterial("character.generic.ui.meterb"), length: 8, scalar: 0.0}
  ];
};

/* Constants */
PlayerVoxel.FLASH_CHARGE_LENGTH = 7;
PlayerVoxel.BLIP_POWER_MAX = 30;
PlayerVoxel.BLIP_REFUND_POWER = 5;

PlayerVoxel.prototype.update = function(data) {
  PlayerObject.prototype.update.call(this, data);
};

PlayerVoxel.prototype.parseUpd = PlayerObject.prototype.parseUpd;

PlayerVoxel.prototype.effectSwitch = function(e) {
  switch(e) {
    case "atk" : { this.blip(); break; }
    case "chr" : { this.charge(); break; }
    case "pre" : { this.pre(); break; }
    case "fsh" : { this.recall(); break; }
    case "mrk" : { this.mark(); break; }
    case "nom" : { this.noMark(); break; }
    case "rfd" : { this.blipCooldown -= PlayerVoxel.BLIP_REFUND_POWER; return true; } /* @TODO: inline to save time */
    default : { return PlayerObject.prototype.effectSwitch.call(this, e); }
  }
};

PlayerVoxel.prototype.timers = function() {
  if(this.chargeTimer > 0) { this.chargeTimer--; this.glow = 1-(this.chargeTimer/PlayerVoxel.FLASH_CHARGE_LENGTH); }
  else { this.glow = 0; }
  if(this.blipCooldown > 0) { this.blipCooldown--; }
  
  /* Not really a timer but we are just updating it here for simplicity */
  var color = this.getColor();
  var dcolor = util.vec3.toVec4((this.team === -1 && this.color === 0 ? util.vec3.make(1, 1, 1) : color), this.markLocation ? 1. : 0.); // Make decal white for default boys.
  this.indicator.setColor(dcolor);
};

PlayerVoxel.prototype.ui = function() {
  this.uiMeters[0].scalar = 1.0-(this.blipCooldown/PlayerVoxel.BLIP_POWER_MAX);
  this.uiMeters[1].scalar = this.markLocation?1:0;
};

PlayerVoxel.prototype.air  = PlayerObject.prototype.air;
PlayerVoxel.prototype.jump = PlayerObject.prototype.jump;
PlayerVoxel.prototype.recover = PlayerObject.prototype.recover;
PlayerVoxel.prototype.recoverJump = PlayerObject.prototype.recoverJump;
PlayerVoxel.prototype.land = PlayerObject.prototype.land;

PlayerVoxel.prototype.stun = function() {
  PlayerObject.prototype.stun.call(this);
  if(this.chargeEffect) { this.chargeEffect.destroy(); this.chargeEffect = undefined; }
  this.chargeTimer = 0;
};

PlayerVoxel.prototype.stunGeneric = PlayerObject.prototype.stunGeneric;
PlayerVoxel.prototype.stunSlash = PlayerObject.prototype.stunSlash;
PlayerVoxel.prototype.stunElectric = PlayerObject.prototype.stunElectric;
PlayerVoxel.prototype.stunFire = PlayerObject.prototype.stunFire;
PlayerVoxel.prototype.criticalHit = PlayerObject.prototype.criticalHit;
PlayerVoxel.prototype.explode = PlayerObject.prototype.explode;
PlayerVoxel.prototype.fall = PlayerObject.prototype.fall;
PlayerVoxel.prototype.toss = PlayerObject.prototype.toss;
PlayerVoxel.prototype.pickup = PlayerObject.prototype.pickup;

PlayerVoxel.prototype.blip = function() {
  this.effects.push(NxFx.box.blip.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.blipCooldown = PlayerVoxel.BLIP_POWER_MAX;
};

PlayerVoxel.prototype.charge = function() {
  this.chargeEffect = NxFx.voxel.charge.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed));
  this.effects.push(this.chargeEffect);
  this.chargeTimer = PlayerVoxel.FLASH_CHARGE_LENGTH;
};

PlayerVoxel.prototype.pre = function() {
  this.game.putEffect(NxFx.voxel.vanish.trigger(this.game, util.vec2.toVec3(this.pos, 0), util.vec3.create()));
};

PlayerVoxel.prototype.recall = function() {
  this.effects.push(NxFx.voxel.recall.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.markLocation = undefined;
  if(this.locationEffect) { this.locationEffect.destroy(); this.locationEffect = undefined; }
};

PlayerVoxel.prototype.mark = function() {
  this.effects.push(NxFx.voxel.mark.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.markLocation = util.vec2.copy(this.pos);
  this.markEffect = NxFx.voxel.location.trigger(this.game, util.vec2.toVec3(this.markLocation, 0), util.vec2.toVec3(this.vel, this.vspeed));
  
  this.indicator.step(util.vec2.toVec3(this.markLocation, 0.), 1.0, 0);
  this.effects.push(this.markEffect);
};

PlayerVoxel.prototype.noMark = function() {
  this.effects.push(NxFx.voxel.no.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
};

PlayerVoxel.prototype.taunt = function() {

};

PlayerVoxel.prototype.setPos = PlayerObject.prototype.setPos;
PlayerVoxel.prototype.setVel = PlayerObject.prototype.setVel;
PlayerVoxel.prototype.setHeight = PlayerObject.prototype.setHeight;

PlayerVoxel.prototype.setLook = PlayerObject.prototype.setLook;
PlayerVoxel.prototype.setSpeed = PlayerObject.prototype.setSpeed;

PlayerVoxel.prototype.getColor = PlayerObject.prototype.getColor;
PlayerVoxel.prototype.getDraw = function(geometry, decals, lights, bounds) {
  PlayerObject.prototype.getDraw.call(this, geometry, decals, lights, bounds);
  if(this.oid === this.game.control) {
    this.indicator.getDraw(decals, bounds);
  }
};

PlayerVoxel.prototype.destroy = PlayerObject.prototype.destroy;

PlayerVoxel.prototype.type = function() { return "vox"; };

/* Permutation dictionary */

/* global PlayerVoxelVoice */
/* global PlayerVoxelRainbow */
/* global PlayerVoxelGold */
/* global PlayerVoxelGreen */
/* global PlayerVoxelBlack */
/* global PlayerVoxelDelta */
PlayerVoxel.classByPermutation = function(perm) {
  switch(perm) {
    case 1 : { return PlayerVoxelVoice; }
    case 2 : { return PlayerVoxelGreen; }
    case 3 : { return PlayerVoxelRainbow; }
    case 4 : { return PlayerVoxelGold; }
    case 5 : { return PlayerVoxelDelta; }
    case 6 : { return PlayerVoxelBlack; }
    default : { return PlayerVoxel; }
  }
};