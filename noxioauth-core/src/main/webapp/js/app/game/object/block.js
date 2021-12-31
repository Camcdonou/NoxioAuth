"use strict";
/* global main */
/* global util */
/* global GameObject */
/* global PlayerObject */
/* global NxFx */

/* Define PlayerBlock Class */
function PlayerBlock(game, oid, pos, team, color) {
  PlayerObject.call(this, game, oid, pos, 0, team, color);
  
  this.model = this.game.display.getModel("character.generic.generic");
  this.material = this.game.display.getMaterial("character.block.block");
  this.icon = this.game.display.getMaterial("character.block.ui.iconsmall");
  
  /* Settings */
  this.radius = 0.5; this.weight = 1.0; this.friction = 0.725;
  this.moveSpeed = 0.0375; this.jumpHeight = 0.175; this.cullRadius = 1.0;
  
  /* State */
  this.poundDirection = util.vec2.make(1, 0);

  /* Timers */
  this.restCooldown = 0;
  this.poundCooldown = 0;

  /* UI */
  this.uiMeters = [
    {type: "bar", iconMat: this.game.display.getMaterial("character.generic.ui.metera"), length: 16, scalar: 1.0},
    {type: "bar", iconMat: this.game.display.getMaterial("character.generic.ui.meterb"), length: 14, scalar: 1.0}
  ];
};

/* Constants */
PlayerBlock.REST_SLEEP_LENGTH = 75;
PlayerBlock.REST_REFUND_TIME = 30;
PlayerBlock.POUND_COOLDOWN_LENGTH = 30;
PlayerBlock.POUND_RADIUS = 0.45;
PlayerBlock.POUND_OFFSET = 0.33;
PlayerBlock.REST_LIGHT = util.vec4.make(1.0, 1.0, 1.0, 0.25);
PlayerBlock.COLORA = util.vec4.make(1.0, 1.0, 1.0, 1.0);
PlayerBlock.COLORB = util.vec4.make(1.0, 1.0, 1.0, 0.75);

PlayerBlock.prototype.update = PlayerObject.prototype.update;
PlayerBlock.prototype.parseUpd = PlayerObject.prototype.parseUpd;

PlayerBlock.prototype.effectSwitch = function(e) {
  switch(e) {
    case "atk" : { this.rest(); break; }
    case "rht" : { this.restHit(); break; }
    case "wak" : { this.wake(); break; }
    case "mov" : { this.poundChannel(); break; }
    case "pnd" : { this.poundDash(); break; }
    case "pnh" : { this.pound(); break; }
    case "slp" : { this.poundHit(); break; }
    case "rfd" : { this.restCooldown -= PlayerBlock.REST_REFUND_TIME; return true; } /* @TODO: inline to save time */
    default : { return PlayerObject.prototype.effectSwitch.call(this, e); }
  }
};

PlayerBlock.prototype.timers = function() {
  if(this.restCooldown > 0) { this.restCooldown--; }
  if(this.poundCooldown > 0) { this.poundCooldown--; }
};

PlayerBlock.prototype.ui = function() {
  this.uiMeters[0].scalar = 1.0-(this.restCooldown/PlayerBlock.REST_SLEEP_LENGTH);
  this.uiMeters[1].scalar = 1.0-(this.poundCooldown/PlayerBlock.POUND_COOLDOWN_LENGTH);
};

PlayerBlock.prototype.air  = PlayerObject.prototype.air;
PlayerBlock.prototype.jump = PlayerObject.prototype.jump;
PlayerBlock.prototype.recover = PlayerObject.prototype.recover;
PlayerBlock.prototype.recoverJump = PlayerObject.prototype.recoverJump;
PlayerBlock.prototype.land = PlayerObject.prototype.land;

PlayerBlock.prototype.stun = function() {
  PlayerObject.prototype.stun.call(this);
  if(this.chargeEffect) { this.chargeEffect.destroy(); this.chargeEffect = undefined; }
  if(this.restEffect) { this.restEffect.destroy(); this.restEffect = undefined; }
  this.restCooldown = 0;
};

PlayerBlock.prototype.stunGeneric = PlayerObject.prototype.stunGeneric;
PlayerBlock.prototype.stunSlash = PlayerObject.prototype.stunSlash;
PlayerBlock.prototype.stunElectric = PlayerObject.prototype.stunElectric;
PlayerBlock.prototype.stunFire = PlayerObject.prototype.stunFire;
PlayerBlock.prototype.criticalHit = PlayerObject.prototype.criticalHit;
PlayerBlock.prototype.explode = PlayerObject.prototype.explode;
PlayerBlock.prototype.fall = PlayerObject.prototype.fall;
PlayerBlock.prototype.toss = PlayerObject.prototype.toss;
PlayerBlock.prototype.pickup = PlayerObject.prototype.pickup;

PlayerBlock.prototype.rest = function() {
  this.restEffect = NxFx.block.rest.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed));
  this.effects.push(this.restEffect);
  this.effects.push(NxFx.block.wave.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec3.make(0, 0, 0)));
  this.restCooldown = PlayerBlock.REST_SLEEP_LENGTH;
};

PlayerBlock.prototype.restHit = function() {
  this.effects.push(NxFx.block.shockwave.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec3.make(0, 0, 0)));
};

PlayerBlock.prototype.wake = function() {
  this.effects.push(NxFx.block.wake.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  if(this.restEffect) { this.restEffect.destroy(); this.restEffect = undefined; }
};

PlayerBlock.prototype.poundChannel = function() {
  this.poundCooldown = PlayerBlock.POUND_COOLDOWN_LENGTH;
  this.chargeEffect = NxFx.block.charge.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed));
  this.effects.push(this.chargeEffect);
};

PlayerBlock.prototype.poundDash = function() {
  this.effects.push(NxFx.block.dash.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.poundDirection = this.look;
};

PlayerBlock.prototype.pound = function() {
  this.effects.push(NxFx.block.wave.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(util.vec2.scale(this.poundDirection, PlayerBlock.POUND_OFFSET*2.), 0.1)));
};

PlayerBlock.prototype.poundHit = function() {
  this.effects.push(NxFx.block.slap.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(util.vec2.scale(this.poundDirection, PlayerBlock.POUND_OFFSET*2.), 0.1)));
};

PlayerBlock.prototype.taunt = function() {

};

PlayerBlock.prototype.setPos = PlayerObject.prototype.setPos;
PlayerBlock.prototype.setVel = PlayerObject.prototype.setVel;
PlayerBlock.prototype.setHeight = PlayerObject.prototype.setHeight;

PlayerBlock.prototype.setLook = PlayerObject.prototype.setLook;
PlayerBlock.prototype.setSpeed = PlayerObject.prototype.setSpeed;

PlayerBlock.prototype.getColor = PlayerObject.prototype.getColor;
PlayerBlock.prototype.getDraw = PlayerObject.prototype.getDraw;

PlayerBlock.prototype.destroy = PlayerObject.prototype.destroy;

PlayerBlock.prototype.type = function() { return "blk"; };

/* Permutation dictionary */
/* global PlayerBlockVoice */
/* global PlayerBlockGold */
/* global PlayerBlockRainbow */
/* global PlayerBlockDelta */
/* global PlayerBlockRound */
/* global PlayerBlockWindow */
PlayerBlock.classByPermutation = function(perm) {
  switch(perm) {
    case 1 : { return PlayerBlockVoice; }
    case 2 : { return PlayerBlockRainbow; }
    case 3 : { return PlayerBlockGold; }
    case 4 : { return PlayerBlockDelta; }
    case 5 : { return PlayerBlockRound; }
    case 6 : { return PlayerBlockWindow; }
    default : { return PlayerBlock; }
  }
};