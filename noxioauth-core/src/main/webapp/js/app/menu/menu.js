"use strict";
/* global main */

/* @FIXME
   Calls from inputs and etc from menu could be made into some kind of generic event.
   Maybe look into it, it would be a minor improvement but might be worth it.
 */

function Menu() {
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
    {id: "buy", obj: new BuyMenu()},
    {id: "lobby", obj: new LobbyMenu()},
    {id: "game", obj: new GameMenu()}
  ];
  
  this.menus = [];
  for(var i=0;i<m.length;i++) {
    this.menus[i] = (m[i].obj);
    this[m[i].id] = m[i].obj;
  }
  
  this.hideAll();
};

Menu.prototype.resize = function() {
  this.lobby.resize();
};

Menu.prototype.hideAll = function() {
  for(var i=3;i<this.menus.length;i++) { /* Skip first 3 elements because they are ErrorMenu and WarningMenu and InfoMenu which display on top of all other menus */
    this.menus[i].hide();
  }
};