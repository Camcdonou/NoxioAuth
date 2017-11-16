"use strict";
/* global main */
/* global util */
/* global GenericUI */
/* global GenericUIBlock */
/* global GenericUIText */

/* Define Game UI Debug Menu Class */
function ScoreUI(game, ui, name) {
  this.teams = [0,0];
  this.scores = [];
  GenericUI.call(this, game, ui, name);
}

ScoreUI.prototype.setScores = function(teamScs, scs) {
  this.teams = teamScs;
  this.scores = scs;
  this.clear();
  this.generate();
};

ScoreUI.prototype.setVisible = GenericUI.prototype.setVisible;
ScoreUI.prototype.show = GenericUI.prototype.show;
ScoreUI.prototype.hide = GenericUI.prototype.hide;
ScoreUI.prototype.refresh = GenericUI.prototype.refresh;

ScoreUI.prototype.generate = function() {
  var SPEC_HEAD = {
    gametype: "CTF",
    teams: 2,
    scoreToWin: 3,
    objective: 1
  };
  
  var SPEC_BODY = [
    {name: "infernoplus", team: 0, kill: 0, death: 0, objective: 0},
    {name: "neo", team: 0, kill: 3, death: 999, objective: 2},
    {name: "hc", team: 0, kill: 0, death: 0, objective: 2},
    {name: "oshitwaddup", team: 0, kill: 0, death: 0, objective: 0},
    {name: "datboi", team: 1, kill: 999, death: 1, objective: 2}
  ];
  
  var SPEC_HEAD = this.game.settings;
  var SPEC_BODY = this.scores;
   
  var parent = this;
  var colorMat = this.game.display.getMaterial("ui.color");           // Basic color material
  var fontMat  = this.game.display.getMaterial("ui.calibri");         // Font material
  var fontName = "Calibri";                                           // Name of this font for text rendering
  
  var clear  = util.vec4.make(0.0, 0.0, 0.0, 0.0);
  var black  = util.vec4.make(0.0, 0.0, 0.0, 0.5);
  var white  = util.vec4.make(1.0, 1.0, 1.0, 0.5);
  var blue = util.vec4.make(0.2421, 0.2421, 0.7539, 0.75);
  var red = util.vec4.make(0.7539, 0.2421, 0.2421, 0.75);
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
  
  var LEFT = []; var RIGHT = [];
  if(SPEC_HEAD.teams === 2) {
    for(var i=0;i<SPEC_BODY.length;i++) {
      if(SPEC_BODY[i].team === 0) { LEFT.push(SPEC_BODY[i]); }
      else                       { RIGHT.push(SPEC_BODY[i]); }
    }
  }
  else {
    var ULTIMATE_VARIABLE_OwO = true;
    for(var i=0;i<SPEC_BODY.length;i++) {
      if(ULTIMATE_VARIABLE_OwO) { LEFT.push(SPEC_BODY[i]); }
      else                       { RIGHT.push(SPEC_BODY[i]); }
      ULTIMATE_VARIABLE_OwO = !ULTIMATE_VARIABLE_OwO;
    }
  }
  
  for(var i=0;i<LEFT.length||i<RIGHT.length;i++) {
    var L = i<LEFT.length?LEFT[i]:undefined;
    var R = i<RIGHT.length?RIGHT[i]:undefined;
    
    var LNAME        = L?L.name:"";
    var LNAME_LENGTH = util.font.textLength(LNAME, fontName, sb);

    var LSCORE        = L?((SPEC_HEAD.objective!==0?(L.objective+"/"):"")+L.kill + "/" + L.death):"";
    var LSCORE_LENGTH = util.font.textLength(LSCORE, fontName, sc);
    
    var RNAME        = R?R.name:"";
    var RNAME_LENGTH = util.font.textLength(RNAME, fontName, sb);

    var RSCORE        = R?((SPEC_HEAD.objective!==0?(R.objective+"/"):"")+R.kill + "/" + R.death):"";
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
    if(SPEC_HEAD.teams < 2) {
      var moff = 6;
      var mlen = (bwb*0.5);
      var mhoff = sb*0.25;
      var mhs = sb*0.5;

      var mla = bwa-(moff*0.5);
      var mlb = mla+mlen;
      
      if(L) {
        var LEFT_METER  = SPEC_HEAD.objective===0?Math.min(L.kill/SPEC_HEAD.scoreToWin, 1):Math.min(L.objective/SPEC_HEAD.scoreToWin, 1);
        this.body.neutral.block.push(new GenericUIBlock(util.vec2.make(mla+moff,h+mhoff), util.vec2.make(mlen-moff, mhs), white, colorMat));
        this.body.neutral.block.push(new GenericUIBlock(util.vec2.make(mla+moff,h+mhoff), util.vec2.make((mlen-moff)*LEFT_METER, mhs), white, colorMat));
      }
      if(R) {
        var RIGHT_METER = SPEC_HEAD.objective===0?Math.min(R.kill/SPEC_HEAD.scoreToWin, 1):Math.min(R.objective/SPEC_HEAD.scoreToWin, 1);
        this.body.neutral.block.push(new GenericUIBlock(util.vec2.make(mlb+moff,h+mhoff), util.vec2.make(mlen-moff, mhs), white, colorMat));
        this.body.neutral.block.push(new GenericUIBlock(util.vec2.make(mlb+moff,h+mhoff), util.vec2.make((mlen-moff)*RIGHT_METER, mhs), white, colorMat));
      }
    }
    container.add(this.body);
    h += sb;
  }
  
  var CENTER        = SPEC_HEAD.gametype;
  var CENTER_LENGTH = util.font.textLength(CENTER, fontName, sa);
  
  var LEFT        = "Red";
  var LEFT_LENGTH = util.font.textLength(LEFT, fontName, sb);
  
  var RIGHT        = "Blue";
  var RIGHT_LENGTH = util.font.textLength(RIGHT, fontName, sb);
  
  var hwa = w*0.2;
  var hwb = w*0.6;
  var hwc = w*0.2;
  
  var hwaa = 0;
  var hwba = (hwb*0.5)-(CENTER_LENGTH*0.5);
  var hwca = hwc-RIGHT_LENGTH;
  
  this.header = {
    neutral: {
      block: [new GenericUIBlock(util.vec2.make(0,h), util.vec2.make(w,sa), swhite, colorMat)],
      text:  [new GenericUIText(util.vec2.make(hwa+hwba,h+va), sa, sblack, fontName, fontMat, CENTER)]
    },
    step: function(imp, state, window) { return false; },
    isHovered: false
  };
  if(SPEC_HEAD.teams >= 2) {
    var LEFT_METER  = Math.min(this.teams[0]/SPEC_HEAD.scoreToWin, 1);
    var RIGHT_METER = Math.min(this.teams[1]/SPEC_HEAD.scoreToWin, 1);
    
    this.header.neutral.block.push(new GenericUIBlock(util.vec2.make(0,h), util.vec2.make(hwa,sb), sred, colorMat));
    this.header.neutral.block.push(new GenericUIBlock(util.vec2.make(hwa+hwb,h), util.vec2.make(hwc,sb), sblue, colorMat));
    this.header.neutral.block.push(new GenericUIBlock(util.vec2.make(0,h+sb), util.vec2.make(hwa*LEFT_METER,sa-sb), red, colorMat));
    this.header.neutral.block.push(new GenericUIBlock(util.vec2.make(hwa+hwb+(hwc*(1.0-RIGHT_METER)),h+sb), util.vec2.make(hwc*RIGHT_METER,sa-sb), blue, colorMat));
    this.header.neutral.text.push(new GenericUIText(util.vec2.make(0+hwaa,h+vb), sb, swhite, fontName, fontMat, LEFT));
    this.header.neutral.text.push(new GenericUIText(util.vec2.make(hwa+hwb+hwca,h+vb), sb, swhite, fontName, fontMat, RIGHT));
  }
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