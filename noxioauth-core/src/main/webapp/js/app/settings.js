"use strict";
/* global main */

/* This class contains all user defined settings */
/* These are saved to the server and loaded when you login */

function Settings() { this.skeys = []; }

/* Loads the servers settings info in to this class. */
Settings.prototype.load = function(settings) {
  var keys = Object.keys(settings);
  for(var i=0;i<keys.length;i++) {
    this[keys[i]] = settings[keys[i]];
  }
  this.skeys = keys;
};

/* Uses saved keylist generate a settings object and then send it to the server to save */
Settings.prototype.save = function() {
  var settings = {};
  for(var i=0;i<this.skeys.length;i++) {
    settings[this.skeys[i]] = this[this.skeys[i]];
  }
  main.net.auth.send({type: "s03", settings: settings});
};