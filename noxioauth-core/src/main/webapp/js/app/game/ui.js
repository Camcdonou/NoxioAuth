"use strict";
/* global main */

/* Define Game UI Class */
function GameUI(game) {
  this.game = game;
  this.hide = false; // Hides all UI

  
  if(!localStorage.getItem("firstGameTutorial")){
    localStorage.setItem("firstGameTutorial",true);
    this.showTutorial = true;
  }
  else { this.showTutorial = false; }
  
  this.elements = [
    new NameUI(this.game, this, "name"),
    new ObjectiveUI(this.game, this, "objective"),
    new LogUI(this.game, this, "log"),
    new CreditUI(this.game, this, "credit"),
    new MeterUI(this.game, this, "meter"),
    new MeterTouchUI(this.game, this, "meterTouch"),
    new ThumbTouchUI(this.game, this, "thumb"),
    new AnnounceUI(this.game, this, "announce"),
    new ScoreUI(this.game, this, "score"),
    new RespawnUI(this.game, this, "respawn"),
    new RespawnTouchUI(this.game, this, "respawnTouch"),
    new EndUI(this.game, this, "end"),
    new DebugUI(this.game, this, "debug"),
    new OptionUI(this.game, this, "option"),
    new SettingUI(this.game, this, "setting"),
    new AudioUI(this.game, this, "audio"),
    new ControlUI(this.game, this, "control"),
    new GraphicUI(this.game, this, "graphic"),
    new MenuTouchUI(this.game, this, "menu"),
    new MainUI(this.game, this, "main")
  ];
  for(var i=0;i<this.elements.length;i++) {
    this[this.elements[i].name] = this.elements[i];
  }
  
  /* Boolean flags that determine which parts of the UI are visible/hidden */
  /* @TODO: some of these flags are pointless, this should be cleaned up a bit */
  this.flags = {
    main: false,
    name: true,
    objective: true,
    log: !main.settings.toggle.disableLog,
    credit: true,
    meter: !main.settings.toggle.disableMeter,
    announce: true,
    score: false,
    debug: false,
    respawn: false,
    menu: true,
    end: false
  };
  this.sub = "main";
}

GameUI.prototype.menuKey = function() {
  this.flags.main = !this.flags.main;
  if(!this.flags.main) { this.sub = "main"; }
};

GameUI.prototype.hideKey = function() {
  this.hide = !this.hide;
};

/* Steps UI and returns true if imp input is absorbed by a UI element */
/* Window is a Vec2 of the size, in pixels, of the game window for this draw */
GameUI.prototype.step = function(tch, imp, state, window) {
  /* Show or hide ui based on current flags */
  if(this.flags.main) {
    this.main.setVisible(this.sub === "main");
    this.option.setVisible(this.sub === "option");
    this.setting.setVisible(this.sub === "setting");
    this.audio.setVisible(this.sub === "audio");
    this.control.setVisible(this.sub === "control");
    this.graphic.setVisible(this.sub === "graphic");
    this.name.hide();
    this.objective.hide();
    this.log.hide();
    this.credit.hide();
    this.meter.hide();
    this.meterTouch.hide();
    this.thumb.hide();
    this.announce.hide();
    this.score.hide();
    this.debug.setVisible(this.flags.debug);
    this.respawn.hide();
    this.respawnTouch.hide();
    this.menu.hide();
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
    this.graphic.hide();
    this.name.setVisible(this.flags.name);
    this.objective.setVisible(this.flags.objective);
    this.log.setVisible(this.flags.log&&!tch);
    this.credit.setVisible(this.flags.credit&&!tch);
    this.meter.setVisible(this.flags.meter&&!tch);
    this.meterTouch.setVisible(tch&&!ded&&!gam);
    this.thumb.setVisible(tch&&!ded&&!gam);
    this.announce.setVisible(this.flags.announce);
    this.score.setVisible(this.flags.score||ded||gam);
    this.debug.setVisible(this.flags.debug);
    this.respawn.setVisible((this.flags.respawn||(ded&&!gam))&&!tch);
    this.respawnTouch.setVisible((this.flags.respawn||(ded&&!gam))&&tch);
    this.menu.setVisible(tch);
    this.end.setVisible(this.flags.end||gam);
  }
  
  if(this.showTutorial) { this.controlTutorial(); }

  /* Update ui and pass input through */
  var hit = false;
  for(var i=0;i<this.elements.length;i++) {
    if(this.elements[i].step(imp, state, window)) { hit = true; }
  }
  return hit;
};

/* Displays tutorial if this.showTutorial is true */
GameUI.prototype.controlTutorial = function() {
  console.log("tutorial go here");
  this.showTutorial = false;
};

/* Window is a Vec2 of the size, in pixels, of the game window for this draw */
GameUI.prototype.getDraw = function(block, texts, window) {
  if(this.hide) { return; }
  for(var i=0;i<this.elements.length;i++) {
    this.elements[i].getDraw(block, texts, window);
  }
};


GameUI.prototype.destroy = function() {
  for(var i=0;i<this.elements.length;i++) {
    this.elements[i].destroy();
  }
};
