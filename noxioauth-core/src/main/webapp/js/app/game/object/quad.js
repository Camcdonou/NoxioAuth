"use strict";
/* global main */
/* global util */
/* global GameObject */
/* global PlayerObject */
/* global NxFx */

/* Define PlayerQuad Class */
function PlayerQuad(game, oid, pos, team, color) {
  PlayerObject.call(this, game, oid, pos, 0, team, color);
  
  this.model = this.game.display.getModel("character.generic.generic");
  this.material = this.game.display.getMaterial("character.quad.quad");
  this.icon = this.game.display.getMaterial("character.quad.ui.iconsmall");
  
  /* Settings */
  this.radius = 0.5; this.weight = 1.0; this.friction = 0.725;
  this.moveSpeed = 0.0375; this.jumpHeight = 0.175; this.cullRadius = 1.0;
  
  /* State */
  this.counterDir = util.vec2.create();

  /* Timers */
  this.slashCooldown = 0;
  this.comboTimer = 0;
  this.comboCounter = 0;
  
  this.counterCooldown = 0;
  this.counterTimer = 0;

  /* UI */
  this.uiMeters = [
    {type: "dbr", iconMat: this.game.display.getMaterial("character.generic.ui.metera"), length: 16, scalara: 1.0, scalarb: 1.0},
    {type: "bcc", iconMat: this.game.display.getMaterial("character.generic.ui.meterb"), length: 14, scalar: 0.0, count: 0, max: PlayerQuad.SLASH_COMBO_LENGTH}
  ];
};

/* Constants */
PlayerQuad.SLASH_COOLDOWN_LENGTH = 25;
PlayerQuad.SLASH_COMBO_LENGTH = 3;
PlayerQuad.SLASH_COMBO_DEGEN = 90;
PlayerQuad.SLASH_REFUND_TIME = 5;
PlayerQuad.COUNTER_COOLDOWN_LENGTH = 50;
PlayerQuad.COUNTER_ACTIVE_LENGTH = 7;
PlayerQuad.COUNTER_LAG_LENGTH = 38;
PlayerQuad.COLOR_A = util.vec4.make(1.0, 1.0, 1.0, 1.0);
PlayerQuad.COLOR_B = util.vec4.make(0.55, 0.55, 1.0, 1.0);

PlayerQuad.prototype.update = PlayerObject.prototype.update;
PlayerQuad.prototype.parseUpd = function(data) {
  var pos = util.vec2.parse(data.shift());
  var vel = util.vec2.parse(data.shift());
  var height = parseFloat(data.shift());
  var vspeed = parseFloat(data.shift());  
  var look = util.vec2.parse(data.shift());
  var speed = parseFloat(data.shift());
  var name = data.shift();
  var counterDir = util.vec2.parse(data.shift());                               // This field is unique to quad so we have to override parseUpd for him.
  var objective = parseInt(data.shift());
  var effects = data.shift().split(",");
  
  this.setPos(pos);
  this.setVel(vel);
  this.setHeight(height, vspeed);
  this.setLook(look);
  this.setSpeed(speed);
  this.name = !name ? undefined : name;
  this.counterDir = counterDir;
  this.objective = objective;
  for(var i=0;i<effects.length-1;i++) {
    this.effectSwitch(effects[i]);
  }
};

PlayerQuad.prototype.effectSwitch = function(e) {
  switch(e) {
      case "atk" : { this.slash(); break; }
      case "sht" : { this.slashHit(); break; }
      case "rdy" : { this.ready(); break; }
      case "cmb" : { this.combo(); break; }
      case "cht" : { this.comboHit(); break; }
      case "cnt" : { this.counter(); break; }
      case "rip" : { this.riposte(); break; }
      case "rht" : { this.riposteHit(); break; }
      case "rfd" : { this.slashCooldown -= PlayerQuad.SLASH_REFUND_TIME; return true; } /* @TODO: inline to save time */
    default : { return PlayerObject.prototype.effectSwitch.call(this, e); }
  }
};

PlayerQuad.prototype.timers = function() {
  if(this.slashCooldown > 0) { this.slashCooldown--; }
  if(this.comboTimer > 0) { this.comboTimer--; }
  else if(this.comboTimer < 1 && this.comboCounter > 0) { this.comboCounter--; this.comboTimer = this.comboCounter>0?PlayerQuad.SLASH_COMBO_DEGEN:0; }
  if(this.counterCooldown > 0) { this.counterCooldown--; }
  if(this.counterTimer > 0) { this.counterTimer--; this.glow = this.counterTimer/PlayerQuad.COUNTER_ACTIVE_LENGTH; }
};

PlayerQuad.prototype.ui = function() {
  this.uiMeters[0].scalara = this.counterTimer>0?0.0:(1.0-(this.counterCooldown/(PlayerQuad.COUNTER_COOLDOWN_LENGTH-PlayerQuad.COUNTER_ACTIVE_LENGTH)));
  this.uiMeters[0].scalarb = this.counterTimer>0?1.0:(1.0-(this.counterCooldown/(PlayerQuad.COUNTER_COOLDOWN_LENGTH-PlayerQuad.COUNTER_ACTIVE_LENGTH)));
  this.uiMeters[1].count = this.comboCounter;
  this.uiMeters[1].scalar = this.comboTimer/PlayerQuad.SLASH_COMBO_DEGEN;
};

PlayerQuad.prototype.air  = PlayerObject.prototype.air;
PlayerQuad.prototype.jump = PlayerObject.prototype.jump;
PlayerQuad.prototype.recover = PlayerObject.prototype.recover;
PlayerQuad.prototype.recoverJump = PlayerObject.prototype.recoverJump;
PlayerQuad.prototype.land = PlayerObject.prototype.land;

PlayerQuad.prototype.stun = PlayerObject.prototype.stun;
PlayerQuad.prototype.stunGeneric = PlayerObject.prototype.stunGeneric;
PlayerQuad.prototype.stunSlash = PlayerObject.prototype.stunSlash;
PlayerQuad.prototype.stunElectric = PlayerObject.prototype.stunElectric;
PlayerQuad.prototype.stunFire = PlayerObject.prototype.stunFire;
PlayerQuad.prototype.criticalHit = PlayerObject.prototype.criticalHit;
PlayerQuad.prototype.explode = PlayerObject.prototype.explode;
PlayerQuad.prototype.fall = PlayerObject.prototype.fall;
PlayerQuad.prototype.toss = PlayerObject.prototype.toss;
PlayerQuad.prototype.pickup = PlayerObject.prototype.pickup;

PlayerQuad.prototype.slash = function() {
  this.effects.push(NxFx.quad.light.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.look, 0.0)));
  this.slashCooldown = PlayerQuad.SLASH_COOLDOWN_LENGTH;
};

PlayerQuad.prototype.slashHit = function() {
  this.comboCounter++;
  this.comboTimer = PlayerQuad.SLASH_COMBO_DEGEN;
};

PlayerQuad.prototype.ready = function() {
  this.effects.push(NxFx.quad.combo.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.comboCounter = PlayerQuad.SLASH_COMBO_LENGTH;
};

PlayerQuad.prototype.combo = function() {
  this.effects.push(NxFx.quad.heavy.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.look, 0.0)));
  this.comboCounter = 0;
};

PlayerQuad.prototype.comboHit = function() {
  this.comboCounter++;
  this.comboTimer = PlayerQuad.SLASH_COMBO_DEGEN;
};

PlayerQuad.prototype.counter = function() {
  this.effects.push(NxFx.quad.counter.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.counterTimer = PlayerQuad.COUNTER_ACTIVE_LENGTH;
  this.counterCooldown = PlayerQuad.COUNTER_COOLDOWN_LENGTH;
};

PlayerQuad.prototype.riposte = function() {
  this.effects.push(NxFx.quad.riposte.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.counterDir, 0.0)));
  this.counterCooldown = 5;
};

PlayerQuad.prototype.riposteHit = function() {
  this.effects.push(NxFx.block.shockwave.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec3.make(0, 0, 0))); // Copied from blocks rest hit
};

PlayerQuad.prototype.taunt = function() {

};

PlayerQuad.prototype.setPos = PlayerObject.prototype.setPos;
PlayerQuad.prototype.setVel = PlayerObject.prototype.setVel;
PlayerQuad.prototype.setHeight = PlayerObject.prototype.setHeight;

PlayerQuad.prototype.setLook = PlayerObject.prototype.setLook;
PlayerQuad.prototype.setSpeed = PlayerObject.prototype.setSpeed;

PlayerQuad.prototype.getColor = PlayerObject.prototype.getColor;
PlayerQuad.prototype.getDraw = PlayerObject.prototype.getDraw;

PlayerQuad.prototype.destroy = PlayerObject.prototype.destroy;

PlayerQuad.prototype.type = function() { return "qua"; };

/* Permutation dictionary */
/* global PlayerQuadVoice */
/* global PlayerQuadFire */
/* global PlayerQuadRainbow */
/* global PlayerQuadGold */
/* global PlayerQuadDelta */
PlayerQuad.classByPermutation = function(perm) {
  switch(perm) {
    case 1 : { return PlayerQuadVoice; }
    case 2 : { return PlayerQuadRainbow; }
    case 3 : { return PlayerQuadGold; }
    case 4 : { return PlayerQuadDelta; }
    case 5 : { return PlayerQuadFire; }
    default : { return PlayerQuad; }
  }
};