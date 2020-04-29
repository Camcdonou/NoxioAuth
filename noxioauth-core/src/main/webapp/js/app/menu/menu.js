"use strict";
/* global main */

/** @FIXME
   Calls from inputs and etc from menu could be made into some kind of generic event.
   Maybe look into it, it would be a minor improvement but might be worth it.
 **/

function Menu() {
  
  window.history.pushState({html:"index.html", pageTitle:"20XX"}, "", "#");
  
  /* Register all menu classes here*/
  var m = [
    {id: "error", obj: new ErrorMenu()}, // Displays on top as a modal.
    {id: "warning", obj: new WarningMenu()}, // Displays as a widget at the top left.
    {id: "info", obj: new InfoMenu()}, // Displays on top as a modal.
    {id: "footer", obj: new FooterMenu()}, // Displays as a widget at the bottom, independantly shown/hidden by other menus.
    {id: "credit", obj: new CreditMenu()}, // Displays as a widget at top right, independantly shown/hidden by other menus.
    {id: "rank", obj: new RankMenu()}, // Displays as a widget at the bottom, independantly shown/hidden by other menus.
    {id: "connect", obj: new ConnectMenu()},
    {id: "auth", obj: new AuthMenu()},
    {id: "verify", obj: new VerifyMenu()},
    {id: "reset", obj: new ResetMenu()},
    {id: "online", obj: new OnlineMenu()},
    {id: "unlock", obj: new UnlockMenu()},
    {id: "stat", obj: new StatMenu()},
    {id: "setgame", obj: new SettingGameMenu()},
    {id: "setgraphic", obj: new SettingGraphicMenu()},
    {id: "buy", obj: new BuyMenu()},
    {id: "admin", obj: new AdminMenu()},
    {id: "lobby", obj: new LobbyMenu()},
    {id: "custom", obj: new CustomMenu()},
    {id: "game", obj: new GameMenu()}
  ];
  
  this.menus = [];
  for(var i=0;i<m.length;i++) {
    this.menus[i] = (m[i].obj);
    this[m[i].id] = m[i].obj;
  }
  
  this.lastNav = "";
  var tmp = this;
  window.onpopstate = function(e) {
    if(tmp[tmp.lastNav] && tmp[tmp.lastNav].onBack) { tmp.onBack(); return; }
    if(e.state && e.state.pageTitle !== "20XX"){
        document.getElementById("content").innerHTML = e.state.html;
        document.title = e.state.pageTitle;
    }
    else if(e.state && e.state.pageTitle === "20XX"){
      window.history.back();
    }
  };
  
  this.hideAll();
};

Menu.prototype.init = function() {
  if(this.supported()) { this.auth.show(); }
  else { this.connect.show("iOS is not supported", 1); }
};

Menu.prototype.supported = function() {
  var iDevices = [
    'iPad',
    'iPhone',
    'iPod'
  ];

  if(!!navigator.platform) {
    while(iDevices.length) {
      if(navigator.platform.includes(iDevices.pop())) { return false; }
    }
  }
  
  return true;
};

Menu.prototype.resize = function() {
  this.lobby.resize();
};

Menu.prototype.hideAll = function() {
  for(var i=3;i<this.menus.length;i++) { /* Skip first 3 elements because they are ErrorMenu and WarningMenu and InfoMenu which display on top of all other menus */
    this.menus[i].hide();
  }
};

/* Pushes menu changes into history state. */
Menu.prototype.navigation = function(id, nam) {
  this.lastNav = id;
  window.history.replaceState({html:"index.html", pageTitle:"20XX"}, nam, "#"+nam);
};

Menu.prototype.onBack = function() {
  window.history.pushState({html:"index.html", pageTitle:"20XX"}, "", "#");
  this[this.lastNav].onBack();
};