"use strict";
/* global main */
/* global util */
/* global GenericUI */
/* global GenericUIBlock */
/* global GenericUIText */

/* Define Game UI Main Menu Class */
function MainUI(game, name) {
  GenericUI.call(this, game, name);
}

MainUI.prototype.show = GenericUI.prototype.show;
MainUI.prototype.hide = GenericUI.prototype.hide;
MainUI.prototype.refresh = GenericUI.prototype.refresh;

MainUI.prototype.generate = function() {
  var parent = this;
  var container = new UIContainer({x: '=', y: '='});
  var colorMat = this.game.display.getMaterial("ui.color");           // Basic color material
  var fontMat  = this.game.display.getMaterial("ui.calibri");         // Font material
  var fontName = "Calibri";                                           // Name of this font for text rendering
  
  var black  = util.vec4.make(0.0, 0.0, 0.0, 0.5);
  var white  = util.vec4.make(1.0, 1.0, 1.0, 1.0);
  
  var swhite  = util.vec4.make(1.0, 1.0, 1.0, 1.0);
  var sblack  = util.vec4.make(0.0, 0.0, 0.0, 0.0);
  
  var w = 512;
  var h = 0;
  var s = 64;
  
  container.add({
    neutral: {
      block: [new GenericUIBlock(util.vec2.make(0,h), util.vec2.make(w,s), black, colorMat)],
      text:  [new GenericUIText(util.vec2.make(0,h), s, swhite, fontName, fontMat, "Font size " + s)]
    },
    hover: {
      block: [new GenericUIBlock(util.vec2.make(0,h), util.vec2.make(w,s), white, colorMat)],
      text:  [new GenericUIText(util.vec2.make(0,h), s, sblack, fontName, fontMat, "Font size " + s)]
    },
    step: function(imp, state, window) { return false; },
    isHovered: false
  });
  
  h += s;
  s = 48;
  
  container.add({
    neutral: {
      block: [new GenericUIBlock(util.vec2.make(0,h), util.vec2.make(w,s), black, colorMat)],
      text:  [new GenericUIText(util.vec2.make(0,h), s, swhite, fontName, fontMat, "Font size " + s)]
    },
    hover: {
      block: [new GenericUIBlock(util.vec2.make(0,h), util.vec2.make(w,s), white, colorMat)],
      text:  [new GenericUIText(util.vec2.make(0,h), s, sblack, fontName, fontMat, "Font size " + s)]
    },
    step: function(imp, state, window) { return false; },
    isHovered: false
  });
  
  h += s;
  s = 32;
  
  container.add({
    neutral: {
      block: [new GenericUIBlock(util.vec2.make(0,h), util.vec2.make(w,s), black, colorMat)],
      text:  [new GenericUIText(util.vec2.make(0,h), s, swhite, fontName, fontMat, "Font size " + s)]
    },
    hover: {
      block: [new GenericUIBlock(util.vec2.make(0,h), util.vec2.make(w,s), white, colorMat)],
      text:  [new GenericUIText(util.vec2.make(0,h), s, sblack, fontName, fontMat, "Font size " + s)]
    },
    step: function(imp, state, window) { return false; },
    isHovered: false
  });
  
  h += s;
  s = 24;
  
  container.add({
    neutral: {
      block: [new GenericUIBlock(util.vec2.make(0,h), util.vec2.make(w,s), black, colorMat)],
      text:  [new GenericUIText(util.vec2.make(0,h), s, swhite, fontName, fontMat, "Font size " + s)]
    },
    hover: {
      block: [new GenericUIBlock(util.vec2.make(0,h), util.vec2.make(w,s), white, colorMat)],
      text:  [new GenericUIText(util.vec2.make(0,h), s, sblack, fontName, fontMat, "Font size " + s)]
    },
    step: function(imp, state, window) { return false; },
    isHovered: false
  });
  
  h += s;
  s = 18;
  
  container.add({
    neutral: {
      block: [new GenericUIBlock(util.vec2.make(0,h), util.vec2.make(w,s), black, colorMat)],
      text:  [new GenericUIText(util.vec2.make(0,h), s, swhite, fontName, fontMat, "Font size " + s)]
    },
    hover: {
      block: [new GenericUIBlock(util.vec2.make(0,h), util.vec2.make(w,s), white, colorMat)],
      text:  [new GenericUIText(util.vec2.make(0,h), s, sblack, fontName, fontMat, "Font size " + s)]
    },
    step: function(imp, state, window) { return false; },
    isHovered: false
  });
  
  h += s;
  s = 16;
  
  container.add({
    neutral: {
      block: [new GenericUIBlock(util.vec2.make(0,h), util.vec2.make(w,s), black, colorMat)],
      text:  [new GenericUIText(util.vec2.make(0,h), s, swhite, fontName, fontMat, "Font size " + s)]
    },
    hover: {
      block: [new GenericUIBlock(util.vec2.make(0,h), util.vec2.make(w,s), white, colorMat)],
      text:  [new GenericUIText(util.vec2.make(0,h), s, sblack, fontName, fontMat, "Font size " + s)]
    },
    step: function(imp, state, window) { return false; },
    isHovered: false
  });
  
  h += s;
  s = 12;
  
  container.add({
    neutral: {
      block: [new GenericUIBlock(util.vec2.make(0,h), util.vec2.make(w,s), black, colorMat)],
      text:  [new GenericUIText(util.vec2.make(0,h), s, swhite, fontName, fontMat, "Font size " + s)]
    },
    hover: {
      block: [new GenericUIBlock(util.vec2.make(0,h), util.vec2.make(w,s), white, colorMat)],
      text:  [new GenericUIText(util.vec2.make(0,h), s, sblack, fontName, fontMat, "Font size " + s)]
    },
    step: function(imp, state, window) { return false; },
    isHovered: false
  });
  
  h += s;
  s = 10;
  
  container.add({
    neutral: {
      block: [new GenericUIBlock(util.vec2.make(0,h), util.vec2.make(w,s), black, colorMat)],
      text:  [new GenericUIText(util.vec2.make(0,h), s, swhite, fontName, fontMat, "Font size " + s)]
    },
    hover: {
      block: [new GenericUIBlock(util.vec2.make(0,h), util.vec2.make(w,s), white, colorMat)],
      text:  [new GenericUIText(util.vec2.make(0,h), s, sblack, fontName, fontMat, "Font size " + s)]
    },
    step: function(imp, state, window) { return false; },
    isHovered: false
  });
  
  h += s;
  s = 8;
  
  container.add({
    neutral: {
      block: [new GenericUIBlock(util.vec2.make(0,h), util.vec2.make(w,s), black, colorMat)],
      text:  [new GenericUIText(util.vec2.make(0,h), s, swhite, fontName, fontMat, "Font size " + s)]
    },
    hover: {
      block: [new GenericUIBlock(util.vec2.make(0,h), util.vec2.make(w,s), white, colorMat)],
      text:  [new GenericUIText(util.vec2.make(0,h), s, sblack, fontName, fontMat, "Font size " + s)]
    },
    step: function(imp, state, window) { return false; },
    isHovered: false
  });
  
  h += s;
  s = 16;
  
  var x = 0;
  w = 85;
  
  container.add({
    neutral: {
      block: [new GenericUIBlock(util.vec2.make(x,h), util.vec2.make(w,s), black, colorMat)],
      text:  [new GenericUIText(util.vec2.make(x,h), s, swhite, fontName, fontMat, "Align +X")]
    },
    hover: {
      block: [new GenericUIBlock(util.vec2.make(x,h), util.vec2.make(w,s), white, colorMat)],
      text:  [new GenericUIText(util.vec2.make(x,h), s, sblack, fontName, fontMat, "Align +X")]
    },
    step: function(imp, state, window) {
      for(var i=0;i<imp.mouse.length;i++) { if(imp.mouse[i].btn === 0 && this.isHovered) { this.onClick(); return true; } }
      return false;
    },
    onClick: function() { container.align.x = '+'; },
    isHovered: false
  });
  
  x += w;
  
  container.add({
    neutral: {
      block: [new GenericUIBlock(util.vec2.make(x,h), util.vec2.make(w,s), black, colorMat)],
      text:  [new GenericUIText(util.vec2.make(x,h), s, swhite, fontName, fontMat, "Align -X")]
    },
    hover: {
      block: [new GenericUIBlock(util.vec2.make(x,h), util.vec2.make(w,s), white, colorMat)],
      text:  [new GenericUIText(util.vec2.make(x,h), s, sblack, fontName, fontMat, "Align -X")]
    },
    step: function(imp, state, window) {
      for(var i=0;i<imp.mouse.length;i++) { if(imp.mouse[i].btn === 0 && this.isHovered) { this.onClick(); return true; } }
      return false;
    },
    onClick: function() { container.align.x = '-'; },
    isHovered: false
  });
  
  x += w;
  
  container.add({
    neutral: {
      block: [new GenericUIBlock(util.vec2.make(x,h), util.vec2.make(w,s), black, colorMat)],
      text:  [new GenericUIText(util.vec2.make(x,h), s, swhite, fontName, fontMat, "Align =X")]
    },
    hover: {
      block: [new GenericUIBlock(util.vec2.make(x,h), util.vec2.make(w,s), white, colorMat)],
      text:  [new GenericUIText(util.vec2.make(x,h), s, sblack, fontName, fontMat, "Align =X")]
    },
    step: function(imp, state, window) {
      for(var i=0;i<imp.mouse.length;i++) { if(imp.mouse[i].btn === 0 && this.isHovered) { this.onClick(); return true; } }
      return false;
    },
    onClick: function() { container.align.x = '='; },
    isHovered: false
  });
  
  x += w;
  
  container.add({
    neutral: {
      block: [new GenericUIBlock(util.vec2.make(x,h), util.vec2.make(w,s), black, colorMat)],
      text:  [new GenericUIText(util.vec2.make(x,h), s, swhite, fontName, fontMat, "Align +Y")]
    },
    hover: {
      block: [new GenericUIBlock(util.vec2.make(x,h), util.vec2.make(w,s), white, colorMat)],
      text:  [new GenericUIText(util.vec2.make(x,h), s, sblack, fontName, fontMat, "Align +Y")]
    },
    step: function(imp, state, window) {
      for(var i=0;i<imp.mouse.length;i++) { if(imp.mouse[i].btn === 0 && this.isHovered) { this.onClick(); return true; } }
      return false;
    },
    onClick: function() { container.align.y = '+'; },
    isHovered: false
  });
  
  x += w;
  
  container.add({
    neutral: {
      block: [new GenericUIBlock(util.vec2.make(x,h), util.vec2.make(w,s), black, colorMat)],
      text:  [new GenericUIText(util.vec2.make(x,h), s, swhite, fontName, fontMat, "Align -Y")]
    },
    hover: {
      block: [new GenericUIBlock(util.vec2.make(x,h), util.vec2.make(w,s), white, colorMat)],
      text:  [new GenericUIText(util.vec2.make(x,h), s, sblack, fontName, fontMat, "Align -Y")]
    },
    step: function(imp, state, window) {
      for(var i=0;i<imp.mouse.length;i++) { if(imp.mouse[i].btn === 0 && this.isHovered) { this.onClick(); return true; } }
      return false;
    },
    onClick: function() { container.align.y = '-'; },
    isHovered: false
  });
  
  x += w;
  w = 87;
  
  container.add({
    neutral: {
      block: [new GenericUIBlock(util.vec2.make(x,h), util.vec2.make(w,s), black, colorMat)],
      text:  [new GenericUIText(util.vec2.make(x,h), s, swhite, fontName, fontMat, "Align =Y")]
    },
    hover: {
      block: [new GenericUIBlock(util.vec2.make(x,h), util.vec2.make(w,s), white, colorMat)],
      text:  [new GenericUIText(util.vec2.make(x,h), s, sblack, fontName, fontMat, "Align =Y")]
    },
    step: function(imp, state, window) {
      for(var i=0;i<imp.mouse.length;i++) { if(imp.mouse[i].btn === 0 && this.isHovered) { this.onClick(); return true; } }
      return false;
    },
    onClick: function() { container.align.y = '='; },
    isHovered: false
  });  
  
  this.containers.push(container);
};

MainUI.prototype.pointInElement = GenericUI.prototype.pointInElement;

MainUI.prototype.step = GenericUI.prototype.step;
MainUI.prototype.getDraw = GenericUI.prototype.getDraw;

MainUI.prototype.destroy = function() { };