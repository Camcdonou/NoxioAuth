"use strict";
/* global main */
/* global util */

/* Define Game UI Game End Message Class */
function EndUI(game, name) {
  this.game = game;
  this.name = name;
  
  this.create("Game Over!");
  
  this.hidden = true;
  this.interactable = false;
}


EndUI.prototype.show = function() {
  this.hidden = false;
};

EndUI.prototype.hide = function() {
  this.hidden = true;
};

EndUI.prototype.create = function(message) {
  var TEXT_MESSAGE = message;
  var FONT_SIZE = 3.0;
  var txtLength = util.text.lengthOnScreen(TEXT_MESSAGE, FONT_SIZE);
  this.blocks = [
    {
      material: this.game.display.getMaterial("ui.grey"),
      pos: {x: 0.0, y: 45.0},
      size: {x: 100.0, y: FONT_SIZE}
    }
  ];
  this.texts = [
    {
      text: TEXT_MESSAGE,
      color: [1.0, 1.0, 1.0],
      pos: {x: 50.0-(txtLength/2), y: 45.0},
      size: FONT_SIZE
    }
  ];
};

EndUI.prototype.getDraw = function(blocks, text, mouse, window) {
  if(this.hidden) { return false; }
  
  for(var i=0;i<this.blocks.length;i++) {
    var block = this.blocks[i];
    blocks.push({material: block.material, pos: block.pos, size: block.size});
  }
  for(var i=0;i<this.texts.length;i++) {
    var txt = this.texts[i];
    text.push({text: txt.text, size: txt.size, color: txt.color, pos: txt.pos});
  }
};

EndUI.prototype.destroy = function() {
  
};