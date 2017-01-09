var webSocket;
var wsInitial;

var establish = function() {
    wsInitial = false;
    connect("68.34.229.231");

    var re = function() {
      if(!isConnected() && wsInitial === false) {
        connect("localhost");
      }
      else {
        setTimeout(re, 1000);
      }
    };
    
    setTimeout(re, 1000);
};


var isConnected = function() {
  return webSocket !== undefined && webSocket.readyState !== WebSocket.CLOSED;
};

var connect = function(ws){
  if(isConnected()) {
    return;
  }

  webSocket = new WebSocket("ws://" + ws + ":7001/noxioauth/auth");
  document.getElementById("connection-info").innerHTML = "Connecting @" + ws + "...";

  webSocket.onopen = function(event){
    if(event.type !== "open") {
      error.showError("Connection Error", "ws openEvent.type mismatch!");
      close();
      return;
    }
    wsInitial = true;
    document.getElementById("connection-info").innerHTML = "Connected...";
    setTimeout(function(){document.getElementById("connection").style.display = "none";document.getElementById("authenticate").style.display = "block";}, 1000);
  };

  webSocket.onmessage = function(event){
    
  };

  webSocket.onclose = function(event){
    /* error handling? */
    document.getElementById("connection-info").innerHTML = "Connection closed...";
    webSocket = undefined;
  };
};

var send = function(data){
  webSocket.send(data);
};

var close = function(){
  webSocket.close();
};

/** Initial Connection **/
establish();