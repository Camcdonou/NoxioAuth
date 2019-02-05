"use strict";
/* global main */

function AdminMenu() {
  this.element = document.getElementById("admin");
  this.info = document.getElementById("admin-info");
  this.inpUid = document.getElementById("admin-control-uid");
  this.inpBan = document.getElementById("admin-control-ban-length");
  
  this.btnBan = document.getElementById("admin-control-ban");
  this.btnFree = document.getElementById("admin-control-free");
  this.btnLite = document.getElementById("admin-control-lite");
  this.btnFull = document.getElementById("admin-control-full");
  this.btnMod = document.getElementById("admin-control-mod");
  this.btnSupport = document.getElementById("admin-control-support");
  
  var tmp = this;
  this.btnBan.onclick = function() { tmp.banUser(); };
  this.btnFree.onclick = function() { tmp.setUserType("FREE"); };
  this.btnLite.onclick = function() { tmp.setUserType("LITE"); };
  this.btnFull.onclick = function() { tmp.setUserType("FULL"); };
  this.btnMod.onclick = function() { tmp.setUserType("MOD"); };
  this.btnSupport.onclick = function() { tmp.setSupport(); };
};

AdminMenu.prototype.setUserSupport = function() {
  main.net.auth.state.adminSetUSERSupport(this.inpUid.value);
};

AdminMenu.prototype.banUser = function() {
  main.net.auth.state.adminBan(this.inpUid.value, this.inpBan.value);
};

AdminMenu.prototype.setUserType = function(type) {
  main.net.auth.state.adminSetUserType(this.inpUid.value, type);
};

/* Creates a table from the given admin info */
AdminMenu.prototype.generate = function(info) {
  var tb = "";
  tb = "<table style='width:100%'>";
  tb += "<tr><th>UID</th><th>Name</th><th>Display</th><th>Email</th><th>Type</th><th>Supporter</th><th>Created</th><th>Updated</th><th>Logged</th><th>Banned Until</th></tr>";
  for(var i=0;i<info.users.length;i++) {
    var u = info.users[i];
    tb += "<tr>";
    tb += "<td>"+u.uid+"</td>";
    tb += "<td>"+u.name+"</td>";
    tb += "<td>"+u.display+"</td>";
    tb += "<td>"+u.email+"</td>";
    tb += "<td>"+u.type+"</td>";
    tb += "<td>"+u.supporter+"</td>";
    tb += "<td>"+u.created+"</td>";
    tb += "<td>"+u.updated+"</td>";
    tb += "<td>"+u.lastLogin+"</td>";
    tb += "<td>"+u.suspendUntil+"</td>";
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