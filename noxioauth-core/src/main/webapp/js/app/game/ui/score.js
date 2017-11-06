"use strict";
/* global main */
/* global util */
/* global GenericUI */
/* global GenericUIBlock */
/* global GenericUIText */

/* Define Game UI Debug Menu Class */
function ScoreUI(game, ui, name) {
  GenericUI.call(this, game, ui, name);
  this.data = [];
}

ScoreUI.prototype.setData = function(data) {
  this.data = data;
  this.clear();
  this.generate();
};

ScoreUI.prototype.show = GenericUI.prototype.show;
ScoreUI.prototype.hide = GenericUI.prototype.hide;
ScoreUI.prototype.refresh = function() {
  
};

ScoreUI.prototype.generate = function() {
  var TEST_DATA = [
    {name: "hc", score: "999/0/0"},
    {name: "infernoplus", score: "4/2/0"},
    {name: "hop", score: "gay"},
    {name: "neo", score: "-999/0/0"},
    {name: "test", score: "0/0/0"}
  ];
  
  var parent = this;
  var colorMat = this.game.display.getMaterial("ui.color");           // Basic color material
  var fontMat  = this.game.display.getMaterial("ui.calibri");         // Font material
  var fontName = "Calibri";                                           // Name of this font for text rendering
  
  var clear  = util.vec4.make(0.0, 0.0, 0.0, 0.0);
  var black  = util.vec4.make(0.0, 0.0, 0.0, 0.5);
  var white  = util.vec4.make(1.0, 1.0, 1.0, 0.5);
  var swhite = util.vec4.make(1.0, 1.0, 1.0, 1.0);
  var sblack = util.vec4.make(0.0, 0.0, 0.0, 1.0);
  var sblue = util.vec4.make(0.2421, 0.2421, 0.7539, 1.0);
  var sred = util.vec4.make(0.7539, 0.2421, 0.2421, 1.0);

  var container = new UIContainer({x: '=', y: '='});
  
  var w = 512;
  var sa = 32;
  var sb = 20;
  var sc = 18;
  var va = sa*0.15;
  var vb = sb*0.15;
  var vc = sc*0.15;
  
  var h = 0;
  
  var bwa = w*0.4;
  var bwb = w*0.2;
  var bwc = w*0.4;
  
  for(var i=0;i<TEST_DATA.length;i++) {
    var L = TEST_DATA[i]; i++;
    var R = i<TEST_DATA.length?TEST_DATA[i]:{name: "", score: ""};
    
    var LNAME        = L.name;
    var LNAME_LENGTH = util.font.textLength(LNAME, fontName, sb);

    var LSCORE        = L.score;
    var LSCORE_LENGTH = util.font.textLength(LSCORE, fontName, sc);
    
    var RNAME        = R.name;
    var RNAME_LENGTH = util.font.textLength(RNAME, fontName, sb);

    var RSCORE        = R.score;
    var RSCORE_LENGTH = util.font.textLength(RSCORE, fontName, sc);
    
    var bwaa = 0;
    var bwba = bwa-LSCORE_LENGTH;
    var bwca = 0;
    var bwda = bwc-RSCORE_LENGTH;
    
    this.body = {
      neutral: {
        block: [
          new GenericUIBlock(util.vec2.make(0,h), util.vec2.make(w,sb), black, colorMat)
        ],
        text:  [
          new GenericUIText(util.vec2.make(bwaa,h+vb), sb, swhite, fontName, fontMat, LNAME),
          new GenericUIText(util.vec2.make(bwba,h+vc), sc, swhite, fontName, fontMat, LSCORE),
          new GenericUIText(util.vec2.make(bwa+bwb+bwca,h+vb), sb, swhite, fontName, fontMat, RNAME),
          new GenericUIText(util.vec2.make(bwa+bwb+bwda,h+vc), sc, swhite, fontName, fontMat, RSCORE)
        ]
      },
      step: function(imp, state, window) { return false; },
      isHovered: false
    };
    container.add(this.body);
    h += sb;
  }
  
  var CENTER        = "CENTER";
  var CENTER_LENGTH = util.font.textLength(CENTER, fontName, sa);
  
  var LEFT        = "LEFT";
  var LEFT_LENGTH = util.font.textLength(LEFT, fontName, sb);
  
  var RIGHT        = "RIGHT";
  var RIGHT_LENGTH = util.font.textLength(RIGHT, fontName, sb);
  
  var hwa = w*0.2;
  var hwb = w*0.6;
  var hwc = w*0.2;
  
  var hwaa = 0;
  var hwba = (hwb*0.5)-(CENTER_LENGTH*0.5);
  var hwca = hwc-RIGHT_LENGTH;
  
  this.header = {
    neutral: {
      block: [
        new GenericUIBlock(util.vec2.make(0,h), util.vec2.make(w,sa), swhite, colorMat),
        new GenericUIBlock(util.vec2.make(0,h), util.vec2.make(hwa,sb), sred, colorMat),
        new GenericUIBlock(util.vec2.make(hwa+hwb,h), util.vec2.make(hwc,sb), sblue, colorMat)
      ],
      text:  [
        new GenericUIText(util.vec2.make(0+hwaa,h+vb), sb, swhite, fontName, fontMat, LEFT),
        new GenericUIText(util.vec2.make(hwa+hwba,h+va), sa, sblack, fontName, fontMat, CENTER),
        new GenericUIText(util.vec2.make(hwa+hwb+hwca,h+vb), sb, swhite, fontName, fontMat, RIGHT)
      ]
    },
    step: function(imp, state, window) { return false; },
    isHovered: false
  };
  container.add(this.header);
  
  // Invisible spacer block.
  var o = 325;
  container.add({
    neutral: {
      block: [
        new GenericUIBlock(util.vec2.make(0,h), util.vec2.make(w,o), clear, colorMat)
      ],
      text:  []
    },
    step: function(imp, state, window) { return false; },
    isHovered: false
  });

  this.containers.push(container);
};

ScoreUI.prototype.pointInElement = GenericUI.prototype.pointInElement;

ScoreUI.prototype.step = GenericUI.prototype.step;
ScoreUI.prototype.getDraw = GenericUI.prototype.getDraw;

ScoreUI.prototype.clear = GenericUI.prototype.clear;
ScoreUI.prototype.destroy = GenericUI.prototype.destroy;