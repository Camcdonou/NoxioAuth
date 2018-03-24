"use strict";
/* global main */

function UnlockMenu() {
  this.element = document.getElementById("unlock");
  
  this.head = document.getElementById("unlock-head");
  this.container = document.getElementById("unlock-container");
  this.back = document.getElementById("unlock-back");
  this.info = document.getElementById("unlock-info");
  
  this.modal = {
    close: document.getElementById("unlock-info-close"),
    name: document.getElementById("unlock-info-mod-name"),
    img: document.getElementById("unlock-info-mod-img"),
    price: document.getElementById("unlock-info-mod-price"),
    desc: document.getElementById("unlock-info-mod-desc"),
    confirm: document.getElementById("unlock-info-confirm")
  };
  
  var parent = this;
  this.modal.close.onclick = function() { parent.info.style.display = "none"; };
  window.onclick = function(event) {
    if (event.target === parent.info) {
      main.menu.unlock.info.style.display = "none";
    }
  };
  
  this.listCharacters = [];
  this.listAlternates = [];
  this.listFeatures = [];
};

UnlockMenu.prototype.loadUnlockList = function(unlocks) {
  for(var i=0;i<unlocks.length;i++) {
    var u = unlocks[i];
    switch(u.type) {
      case "CHARACTER" : { this.listCharacters.push(u); break; }
      case "ALTERNATE" : { this.listAlternates.push(u); break; }
      case "FEATURE"   : { this.listFeatures.push(u); break; }
    }
  }
};

UnlockMenu.prototype.generateMenu = function(title, list) {
  this.currentList = list;
  this.head.innerHTML = title;
  var g = "";
  for(var i=0;i<list.length;i++) {
    var itm = list[i];
    if(itm.hidden) { continue; }
    g += 
      "<div class='unl-box' onclick='main.menu.unlock.showInfoModal("+i+")'>" +
      "<div class='unl-box-img-cont'><img src='img/aes/unl/" + itm.key + ".png' class='unl-box-img'></div>" +
      "<div class='unl-box-name'>" + itm.name + "</div>";
    if(!main.unlocks.has(itm.key)) {
      g += "<div class='unl-box-cred'></div><div class='unl-box-price'>" + itm.price + "</div></div>";
    }
    else {
      g += "<div class='unl-box-price'>Unlocked</div></div>";
    }
  }
  this.container.innerHTML = g;
  this.info.style.display = "hidden";
};

UnlockMenu.prototype.confirmUnlock = function(index) {
  this.hideInfoModal();
  main.net.auth.state.requestUnlock(this.currentList[index].key);
};

UnlockMenu.prototype.showInfoModal = function(index) {
  var itm = this.currentList[index];
  
  this.modal.name.innerHTML = itm.name;
  this.modal.img.src = "img/aes/unl/" + itm.key + ".png";
  this.modal.price.innerHTML = itm.price;
  this.modal.desc.innerHTML = itm.description;
  this.modal.confirm.onclick = function() { main.menu.unlock.confirmUnlock(index+""); };
  
  this.info.style.display = "block";
};

UnlockMenu.prototype.hideInfoModal = function() {
  this.modal.confirm.onclick = "";
  this.info.style.display = "none";
};

/* Type corresponds to which type of unlocks we are showing -
 * - CHARACTER
 * - ALTERNATE
 * - FEATURE
 */
UnlockMenu.prototype.show = function(type) {
  main.menu.hideAll();
  this.hideInfoModal();
  switch(type) {
    case "CHARACTER" : { this.generateMenu("Characters", this.listCharacters); break; }
    case "ALTERNATE" : { this.generateMenu("Alternate Characters", this.listAlternates); break; }
    case "FEATURE"   : { this.generateMenu("Special Features", this.listFeatures); break; }
  }
  main.menu.credit.show();
  main.menu.rank.show();
  this.element.style.display = "block";
};

UnlockMenu.prototype.hide = function() {
  this.element.style.display = "none";
  this.hideInfoModal();
};