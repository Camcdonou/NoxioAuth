"use strict";
/* global Asset */
/* global util */

function Map(display, data) {
  if(!display.gl) { return; } /* If no GL then no nothing */
  this.pallete = this.loadPallete(display, data.tileSet);
  this.doodadPallete = this.loadPallete(display, data.doodadSet);
    
  this.size = {x: data.bounds[0], y: data.bounds[1]};
  this.data = data.map;
  this.collision = {floor: data.floor, wall: data.wall};
  this.doodads = data.doodads;
  this.spawns = data.spawns;
};

/* index 0 is always treated as a blank space. in map files define it as undefined,undefined; */
Map.prototype.loadPallete = function(display, tileList) {
  var pallete = [];
  for(var i=0;i<tileList.length;i++) {
    var model = display.getModel(tileList[i].model);
    var material = display.getMaterial(tileList[i].material);
    pallete.push({model: model, material: material});
  }
  return pallete;
};

Map.prototype.getNearWalls = function(pos, radius) {
  return this.collision.wall;
};

Map.prototype.getNearFloors = function(pos, radius) {
  return this.collision.floor;
};


/* Returns all tile model data within the radius of the given position. Used primarily for collecting geometry for decals to draw on to. */
Map.prototype.getGeometryNear = function(pos, radius) {
  var geometry = [];
  for(var j=0;j<this.size.y;j++) {
    for(var i=0;i<this.size.x;i++) {
      if(this.data[j][i] === 0) { continue; }
      if(util.vec2.distance(pos, {x: i, y: j}) > radius+1.42) { continue; } // Hypotnuse of tile + radius of decal
      var tileUniformData = [
        {name: "transform", data: [i, j, 0.0]}
      ];
      geometry.push({model: this.pallete[this.data[j][i]].model, material: this.pallete[this.data[j][i]].material, uniforms: tileUniformData});
    }
  }
  return geometry;
};

/* Collides a line segment starting at pos moving the magnitude of vel against the map collision and returns a result. */
/* Primarily used for particle physics and decals. */
/* Returns collision information object : {intersection: <vec3>, normal: <vec3>} or undefiend if there is no collision */
Map.prototype.collideVec3 = function(pos, vel) {
  var to = util.vec3.add(pos, vel);
  
  var hit;
  for(var i=0;i<this.collision.wall.length&&!hit;i++) {
    hit = util.intersection.polygonLine({a: util.vec3.toVec2(pos), b: to}, this.collision.wall[i]);
  }
  if(hit) {
    return {intersection: util.vec2.toVec3(hit.intersection, to.z), normal: util.vec2.toVec3(hit.normal, 0.0)}; // @TODO: height factor && normal is wrong
  }
  
  var grounded = false;
  for(var i=0;i<this.collision.floor.length;i++) {
    if(util.intersection.pointPoly(to, this.collision.floor[i].v)) { grounded = true; break; } 
  }
  if(to.z <= 0.0 && grounded) { return {intersection: {x: to.x, y: to.y, z: 0.0}, normal: {x: 0.0, y: 0.0, z: 1.0}}; }
  
  return undefined;
};

Map.prototype.getDraw = function(geometry, bounds) {
  for(var j=0;j<this.size.y;j++) {
    for(var i=0;i<this.size.x;i++) {
      if(this.data[j][i] === 0) { continue; }
      if(!util.intersection.pointPoly({x: i, y: j}, bounds)) { continue; }
      var tileUniformData = [
        {name: "transform", data: [i, j, 0.0]}
      ];
      geometry.push({model: this.pallete[this.data[j][i]].model, material: this.pallete[this.data[j][i]].material, uniforms: tileUniformData});
    }
  }
};