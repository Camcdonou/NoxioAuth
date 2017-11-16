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
  var SPEC_SETTINGS = main.settings;
  
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
  
  // Holy fuck variable scope in javascript. :gun emojii:
  var w = 175;
  var ww = 512;
  var LINE_WIDTH = 2;
  var h = 0;
  var hh = 150;
  var s = 24;
  var a = 8;
  var v = s*0.15;
  
  var slio = w+a;
  var sliw = ww-slio;
  var slih = s*0.5;
  var sliv = s*0.25;
  
  // element in neutral.block[1] is the slider box and neutral.block[2] is the slider setting itself
  var protoSlider = function(imp, state, window) {
    if(this.dragging && state.mouse.lmb) {}
    else {
      this.dragging = false;
      for(var i=0;i<imp.mouse.length;i++) {
        if(imp.mouse[i].btn === 0) {
          var mos = imp.mouse[i].pos;
          var align = menuContainer.makeAlign(window);
          var blok = this.neutral.block[1];
          var coordAdjust = util.vec2.make(mos.x, window.y-mos.y);                 // GL draws from bottom-left because.... downs?
          var aPos = util.vec2.add(blok.pos, align);
          this.dragging = util.intersection.pointRectangle(coordAdjust, aPos, blok.size);
        }
      }
    }
    
    if(this.dragging) {
        var mos = state.mouse.pos;
        var align = menuContainer.makeAlign(window);
        var blok = this.neutral.block[1];
        var coordAdjust = util.vec2.make(mos.x, window.y-mos.y);                   // GL draws from bottom-left because.... downs?
        var aPos = util.vec2.add(blok.pos, align);
        this.onSlider(Math.max(Math.min((coordAdjust.x-aPos.x)/blok.size.x, 1.0), 0.0));
        this.neutral.block[2].size.x = sliw*SPEC_SETTINGS.volume[this.setting];
        return true;
    }
    
    return false;
  };
  
  menuContainer.add({
    neutral: {
      block: [new GenericUIBlock(util.vec2.make(w,h), util.vec2.make(LINE_WIDTH,hh), swhite, colorMat)],
      text: []
    },
    step: function(imp, state, window) { return false; },
    isHovered: false
  });
  
  var BACK        = "Back";
  var BACK_LENGTH = util.font.textLength(BACK, fontName, s);
  var o = w-BACK_LENGTH-a;
  
  menuContainer.add({
    neutral: {
      block: [new GenericUIBlock(util.vec2.make(0,h), util.vec2.make(w,s), clear, colorMat)],
      text:  [new GenericUIText(util.vec2.make(o,h+v), s, swhite, fontName, fontMat, BACK)]
    },
    hover: {
      block: [new GenericUIBlock(util.vec2.make(0,h), util.vec2.make(w,s), swhite, colorMat)],
      text:  [new GenericUIText(util.vec2.make(o,h+v), s, sblack, fontName, fontMat, BACK)]
    },
    step: protoOnClick,
    onClick: function() { parent.ui.sub = "main"; },
    isHovered: false
  });
  h += s+s;
  
  var FX        = "FX Volume";
  var FX_LENGTH = util.font.textLength(FX, fontName, s);
  var o = w-FX_LENGTH-a;
  
  var slid = sliw*SPEC_SETTINGS.volume.fx;
  
  menuContainer.add({
    neutral: {
      block: [
        new GenericUIBlock(util.vec2.make(0,h), util.vec2.make(w,s), clear, colorMat),
        new GenericUIBlock(util.vec2.make(slio,h+sliv), util.vec2.make(sliw,slih), white, colorMat),
        new GenericUIBlock(util.vec2.make(slio,h+sliv), util.vec2.make(slid,slih), swhite, colorMat)
      ],
      text:  [new GenericUIText(util.vec2.make(o,h+v), s, swhite, fontName, fontMat, FX)]
    },
    step: protoSlider,
    onSlider: function(val) { SPEC_SETTINGS.volume.fx = val; },
    setting: "fx",
    dragging: false,
    isHovered: false
  });
  h += s;
  
  var MUSIC        = "Music Volume";
  var MUSIC_LENGTH = util.font.textLength(MUSIC, fontName, s);
  var o = w-MUSIC_LENGTH-a;
  
  var slid = sliw*SPEC_SETTINGS.volume.music;
  
  menuContainer.add({
    neutral: {
      block: [
        new GenericUIBlock(util.vec2.make(0,h), util.vec2.make(w,s), clear, colorMat),
        new GenericUIBlock(util.vec2.make(slio,h+sliv), util.vec2.make(sliw,slih), white, colorMat),
        new GenericUIBlock(util.vec2.make(slio,h+sliv), util.vec2.make(slid,slih), swhite, colorMat)
      ],
      text:  [new GenericUIText(util.vec2.make(o,h+v), s, swhite, fontName, fontMat, MUSIC)]
    },
    step: protoSlider,
    onSlider: function(val) { SPEC_SETTINGS.volume.music = val; },
    setting: "music",
    dragging: false,
    isHovered: false
  });
  h += s;
  
  var MASTER        = "Master Volume";
  var MASTER_LENGTH = util.font.textLength(MASTER, fontName, s);
  var o = w-MASTER_LENGTH-a;
  
  var slid = sliw*SPEC_SETTINGS.volume.master;
  
  menuContainer.add({
    neutral: {
      block: [
        new GenericUIBlock(util.vec2.make(0,h), util.vec2.make(w,s), clear, colorMat),
        new GenericUIBlock(util.vec2.make(slio,h+sliv), util.vec2.make(sliw,slih), white, colorMat),
        new GenericUIBlock(util.vec2.make(slio,h+sliv), util.vec2.make(slid,slih), swhite, colorMat)
      ],
      text:  [new GenericUIText(util.vec2.make(o,h+v), s, swhite, fontName, fontMat, MASTER)]
    },
    step: protoSlider,
    onSlider: function(val) { SPEC_SETTINGS.volume.master = val; },
    setting: "master",
    dragging: false,
    isHovered: false
  });
  h += s;
  
  this.containers.push(fadeContainer); this.containers.push(menuContainer);
};

SettingUI.prototype.pointInElement = GenericUI.prototype.pointInElement;

SettingUI.prototype.step = GenericUI.prototype.step;
SettingUI.prototype.getDraw = GenericUI.prototype.getDraw;

SettingUI.prototype.clear = GenericUI.prototype.clear;
SettingUI.prototype.destroy = GenericUI.prototype.destroy;