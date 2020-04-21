"use strict";
/* global main */
/* global util */
/* global GenericUI */
/* global GenericUIBlock */
/* global GenericUIText */

/* Define Touch Thumbstick Drawing Class */
function ThumbTouchUI(game, ui, name) {
  GenericUI.call(this, game, ui, name);
}

ThumbTouchUI.prototype.setVisible = GenericUI.prototype.setVisible;
ThumbTouchUI.prototype.show = GenericUI.prototype.show;
ThumbTouchUI.prototype.hide = GenericUI.prototype.hide;

ThumbTouchUI.prototype.refresh = function() {
  this.clear();
  
  var parent = this;
  var outMat = this.game.display.getMaterial("ui.thumbout");              // Thumbstick outer ring
  var inMat = this.game.display.getMaterial("ui.thumbin");                // Thumbstick inner ring
  
  var swhite = util.vec4.make(1.0, 1.0, 1.0, 1.0);
  
  var container = new UIContainer({x: '/', y: '/'});

  var s = 120;
  
  if(parent.game.thumb.id === undefined) { return; }
  
  var pos = parent.game.thumb.origin;
  var adj = util.vec2.magnitude(parent.game.thumb.offset) < s*.5 ? parent.game.thumb.offset : util.vec2.scale(util.vec2.normalize(parent.game.thumb.offset), s*.5);
  var off = util.vec2.add(pos, adj);
  var dispH = this.game.display.window.height;
  
  container.add({
    neutral: {
      block: [
        new GenericUIBlock(util.vec2.make(pos.x-(s*.5),(dispH-pos.y)-(s*.5)), util.vec2.make(s,s), swhite, outMat),
        new GenericUIBlock(util.vec2.make(off.x-(s*.5),(dispH-off.y)-(s*.5)), util.vec2.make(s,s), swhite, inMat)
      ],
      text:  []
    },
    step: function(imp, state, window) { return false; },
    isHovered: false
  });
  
  this.containers.push(container);
};

ThumbTouchUI.prototype.generate = function() {
  /* Since this UI is updated every frame all relevant code is in refresh() */
};

ThumbTouchUI.prototype.pointInElement = GenericUI.prototype.pointInElement;

ThumbTouchUI.prototype.step = GenericUI.prototype.step;
ThumbTouchUI.prototype.play = GenericUI.prototype.play;
ThumbTouchUI.prototype.getDraw = GenericUI.prototype.getDraw;

ThumbTouchUI.prototype.clear = GenericUI.prototype.clear;
ThumbTouchUI.prototype.destroy = GenericUI.prototype.destroy;