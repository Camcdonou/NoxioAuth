"use strict";
/* global main */

/* Define Input Class */
function Input(game) {
  this.game = game;
  this.window = this.game.window;
  
  /* These functions are wrapped since main.game.input does not exist yet. But it will before they can be called because javascript is synchronous. */
  this.window.onmousemove = function(event) { main.game.input.mouse.event(event); event.preventDefault(); return false; };
  this.window.onmousedown = function(event) { main.game.input.mouse.event(event, true); event.preventDefault(); return false; };
  this.window.onmouseup = function(event) { main.game.input.mouse.event(event, false); event.preventDefault(); return false; };
  this.window.addEventListener("mousewheel", function(event) { main.game.input.mouse.wheel(event); event.preventDefault(); return false; }, false); // IE9, Chrome, Safari, Opera
  this.window.addEventListener("DOMMouseScroll", function(event) { main.game.input.mouse.wheel(event); event.preventDefault(); return false; }, false); // Firebox
  document.onkeyup = function(event) { main.game.input.keyboard.event(event, false); event.preventDefault(); event.preventDefault(); return false; };
  document.onkeydown = function(event) { main.game.input.keyboard.event(event, true); event.preventDefault(); event.preventDefault(); return false; };
  
  this.touchEvt = function(event) { main.game.input.touch.event(event); };
  
  document.addEventListener('touchstart', this.touchEvt, true);
  document.addEventListener('touchmove', this.touchEvt, true);
  document.addEventListener('touchend', this.touchEvt, true);
  
  this.mouse.input = this;    // Le sigh...
  this.keyboard.input = this; // Hnnggg
  this.touch.input = this; // Reeeeeeee
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

Input.prototype.keyboard.event = function(evt, state) {
  this.keys[evt.keyCode] = state;  
  if(state) { this.inputs.push({key: evt.keyCode, char: evt.key.length!==1?"":evt.key}); }
};

Input.prototype.touch = {
  inputs: [],
  pos: []
};

Input.prototype.touch.event = function(event) {
  /* Attempt to go fullscreen, for phones */
  if(!this.input.window.fullscreen) {
    if (this.input.window.requestFullscreen) {
      this.input.window.requestFullscreen();
    } else if (this.input.window.mozRequestFullScreen) { /* Firefox */
      this.input.window.mozRequestFullScreen();
    } else if (this.input.window.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
      this.input.window.webkitRequestFullscreen();
    } else if (this.input.window.msRequestFullscreen) { /* IE/Edge */
      this.input.window.msRequestFullscreen();
    }
  }
  
  var last = this.pos;
  this.pos = [];
  for(var i=0;i<event.touches.length;i++) {
    var tch = event.touches[i];
    var contains = false;
    for(var j=0;j<last.length;j++) {
      if(last[j].id === tch.identifier) { contains = true; break; }
    }
    if(!contains) {
      this.inputs.push({id: tch.identifier, x: tch.clientX, y: tch.clientY});
    }
    this.pos.push({id: tch.identifier, x: tch.clientX, y: tch.clientY});
  }
};

Input.prototype.popInputs = function() {
  this.mouse.mov = this.mouse.nxtMov;
  this.mouse.spin = this.mouse.nxtSpin;
  this.mouse.nxtMov = {x: 0, y: 0};
  this.mouse.nxtSpin = 0.0;
  
  this.touch.mov = this.touch.nxtMov;
  this.touch.nxtMov = {x: 0, y: 0};
  
  var inputs = {mouse: this.mouse.inputs, keyboard: this.keyboard.inputs, touch: this.touch.inputs};
  this.keyboard.inputs = [];
  this.mouse.inputs = [];
  this.touch.inputs = [];
  
  return inputs;
};

Input.prototype.destroy = function() {
  if(this.window.fullscreen) {
    if (this.window.exitFullscreen) {
      this.window.exitFullscreen();
    } else if (this.window.mozCancelFullScreen) { /* Firefox */
      this.window.mozCancelFullScreen();
    } else if (this.window.webkitExitFullscreen) { /* Chrome, Safari and Opera */
      this.window.webkitExitFullscreen();
    } else if (this.window.msExitFullscreen) { /* IE/Edge */
      this.window.msExitFullscreen();
    }
  }
  
  this.window.onmousemove=function() {};
  this.window.onmousedown=function() {};
  this.window.onmouseup=function() {};
  this.window.removeEventListener("mousewheel", main.game.input.mouse.wheel, false); // IE9, Chrome, Safari, Opera
  this.window.removeEventListener("DOMMouseScroll", main.game.input.mouse.wheel, false); // Firebox
  document.onkeyup = function() {};
  document.onkeydown = function() {};
  document.removeEventListener('touchstart', this.touchEvt, true);
  document.removeEventListener('touchmove', this.touchEvt, true);
  document.removeEventListener('touchend', this.touchEvt, true);
};