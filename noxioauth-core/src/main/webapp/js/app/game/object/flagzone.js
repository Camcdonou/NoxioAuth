"use strict";
/* global main */
/* global util */
/* global GameObject */

/* Define Flag Zone Object Class */
function FlagZoneObject(game, oid, pos, permutation, team, color) {
  GameObject.call(this, game, oid, pos, permutation, team, color);
  
  this.model = this.game.display.getModel("object.zone.zone");
  this.material = this.game.display.getMaterial("object.zone.zone");
  
  /* Settings */
  this.cullRadius = 7.0;          // Radius at which to cull this object and all of it's effects.
  
  /* State */
  this.size = util.vec2.make(1, 1);
};

FlagZoneObject.prototype.update = function(data) {
  var pos = util.vec2.parse(data.shift());
  var siz = util.vec2.parse(data.shift());
  
  this.setPos(pos);
  this.size = siz;
};

FlagZoneObject.prototype.setPos = GameObject.prototype.setPos;
FlagZoneObject.prototype.setVel = GameObject.prototype.setVel;
FlagZoneObject.prototype.setHeight = GameObject.prototype.setHeight;

FlagZoneObject.prototype.getColor = function() {
  var colors = util.kalide.getColorsAuto(this.color, this.team);
  if(colors.length > 1) {
    var ind = Math.floor(this.game.frame/128)%(colors.length);
    return util.vec3.lerp(colors[ind], colors[ind+1<colors.length?ind+1:0], (this.game.frame%128)/128);
  }
  return colors[0];
};

FlagZoneObject.prototype.getDraw = function(geometry, decals, lights, bounds) {
  var exbounds = util.matrix.expandPolygon(bounds, this.cullRadius);
  if(util.intersection.pointPoly(this.pos, exbounds)) {
    var color = this.getColor();
    
    var zoneUniformData = [
      {name: "transform", data: [this.pos.x, this.pos.y, 0]},
      {name: "scale", data: [this.size.x, this.size.y, 1.0]},
      {name: "color", data: util.vec3.toArray(color)}
    ];
    geometry.push({model: this.model, material: this.material, uniforms: zoneUniformData});
  }
};

FlagZoneObject.prototype.destroy = function() {
  
};

FlagZoneObject.prototype.type = function() { return "flz"; };