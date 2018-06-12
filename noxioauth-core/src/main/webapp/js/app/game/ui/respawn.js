"use strict";
/* global main */
/* global util */
/* global GenericUI */
/* global GenericUIBlock */
/* global GenericUIText */

/* Define Game UI Respawn Menu Class */
function RespawnUI(game, ui, name) {
  GenericUI.call(this, game, ui, name);
  this.roundInfo = undefined;
}

RespawnUI.prototype.setRound = function(text) {
  this.roundInfo = text;
};

RespawnUI.prototype.clearRound = function() {
  this.roundInfo = undefined;
};

RespawnUI.prototype.setVisible = GenericUI.prototype.setVisible;
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
  
  var TEXT;
  if(!this.roundInfo) { TEXT = this.game.respawnTimer<=0?"Press [Right Mouse] to respawn!":"Respawn in " + (this.game.respawnTimer/30).toFixed(1) + " seconds!"; }
  else { TEXT = this.roundInfo; }
  
  var TEXT_LENGTH = util.font.textLength(TEXT, fontName, s);
  var o = (w*0.5)-(TEXT_LENGTH*0.5);
  
 this.respawnTimer.neutral.text[0] = new GenericUIText(util.vec2.make(o,h+v), s, swhite, fontName, fontMat, TEXT);
};

RespawnUI.prototype.generate = function() {
  var parent = this;
  var colorMat = this.game.display.getMaterial("ui.color");           // Basic color material
  var fontMat  = this.game.display.getMaterial("ui.calibri");         // Font material
  var fontName = "Calibri";                                           // Name of this font for text rendering

  // Materials and ids used for character select icons, organized into groups
  var LOCKEDMAT = this.game.display.getMaterial("ui.lockIconLarge");
  var SPEC = [
    [
      {id: "inf_n", mat: this.game.display.getMaterial("character.inferno.ui.iconlarge"), lock: !main.unlocks.has("CHAR_INFERNO")}
    ],
    [
      {id: "box_n", mat: this.game.display.getMaterial("character.fox.ui.iconlarge"), lock: !main.unlocks.has("CHAR_BOX")},
      {id: "box_red", mat: this.game.display.getMaterial("character.fox.ui.iconlarge"), lock: !main.unlocks.has("ALT_BOXRED")},
      {id: "box_gld", mat: this.game.display.getMaterial("character.fox.ui.iconlarge"), lock: !main.unlocks.has("ALT_BOXGOLD")}
    ],
    [
      {id: "crt_n", mat: this.game.display.getMaterial("character.falco.ui.iconlarge"), lock: !main.unlocks.has("CHAR_CRATE")},
      {id: "crt_orn", mat: this.game.display.getMaterial("character.falco.ui.iconlarge"), lock: !main.unlocks.has("ALT_CRATEORANGE")}
    ],
    [
      {id: "qua_n", mat: this.game.display.getMaterial("character.marth.ui.iconlarge"), lock: !main.unlocks.has("CHAR_QUAD")},
      {id: "qua_fir", mat: this.game.display.getMaterial("character.marth.ui.iconlarge"), lock: !main.unlocks.has("ALT_QUADFIRE")}
    ],
    [
      {id: "vox_n", mat: this.game.display.getMaterial("character.shiek.ui.iconlarge"), lock: !main.unlocks.has("CHAR_VOXEL")},
      {id: "vox_grn", mat: this.game.display.getMaterial("character.shiek.ui.iconlarge"), lock: !main.unlocks.has("ALT_VOXELGREEN")}
    ],
    [
      {id: "blk_n", mat: this.game.display.getMaterial("character.puff.ui.iconlarge"), lock: !main.unlocks.has("CHAR_BLOCK")},
      {id: "blk_rnd", mat: this.game.display.getMaterial("character.puff.ui.iconlarge"), lock: !main.unlocks.has("ALT_BLOCKROUND")}
    ],
    [
      {id: "crg_n", mat: this.game.display.getMaterial("character.captain.ui.iconlarge"), lock: !main.unlocks.has("CHAR_CARGO")}
    ]
  ];
  
  var black  = util.vec4.make(0.0, 0.0, 0.0, 0.5);
  var white  = util.vec4.make(1.0, 1.0, 1.0, 0.75);
  var swhite = util.vec4.make(1.0, 1.0, 1.0, 1.0);
  var sblack = util.vec4.make(0.0, 0.0, 0.0, 1.0);
  
  var container = new UIContainer({x: '=', y: '='});
  
  /* Reuseable 'checks if clicked then calls an onclick function' */
  var protoOnClick = function(imp, state, window) {
    if(parent.game.charSelect === this.charId) { this.isHovered = true; }
    for(var i=0;i<imp.mouse.length;i++) {
      var align = container.makeAlign(window);
      var over = parent.pointInElement(imp.mouse[i].pos, this, window, align);
      if(imp.mouse[i].btn === 0) {
        if(over) { this.onClick(); parent.play("ui/button2.wav", 0.5, 0.0); return true; }
        else { this.offClick();    return false; }
      }
      else {
        if(over) { return true; }
        else { return false; }
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
  var b = 112;
  var bh = b*0.33333;
  var t = SPEC.length;
  
  for(var i=0;i<t;i++) {
    o = (w*0.5)-(i*b)+(t*b-(t*b*0.5))-b;
    if(!SPEC[i][0].lock) {
      container.add({
        neutral: {
          block: [
            new GenericUIBlock(util.vec2.make(o,h), util.vec2.make(b,b), black, colorMat),
            new GenericUIBlock(util.vec2.make(o,h), util.vec2.make(b,b), swhite, SPEC[i][0].mat)
          ],
          text:  []
        },
        hover: {
          block: [
            new GenericUIBlock(util.vec2.make(o,h), util.vec2.make(b,b), white, colorMat),
            new GenericUIBlock(util.vec2.make(o,h), util.vec2.make(b,b), sblack, SPEC[i][0].mat)
          ],
          text:  [],
          sound: {path: "ui/button0.wav", gain: 0.5, shift: 0.0}
        },
        step: protoOnClick,
        onClick: function() { parent.game.charSelect = this.charId; },
        offClick: function() { },
        charId: SPEC[i][0].id,
        isHovered: false
      });
    }
    else {
      container.add({
        neutral: {
          block: [
            new GenericUIBlock(util.vec2.make(o,h), util.vec2.make(b,b), black, colorMat),
            new GenericUIBlock(util.vec2.make(o,h), util.vec2.make(b,b), swhite, LOCKEDMAT)
          ],
          text:  []
        },
        step: function() { },
        isHovered: false
      });
    }
    var hh = h+b;
    var bho = o+((b-bh)*0.5);
    for(var j=1;j<SPEC[i].length;j++) {
      if(SPEC[i][j].lock) { continue; }
      container.add({
        neutral: {
          block: [
            new GenericUIBlock(util.vec2.make(o,hh), util.vec2.make(b,bh), black, colorMat),
            new GenericUIBlock(util.vec2.make(bho,hh), util.vec2.make(bh,bh), swhite, SPEC[i][j].mat)
          ],
          text:  []
        },
        hover: {
          block: [
            new GenericUIBlock(util.vec2.make(o,hh), util.vec2.make(b,bh), white, colorMat),
            new GenericUIBlock(util.vec2.make(bho,hh), util.vec2.make(bh,bh), sblack, SPEC[i][j].mat)
          ],
          text:  [],
          sound: {path: "ui/button0.wav", gain: 0.5, shift: 0.0}
        },
        step: protoOnClick,
        onClick: function() { parent.game.charSelect = this.charId; },
        offClick: function() { },
        charId: SPEC[i][j].id,
        isHovered: false
      });
      hh += bh;
    }
  }
  
  this.containers.push(container);
};

RespawnUI.prototype.pointInElement = GenericUI.prototype.pointInElement;

RespawnUI.prototype.step = GenericUI.prototype.step;
RespawnUI.prototype.play = GenericUI.prototype.play;
RespawnUI.prototype.getDraw = GenericUI.prototype.getDraw;

RespawnUI.prototype.clear = GenericUI.prototype.clear;
RespawnUI.prototype.destroy = GenericUI.prototype.destroy;