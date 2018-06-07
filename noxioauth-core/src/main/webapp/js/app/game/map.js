"use strict";
/* global Asset */
/* global util */

function Map(display, data) {
  if(!display.gl) { return; } /* If no GL then no nothing */
  this.size = {x: data.bounds[0], y: data.bounds[1]};
  this.pallete = this.loadPallete(display, data.tileSet);
  this.data = data.map;
  this.CONST_ROT = [
    0.0,
    1.5707963268,
    3.1415926536,
    4.7123889804
  ];

  this.collision = {floor: data.floor, wall: data.wall};
  
  this.doodadPallete = this.loadPallete(display, data.doodadSet);
  this.doodads = data.doodads;
  
  this.spawns = data.spawns;
};

/* index 0 is always treated as a blank space. in map files define it as multi.box,multi.default; */
Map.prototype.loadPallete = function(display, set) {
  var pallete = [];
  for(var i=0;i<set.length;i++) {
    var model = display.getModel(set[i].model);
    var material = display.getMaterial(set[i].material);
    pallete.push({model: model, material: material});
  }
  return pallete;
};

Map.prototype.getCameraDefault = function() {
  for(var i=0;i<this.spawns.length;i++) {
    if(this.spawns[i].type === "camera") { return this.spawns[i].pos; }
  }
  return util.vec2.make(this.size.x*0.5, this.size.y*0.5);
};

Map.prototype.getNearWalls = function(pos, radius) {
  return this.collision.wall; /* @TODO: implement properly */
};

Map.prototype.getNearFloors = function(pos, radius) {
  return this.collision.floor; /* @TODO: implement properly */
};

/* Returns all tile model data within the radius of the given position. Used primarily for collecting geometry for decals to draw on to. */
Map.prototype.getGeometryNear = function(pos, radius) {
  var geometry = [];
  for(var j=0;j<this.size.y;j++) {
    for(var i=0;i<this.size.x;i++) {
      var dat = this.data[j][i];
      if(dat.ind === 0) { continue; }
      if(util.vec2.distance(pos, {x: i, y: j}) > radius+1.42) { continue; } // Hypotnuse of tile + radius of decal
      var tileUniformData = [
        {name: "transform", data: [i, j, 0.0]},
        {name: "rotation", data: this.CONST_ROT[dat.rot]},
        {name: "scale", data: 1.0}
      ];
      geometry.push({model: this.pallete[dat.ind].model, material: this.pallete[dat.ind].material, uniforms: tileUniformData});
    }
  }
  return geometry;
};

/* Collides a line segment starting at pos moving the magnitude of vel against the map collision and returns a result. */
/* Primarily used for particle physics and decals. */
/* Returns collision information object : {intersection: <vec3>, normal: <vec3>, reflect: <vec3>} or undefiend if there is no collision */
Map.prototype.collideVec3 = function(pos, vel) {
  var to = util.vec3.add(pos, vel);
  
  var hit;
  for(var i=0;i<this.collision.wall.length&&!hit;i++) {
    hit = util.intersection.polygonLine({a: util.vec3.toVec2(pos), b: to}, this.collision.wall[i]);
  }
  if(hit) {
    var ihd = util.vec2.normalize(util.vec2.inverse(util.vec2.subtract(hit.intersection, pos))); // Inverse Hit Directino
    var dp = util.vec2.dot(hit.normal, ihd);
    var ref = util.vec2.normalize(util.vec2.subtract(util.vec2.scale(hit.normal, 2*dp), ihd)); // Reflection normal
    return {intersection: util.vec2.toVec3(hit.intersection, to.z), normal: util.vec2.toVec3(hit.normal, 0.0), reflect: util.vec2.toVec3(ref, vel.z)}; // @TODO: height factor && normal is wrong
  }
  
  var grounded = false;
  for(var i=0;i<this.collision.floor.length;i++) {
    if(util.intersection.pointPoly(to, this.collision.floor[i].v)) { grounded = true; break; } 
  }
  if(to.z <= 0.0 && grounded) { return {intersection: {x: to.x, y: to.y, z: 0.0}, normal: {x: 0.0, y: 0.0, z: 1.0}, reflect: util.vec3.normalize(util.vec3.make(vel.x, vel.y, -vel.z))}; }
  
  return undefined;
};

Map.prototype.getDraw = function(geometry, bounds) {
  for(var j=0;j<this.size.y;j++) {
    for(var i=0;i<this.size.x;i++) {
      var dat = this.data[j][i];
      if(dat.ind === 0) { continue; }
      if(!util.intersection.pointPoly({x: i, y: j}, bounds)) { continue; }
      var tileUniformData = [
        {name: "transform", data: [i, j, 0.0]},
        {name: "rotation", data: this.CONST_ROT[dat.rot]},
        {name: "scale", data: 1.0}
      ];
      geometry.push({model: this.pallete[dat.ind].model, material: this.pallete[dat.ind].material, uniforms: tileUniformData});
    }
  }
  for(var i=0;i<this.doodads.length;i++) {
    if(!util.intersection.pointPoly(this.doodads[i].pos, bounds)) { continue; }
    var doodadUniformData = [
      {name: "transform", data: util.vec3.toArray(util.vec3.add(this.doodads[i].pos, util.vec3.make(-0.5, -0.5, 0.0)))},
      {name: "rotation", data: this.doodads[i].rot},
      {name: "scale", data: this.doodads[i].scale}
    ];
    geometry.push({model: this.doodadPallete[this.doodads[i].index].model, material: this.doodadPallete[this.doodads[i].index].material, uniforms: doodadUniformData});
  }
};