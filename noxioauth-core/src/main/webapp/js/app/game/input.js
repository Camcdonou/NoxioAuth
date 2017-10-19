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
  pos: {x: 0, y: 0},
  mov: {x: 0, y: 0},
  spin: 0.0,
  lmb: false,
  rmb: false,
  mmb: false
};

Input.prototype.mouse.event = function(event, state) {
  this.mov = {x: this.mov.x+(this.pos.x-event.offsetX), y: this.mov.y+((this.pos.y-event.offsetY)*-1)};
  this.pos = {x: event.offsetX, y: event.offsetY};
  if(state === undefined) { return; }
  switch(event.button) {
		case 0 : { this.lmb = state; break; }
		case 2 : { this.rmb = state; break; }
		case 1 : { this.mmb = state; break; }
		default : { /* Ignore */ break; }
  }
  if(state === true) { this.input.game.handleClick(event.button, this.pos); } // Why the FUCK do I have to write === true for a bool check. Fuck off Javascript.
};

Input.prototype.mouse.wheel = function(event) {
    var e = window.event || event;
    var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
    this.spin += delta;
    return false;
};

Input.prototype.mouse.popMovement = function() {
  var mov = this.mov;
  mov.s = this.spin;
  this.mov = {x: 0, y: 0};
  this.spin = 0.0;
  return mov;
};

Input.prototype.keyboard = {
  keys: [],
  inputs: []
};

Input.prototype.keyboard.popInputs = function() {
  var inputs = this.inputs;
  this.inputs = [];
  return inputs;
};

Input.prototype.keyboard.event = function(evt, state) {
  this.keys[evt.keyCode] = state;  
  if(state) {
    this.inputs.push(evt.keyCode);
    this.input.game.handleInput(evt.keyCode);
  }
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