"use strict";
/* global main */
/* global util */
/* global GameObject */
/* global PlayerObject */
/* global NxFx */

/* Define PlayerMarth Class */
function PlayerMarth(game, oid, pos, team, color) {
  PlayerObject.call(this, game, oid, pos, 0, team, color);
  
  this.model = this.game.display.getModel("character.generic.generic");
  this.material = this.game.display.getMaterial("character.marth.marth");
  this.icon = this.game.display.getMaterial("character.marth.ui.iconlarge");
  
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
    {type: "dbr", iconMat: this.game.display.getMaterial("character.marth.ui.meterslash"), length: 16, scalara: 1.0, scalarb: 1.0},
    {type: "bcc", iconMat: this.game.display.getMaterial("character.marth.ui.metercounter"), length: 14, scalar: 0.0, count: 0, max: PlayerMarth.SLASH_COMBO_LENGTH}
  ];
};

/* Constants */
PlayerMarth.SLASH_COOLDOWN_LENGTH = 20;
PlayerMarth.SLASH_COMBO_LENGTH = 3;
PlayerMarth.SLASH_COMBO_DEGEN = 90;
PlayerMarth.COUNTER_COOLDOWN_LENGTH = 45;
PlayerMarth.COUNTER_ACTIVE_LENGTH = 7;
PlayerMarth.COUNTER_LAG_LENGTH = 30;
PlayerMarth.COLOR_A = util.vec4.make(1.0, 1.0, 1.0, 1.0);
PlayerMarth.COLOR_B = util.vec4.make(0.55, 0.55, 1.0, 1.0);

PlayerMarth.prototype.update = PlayerObject.prototype.update;
PlayerMarth.prototype.parseUpd = function(data) {
  var pos = util.vec2.parse(data.shift());
  var vel = util.vec2.parse(data.shift());
  var height = parseFloat(data.shift());
  var vspeed = parseFloat(data.shift());  
  var look = util.vec2.parse(data.shift());
  var speed = parseFloat(data.shift());
  var name = data.shift();
  var counterDir = util.vec2.parse(data.shift());                               // This field is unique to marth so we have to override parseUpd for him.
  var effects = data.shift().split(",");
  
  this.setPos(pos);
  this.setVel(vel);
  this.setHeight(height, vspeed);
  this.setLook(look);
  this.setSpeed(speed);
  this.name = !name ? undefined : name;
  this.counterDir = counterDir;
  for(var i=0;i<effects.length-1;i++) {
    this.effectSwitch(effects[i]);
  }
};

PlayerMarth.prototype.effectSwitch = function(e) {
  switch(e) {
      case "atk" : { this.slash(); break; }
      case "sht" : { this.slashHit(); break; }
      case "rdy" : { this.ready(); break; }
      case "cmb" : { this.combo(); break; }
      case "cht" : { this.comboHit(); break; }
      case "cnt" : { this.counter(); break; }
      case "rip" : { this.riposte(); break; }
    default : { return PlayerObject.prototype.effectSwitch.call(this, e); }
  }
};

PlayerMarth.prototype.timers = function() {
  if(this.slashCooldown > 0) { this.slashCooldown--; }
  if(this.comboTimer > 0) { this.comboTimer--; }
  else if(this.comboTimer < 1 && this.comboCounter > 0) { this.comboCounter--; this.comboTimer = this.comboCounter>0?PlayerMarth.SLASH_COMBO_DEGEN:0; }
  if(this.counterCooldown > 0) { this.counterCooldown--; }
  if(this.counterTimer > 0) { this.counterTimer--; this.glow = this.counterTimer/PlayerMarth.COUNTER_ACTIVE_LENGTH; }
};

PlayerMarth.prototype.ui = function() {
  this.uiMeters[0].scalara = this.counterTimer>0?0.0:(1.0-(this.counterCooldown/(PlayerMarth.COUNTER_COOLDOWN_LENGTH-PlayerMarth.COUNTER_ACTIVE_LENGTH)));
  this.uiMeters[0].scalarb = this.counterTimer>0?1.0:(1.0-(this.counterCooldown/(PlayerMarth.COUNTER_COOLDOWN_LENGTH-PlayerMarth.COUNTER_ACTIVE_LENGTH)));
  this.uiMeters[1].count = this.comboCounter;
  this.uiMeters[1].scalar = this.comboTimer/PlayerMarth.SLASH_COMBO_DEGEN;
};

PlayerMarth.prototype.air  = PlayerObject.prototype.air;
PlayerMarth.prototype.jump = PlayerObject.prototype.jump;
PlayerMarth.prototype.land = PlayerObject.prototype.land;

PlayerMarth.prototype.stun = PlayerObject.prototype.stun;
PlayerMarth.prototype.stunGeneric = PlayerObject.prototype.stunGeneric;
PlayerMarth.prototype.stunSlash = PlayerObject.prototype.stunSlash;
PlayerMarth.prototype.stunElectric = PlayerObject.prototype.stunElectric;
PlayerMarth.prototype.stunFire = PlayerObject.prototype.stunFire;
PlayerMarth.prototype.criticalHit = PlayerObject.prototype.criticalHit;
PlayerMarth.prototype.explode = PlayerObject.prototype.explode;
PlayerMarth.prototype.fall = PlayerObject.prototype.fall;

PlayerMarth.prototype.slash = function() {
  this.effects.push(NxFx.marth.light.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.look, 0.0)));
  this.slashCooldown = PlayerMarth.SLASH_COOLDOWN_LENGTH;
};

PlayerMarth.prototype.slashHit = function() {
  this.comboCounter++;
  this.comboTimer = PlayerMarth.SLASH_COMBO_DEGEN;
};

PlayerMarth.prototype.ready = function() {
  this.effects.push(NxFx.marth.combo.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.comboCounter = PlayerMarth.SLASH_COMBO_LENGTH;
};

PlayerMarth.prototype.combo = function() {
  this.effects.push(NxFx.marth.heavy.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.look, 0.0)));
  this.comboCounter = 0;
};

PlayerMarth.prototype.comboHit = function() {
  this.comboCounter++;
  this.comboTimer = PlayerMarth.SLASH_COMBO_DEGEN;
};

PlayerMarth.prototype.counter = function() {
  this.effects.push(NxFx.marth.counter.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)));
  this.counterTimer = PlayerMarth.COUNTER_ACTIVE_LENGTH;
  this.counterCooldown = PlayerMarth.COUNTER_COOLDOWN_LENGTH;
};

PlayerMarth.prototype.riposte = function() {
  this.effects.push(NxFx.marth.riposte.trigger(this.game, util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.counterDir, 0.0)));
  this.counterCooldown = 5;
};

PlayerMarth.prototype.taunt = function() {

};

PlayerMarth.prototype.setPos = PlayerObject.prototype.setPos;
PlayerMarth.prototype.setVel = PlayerObject.prototype.setVel;
PlayerMarth.prototype.setHeight = PlayerObject.prototype.setHeight;

PlayerMarth.prototype.setLook = PlayerObject.prototype.setLook;
PlayerMarth.prototype.setSpeed = PlayerObject.prototype.setSpeed;
PlayerMarth.prototype.getDraw = PlayerObject.prototype.getDraw;

PlayerMarth.prototype.destroy = PlayerObject.prototype.destroy;

PlayerMarth.prototype.type = function() { return "qua"; };

/* Permutation dictionary */
/* global PlayerMarthFire */
/* global PlayerMarthRainbow */
/* global PlayerMarthGold */
/* global PlayerMarthDelta */
PlayerMarth.classByPermutation = function(perm) {
  switch(perm) {
    case 2 : { return PlayerMarthRainbow; }
    case 3 : { return PlayerMarthGold; }
    case 4 : { return PlayerMarthDelta; }
    case 5 : { return PlayerMarthFire; }
    default : { return PlayerMarth; }
  }
};