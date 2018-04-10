"use strict";

function Display() {
  this.element = document.getElementById("disp");
  this.info = document.getElementById("disp-info");
  this.sub = document.getElementById("disp-sub");
};

/* icon params 
 * 0 - spin
 * 1 - error
 * 2 - done
 */
Display.prototype.show = function(message, icon, sub) {
  switch(icon) {
    case 1  : { this.info.innerHTML = message + " <img alt='Error.' src='../img/aes/alert.svg' class='ico-disp'/>"; break; }
    case 2  : { this.info.innerHTML = message + " <img alt='Done.' src='../img/aes/blip-hov.png' class='ico-disp'/>"; break; }
    default : { this.info.innerHTML = message + " <img alt='Loading.' src='../img/aes/spin-black.svg' class='ico-disp'/>"; break; }
  }
  if(sub) { this.sub.style.display = "block"; this.sub.innerHTML = sub; }
  else { this.sub.style.display = "none"; this.sub.innerHTML = ""; }
  this.element.style.display = "block";
};

Display.prototype.hide = function() {
  this.element.style.display = "none";
};

function main() {
  /* Init */
  disp.show("Checking Transaction", 0);

  /* Parse Params */
  var urlParams = new URLSearchParams(window.location.search);
  var params =  {token: urlParams.get("token")};
  if(!params.token) {
    disp.show("Invalid Transaction", 1); return;
  }

  /* Make Request */
  disp.show("Canceling Transaction", 0);
  $.ajax({
    type: "POST",
    url: "../pay/cancel",
    contentType: "application/json; charset=utf-8",
    data: JSON.stringify(params),
    success: onSuccess,
    error: onError
  });
}

function onSuccess() {
  var dots = ".";
  var cnt = 0;
  var autoClose = function() {
    disp.show("Transaction Canceled", 2, "Returning to main site" + dots);
    cnt++; dots += ".";
    if(cnt > 3) { window.close(); return; }
    setTimeout(autoClose, 1000);
  };
  autoClose();
}

function onError(XMLHttpRequest, textStatus, errorThrown) {
  disp.show("Error", 1, textStatus + " :: " + XMLHttpRequest.responseText);
}

var disp = new Display();
main();