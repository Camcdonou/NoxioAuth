"use strict";
/* global main */
/* global util */
/* global GenericUI */
/* global GenericUIBlock */
/* global GenericUIText */

/* Define Game UI Debug Menu Class */
function MeterTouchUI(game, ui, name) {
  this.FADE_OUT_TIME = 20;
  this.meters = undefined;
  GenericUI.call(this, game, ui, name);
}

MeterTouchUI.prototype.setVisible = GenericUI.prototype.setVisible;
MeterTouchUI.prototype.show = GenericUI.prototype.show;
MeterTouchUI.prototype.hide = GenericUI.prototype.hide;
MeterTouchUI.prototype.refresh = function() {
  var pobj = this.game.getObject(this.game.control);
  if(pobj && pobj.uiMeters) { this.meters = pobj.uiMeters; }
  else { this.meters = undefined; }
  this.clear();
  this.generate();
};

MeterTouchUI.prototype.generate = function() {
  if(!this.meters) { return; }
  var parent = this;
  var colorMat = this.game.display.getMaterial("ui.color");           // Basic color material
  var fontMat  = this.game.display.getMaterial("ui.calibri");         // Font material
  var fontName = "Calibri";                                           // Name of this font for text rendering
  var jumpMat = parent.game.display.getMaterial("character.generic.ui.meterstub");
  
  var black  = util.vec4.make(0.0, 0.0, 0.0, 0.5);
  var white  = util.vec4.make(1.0, 1.0, 1.0, 0.75);
  var swhite = util.vec4.make(1.0, 1.0, 1.0, 1.0);
  var sblack = util.vec4.make(0.0, 0.0, 0.0, 1.0);

  var container = new UIContainer({x: '-', y: '+'});
  
  var s = 128;
  var h = 0;
  
  var protoOnTouch = function(imp, state, window) {
    var h = false;
    for(var i=0;i<state.touch.length;i++) {
      var align = container.makeAlign(window);
      var over = parent.pointInElement(state.touch[i], this, window, align);
      if(over) { this.onHeld(); h = true; state.touch.splice(i, 1); }
    }
    this.isHovered = h;
    return false;
  };
  
  var genButton = function(iconMat, action) {
    return {
      neutral: {
        block: [
          new GenericUIBlock(util.vec2.make(0,h), util.vec2.make(s,s), white, colorMat),
          new GenericUIBlock(util.vec2.make(0,h), util.vec2.make(s,s), sblack, iconMat)
        ],
        text:  []
      },
      hover: {
        block: [
          new GenericUIBlock(util.vec2.make(0,h), util.vec2.make(s,s), black, colorMat),
          new GenericUIBlock(util.vec2.make(0,h), util.vec2.make(s,s), swhite, iconMat)
        ],
        text:  []
      },
      step: protoOnTouch,
      type: action,
      onHeld: function() { parent.game.tchAction.push(this.type); },
      isHovered: false
    };
  };
  
  var ax = [
    "atk",
    "mov",
    "jmp"
  ];
  
  var h = 0;
  for(var i=0;i<this.meters.length;i++) {
    var mtr = this.meters[i];
    switch(mtr.type) {
      case "bar" : { container.add(genButton(mtr.iconMat, ax[i])); break; }
      case "dbr" : { container.add(genButton(mtr.iconMat, ax[i])); break; }
      case "cnt" : { container.add(genButton(mtr.iconMat, ax[i])); break; }
      case "bcc" : { container.add(genButton(mtr.iconMat, ax[i])); break; }
      default : { main.menu.warning.show("Invalid meter element '" + mtr.type + "' : /ui/meter.js::generate()"); break; }
    }
    h += s;
  }
  
  container.add(genButton(jumpMat, ax[2]));

  this.containers.push(container);
};

MeterTouchUI.prototype.pointInElement = GenericUI.prototype.pointInElement;

MeterTouchUI.prototype.step = GenericUI.prototype.step;
MeterTouchUI.prototype.play = GenericUI.prototype.play;
MeterTouchUI.prototype.getDraw = GenericUI.prototype.getDraw;

MeterTouchUI.prototype.clear = GenericUI.prototype.clear;
MeterTouchUI.prototype.destroy = GenericUI.prototype.destroy;