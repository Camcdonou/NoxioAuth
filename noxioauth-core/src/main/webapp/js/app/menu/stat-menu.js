"use strict";
/* global main */

function StatMenu() {
  this.element = document.getElementById("stat");
  
  this.left = document.getElementById("stat-left");
  this.right = document.getElementById("stat-right");
  
  this.back = document.getElementById("stat-back");
  this.general = document.getElementById("stat-general");
  this.objective = document.getElementById("stat-objective");
  this.multi = document.getElementById("stat-multi");
  this.spree = document.getElementById("stat-spree");
  
  this.buttons = [
    this.back,
    this.general,
    this.objective,
    this.multi,
    this.spree
  ];
  
  /* variable names for each different list */
  this.lists = {
    general: [
      {name: "Kills", val: "kill"},
      {name: "Deaths", val: "death"},
      {name: "Betrayed", val: "betrayed"},
      {name: "Betrayls", val: "betrayl"},
      {name: "First Blood", val: "firstBlood"},
      {name: "Kill Joys", val: "killJoy"},
      {name: "Reigns Ended", val: "endedReign"},
      {name: "Perfections", val: "perfect"},
      {name: "Humiliations", val: "humiliation"},
      {name: "Cumulative Resistance", val: "cumRes"}
    ],
    objective: [
      {name: "Games Won", val: "gameWin"},
      {name: "Games Lost", val: "gameLose"},
      {name: "Flags Captured", val: "flagCapture"},
      {name: "Flags Defended", val: "flagDefense"},
      {name: "Time On Hill", val: "hillControl"}
    ],
    multi: [
      {name: "Double Kills", val: "mkx02"},
      {name: "Triple Kills", val: "mkx03"},
      {name: "X", val: "mkx04"},
      {name: "X", val: "mkx05"},
      {name: "X", val: "mkx06"},
      {name: "X", val: "mkx07"},
      {name: "X", val: "mkx08"},
      {name: "X", val: "mkx09"},
      {name: "X", val: "mkx10"},
      {name: "X", val: "mkx11"},
      {name: "X", val: "mkx12"},
      {name: "X", val: "mkx13"},
      {name: "X", val: "mkx14"},
      {name: "X", val: "mkx15"},
      {name: "X", val: "mkx16"},
      {name: "X", val: "mkx17"},
      {name: "X", val: "mkx18"},
      {name: "X", val: "mkx19"},
      {name: "X", val: "mkx20"}
    ],
    spree: [
      {name: "Killing Sprees", val: "ksx05"},
      {name: "Riots Run", val: "ksx10"},
      {name: "X", val: "ksx15"},
      {name: "X", val: "ksx20"},
      {name: "X", val: "ksx25"},
      {name: "X", val: "ksx30"}
    ]
  };
};

/* type determines the list we show 
 * ::: valid types :::
 * general
 * objective
 * multi
 * spree
 * */
StatMenu.prototype.generateList = function(type){
  for(var i=0;i<this.buttons.length;i++) {
    this.buttons[i].classList.remove("selected");
  }
  this[type].classList.add("selected");
  var lst = this.lists[type];
  var l = "";
  var r = "";
  for(var i=0;i<lst.length;i++) {
    l += "<div class='stat-name'>" + lst[i].name + "</div>";
    r += "<div class='stat-val'>" + main.stats[lst[i].val] + "</div>";
  }
  this.left.innerHTML = l;
  this.right.innerHTML = r;
};

StatMenu.prototype.goBack = function() {
  main.menu.online.show();
};

StatMenu.prototype.show = function() {
  main.menu.hideAll();
  this.generateList("general");
  main.menu.credit.show();
  main.menu.rank.show();
  this.element.style.display = "block";
};

StatMenu.prototype.hide = function() {
  this.element.style.display = "none";
};