"use strict";
/* global main */

/* Define Game UI Class */
function GameUI(game) {
  this.game = game;
  this.elements = [
    new NameUI(this.game, this, "name"),
    new LogUI(this.game, this, "log"),
    new AnnounceUI(this.game, this, "announce"),
    new ScoreUI(this.game, this, "score"),
    new RespawnUI(this.game, this, "respawn"),
    new EndUI(this.game, this, "end"),
    new ObjectiveUI(this.game, this, "objective"),
    new DebugUI(this.game, this, "debug"),
    new OptionUI(this.game, this, "option"),
    new SettingUI(this.game, this, "setting"),
    new AudioUI(this.game, this, "audio"),
    new ControlUI(this.game, this, "control"),
    new MainUI(this.game, this, "main")
  ];
  for(var i=0;i<this.elements.length;i++) {
    this[this.elements[i].name] = this.elements[i];
  }
  
  /* Boolean flags that determine which parts of the UI are visible/hidden */
  this.flags = {
    main: false,
    name: true,
    objective: true,
    log: true,
    announce: true,
    score: false,
    debug: false,
    respawn: false,
    end: false
  };
  this.sub = "main";
}

GameUI.prototype.menuKey = function() {
  this.flags.main = !this.flags.main;
  if(!this.flags.main) { this.sub = "main"; }
};

/* Steps UI and returns true if imp input is absorbed by a UI element */
/* Window is a Vec2 of the size, in pixels, of the game window for this draw */
GameUI.prototype.step = function(imp, state, window) {
  /* Show or hide ui based on current flags */
  if(this.flags.main) {
    this.main.setVisible(this.sub === "main");
    this.option.setVisible(this.sub === "option");
    this.setting.setVisible(this.sub === "setting");
    this.audio.setVisible(this.sub === "audio");
    this.control.setVisible(this.sub === "control");
    this.name.hide();
    this.objective.hide();
    this.log.hide();
    this.announce.hide();
    this.score.hide();
    this.debug.setVisible(this.flags.debug);
    this.respawn.hide();
    this.end.hide();
  }
  else {
    var ded = this.game.control === -1;
    var gam = this.game.gameOver;
    
    this.main.hide();
    this.option.hide();
    this.setting.hide();
    this.audio.hide();
    this.control.hide();
    this.name.setVisible(this.flags.name);
    this.objective.setVisible(this.flags.objective);
    this.log.setVisible(this.flags.log);
    this.announce.setVisible(this.flags.announce);
    this.score.setVisible(this.flags.score||ded||gam);
    this.debug.setVisible(this.flags.debug);
    this.respawn.setVisible(this.flags.respawn||ded);
    this.end.setVisible(this.flags.end||gam);
  }
  
  /* Update ui and pass input through */
  var hit = false;
  for(var i=0;i<this.elements.length;i++) {
    if(this.elements[i].step(imp, state, window)) { hit = true; }
  }
  return hit;
};

/* Window is a Vec2 of the size, in pixels, of the game window for this draw */
GameUI.prototype.getDraw = function(block, texts, window) {
  for(var i=0;i<this.elements.length;i++) {
    this.elements[i].getDraw(block, texts, window);
  }
};


GameUI.prototype.destroy = function() {
  for(var i=0;i<this.elements.length;i++) {
    this.elements[i].destroy();
  }
};
