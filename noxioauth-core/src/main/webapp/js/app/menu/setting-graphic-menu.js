"use strict";
/* global main */
/* global util */

function SettingGraphicMenu() {
  this.changed = false; // If this is flagged we will save settings to the server when we leave this menu.
  
  this.element = document.getElementById("setgraphic");
  this.btnBack = document.getElementById("setgraphic-back");
  
  this.btns = [
    {setting: "bloom", value: false, element: document.getElementById("setgraphic-bloom-0")},
    {setting: "bloom", value: true, element: document.getElementById("setgraphic-bloom-1")},
    {setting: "shadowSize", value: 16, element: document.getElementById("setgraphic-shadow-0")},
    {setting: "shadowSize", value: 512, element: document.getElementById("setgraphic-shadow-1")},
    {setting: "shadowSize", value: 1024, element: document.getElementById("setgraphic-shadow-2")},
    {setting: "shadowSize", value: 2048, element: document.getElementById("setgraphic-shadow-3")},
    {setting: "shadowSize", value: 4096, element: document.getElementById("setgraphic-shadow-4")},
    {setting: "upSky", value: 0.25, element: document.getElementById("setgraphic-sky-0")},
    {setting: "upSky", value: 1.0, element: document.getElementById("setgraphic-sky-1")},
    {setting: "upUi", value: 0.5, element: document.getElementById("setgraphic-menu-0")},
    {setting: "upUi", value: 1.0, element: document.getElementById("setgraphic-menu-1")},
    {setting: "upGame", value: 0.5, element: document.getElementById("setgraphic-game-0")},
    {setting: "upGame", value: 1.0, element: document.getElementById("setgraphic-game-1")},
    {setting: "upGame", value: 1.5, element: document.getElementById("setgraphic-game-2")},
    {setting: "upGame", value: 2.0, element: document.getElementById("setgraphic-game-3")}
  ];
  var parent = this;
  this.btns[0].element.onclick = function() { parent.set(0); };
  this.btns[1].element.onclick = function() { parent.set(1); };
  this.btns[2].element.onclick = function() { parent.set(2); };
  this.btns[3].element.onclick = function() { parent.set(3); };
  this.btns[4].element.onclick = function() { parent.set(4); };
  this.btns[5].element.onclick = function() { parent.set(5); };
  this.btns[6].element.onclick = function() { parent.set(6); };  
  this.btns[7].element.onclick = function() { parent.set(7); };
  this.btns[8].element.onclick = function() { parent.set(8); };
  this.btns[9].element.onclick = function() { parent.set(9); };
  this.btns[10].element.onclick = function() { parent.set(10); };
  this.btns[11].element.onclick = function() { parent.set(11); };
  this.btns[12].element.onclick = function() { parent.set(12); };
  this.btns[13].element.onclick = function() { parent.set(13); };
  this.btns[14].element.onclick = function() { parent.set(14); };

  this.btnBack.onclick = function() { parent.back(); };
};

SettingGraphicMenu.prototype.set = function(ind) {
  main.settings.graphics[this.btns[ind].setting] = this.btns[ind].value;
  this.changed = true;
  this.update();
};

SettingGraphicMenu.prototype.update = function() {
  for(var i=0;i<this.btns.length;i++) {
    var a = this.btns[i];
    if(a.value === main.settings.graphics[a.setting]) { a.element.classList.add("set-selected"); }
    else { a.element.classList.remove("set-selected"); }
  }
};

SettingGraphicMenu.prototype.back = function() {
  if(this.changed) { main.settings.save(); this.changed = false; }
  main.menu.online.show();
};

SettingGraphicMenu.prototype.show = function() {
  main.menu.navigation("setgraphic", "graphics");
  main.menu.hideAll();
  this.update();
  main.menu.credit.show();
  main.menu.rank.show();
  this.element.style.display = "block";
};

SettingGraphicMenu.prototype.hide = function() {
  this.element.style.display = "none";
};

/* Called when the back button is hit on this menu */
SettingGraphicMenu.prototype.onBack = function() {
  this.back();
};