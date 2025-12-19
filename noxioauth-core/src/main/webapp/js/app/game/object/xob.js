"use strict";
/* global main */
/* global util */
/* global GameObject */
/* global PlayerObject */
/* global NxFx */

/* Define PlayerXob Class */
function PlayerXob(game, oid, pos, team, color) {
  PlayerObject.call(this, game, oid, pos, 0, team, color);
  
  this.model = this.game.display.getModel("character.generic.generic");
  this.material = this.game.display.getMaterial("character.xob.xob");
  this.icon = this.game.display.getMaterial("character.xob.ui.iconsmall");
  
  /* Settings */
  this.radius = 0.5; this.weight = 1.0; this.friction = 0.725;
  this.moveSpeed = 0.0375; this.jumpHeight = 0.175; this.cullRadius = 1.0;
  
  /* State */
  this.doRewind = false;
  this.rewindHistory = {};
  for(var i=0;i<PlayerXob.REWIND_LENGTH;i++) {
    this.rewindHistory[i] = this.pos;
  }

  /* Timers */
  this.blipCooldown = 0;
  this.rewindCooldown = 0;
  this.rewindDelay = 0;
  
  /* Decal */
  this.indicator = new Decal(this.game, "character.xob.decal.rewindpoint", util.vec2.toVec3(this.pos, Math.min(this.height, 0.)), util.vec3.make(0.0, 0.0, 1.0), 1.0, 0, util.vec4.make(1,1,1,0), 0, 0, 0);
  
  /* UI */
  this.uiMeters = [
    {type: "bar", iconMat: this.game.display.getMaterial("character.generic.ui.metera"), length: 16, scalar: 1.0},
    {type: "bar", iconMat: this.game.display.getMaterial("character.generic.ui.meterb"), length: 14, scalar: 1.0}
  ];
};

/* Constants */
PlayerXob.BLIP_POWER_MAX = 27;
PlayerXob.BLIP_REFUND_POWER = 5;
PlayerXob.REWIND_POWER_ADD = 40;
PlayerXob.REWIND_POWER_MAX = 60;
PlayerXob.REWIND_LENGTH = 40;
PlayerXob.REWIND_DELAY = 4;
PlayerXob.BLIP_COLOR_A = util.vec4.lerp(util.vec4.make(0.6666, 0.9058, 1.0, 1.0), util.vec4.make(1,1,1,1), 0.5);
PlayerXob.BLIP_COLOR_B = util.vec4.make(0.4, 0.5450, 1.0, 1.0);

PlayerXob.prototype.update = PlayerObject.prototype.update;
PlayerXob.prototype.parseUpd = PlayerObject.prototype.parseUpd;

PlayerXob.prototype.effectSwitch = function(e) {
  switch(e) {
    case "atk" : { this.blip(); return true; }
    case "glo" : { this.glo(); return true; }
    case "pre" : { this.pre(); return true; }
    case "mov" : { this.rewind(); return true; }
    case "rfd" : { this.blipCooldown -= PlayerXob.BLIP_REFUND_POWER; return true; } /* @TODO: inline to save time */
    default : { return PlayerObject.prototype.effectSwitch.call(this, e); }
  }
};

PlayerXob.prototype.timers = function() {
  if(this.blipCooldown > 0) { this.blipCooldown--; }
  if(this.rewindCooldown > 0) { this.rewindCooldown--; }
  if(this.doRewind && this.rewindDelay <= PlayerXob.REWIND_DELAY) { this.rewindDelay++; }
  else if(this.doRewind) { this.doRewind = false; }
  else if(!this.doRewind && this.rewindDelay > 0) { this.rewindDelay--; }
  
  if(this.rewindDelay > 0) { this.glow = 1.-(this.rewindDelay/PlayerXob.REWIND_DELAY); }
  else { this.glow = 0; }
  
  // Not really a timer but we are doing it's updates on timer call for simplicity
  var roll = [this.pos];
  for(var i=0;i<PlayerXob.REWIND_LENGTH-1;i++) {
    roll[i+1] = this.rewindHistory[i];
  }
  this.rewindHistory = roll;
  
  var color = this.getColor();
  var dcolor = util.vec3.toVec4((this.team === -1 && this.color === 0 ? util.vec3.make(1, 1, 1) : color), 1.); // Make decal white for default boys.
  
  this.indicator.step(util.vec2.toVec3(this.rewindHistory[PlayerXob.REWIND_LENGTH-1], 0.), 1.0, 0);
  this.indicator.setColor(dcolor);
};

PlayerXob.prototype.ui = function() {
  this.uiMeters[0].scalar = 1.0-(this.blipCooldown/PlayerXob.BLIP_POWER_MAX);
  this.uiMeters[1].scalar = Math.max(0, 1.0-(this.rewindCooldown/PlayerXob.REWIND_POWER_MAX));
};

PlayerXob.prototype.air  = PlayerObject.prototype.air;
PlayerXob.prototype.jump = PlayerObject.prototype.jump;
PlayerXob.prototype.recover = PlayerObject.prototype.recover;
PlayerXob.prototype.recoverJump = PlayerObject.prototype.recoverJump;
PlayerXob.prototype.land = PlayerObject.prototype.land;

PlayerXob.prototype.stun = function() {
  PlayerObject.prototype.stun.call(this);
  this.doRewind = false;
  this.rewindDelay = 0;
};
PlayerXob.prototype.stunGeneric = PlayerObject.prototype.stunGeneric;
PlayerXob.prototype.stunSlash = PlayerObject.prototype.stunSlash;
PlayerXob.prototype.stunElectric = PlayerObject.prototype.stunElectric;
PlayerXob.prototype.stunFire = PlayerObject.prototype.stunFire;
PlayerXob.prototype.criticalHit = PlayerObject.prototype.criticalHit;
PlayerXob.prototype.explode = PlayerObject.prototype.explode;
PlayerXob.prototype.fall = PlayerObject.prototype.fall;PlayerXob.prototype.recoverJump = PlayerObject.prototype.recoverJump;
PlayerXob.prototype.toss = PlayerObject.prototype.toss;
PlayerXob.prototype.pickup = PlayerObject.prototype.pickup;

PlayerXob.prototype.blip = function() {
  this.effects.push(NxFx.box.blip.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.blipCooldown = PlayerXob.BLIP_POWER_MAX;
};

PlayerXob.prototype.glo = function() {
  this.effects.push(NxFx.xob.charge.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.doRewind = true;
};

PlayerXob.prototype.pre = function() {
  this.game.putEffect(NxFx.voxel.vanish.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec3.create()));
};

PlayerXob.prototype.rewind = function() {
  this.game.putEffect(NxFx.voxel.vanish.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec3.create()));
  this.rewindCooldown += PlayerXob.REWIND_POWER_ADD;
};

PlayerXob.prototype.taunt = function() {
  
};

PlayerXob.prototype.setPos = PlayerObject.prototype.setPos;
PlayerXob.prototype.setVel = PlayerObject.prototype.setVel;
PlayerXob.prototype.setHeight = PlayerObject.prototype.setHeight;

PlayerXob.prototype.setLook = PlayerObject.prototype.setLook;
PlayerXob.prototype.setSpeed = PlayerObject.prototype.setSpeed;

PlayerXob.prototype.getColor = PlayerObject.prototype.getColor;
PlayerXob.prototype.getDraw = function(geometry, decals, lights, bounds, alpha) {
  PlayerObject.prototype.getDraw.call(this, geometry, decals, lights, bounds, alpha);
  if(this.oid === this.game.control) {
    this.indicator.getDraw(decals, bounds);
  }
};

PlayerXob.prototype.destroy = PlayerObject.prototype.destroy;

PlayerXob.prototype.type = function() { return "xob"; };

/* Permutation dictionary */
PlayerXob.classByPermutation = function(perm) {
  switch(perm) {
    default : { return PlayerXob; }
  }
};