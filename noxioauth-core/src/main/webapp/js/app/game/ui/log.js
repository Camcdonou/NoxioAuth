"use strict";
/* global main */
/* global util */
/* global GenericUI */
/* global GenericUIBlock */
/* global GenericUIText */

/* Define Game UI Log/Chat Menu Class */
function LogUI(game, ui, name) {
  this.log = "...\n";
  this.message = "";
  
  this.cursorTimer = 0;
  this.cursor = false;
  
  this.textUpdated = true;      // If this is flagged as true we refresh the UI data with the currently set text. Prevents constant ui updates.
  GenericUI.call(this, game, ui, name);
}

LogUI.prototype.addMessage = function(text) {
  this.log += text + "\n";
  this.textUpdated = true;
};

LogUI.prototype.setVisible = GenericUI.prototype.setVisible;
LogUI.prototype.show = GenericUI.prototype.show;
LogUI.prototype.hide = GenericUI.prototype.hide;
LogUI.prototype.refresh = function() {
  if(!this.textUpdated) { return; }
  var colorMat = this.game.display.getMaterial("ui.color");           // Basic color material
  var fontMat  = this.game.display.getMaterial("ui.calibri");         // Font material
  var fontName = "Calibri";                                           // Name of this font for text rendering
  
  var clear  = util.vec4.make(0.0, 0.0, 0.0, 0.0);
  var swhite = util.vec4.make(1.0, 1.0, 1.0, 1.0);
  var sblack = util.vec4.make(0.0, 0.0, 0.0, 1.0);
  
  var w = 512-10;
  var h = 18;
  var t = 128;
  var s = 18;
  var p = 32;
  var a = 4;
  var v = s*0.15;
  
  /* Update text input */
  if(this.cursorTimer-- <= 0) { this.cursorTimer=15; this.cursor = !this.cursor; }
  var MESSAGE = util.font.truncateText(this.message, "Calibri", s, w);
  var MESSAGE_LENGTH = util.font.textLength(MESSAGE, "Calibri", s);
  this.textInput.neutral.text[0] = new GenericUIText(util.vec2.make(a,v), s, sblack, fontName, fontMat, MESSAGE);
  this.textInput.hover.text[0] = new GenericUIText(util.vec2.make(a,v), s, sblack, fontName, fontMat, MESSAGE);
  this.textInput.hover.block[1] = new GenericUIBlock(util.vec2.make(a+1+MESSAGE_LENGTH,v), util.vec2.make(s*0.5,s*0.1), this.cursor?sblack:clear, colorMat);
  
  /* Update log */  
  var lines = util.font.serrateText(this.log, "Calibri", s, w);
  var gen = [];
  for(var i=lines.length-1;i>=0&&h+s<t;i--) {
    gen.push(new GenericUIText(util.vec2.make(a,h+v), s, swhite, fontName, fontMat, lines[i]));
    h += s;
  }
  
  this.textArea.neutral.text = gen;
  
  this.textUpdated = false;
};

LogUI.prototype.generate = function() {
  var parent = this;
  var colorMat = this.game.display.getMaterial("ui.color");           // Basic color material
  var fontMat  = this.game.display.getMaterial("ui.calibri");         // Font material
  var fontName = "Calibri";                                           // Name of this font for text rendering
  
  var clear  = util.vec4.make(0.0, 0.0, 0.0, 0.0);
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
  
  var protoFocusInput = function(imp, state, window) {
    if(this.focus) {
      this.isHovered = true;
      for(var i=0;i<imp.keyboard.length;i++) {
        switch(imp.keyboard[i].key) {
          case 8 : {
            if(parent.message.length > 0) {
              parent.message = parent.message.substr(0, parent.message.length-1);
            }
            break;
          }
          case 13 : { if(parent.message.length > 0) { parent.game.chatMsgOut.push(parent.message); parent.message = ""; } break; }
          default : { parent.message += imp.keyboard[i].char; break; }
        }
      }
      parent.textUpdated = true;
    }
    for(var i=0;i<imp.keyboard.length;i++) {
      if(imp.keyboard[i].key === 13) {
        this.focus = true; return true;
      }
    }
    for(var i=0;i<imp.mouse.length;i++) {
      var align = container.makeAlign(window);
      var over = parent.pointInElement(imp.mouse[i].pos, this, window, align);
      if(imp.mouse[i].btn === 0) {
        if(over) { this.onClick(); return true; }
        else { this.offClick();    return false; }
      }
      else {
        if(over) { return true; }
        else { this.offClick();    return false; }
      }
    }
    return this.focus;
  };
  
  var w = 512;
  var h = 0;
  var t = 128;
  var s = 18;
  var p = 16;
  var a = 8;
  var v = s*0.15;
  
  this.textInput = {
    neutral: {
      block: [new GenericUIBlock(util.vec2.make(0,h), util.vec2.make(w,s), white, colorMat)],
      text:  [new GenericUIText(util.vec2.make(a,h+v), s, sblack, fontName, fontMat, "")]
    },
    hover: {
      block: [
        new GenericUIBlock(util.vec2.make(0,h), util.vec2.make(w,s), swhite, colorMat),
        new GenericUIBlock(util.vec2.make(a,h+v), util.vec2.make(s*0.4,s*0.75), clear, colorMat)
      ],
      text:  [new GenericUIText(util.vec2.make(a,h+v), s, sblack, fontName, fontMat, "")]
    },
    step: protoFocusInput,
    onClick: function() { this.focus = true; },
    offClick: function() { parent.cursor = false; this.focus = false; },
    isHovered: false
  };
  container.add(this.textInput);
  
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
  
  /*
  h = t;
  
  var NAME        = main.net.game.state.info.name;
  var NAME_LENGTH = util.font.textLength(NAME, fontName, s);
  var o = w - NAME_LENGTH - p;
  var r = NAME_LENGTH + p;
  
  container.add({
    neutral: {
      block: [new GenericUIBlock(util.vec2.make(o,h), util.vec2.make(r,s), swhite, colorMat)],
      text:  [new GenericUIText(util.vec2.make(o+a,h+v), s, sblack, fontName, fontMat, NAME)]
    },
    step: function(imp, state, window) { return false; },
    isHovered: false
  });
  */
  
  this.containers.push(container);
};

LogUI.prototype.pointInElement = GenericUI.prototype.pointInElement;

LogUI.prototype.step = GenericUI.prototype.step;
LogUI.prototype.getDraw = GenericUI.prototype.getDraw;

LogUI.prototype.clear = GenericUI.prototype.clear;
LogUI.prototype.destroy = GenericUI.prototype.destroy;