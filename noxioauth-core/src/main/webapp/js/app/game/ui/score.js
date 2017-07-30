"use strict";
/* global main */
/* global util */

/* Define Game UI Score Class */
function ScoreUI(game, name) {
  this.game = game;
  this.name = name;
  
  this.update({title: "", description: ""},
  [{name: "", obj: 0, kill: 0, death: 0, sper: 1.0}]);
  
  this.hidden = true;
  this.interactable = false;
}


ScoreUI.prototype.show = function() {
  this.hidden = false;
};

ScoreUI.prototype.hide = function() {
  this.hidden = true;
};

/* Takes score list as follows */
/* title {}     {title: "big text", description: "little text"} 
 * data: [{}]   {name: "butt", obj: <int count>, kill: <int count>, death: <int count>, sper: <float scalar>}
 */
ScoreUI.prototype.update = function(title, data) {
  var display = this.game.display;
  this.blocks = [];
  this.texts = [];
  
  var LINE_HEIGHT = 1.5;
  var LINE_WIDTH = 40.0;
  var XOFF = 30.0;
  var YOFF = 20.0;
  
  this.blocks.push({
    material: display.getMaterial("material.ui.grey"),
    pos: {x: XOFF, y: YOFF},
    size: {x: LINE_WIDTH, y: LINE_HEIGHT}
  });
  this.texts.push({
    text: title.title,
    color: [1.0, 1.0, 1.0],
    pos: {x: XOFF, y: YOFF},
    size: LINE_HEIGHT
  });
  var DESC_LENGTH = util.text.lengthOnScreen(title.description, LINE_HEIGHT*0.5);
  this.texts.push({
    text: title.description,
    color: [1.0, 1.0, 1.0],
    pos: {x: XOFF+LINE_WIDTH-DESC_LENGTH, y: YOFF},
    size: LINE_HEIGHT*0.5
  });
  
  for(var i=0;i<data.length;i++) {
    this.blocks.push({
      material: display.getMaterial("material.ui.grey"),
      pos: {x: XOFF, y: YOFF-(LINE_HEIGHT*(i+1))},
      size: {x: LINE_WIDTH, y: LINE_HEIGHT}
    });
    this.blocks.push({
      material: display.getMaterial("material.ui.white"),
      pos: {x: XOFF, y: YOFF-(LINE_HEIGHT*(i+1))},
      size: {x: LINE_WIDTH*data[i].sper, y: LINE_HEIGHT}
    });
    this.texts.push({
      text: data[i].name,
      color: [1.0, 1.0, 1.0],
      pos: {x: XOFF, y: YOFF-(LINE_HEIGHT*(i+1))},
      size: LINE_HEIGHT
    });
    var SCORE_TEXT = data[i].kill + " / " + data[i].death;
    var SCORE_LENGTH = util.text.lengthOnScreen(SCORE_TEXT, LINE_HEIGHT*0.5);
    this.texts.push({
      text: SCORE_TEXT,
      color: [1.0, 1.0, 1.0],
      pos: {x: XOFF+LINE_WIDTH-SCORE_LENGTH, y: YOFF-(LINE_HEIGHT*(i+1))},
      size: LINE_HEIGHT*0.5
    });
  }
};

ScoreUI.prototype.getDraw = function(blocks, text, mouse, window) {
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

ScoreUI.prototype.destroy = function() {
  
};