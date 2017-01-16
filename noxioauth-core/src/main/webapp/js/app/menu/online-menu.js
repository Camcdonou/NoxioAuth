"use strict";
/* global main */

function OnlineMenu() {
  this.element = document.getElementById("online");
  
  /* Prototype functions for sub menus to use */
  var hide = function() {
    this.element.classList.remove("selected");
    for(var i=0;i<this.items.length;i++) {
      this.items[i].style.display = "none";
    }
  };
  var show = function() {
    main.menu.online.hideAll();
    this.element.classList.add("selected");
    for(var i=0;i<this.items.length;i++) {
      this.items[i].style.display = "block";
    }
  };
  
  /* Creates sub menus */
  this.items = {
    server: {
      element: document.getElementById("online-server"),
      hide: hide,
      show: function() {
        main.menu.online.hideAll();
        this.element.classList.add("selected");
        this.container.style.display = "block";
        this.container.innerHTML = "<div class='main-menu sm'>Retreiving server information...</div>";
        main.net.auth.state.getServerInfo();
      },
      showServerInfo: function(info) {
        this.container.innerHTML = "";
        for(var i=0;i<info.servers.length;i++) {
          this.container.innerHTML += "<div class='main-menu sm btn' onclick=\"console.log('" + info.servers[i].adress + ":" + info.servers[i].port + "')\">" + info.servers[i].name + " | " + info.servers[i].location + "</div>";
        }
      },
      container: document.getElementById("online-server-cont"),
      items: []
    },
    setting: {
      element: document.getElementById("online-setting"),
      hide: hide,
      show: show,
      items: [
        document.getElementById("online-setting-1"),
        document.getElementById("online-setting-2"),
        document.getElementById("online-setting-3"),
        document.getElementById("online-setting-4"),
        document.getElementById("online-setting-5")
      ]
    },
    logout: {
      element: document.getElementById("online-logout"),
      hide: hide,
      show: show,
      onEnter: function() { reset(); }, //This is a unique function call only used for restarting the JS client on a new session.
      items: []
    }
  };
};

/* Shows this menu */
OnlineMenu.prototype.show = function() {
  main.menu.hideAll();
  this.hideAll();
  document.getElementById("online-user").innerHTML = main.net.user;
  this.element.style.display = "block";
};

/* Hide this menu */
OnlineMenu.prototype.hide = function() {
  this.element.style.display = "none";
};

/* Hides all sub menus in this menu */
OnlineMenu.prototype.hideAll = function() {
  this.items.server.hide();
  this.items.setting.hide();
  this.items.logout.hide();
};