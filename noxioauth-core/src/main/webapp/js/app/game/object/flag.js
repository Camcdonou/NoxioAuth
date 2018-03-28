"use strict";
/* global main */
/* global util */
/* global GameObject */

/* Define Flag Object Class */
function FlagObject(game, oid, pos, permutation, team, color) {
  GameObject.call(this, game, oid, pos, permutation, team, color);
  
  this.model = this.game.display.getModel("object.flag.flag");
  this.material = this.game.display.getMaterial("object.flag.flag");

  /* Settings */
  this.radius = 0.1; this.friction = 0.725;
  this.cullRadius = 3.0;

  /* State */
  this.onBase = 1;                 // 1 -> Flag is on flagstand | 0 -> Flag is not on the flag stand and should draw on hud

  this.targetCircle = new ColorDecal(this.game, this.game.display.getMaterial("object.object.decal.targetcircle"), util.vec2.toVec3(this.pos, Math.min(this.height, 0.0)), {x: 0.0, y: 0.0, z: 1.0}, 0.4, 0.0, util.vec4.make(1,1,1,1));
};

FlagObject.prototype.update = function(data) {
  var pos = util.vec2.parse(data.shift());
  var vel = util.vec2.parse(data.shift());
  var height = parseFloat(data.shift());
  var vspeed = parseFloat(data.shift()); 
  var onBase = parseInt(data.shift());
  var effects = data.shift().split(",");
  
  this.setPos(pos);
  this.setVel(vel);
  this.setHeight(height, vspeed);
  this.onBase = onBase;
  
  /* Step Effects */
  this.targetCircle.move(util.vec2.toVec3(this.pos, Math.min(this.height, 0.0)), 0.4, 0.0);
};

FlagObject.prototype.setPos = GameObject.prototype.setPos;
FlagObject.prototype.setVel = GameObject.prototype.setVel;
FlagObject.prototype.setHeight = GameObject.prototype.setHeight;

FlagObject.prototype.getDraw = function(geometry, decals, lights, bounds) {
  var exbounds = util.matrix.expandPolygon(bounds, this.cullRadius);
  if(util.intersection.pointPoly(this.pos, exbounds)) {
    var color;
    switch(this.team) {
      case  0 : { color = util.vec3.make(0.7539, 0.2421, 0.2421); break; }
      case  1 : { color = util.vec3.make(0.2421, 0.2421, 0.7539); break; }
      default : { color = util.vec3.make(0.5, 0.5, 0.5); break; }
    }
    switch(this.team) {
      case 0  : { this.targetCircle.setColor(util.vec4.make(0.7539, 0.2421, 0.2421, 1)); break; }
      case 1  : { this.targetCircle.setColor(util.vec4.make(0.2421, 0.2421, 0.7539, 1)); break; }
      default : { this.targetCircle.setColor(util.vec4.make(1,1,1,1)); break; }
    }
    
    var flagUniformData = [
      {name: "transform", data: [this.pos.x, this.pos.y, this.height]},
      {name: "color", data: util.vec3.toArray(color)},
      {name: "rotation", data: 0.0},
      {name: "scale", data: 1.0}
    ];
    geometry.push({model: this.model, material: this.material, uniforms: flagUniformData});
    for(var i=0;i<this.effects.length;i++) {
      this.effects[i].effect.getDraw(geometry, decals, lights, bounds);
    }
    this.targetCircle.getDraw(decals, bounds);
  }
};

FlagObject.prototype.destroy = function() {
  for(var i=0;i<this.effects.length;i++) {
    this.effects[i].destroy();
  }
};

FlagObject.prototype.type = function() { return "flg"; };