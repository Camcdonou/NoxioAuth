"use strict";
/* global Asset */

function Map(display, data) {
  this.pallete = this.loadPallete(display, data.tileSet);
  this.size = {x: data.bounds[0], y: data.bounds[1]};
  this.data = data.map;
  this.collision = data.collision;
};

Map.prototype.loadPallete = function(display, tileList) {
  var pallete = [];
  for(var i=0;i<tileList.length;i++) {
    if(display.gl) { /* @FIXME fallback mode crash prevention */
      var model = display.getModel(tileList[i].model);
      var material = display.getMaterial(tileList[i].material);
      pallete.push({model: model, material: material});
    }
  }
  return pallete;
};

Map.prototype.getDraw = function(geometry, camera) {
  for(var j=0;j<this.size.y;j++) {
    for(var i=0;i<this.size.x;i++) {
      /* @FIXME This is a temp solution for view frustum culling. Very unoptimized and not scalable. */
      if(Math.abs(Math.floor(-camera.pos.x)-i) > 8 || Math.abs(Math.floor(-camera.pos.y)-(this.size.y-j-1)) > 6) { continue; }
      geometry.push({model: this.pallete[this.data[j][i]].model, material: this.pallete[this.data[j][i]].material, pos: {x: i, y: this.size.y-j-1, z: 0.0}, rot: {x: 0.0, y: 0.0, z: 0.0, w: 1.0}});
    }
  }
};