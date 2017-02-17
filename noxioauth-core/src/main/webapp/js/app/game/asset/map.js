"use strict";
/* global Asset */

Asset.prototype.map = {};

/* Private function, for use within this class only. */
Asset.prototype.map.loadPallete = function(display, tileList) {
  var pallete = [];
  for(var i=0;i<tileList.length;i++) {
      var model = display.getModel(tileList[i].model);
      var material = display.getMaterial(tileList[i].material);
      pallete.push({model: model, material: material});
  }
  return pallete;
};

/* Private function, for use within this class only. */
Asset.prototype.map.getDrawFunc = function(geometry) {
  for(var j=0;j<this.size.y;j++) {
    for(var i=0;i<this.size.x;i++) {
      geometry.push({model: this.pallete[this.data[j][i]].model, material: this.pallete[this.data[j][i]].material, pos: {x: i, y: this.size.y-j-1, z: 0.0}, rot: {x: 0.0, y: 0.0, z: 0.0, w: 1.0}});
    }
  }
};

Asset.prototype.map.test = function(display) {
  var tileList = [
    {model: "model.basic.tileFloor", material: "material.multi.default"},
    {model: "model.basic.tileCeiling", material: "material.multi.default"},
    {model: "model.basic.tilePillar", material: "material.multi.default"},
    {model: "model.basic.tilePit", material: "material.multi.default"},
    {model: "model.basic.tileWallN", material: "material.multi.default"},
    {model: "model.basic.tileWallS", material: "material.multi.default"},
    {model: "model.basic.tileWallW", material: "material.multi.default"},
    {model: "model.basic.tileWallE", material: "material.multi.default"},
    {model: "model.basic.tileCornerNW", material: "material.multi.default"},
    {model: "model.basic.tileCornerNE", material: "material.multi.default"},
    {model: "model.basic.tileCornerSW", material: "material.multi.default"},
    {model: "model.basic.tileCornerSE", material: "material.multi.default"},
    {model: "model.basic.tileAlcoveN", material: "material.multi.default"},
    {model: "model.basic.tileAlcoveS", material: "material.multi.default"},
    {model: "model.basic.tileAlcoveW", material: "material.multi.default"},
    {model: "model.basic.tileAlcoveE", material: "material.multi.default"},
    {model: "model.basic.tileTunnelN", material: "material.multi.default"},
    {model: "model.basic.tileTunnelW", material: "material.multi.default"},
    {model: "model.basic.tileFloor", material: "material.test.test1"},
    {model: "model.basic.tileFloor", material: "material.test.test2"},
    {model: "model.basic.tileFloor", material: "material.test.test3"}
  ];
  return {
    pallete: this.loadPallete(display, tileList),
    size: {x: 24, y: 33},
    data: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 8, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 9, 1, 1, 1],
      [1, 1, 1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 1, 1, 1],
      [1, 1, 1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 1, 1, 1],
      [1, 1, 1, 6, 0, 0, 0, 5, 5, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 1, 1, 1],
      [1, 1, 1, 6, 0, 0, 7, 1, 1, 1, 1, 1, 1, 1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 1, 1, 1],
      [1, 1, 1, 6, 0, 0, 7, 1, 1, 1, 1, 1, 1, 1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 1, 1, 1],
      [1, 1, 1, 6, 0, 0, 7, 1, 1, 8, 4, 9, 1, 1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 1, 1, 1],
      [1, 1, 1, 6, 0, 0, 7, 1, 1, 6, 3, 7, 1, 1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 1, 1, 1],
      [1, 1, 1, 6, 0, 0, 7, 1, 1,10, 0,11, 1, 1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 1, 1, 1],
      [1, 1, 1, 6, 0, 0, 7, 1, 1, 1,16, 1, 1, 1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 1, 1, 1],
      [1, 1, 1, 6, 0, 0, 7, 1, 1, 1,16, 1, 1, 1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 1, 1, 1],
      [1, 1, 1, 6, 0, 0, 0, 4, 4, 4, 0, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 1, 1, 1],
      [1, 1, 1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 1, 1, 1],
      [1, 1, 1, 6, 0, 0, 0, 0, 0, 0, 0, 0,18, 0,19, 0,20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 1, 1, 1],
      [1, 1, 1, 6, 0, 0, 0, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 1, 1, 1],
      [1, 1, 1, 6, 0, 0, 7, 1, 1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 1, 1, 1],
      [1, 1, 1, 6, 0, 0, 7, 1, 1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 1, 1, 1],
      [1, 1, 1, 6, 0, 0, 7, 1, 1, 6, 0, 2, 0, 2, 0, 2, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 1, 1, 1],
      [1, 1, 1, 6, 0, 0, 7, 1, 1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 1, 1, 1],
      [1, 1, 1, 6, 0, 0, 7, 1, 1,10, 5, 5, 5, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 1, 1, 1],
      [1, 1, 1, 6, 0, 0, 7, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 1, 1, 1],
      [1, 1, 1, 6, 0, 0, 7, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 1, 1, 1],
      [1, 1, 1, 6, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 1, 1, 1],
      [1, 1, 1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 1, 1, 1],
      [1, 1, 1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 1, 1, 1],
      [1, 1, 1,10, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 0, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,11, 1, 1, 1],
      [1, 1, 1, 1, 1,13, 1,13, 1,13, 1,13, 1,13, 1,13, 1,13, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    getDraw: this.getDrawFunc
  };
};