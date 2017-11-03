"use strict";
/* global main */

/* Define Input Class */
function Input(game) {
  this.game = game;
  this.window = this.game.window;
  
  /* These functions are wrapped since main.game.input does not exist yet. But it will before they can be called because javascript is synchronous. */
  this.window.onmousemove = function(event) { main.game.input.mouse.event(event); };
  this.window.onmousedown = function(event) { main.game.input.mouse.event(event, true); };
  this.window.onmouseup = function(event) { main.game.input.mouse.event(event, false); };
  this.window.addEventListener("mousewheel", function(event) { main.game.input.mouse.wheel(event); }, false); // IE9, Chrome, Safari, Opera
  this.window.addEventListener("DOMMouseScroll", function(event) { main.game.input.mouse.wheel(event); }, false); // Firefox
  document.onkeyup = function(event) { main.game.input.keyboard.event(event, false); };
  document.onkeydown = function(event) { main.game.input.keyboard.event(event, true); };
  
  this.mouse.input = this;    // Le sigh...
  this.keyboard.input = this; // Hnnggg
};

Input.prototype.mouse = {
  inputs: [],
  pos: {x: 0, y: 0},
  mov: {x: 0, y: 0},
  spin: 0.0,
  nxtMov: {x: 0, y: 0},
  nxtSpin: 0.0,
  lmb: false,
  rmb: false,
  mmb: false
};

Input.prototype.mouse.event = function(event, state) {
  this.nxtMov = {x: this.nxtMov.x+(this.pos.x-event.offsetX), y: this.nxtMov.y+((this.pos.y-event.offsetY)*-1)};
  this.pos = {x: event.offsetX, y: event.offsetY};
  if(state === undefined) { return; }
  switch(event.button) {
		case 0 : { this.lmb = state; break; }
		case 2 : { this.rmb = state; break; }
		case 1 : { this.mmb = state; break; }
		default : { /* Ignore */ break; }
  }
  if(state) { this.inputs.push({btn: event.button, pos: this.pos}); }
};

Input.prototype.mouse.wheel = function(event) {
    var e = window.event || event;
    var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
    this.nxtSpin += delta;
    return false;
};

Input.prototype.keyboard = {
  inputs: [],
  keys: []
};

Input.prototype.popInputs = function() {
  this.mouse.mov = this.mouse.nxtMov;
  this.mouse.spin = this.mouse.nxtSpin;
  this.mouse.nxtMov = {x: 0, y: 0};
  this.mouse.nxtSpin = 0.0;
  
  var inputs = {mouse: this.mouse.inputs, keyboard: this.keyboard.inputs};
  this.keyboard.inputs = [];
  this.mouse.inputs = [];
  
  return inputs;
};

Input.prototype.keyboard.event = function(evt, state) {
  this.keys[evt.keyCode] = state;  
  if(state) { this.inputs.push(evt.keyCode); }
};

Input.prototype.destroy = function() {
  this.window.onmousemove=function() {};
  this.window.onmousedown=function() {};
  this.window.onmouseup=function() {};
  this.window.removeEventListener("mousewheel", main.game.input.mouse.wheel, false); // IE9, Chrome, Safari, Opera
  this.window.removeEventListener("DOMMouseScroll", main.game.input.mouse.wheel, false); // Firefox
  document.onkeyup = function() {};
  document.onkeydown = function() {};
};