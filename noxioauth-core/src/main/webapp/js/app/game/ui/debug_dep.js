"use strict";
/* global main */
/* global util */

/* Define Game UI Debug Log Class */
function DebugUI(game, name) {
  this.game = game;
  this.name = name;
  this.info = [];
  this.update(this.game.display);
  
  this.hidden = true;
  this.interactable = false;
}


DebugUI.prototype.show = function() {
  this.hidden = false;
  this.update(this.game.display);
};

DebugUI.prototype.hide = function() {
  this.hidden = true;
};

DebugUI.prototype.debug = function(info) {
  this.info = info;
  if(!this.hidden) { this.update(this.game.display); }
};

/* Regenerates the ui element when new information comes in. */
DebugUI.prototype.update = function(display) {
  var FONT_SIZE = 1.0;
  var length = 1.0;
  this.texts = [];
  for(var i=0;i<this.info.length;i++) {
    if(util.text.lengthOnScreen(this.info[i], FONT_SIZE) > length) { length = util.text.lengthOnScreen(this.info[i], FONT_SIZE); }
    this.texts.push({
      text: this.info[i],
      size: FONT_SIZE,
      color: [1.0, 1.0, 1.0],
      pos: {x: -length, y: (-i*FONT_SIZE)-FONT_SIZE}
    });
  }
  var msize = this.texts.length*FONT_SIZE;
  this.blocks = [
    {
      material: display.getMaterial("ui.grey"),
      pos: {x: -length, y: -msize},
      size: {x: length, y: msize}
    }
  ];
};

DebugUI.prototype.getDraw = function(blocks, text, mouse, window) {
  if(this.hidden) { return false; }
  
  var align = {x: 100.0, y: 100.0*(window.y/window.x)};
  for(var i=0;i<this.blocks.length;i++) {
    var block = this.blocks[i];
    blocks.push({material: block.material, pos: util.vec2.add(block.pos, align), size: block.size});
  }
  for(var i=0;i<this.texts.length;i++) {
    var txt = this.texts[i];
    text.push({text: txt.text, size: txt.size, color: txt.color, pos: util.vec2.add(txt.pos, align)});
  }
};

DebugUI.prototype.destroy = function() {
  
};