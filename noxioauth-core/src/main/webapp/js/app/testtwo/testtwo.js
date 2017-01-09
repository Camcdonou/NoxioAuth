var webSocket;
var wsInitial;

var establish = function() {
    wsInitial = false;
    connect("localhost");

    var re = function() {
      if(!isConnected() && wsInitial === false) {
        connect("68.34.229.231");

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

  webSocket = new WebSocket("ws://" + ws + ":7001/noxioauth/livemessages");
  pageConnect("Attempting connection @" + ws);

  webSocket.onopen = function(event){
    if(event.data === undefined) {
        return;
    }
    wsInitial = true;
    pageConnect("Connection established");
    pageLogin();
  };

  webSocket.onmessage = function(event){
    handlePacket(event.data);
  };

  webSocket.onclose = function(event){
    /* error handling? */
    pageConnect("Connection closed");
    webSocket = undefined;
  };
};

var pageConnectDom = document.getElementById("connect");
var pageAuthDom = document.getElementById("authenticate");
var pageLoginDom = document.getElementById("login");
var pageCreateDom = document.getElementById("create");
var pageChatDom = document.getElementById("chat");
var pageHideAll = function() {
  pageConnectDom.style.display = "none";
  pageAuthDom.style.display = "none";
  pageLoginDom.style.display = "none";
  pageCreateDom.style.display = "none";
  pageChatDom.style.display = "none";
};

var pageConnect = function(message) {
  pageHideAll();
  pageConnectDom.style.display = "inline";
  pageConnectDom.innerHTML += message + "<br/>";
};

var pageLogin = function() {
  pageHideAll();
  pageAuthDom.style.display = "inline";
  pageLoginDom.style.display = "inline";
};

var pageCreate = function() {
  pageHideAll();
  pageAuthDom.style.display = "inline";
  pageCreateDom.style.display = "inline";
};

var pageCreateError = function(message) {
  var cs = document.getElementById("createsuccess");
  cs.innerHTML = "";
  var ce = document.getElementById("createerror");
  ce.innerHTML = message;
};

var pageCreateSuccess = function(message) {
  var ce = document.getElementById("createerror");
  ce.innerHTML = "";
  var cs = document.getElementById("createsuccess");
  cs.innerHTML = message;
};

var pageLoginError = function(message) {
  var le = document.getElementById("loginerror");
  le.innerHTML = message;
};

var pageChat = function() {
  pageHideAll();
  pageChatDom.style.display = "inline";
};

var pageChatMessage = function(user, message) {
  var ccw = document.getElementById("chatwindow");
  ccw.innerHTML += user + " > " + message + "<br/>";
};

var pageInfoMessage = function(message) {
  var ccw = document.getElementById("chatwindow");
  ccw.innerHTML += message + "<br/>";
};

var login = function() {
  var lun = document.getElementById("loginusername").value;
  var lpw = document.getElementById("loginpassword").value;
  send("a01;"+lun+";"+lpw);
};

var createAccount = function() {
  var cun = document.getElementById("createusername").value;
  var cpw = document.getElementById("createpassword").value;
  send("a00;"+cun+";"+cpw);
};

var sendChat = function() {
  var ccf = document.getElementById("chatField");
  send("c00;" + ccf.value);
  ccf.value = "";
};

var handlePacket = function(data) {
  var params = data.split(";");
  switch(params[0]) {
    case "a03" : { pageCreateError(params[1]); break; }
    case "a04" : { pageLogin(); break; }
    case "a05" : { pageLoginError(params[1]); break; }
    case "a06" : { pageCreateSuccess(params[1]); break; }
    case "c03" : { pageChat(); break; }
    case "c04" : { pageChatMessage(params[1],params[2]); break; }
    case "c05" : { pageInfoMessage(params[1]); break; }
    case "x00" : { error.showError("Connection Error",params[1]); break; }
    case "x01" : { error.showErrorException("Server Exception",params[1],params[2]); break; }
    default : { close(); pageConnect("##ERROR## Invalid data recieved from server."); break; }
  }
};

var send = function(data){
  webSocket.send(data);
};

var close = function(){
  webSocket.close();
};

/** Initial Connection **/
establish();