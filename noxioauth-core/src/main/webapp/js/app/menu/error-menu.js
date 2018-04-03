"use strict";
/* global main */

function ErrorMenu() {
  this.modal = document.getElementById('errorModal');
  this.close = document.getElementById("errorModalClose");
  this.title = document.getElementById("errorModalTitle");
  this.message = document.getElementById("errorModalMessage");
  this.footer = document.getElementById("errorModalFooter");
  
  var parent = this;
  this.close.onclick = function() { parent.hide(); };
  document.addEventListener("click", function(event){
    if (event.target === parent.modal) {
      parent.hide();
    }
  });
};

ErrorMenu.prototype.showError = function(title, message) {
  console.error("##ERROR## " + message);
  this.modal.style.display = "block";
  this.title.innerHTML = title;
  this.message.innerHTML = "<p>" + message + "</p>";
  this.footer.innerHTML = "If you don't know what happened please report this error to infernoplusofficial@gmail...";
};

ErrorMenu.prototype.showErrorException = function(title, message, trace) {
  console.error("##EXCEPTION## " + message + "\n" + trace);
  this.modal.style.display = "block";
  this.title.innerHTML = title;
  this.message.innerHTML = "<p>" + message + "</p><div style='margin-bottom:12px;height:120px;width:100%;font-size:80%;border:1px solid #ccc;background-color:#DDDDDD;overflow:auto;'>" + trace.replace(/\n/g, "<br/>"); + "</div>";
  this.footer.innerHTML = "If you don't know what happened please report this error to infernoplusofficial@gmail.com...";
};

ErrorMenu.prototype.hide = function() {
  this.modal.style.display = "none";
};