"use strict";
/* global main */
/* global util */

/* Define Game UI Respawn Message Class */
function MeterUI(game, name) {
  this.game = game;
  this.name = name;
  
  this.update(this.game.display);
  
  this.blip = 0.0;
  this.dash = 0.0;
  this.speed = 0.0;
  
  this.hidden = true;
  this.interactable = false;
}


MeterUI.prototype.show = function() {
  this.hidden = false;
};

MeterUI.prototype.hide = function() {
  this.hidden = true;
};

MeterUI.prototype.meters = function(blip, dash, speed) {
  this.blip = blip;
  this.dash = dash;
  this.speed = speed;
  this.update(this.game.display);
};

MeterUI.prototype.update = function(display) {
  this.blocks = [
    {
      material: display.getMaterial("ui.grey"),
      pos: {x: 0.0, y: 0.0},
      size: {x: 30.0, y: 2.0}
    },
    {
      material: display.getMaterial("ui.white"),
      pos: {x: 0.0, y: 0.0},
      size: {x: 2.0+(28.0*this.blip), y: 2.0}
    },
    {
      material: display.getMaterial("character.fox.ui.blipIcon"),
      pos: {x: 0.0, y: 0.0},
      size: {x: 2.0, y: 2.0}
    },
    {
      material: display.getMaterial("ui.grey"),
      pos: {x: 0.0, y: 2.0},
      size: {x: 25.0, y: 2.0}
    },
    {
      material: display.getMaterial("ui.white"),
      pos: {x: 0.0, y: 2.0},
      size: {x: 2.0+(23.0*this.dash), y: 2.0}
    },
    {
      material: display.getMaterial("character.fox.ui.dashIcon"),
      pos: {x: 0.0, y: 2.0},
      size: {x: 2.0, y: 2.0}
    }
  ];
  this.texts = [];
};

MeterUI.prototype.getDraw = function(blocks, text, mouse, window) {
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

MeterUI.prototype.destroy = function() {
  
};