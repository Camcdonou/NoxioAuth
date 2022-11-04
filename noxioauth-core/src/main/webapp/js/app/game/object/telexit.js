"use strict";
/* global main */
/* global util */
/* global GameObject */
/* global NxFx */

/* Define Telepoter Exit Object Class */
function Telexit(game, oid, pos, permutation, team, color) {
  GameObject.call(this, game, oid, pos, permutation, team, color);
  
  this.model = this.game.display.getModel("multi.square");
  this.material = this.game.display.getMaterial("object.tele.telexit");
  
  /* Settings */
  this.cullRadius = 1.0;          // Radius at which to cull this object and all of it's effects.
  
  /* State */
  this.size = util.vec2.make(1, 1);
};

Telexit.prototype.update = function(data) {
  var pos = util.vec2.parse(data.shift());
  var fxUpd = parseInt(data.shift());
  
  this.setPos(pos);
  if(fxUpd) { this.fx(); }
};

Telexit.prototype.fx = function() {
    this.game.putEffect(NxFx.map.telexit.trigger(this.game, util.vec2.toVec3(this.pos, 0), util.vec3.create()));
};

Telexit.prototype.setPos = GameObject.prototype.setPos;
Telexit.prototype.setVel = GameObject.prototype.setVel;
Telexit.prototype.setHeight = GameObject.prototype.setHeight;

Telexit.prototype.getColor = function() {
  return util.kalide.getColorsAuto(3, -1)[0];
};

Telexit.prototype.getDraw = function(geometry, decals, lights, bounds) {
  var exbounds = util.matrix.expandPolygon(bounds, this.cullRadius);
  if(util.intersection.pointPoly(this.pos, exbounds)) {
    var teleUniformData = [
      {name: "transform", data: [this.pos.x, this.pos.y, 0.05]},
      {name: "scale", data: [0.6, 0.6, 0.6]},
      {name: "color", data: [1,1,1]}
    ];
    geometry.push({model: this.model, material: this.material, uniforms: teleUniformData});
  }
};

Telexit.prototype.destroy = function() {
  
};

Telexit.prototype.type = function() { return "telx"; };