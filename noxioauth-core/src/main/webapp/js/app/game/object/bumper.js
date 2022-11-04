"use strict";
/* global main */
/* global util */
/* global GameObject */
/* global NxFx */

/* Define Bumper Object Class */
function Bumper(game, oid, pos, permutation, team, color) {
  GameObject.call(this, game, oid, pos, permutation, team, color);
  
  this.model = this.game.display.getModel("map.copper.box");
  this.material = this.game.display.getMaterial("map.copper.box");
  
  /* Settings */
  this.cullRadius = 1.0;          // Radius at which to cull this object and all of it's effects.
  
  /* State */
  this.size = util.vec2.make(1, 1);
};

Bumper.prototype.update = function(data) {
  var pos = util.vec2.parse(data.shift());
  var fxUpd = parseInt(data.shift());
  
  this.setPos(pos);
  if(fxUpd) { this.fx(); }
};

Bumper.prototype.fx = function() {
    this.game.putEffect(NxFx.map.bumper.trigger(this.game, util.vec2.toVec3(this.pos, 0), util.vec3.create()));
};

Bumper.prototype.setPos = GameObject.prototype.setPos;
Bumper.prototype.setVel = GameObject.prototype.setVel;
Bumper.prototype.setHeight = GameObject.prototype.setHeight;

Bumper.prototype.getColor = function() {
  return util.kalide.getColorsAuto(3, -1)[0];
};

Bumper.prototype.getDraw = function(geometry, decals, lights, bounds) {
  var exbounds = util.matrix.expandPolygon(bounds, this.cullRadius);
  if(util.intersection.pointPoly(this.pos, exbounds)) {
    var bumperUniformData = [
      {name: "transform", data: [this.pos.x, this.pos.y, 0]},
      {name: "rotation", data: 0},
      {name: "scale", data: 1.25}
    ];
    geometry.push({model: this.model, material: this.material, uniforms: bumperUniformData});
  }
};

Bumper.prototype.destroy = function() {
  
};

Bumper.prototype.type = function() { return "bmpr"; };