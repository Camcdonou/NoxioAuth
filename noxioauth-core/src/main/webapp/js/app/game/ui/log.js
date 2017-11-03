"use strict";
/* global main */
/* global util */
/* global GenericUI */
/* global GenericUIBlock */
/* global GenericUIText */

/* Define Game UI Log/Chat Menu Class */
function LogUI(game, ui, name) {
  GenericUI.call(this, game, ui, name);
  this.text = "HC is not my daddy\nHC is not my daddy\nHC is not my daddy!\nDaddy!\nDaddy\nDaddy~";
  this.intext = "test";
}

LogUI.prototype.setText = function(text) {
  this.text = text;
};

LogUI.prototype.show = GenericUI.prototype.show;
LogUI.prototype.hide = GenericUI.prototype.hide;
LogUI.prototype.refresh = function() {
  var fontMat  = this.game.display.getMaterial("ui.calibri");         // Font material
  var fontName = "Calibri";                                           // Name of this font for text rendering
  
  var swhite = util.vec4.make(1.0, 1.0, 1.0, 1.0);
  
  var w = 512-8;
  var h = 18;
  var t = 128;
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

LogUI.prototype.generate = function() {
  var parent = this;
  var colorMat = this.game.display.getMaterial("ui.color");           // Basic color material
  var fontMat  = this.game.display.getMaterial("ui.calibri");         // Font material
  var fontName = "Calibri";                                           // Name of this font for text rendering
  
  var black  = util.vec4.make(0.0, 0.0, 0.0, 0.5);
  var white  = util.vec4.make(1.0, 1.0, 1.0, 0.75);
  var swhite = util.vec4.make(1.0, 1.0, 1.0, 1.0);
  var sblack = util.vec4.make(0.0, 0.0, 0.0, 1.0);
  
  var container = new UIContainer({x: '-', y: '+'});
  
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
  var t = 128;
  var s = 20;
  var p = 16;
  var a = 8;
  var v = s*0.15;
  
  var SEND        = "Send";
  var SEND_LENGTH = util.font.textLength(SEND, fontName, s);
  var l = SEND_LENGTH+p;
  var o = 0;
  
  container.add({
    neutral: {
      block: [new GenericUIBlock(util.vec2.make(0,h), util.vec2.make(l,s), white, colorMat)],
      text:  [new GenericUIText(util.vec2.make(o+a,h+v), s, sblack, fontName, fontMat, SEND)]
    },
    hover: {
      block: [new GenericUIBlock(util.vec2.make(o,h), util.vec2.make(l,s), swhite, colorMat)],
      text:  [new GenericUIText(util.vec2.make(o+a,h+v), s, sblack, fontName, fontMat, SEND)]
    },
    step: protoOnClick,
    onClick: function() {  },
    isHovered: false
  });
  
  o += l;
  
  container.add({
    neutral: {
      block: [new GenericUIBlock(util.vec2.make(l,h), util.vec2.make(w-l,s), white, colorMat)],
      text:  [new GenericUIText(util.vec2.make(l+a,h+v), s, sblack, fontName, fontMat, "")]
    },
    hover: {
      block: [new GenericUIBlock(util.vec2.make(l,h), util.vec2.make(w-l,s), swhite, colorMat)],
      text:  [new GenericUIText(util.vec2.make(l+a,h+v), s, sblack, fontName, fontMat, "")]
    },
    step: protoOnClick,
    onClick: function() {  },
    isHovered: false
  });
  
  h += s;
  
  this.textArea = {
    neutral: {
      block: [new GenericUIBlock(util.vec2.make(0,h), util.vec2.make(w,t-h), black, colorMat)],
      text:  []
    },
    step: function(imp, state, window) { return false; },
    isHovered: false
  };
  
  container.add(this.textArea);
  
  h = t;
  
  var NAME        = main.net.game.state.info.name;
  var NAME_LENGTH = util.font.textLength(NAME, fontName, s);
  o = w - NAME_LENGTH - p;
  var r = NAME_LENGTH + p;
  
  container.add({
    neutral: {
      block: [new GenericUIBlock(util.vec2.make(o,h), util.vec2.make(r,s), swhite, colorMat)],
      text:  [new GenericUIText(util.vec2.make(o+a,h+v), s, sblack, fontName, fontMat, NAME)]
    },
    step: function(imp, state, window) { return false; },
    isHovered: false
  });
  
  this.containers.push(container);
};

LogUI.prototype.pointInElement = GenericUI.prototype.pointInElement;

LogUI.prototype.step = GenericUI.prototype.step;
LogUI.prototype.getDraw = GenericUI.prototype.getDraw;

LogUI.prototype.destroy = function() { };