"use strict";
/* global main */
/* global util */
/* global GenericUI */
/* global GenericUIBlock */
/* global GenericUIText */

/* Define Game UI Main Menu Class */
function ControlUI(game, ui, name) {
  GenericUI.call(this, game, ui, name);
  this.regen = false;                    // If this is set to true then we need to regenerate this UI.
}

ControlUI.prototype.setVisible = GenericUI.prototype.setVisible;
ControlUI.prototype.show = GenericUI.prototype.show;
ControlUI.prototype.hide = GenericUI.prototype.hide;
ControlUI.prototype.refresh = function() {
  if(this.regen) {
    this.regen = false;
    this.clear();
    this.generate();
  }
};

ControlUI.prototype.generate = function() {
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
  
  /* Focus input for setting controls */ // @FIXME: allows any key afaik, needs to show keycodes on weird keys instead of blanks or !
  var protoOnFocus = function(imp, state, window) {
    if(this.focus) {
      this.isHovered = true;
      for(var i=0;i<imp.keyboard.length;i++) {
        SPEC_SETTINGS.control[this.field] = imp.keyboard[i].key;
        SPEC_SETTINGS.saveUserSettings();
        this.focus = false;
        parent.regen = true;
        return true;
      }
    }
    this.hover.text[1].text = this.focus?" ":this.name;
    for(var i=0;i<imp.mouse.length;i++) {
        var align = menuContainer.makeAlign(window);
        var over = parent.pointInElement(imp.mouse[i].pos, this, window, align);
        if(over && imp.mouse[i].btn === 0) { this.focus = true; return true; }
        else { this.focus = false; return false; }
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
  
  var SPEC = [
    {nam: "Scoreboard", fld: "scoreboard"},
    {nam: "Taunt", fld: "taunt"},
    {nam: "Action #2", fld: "actionB"},
    {nam: "Action #1", fld: "actionA"},
    {nam: "Toss Flag", fld: "toss"},
    {nam: "Jump", fld: "jump"}
  ];
  for(var i=0;i<SPEC.length;i++) {
    var NAME           = SPEC[i].nam;
    var NAME_LENGTH    = util.font.textLength(NAME, fontName, s);
    var o = w-NAME_LENGTH-a;
    
    var SPEC_CONTROL = String.fromCodePoint(SPEC_SETTINGS.control[SPEC[i].fld]);
    var CONTROL        = SPEC_CONTROL===" "?"Space":SPEC_CONTROL;
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
      step: protoOnFocus,
      field: SPEC[i].fld,
      name: CONTROL,
      isHovered: false
    });
    h += s;
  }
  
  this.containers.push(fadeContainer); this.containers.push(menuContainer);
};

ControlUI.prototype.pointInElement = GenericUI.prototype.pointInElement;

ControlUI.prototype.step = GenericUI.prototype.step;
ControlUI.prototype.getDraw = GenericUI.prototype.getDraw;

ControlUI.prototype.clear = GenericUI.prototype.clear;
ControlUI.prototype.destroy = GenericUI.prototype.destroy;