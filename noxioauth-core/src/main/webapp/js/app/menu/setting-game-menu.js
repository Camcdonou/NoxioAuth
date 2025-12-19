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
  
  this.message = {
    a: document.getElementById("setgame-message-a"),
    b: document.getElementById("setgame-message-b"),
    va: undefined,
    vb: undefined
  };
  
  this.sound = {
    tog: document.getElementById("setgame-usesound"),
    file: document.getElementById("setgame-snd-file"),
    data: document.getElementById("setgame-snd-data")
  };
  
  this.map = {
    modal: document.getElementById("map-manager-modal"),
    list: document.getElementById("map-manager-list"),
    file: document.getElementById("map-manager-file"),
    status: document.getElementById("setgame-map-status")
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
      element: document.getElementById("setgame-hidesound"),
      setting: "disableCustomSound"
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
  
  this.lagComp = {
    element: document.getElementById("setgame-lagcomp"),
    name: ["Immediate", "Normal", "Aggressive", "Very Aggressive"]
  };
  
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
  this.sound.data.innerHTML = main.settings.game.customSoundFile ? main.settings.game.customSoundFile : "";
  
  /* Update map status */
  var tmp = this;
  $.ajax({
    url: "/nxc/file/maps",
    type: 'GET',
    timeout: 3000,
    success: function(data) {
      var count = 0;
      for(var i=0;i<data.length;i++) { if(data[i].author === main.net.user) { count++; } }
      tmp.map.status.innerHTML = count + " / 10 Maps";
    }
  });
  
  if(this.message.a.value && this.message.a.value !== this.message.va) { main.settings.game.customMessageA = this.message.a.value; this.changed = true; }
  if(this.message.b.value && this.message.b.value !== this.message.vb) { main.settings.game.customMessageB = this.message.b.value; this.changed = true; }
  this.message.a.value = main.settings.game.customMessageA?main.settings.game.customMessageA:"";
  this.message.b.value = main.settings.game.customMessageB?main.settings.game.customMessageB:"";
  this.message.va = this.message.a.value;
  this.message.vb = this.message.b.value;
  if(main.unlocks.has("FT_MESSAGE")) {
    this.message.a.removeAttribute("disabled");
    this.message.b.removeAttribute("disabled");
  }
  else {
    this.message.a.setAttribute("disabled", "disabled");
    this.message.b.setAttribute("disabled", "disabled");
  }
  
  if(main.unlocks.has("FT_SOUND")) {
    var tmp = this;
    this.sound.tog.innerHTML = main.settings.game.useCustomSound ? "On" : "Off";
    this.sound.tog.classList.remove("setgame-val");
    this.sound.tog.classList.add("setgame-tog");
    this.sound.tog.onclick = function() { tmp.useSoundTog(); };
    this.sound.file.removeAttribute("disabled");
    this.map.file.removeAttribute("disabled");
  }
  else {
    this.sound.tog.innerHTML = "<div class='setgame-lock'></div>";
    this.sound.tog.classList.remove("setgame-tog");
    this.sound.tog.classList.add("setgame-val");
    this.sound.tog.onclick = function() { };
    this.sound.file.setAttribute("disabled", "disabled");
    this.map.file.setAttribute("disabled", "disabled");
  }
  
  this.updateToggles();
  
  this.lagComp.element.innerHTML = this.lagComp.name[main.settings.game.lagComp];
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

SettingGameMenu.prototype.useSoundTog = function() {
  main.settings.game.useCustomSound = !main.settings.game.useCustomSound;
  this.changed = true;
  this.update();
};

SettingGameMenu.prototype.uploadSound = function() {
  var fil = this.sound.file.files[0];
  if(!fil) { /* error */ return; }
  var upl = new FileUpload("file/sound", fil, main.net.user, main.net.sid);
  var tmp = this;
  upl.doUpload(
    function(fn) {
      main.menu.warning.show("File uploaded successfully!");
      tmp.sound.file.value = "";
      main.settings.game.customSoundFile = fn;
      tmp.update();
    },
    function(error){
      main.menu.warning.show(error.responseText);
    }
  );
};

SettingGameMenu.prototype.uploadMap = function() {
  var fil = this.map.file.files[0];
  if(!fil) { /* error */ return; }
  var upl = new FileUpload("file/map", fil, main.net.user, main.net.sid);
  var tmp = this;
  upl.doUpload(
    function(fn) {
      main.menu.warning.show("File uploaded successfully!");
      tmp.map.file.value = "";
      tmp.refreshMapList();
      tmp.update();
    },
    function(error){
      main.menu.warning.show(error.responseText);
    }
  );
};

SettingGameMenu.prototype.showMapManager = function() {
  if(!main.unlocks.has("FT_LOBBY")) {
    main.menu.warning.show("You must unlock Custom Lobbies to manage custom maps.");
    return;
  }
  this.refreshMapList();
  this.map.modal.style.display = "block";
};

SettingGameMenu.prototype.hideMapManager = function() {
  this.map.modal.style.display = "none";
};

SettingGameMenu.prototype.refreshMapList = function() {
  var tmp = this;
  this.map.list.innerHTML = "Loading maps...";
  $.ajax({
    url: "/nxc/file/maps",
    type: 'GET',
    timeout: 3000,
    success: function(data) {
      var gen = "";
      var count = 0;
      for(var i=0;i<data.length;i++) {
        if(data[i].author === main.net.user) {
          count++;
          gen += "<div class='map-manager-item'>";
          gen += "<span class='map-name'>" + data[i].name + "</span>";
          gen += "<span class='setgame-btn small' onclick='main.menu.setgame.deleteMap(\"" + data[i].id + "\")'>Delete</span>";
          gen += "</div>";
        }
      }
      if(count === 0) { gen = "<div class='map-manager-empty'>No custom maps uploaded.</div>"; }
      tmp.map.list.innerHTML = gen;
      tmp.map.status.innerHTML = count + " / 10 Maps";
    },
    error: function() {
      tmp.map.list.innerHTML = "Error loading map list.";
    }
  });
};

SettingGameMenu.prototype.deleteMap = function(id) {
  var tmp = this;
  if(!confirm("Are you sure you want to delete this map?")) { return; }
  
  $.ajax({
    url: "/nxc/file/map/delete",
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({user: main.net.user, sid: main.net.sid, filename: id}),
    success: function() {
      tmp.refreshMapList();
      tmp.update();
    },
    error: function(error) {
      main.menu.warning.show("Failed to delete map: " + error.responseJSON.message);
    }
  });
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

SettingGameMenu.prototype.lagCompBtn = function() {
  main.settings.game.lagComp = main.settings.game.lagComp+1>=this.lagComp.name.length?0:main.settings.game.lagComp+1;
  this.update();
};

SettingGameMenu.prototype.back = function() {
  this.update();
  if(this.changed) { main.settings.save(); this.changed = false; }
  main.menu.online.show();
};

SettingGameMenu.prototype.show = function() {
  main.menu.navigation("setgame", "settings");
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

/* Called when the back button is hit on this menu */
SettingGameMenu.prototype.onBack = function() {
  this.back();
};