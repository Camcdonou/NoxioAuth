"use strict";
/* global main */

/*  At some point this class will need to manage any interaction betweens
    between the game server and the auth server.
    @FIXME
 */

/* Define Network Class */
function Network () {
  this.auth = new Auth();
  
  this.user = "Not Logged In";
  this.sid = undefined;
};

Network.prototype.close = function() {
  this.auth.close();
};