"use strict";
/* global main */

function StatMenu() {
  this.element = document.getElementById("stat");
  
  this.left = document.getElementById("stat-left");
  this.right = document.getElementById("stat-right");
  
  this.general = document.getElementById("stat-general");
  this.objective = document.getElementById("stat-objective");
  this.multi = document.getElementById("stat-multi");
  this.spree = document.getElementById("stat-spree");
  
  this.buttons = [
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
      {name: "Betrayals", val: "betrayl"}, /* Betryal is spelled wrong in most of my code & the database. I'm not fixing it. */
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
      {name: "Double Kill", val: "mkx02"},
      {name: "Triple Kill", val: "mkx03"},
      {name: "Quadra Kill", val: "mkx04"},
      {name: "Ultra Kill", val: "mkx05"},
      {name: "Mega Kill", val: "mkx06"},
      {name: "Giga Kill", val: "mkx07"},
      {name: "Killamity", val: "mkx08"},
      {name: "Killtrocity", val: "mkx09"},
      {name: "Killtastrophe", val: "mkx10"},
      {name: "Killpocalypse", val: "mkx11"},
      {name: "Killsplosion", val: "mkx12"},
      {name: "Killnado", val: "mkx13"},
      {name: "Killcumcision", val: "mkx14"},
      {name: "Uh...", val: "mkx15"},
      {name: "Stop", val: "mkx16"},
      {name: "Please", val: "mkx17"},
      {name: "You Monster", val: "mkx18"}
    ],
    spree: [
      {name: "Rampage", val: "ksx05"},
      {name: "Untouchable", val: "ksx10"},
      {name: "Impossible", val: "ksx15"},
      {name: "Invincible", val: "ksx20"},
      {name: "Inconceivable", val: "ksx25"},
      {name: "Godlike", val: "ksx30"}
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
    if(type === "multi" && main.stats[lst[i].val] === 0 && i > 5) { break; } // Hides the ridiculous multikills unless you have them.
    if(type === "spree" && main.stats[lst[i].val] === 0 && i > 3) { break; } // Hides the ridiculous killstreaks unless you have them.
    l += "<div class='stat-name'>" + lst[i].name + "</div>";
    r += "<div class='stat-val'>" + main.stats[lst[i].val] + "</div>";
  }
  this.left.innerHTML = l;
  this.right.innerHTML = r;
};

StatMenu.prototype.back = function() {
  main.menu.online.show();
};

StatMenu.prototype.show = function() {
  main.menu.navigation("stat", "stat");
  main.menu.hideAll();
  this.generateList("general");
  main.menu.credit.show();
  main.menu.rank.show();
  this.element.style.display = "block";
};

StatMenu.prototype.hide = function() {
  this.element.style.display = "none";
};

/* Called when the back button is hit on this menu */
StatMenu.prototype.onBack = function() {
  this.back();
};