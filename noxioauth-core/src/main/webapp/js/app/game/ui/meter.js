"use strict";
/* global main */
/* global util */
/* global GenericUI */
/* global GenericUIBlock */
/* global GenericUIText */

/* Define Game UI Debug Menu Class */
function MeterUI(game, ui, name) {
  this.FADE_OUT_TIME = 20;
  this.meters = undefined;
  GenericUI.call(this, game, ui, name);
}

MeterUI.prototype.setVisible = GenericUI.prototype.setVisible;
MeterUI.prototype.show = GenericUI.prototype.show;
MeterUI.prototype.hide = GenericUI.prototype.hide;
MeterUI.prototype.refresh = function() {
  var pobj = this.game.getObject(this.game.control);
  if(pobj && pobj.uiMeters) { this.meters = pobj.uiMeters; }
  else { this.meters = undefined; }
  this.clear();
  this.generate();
};

MeterUI.prototype.generate = function() {
  if(!this.meters) { return; }
  var parent = this;
  var colorMat = this.game.display.getMaterial("ui.color");           // Basic color material
  var fontMat  = this.game.display.getMaterial("ui.calibri");         // Font material
  var fontName = "Calibri";                                           // Name of this font for text rendering
  
  var black  = util.vec4.make(0.0, 0.0, 0.0, 0.5);
  var white  = util.vec4.make(1.0, 1.0, 1.0, 0.75);
  var swhite = util.vec4.make(1.0, 1.0, 1.0, 1.0);
  var sblack = util.vec4.make(0.0, 0.0, 0.0, 1.0);
  var clear = util.vec4.make(0.0, 0.0, 0.0, 0.0);
  var sred   = util.vec4.make(1.0, 0.0, 0.0, 1.0);

  var container = new UIContainer({x: '+', y: '+'});
  
  var s = 32;
  
  var genBarMeter = function(iconMat, w, h, scalar) {
    return {
      neutral: {
        block: [
          new GenericUIBlock(util.vec2.make(0,h), util.vec2.make(w,s), black, colorMat),
          new GenericUIBlock(util.vec2.make(0,h), util.vec2.make(((w-s)*scalar)+s,s), white, colorMat),
          new GenericUIBlock(util.vec2.make(0,h), util.vec2.make(s,s), sblack, iconMat)
        ],
        text:  []
      },
      step: function(imp, state, window) { return false; },
      isHovered: false
    };
  };
  
  var genDoubleBarMeter = function(iconMat, w, h, scalara, scalarb) {
    var va = s*0.3333;
    var vb = s*0.3334;
    return {
      neutral: {
        block: [
          new GenericUIBlock(util.vec2.make(0,h), util.vec2.make(w,s), black, colorMat),
          new GenericUIBlock(util.vec2.make(0,h), util.vec2.make(((w-s)*scalara)+s,va), white, colorMat),
          new GenericUIBlock(util.vec2.make(0,h+va), util.vec2.make(((w-s)*scalarb)+s,vb), white, colorMat),
          new GenericUIBlock(util.vec2.make(0,h+va+vb), util.vec2.make(((w-s)*scalara)+s,va), white, colorMat),
          new GenericUIBlock(util.vec2.make(0,h), util.vec2.make(s,s), sblack, iconMat)
        ],
        text:  []
      },
      step: function(imp, state, window) { return false; },
      isHovered: false
    };
  };
  
  var genCounterMeter = function(iconMat, w, h, cnt, max) {
    var a = s*0.25;
    var v = s*0.5;
    var d = s*0.5;
    var mtr = {
      neutral: {
        block: [
          new GenericUIBlock(util.vec2.make(0,h), util.vec2.make(w,s), black, colorMat),
          new GenericUIBlock(util.vec2.make(0,h), util.vec2.make(s,s), white, colorMat),
          new GenericUIBlock(util.vec2.make(0,h), util.vec2.make(s,s), sblack, iconMat)
        ],
        text:  []
      },
      step: function(imp, state, window) { return false; },
      isHovered: false
    };
    var l = (w-s)/max;
    for(var i=0;i<cnt;i++) {
      var o = s+(l*i);
      mtr.neutral.block.push(new GenericUIBlock(util.vec2.make(o+d,h+a), util.vec2.make(l-(d*2),v), white, colorMat));
    }
    return mtr;
  };
  
  var genBarCountMeter = function(iconMat, w, h, scalar, cnt, max) {
    var v = s*0.5;
    var d = s*0.25;
    var mtr = {
      neutral: {
        block: [
          new GenericUIBlock(util.vec2.make(0,h), util.vec2.make(w,s), black, colorMat),
          new GenericUIBlock(util.vec2.make(0,h), util.vec2.make(s,s), white, colorMat),
          new GenericUIBlock(util.vec2.make(s,h), util.vec2.make((w-s)*scalar,v), white, colorMat),
          new GenericUIBlock(util.vec2.make(0,h), util.vec2.make(s,s), sblack, iconMat)
        ],
        text:  []
      },
      step: function(imp, state, window) { return false; },
      isHovered: false
    };
    var l = ((w-s)/max);
    for(var i=0;i<cnt;i++) {
      var o = s+(l*i);
      mtr.neutral.block.push(new GenericUIBlock(util.vec2.make(o+d,h+v), util.vec2.make(l-d,v), white, colorMat));
    }
    return mtr;
  };
  
  var h = 0;
  
  for(var i=0;i<this.meters.length;i++) {
    var mtr = this.meters[i];
    switch(mtr.type) {
      case "bar" : { container.add(genBarMeter(mtr.iconMat, mtr.length*s, h, mtr.scalar)); break; }
      case "dbr" : { container.add(genDoubleBarMeter(mtr.iconMat, mtr.length*s, h, mtr.scalara, mtr.scalarb)); break; }
      case "cnt" : { container.add(genCounterMeter(mtr.iconMat, mtr.length*s, h, mtr.count, mtr.max)); break; }
      case "bcc" : { container.add(genBarCountMeter(mtr.iconMat, mtr.length*s, h, mtr.scalar, mtr.count, mtr.max)); break; }
      default : { main.menu.warning.show("Invalid meter element '" + mtr.type + "' : /ui/meter.js::generate()"); break; }
    }
    h += s;
  }
  
  h += 4;
  
  var ts = 16;
  var to = 2;
  
  var PING        = "Ping [ " + this.game.ping + "ms ]";
  var PING_LENGTH = util.font.textLength(PING, fontName, s) + (to*2);
  
  var HUD_STATUS = PING;
  if (main.settings.graphics.showFPS) {
    var fps = this.game.debug.fAvg.toFixed(0);
    HUD_STATUS += " | FPS [ " + fps + " ]";
  }
  var STATUS_LENGTH = util.font.textLength(HUD_STATUS, fontName, s) + (to*2);

  container.add({
    neutral: {
      block: [new GenericUIBlock(util.vec2.make(to,h), util.vec2.make(STATUS_LENGTH,ts), clear, colorMat)],
      text:  [new GenericUIText(util.vec2.make(to,h), ts, (this.game.ping > 250 ? sred : swhite), fontName, fontMat, HUD_STATUS)]
    },
    step: function(imp, state, window) { return false; },
    isHovered: false
  });
    
  h += ts;

  this.containers.push(container);
};

MeterUI.prototype.pointInElement = GenericUI.prototype.pointInElement;

MeterUI.prototype.step = GenericUI.prototype.step;
MeterUI.prototype.play = GenericUI.prototype.play;
MeterUI.prototype.getDraw = GenericUI.prototype.getDraw;

MeterUI.prototype.clear = GenericUI.prototype.clear;
MeterUI.prototype.destroy = GenericUI.prototype.destroy;