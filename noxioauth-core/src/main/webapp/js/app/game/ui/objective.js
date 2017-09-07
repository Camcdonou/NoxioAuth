"use strict";
/* global main */
/* global util */

/* Define Game UI Objective Icon Class */
function ObjectiveUI(game, name) {
  this.game = game;
  this.name = name;
  
  this.hidden = true;
  this.interactable = false;
}

ObjectiveUI.prototype.show = function() {
  this.hidden = false;
};

ObjectiveUI.prototype.hide = function() {
  this.hidden = true;
};

ObjectiveUI.prototype.update = function(jects, aspect) {
  this.blocks = [];
  this.texts = [];

  var SIZE = 1.0;
  var RADIUS = 6;
  var YASPECT = 50.0*aspect;
  for(var i=0;i<jects.length;i++) {    
    if(util.vec3.distance(jects[i].pos, util.vec3.inverse(this.game.display.camera.pos)) >= RADIUS) {
      var adjust = util.vec3.add(util.vec3.inverse(this.game.display.camera.pos), util.vec3.scale(util.vec3.normalize(util.vec3.subtract(jects[i].pos, util.vec3.inverse(this.game.display.camera.pos))), RADIUS));

      var screenCoord = util.matrix.projection(this.game.window, this.game.display.camera, adjust); // @TODO: CULL OFFSCREEN NAMES!

      this.blocks.push({
        material: this.game.display.getMaterial("material.ui.grey"),
        pos: {x: 50.0-(SIZE/2)+(screenCoord.x*50.0), y: YASPECT+(screenCoord.y*YASPECT)}, // @TODO: Not centered on y axis?
        size: {x: SIZE, y: SIZE}
      });
      this.blocks.push({
        material: jects[i].color==="red"?this.game.display.getMaterial("material.prank.flagIconRed"):this.game.display.getMaterial("material.prank.flagIconBlue"),
        pos: {x: 50.0-(SIZE/2)+(screenCoord.x*50.0), y: YASPECT+(screenCoord.y*YASPECT)}, // @TODO: Not centered on y axis?
        size: {x: SIZE, y: SIZE}
      });
    }
  }
};

ObjectiveUI.prototype.getDraw = function(blocks, text, mouse, window) {
  if(this.hidden) { return false; }
  
  var jects = [];
  for(var i=0;i<this.game.objects.length;i++) {
    if(this.game.objects[i].getType() === "obj.flag" && this.game.objects[i].onBase === 0) { jects.push({color: this.game.objects[i].team===0?"red":"blue", pos: {x: this.game.objects[i].pos.x, y: this.game.objects[i].pos.y, z: this.game.objects[i].height+1.0}}); }
  }
  this.update(jects, window.y/window.x);
  
  for(var i=0;i<this.blocks.length;i++) {
    var block = this.blocks[i];
    blocks.push({material: block.material, pos: block.pos, size: block.size});
  }
  for(var i=0;i<this.texts.length;i++) {
    var txt = this.texts[i];
    text.push({text: txt.text, size: txt.size, color: txt.color, pos: txt.pos});
  }
};

ObjectiveUI.prototype.destroy = function() {
  
};