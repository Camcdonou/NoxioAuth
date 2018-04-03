"use strict";
/* global main */

function InfoMenu() {
  this.modal = document.getElementById('info');
  this.close = document.getElementById("info-close");
  this.head = document.getElementById("info-head");
  this.body = document.getElementById("info-body");
  
  var parent = this;
  this.close.onclick = function() { parent.hide(); };
  document.addEventListener("click", function(event){
    if (event.target === parent.modal) {
      parent.hide();
    }
  });
};

InfoMenu.prototype.show = function(title, content) {
  this.modal.style.display = "block";
  this.head.innerHTML = title;
  this.body.innerHTML = content;
};


InfoMenu.prototype.hide = function() {
  this.modal.style.display = "none";
};