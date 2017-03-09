"use strict";
/* global main */
/* global util */

/* Define Game UI Message Log Class */
function LogUI(game, name) {
  this.game = game;
  this.name = name;
  this.messages = [];
  this.update(this.game.display);
  
  this.hidden = false;
  this.interactable = false;
}

LogUI.prototype.show = function() {
  this.hidden = false;
  this.update(this.game.display);
};

LogUI.prototype.hide = function() {
  this.hidden = true;
};

LogUI.prototype.message = function(message) {
  this.messages.unshift(message);
  if(!this.hidden) { this.update(this.game.display); }
};

/* Regenerates the ui element when new information comes in. */
LogUI.prototype.update = function(display) {
  var DISPLAY_MAX = 5;
  var FONT_SIZE = 1.0;
  this.texts = [];
  for(var i=0;i<this.messages.length&&i<DISPLAY_MAX;i++) {
    this.texts.push({
      text: this.messages[i],
      size: FONT_SIZE,
      color: [1.0, 1.0, 1.0],
      pos: {x: -33.0, y: (i*FONT_SIZE)}
    });
  }
  var msize = this.texts.length*FONT_SIZE;
  this.blocks = [
    {
      material: display.getMaterial("material.ui.grey"),
      pos: {x: -33.0, y: 0.0},
      size: {x: 33.0, y: msize}
    }
  ];
};

LogUI.prototype.getDraw = function(blocks, text, mouse, window) {
  if(this.hidden) { return false; }
  
  var align = {x: 100.0, y: 0.0};
  for(var i=0;i<this.blocks.length;i++) {
    var block = this.blocks[i];
    blocks.push({material: block.material, pos: util.vec2.add(block.pos, align), size: block.size});
  }
  for(var i=0;i<this.texts.length;i++) {
    var txt = this.texts[i];
    text.push({text: txt.text, size: txt.size, color: txt.color, pos: util.vec2.add(txt.pos, align)});
  }
};

LogUI.prototype.destroy = function() {
  
};