"use strict";
/* global main */
/* global util */
/* global GenericUI */
/* global GenericUIBlock */
/* global GenericUIText */

/* Define Game UI Debug Menu Class */
function AnnounceUI(game, ui, name) {
  this.lines = []; /* {text: "You killed Jesus", inverse: true, time: 180} */
  this.FADE_OUT_TIME = 20;
  GenericUI.call(this, game, ui, name);
}

AnnounceUI.prototype.addLine = function(text, inverse) {
  this.lines.unshift({text: text, inverse: inverse, time: 180});
};

AnnounceUI.prototype.setVisible = GenericUI.prototype.setVisible;
AnnounceUI.prototype.show = GenericUI.prototype.show;
AnnounceUI.prototype.hide = GenericUI.prototype.hide;
AnnounceUI.prototype.refresh = function() {
  this.clear();
  for(var i=0;i<this.lines.length;i++) {
    if(--this.lines[i].time < 1) {
      this.lines.splice(i--,1);
    }
  }
  this.generate();
};

AnnounceUI.prototype.generate = function() {
  var parent = this;
  var colorMat = this.game.display.getMaterial("ui.color");           // Basic color material
  var fontMat  = this.game.display.getMaterial("ui.calibri");         // Font material
  var fontName = "Calibri";                                           // Name of this font for text rendering
  
  var black  = util.vec4.make(0.0, 0.0, 0.0, 0.5);
  var white  = util.vec4.make(1.0, 1.0, 1.0, 0.75);
  var swhite = util.vec4.make(1.0, 1.0, 1.0, 1.0);
  var sblack = util.vec4.make(0.0, 0.0, 0.0, 1.0);

  var container = new UIContainer({x: '+', y: '-'});
  
  var w = 512;
  var s = 32;
  var v = s*0.15;
  var a = 8;
  
  var h = 0;

  var SPEC = this.lines;
  for(var i=0;i<SPEC.length;i++) {
    var fade = Math.max(0, Math.min(1, SPEC[i].time/this.FADE_OUT_TIME));
    var bclr = util.vec4.copy(SPEC[i].inverse?white:black); bclr.w *= fade;
    var tclr = util.vec4.copy(SPEC[i].inverse?sblack:swhite); tclr.w *= fade;
    container.add({
      neutral: {
        block: [
          new GenericUIBlock(util.vec2.make(0,h), util.vec2.make(w,s), bclr, colorMat)
        ],
        text:  [
          new GenericUIText(util.vec2.make(a,h+v), s, tclr, fontName, fontMat, SPEC[i].text)
        ]
      },
      step: function(imp, state, window) { return false; },
      isHovered: false
    });
    h+=s;
  }

  this.containers.push(container);
};

AnnounceUI.prototype.pointInElement = GenericUI.prototype.pointInElement;

AnnounceUI.prototype.step = GenericUI.prototype.step;
AnnounceUI.prototype.play = GenericUI.prototype.play;
AnnounceUI.prototype.getDraw = GenericUI.prototype.getDraw;

AnnounceUI.prototype.clear = GenericUI.prototype.clear;
AnnounceUI.prototype.destroy = GenericUI.prototype.destroy;