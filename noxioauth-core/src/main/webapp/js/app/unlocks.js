"use strict";
/* global main */

function Unlocks() {
  this.unlocks = [];
};

Unlocks.prototype.load = function(data) {
  this.unlocks = data.unlocks;
};

/* short for "has access to". returns true if the user has the requested unlock. */
Unlocks.prototype.has = function(key) {
  var ind = this.unlocks.indexOf(key);
  return !!~ind ? this.unlocks[ind] : false;
};

