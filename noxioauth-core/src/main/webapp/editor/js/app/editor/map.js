"use strict";
/* global Asset */
/* global util */

function Map(display, data) {
  if(!display.gl) { return; } /* If no GL then no nothing */
  this.name = data.name;
  this.description = data.description;
  this.gametypes = data.gametypes;
  this.pallete = this.loadPallete(display, data.tileSet);
  this.size = {x: data.bounds[0], y: data.bounds[1]};
  this.sky = data.sky;
  this.data = data.map;
  this.CONST_ROT = [
    0.0,
    1.5707963268,
    3.1415926536,
    4.7123889804
  ];
  
  this.collision = data.collision;
  
  this.doodadPallete = this.loadPallete(display, data.doodadPallete);
  this.doodads = data.doodads;
  
  this.spawns = data.spawns;
  
  this.cache = data.cache;
};

/* index 0 is always treated as a blank space. in map files define it as multi.box,multi.default; */
Map.prototype.loadPallete = function(display, palleteData) {
  var pallete = [];
  for(var i=0;i<palleteData.length;i++) {
    var model = display.getModel(palleteData[i].model);
    var material = display.getMaterial(palleteData[i].material);
    pallete.push({model: model, material: material});
  }
  return pallete;
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
    geometry.push({model: this.doodadPallete[this.doodads[i].doodad].model, material: this.doodadPallete[this.doodads[i].doodad].material, uniforms: doodadUniformData});
  }
};