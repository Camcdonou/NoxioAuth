"use strict";
/* global main */

/* Define Game UI Class */
function GameUI(game) {
  this.game = game;
  this.elements = [
    new NameUI(this.game, this, "name"),
    new LogUI(this.game, this, "log"),
    new ScoreUI(this.game, this, "score"),
    new RespawnUI(this.game, this, "respawn"),
    new EndUI(this.game, this, "end"),
    new DebugUI(this.game, this, "debug"),
    new MainUI(this.game, this, "main")
  ];
  for(var i=0;i<this.elements.length;i++) {
    this[this.elements[i].name] = this.elements[i];
  }
  this.name.show();
  //this.log.show();
  //this.respawn.show();
  this.end.show();
  this.score.show();
}

/* Hide all */
GameUI.prototype.hide = function() {
  for(var i=0;i<this.elements.length;i++) {
    this.elements[i].hide();
  }
};

/* Steps UI and returns true if imp input is absorbed by a UI element */
/* Window is a Vec2 of the size, in pixels, of the game window for this draw */
GameUI.prototype.step = function(imp, state, window) {
  var hit = false;
  for(var i=0;i<this.elements.length;i++) {
    if(this.elements[i].step(imp, state, window)) { hit = true; }
  }
  return hit;
};

GameUI.prototype.openMainMenu = function() { if(this.main.hidden) { this.main.show(); } };
GameUI.prototype.closeMainMenu = function() { if(!this.main.hidden) { this.main.hide(); } };
GameUI.prototype.toggleMainMenu = function() {
  if(this.main.hidden) { this.main.show(); }
  else { this.main.hide(); }
};

GameUI.prototype.toggleDebugMenu = function() {
  if(this.debug.hidden) { this.debug.show(); }
  else { this.debug.hide(); }
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
