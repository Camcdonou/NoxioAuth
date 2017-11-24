"use strict";
/* global main */

function Settings() {
  this.defaults();
  this.downloadUserSettings();
}

// Sets default values to user settings, this is done initially incase retrieving user settings fails
Settings.prototype.defaults = function() {
  this.volume = {
    master: 0.9,
    music: 0.5,
    fx: 0.75
  };
  this.graphics = {
    
  };
  this.control = {
    enableController: false,
    actionA: 70,
    actionB: 68,
    jump: 32,
    taunt: 84,
    scoreboard: 192
  };
};

// Gets saved user settings from server
Settings.prototype.downloadUserSettings = function() {
  // @TODO: EYYYYYYYYYYYYyyy
};

// Saves changed setting to server
Settings.prototype.saveUserSettings = function() {
  
};