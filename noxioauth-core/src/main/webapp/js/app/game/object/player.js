"use strict";
/* global main */
/* global util */
/* global GameObject */
/* global Decal */
/* global ColorDecal */
/* global ParticleAirJump */
/* global ParticleBloodSplat */

/* Define PlayerObject class */
/* PlayerObject is an abstract class and should never actually be created. 
 * Javascript doesn't really have any equivalent to 'abstract' so I'm 
 * just going to remind you that if you instaniate this class I will
 * come find you irl.
 * 
 * This class contains all required base settings and prototype functions
 * that a player object needs. These can (and should) be overidden in most cases.
 * The only thing that the PlayerObject constructor does not default is the 
 * model & material. Be sure you set them in the subclass.
 */
function PlayerObject(game, oid, pos, permutation, team, color) {
  GameObject.call(this, game, oid, pos, permutation, team, color);
  
  this.look = util.vec2.make(0.0, 1.0);  // Normalized direction player is facing
  this.speed = 0.0;                      // Current scalar of max movement speed <0.0 to 1.0>
  
  /* Settings */
  this.radius = 0.5; this.weight = 1.0; this.friction = 0.725;
  this.moveSpeed = 0.0375; this.jumpHeight = 0.175; this.cullRadius = 1.0;
  
  /* State */
  this.glow = 0.0;          // Scalar from 0 to 1, used to shift color to white for things like marths counter
  this.objective = false;   // If this is flagged then this played is considered a gametype "objective" and will be globally visible and marked.

  /* Timers */

  /* Effects */
  this.airEffect = {
    effect: new Effect([
      {type: "particle", class: ParticleAirJump, params: [this.game, "<vec3 pos>", "<vec3 vel>"], update: function(prt){}, attachment: false, delay: 0, length: 30}
    ], false),
    offset: util.vec3.make(0,0,0),
    trigger: PlayerObject.prototype.effectTrigger};
  this.effects.push(this.airEffect);
  
  this.bloodEffect = {
    effect: new Effect([
      {type: "particle", class: ParticleBloodSplat, params: [this.game, "<vec3 pos>", "<vec3 vel>"], update: function(prt){}, attachment: false, delay: 0, length: 300},
      {type: "decal", class: Decal, params: [this.game, this.game.display.getMaterial("character.player.decal.bloodsplat"), "<vec3 pos>", util.vec3.make(0.0, 0.0, 1.0), 1.5, Math.random()*6.28319], update: function(dcl){}, attachment: false, delay: 0, length: 300}
    ], false),
    offset: util.vec3.make(0,0,0.25),
    trigger: PlayerObject.prototype.effectTrigger};
  this.effects.push(this.bloodEffect);
  
  var angle = (util.vec2.angle(util.vec2.make(1, 0), this.look)*(this.look.y>0?-1:1))+(Math.PI*0.5);
  this.targetCircle = new ColorDecal(this.game, this.game.display.getMaterial("character.player.decal.targetcircle"), util.vec2.toVec3(this.pos, Math.min(this.height, 0.0)), util.vec3.make(0.0, 0.0, 1.0), 1.1, angle, util.vec4.make(1,1,1,1));

  /* Visual Hitboxes */
  this.hitboxMat = this.game.display.getMaterial("multi.hitbox.hitbox");
  this.hitboxPos = this.pos;
  this.hitboxColor = util.vec4.make(1, 0, 0, 0.5);
  this.hitboxScale = 1;
  this.hitBoxAngle = 0;
  this.drawHitbox = undefined;
};

PlayerObject.prototype.effectTrigger = function(pos, vel) {
  this.effect.trigger(util.vec3.add(this.offset, pos), vel);
};

PlayerObject.prototype.update = function(data) {
  /* Apply update data to object */
  this.parseUpd(data);
  
  /* Timers */
  this.timers();
  
  /* Step Effects */
  var angle = (util.vec2.angle(util.vec2.make(1, 0), this.look)*(this.look.y>0?-1:1))+(Math.PI*0.5);
  this.targetCircle.move(util.vec2.toVec3(this.pos, Math.min(this.height, 0.0)), 1.1, angle);
  for(var i=0;i<this.effects.length;i++) {
    this.effects[i].effect.step(util.vec3.add(this.effects[i].offset, util.vec2.toVec3(this.pos, this.height)), util.vec2.toVec3(this.vel, this.vspeed));
  }
  
  /* UI */
  this.ui();
};

PlayerObject.prototype.parseUpd = function(data) {
  var pos = util.vec2.parse(data.shift());
  var vel = util.vec2.parse(data.shift());
  var height = parseFloat(data.shift());
  var vspeed = parseFloat(data.shift());  
  var look = util.vec2.parse(data.shift());
  var speed = parseFloat(data.shift());
  var name = data.shift();
  var effects = data.shift().split(",");
  
  this.setPos(pos);
  this.setVel(vel);
  this.setHeight(height, vspeed);
  this.setLook(look);
  this.setSpeed(speed);
  this.name = !name ? undefined : name;
  for(var i=0;i<effects.length-1;i++) {
    this.effectSwitch(effects[i]);
  }
};

PlayerObject.prototype.effectSwitch = function(e) {
  switch(e) {
    case "air" : { this.air(); break; }
    case "jmp" : { this.jump(); break; }
    case "stn" : { this.stun(); break; }
    case "obj" : { this.objective = true; this.color = util.kalide.compressColors(2, 4, 5, 6, 8); break; }
    default : { main.menu.warning.show("Invalid effect value: '" + e + "' @ Player.js :: effectSwitch()"); break; }
  }
};

PlayerObject.prototype.timers = function() { /* Override me daddy~ */ };
PlayerObject.prototype.ui = function() { /* Me too daddy~ */ };

PlayerObject.prototype.air = function() {
  this.airEffect.trigger(util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed));
};

PlayerObject.prototype.jump = function() {
  this.jumpEffect.trigger(util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed));
};

PlayerObject.prototype.stun = function() {
  this.stunEffect.trigger(util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed));
};

PlayerObject.prototype.setPos = GameObject.prototype.setPos;
PlayerObject.prototype.setVel = GameObject.prototype.setVel;
PlayerObject.prototype.setHeight = GameObject.prototype.setHeight;

PlayerObject.prototype.setLook = function(look) {
  this.look = look;
};

PlayerObject.prototype.setSpeed = function(speed) {
  this.speed = speed;
};

PlayerObject.prototype.getDraw = function(geometry, decals, lights, bounds) {
  var exbounds = util.matrix.expandPolygon(bounds, this.cullRadius);
  if(util.intersection.pointPoly(this.pos, exbounds)) {
    var colors, color, dcolor;
    colors = util.kalide.getColorsAuto(this.color, this.team);
    if(colors.length > 1) {
      var ind = Math.floor(this.game.frame/128)%(colors.length);
      color = util.vec3.lerp(colors[ind], colors[ind+1<colors.length?ind+1:0], (this.game.frame%128)/128);
    }
    else { color = colors[0]; }
    dcolor = this.team === -1 && this.color === 0 ? util.vec3.make(1, 1, 1) : color; // Make decal white for default boys.
    color = util.vec3.lerp(color, util.vec3.make(1.0, 1.0, 1.0), this.glow); // Mix that glow in~
    
    this.targetCircle.setColor(util.vec3.toVec4(dcolor, 1));
    
    var playerUniformData = [
      {name: "transform", data: [this.pos.x, this.pos.y, this.height]},
      {name: "color", data: util.vec3.toArray(color)},
      {name: "rotation", data: 0.0},
      {name: "scale", data: 1.0}
    ];
    geometry.push({model: this.model, material: this.material, uniforms: playerUniformData});
    for(var i=0;i<this.effects.length;i++) {
      this.effects[i].effect.getDraw(geometry, decals, lights, bounds);
    }
    this.targetCircle.getDraw(decals, bounds);
    if(this.drawHitbox && this.height > -0.5) {
      var hitboxUniformData = [
        {name: "transform", data: [this.hitboxPos.x, this.hitboxPos.y, 0.01]},
        {name: "scale", data: this.hitboxScale},
        {name: "color", data: util.vec4.toArray(this.hitboxColor)},
        {name: "rotation", data: this.hitBoxAngle}
      ];
      geometry.push({model: this.drawHitbox, material: this.hitboxMat, uniforms: hitboxUniformData});
      this.drawHitbox = undefined;
    }
  }
};

PlayerObject.prototype.destroy = function() {
  for(var i=0;i<this.effects.length;i++) {
    this.effects[i].effect.destroy();
  }
  if(this.height > -1.0) {
    this.bloodEffect.trigger(util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed));
    this.impactDeathEffect.trigger(util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed));
  }
  else { this.fallDeathEffect.trigger(util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, this.vspeed)); }
};

PlayerObject.prototype.type = function() { return "nul"; };