"use strict";
/* global main */
/* global util */
/* global GenericUI */
/* global GenericUIBlock */
/* global GenericUIText */

/* Define Game UI Debug Menu Class */
function DebugUI(game, ui, name) {
  GenericUI.call(this, game, ui, name);
  this.text = "";
}

DebugUI.prototype.setText = function(text) {
  this.text = text;
};

DebugUI.prototype.show = GenericUI.prototype.show;
DebugUI.prototype.hide = GenericUI.prototype.hide;
DebugUI.prototype.refresh = function() {
  var fontMat  = this.game.display.getMaterial("ui.calibri");         // Font material
  var fontName = "Calibri";                                           // Name of this font for text rendering
  
  var swhite = util.vec4.make(1.0, 1.0, 1.0, 1.0);
  
  var w = 512-8;
  var h = 0;
  var t = 256;
  var s = 18;
  var p = 32;
  var a = 4;
  var v = s*0.15;
  
  var lines = util.font.serrateText(this.text, "Calibri", s, w);
  var gen = [];
  for(var i=lines.length-1;i>=0&&h+s<t;i--) {
    gen.push(new GenericUIText(util.vec2.make(a,h+v), s, swhite, fontName, fontMat, lines[i]));
    h += s;
  }
  
  this.textArea.neutral.text = gen;
};

DebugUI.prototype.generate = function() {
  var parent = this;
  var colorMat = this.game.display.getMaterial("ui.color");           // Basic color material
  var fontMat  = this.game.display.getMaterial("ui.calibri");         // Font material
  var fontName = "Calibri";                                           // Name of this font for text rendering
  
  var black  = util.vec4.make(0.0, 0.0, 0.0, 0.5);
  var white  = util.vec4.make(1.0, 1.0, 1.0, 0.5);
  var swhite = util.vec4.make(1.0, 1.0, 1.0, 1.0);
  var sblack = util.vec4.make(0.0, 0.0, 0.0, 1.0);
  
  var container = new UIContainer({x: '-', y: '-'});
  
  /* Reuseable 'checks if clicked then calls an onclick function' */
  var protoOnClick = function(imp, state, window) {
    for(var i=0;i<imp.mouse.length;i++) {
      if(imp.mouse[i].btn === 0) {
        var align = container.makeAlign(window);
        var over = parent.pointInElement(imp.mouse[i].pos, this, window, align);
        if(over) { this.onClick(); return true; }
      }
    }
    return false;
  };
  
  var w = 512;
  var h = 0;
  var t = 256;
  var s = 18;
  var p = 32;
  var a = 8;
  
  this.textArea = {
    neutral: {
      block: [new GenericUIBlock(util.vec2.make(0,h), util.vec2.make(w,t-s), black, colorMat)],
      text:  []
    },
    step: function(imp, state, window) { return false; },
    isHovered: false
  };
  
  container.add(this.textArea);
  
  h += t-s;
  
  var GEN        = "Generate Cache File";
  var GEN_LENGTH = util.font.textLength(GEN, fontName, s);
  var l = GEN_LENGTH+p;
  var o = w-l;
  var v = s*0.15;
  
  container.add({
    neutral: {
      block: [new GenericUIBlock(util.vec2.make(o,h), util.vec2.make(l,s), black, colorMat)],
      text:  [new GenericUIText(util.vec2.make(a+o,h+v), s, swhite, fontName, fontMat, GEN)]
    },
    hover: {
      block: [new GenericUIBlock(util.vec2.make(o,h), util.vec2.make(l,s), swhite, colorMat)],
      text:  [new GenericUIText(util.vec2.make(a+o,h+v), s, sblack, fontName, fontMat, GEN)]
    },
    step: protoOnClick,
    onClick: function() { parent.game.generateCache(); },
    isHovered: false
  });
  
  var CHEAT        = "Enable Cheat Mode";
  var CHEAT_LENGTH = util.font.textLength(CHEAT, fontName, s);
  l = CHEAT_LENGTH+p;
  o -= l;
  
  container.add({
    neutral: {
      block: [new GenericUIBlock(util.vec2.make(o,h), util.vec2.make(l,s), black, colorMat)],
      text:  [new GenericUIText(util.vec2.make(a+o,h+v), s, swhite, fontName, fontMat, CHEAT)]
    },
    hover: {
      block: [new GenericUIBlock(util.vec2.make(o,h), util.vec2.make(l,s), swhite, colorMat)],
      text:  [new GenericUIText(util.vec2.make(a+o,h+v), s, sblack, fontName, fontMat, CHEAT)]
    },
    step: protoOnClick,
    onClick: function() { },
    isHovered: false
  });
  
  var CLOSE        = "Close";
  var CLOSE_LENGTH = util.font.textLength(CLOSE, fontName, s);
  l = CLOSE_LENGTH+p;
  o -= l;
  
  container.add({
    neutral: {
      block: [new GenericUIBlock(util.vec2.make(o,h), util.vec2.make(l,s), black, colorMat)],
      text:  [new GenericUIText(util.vec2.make(a+o,h+v), s, swhite, fontName, fontMat, CLOSE)]
    },
    hover: {
      block: [new GenericUIBlock(util.vec2.make(o,h), util.vec2.make(l,s), swhite, colorMat)],
      text:  [new GenericUIText(util.vec2.make(a+o,h+v), s, sblack, fontName, fontMat, CLOSE)]
    },
    step: protoOnClick,
    onClick: function() { parent.hide(); },
    isHovered: false
  });
  
  l = o;
  o = 0;
  
  container.add({
    neutral: {
      block: [new GenericUIBlock(util.vec2.make(o,h), util.vec2.make(l,s), swhite, colorMat)],
      text:  [new GenericUIText(util.vec2.make(a+o,h+v), s, sblack, fontName, fontMat, "DEBUG")]
    },
    step: function(imp, state, window) { },
    isHovered: false
  });
  
  this.containers.push(container);
};

DebugUI.prototype.pointInElement = GenericUI.prototype.pointInElement;

DebugUI.prototype.step = GenericUI.prototype.step;
DebugUI.prototype.getDraw = GenericUI.prototype.getDraw;

DebugUI.prototype.destroy = function() { };