"use strict";
/* global main */
/* global util */
/* global GenericUI */
/* global GenericUIBlock */
/* global GenericUIText */

/* Define Game UI Credit Counter Class */
function CreditUI(game, ui, name) {
  this.total = 0;
  this.addTotal = 0;
  this.adding = 0;
  this.delay = 0;
  
  this.setTotal(main.stats.credits);
  GenericUI.call(this, game, ui, name);
}

CreditUI.prototype.setTotal = function(total) {
  this.total = total;
  this.last = main.stats.credits;
};

CreditUI.prototype.add = function(amount, ssfxId) {
  this.delay = 60;
  this.adding += amount;
  this.addTotal += amount;
  this.last = main.stats.credits;
  
  switch(ssfxId) {
    case 0 : { this.play("ui/score0.wav", 0.5, 0.0); break; }  // Accumulation Points
    case 1 : { this.play("ui/score1.wav", 0.5, 0.0); break; }  // Kill
    case 2 : { this.play("ui/score2.wav", 0.5, 0.0); break; }  // Big Multi Kill
    case 3 : { this.play("ui/score1.wav", 0.5, 0.0); break; }  // Objective
    default : { break; }
  }
};

CreditUI.prototype.setVisible = GenericUI.prototype.setVisible;
CreditUI.prototype.show = GenericUI.prototype.show;
CreditUI.prototype.hide = GenericUI.prototype.hide;

CreditUI.prototype.refresh = function() {
  if(this.delay > 0) { this.delay--; }
  else {
    if(this.adding > 0) { this.adding--; this.total++; }
    else { this.addTotal = 0; }
  }
  this.clear();
  this.generate();
};

CreditUI.prototype.generate = function() {
  var parent = this;
  var colorMat = this.game.display.getMaterial("ui.color");           // Basic color material
  var fontMat  = this.game.display.getMaterial("ui.calibri");         // Font material
  var fontName = "Calibri";                                           // Name of this font for text rendering
  
  var swhite = util.vec4.make(1.0, 1.0, 1.0, 1.0);
  var sblack = util.vec4.make(0.0, 0.0, 0.0, 1.0);
  
  var container = new UIContainer({x: '-', y: '-'});
  
  var h = 0;
  var s = 32;
  var v = s*0.15;
  var a = 8;
  var ll = s*6;
  var CREDIT_MAT = this.game.display.getMaterial("ui.credit");
  var CREDITS = (this.total).toString();
  var CREDITS_ADD = this.addTotal;
  var PLUS_LENGTH = util.font.textLength("+", fontName, s);
  
  var creditElement = {
    neutral: {
      block: [
        new GenericUIBlock(util.vec2.make(0,h), util.vec2.make(ll,s), swhite, colorMat),
        new GenericUIBlock(util.vec2.make(0,h), util.vec2.make(s,s), sblack, CREDIT_MAT)
      ],
      text:  [
        new GenericUIText(util.vec2.make(s+a,h+v), s, sblack, fontName, fontMat, CREDITS)
      ]
    },
    step: function(imp, state, window) { return false; },
    isHovered: false
  };
  container.add(creditElement);
  
  if(this.addTotal > 0) { creditElement.neutral.text.push(new GenericUIText(util.vec2.make(s+a-PLUS_LENGTH,h+v-s), s, swhite, fontName, fontMat, "+" + CREDITS_ADD)); }

  this.containers.push(container);
};

CreditUI.prototype.pointInElement = GenericUI.prototype.pointInElement;

CreditUI.prototype.step = GenericUI.prototype.step;
CreditUI.prototype.play = GenericUI.prototype.play;
CreditUI.prototype.getDraw = GenericUI.prototype.getDraw;

CreditUI.prototype.clear = GenericUI.prototype.clear;
CreditUI.prototype.destroy = GenericUI.prototype.destroy;