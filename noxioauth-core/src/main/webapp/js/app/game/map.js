"use strict";
/* global Asset */
/* global util */

function Map(display, data) {
  if(!display.gl) { return; } /* If no GL then no nothing */
  this.pallete = this.loadPallete(display, data.tileSet);
  this.size = {x: data.bounds[0], y: data.bounds[1]};
  this.data = data.map;
  this.collision = data.collision;
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