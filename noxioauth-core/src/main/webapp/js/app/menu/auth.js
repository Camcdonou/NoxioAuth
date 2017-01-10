"use strict";

menu.auth = {};

menu.auth.element = document.getElementById("auth");

menu.auth.proto = {
  hide: function() {
    this.element.classList.remove("selected");
    for(var i=0;i<this.items.length;i++) {
      this.items[i].style.display = "none";
    }
  },
  show: function() {
    menu.auth.hideAll();
    this.element.classList.add("selected");
    for(var i=0;i<this.items.length;i++) {
      this.items[i].style.display = "block";
    }
  }
};

menu.auth.show = function() {
  menu.hideAll();
  menu.auth.hideAll();
  menu.auth.element.style.display = "block";
};

menu.auth.hide = function() {
  menu.auth.element.style.display = "none";
};

menu.auth.hideAll = function() {
  menu.auth.items.login.hide();
  menu.auth.items.create.hide();
  menu.auth.items.about.hide();
};

menu.auth.items = {
  login: {
    element: document.getElementById("auth-login"),
    hide: menu.auth.proto.hide,
    show: menu.auth.proto.show,
    items: [
      document.getElementById("auth-login-username"),
      document.getElementById("auth-login-password"),
      document.getElementById("auth-login-login")
    ],
    onEnter: function() {
      /* @FIXME move the methods this is calling to a state */
      var u = document.getElementById("auth-login-username-input").value;
      var p = document.getElementById("auth-login-password-input").value;
      net.auth.login(u, p);
    }
  },
  create: {
    element: document.getElementById("auth-create"),
    hide: menu.auth.proto.hide,
    show: menu.auth.proto.show,
    items: [
      document.getElementById("auth-create-username"),
      document.getElementById("auth-create-password"),
      document.getElementById("auth-create-create")
    ],
    onEnter: function() {
      /* @FIXME move the methods this is calling to a state */
      var u = document.getElementById("auth-create-username-input").value;
      var p = document.getElementById("auth-create-password-input").value;
      net.auth.create(u, p);
    }
  },
  about: {
    element: document.getElementById("auth-about"),
    hide: menu.auth.proto.hide,
    show: menu.auth.proto.show,
    items: [
      document.getElementById("auth-about-about")
    ]
  }
};