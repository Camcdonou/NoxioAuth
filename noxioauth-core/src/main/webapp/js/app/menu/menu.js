var menu = {};

menu.proto = {};

menu.proto.hide = function() {
  this.element.classList.remove("selected");
  for(var i=0;i<this.items.length;i++) {
    this.items[i].style.display = "none";
  }
};

menu.proto.show = function() {
  menu.hideAll();
  this.element.classList.add("selected");
  for(var i=0;i<this.items.length;i++) {
    this.items[i].style.display = "block";
  }
};

menu.hideAll = function() {
  menu.items.login.hide();
  menu.items.create.hide();
  menu.items.about.hide();
};

menu.items = {
  login: {
    element: document.getElementById("login"),
    hide: menu.proto.hide,
    show: menu.proto.show,
    items: [
      document.getElementById("login-username"),
      document.getElementById("login-password"),
      document.getElementById("login-login")
    ]
  },
  create: {
    element: document.getElementById("create"),
    hide: menu.proto.hide,
    show: menu.proto.show,
    items: [
      document.getElementById("create-username"),
      document.getElementById("create-password"),
      document.getElementById("create-login")
    ]
  },
  about: {
    element: document.getElementById("about"),
    hide: menu.proto.hide,
    show: menu.proto.show,
    items: [
      document.getElementById("about-about")
    ]
  }
};

menu.hideAll();