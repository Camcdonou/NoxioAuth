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
  this.scale = 1.0 + (Math.min(4, Math.max(0, team)) * 0.85);
};

Bumper.prototype.update = function(data) {
  var pos = util.vec2.parse(data.shift());
  var fxUpd = parseInt(data.shift());
  
  this.setPos(pos);
  if(fxUpd) { this.fx(); }
};

Bumper.prototype.fx = function() {
    if(this.scale <= 1.5) { this.game.putEffect(NxFx.map.bumper.trigger(this.game, util.vec2.toVec3(this.pos, 0), util.vec3.create())); }
    else { this.game.putEffect(NxFx.map.bumperBig.trigger(this.game, util.vec2.toVec3(this.pos, 0), util.vec3.create())); }
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
      {name: "scale", data: this.scale}
    ];
    geometry.push({model: this.model, material: this.material, uniforms: bumperUniformData});
  }
};

Bumper.prototype.destroy = function() {
  
};

Bumper.prototype.type = function() { return "bmpr"; };