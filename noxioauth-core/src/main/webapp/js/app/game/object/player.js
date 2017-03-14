"use strict";
/* global main */
/* global util */
/* global GameObject */
/* global PointLight */
/* global ParticleBlip */

/* Define Player Object Class */
function PlayerObject(game, oid, pos, vel) {
  GameObject.call(this, game, oid, pos, vel);
  
  this.model = this.game.display.getModel("model.multi.smallBox");
  this.material = this.game.display.getMaterial("material.multi.default");
  
  this.debugEffect = new Effect([ /* @FIXME Sound breaking format... */
    {type: "light", class: PointLight, params: ["<vec3 pos>", {r: 0.45, g: 0.5, b: 1.0, a: 1.0}, 3.0], update: function(lit){}, attachment: true, delay: 0, length: 3},
    {type: "light", class: PointLight, params: ["<vec3 pos>", {r: 0.45, g: 0.5, b: 1.0, a: 1.0}, 3.0], update: function(lit){lit.color.a -= 1.0/12.0; lit.rad += 0.1; }, attachment: true, delay: 3, length: 12},
    {type: "sound", class: this.game.sound, func: this.game.sound.getSound, params: ["prank/blip.wav"], update: function(snd){}, attachment: false, delay: 0, length: 33},
    {type: "particle", class: ParticleBlip, params: [this.game, "<vec3 pos>", "<vec3 dir>"], update: function(prt){}, attachment: true, delay: 0, length: 33}
  ]);
};

PlayerObject.prototype.setPos = GameObject.prototype.setPos;
PlayerObject.prototype.setVel = GameObject.prototype.setVel;

PlayerObject.prototype.update = function(data) {
  var pos = util.vec2.parse(data.shift());
  var vel = util.vec2.parse(data.shift());
  
  this.setPos(pos);
  this.setVel(vel);
  
  this.debugEffect.step(util.vec2.toVec3(this.pos, 1.0), util.vec3.create());
};

PlayerObject.prototype.getDraw = function(geometry, lights, bounds) {
  if(util.intersection.pointPoly(this.pos, bounds)) {
    var playerUniformData = [
      {name: "transform", data: [this.pos.x, this.pos.y, 0.0]}
    ];
    geometry.push({model: this.model, material: this.material, uniforms: playerUniformData});
    this.debugEffect.getDraw(geometry, lights, bounds);
  }
};