"use strict";
/* global main */
/* global util */
/* global GameObject */

/* Define Bomb Object Class */
function BombObject(game, oid, pos, vel) {
  GameObject.call(this, game, oid, pos, vel);
  
  this.model = this.game.display.getModel("object.bomb.bomb");
  this.material = this.game.display.getMaterial("object.bomb.bomb");
  
  this.RADIUS = 0.1;               // Collision radius
  this.CULL_RADIUS = 1.0;          // Radius at which to cull this object and all of it's effects.
  this.FRICTION = 0.725;           // Friction Scalar
  this.AIR_DRAG = 0.98;            // Friction Scalar
  this.FATAL_IMPACT_SPEED = 0.175; // Savaged by a wall

  this.team = -1;

  //this.targetCircle = new Decal(this.game, this.game.display.getMaterial("character.player.decal.targetcircle"), util.vec2.toVec3(this.pos, Math.min(this.height, 0.0)), {x: 0.0, y: 0.0, z: 1.0}, 0.4, 0.0);
};

BombObject.prototype.update = function(data) {
  var team = parseInt(data.shift());
  var pos = util.vec2.parse(data.shift());
  var vel = util.vec2.parse(data.shift());
  var height = parseFloat(data.shift());
  var vspeed = parseFloat(data.shift()); 
  var effects = data.shift().split(",");
  
  this.team = team;
  this.setPos(pos);
  this.setVel(vel);
  this.setHeight(height, vspeed);
  
  /* Step Effects */
  //this.targetCircle.move(util.vec2.toVec3(this.pos, Math.min(this.height, 0.0)), 0.4);
};

BombObject.prototype.setPos = GameObject.prototype.setPos;
BombObject.prototype.setVel = GameObject.prototype.setVel;
BombObject.prototype.setHeight = GameObject.prototype.setHeight;

BombObject.prototype.getDraw = function(geometry, decals, lights, bounds) {
  var exbounds = util.matrix.expandPolygon(bounds, this.CULL_RADIUS);
  if(util.intersection.pointPoly(this.pos, exbounds)) {
    var color;
    switch(this.team) {
      case  0 : { color = util.vec3.make(0.7539, 0.2421, 0.2421); break; }
      case  1 : { color = util.vec3.make(0.2421, 0.2421, 0.7539); break; }
      default : { color = util.vec3.make(0.5, 0.5, 0.5); break; }
    }
    
    var bombUniformData = [
      {name: "transform", data: [this.pos.x, this.pos.y, this.height]},
      {name: "color", data: util.vec3.toArray(color)}
    ];
    geometry.push({model: this.model, material: this.material, uniforms: bombUniformData});
    for(var i=0;i<this.effects.length;i++) {
      this.effects[i].getDraw(geometry, decals, lights, bounds);
    }
    //this.targetCircle.getDraw(decals, bounds);
  }
};

BombObject.prototype.destroy = function() {
  for(var i=0;i<this.effects.length;i++) {
    this.effects[i].destroy();
  }
};

BombObject.prototype.getType = function() {
  return "obj.bomb";
};