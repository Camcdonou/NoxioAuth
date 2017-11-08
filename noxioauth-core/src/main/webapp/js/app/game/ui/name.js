"use strict";
/* global main */
/* global util */
/* global GenericUI */
/* global GenericUIBlock */
/* global GenericUIText */

/* Define Game UI Respawn Menu Class */
function NameUI(game, ui, name) {
  GenericUI.call(this, game, ui, name);
}

NameUI.prototype.setVisible = GenericUI.prototype.setVisible;
NameUI.prototype.show = GenericUI.prototype.show;
NameUI.prototype.hide = GenericUI.prototype.hide;
NameUI.prototype.refresh = function() {
  this.clear();
  
  var parent = this;
  var colorMat = this.game.display.getMaterial("ui.color");           // Basic color material
  var fontMat  = this.game.display.getMaterial("ui.calibri");         // Font material
  var fontName = "Calibri";                                           // Name of this font for text rendering
  
  var black  = util.vec4.make(0.0, 0.0, 0.0, 0.5);
  var swhite = util.vec4.make(1.0, 1.0, 1.0, 1.0);
  
  var container = new UIContainer({x: '+', y: '+'});
  
  var names = [];
  for(var i=0;i<this.game.objects.length;i++) {
    if(this.game.objects[i].name && !this.game.objects[i].hide) {
      names.push({name: this.game.objects[i].name, pos: util.vec2.toVec3(this.game.objects[i].pos, this.game.objects[i].height+0.75)});
    }
  }
  
  var s = 24;
  var o = 8;
  var v = s*0.15;
  
  for(var i=0;i<names.length;i++) {
    var txtLength = util.font.textLength(names[i].name, "Calibri", s);
    var screenCoord = util.matrix.projection(this.game.window, this.game.display.camera, names[i].pos);
    
    var v = s*0.15;

    var TEXT        = names[i].name;
    var TEXT_LENGTH = util.font.textLength(TEXT, fontName, s);
    var w = TEXT_LENGTH + 16;
    
    var x = (((screenCoord.x*0.5)+0.5) * this.game.display.window.width) - (w*0.5);
    var y = ((screenCoord.y*0.5)+0.5) * this.game.display.window.height;
    
    container.add({
      neutral: {
        block: [new GenericUIBlock(util.vec2.make(x,y), util.vec2.make(w,s), black, colorMat)],
        text:  [new GenericUIText(util.vec2.make(x+o,y+v), s, swhite, fontName, fontMat, TEXT)]
      },
      step: function(imp, state, window) { return false; },
      isHovered: false
    });
  }
  
  this.containers.push(container);
};

NameUI.prototype.generate = function() {
  /* Since this is updated ever frame we have all relevant code in this.refresh() */
};

NameUI.prototype.pointInElement = GenericUI.prototype.pointInElement;

NameUI.prototype.step = GenericUI.prototype.step;
NameUI.prototype.getDraw = GenericUI.prototype.getDraw;

NameUI.prototype.clear = GenericUI.prototype.clear;
NameUI.prototype.destroy = GenericUI.prototype.destroy;