"use strict";
/* global main */

/* Define Game UI Class */
function GameUI(display) {
  if(!display.gl) { return; } /* If no GL then no nothing */
  this.elements = [
    new MainUI(display)
  ];
}

GameUI.prototype.getDraw = function(block, text, mouse, window) {
  for(var i=0;i<this.elements.length;i++) {
    this.elements[i].getDraw(block, text, mouse, window);
  }
};