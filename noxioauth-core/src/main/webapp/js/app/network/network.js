"use strict";
/* global main */
/* global AuthState */

/* Define Network Class */
function Network () {
  this.auth = new Auth();
  this.game = new Game();
  
  this.user = undefined;
  this.sid = undefined;    // Session ID
  this.type = undefined;   // The type of account, list of types in org.infpls.noxio.auth.module.auth.dao.user.User
  this.guest = undefined;  // Boolean flag for if the account is a guest or a normal account.
};

/* Opens connection to server */
Network.prototype.connect = function(user, pass) {
  if(this.loggedIn()) { main.close(); return; }
  if(this.auth.isConnected()) { this.auth.close(); }
  
  var that = this;
  var retry = 5; // Retry this many times before giving up
  var pak;
  if(!user) {
    this.auth.establish("guest");
    pak = {type: "s11"};
  }
  else {
    this.auth.establish("auth");
    pak = {type: "s10", user: user, hash: sha256("20"+pass+"xx")};
  }
  var waitForReady = function() { 
    setTimeout(function() {
      if(that.auth.state instanceof AuthState) {
        that.auth.send(pak);
        return;
      }
      if(--retry < 1) { main.close(); }
      else { waitForReady(); }
    }, 1000);
  };
  waitForReady();
};

/* Connects to specific game server */
Network.prototype.connectGame = function(address, port) {
  this.game.establish(address, port, false);
};

Network.prototype.connectGameAuto = function(servers) {
  main.menu.connect.show("Picking Server...", 0);
  var pingOut = Date.now();
  var results = [];
  
  var ajx = function(info, ind) {
    $.ajax({
      url: "http://" + info.domain + ":" + info.port + "/nxg/info",
      type: 'GET',
      timeout: 3000,
      success: function(data) { results[ind] = data; results[ind].domain = servers[ind].domain; results[ind].ping = Date.now() - pingOut; },
      error: function() { results[ind] = undefined; }
    });
  };
  
  for(var i=0;i<servers.length;i++) {
    ajx(servers[i], i);
  }
  
  setTimeout(function() {
    var best = undefined;
    for(var i=0;i<results.length;i++) {
      if(!results[i]) { continue; }
      if(!best) { best = results[i]; continue; }
      if(results[i].ping < best.ping || (best.users < 1 && results[i].users >= 1)) { best = results[i]; }
    }
    if(!best) { main.menu.online.show(); main.menu.warn.show("Failed to find quick match..."); return; }
    main.net.game.establish(best.domain, best.port, true);
  }, 10000);
};

/* Checks ping of each game server then connects to the best one and puts you into a match */

/* Leave the current noxiogame server and return to noxioauth online state */
Network.prototype.leaveServer = function() {
  if(this.game.isConnected() && this.auth.isConnected() && this.game.state.type() === "b" && this.auth.state.type() === "o") {
    this.game.safeClose();
    this.game = new Game();
    main.endGame();
    main.menu.online.show();
  }
  else {
    main.menu.error.showError("State Error", "Client attempted to leave game server but the state was invalid!");
    main.close();
  }
};

Network.prototype.loggedIn = function() {
  return this.user;
};

Network.prototype.close = function() {
  this.auth.close();
  this.game.close();
};