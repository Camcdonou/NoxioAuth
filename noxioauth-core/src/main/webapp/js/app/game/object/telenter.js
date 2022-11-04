"use strict";
/* global main */
/* global util */
/* global GameObject */
/* global NxFx */

/* Define Telepoter Exit Object Class */
function Telenter(game, oid, pos, permutation, team, color) {
  GameObject.call(this, game, oid, pos, permutation, team, color);
  
  this.model = this.game.display.getModel("multi.square");
  this.material = this.game.display.getMaterial("object.tele.telenter");
  
  /* Settings */
  this.cullRadius = 1.0;          // Radius at which to cull this object and all of it's effects.
  
  /* State */
  this.size = util.vec2.make(1, 1);
};

Telenter.prototype.update = function(data) {
  var pos = util.vec2.parse(data.shift());
  var fxUpd = parseInt(data.shift());
  
  this.setPos(pos);
  if(fxUpd) { this.fx(); }
};

Telenter.prototype.fx = function() {
    this.game.putEffect(NxFx.map.telenter.trigger(this.game, util.vec2.toVec3(this.pos, 0), util.vec3.create()));
};

Telenter.prototype.setPos = GameObject.prototype.setPos;
Telenter.prototype.setVel = GameObject.prototype.setVel;
Telenter.prototype.setHeight = GameObject.prototype.setHeight;

Telenter.prototype.getColor = function() {
  return util.kalide.getColorsAuto(3, -1)[0];
};

Telenter.prototype.getDraw = function(geometry, decals, lights, bounds) {
  var exbounds = util.matrix.expandPolygon(bounds, this.cullRadius);
  if(util.intersection.pointPoly(this.pos, exbounds)) {
    var teleUniformData = [
      {name: "transform", data: [this.pos.x, this.pos.y, 0.05]},
      {name: "scale", data: [0.75, 0.75, 0.75]},
      {name: "color", data: [1,1,1]}
    ];
    geometry.push({model: this.model, material: this.material, uniforms: teleUniformData});
  }
};

Telenter.prototype.destroy = function() {
  
};

Telenter.prototype.type = function() { return "teln"; };