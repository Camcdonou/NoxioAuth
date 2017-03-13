"use strict";
/* global main */
/* global util */
/* global GameObject */
/* global PointLight */
/* global Particle */

/* Define Player Object Class */
function PlayerObject(game, oid, pos, vel) {
  this.game = game;
  
  this.oid = oid;
  this.pos = pos;
  this.vel = vel;
  
  this.model = this.game.display.getModel("model.multi.box");
  this.material = this.game.display.getMaterial("material.multi.default");
  
  this.debugEffect = new Effect([ /* @FIXME set class var as new Light might be hype? */
    {type: "light", class: PointLight, params: ["<vec3 pos>", {r: 0.45, g: 0.5, b: 1.0, a: 1.0}, 3.0], update: function(lit){}, attachment: true, delay: 0, length: 7},
    {type: "light", class: PointLight, params: ["<vec3 pos>", {r: 0.35, g: 0.45, b: 0.9, a: 1.0}, 2.0], update: function(lit){}, attachment: true, delay: 7, length: 7},
    {type: "sound", class: this.game.sound, func: this.game.sound.getSound, params: ["audio/prank/blip.wav"], update: function(snd){}, attachment: false, delay: 0, length: 33},
    {type: "particle", class: Particle, params: [this.game, "<vec3 pos>"], update: function(prt){}, attachment: true, delay: 0, length: 14}
  ]);
};

PlayerObject.prototype.setPos = GameObject.prototype.setPos;
PlayerObject.prototype.setVel = GameObject.prototype.setVel;

PlayerObject.prototype.update = function(data) {
  var pos = util.vec2.parse(data.shift());
  var vel = util.vec2.parse(data.shift());
  
  this.setPos(pos);
  this.setVel(vel);
  
  this.debugEffect.step({x: pos.x, y: pos.y, z: 0.0}, util.vec3.create());
};

PlayerObject.prototype.getDraw = function(geometry, lights, bounds) {
  if(util.intersection.pointPoly(this.pos, bounds)) {
    var pos = {x: this.pos.x, y: this.pos.y, z: 0.0}; /* To Vec3 */
    geometry.push({model: this.model, material: this.material, pos: pos, rot: util.quat.create()});
    this.debugEffect.getDraw(geometry, lights, bounds);
  }
};