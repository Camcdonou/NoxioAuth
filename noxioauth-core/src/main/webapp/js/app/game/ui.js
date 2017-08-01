"use strict";
/* global main */

/* Define Game UI Class */
function GameUI(game) {
  this.game = game;
  if(!this.game.display.gl) { return; } /* If no GL then no nothing */
  this.elements = [
    new NameUI(this.game, "name"),
    new MeterUI(this.game, "meter"),
    new LogUI(this.game, "log"),
    new DebugUI(this.game, "debug"),
    new ScoreUI(this.game, "score"),
    new RespawnUI(this.game, "respawn"),
    new EndUI(this.game, "end"),
    new MainUI(this.game, "main")
  ];
}

GameUI.prototype.getElement = function(name) {
  for(var i=0;i<this.elements.length;i++) {
    if(this.elements[i].name === name) { return this.elements[i]; }
  }
  return undefined; /* @FIXME error */
};

/* Returns true if a interactable menu object is visible */
GameUI.prototype.menuOpen = function() {
  for(var i=0;i<this.elements.length;i++) {
    if(this.elements[i].interactable && !this.elements[i].hidden) { return true; }
  }
  return false;
};

GameUI.prototype.handleInput = function(key) {
  for(var i=0;i<this.elements.length;i++) {
    if(this.elements[i].interactable) {
      if(this.elements[i].handleInput(key)) { return; }
    }
  }
};

/* Window size is needed since UI is scaled to window size. */
GameUI.prototype.handleClick = function(button, mouse, window) {
  for(var i=0;i<this.elements.length;i++) {
    if(this.elements[i].interactable) {
      if(this.elements[i].handleClick(button, mouse, window)) { return; }
    }
  }
};

GameUI.prototype.getDraw = function(block, text, mouse, window) {
  for(var i=0;i<this.elements.length;i++) {
    this.elements[i].getDraw(block, text, mouse, window);
  }
};


GameUI.prototype.destroy = function() {
  for(var i=0;i<this.elements.length;i++) {
    this.elements[i].destroy();
  }
};
