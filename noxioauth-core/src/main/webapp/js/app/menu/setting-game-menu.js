"use strict";
/* global main */
/* global util */

/* @TODO: I hate the name of this class. its instance in menu.js is 'setgame' but its actual name is setting-game-menu and SettingGameMenu, its annoying. refactor */
function SettingGameMenu() {
  this.changed = false; // If this is flagged we will save settings to the server when we leave this menu.
  
  this.element = document.getElementById("setgame");
  this.modal = document.getElementById("setgame-modal");
  this.modalContainer = document.getElementById("setgame-modal-cont");
  
  this.colorValues = {
    color: {
      name: "color", /* name of variable in main.settings.game & here in this object */
      container: document.getElementById("setgame-color"),
      colorSet: "COLORS"
    },
    redColor: {
      name: "redColor", /* name of variable in main.settings.game & here in this object */
      container: document.getElementById("setgame-redcolor"),
      colorSet: "REDS"
    },
    blueColor: {
      name: "blueColor", /* name of variable in main.settings.game & here in this object */
      container: document.getElementById("setgame-bluecolor"),
      colorSet: "BLUES"
    }
  };
  
  this.toggles = [
    {
      element: document.getElementById("setgame-hidecolor"),
      setting: "disableColor"
    },
    {
      element: document.getElementById("setgame-hidealt"),
      setting: "disableAlts"
    },
    {
      element: document.getElementById("setgame-hidechat"),
      setting: "disableLog"
    },
    {
      element: document.getElementById("setgame-hidemeter"),
      setting: "disableMeter"
    }
  ];
  
  window.onclick = function(event) {
    if (event.target === parent.modal) {
      main.menu.setgame.hideColorModal();
    }
  };
};

SettingGameMenu.prototype.update = function() {
  this.generateColorBtns(this.colorValues.color, util.kalide.getColorsNoTruncate(main.settings.game.color));
  this.generateColorBtns(this.colorValues.redColor, util.kalide.getRedsNoTruncate(main.settings.game.redColor));
  this.generateColorBtns(this.colorValues.blueColor, util.kalide.getBluesNoTruncate(main.settings.game.blueColor));
  this.updateToggles();
};

/* Builds the color display and editor things. */
SettingGameMenu.prototype.generateColorBtns = function(obj, colors) {
  obj.container.innerHTML = "";
  if(!main.unlocks.has("FT_COLOR")) {
    obj.container.innerHTML +=
      "<div class='setgame-color-bx' " +
      "style='background-color: rgba(0, 0, 0, 0); background-image: url(img/aes/locked.png); background-repeat: no-repeat; background-position: center; background-size: 16px 16px;' " +
      "></div>";
    return;
  }
  
  obj.id = util.kalide.decompressColors(main.settings.game[obj.name]);
  for(var i=0;i<4;i++) {
    var style;
    if(colors[i]) {
      var c = util.vec3.toVec4(util.vec3.scale(colors[i], 255), 1);
      style = "background-color: rgba(" + c.x + ", " + c.y + ", " + c.z + ", " + c.w + ");"; }
    else {
      style = "background-color: rgba(0, 0, 0, 0); background-image: url(img/aes/x-white.png); background-repeat: no-repeat; background-position: center; background-size: 16px 16px;";
    }
    obj.container.innerHTML +=
      "<div class='setgame-color-bx' " +
      "style='" + style + "' " +
      "onclick='main.menu.setgame.showColorModal(\"" + obj.name + "\", " + i + ")'></div>";
  }
};

SettingGameMenu.prototype.updateToggles = function() {
  for(var i=0;i<this.toggles.length;i++) {
    var tog = this.toggles[i];
    tog.element.innerHTML = main.settings.toggle[tog.setting] ? "On" : "Off";
  }
};

SettingGameMenu.prototype.toggle = function(ind) {
  var tog = this.toggles[ind];
  main.settings.toggle[tog.setting] = !main.settings.toggle[tog.setting];
  this.updateToggles();
  this.changed = true;
};

SettingGameMenu.prototype.showColorModal = function(name, ind) {
  var obj = this.colorValues[name];
  this.modalContainer.innerHTML = "";
  var set = util.kalide[obj.colorSet];
  for(var i=0;i<set.length;i++) {
    var style;
    if(i!==0) {
      var c = util.vec3.toVec4(util.vec3.scale(set[i], 255), 1);
      style = "background-color: rgba(" + c.x + ", " + c.y + ", " + c.z + ", " + c.w + ");"; }
    else {
      style = "background-color: rgba(0, 0, 0, 0); background-image: url(img/aes/x-white.png); background-repeat: no-repeat; background-position: center; background-size: 16px 16px;";
    }
    this.modalContainer.innerHTML +=
      "<div class='setgame-color-bx' " +
      "style='" + style + "' " +
      "onclick='main.menu.setgame.setColor(\"" + name + "\", " + ind + ", " + i + ")'></div>";
  }
  this.modal.style.display = "block";
};

SettingGameMenu.prototype.setColor = function(name, ind, id) {
  var obj = this.colorValues[name];
  obj.id[ind] = id;
  main.settings.game[obj.name] = util.kalide.compressColors(obj.id[0], obj.id[1], obj.id[2], obj.id[3]);
  this.changed = true;
  this.update();
  this.hideColorModal();
};

SettingGameMenu.prototype.hideColorModal = function() {
  this.modalContainer.innerHTML = "";
  this.modal.style.display = "none";
};

SettingGameMenu.prototype.back = function() {
  if(this.changed) { main.settings.save(); this.changed = false; }
  main.menu.online.show();
};

SettingGameMenu.prototype.show = function() {
  main.menu.hideAll();
  this.hideColorModal();
  this.update();
  main.menu.credit.show();
  main.menu.rank.show();
  this.element.style.display = "block";
};

SettingGameMenu.prototype.hide = function() {
  this.hideColorModal();
  this.element.style.display = "none";
};