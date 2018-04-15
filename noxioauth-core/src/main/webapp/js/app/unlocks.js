"use strict";
/* global main */

function Unlocks() {
  this.unlocks = [];
  this.list = [];
};

Unlocks.prototype.load = function(data) {
  this.unlocks = data.unlocks;
};

Unlocks.prototype.loadList = function(data) {
  this.list = data;
  main.menu.unlock.loadUnlockList(data);
};

Unlocks.prototype.get = function(key) {
  for(var i=0;i<this.list.length;i++) {
    if(this.list[i].key === key) { return this.list[i]; }
  }
  return undefined;
};

/* short for "has access to". returns true if the user has the requested unlock. */
Unlocks.prototype.has = function(key) {
  if(this.get(key).auto <= main.net.type) { return true; }
  return this.unlocks[key];
};

