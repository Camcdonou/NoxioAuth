"use strict";
/* global main */
/* global util */
/* global GameObject */

/* Define Hill Object Class */
function HillObject(game, oid, pos, permutation, team, color) {
  GameObject.call(this, game, oid, pos, permutation, team, color);
  
  this.model = this.game.display.getModel("object.hill.hill");
  this.material = this.game.display.getMaterial("object.hill.hill");
  
  /* Settings */
  this.cullRadius = 7.0;          // Radius at which to cull this object and all of it's effects.
  
  /* State */
  this.size = util.vec2.make(1, 1);
};

HillObject.prototype.update = function(data) {
  var pos = util.vec2.parse(data.shift());
  var siz = util.vec2.parse(data.shift());
  
  this.setPos(pos);
  this.size = siz;
};

HillObject.prototype.setPos = GameObject.prototype.setPos;
HillObject.prototype.setVel = GameObject.prototype.setVel;
HillObject.prototype.setHeight = GameObject.prototype.setHeight;

HillObject.prototype.getColor = function() {
  return util.kalide.getColorsAuto(3, -1)[0];
};

HillObject.prototype.getDraw = function(geometry, decals, lights, bounds) {
  var exbounds = util.matrix.expandPolygon(bounds, this.cullRadius);
  if(util.intersection.pointPoly(this.pos, exbounds)) {
    var hillUniformData = [
      {name: "transform", data: [this.pos.x, this.pos.y, 0]},
      {name: "scale", data: [this.size.x, this.size.y, 1.0]},
      {name: "color", data: [1,1,1]}
    ];
    geometry.push({model: this.model, material: this.material, uniforms: hillUniformData});
  }
};

HillObject.prototype.destroy = function() {
  
};

HillObject.prototype.type = function() { return "hil"; };