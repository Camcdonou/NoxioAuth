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
  
  /* Creates sub menus */
  this.items = {
    login: {
      element: document.getElementById("auth-login"),
      hide: hide,
      show: show,
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
      hide: hide,
      show: show,
      items: [
        document.getElementById("auth-create-username"),
        document.getElementById("auth-create-email"),
        document.getElementById("auth-create-password-a"),
        document.getElementById("auth-create-password-b"),
        document.getElementById("auth-create-create")
      ],
      onEnter: function() {
        var u = document.getElementById("auth-create-username-input");
        var e = document.getElementById("auth-create-email-input");
        var pa = document.getElementById("auth-create-password-a-input");
        var pb = document.getElementById("auth-create-password-b-input");
        if(pa.value !== pb.value) { main.menu.warning.show("Your passwords do not match."); return; }
        main.net.auth.state.create(u.value, e.value, pa.value);
        pa.value = ""; pb.value = "";
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
  
  /* ENTER keypress to SUBMIT on fields.*/
  var tmp = this;
  this.items.login.items[0].addEventListener("keyup", function(evt) { if(evt.keyCode === 13) { tmp.items.login.items[2].click(); } });
  this.items.login.items[1].addEventListener("keyup", function(evt) { if(evt.keyCode === 13) { tmp.items.login.items[2].click(); } });
  
  this.items.create.items[0].addEventListener("keyup", function(evt) { if(evt.keyCode === 13) { tmp.items.create.items[4].click(); } });
  this.items.create.items[1].addEventListener("keyup", function(evt) { if(evt.keyCode === 13) { tmp.items.create.items[4].click(); } });
  this.items.create.items[2].addEventListener("keyup", function(evt) { if(evt.keyCode === 13) { tmp.items.create.items[4].click(); } });
  this.items.create.items[3].addEventListener("keyup", function(evt) { if(evt.keyCode === 13) { tmp.items.create.items[4].click(); } });
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