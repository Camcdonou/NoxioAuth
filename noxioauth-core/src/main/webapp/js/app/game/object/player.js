"use strict";
/* global main */
/* global util */
/* global GameObject */
/* global PointLight */
/* global ParticleBlip */
/* global ParticleDash */
/* global ParticleStun */
/* global ParticleBloodSplat */
/* global Decal */

/* Define Player Object Class */
function PlayerObject(game, oid, pos, vel) {
  GameObject.call(this, game, oid, pos, vel);
  
  this.model = this.game.display.getModel("model.multi.smallBox");
  this.material = [
    this.game.display.getMaterial("material.multi.default"),
    this.game.display.getMaterial("material.multi.default_red"),
    this.game.display.getMaterial("material.multi.default_blue")
  ];
  
  this.RADIUS = 0.5;               // Collision radius
  this.MAX_SPEED = 0.0375;         // Max movement speed
  this.FRICTION = 0.725;           // Friction Scalar
  this.AIR_DRAG = 0.98;            // Friction Scalar
  this.FATAL_IMPACT_SPEED = 0.175; // Savaged by a wall
  
  this.look = {x: 0.0, y: 1.0};  // Normalized direction player is facing
  this.speed = 0.0;              // Current scalar of max movement speed <0.0 to 1.0>
  this.team = -1;
  
  this.BLIP_COOLDOWN_MAX = 30;
  this.DASH_COOLDOWN_ADD = 30;
  this.DASH_COOLDOWN_MAX = 60;
  this.blipCooldown = 0;
  this.dashCooldown = 0;
  
  this.blipEffect = new Effect([
    {type: "light", class: PointLight, params: ["<vec3 pos>", {r: 0.45, g: 0.5, b: 1.0, a: 1.0}, 3.0], update: function(lit){}, attachment: true, delay: 0, length: 3},
    {type: "light", class: PointLight, params: ["<vec3 pos>", {r: 0.45, g: 0.5, b: 1.0, a: 1.0}, 3.0], update: function(lit){lit.color.a -= 1.0/12.0; lit.rad += 0.1; }, attachment: true, delay: 3, length: 12},
    {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: ["prank/blip.wav", 0.4], update: function(snd){}, attachment: true, delay: 0, length: 33},
    {type: "particle", class: ParticleBlip, params: [this.game, "<vec3 pos>", "<vec3 dir>"], update: function(prt){}, attachment: true, delay: 0, length: 33}
  ]);
  
  this.dashEffect = new Effect([
    {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: ["prank/ata.wav", 0.8], update: function(snd){}, attachment: true, delay: 0, length: 33},
    {type: "light", class: PointLight, params: ["<vec3 pos>", {r: 0.45, g: 0.5, b: 1.0, a: 0.75}, 2.5], update: function(lit){lit.color.a -= 1.0/45.0; lit.rad += 0.05; }, attachment: false, delay: 0, length: 30},
    {type: "particle", class: ParticleDash, params: [this.game, "<vec3 pos>", "<vec3 dir>"], update: function(prt){}, attachment: true, delay: 0, length: 60}
  ]);
  
  this.tauntEffect = new Effect([
    {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: ["prank/cumown.wav", 0.6], update: function(snd){}, attachment: true, delay: 0, length: 33}
  ]);
  
  this.jumpEffect = new Effect([
    {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: ["prank/huf.wav", 0.6], update: function(snd){}, attachment: true, delay: 0, length: 33}
  ]);
  
  this.stunEffect = new Effect([
    {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: ["prank/uheh.wav", 0.8], update: function(snd){}, attachment: true, delay: 0, length: 33},
    {type: "particle", class: ParticleStun, params: [this.game, "<vec3 pos>", "<vec3 dir>"], update: function(prt){}, attachment: true, delay: 0, length: 45}
  ]);
  
  this.bloodEffect = new Effect([
    {type: "particle", class: ParticleBloodSplat, params: [this.game, "<vec3 pos>", "<vec3 dir>"], update: function(prt){}, attachment: true, delay: 0, length: 300},
    {type: "decal", class: Decal, params: [this.game, this.game.display.getMaterial("material.effect.decal.bloodsplat"), "<vec3 pos>", {x: 0.0, y: 0.0, z: 1.0}, 1.5, Math.random()*6.28319], update: function(dcl){}, attachment: false, delay: 0, length: 300}
  ]);
  
  this.impactDeathEffect = new Effect([
    {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: ["prank/gwaa.wav", 0.8], update: function(snd){}, attachment: true, delay: 0, length: 60}
  ]);
  
  this.fallDeathEffect = new Effect([
    {type: "sound", class: this.game.sound, func: this.game.sound.getSpatialSound, params: ["prank/oowaa.wav", 0.8], update: function(snd){}, attachment: true, delay: 0, length: 99}
  ]);
  
  this.effects.push(this.blipEffect); this.effects.push(this.dashEffect); this.effects.push(this.tauntEffect); this.effects.push(this.jumpEffect);
  this.effects.push(this.stunEffect); this.effects.push(this.bloodEffect); this.effects.push(this.impactDeathEffect); this.effects.push(this.fallDeathEffect);
  
  this.targetCircle = new Decal(this.game, this.game.display.getMaterial("material.effect.decal.targetcircle"), util.vec2.toVec3(this.pos, Math.min(this.height, 0.0)), {x: 0.0, y: 0.0, z: 1.0}, 1.1, 0.0);
};

PlayerObject.prototype.update = function(data) {
  var team = parseInt(data.shift());
  var pos = util.vec2.parse(data.shift());
  var vel = util.vec2.parse(data.shift());
  var height = parseFloat(data.shift());
  var vspeed = parseFloat(data.shift());  
  var look = util.vec2.parse(data.shift());
  var speed = parseFloat(data.shift());
  var name = data.shift();
  var effects = data.shift().split(",");
  
  this.team = team;
  this.setPos(pos);
  this.setVel(vel);
  this.setHeight(height, vspeed);
  this.setLook(look);
  this.setSpeed(speed);
  this.name = !name ? undefined : name; 
  for(var i=0;i<effects.length-1;i++) {
    switch(effects[i]) {
      case "jump" : { this.jump(); break; }
      case "blip" : { this.blip(); break; }
      case "dash" : { this.dash(); break; }
      case "taunt" : { this.taunt(); break; }
      case "stun" : { this.stun(); break; }
      default : { break; }
    }
  }
  
  if(this.blipCooldown > 0) { this.blipCooldown--; }
  if(this.dashCooldown > 0) { this.dashCooldown--; }
};

PlayerObject.prototype.step = function(delta) {
  var curmove = util.vec2.add(this.vel, util.vec2.scale(this.look, this.MAX_SPEED*this.speed));
  //var nxtpos = util.vec2.add(this.pos, curmove);
  //var nxtvel = util.vec2.scale(curmove, this.FRICTION);
  var predict = this.predictPhys();
  
  
  this.pos = util.vec2.lerp(this.pos, predict.pos, delta);
  this.vel = util.vec2.lerp(this.vel, predict.vel, delta);
  
  this.targetCircle.move(util.vec2.toVec3(this.pos, Math.min(this.height, 0.0)), 1.1);
  
  this.blipEffect.step(util.vec2.toVec3(this.pos, 0.5+this.height), util.vec2.toVec3(this.vel, 0.0));
  this.dashEffect.step(util.vec2.toVec3(this.pos, 0.5+this.height), util.vec2.toVec3(this.vel, 0.0));
  this.tauntEffect.step(util.vec2.toVec3(this.pos, 0.5+this.height), util.vec2.toVec3(this.vel, 0.0));
  this.stunEffect.step(util.vec2.toVec3(this.pos, 0.75+this.height), util.vec2.toVec3(this.vel, 0.0));
  this.bloodEffect.step(util.vec2.toVec3(this.pos, 0.0+this.height), util.vec2.toVec3(this.vel, 0.0));
};

/* Predicts and returns position and velocity of next game step. This is more or less accurate but far from perfect. */
PlayerObject.prototype.predictPhys = function() {
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
  var speed = util.vec2.add(this.vel, util.vec2.scale(this.look, this.MAX_SPEED*this.speed));
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

/* @FIXME DEBUG GAMEPLAY TEST */
PlayerObject.prototype.jump = function() {
  this.jumpEffect.trigger(util.vec2.toVec3(this.pos, 0.5+this.height), util.vec2.toVec3(this.vel, 0.0));
};

/* @FIXME DEBUG GAMEPLAY TEST */
PlayerObject.prototype.blip = function() {
  this.blipEffect.trigger(util.vec2.toVec3(this.pos, 0.5+this.height), util.vec2.toVec3(this.vel, 0.0));
  this.blipCooldown = this.BLIP_COOLDOWN_MAX;
};

/* @FIXME DEBUG GAMEPLAY TEST */
PlayerObject.prototype.dash = function() {
  this.dashEffect.trigger(util.vec2.toVec3(this.pos, 0.5+this.height), util.vec2.toVec3(this.vel, 0.0));
  this.dashCooldown += this.DASH_COOLDOWN_ADD;
};

/* @FIXME DEBUG GAMEPLAY TEST */
PlayerObject.prototype.taunt = function() {
  this.tauntEffect.trigger(util.vec2.toVec3(this.pos, 0.5+this.height), util.vec2.toVec3(this.vel, 0.0));
};

/* @FIXME DEBUG GAMEPLAY TEST */
PlayerObject.prototype.stun = function() {
  this.stunEffect.trigger(util.vec2.toVec3(this.pos, 0.75+this.height), util.vec2.toVec3(this.vel, 0.0));
};

PlayerObject.prototype.setPos = GameObject.prototype.setPos;
PlayerObject.prototype.setVel = GameObject.prototype.setVel;
PlayerObject.prototype.setHeight = GameObject.prototype.setHeight;

PlayerObject.prototype.setLook = function(look) {
  this.look = look;
};

PlayerObject.prototype.setSpeed = function(speed) {
  this.speed = speed;
};

PlayerObject.prototype.getDraw = function(geometry, decals, lights, bounds) {
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

PlayerObject.prototype.destroy = function() {
  for(var i=0;i<this.effects.length;i++) {
    this.effects[i].destroy();
  }
  if(this.height > -1.0) {
    this.bloodEffect.trigger(util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, 0.0));
    this.impactDeathEffect.trigger(util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, 0.0));
  }
  else { this.fallDeathEffect.trigger(util.vec2.toVec3(this.pos, this.height), util.vec2.toVec3(this.vel, 0.0)); }
};

PlayerObject.prototype.getType = function() {
  return "obj.player";
};