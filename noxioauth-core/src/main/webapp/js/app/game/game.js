"use strict";
/* global main */
/* global util */

/* Define NoxioGame Class */
function NoxioGame(name, description, gametype, maxPlayers, map) {  
  this.info = {
    name: name,
    description: description,
    gametype: gametype,
    maxPlayers: maxPlayers
  };
  
  this.window = document.getElementById("canvas");
  this.container = document.getElementById("canvas-container");
  
  this.input = new Input(this);     // Mouse, keyboard, and controller handler
  this.asset = new Asset();         // Raw data for models, animations, textures, shaders, sounds, etc, etc, etc...
  this.display = new Display(this); // Game rendering and general WebGL stuff
  this.ui = new GameUI(this);       // Ingame UI
  
  this.loadMap(map);
  
  this.gameOver = false;
  
  this.debug = {ss: 128, stime: [], ctime: [], ping: [], frames: [], sAvg: 0, cAvg: 0, pAvg: 0, fAvg: 0}; /* SS is Sample Size: The number of frames to sample for data. */
  for(var i=0;i<this.debug.ss;i++) { this.debug.stime[i] = 0; this.debug.ctime[i] = 0; this.debug.ping[i] = 0; this.debug.frames[i] = 0; }
  
  this.control = -1;
  this.objects = [];
  
  this.packHand = new PackHand(this);
};

NoxioGame.prototype.loadMap = function(map) {
  this.map = new Map(this.display, map);
};

/* Returns false if failed handled packet */
NoxioGame.prototype.update = function(packet) {
  /* Parse packet and apply */
  switch(packet.type) {
    /* Ingame Type Packets gxx */
    case "g10" : { this.packHand.gameDataUpdate(packet); return true; }
    case "g15" : { this.packHand.message(packet); return true; }
    case "g16" : { this.packHand.gameOver(packet); return true; }
    case "g18" : { this.packHand.gameRules(packet); return true; }
    /* Input Type Packets ixx */
    case "i03" : { this.packHand.playerControl(packet); return true; }
    /* Game Step End g05 */
    case "g05" : { this.step(packet); return true; } 
    default : { return false; }
  }
};


/* Gets an object by it's OID */
NoxioGame.prototype.getObject = function(oid) {
  for(var i=0;i<this.objects.length;i++) {
    if(this.objects[i].oid === oid) {
      return this.objects[i];
    }
  }
  return undefined;
};

/* Deletes an object by it's OID. Returns true if success. False if object is not found. */
NoxioGame.prototype.deleteObject = function(oid) {
  for(var i=0;i<this.objects.length;i++) {
    if(this.objects[i].oid === oid) {
      this.objects.splice(i, 1);
      return true;
    }
  }
  return false;
};

/* Input overhaul? @FIXME maybe handle inputs in real time but if they are not client inputs then queue them? */
NoxioGame.prototype.handleInput = function(key) {
  this.ui.handleInput(key);
};

NoxioGame.prototype.handleClick = function(button, mouse) {
  this.ui.handleClick(button, mouse, {x: this.window.width, y: this.window.height});
};

NoxioGame.prototype.inputStep = function() {
  var cursor = this.input.getMouseActual();
  var obj = this.getObject(this.control);
  
  /* Send current user input to server */
  if(this.ui.menuOpen()) { main.net.game.send({type: "i01"}); return; } // Menu is open so send mouse neutral and return
  
  var inputs = this.input.keyboard.popInputs();
  for(var i=0;i<inputs.length;i++) {
    switch(inputs[i]) {
      case 32 : { main.net.game.send({type: "i02"}); break; } //Space
      default : { break; }
    }
  }
  
  if(this.input.mouse.rmb && obj !== undefined) {
    var coords = this.display.unproject(cursor);
    var dir = util.vec2.subtract(coords, obj.pos);
    var mag = util.vec2.magnitude(dir);
    var norm = util.vec2.normalize(dir);
    if(mag >= 1.5) { main.net.game.send({type: "i05", pos: norm}); } /* @FIXME Change to single packet with true/false */
    else { main.net.game.send({type: "i04", pos: norm}); }
  }
  else {
    main.net.game.send({type: "i01"});
  }
};

NoxioGame.prototype.step = function(packet) {
  /* DEBUG INFORMATION */
  var now = new Date().getTime();
  var ping = (now - packet.sent) < 0 ? 0 : (now - packet.sent);
  
  for(var i=this.debug.ss;i>0;i--) {
    this.debug.ping[i] = this.debug.ping[i-1];
    this.debug.stime[i] = this.debug.stime[i-1];
  }
  this.debug.ping[0] = ping;
  this.debug.stime[0] = packet.tick;
  
  var sAvg = 0, cAvg = 0, pAvg = 0;
  for(var i=0;i<this.debug.ss;i++) {
    sAvg += this.debug.stime[i];
    cAvg += this.debug.ctime[i];
    pAvg += this.debug.ping[i];
  }
  this.debug.sAvg = sAvg/this.debug.ss;
  this.debug.cAvg = cAvg/this.debug.ss;
  this.debug.pAvg = pAvg/this.debug.ss;
  
  /* Draw game and send input data */
  var tmp = this;
  if(this.debug.ctime[0] < 10) { setTimeout( function() { tmp.draw(); }, 15); }
  this.draw();
  this.inputStep();
  
  /* DEBUG INFORMATION */  
  for(var i=this.debug.ss;i>0;i--) {
    this.debug.ctime[i] = this.debug.ctime[i-1];
  }
  this.debug.ctime[0] = new Date().getTime() - now;
  
  this.ui.getElement("debug").debug([
    "STIME " + (this.debug.sAvg).toFixed(2) + " | CTIME " + (this.debug.cAvg).toFixed(2),
    "FPS " + (this.debug.fAvg).toFixed(2) + " | PING " + (this.debug.pAvg).toFixed(2)
  ]);
};

NoxioGame.prototype.draw = function() {
    /* DEBUG FPS STUFF @FIXME */
    var now = new Date().getTime();
    var fAvg = 0;
    for(var i=0;i<this.debug.ss-1&&this.debug.frames[i+1]!==0;i++) {
      fAvg += this.debug.frames[i] - this.debug.frames[i+1];
    }
    this.debug.fAvg = (1000*(i/(this.debug.ss-1)))/(fAvg/(this.debug.ss-1));

    /* Move camera to player */
    var obj = this.getObject(this.control);
    if(obj !== undefined) { this.display.camera.pos.x = -obj.pos.x; this.display.camera.pos.y = -obj.pos.y; }
    
    /* Draw */
    this.display.draw();
    
    /* DEBUG FPS STUFF @FIXME */
    for(var i=this.debug.ss;i>0;i--) {
      this.debug.ctime[i] = this.debug.ctime[i-1];
      this.debug.frames[i] = this.debug.frames[i-1];
    }
    this.debug.frames[0] = new Date().getTime();
    this.debug.ctime[0] = new Date().getTime() - now;
};

/* Leave the game and return to lobby menu */
NoxioGame.prototype.leave = function() {
  main.net.game.state.leaveGame();
};

NoxioGame.prototype.destroy = function() {
  this.input.destroy();
  this.display.destroy();
  this.asset.destroy();
};