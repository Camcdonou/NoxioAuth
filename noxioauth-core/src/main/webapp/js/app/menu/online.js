"use strict";

menu.online = {};

menu.online.element = document.getElementById("online");

menu.online.proto = {
  hide: function() {
    this.element.classList.remove("selected");
    for(var i=0;i<this.items.length;i++) {
      this.items[i].style.display = "none";
    }
  },
  show: function() {
    menu.online.hideAll();
    this.element.classList.add("selected");
    for(var i=0;i<this.items.length;i++) {
      this.items[i].style.display = "block";
    }
  }
};

menu.online.show = function() {
  menu.hideAll();
  menu.online.hideAll();
  document.getElementById("online-user").innerHTML = net.user;
  menu.online.element.style.display = "block";
};

menu.online.hide = function() {
  menu.online.element.style.display = "none";
};

menu.online.hideAll = function() {
  menu.online.items.server.hide();
  menu.online.items.setting.hide();
};

menu.online.items = {
  server: {
    element: document.getElementById("online-server"),
    hide: function() {
      this.element.classList.remove("selected");
      this.container.style.display = "none";
    },
    show: function() {
      menu.online.hideAll();
      this.element.classList.add("selected");
      this.container.style.display = "block";
      this.container.innerHTML = "<div class='main-menu sm'>Retreiving server information...</div>";
      net.auth.online.getServerInfo();
    },
    showServerInfo: function(info) {
      this.container.innerHTML = "";
      for(var i=0;i<info.servers.length;i++) {
        this.container.innerHTML += "<div class='main-menu sm btn' onclick=\"console.log('" + info.servers[i].adress + ":" + info.servers[i].port + "')\">" + info.servers[i].name + " | " + info.servers[i].location + "</div>";
      }
    },
    container: document.getElementById("online-server-cont")
  },
  setting: {
    element: document.getElementById("online-setting"),
    hide: menu.online.proto.hide,
    show: menu.online.proto.show,
    items: [
      document.getElementById("online-setting-1"),
      document.getElementById("online-setting-2"),
      document.getElementById("online-setting-3"),
      document.getElementById("online-setting-4"),
      document.getElementById("online-setting-5")
    ]
  }
};