"use strict";
/* global main */
/* global util */
/* global GenericUI */
/* global GenericUIBlock */
/* global GenericUIText */

/* Define Game UI Respawn Menu Class */
function RespawnUI(game, ui, name) {
  GenericUI.call(this, game, ui, name);
}

RespawnUI.prototype.show = GenericUI.prototype.show;
RespawnUI.prototype.hide = GenericUI.prototype.hide;
RespawnUI.prototype.refresh = function() {
  var fontMat  = this.game.display.getMaterial("ui.calibri");         // Font material
  var fontName = "Calibri";                                           // Name of this font for text rendering
  
  var swhite = util.vec4.make(1.0, 1.0, 1.0, 1.0);
  
  var w = 2048;
  var h = 0;
  var s = 32;
  var v = s*0.15;
  
  var TEXT        = this.game.respawnTimer<=0?"Press [Left Mouse] to respawn!":"Respawn in " + (this.game.respawnTimer/30).toFixed(1) + " seconds!";
  var TEXT_LENGTH = util.font.textLength(TEXT, fontName, s);
  var o = (w*0.5)-(TEXT_LENGTH*0.5);
  
 this.respawnTimer.neutral.text[0] = new GenericUIText(util.vec2.make(o,h+v), s, swhite, fontName, fontMat, TEXT);
};

RespawnUI.prototype.generate = function() {
  var parent = this;
  var colorMat = this.game.display.getMaterial("ui.color");           // Basic color material
  var fontMat  = this.game.display.getMaterial("ui.calibri");         // Font material
  var fontName = "Calibri";                                           // Name of this font for text rendering
  var characterMats = [                                               // Materials used for character select icons
    this.game.display.getMaterial("ui.cs_inferno"),
    this.game.display.getMaterial("ui.cs_box"),
    this.game.display.getMaterial("ui.cs_stub"),
    this.game.display.getMaterial("ui.cs_stub"),
    this.game.display.getMaterial("ui.cs_stub")
  ];
  
  var black  = util.vec4.make(0.0, 0.0, 0.0, 0.5);
  var white  = util.vec4.make(1.0, 1.0, 1.0, 0.75);
  var swhite = util.vec4.make(1.0, 1.0, 1.0, 1.0);
  var sblack = util.vec4.make(0.0, 0.0, 0.0, 1.0);
  
  var container = new UIContainer({x: '=', y: '='});
  
  /* Reuseable 'checks if clicked then calls an onclick function' */
  var protoOnClick = function(imp, state, window) {
    if(this.forceHover) { this.isHovered = true; }
    for(var i=0;i<imp.mouse.length;i++) {
      if(imp.mouse[i].btn === 0) {
        var align = container.makeAlign(window);
        var over = parent.pointInElement(imp.mouse[i].pos, this, window, align);
        if(over) { this.onClick(); return true; }
        else { this.offClick(); }
      }
    }
    return false;
  };
  
  var w = 2048;
  var h = 0;
  var s = 32;
  var v = s*0.15;
  
  var TEXT        = "?? YOU SHOULD NOT SEE THIS ??";
  var TEXT_LENGTH = util.font.textLength(TEXT, fontName, s);
  var o = (w*0.5)-(TEXT_LENGTH*0.5);
  
  this.respawnTimer = {
    neutral: {
      block: [new GenericUIBlock(util.vec2.make(0,h), util.vec2.make(w,s), black, colorMat)],
      text:  [new GenericUIText(util.vec2.make(o,h+v), s, swhite, fontName, fontMat, TEXT)]
    },
    step: function(imp, state, window) { },
    isHovered: false
  };
  
  container.add(this.respawnTimer);
  
  h += s+v;
  var b = 128;
  var t = 5;
  
  for(var i=0;i<t;i++) {
    o = (w*0.5)-(i*b)+(t*b-(t*b*0.5))-b;
    container.add({
      neutral: {
        block: [
          new GenericUIBlock(util.vec2.make(o,h), util.vec2.make(b,b), black, colorMat),
          new GenericUIBlock(util.vec2.make(o,h), util.vec2.make(b,b), swhite, characterMats[i])
        ],
        text:  []
      },
      hover: {
        block: [
          new GenericUIBlock(util.vec2.make(o,h), util.vec2.make(b,b), white, colorMat),
          new GenericUIBlock(util.vec2.make(o,h), util.vec2.make(b,b), sblack, characterMats[i])
        ],
        text:  []
      },
      step: protoOnClick,
      onClick: function() { this.forceHover = true; },
      offClick: function() { this.forceHover = false; },
      forceHover: false,
      isHovered: false
    });
  }
  
  this.containers.push(container);
};

RespawnUI.prototype.pointInElement = GenericUI.prototype.pointInElement;

RespawnUI.prototype.step = GenericUI.prototype.step;
RespawnUI.prototype.getDraw = GenericUI.prototype.getDraw;

RespawnUI.prototype.destroy = function() { };