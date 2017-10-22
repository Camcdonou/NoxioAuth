"use strict";
/* global main */
/* global util */
/* global GenericUI */
/* global GenericUIBlock */
/* global GenericUIText */

/* Define Game UI Main Menu Class */
function MainUI(game, name) {
  GenericUI.call(this, game, name);
}

MainUI.prototype.show = GenericUI.prototype.show;
MainUI.prototype.hide = GenericUI.prototype.hide;
MainUI.prototype.refresh = GenericUI.prototype.refresh;

MainUI.prototype.generate = function() {
  var colorMat = this.game.display.getMaterial("ui.color");           // Basic color material
  var fontMat  = this.game.display.getMaterial("ui.gulm");            // Font material
  
  var red    = util.vec4.make(1.0, 0.0, 0.0, 0.5);
  var blue   = util.vec4.make(0.0, 0.0, 1.0, 0.5);
  var black  = util.vec4.make(0.0, 0.0, 0.0, 0.5);
  
  var syellow = util.vec4.make(1.0, 1.0, 0.0, 1.0);
  var sred    = util.vec4.make(1.0, 0.0, 0.0, 1.0);
  var sblue   = util.vec4.make(0.0, 0.0, 1.0, 1.0);
  var swhite  = util.vec4.make(1.0, 1.0, 1.0, 1.0);
  
  var h = 0.0;
  
  var parent = this;
  
  this.elements.push({
    align: {x: '=', y: '='},
    neutral: {
      block: [new GenericUIBlock(util.vec2.make(0,h), util.vec2.make(66,3), black, colorMat)],
      text:  [new GenericUIText(util.vec2.make(0,h), 3, swhite, fontMat, "Do not shift click me.")]
    },
    hover: {
      block: [new GenericUIBlock(util.vec2.make(0,h), util.vec2.make(66,3), red, colorMat)],
      text:  [new GenericUIText(util.vec2.make(0,h), 3, swhite, fontMat, "Do not shift click me.")]
    },
    step: function(imp, state, window) {
      for(var i=0;i<imp.mouse.length;i++) {
        if(imp.mouse[i].btn === 0 && state.keyboard.keys[16] && parent.pointInElement(imp.mouse[i].pos, this, window)) { this.onClick(); }
      }
      if(this.clicked) {
        if(this.tog = !this.tog) { this.neutral.text[0].pos.x += 0.1; this.hover.text[0].pos.x += 0.1; }
        else                     { this.neutral.text[0].pos.x -= 0.1; this.hover.text[0].pos.x -= 0.1; }
      }
      return false;
    },
    onClick: function() {
      this.clicked = true; this.neutral.text[0].text = "ANGERY NOISES"; this.hover.text[0].text = "ANGERY NOISES";
      this.neutral.text[0].color = sred; this.hover.text[0].color = sred;
      this.neutral.block[0].color = red; this.hover.block[0].color = red;
    },
    isHovered: false
  });
  
  h+=3;
  
  this.elements.push({
    align: {x: '=', y: '='},
    neutral: {
      block: [new GenericUIBlock(util.vec2.make(0,h), util.vec2.make(66,3), black, colorMat)],
      text:  [new GenericUIText(util.vec2.make(0,h), 3, swhite, fontMat, "Hover me.")]
    },
    hover: {
      block: [new GenericUIBlock(util.vec2.make(0,h), util.vec2.make(66,3), red, colorMat)],
      text:  [new GenericUIText(util.vec2.make(0,h), 3, swhite, fontMat, "Thanks fam!")]
    },
    step: function(imp, state, window) { return false; },
    isHovered: false
  });
  
  h+=3;
  
  this.elements.push({
    align: {x: '=', y: '='},
    neutral: {
      block: [new GenericUIBlock(util.vec2.make(0,h), util.vec2.make(66,3), black, colorMat)],
      text:  [new GenericUIText(util.vec2.make(0,h), 3, swhite, fontMat, "Click me.")]
    },
    hover: {
      block: [new GenericUIBlock(util.vec2.make(0,h), util.vec2.make(66,3), blue, colorMat)],
      text:  [new GenericUIText(util.vec2.make(0,h), 3, swhite, fontMat, "Click me.")]
    },
    step: function(imp, state, window) {
      for(var i=0;i<imp.mouse.length;i++) {
        if(imp.mouse[i].btn === 0 && parent.pointInElement(imp.mouse[i].pos, this, window)) { this.onClick(); }
      }
      if(this.clicked) {
        if(this.tog = !this.tog) { this.neutral.text[0].color = syellow; this.hover.text[0].color = syellow; }
        else                     { this.neutral.text[0].color = sred; this.hover.text[0].color = sred; }
      }
      return false;
    },
    onClick: function() { this.clicked = true; this.neutral.text[0].text = "Aww yee~"; this.hover.text[0].text = "Aww yee~"; },
    isHovered: false
  });
  
  h+=3;
  
  this.elements.push({
    align: {x: '=', y: '='},
    neutral: {
      block: [new GenericUIBlock(util.vec2.make(0,h), util.vec2.make(66,3), black, colorMat)],
      text:  [new GenericUIText(util.vec2.make(0,h), 3, swhite, fontMat, "Focus me.")]
    },
    hover: {
      block: [new GenericUIBlock(util.vec2.make(0,h), util.vec2.make(66,3), blue, colorMat)],
      text:  [new GenericUIText(util.vec2.make(0,h), 3, swhite, fontMat, "Focus me.")]
    },
    step: function(imp, state, window) {
      for(var i=0;i<imp.mouse.length;i++) {
        if(imp.mouse[i].btn === 0) { 
          if(parent.pointInElement(imp.mouse[i].pos, this, window)) { this.onClick(); }
          else                                                      { this.onFocusLost(); }
        }
      }
      return false;
    },
    onClick: function() { this.neutral.block[0].color = sblue; this.hover.block[0].color = sblue; },
    onFocusLost: function() { this.neutral.block[0].color = black; this.hover.block[0].color = blue; },
    isHovered: false
  });
  
  h+=3;
  
  this.elements.push({
    align: {x: '=', y: '='},
    neutral: {
      block: [new GenericUIBlock(util.vec2.make(0,h), util.vec2.make(66,3), black, colorMat)],
      text:  [new GenericUIText(util.vec2.make(0,h), 3, swhite, fontMat, "Press T or F")]
    },
    hover: {
      block: [new GenericUIBlock(util.vec2.make(0,h), util.vec2.make(66,3), red, colorMat)],
      text:  [new GenericUIText(util.vec2.make(0,h), 3, swhite, fontMat, "Press T or F")]
    },
    step: function(imp, state, window) {
      if(state.keyboard.keys[84]) {
        this.neutral.block[0].color = sblue; this.hover.block[0].color = sblue;
      }
      else if(state.keyboard.keys[70]) {
        this.neutral.block[0].color = syellow; this.hover.block[0].color = syellow;
      }
      else {
        this.neutral.block[0].color = black; this.hover.block[0].color = red;
      }
      return false;
    },
    isHovered: false
  });
};

MainUI.prototype.pointInElement = GenericUI.prototype.pointInElement;

MainUI.prototype.step = GenericUI.prototype.step;
MainUI.prototype.getDraw = GenericUI.prototype.getDraw;

MainUI.prototype.destroy = function() { };