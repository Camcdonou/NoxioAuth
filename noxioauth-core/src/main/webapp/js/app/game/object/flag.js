"use strict";
/* global main */
/* global util */
/* global GameObject */

/* Define Flag Object Class */
function FlagObject(game, oid, pos, vel) {
  GameObject.call(this, game, oid, pos, vel);
  
  this.model = this.game.display.getModel("object.flag.flag");
  this.material = [
    this.game.display.getMaterial("multi.default"),
    this.game.display.getMaterial("multi.default"),
    this.game.display.getMaterial("multi.default")
  ];
  
  this.RADIUS = 0.1;               // Collision radius
  this.CULL_RADIUS = 2.0;          // Radius at which to cull this object and all of it's effects.
  this.FRICTION = 0.725;           // Friction Scalar
  this.AIR_DRAG = 0.98;            // Friction Scalar
  this.FATAL_IMPACT_SPEED = 0.175; // Savaged by a wall

  this.onBase = 1;
  this.team = -1;

  this.targetCircle = new Decal(this.game, this.game.display.getMaterial("character.player.decal.targetcircle"), util.vec2.toVec3(this.pos, Math.min(this.height, 0.0)), {x: 0.0, y: 0.0, z: 1.0}, 0.4, 0.0);
};

FlagObject.prototype.update = function(data) {
  var team = parseInt(data.shift());
  var pos = util.vec2.parse(data.shift());
  var vel = util.vec2.parse(data.shift());
  var height = parseFloat(data.shift());
  var vspeed = parseFloat(data.shift()); 
  var onBase = parseInt(data.shift());
  var effects = data.shift().split(",");
  
  this.team = team;
  this.setPos(pos);
  this.setVel(vel);
  this.setHeight(height, vspeed);
  this.onBase = onBase;
  
  /* Step Effects */
  this.targetCircle.move(util.vec2.toVec3(this.pos, Math.min(this.height, 0.0)), 0.4);
};

FlagObject.prototype.setPos = GameObject.prototype.setPos;
FlagObject.prototype.setVel = GameObject.prototype.setVel;
FlagObject.prototype.setHeight = GameObject.prototype.setHeight;

FlagObject.prototype.getDraw = function(geometry, decals, lights, bounds) {
  var exbounds = util.matrix.expandPolygon(bounds, this.CULL_RADIUS);
  if(util.intersection.pointPoly(this.pos, exbounds)) {
    var playerUniformData = [
      {name: "transform", data: [this.pos.x, this.pos.y, this.height]}
    ];
    geometry.push({model: this.model, material: this.team===0?this.material[1]:this.team===1?this.material[2]:this.material[0], uniforms: playerUniformData});
    for(var i=0;i<this.effects.length;i++) {
      this.effects[i].getDraw(geometry, decals, lights, bounds);
    }
    this.targetCircle.getDraw(decals, bounds);
  }
};

FlagObject.prototype.destroy = function() {
  for(var i=0;i<this.effects.length;i++) {
    this.effects[i].destroy();
  }
};

FlagObject.prototype.getType = function() {
  return "obj.flag";
};