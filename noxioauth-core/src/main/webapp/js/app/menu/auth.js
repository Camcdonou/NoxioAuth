"use strict";

menu.auth = {};

menu.auth.element = document.getElementById("auth");

menu.auth.proto = {
  hide: function() {
    this.element.classList.remove("selected");
    if(this.info !== undefined) { this.info.style.display = "none"; }
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
  },
  showInfo: function(message) {
    this.info.innerHTML = message;
    this.info.style.display = "block";
    
    /*  Animation will not replay unless the DOM is given a chance to update.
        This is a hacky fix for that problem. It doesn't work exactly as it should.
        tmp is created because of javascript being literal cancer with scopes @FIXME
    */
    this.info.classList.remove("info-animate");
    var tmp = this.info;
    setTimeout(function() { tmp.classList.add("info-animate"); }, 1);
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
    info: document.getElementById("auth-login-info"),
    hide: menu.auth.proto.hide,
    show: menu.auth.proto.show,
    showInfo: menu.auth.proto.showInfo,
    items: [
      document.getElementById("auth-login-username"),
      document.getElementById("auth-login-password"),
      document.getElementById("auth-login-login")
    ],
    onEnter: function() {
      var u = document.getElementById("auth-login-username-input");
      var p = document.getElementById("auth-login-password-input");
      net.auth.auth.login(u.value, p.value);
      p.value = "";
    }
  },
  create: {
    element: document.getElementById("auth-create"),
    info: document.getElementById("auth-create-info"),
    hide: menu.auth.proto.hide,
    show: menu.auth.proto.show,
    showInfo: menu.auth.proto.showInfo,
    items: [
      document.getElementById("auth-create-username"),
      document.getElementById("auth-create-password"),
      document.getElementById("auth-create-create")
    ],
    onEnter: function() {
      var u = document.getElementById("auth-create-username-input");
      var p = document.getElementById("auth-create-password-input");
      net.auth.auth.create(u.value, p.value);
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