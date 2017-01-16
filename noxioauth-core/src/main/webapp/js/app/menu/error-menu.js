"use strict";
/* global main */

function ErrorMenu() {
  this.modal = document.getElementById('errorModal');
  this.close = document.getElementById("errorModalClose");
  this.title = document.getElementById("errorModalTitle");
  this.message = document.getElementById("errorModalMessage");
  this.footer = document.getElementById("errorModalFooter");
  
  this.close.onclick = function() {
      main.menu.error.modal.style.display = "none";
  };
  
  window.onclick = function(event) {
    if (event.target === main.menu.error.modal) {
      main.menu.error.modal.style.display = "none";
    }
  };
};

ErrorMenu.prototype.showError = function(title, message) {
  this.modal.style.display = "block";
  this.title.innerHTML = title;
  this.message.innerHTML = "<p>" + message + "</p>";
  this.footer.innerHTML = "If you don't know what happened please report this error to help@help.help...";
};

ErrorMenu.prototype.showErrorException = function(title, message, trace) {
  this.modal.style.display = "block";
  this.title.innerHTML = title;
  this.message.innerHTML = "<p>" + message + "</p><div style='margin-bottom:12px;height:120px;width:100%;font-size:80%;border:1px solid #ccc;background-color:#DDDDDD;overflow:auto;'>" + trace + "</div>";
  this.footer.innerHTML = "If you don't know what happened please report this error to help@help.help...";
};

ErrorMenu.prototype.hide = function() {
  /* This menu class ignores hide since it displays on top of everything else as a modal. */
};