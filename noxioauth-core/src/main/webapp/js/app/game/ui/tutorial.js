"use strict";
/* global main */
/* global util */
/* global GenericUI */
/* global GenericUIBlock */
/* global GenericUIText */

/* Define Game UI Tutorial Class */
function TutorialUI(game, ui, name, mat) {
  this.tutorialMaterial = mat;
  GenericUI.call(this, game, ui, name);
}

TutorialUI.prototype.setVisible = GenericUI.prototype.setVisible;
TutorialUI.prototype.show = GenericUI.prototype.show;
TutorialUI.prototype.hide = GenericUI.prototype.hide;

TutorialUI.prototype.refresh = GenericUI.prototype.refresh;

TutorialUI.prototype.generate = function() {
  var parent = this;
  var colorMat = this.game.display.getMaterial("ui.color");           // Basic color material
  var fontMat  = this.game.display.getMaterial("ui.calibri");         // Font material
  var fontName = "Calibri";                                           // Name of this font for text rendering
  
  var swhite = util.vec4.make(1.0, 1.0, 1.0, 1.0);
  var black = util.vec4.make(0.0, 0.0, 0.0, 0.5);
  
  var container = new UIContainer({x: '=', y: '='});
  
  var w = 2048;
  var h = 256;
  
  this.tutorialElement = {
    neutral: {
      block: [
        new GenericUIBlock(util.vec2.make(0,0), util.vec2.make(w,h), black, colorMat),
        new GenericUIBlock(util.vec2.make((w*.5)-h,0), util.vec2.make(h*(2.),h), swhite, this.tutorialMaterial)
      ],
      text:  []
    },
    step: function(imp, state, window) { return false; },
    isHovered: false
  };
  container.add(this.tutorialElement);
  
  this.containers.push(container);
};

TutorialUI.prototype.pointInElement = GenericUI.prototype.pointInElement;

TutorialUI.prototype.step = GenericUI.prototype.step;
TutorialUI.prototype.play = GenericUI.prototype.play;
TutorialUI.prototype.getDraw = GenericUI.prototype.getDraw;

TutorialUI.prototype.clear = GenericUI.prototype.clear;
TutorialUI.prototype.destroy = GenericUI.prototype.destroy;