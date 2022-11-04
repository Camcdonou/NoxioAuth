"use strict";
/* global main */
/* global util */
/* global GameObject */
/* global NxFx */

/* Define Telepoter Exit Object Class */
function Void(game, oid, pos, permutation, team, color) {
  GameObject.call(this, game, oid, pos, permutation, team, color);
  
  this.model = this.game.display.getModel("map.tin.orb");
  this.material = this.game.display.getMaterial("map.tin.orb");
  
  /* Settings */
  this.cullRadius = 1.0;          // Radius at which to cull this object and all of it's effects.
  
  /* State */
  this.size = util.vec2.make(1, 1);
};

Void.prototype.update = function(data) {
  var pos = util.vec2.parse(data.shift());
  var fxUpd = parseInt(data.shift());
  
  this.setPos(pos);
  if(fxUpd) { this.fx(); }
};

Void.prototype.fx = function() {
  this.game.putEffect(NxFx.map.voided.trigger(this.game, util.vec2.toVec3(this.pos, 0), util.vec3.create()));
};

Void.prototype.setPos = GameObject.prototype.setPos;
Void.prototype.setVel = GameObject.prototype.setVel;
Void.prototype.setHeight = GameObject.prototype.setHeight;

Void.prototype.getColor = function() {
  return util.kalide.getColorsAuto(3, -1)[0];
};

Void.prototype.getDraw = function(geometry, decals, lights, bounds) {
  var exbounds = util.matrix.expandPolygon(bounds, this.cullRadius);
  if(util.intersection.pointPoly(this.pos, exbounds)) {
    var teleUniformData = [
      {name: "transform", data: [this.pos.x, this.pos.y, 0]},
      {name: "rotation", data: 0},
      {name: "scale", data: 1.5}
    ];
    geometry.push({model: this.model, material: this.material, uniforms: teleUniformData});
  }
};

Void.prototype.destroy = function() {
  
};

Void.prototype.type = function() { return "void"; };