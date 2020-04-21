"use strict";
/* global main */
/* global util */
/* global GameObject */
/* global PlayerObject */
/* global NxFx */

/* Define PlayerCargo Class */
function PlayerCargo(game, oid, pos, team, color) {
  PlayerObject.call(this, game, oid, pos, 0, team, color);
  
  this.model = this.game.display.getModel("character.generic.generic");
  this.material = this.game.display.getMaterial("character.cargo.cargo");
  this.icon = this.game.display.getMaterial("character.cargo.ui.iconsmall");
    
  /* Settings */
  this.radius = 0.5; this.weight = 1.0; this.friction = 0.725;
  this.moveSpeed = 0.0375; this.jumpHeight = 0.175; this.cullRadius = 1.0;
  
  /* State */
  this.punchDirection = util.vec2.make(1,0);
  this.kickDirection = util.vec2.make(1,0);

  /* Timers */
  this.charging = false;
  this.chargeTimer = 0;
  this.punchCooldown = 0;
  this.kickActive = 0;
  this.kickCooldown = 0;
  
  /* Decal */
  this.indicator = new Decal(this.game, "character.cargo.decal.indicator", util.vec2.toVec3(this.pos, Math.min(this.height, 0.0)), util.vec3.make(0.0, 0.0, 1.0), 1.1, 0, util.vec4.make(1,1,1,1), 0, 0, 0);
  
  /* UI */
  this.uiMeters = [
    {type: "bar", iconMat: this.game.display.getMaterial("character.generic.ui.metera"), length: 16, scalar: 1.0},
    {type: "bar", iconMat: this.game.display.getMaterial("character.generic.ui.meterb"), length: 14, scalar: 0.0}
  ];
};

  /* Constants */
  PlayerCargo.PUNCH_COOLDOWN_LENGTH = 45;
  PlayerCargo.PUNCH_CHARGE_LENGTH = 35;
  PlayerCargo.KICK_COOLDOWN_LENGTH = 60;
  PlayerCargo.KICK_LENGTH = 7;
  PlayerCargo.KICK_RADIUS = 0.55;
  PlayerCargo.KICK_OFFSET = 0.05;
  PlayerCargo.PUNCH_HITBOX_SIZE = 0.65;
  PlayerCargo.PUNCH_HITBOX_OFFSET = 0.5;

PlayerCargo.prototype.update = function(data) {
  PlayerObject.prototype.update.call(this, data);
  
  /* Step Effects */
  if(this.chargeTimer>0) {
    var angle = (util.vec2.angle(util.vec2.make(1, 0), this.punchDirection)*(this.punchDirection.y>0?-1:1))+(Math.PI*0.5);
    this.indicator.step(util.vec2.toVec3(util.vec2.add(this.pos, util.vec2.scale(this.punchDirection, PlayerCargo.PUNCH_HITBOX_OFFSET*1.13)), Math.min(this.height, 0.0)), 1.1, angle);
    if(Math.floor(this.chargeTimer/5)%2) { this.indicator.setColor(util.vec4.make(1, 1, 1, 1)); }
    else { this.indicator.setColor(util.vec4.make(1, 0, 0, 1)); }
  }
};

PlayerCargo.prototype.parseUpd = PlayerObject.prototype.parseUpd;

PlayerCargo.prototype.effectSwitch = function(e) {
  switch(e) {
    case "atk" : { this.charge(); break; }
    case "pun" : { this.punch(); break; }
    case "mov" : { this.kick(); break; }
    case "tnt" : { this.taunt(); break; }
    default : { return PlayerObject.prototype.effectSwitch.call(this, e); }
  }
};

PlayerCargo.prototype.timers = function() {
  if(this.kickActive > 0) { this.kicking(); this.kickActive--; }
  if(this.kickCooldown > 0) { this.kickCooldown--; }
  if(this.chargeTimer > 0) { this.chargeTimer--; }
  if(this.punchCooldown > 0) { this.punchCooldown--; }
  this.glow = this.chargeTimer>0?1-(this.chargeTimer/PlayerCargo.PUNCH_CHARGE_LENGTH):this.punchCooldown/(PlayerCargo.PUNCH_COOLDOWN_LENGTH-PlayerCargo.PUNCH_CHARGE_LENGTH);
};

PlayerCargo.prototype.ui = function() {
  this.uiMeters[0].scalar = this.kickActive>0?this.kickActive/PlayerCargo.KICK_LENGTH:1-(this.kickCooldown/(PlayerCargo.KICK_COOLDOWN_LENGTH-PlayerCargo.KICK_LENGTH));
  this.uiMeters[1].scalar = this.chargeTimer>0?1-(this.chargeTimer/PlayerCargo.PUNCH_CHARGE_LENGTH):this.punchCooldown/(PlayerCargo.PUNCH_COOLDOWN_LENGTH-PlayerCargo.PUNCH_CHARGE_LENGTH);
};

PlayerCargo.prototype.air  = PlayerObject.prototype.air;
PlayerCargo.prototype.jump = PlayerObject.prototype.jump;
PlayerCargo.prototype.land = PlayerObject.prototype.land;

PlayerCargo.prototype.stun = function() {
  PlayerObject.prototype.stun.call(this);
  if(this.chargeEffect) { this.chargeEffect.destroy(); this.chargeEffect = undefined; }
  if(this.kickEffect) { this.kickEffect.destroy(); this.kickEffect = undefined; }
  this.charging = false;
  this.chargeTimer = 0;
  this.punchCooldown = 0;
  this.kickActive = 0;
  this.kickCooldown = 0;
};

PlayerCargo.prototype.stunGeneric = PlayerObject.prototype.stunGeneric;
PlayerCargo.prototype.stunSlash = PlayerObject.prototype.stunSlash;
PlayerCargo.prototype.stunElectric = PlayerObject.prototype.stunElectric;
PlayerCargo.prototype.stunFire = PlayerObject.prototype.stunFire;
PlayerCargo.prototype.criticalHit = PlayerObject.prototype.criticalHit;
PlayerCargo.prototype.explode = PlayerObject.prototype.explode;
PlayerCargo.prototype.fall = PlayerObject.prototype.fall;
PlayerCargo.prototype.toss = PlayerObject.prototype.toss;
PlayerCargo.prototype.pickup = PlayerObject.prototype.pickup;

PlayerCargo.prototype.charge = function() {
  this.chargeEffect = NxFx.cargo.charge.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed));
  this.effects.push(this.chargeEffect);
  this.charging = true;
  this.chargeTimer = PlayerCargo.PUNCH_CHARGE_LENGTH;
  this.punchCooldown = PlayerCargo.PUNCH_COOLDOWN_LENGTH;
  this.punchDirection = this.look;
};

PlayerCargo.prototype.punch = function() {
  this.effects.push(NxFx.cargo.punch.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.punchDirection, 0.0)));
  this.charging = false;
};

PlayerCargo.prototype.kick = function() {
  this.kickEffect = NxFx.cargo.kick.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed));
  this.effects.push(this.kickEffect);
  this.kickDirection = this.look;
  this.kickActive = PlayerCargo.KICK_LENGTH;
  this.kickCooldown = PlayerCargo.KICK_COOLDOWN_LENGTH;
};

PlayerCargo.prototype.kicking = function() {

};

PlayerCargo.prototype.taunt = function() {
  
};

PlayerCargo.prototype.setPos = PlayerObject.prototype.setPos;
PlayerCargo.prototype.setVel = PlayerObject.prototype.setVel;
PlayerCargo.prototype.setHeight = PlayerObject.prototype.setHeight;

PlayerCargo.prototype.setLook = PlayerObject.prototype.setLook;
PlayerCargo.prototype.setSpeed = PlayerObject.prototype.setSpeed;

PlayerCargo.prototype.getColor = PlayerObject.prototype.getColor;
PlayerCargo.prototype.getDraw = function(geometry, decals, lights, bounds) {
  PlayerObject.prototype.getDraw.call(this, geometry, decals, lights, bounds);
  if(this.chargeTimer>0 && !this.hide) {
    this.indicator.getDraw(decals, bounds);
  }
};

PlayerCargo.prototype.destroy = PlayerObject.prototype.destroy;

PlayerCargo.prototype.type = function() { return "crg"; };

/* Permutation dictionary */
/* global PlayerCargoVoice */
/* global PlayerCargoRainbow */
/* global PlayerCargoGold */
/* global PlayerCargoDelta */
PlayerCargo.classByPermutation = function(perm) {
  switch(perm) {
    case 1 : { return PlayerCargoVoice; }
    case 3 : { return PlayerCargoRainbow; }
    case 4 : { return PlayerCargoGold; }
    case 5 : { return PlayerCargoDelta; }
    default : { return PlayerCargo; }
  }
};