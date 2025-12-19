"use strict";
/* global main */

function AuthMenu() {
  this.element = document.getElementById("auth");
  this.link = document.getElementById("auth-link");
  
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
  var parent = this;
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
        parent.login(u.value, p.value);
        p.value = "";
      }
    },
    create: {
      element: document.getElementById("auth-create"),
      hide: hide,
      show: show,
      items: [
        document.getElementById("auth-create-username"),
        document.getElementById("auth-create-password-a"),
        document.getElementById("auth-create-password-b"),
        document.getElementById("auth-create-warning"),
        document.getElementById("auth-create-create")
      ],
      onEnter: function() {
        var u = document.getElementById("auth-create-username-input");
        var pa = document.getElementById("auth-create-password-a-input");
        var pb = document.getElementById("auth-create-password-b-input");
        if(pa.value !== pb.value) { main.menu.warning.show("Your passwords do not match."); return; }
        parent.create(u.value, pa.value);
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
  
  this.items.about.items[0].innerHTML = this.items.about.items[0].innerHTML.replace("_VER", _VER());
  
  /* ENTER keypress to SUBMIT on fields.*/
  var tmp = this;
  this.items.login.items[0].addEventListener("keyup", function(evt) { if(evt.keyCode === 13) { tmp.items.login.items[2].click(); } });
  this.items.login.items[1].addEventListener("keyup", function(evt) { if(evt.keyCode === 13) { tmp.items.login.items[2].click(); } });
  
  this.items.create.items[0].addEventListener("keyup", function(evt) { if(evt.keyCode === 13) { tmp.items.create.items[4].click(); } });
  this.items.create.items[1].addEventListener("keyup", function(evt) { if(evt.keyCode === 13) { tmp.items.create.items[4].click(); } });
  this.items.create.items[2].addEventListener("keyup", function(evt) { if(evt.keyCode === 13) { tmp.items.create.items[4].click(); } });
};

AuthMenu.prototype.guest = function() {
  main.net.connect();
};

AuthMenu.prototype.login = function(user, pass) {
  main.net.connect(user, pass);
};

AuthMenu.prototype.create = function(user, pass) {
  main.menu.connect.show("Creating Account");
  $.ajax({
    url: window.location.protocol + "//" + window.location.host + "/nxc/auth/create",
    type: 'POST',
    data: JSON.stringify({user: user, hash: sha256("20"+pass+"xx")}),
    contentType : 'application/json',
    timeout: 120000,
    success: function() {
      main.menu.connect.show("Account Created");
      reset(5000);
    },
    error: function(data) {
      if(data) { main.menu.warning.show(data.responseJSON.message); main.menu.auth.show(); }
      else { main.menu.connect.show("Request Timed Out", 1); }
    }
  });
};

/* Shows this menu */
AuthMenu.prototype.show = function() {
  main.menu.navigation("auth", "login");
  main.menu.hideAll();
  this.hideAll();
  this.element.style.display = "block";
  this.link.style.display = "block";
  main.menu.footer.show();
};

/* Hide this menu */
AuthMenu.prototype.hide = function() {
  this.element.style.display = "none";
  this.link.style.display = "none";
};

/* Hides all sub menus in this menu */
AuthMenu.prototype.hideAll = function() {
  this.items.login.hide();
  this.items.create.hide();
  this.items.about.hide();
};