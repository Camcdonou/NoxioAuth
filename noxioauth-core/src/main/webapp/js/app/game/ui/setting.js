"use strict";
/* global main */
/* global util */
/* global GenericUI */
/* global GenericUIBlock */
/* global GenericUIText */

/* Define Game UI Main Menu Class */
function SettingUI(game, ui, name) {
  GenericUI.call(this, game, ui, name);
}

SettingUI.prototype.setVisible = GenericUI.prototype.setVisible;
SettingUI.prototype.show = GenericUI.prototype.show;
SettingUI.prototype.hide = GenericUI.prototype.hide;
SettingUI.prototype.refresh = GenericUI.prototype.refresh;

SettingUI.prototype.generate = function() {
  var parent = this;
  var colorMat = this.game.display.getMaterial("ui.color");           // Basic color material
  var fontMat  = this.game.display.getMaterial("ui.calibri");         // Font material
  var fontName = "Calibri";                                           // Name of this font for text rendering
  
  var clear  = util.vec4.make(0.0, 0.0, 0.0, 0.0);
  var black  = util.vec4.make(0.0, 0.0, 0.0, 0.5);
//  var white  = util.vec4.make(1.0, 1.0, 1.0, 0.5);
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
        if(over) { this.onClick(); parent.play("ui/button1.wav", 0.5, 0.0); return true; }
      }
    }
    return false;
  };
  
  var w = 256;
  var h = 0;
  var s = 32;
  var BACK        = "Back";
  var BACK_LENGTH = util.font.textLength(BACK, fontName, s);
  var o = (w*0.5)-(BACK_LENGTH*0.5);
  var v = s*0.15;
  
  menuContainer.add({
    neutral: {
      block: [new GenericUIBlock(util.vec2.make(0,h), util.vec2.make(w,s), clear, colorMat)],
      text:  [new GenericUIText(util.vec2.make(o,h+v), s, swhite, fontName, fontMat, BACK)]
    },
    hover: {
      block: [new GenericUIBlock(util.vec2.make(0,h), util.vec2.make(w,s), swhite, colorMat)],
      text:  [new GenericUIText(util.vec2.make(o,h+v), s, sblack, fontName, fontMat, BACK)],
      sound: {path: "ui/button0.wav", gain: 0.5, shift: 0.0}
    },
    step: protoOnClick,
    onClick: function() { parent.ui.sub = "main"; },
    isHovered: false
  });
  
  h += s;
  var CONTROL        = "Controls";
  var CONTROL_LENGTH = util.font.textLength(CONTROL, fontName, s);
  o = (w*0.5)-(CONTROL_LENGTH*0.5);
  
  menuContainer.add({
    neutral: {
      block: [new GenericUIBlock(util.vec2.make(0,h), util.vec2.make(w,s), clear, colorMat)],
      text:  [new GenericUIText(util.vec2.make(o,h+v), s, swhite, fontName, fontMat, CONTROL)]
    },
    hover: {
      block: [new GenericUIBlock(util.vec2.make(0,h), util.vec2.make(w,s), swhite, colorMat)],
      text:  [new GenericUIText(util.vec2.make(o,h+v), s, sblack, fontName, fontMat, CONTROL)],
      sound: {path: "ui/button0.wav", gain: 0.5, shift: 0.0}
    },
    step: protoOnClick,
    onClick: function() { parent.ui.sub = "control"; },
    isHovered: false
  });
  
  h += s;
  var AUDIO        = "Sound";
  var AUDIO_LENGTH = util.font.textLength(AUDIO, fontName, s);
  o = (w*0.5)-(AUDIO_LENGTH*0.5);
  
  menuContainer.add({
    neutral: {
      block: [new GenericUIBlock(util.vec2.make(0,h), util.vec2.make(w,s), clear, colorMat)],
      text:  [new GenericUIText(util.vec2.make(o,h+v), s, swhite, fontName, fontMat, AUDIO)]
    },
    hover: {
      block: [new GenericUIBlock(util.vec2.make(0,h), util.vec2.make(w,s), swhite, colorMat)],
      text:  [new GenericUIText(util.vec2.make(o,h+v), s, sblack, fontName, fontMat, AUDIO)],
      sound: {path: "ui/button0.wav", gain: 0.5, shift: 0.0}
    },
    step: protoOnClick,
    onClick: function() { parent.ui.sub = "audio"; },
    isHovered: false
  });
  
  h += s;
  var GRAPHIC        = "Graphics";
  var GRAPHIC_LENGTH = util.font.textLength(GRAPHIC, fontName, s);
  o = (w*0.5)-(GRAPHIC_LENGTH*0.5);
  
  menuContainer.add({
    neutral: {
      block: [new GenericUIBlock(util.vec2.make(0,h), util.vec2.make(w,s), clear, colorMat)],
      text:  [new GenericUIText(util.vec2.make(o,h+v), s, swhite, fontName, fontMat, GRAPHIC)]
    },
    hover: {
      block: [new GenericUIBlock(util.vec2.make(0,h), util.vec2.make(w,s), swhite, colorMat)],
      text:  [new GenericUIText(util.vec2.make(o,h+v), s, sblack, fontName, fontMat, GRAPHIC)],
      sound: {path: "ui/button0.wav", gain: 0.5, shift: 0.0}
    },
    step: protoOnClick,
    onClick: function() { parent.ui.sub = "graphic"; },
    isHovered: false
  });
  
  this.containers.push(fadeContainer); this.containers.push(menuContainer);
};

SettingUI.prototype.pointInElement = GenericUI.prototype.pointInElement;

SettingUI.prototype.step = GenericUI.prototype.step;
SettingUI.prototype.play = GenericUI.prototype.play;
SettingUI.prototype.getDraw = GenericUI.prototype.getDraw;

SettingUI.prototype.clear = GenericUI.prototype.clear;
SettingUI.prototype.destroy = GenericUI.prototype.destroy;