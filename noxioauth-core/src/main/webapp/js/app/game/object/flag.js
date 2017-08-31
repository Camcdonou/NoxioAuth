"use strict";
/* global main */
/* global util */
/* global GameObject */

/* Define Flag Object Class */
function FlagObject(game, oid, pos, vel) {
  GameObject.call(this, game, oid, pos, vel);
  
  this.model = this.game.display.getModel("model.multi.flag");
  this.material = [
    this.game.display.getMaterial("material.multi.default"),
    this.game.display.getMaterial("material.multi.default_red"),
    this.game.display.getMaterial("material.multi.default_blue")
  ];
  
  this.RADIUS = 0.1;               // Collision radius
  this.FRICTION = 0.725;           // Friction Scalar
  this.AIR_DRAG = 0.98;            // Friction Scalar
  this.FATAL_IMPACT_SPEED = 0.175; // Savaged by a wall

  this.team = -1;

  this.targetCircle = new Decal(this.game, this.game.display.getMaterial("material.effect.decal.targetcircle"), util.vec2.toVec3(this.pos, Math.min(this.height, 0.0)), {x: 0.0, y: 0.0, z: 1.0}, 0.3, 0.0);
};

FlagObject.prototype.update = function(data) {
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
};

FlagObject.prototype.step = function(delta) {
  var predict = this.predictPhys();
  
  
  this.pos = util.vec2.lerp(this.pos, predict.pos, delta);
  this.vel = util.vec2.lerp(this.vel, predict.vel, delta);
  
  this.targetCircle.move(util.vec2.toVec3(this.pos, Math.min(this.height, 0.0)), 0.3);
};

/* Predicts and returns position and velocity of next game step. This is more or less accurate but far from perfect. */
FlagObject.prototype.predictPhys = function() {
  var collideWalls = function(mov, walls, radius) {
    var hits = [];
    for(var i=0;i<walls.length;i++) {
      var w = walls[i];
      var inst = util.intersection.polygonCircle(mov[0], w, radius);
      if(inst) { hits.push(inst); }
    }
    if(hits.length > 0) {
      var nearest = hits[0];
      for(var i=1;i<hits.length;i++) {
        if(hits[i].dist < nearest.dist) {
          nearest = hits.get(i);
        }
      }
      /* Move to point of impact */
      var corrected = util.vec2.add(nearest.intersection, util.vec2.scale(nearest.normal, radius));
      /* Slide off nearest collision */
      var aoi = 1.0-Math.abs(util.vec2.dot(mov[1], nearest.normal)); // 0.0 is straight into the wall 1.0 is parallel to it
      mov[1]=util.vec2.scale(mov[1], (aoi*0.5)+0.5);
      mov[0]=corrected;
      return 1.0-aoi;
    }
    return 0.0;
  };
  
  /* -- Movement  -- */
  var speed = this.vel;
  var to = util.vec2.add(this.pos, speed);
  var walls = this.game.map.getNearWalls(to, this.RADIUS);
  var floors = this.game.map.getNearFloors(to, this.RADIUS);
  var fatalImpact = false;
  var mov = [to, speed];
  if(util.vec2.magnitude(this.vel) > 0.00001) {
    var aoi;
    for(var i=0;i<5&&aoi!==0.0&&!fatalImpact;i++) {                             // Bound max collision tests to 5 incase of an object being stuck in an area to small for it to fit!
      aoi = Math.max(collideWalls(mov, walls, this.RADIUS), 0.0);
      fatalImpact = Math.min(Math.pow(aoi,2), 0.9)*util.vec2.magnitude(this.vel)>this.FATAL_IMPACT_SPEED;
      for(var j=0;j<walls.length&!fatalImpact;j++) {
        var w = walls[j];
        if(util.intersection.pointPoly(mov[0], w)) {
          fatalImpact=true; break; /* @TODO: Move out of clipped wall for post death effects */
        }
      }
    }
  }
  return {pos: mov[0], vel: util.vec2.scale(mov[1], this.height !== 0.0 ? this.AIR_DRAG : this.FRICTION)};
};

FlagObject.prototype.setPos = GameObject.prototype.setPos;
FlagObject.prototype.setVel = GameObject.prototype.setVel;
FlagObject.prototype.setHeight = GameObject.prototype.setHeight;

FlagObject.prototype.getDraw = function(geometry, decals, lights, bounds) {
  if(util.intersection.pointPoly(this.pos, bounds)) {
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