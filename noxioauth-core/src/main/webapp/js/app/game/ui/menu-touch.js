"use strict";
/* global main */
/* global util */
/* global GenericUI */
/* global GenericUIBlock */
/* global GenericUIText */

/* Define Game UI Debug Menu Class */
function MenuTouchUI(game, ui, name) {
  GenericUI.call(this, game, ui, name);
}

MenuTouchUI.prototype.setVisible = GenericUI.prototype.setVisible;
MenuTouchUI.prototype.show = GenericUI.prototype.show;
MenuTouchUI.prototype.hide = GenericUI.prototype.hide;
MenuTouchUI.prototype.refresh = GenericUI.prototype.refresh;

MenuTouchUI.prototype.generate = function() {
  var parent = this;
  var colorMat = this.game.display.getMaterial("ui.color");                // Basic color material
  var fontMat  = this.game.display.getMaterial("ui.calibri");              // Font material
  var fontName = "Calibri";                                                // Name of this font for text rendering
  
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
        if(over) { this.onClick(); parent.play("ui/button1.wav", 0.5, 0.0); return true; }
      }
    }
    return false;
  };
  
  var w = 512;
  var h = 0;
  var s = 48;
  var p = 32;
  var a = 8;
  
  var GEN        = "Menu";
  var GEN_LENGTH = util.font.textLength(GEN, fontName, s);
  var l = GEN_LENGTH+(a*2);
  var v = s*0.15;
  
  container.add({
    neutral: {
      block: [new GenericUIBlock(util.vec2.make(0,h), util.vec2.make(l,s), black, colorMat)],
      text:  [new GenericUIText(util.vec2.make(a,h+v), s, swhite, fontName, fontMat, GEN)]
    },
    hover: {
      block: [new GenericUIBlock(util.vec2.make(0,h), util.vec2.make(l,s), swhite, colorMat)],
      text:  [new GenericUIText(util.vec2.make(a,h+v), s, sblack, fontName, fontMat, GEN)],
      sound: {path: "ui/button0.wav", gain: 0.25, shift: 0.0}
    },
    step: protoOnClick,
    onClick: function() { parent.ui.menuKey(); },
    isHovered: false
  });
  
  this.containers.push(container);
};

MenuTouchUI.prototype.pointInElement = GenericUI.prototype.pointInElement;

MenuTouchUI.prototype.step = GenericUI.prototype.step;
MenuTouchUI.prototype.play = GenericUI.prototype.play;
MenuTouchUI.prototype.getDraw = GenericUI.prototype.getDraw;

MenuTouchUI.prototype.clear = GenericUI.prototype.clear;
MenuTouchUI.prototype.destroy = GenericUI.prototype.destroy;