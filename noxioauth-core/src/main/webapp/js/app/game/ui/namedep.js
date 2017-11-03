"use strict";
/* global main */
/* global util */

/* Define Game UI Nameplate Class */
function NameUI(game, name) {
  this.game = game;
  this.name = name;
  
  this.hidden = true;
  this.interactable = false;
}


NameUI.prototype.show = function() {
  this.hidden = false;
};

NameUI.prototype.hide = function() {
  this.hidden = true;
};

NameUI.prototype.update = function(names, aspect) {
  this.blocks = [];
  this.texts = [];

  var FONT_SIZE = 1.0;
  var YASPECT = 50.0*aspect;
  for(var i=0;i<names.length;i++) {
    var txtLength = util.text.lengthOnScreen(names[i].name, FONT_SIZE);
    var screenCoord = util.matrix.projection(this.game.window, this.game.display.camera, names[i].pos); // @TODO: CULL OFFSCREEN NAMES!
  
    this.blocks.push({
      material: this.game.display.getMaterial("ui.grey"),
      pos: {x: 50.0-(txtLength/2)+(screenCoord.x*50.0), y: YASPECT+(screenCoord.y*YASPECT)},
      size: {x: txtLength, y: FONT_SIZE}
    });

    this.texts.push({
      text: names[i].name,
      color: [1.0, 1.0, 1.0],
      pos: {x: 50.0-(txtLength/2)+(screenCoord.x*50.0), y: YASPECT+(screenCoord.y*YASPECT)},
      size: FONT_SIZE
    });
  }
};

NameUI.prototype.getDraw = function(blocks, text, mouse, window) {
  if(this.hidden) { return false; }
  
  var names = [];
  for(var i=0;i<this.game.objects.length;i++) {
    if(this.game.objects[i].name && !this.game.objects[i].hide) { names.push({name: this.game.objects[i].name, pos: {x: this.game.objects[i].pos.x, y: this.game.objects[i].pos.y, z: this.game.objects[i].height+1.0}}); }
  }
  this.update(names, window.y/window.x);
  
  for(var i=0;i<this.blocks.length;i++) {
    var block = this.blocks[i];
    blocks.push({material: block.material, pos: block.pos, size: block.size});
  }
  for(var i=0;i<this.texts.length;i++) {
    var txt = this.texts[i];
    text.push({text: txt.text, size: txt.size, color: txt.color, pos: txt.pos});
  }
};

NameUI.prototype.destroy = function() {
  
};