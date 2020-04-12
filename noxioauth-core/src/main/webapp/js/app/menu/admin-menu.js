"use strict";
/* global main */

function AdminMenu() {
  this.element = document.getElementById("admin");
  this.info = document.getElementById("admin-info");
  this.inpUid = document.getElementById("admin-control-uid");
  this.inpBan = document.getElementById("admin-control-ban-length");
  this.inpName = document.getElementById("admin-control-name-input");
  this.inpMsg = document.getElementById("admin-control-msg");
  
  this.btnBan = document.getElementById("admin-control-ban");
  this.btnName = document.getElementById("admin-control-name");
  this.btnReset = document.getElementById("admin-control-reset");
  this.btnFree = document.getElementById("admin-control-free");
  this.btnLite = document.getElementById("admin-control-lite");
  this.btnFull = document.getElementById("admin-control-full");
  this.btnMod = document.getElementById("admin-control-mod");
  this.btnSupport = document.getElementById("admin-control-support");
  this.btnSend = document.getElementById("admin-control-send");
  this.btnRefresh = document.getElementById("admin-control-refresh");
  this.btnBack = document.getElementById("admin-control-back");
  
  var tmp = this;
  this.btnBan.onclick = function() { tmp.banUser(); };
  this.btnName.onclick = function() { tmp.nameChange(); };
  this.btnReset.onclick = function() { tmp.resetCustoms(); };
  this.btnFree.onclick = function() { tmp.setUserType("FREE"); };
  this.btnLite.onclick = function() { tmp.setUserType("SPEC"); };
  this.btnFull.onclick = function() { tmp.setUserType("FULL"); };
  this.btnMod.onclick = function() { tmp.setUserType("MOD"); };
  this.btnSupport.onclick = function() { tmp.setSupport(); };
  this.btnSend.onclick = function() { tmp.sendGlobalMessage(); };
  this.btnRefresh.onclick = function() { main.menu.admin.show(); };
  this.btnBack.onclick = function() { main.menu.online.show(); };
};

AdminMenu.prototype.nameChange = function() {
  main.net.auth.state.adminNameChange(this.inpUid.value, this.inpName.value);
};

AdminMenu.prototype.resetCustoms = function() {
  main.net.auth.state.adminResetCustoms(this.inpUid.value);
};

AdminMenu.prototype.setUserSupport = function() {
  main.net.auth.state.adminSetUserSupport(this.inpUid.value);
};

AdminMenu.prototype.banUser = function() {
  main.net.auth.state.adminBan(this.inpUid.value, this.inpBan.value);
};

AdminMenu.prototype.setUserType = function(type) {
  main.net.auth.state.adminSetUserType(this.inpUid.value, type);
};

AdminMenu.prototype.sendGlobalMessage = function() {
  main.net.auth.state.adminSendGlobalMessage(this.inpMsg.value);
};

/* Creates a table from the given admin info */
AdminMenu.prototype.generate = function(info) {
  var tb = "";
  tb = "<table style='width:100%'>";
  tb += "<tr><th>UID</th><th>Name</th><th>Display</th><th>Email</th><th>Type</th><th>Supporter</th><th>Custom Sound</th><th>Custom Message</th><th>Created</th><th>Updated</th><th>Logged</th><th>Banned Until</th></tr>";
  for(var i=0;i<info.users.length;i++) {
    var u = info.users[i];
    tb += "<tr>";
    tb += "<td>"+u.uid+"</td>";
    tb += "<td>"+u.name+"</td>";
    tb += "<td>"+u.display+"</td>";
    tb += "<td>"+u.email+"</td>";
    tb += "<td>"+u.type+"</td>";
    tb += "<td>"+u.supporter+"</td>";
    tb += u.customSound?"<td onclick='window.open(\"./file/sound/" + u.customSound + "\")'>" + u.customSound + "</td>":"<td></td>";
    tb += (u.customMsgA||u.customMsgB)?"<td class='admin-table-tiny'>" + u.customMsgA + "<br>" + u.customMsgB + "</td>":"<td></td>";
    tb += "<td class='admin-table-date'>"+u.created+"</td>";
    tb += "<td class='admin-table-date'>"+u.updated+"</td>";
    tb += "<td class='admin-table-date'>"+u.lastLogin+"</td>";
    tb += u.suspendUntil?"<td class='admin-table-date'>"+u.suspendUntil+"</td>":"<td></td>";
    tb += "</tr>";
  }
  tb += "</table>";
  this.info.innerHTML = tb;
};

AdminMenu.prototype.back = function() {
  main.menu.online.show();
};

AdminMenu.prototype.show = function() {
  main.menu.navigation("admin", "admin");
  main.menu.hideAll();
  main.net.auth.state.requestAdminMenu();
  this.element.style.display = "block";
};

AdminMenu.prototype.hide = function() {
  this.element.style.display = "none";
};

/* Called when the back button is hit on this menu */
AdminMenu.prototype.onBack = function() {
  this.back();
};