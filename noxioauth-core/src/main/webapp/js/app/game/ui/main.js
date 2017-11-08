"use strict";
/* global main */
/* global util */
/* global GenericUI */
/* global GenericUIBlock */
/* global GenericUIText */

/* Define Game UI Main Menu Class */
function MainUI(game, ui, name) {
  GenericUI.call(this, game, ui, name);
}

MainUI.prototype.setVisible = GenericUI.prototype.setVisible;
MainUI.prototype.show = GenericUI.prototype.show;
MainUI.prototype.hide = GenericUI.prototype.hide;
MainUI.prototype.refresh = GenericUI.prototype.refresh;

MainUI.prototype.generate = function() {
  var parent = this;
  var colorMat = this.game.display.getMaterial("ui.color");           // Basic color material
  var fontMat  = this.game.display.getMaterial("ui.calibri");         // Font material
  var fontName = "Calibri";                                           // Name of this font for text rendering
  
  var clear  = util.vec4.make(0.0, 0.0, 0.0, 0.0);
  var black  = util.vec4.make(0.0, 0.0, 0.0, 0.5);
  var white  = util.vec4.make(1.0, 1.0, 1.0, 0.5);
  var swhite = util.vec4.make(1.0, 1.0, 1.0, 1.0);
  var sblack = util.vec4.make(0.0, 0.0, 0.0, 1.0);
  
  var menuContainer = new UIContainer({x: '=', y: '='});
  var fadeContainer = new UIContainer({x: '+', y: '+'});
  
  fadeContainer.add({
    neutral: {
      block: [new GenericUIBlock(util.vec2.make(0,0), util.vec2.make(2048,2048), black, colorMat)],
      text: []
    },
    step: function(imp, state, window) { return true; },
    isHovered: false
  });
  
  /* Reuseable 'checks if clicked then calls an onclick function' */
  var protoOnClick = function(imp, state, window) {
    for(var i=0;i<imp.mouse.length;i++) {
      if(imp.mouse[i].btn === 0) {
        var align = menuContainer.makeAlign(window);
        var over = parent.pointInElement(imp.mouse[i].pos, this, window, align);
        if(over) { this.onClick(); return true; }
      }
    }
    return false;
  };
  
  var w = 256;
  var h = 0;
  var s = 32;
  var QUIT        = "Quit";
  var QUIT_LENGTH = util.font.textLength(QUIT, fontName, s);
  var o = (w*0.5)-(QUIT_LENGTH*0.5);
  var v = s*0.15;
  
  menuContainer.add({
    neutral: {
      block: [new GenericUIBlock(util.vec2.make(0,h), util.vec2.make(w,s), clear, colorMat)],
      text:  [new GenericUIText(util.vec2.make(o,h+v), s, swhite, fontName, fontMat, QUIT)]
    },
    hover: {
      block: [new GenericUIBlock(util.vec2.make(0,h), util.vec2.make(w,s), swhite, colorMat)],
      text:  [new GenericUIText(util.vec2.make(o,h+v), s, sblack, fontName, fontMat, QUIT)]
    },
    step: protoOnClick,
    onClick: function() { parent.game.leave(); },
    isHovered: false
  });
  
  h += s;
  var SETTINGS        = "Settings";
  var SETTINGS_LENGTH = util.font.textLength(SETTINGS, fontName, s);
  o = (w*0.5)-(SETTINGS_LENGTH*0.5);
  
  menuContainer.add({
    neutral: {
      block: [new GenericUIBlock(util.vec2.make(0,h), util.vec2.make(w,s), clear, colorMat)],
      text:  [new GenericUIText(util.vec2.make(o,h+v), s, swhite, fontName, fontMat, SETTINGS)]
    },
    hover: {
      block: [new GenericUIBlock(util.vec2.make(0,h), util.vec2.make(w,s), swhite, colorMat)],
      text:  [new GenericUIText(util.vec2.make(o,h+v), s, sblack, fontName, fontMat, SETTINGS)]
    },
    step: protoOnClick,
    onClick: function() { },
    isHovered: false
  });
  
  h += s;
  var DEBUG        = "Debug";
  var DEBUG_LENGTH = util.font.textLength(DEBUG, fontName, s);
  o = (w*0.5)-(DEBUG_LENGTH*0.5);
  
  menuContainer.add({
    neutral: {
      block: [new GenericUIBlock(util.vec2.make(0,h), util.vec2.make(w,s), clear, colorMat)],
      text:  [new GenericUIText(util.vec2.make(o,h+v), s, swhite, fontName, fontMat, DEBUG)]
    },
    hover: {
      block: [new GenericUIBlock(util.vec2.make(0,h), util.vec2.make(w,s), swhite, colorMat)],
      text:  [new GenericUIText(util.vec2.make(o,h+v), s, sblack, fontName, fontMat, DEBUG)]
    },
    step: protoOnClick,
    onClick: function() { parent.ui.flags.debug = !parent.ui.flags.debug; },
    isHovered: false
  });
  
  h += s;
  var GAME        = "Game";
  var GAME_LENGTH = util.font.textLength(GAME, fontName, s);
  o = (w*0.5)-(GAME_LENGTH*0.5);
  
  menuContainer.add({
    neutral: {
      block: [new GenericUIBlock(util.vec2.make(0,h), util.vec2.make(w,s), clear, colorMat)],
      text:  [new GenericUIText(util.vec2.make(o,h+v), s, swhite, fontName, fontMat, GAME)]
    },
    hover: {
      block: [new GenericUIBlock(util.vec2.make(0,h), util.vec2.make(w,s), swhite, colorMat)],
      text:  [new GenericUIText(util.vec2.make(o,h+v), s, sblack, fontName, fontMat, GAME)]
    },
    step: protoOnClick,
    onClick: function() { },
    isHovered: false
  });
  
  h += s;
  var RESUME        = "Resume";
  var RESUME_LENGTH = util.font.textLength(RESUME, fontName, s);
  var o = (w*0.5)-(RESUME_LENGTH*0.5);
  
  menuContainer.add({
    neutral: {
      block: [new GenericUIBlock(util.vec2.make(0,h), util.vec2.make(w,s), clear, colorMat)],
      text:  [new GenericUIText(util.vec2.make(o,h+v), s, swhite, fontName, fontMat, RESUME)]
    },
    hover: {
      block: [new GenericUIBlock(util.vec2.make(0,h), util.vec2.make(w,s), swhite, colorMat)],
      text:  [new GenericUIText(util.vec2.make(o,h+v), s, sblack, fontName, fontMat, RESUME)]
    },
    step: protoOnClick,
    onClick: function() { parent.ui.flags.main = false; },
    isHovered: false
  });
  
  this.containers.push(fadeContainer); this.containers.push(menuContainer);
};

MainUI.prototype.pointInElement = GenericUI.prototype.pointInElement;

MainUI.prototype.step = GenericUI.prototype.step;
MainUI.prototype.getDraw = GenericUI.prototype.getDraw;

MainUI.prototype.clear = GenericUI.prototype.clear;
MainUI.prototype.destroy = GenericUI.prototype.destroy;