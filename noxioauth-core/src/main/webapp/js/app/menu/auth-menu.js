"use strict";
/* global main */

function AuthMenu() {
  this.element = document.getElementById("auth");
  
  /* Prototype functions for sub menus to use */
  var hide = function() {
    this.element.classList.remove("selected");
    if(this.info !== undefined) { this.info.style.display = "none"; }
    for(var i=0;i<this.items.length;i++) {
      this.items[i].style.display = "none";
    }
  };
  var show = function() {
    main.menu.auth.hideAll();
    this.element.classList.add("selected");
    for(var i=0;i<this.items.length;i++) {
      this.items[i].style.display = "block";
    }
  };
  var showInfo = function(message) {
    this.info.innerHTML = message;
    this.info.style.display = "block";
    /*  Animation will not replay unless the DOM is given a chance to update.
        This is a hacky fix for that problem. It doesn't work exactly as it should.
        tmp is created because of javascript being literal cancer with scopes @FIXME
    */
    this.info.classList.remove("info-animate");
    var tmp = this.info;
    setTimeout(function() { tmp.classList.add("info-animate"); }, 1);
  };
  
  /* Creates sub menus */
  this.items = {
    login: {
      element: document.getElementById("auth-login"),
      info: document.getElementById("auth-login-info"),
      hide: hide,
      show: show,
      showInfo: showInfo,
      items: [
        document.getElementById("auth-login-username"),
        document.getElementById("auth-login-password"),
        document.getElementById("auth-login-login")
      ],
      onEnter: function() {
        var u = document.getElementById("auth-login-username-input");
        var p = document.getElementById("auth-login-password-input");
        main.net.auth.state.login(u.value, p.value);
        p.value = "";
      }
    },
    create: {
      element: document.getElementById("auth-create"),
      info: document.getElementById("auth-create-info"),
      hide: hide,
      show: show,
      showInfo: showInfo,
      items: [
        document.getElementById("auth-create-username"),
        document.getElementById("auth-create-password"),
        document.getElementById("auth-create-create")
      ],
      onEnter: function() {
        var u = document.getElementById("auth-create-username-input");
        var p = document.getElementById("auth-create-password-input");
        main.net.auth.state.create(u.value, p.value);
        p.value = "";
      }
    },
    about: {
      element: document.getElementById("auth-about"),
      hide: hide,
      show: show,
      items: [
        document.getElementById("auth-about-about")
      ]
    }
  };
};

/* Shows this menu */
AuthMenu.prototype.show = function() {
  main.menu.hideAll();
  this.hideAll();
  this.element.style.display = "block";
};

/* Hide this menu */
AuthMenu.prototype.hide = function() {
  this.element.style.display = "none";
};

/* Hides all sub menus in this menu */
AuthMenu.prototype.hideAll = function() {
  this.items.login.hide();
  this.items.create.hide();
  this.items.about.hide();
};