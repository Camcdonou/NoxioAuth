"use strict";
/* global main */
/* global util */
/* global GenericUI */
/* global GenericUIBlock */
/* global GenericUIText */

/* Define Game UI Main Menu Class */
function GraphicUI(game, ui, name) {
  GenericUI.call(this, game, ui, name);
  this.regen = false;                    // If this is set to true then we need to regenerate this UI.
}

GraphicUI.prototype.setVisible = GenericUI.prototype.setVisible;
GraphicUI.prototype.show = GenericUI.prototype.show;
GraphicUI.prototype.hide = GenericUI.prototype.hide;
GraphicUI.prototype.refresh = function() {
  if(this.regen) {
    this.regen = false;
    this.clear();
    this.generate();
    this.game.display.settingsChanged();
  }
};

GraphicUI.prototype.generate = function() {
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
  
  var w = 175;
  var ww = 256;
  var LINE_WIDTH = 2;
  var h = 0;
  var hh = 200;
  var s = 24;
  var a = 8;
  var v = s*0.15;
  
  var or = w+a;
  
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
    onClick: function() { parent.ui.sub = "setting"; },
    isHovered: false
  });
  h += s+s;
  
  var gq, mq, kq, sq;
  var gnxt, mnxt, knxt, snxt;
  var sets = main.settings.graphics;
  switch(sets.upGame) {
    case 0.5 :  { gq = "Low"; gnxt = 1.0; break; }
    case 1.5 :  { gq = "High"; gnxt = 2.0; break; }
    case 2.0 :  { gq = "Ultra"; gnxt = 0.5; break; }
    default  : { gq = "Normal"; gnxt = 1.5; break; }
  }
  switch(sets.upUi) {
    case 0.5 :  { mq = "Low"; mnxt = 1.0; break; }
    default  : { mq = "Normal"; mnxt = 0.5; break; }
  }
  switch(sets.upSky) {
    case 0.25 :  { kq = "Low"; knxt = 1.0; break; }
    default  : { kq = "Normal"; knxt = 0.25; break; }
  }
  switch(sets.shadowSize) {
    case 512 :  { sq = "Low"; snxt = 1024; break; }
    case 2048 :  { sq = "High"; snxt = 4096; break; }
    case 4096 :  { sq = "Ultra"; snxt = 512; break; }
    default  : { sq = "Normal";snxt = 2048; break; }
  }
  
  var SPEC = [
    {nam: "Game Quality", txt: gq, fld: "upGame", nxt: gnxt},
    {nam: "Menu Quality", txt: mq, fld: "upUi", nxt: mnxt},
    {nam: "Sky Quality", txt: kq, fld: "upSky", nxt: knxt},
    {nam: "Shadow Quality", txt: sq, fld: "shadowSize", nxt: snxt}
  ];
  
  for(var i=0;i<SPEC.length;i++) {
    var NAME           = SPEC[i].nam;
    var NAME_LENGTH    = util.font.textLength(NAME, fontName, s);
    var o = w-NAME_LENGTH-a;
    
    var CONTROL        = SPEC[i].txt;
    var CONTROL_LENGTH = util.font.textLength(CONTROL, fontName, s);
    var oc = or+(((ww-or)*0.5)-(CONTROL_LENGTH*0.5));

    menuContainer.add({
      neutral: {
        block: [ new GenericUIBlock(util.vec2.make(oc,h), util.vec2.make(CONTROL_LENGTH+a+a,s), clear, colorMat) ],
        text:  [
          new GenericUIText(util.vec2.make(o,h+v), s, swhite, fontName, fontMat, NAME),
          new GenericUIText(util.vec2.make(oc+a,h+v), s, swhite, fontName, fontMat, CONTROL)
        ]
      },
      hover: {
        block: [ new GenericUIBlock(util.vec2.make(oc,h), util.vec2.make(CONTROL_LENGTH+a+a,s), swhite, colorMat) ],
        text:  [
          new GenericUIText(util.vec2.make(o,h+v), s, swhite, fontName, fontMat, NAME),
          new GenericUIText(util.vec2.make(oc+a,h+v), s, sblack, fontName, fontMat, CONTROL)
        ]
      },
      step: protoOnClick,
      onClick: function() {parent.regen = true; sets[this.fld] = this.nxtVal; },
      fld: SPEC[i].fld,
      nxtVal: SPEC[i].nxt,
      isHovered: false
    });
    h += s;
  }
  
  this.containers.push(fadeContainer); this.containers.push(menuContainer);
};

GraphicUI.prototype.pointInElement = GenericUI.prototype.pointInElement;

GraphicUI.prototype.step = GenericUI.prototype.step;
GraphicUI.prototype.getDraw = GenericUI.prototype.getDraw;

GraphicUI.prototype.clear = GenericUI.prototype.clear;
GraphicUI.prototype.destroy = GenericUI.prototype.destroy;