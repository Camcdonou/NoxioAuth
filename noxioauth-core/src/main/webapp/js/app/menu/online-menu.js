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
        this.container.innerHTML = "<div class='menu sub'>Retreiving server info...</div>";
        main.net.auth.state.getServerInfo();
      },
      showServerInfo: function(info) {
        this.container.innerHTML = "";
        for(var i=0;i<info.length;i++) {
          this.container.innerHTML += "<div id='online-server-list-" + i + "' class='menu sub btn serv'>" + info[i].address + ":" + info[i].port + " <svg class='ico-serv' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='xMidYMid' class='lds-dual-ring' style='background: none;'><circle cx='50' cy='50' ng-attr-r='{{config.radius}}' ng-attr-stroke-width='{{config.width}}' ng-attr-stroke='{{config.stroke}}' ng-attr-stroke-dasharray='{{config.dasharray}}' fill='none' stroke-linecap='round' r='42' stroke-width='20' stroke='currentColor' stroke-dasharray='65.97344572538566 65.97344572538566' transform='rotate(198.008 50 50)'><animateTransform attributeName='transform' type='rotate' calcMode='linear' values='0 50 50;360 50 50' keyTimes='0;1' dur='1s' begin='0s' repeatCount='indefinite'></animateTransform></circle></svg></div>";
          main.net.auth.state.checkServerStatus(i, info[i].address, info[i].port, info[i]);
        }
      },
      updateServerInfo: function(id, address, port, info) {
        var elm = document.getElementById("online-server-list-" + id);
        
        if(info === undefined) { //Server Offline
          elm.innerHTML = address + ":" + port + "<svg xmlns:dc='http://purl.org/dc/elements/1.1/' xmlns:cc='http://creativecommons.org/ns#' xmlns:rdf='http://www.w3.org/1999/02/22-rdf-syntax-ns#' xmlns:svg='http://www.w3.org/2000/svg' xmlns='http://www.w3.org/2000/svg' class='ico-serv' viewBox='0 0 45 45' style='enable-background:new 0 0 45 45;' xml:space='preserve' version='1.1' id='svg2'><metadata id='metadata8'><rdf:RDF><cc:Work rdf:about=''><dc:format>image/svg+xml</dc:format><dc:type rdf:resource='http://purl.org/dc/dcmitype/StillImage'/></cc:Work></rdf:RDF></metadata><defs id='defs6'><clipPath id='clipPath16' clipPathUnits='userSpaceOnUse'><path id='path18' d='M 0,36 36,36 36,0 0,0 0,36 Z'/></clipPath></defs><g transform='matrix(1.25,0,0,-1.25,0,45)' id='g10'><g id='g12'><g clip-path='url(#clipPath16)' id='g14'><g transform='translate(22.2383,17.9956)' id='g20'><path id='path22' style='fill:currentColor;fill-opacity:1;fill-rule:nonzero;stroke:none' d='m 0,0 9.883,9.883 c 1.172,1.171 1.172,3.071 0,4.242 -1.172,1.171 -3.071,1.172 -4.242,0 l -9.883,-9.883 -9.883,9.883 c -1.171,1.172 -3.071,1.172 -4.243,0 -1.171,-1.171 -1.171,-3.071 10e-4,-4.243 L -8.484,0 -18.391,-9.907 c -1.172,-1.171 -1.172,-3.071 0,-4.242 0.586,-0.586 1.354,-0.879 2.121,-0.879 0.768,0 1.536,0.293 2.122,0.879 l 9.906,9.906 9.883,-9.882 c 0.586,-0.585 1.353,-0.878 2.121,-0.878 0.767,0 1.535,0.293 2.121,0.878 1.172,1.171 1.172,3.072 0,4.243 L 0,0 Z'/></g></g></g></g></svg>";
        }
        else { //Server Online
          elm.classList.add("btn");
          elm.onclick = function() { main.net.game.establish(address, port); };
          elm.innerHTML = info.name + " | " + info.location  + "<svg class='ico-serv' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg' version='1.1'><circle cx='100' cy='100' r='85' fill='none' stroke='currentColor' stroke-width='30' /></svg>";
        }
      },
      container: document.getElementById("online-server-cont"),
      items: [
        document.getElementById("online-server-cont")
      ]
    },
    unlock: {
      element: document.getElementById("online-unlock"),
      hide: hide,
      show: show,
      items: [
        document.getElementById("online-unlock-1"),
        document.getElementById("online-unlock-2"),
        document.getElementById("online-unlock-3")
      ]
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
  this.items.server.show();
  main.menu.credit.show();
  this.element.style.display = "block";
};

/* Hide this menu */
OnlineMenu.prototype.hide = function() {
  this.element.style.display = "none";
};

/* Hides all sub menus in this menu */
OnlineMenu.prototype.hideAll = function() {
  this.items.server.hide();
  this.items.unlock.hide();
  this.items.setting.hide();
  this.items.logout.hide();
};