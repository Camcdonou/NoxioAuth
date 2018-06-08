"use strict";
/* global main */
/* global util */
/* global GameObject */
/* global PlayerObject */
/* global NxFx */

/* Define PlayerCaptain Class */
function PlayerCaptain(game, oid, pos, team, color) {
  PlayerObject.call(this, game, oid, pos, 0, team, color);
  
  this.model = this.game.display.getModel("character.generic.generic");
  this.material = this.game.display.getMaterial("character.captain.captain");
  this.icon = this.game.display.getMaterial("character.captain.ui.iconlarge");
    
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
    
  /* Visual Hitboxes */
  this.hitboxModelA = this.game.display.getModel("multi.hitbox.eqtriY");
  this.hitboxModelB = this.game.display.getModel("multi.hitbox.circle");
  
  /* UI */
  this.uiMeters = [
    {type: "bar", iconMat: this.game.display.getMaterial("character.captain.ui.meterkick"), length: 16, scalar: 1.0},
    {type: "bar", iconMat: this.game.display.getMaterial("character.captain.ui.meterpunch"), length: 14, scalar: 0.0}
  ];
};

  /* Constants */
  PlayerCaptain.PUNCH_COOLDOWN_LENGTH = 45;
  PlayerCaptain.PUNCH_CHARGE_LENGTH = 35;
  PlayerCaptain.KICK_COOLDOWN_LENGTH = 60;
  PlayerCaptain.KICK_LENGTH = 7;
  PlayerCaptain.KICK_RADIUS = 0.55;
  PlayerCaptain.KICK_OFFSET = 0.05;
  PlayerCaptain.PUNCH_HITBOX_SIZE = 0.75;
  PlayerCaptain.PUNCH_HITBOX_OFFSET = 0.5;
  PlayerCaptain.FIRE_COLOR_A = util.vec4.make(1.0, 0.956, 0.490, 1.0);
  PlayerCaptain.FIRE_COLOR_B = util.vec4.make(1.0, 0.654, 0.286, 1.0);
  PlayerCaptain.FIRE_COLOR_C = util.vec4.make(1.0, 0.462, 0.223, 1.0);

PlayerCaptain.prototype.update = PlayerObject.prototype.update;
PlayerCaptain.prototype.parseUpd = PlayerObject.prototype.parseUpd;

PlayerCaptain.prototype.effectSwitch = function(e) {
  switch(e) {
    case "atk" : { this.charge(); break; }
    case "pun" : { this.punch(); break; }
    case "mov" : { this.kick(); break; }
    case "tnt" : { this.taunt(); break; }
    default : { return PlayerObject.prototype.effectSwitch.call(this, e); }
  }
};

PlayerCaptain.prototype.timers = function() {
  if(this.kickActive > 0) { this.kicking(); this.kickActive--; }
  if(this.kickCooldown > 0) { this.kickCooldown--; }
  if(this.chargeTimer > 0) { this.chargeTimer--; }
  if(this.punchCooldown > 0) { this.punchCooldown--; }
  if(this.charging) {
    this.hitboxPos = util.vec2.add(this.pos, util.vec2.scale(this.punchDirection, PlayerCaptain.PUNCH_HITBOX_OFFSET));
    this.hitboxColor = util.vec4.make(0, 1, 0, 0.5);
    this.hitboxScale = PlayerCaptain.PUNCH_HITBOX_SIZE;
    this.hitBoxAngle = (util.vec2.angle(util.vec2.make(1, 0), this.punchDirection)*(this.punchDirection.y>0?-1:1))+(Math.PI*0.5);
    this.drawHitbox = this.hitboxModelA;
  }
};

PlayerCaptain.prototype.ui = function() {
  this.uiMeters[0].scalar = this.kickActive>0?this.kickActive/PlayerCaptain.KICK_LENGTH:1-(this.kickCooldown/(PlayerCaptain.KICK_COOLDOWN_LENGTH-PlayerCaptain.KICK_LENGTH));
  this.uiMeters[1].scalar = this.chargeTimer>0?1-(this.chargeTimer/PlayerCaptain.PUNCH_CHARGE_LENGTH):this.punchCooldown/(PlayerCaptain.PUNCH_COOLDOWN_LENGTH-PlayerCaptain.PUNCH_CHARGE_LENGTH);
};

PlayerCaptain.prototype.air  = PlayerObject.prototype.air;
PlayerCaptain.prototype.jump = PlayerObject.prototype.jump;
PlayerCaptain.prototype.land = PlayerObject.prototype.land;

PlayerCaptain.prototype.stun = function() {
  PlayerObject.prototype.stun.call(this);
  if(this.chargeEffect) { this.chargeEffect.destroy(); this.chargeEffect = undefined; }
  if(this.kickEffect) { this.kickEffect.destroy(); this.kickEffect = undefined; }
  this.charging = false;
  this.chargeTimer = 0;
  this.punchCooldown = 0;
  this.kickActive = 0;
  this.kickCooldown = 0;
};

PlayerCaptain.prototype.stunGeneric = PlayerObject.prototype.stunGeneric;
PlayerCaptain.prototype.stunSlash = PlayerObject.prototype.stunSlash;
PlayerCaptain.prototype.stunElectric = PlayerObject.prototype.stunElectric;
PlayerCaptain.prototype.stunFire = PlayerObject.prototype.stunFire;
PlayerCaptain.prototype.criticalHit = PlayerObject.prototype.criticalHit;
PlayerCaptain.prototype.explode = PlayerObject.prototype.explode;
PlayerCaptain.prototype.fall = PlayerObject.prototype.fall;

PlayerCaptain.prototype.charge = function() {
  this.chargeEffect = NxFx.captain.charge.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed));
  this.effects.push(this.chargeEffect);
  this.charging = true;
  this.chargeTimer = PlayerCaptain.PUNCH_CHARGE_LENGTH;
  this.punchCooldown = PlayerCaptain.PUNCH_COOLDOWN_LENGTH;
  this.punchDirection = this.look;
};

PlayerCaptain.prototype.punch = function() {
  this.effects.push(NxFx.captain.punch.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.charging = false;
  this.hitboxPos = util.vec2.add(this.pos, util.vec2.scale(this.punchDirection, PlayerCaptain.PUNCH_HITBOX_OFFSET));
  this.hitboxColor = util.vec4.make(1, 0, 0, 0.5);
  this.hitboxScale = PlayerCaptain.PUNCH_HITBOX_SIZE;
  this.hitBoxAngle = (util.vec2.angle(util.vec2.make(1, 0), this.punchDirection)*(this.punchDirection.y>0?-1:1))+(Math.PI*0.5);
  this.drawHitbox = this.hitboxModelA;
};

PlayerCaptain.prototype.kick = function() {
  this.kickEffect = NxFx.captain.kick.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed));
  this.effects.push(this.kickEffect);
  this.kickDirection = this.look;
  this.kickActive = PlayerCaptain.KICK_LENGTH;
  this.kickCooldown = PlayerCaptain.KICK_COOLDOWN_LENGTH;
};

PlayerCaptain.prototype.kicking = function() {
  this.hitboxPos = util.vec2.add(this.pos, util.vec2.scale(this.kickDirection, PlayerCaptain.KICK_OFFSET));
  this.hitboxColor = util.vec4.make(1, 0, 0, 0.5);
  this.hitboxScale = PlayerCaptain.KICK_RADIUS;
  this.hitBoxAngle = 0;
  this.drawHitbox = this.hitboxModelB;
};

PlayerCaptain.prototype.taunt = function() {
  
};

PlayerCaptain.prototype.setPos = PlayerObject.prototype.setPos;
PlayerCaptain.prototype.setVel = PlayerObject.prototype.setVel;
PlayerCaptain.prototype.setHeight = PlayerObject.prototype.setHeight;

PlayerCaptain.prototype.setLook = PlayerObject.prototype.setLook;
PlayerCaptain.prototype.setSpeed = PlayerObject.prototype.setSpeed;
PlayerCaptain.prototype.getDraw = PlayerObject.prototype.getDraw;

PlayerCaptain.prototype.destroy = PlayerObject.prototype.destroy;

PlayerCaptain.prototype.type = function() { return "crg"; };

/* Permutation dictionary */
PlayerCaptain.classByPermutation = function(perm) {
  switch(perm) {
    default : { return PlayerCaptain; }
  }
};