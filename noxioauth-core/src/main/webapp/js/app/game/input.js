"use strict";
/* global main */

/* Define Input Class */
function Input(window) {
  this.window = window;
  
  this.window.onmousemove = function(event) { main.game.input.mouse.event(event); };
  this.window.onmousedown = function(event) { main.game.input.mouse.event(event, true); };
  this.window.onmouseup = function(event) { main.game.input.mouse.event(event, false); };
  document.onkeyup = function(event) { main.game.input.keyboard.event(event, false); };
  document.onkeydown = function(event) { main.game.input.keyboard.event(event, true); };
};

Input.prototype.mouse = {
  pos: {x: 0, y: 0},
  mov: {x: 0, y: 0},
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
};

Input.prototype.mouse.popMovement = function() {
  var mov = this.mov;
  this.mov = {x: 0, y: 0};
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
  if(state) { this.inputs.push(evt.keyCode); }
};

/* Returns the mouse coordinates in game space */
Input.prototype.getMouseActual = function() {
  return {x: this.mouse.pos.x, y: this.mouse.pos.y};
};

Input.prototype.destroy = function() {
  this.window.onmousemove=function() {};
  this.window.onmousedown=function() {};
  this.window.onmouseup=function() {};
  document.onkeyup = function() {};
  document.onkeydown = function() {};
};