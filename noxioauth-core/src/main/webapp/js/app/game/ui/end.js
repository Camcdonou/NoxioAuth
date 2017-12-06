"use strict";
/* global main */
/* global util */
/* global GenericUI */
/* global GenericUIBlock */
/* global GenericUIText */

/* Define Game UI Respawn Menu Class */
function EndUI(game, ui, name) {
  this.texta = "?? TOP TEXT ??";
  this.textb = "?? BOTTOM TEXT ??";
  GenericUI.call(this, game, ui, name);
}

EndUI.prototype.setTexts = function(title, info) {
  this.texta = title;
  this.textb = info;
  this.clear();
  this.generate();
};

EndUI.prototype.setVisible = GenericUI.prototype.setVisible;
EndUI.prototype.show = GenericUI.prototype.show;
EndUI.prototype.hide = GenericUI.prototype.hide;
EndUI.prototype.refresh = GenericUI.prototype.refresh;

EndUI.prototype.generate = function() {
  var parent = this;
  var colorMat = this.game.display.getMaterial("ui.color");           // Basic color material
  var fontMat  = this.game.display.getMaterial("ui.calibri");         // Font material
  var fontName = "Calibri";                                           // Name of this font for text rendering
  
  var black  = util.vec4.make(0.0, 0.0, 0.0, 0.5);
  var white  = util.vec4.make(1.0, 1.0, 1.0, 0.75);
  var swhite = util.vec4.make(1.0, 1.0, 1.0, 1.0);
  var sblack = util.vec4.make(0.0, 0.0, 0.0, 1.0);
  
  var container = new UIContainer({x: '=', y: '='});
  
  var w = 2048;
  var h = 0;
  var s = 64;
  var v = s*0.15;
  
  var TEXT        = this.texta;
  var TEXT_LENGTH = util.font.textLength(TEXT, fontName, s);
  var o = (w*0.5)-(TEXT_LENGTH*0.5);
  
  this.title = {
    neutral: {
      block: [new GenericUIBlock(util.vec2.make(0,h), util.vec2.make(w,s), swhite, colorMat)],
      text:  [new GenericUIText(util.vec2.make(o,h+v), s, sblack, fontName, fontMat, TEXT)]
    },
    step: function(imp, state, window) { },
    isHovered: false
  };
  container.add(this.title);
  
  s = 32;
  v = s*0.15;
  h -= s+v;
  
  var TEXT        = this.textb;
  var TEXT_LENGTH = util.font.textLength(TEXT, fontName, s);
  var o = (w*0.5)-(TEXT_LENGTH*0.5);
  
  this.info = {
    neutral: {
      block: [new GenericUIBlock(util.vec2.make(0,h), util.vec2.make(w,s), black, colorMat)],
      text:  [new GenericUIText(util.vec2.make(o,h+v), s, swhite, fontName, fontMat, TEXT)]
    },
    step: function(imp, state, window) { },
    isHovered: false
  };
  container.add(this.info);
  
  this.containers.push(container);
};

EndUI.prototype.pointInElement = GenericUI.prototype.pointInElement;

EndUI.prototype.step = GenericUI.prototype.step;
EndUI.prototype.getDraw = GenericUI.prototype.getDraw;

EndUI.prototype.clear = GenericUI.prototype.clear;
EndUI.prototype.destroy = GenericUI.prototype.destroy;