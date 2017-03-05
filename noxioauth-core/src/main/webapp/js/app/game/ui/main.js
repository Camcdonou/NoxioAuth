"use strict";
/* global main */
/* global util */

/* Define Game UI Main Menu Class */
function MainUI(display) {
  this.create(display);
}

MainUI.prototype.create = function(display) {
  var containsProto = function(point, window) {
    var ss = util.vec2.multiply(util.vec2.divide(point, window), {x: 100.0, y: 100.0*(window.y/window.x)});
    var align = {x: 0, y: 100.0*(window.y/window.x)};
    var pos = util.vec2.add(this.pos, align);
    ss.y = align.y - ss.y;
    return ss.x >= pos.x &&
           ss.x < pos.x+this.size.x &&
           ss.y >= pos.y &&
           ss.y < pos.y+this.size.y;
  };
  
  this.blocks = [
    {
      neutral: {
        material: display.getMaterial("material.ui.grey"),
        text: [1.0, 1.0, 1.0]
      },
      hover: {
        material: display.getMaterial("material.ui.white"),
        text: [0.5, 0.5, 0.5]
      },
      text: "Muffin Button",
      fontSize: 2.0,
      pos: {x: 0.0, y: -2.0},
      size: {x: 26.0, y: 2.0},
      contains: containsProto,
      click: function() {}
    },
    {
      neutral: {
        material: display.getMaterial("material.ui.grey"),
        text: [1.0, 1.0, 1.0]
      },
      hover: {
        material: display.getMaterial("material.ui.white"),
        text: [0.5, 0.5, 0.5]
      },
      text: "Space Button",
      fontSize: 2.0,
      pos: {x: 0.0, y: -4.0},
      size: {x: 26.0, y: 2.0},
      contains: containsProto,
      click: function() {}
    }
  ];
};

MainUI.prototype.getDraw = function(blocks, text, mouse, window) {
  var align = {x: 0, y: 100.0*(window.y/window.x)};
  
  for(var i=0;i<this.blocks.length;i++) {
    var block = this.blocks[i];
    if(block.contains(mouse, window)) {
      blocks.push({material: block.hover.material, pos: util.vec2.add(block.pos, align), size: block.size});
      text.push({text: block.text, size: block.fontSize, color: block.hover.text, pos: util.vec2.add(block.pos, align)});
    }
    else {
      blocks.push({material: block.neutral.material, pos: util.vec2.add(block.pos, align), size: block.size});
      text.push({text: block.text, size: block.fontSize, color: block.neutral.text, pos: util.vec2.add(block.pos, align)});
    }
  }
};