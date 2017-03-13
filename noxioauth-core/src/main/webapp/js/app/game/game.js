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
  this.sound = new Sound(this);     // Game audio handler
  this.ui = new GameUI(this);       // Ingame UI
  
  this.loadMap(map);
  
  this.gameOver = false;
  
  this.debug = {ss: 128, stime: [], ctime: [], ping: [], frames: [], sAvg: 0, cAvg: 0, pAvg: 0, fAvg: 0}; /* SS is Sample Size: The number of frames to sample for data. */
  for(var i=0;i<this.debug.ss;i++) { this.debug.stime[i] = 0; this.debug.ctime[i] = 0; this.debug.ping[i] = 0; this.debug.frames[i] = 0; }
  
  this.control = -1;
  this.objects = [];
  
  this.packHand = new PackHand(this);
  
  this.requestAnimFrameFunc = (function() {
    return window.requestAnimationFrame || 
           window.webkitRequestAnimationFrame ||
           window.mozRequestAnimationFrame ||
           window.oRequestAnimationFrame ||
           window.msRequestAnimationFrame ||
           function(callback) { window.setTimeout(callback, 33); }; /* @FIXME warn for this? */
  })();
  
  this.cancelAnimFrameFunc = (function() {
    return window.cancelAnimationFrame          ||
           window.webkitCancelRequestAnimationFrame    ||
           window.mozCancelRequestAnimationFrame       ||
           window.oCancelRequestAnimationFrame     ||
           window.msCancelRequestAnimationFrame        ||
           clearTimeout;
  })();
  
  this.nextFrame = this.requestAnimFrameFunc.call(window, function() { if(main.inGame()) { main.game.draw(); }}); // Javascript 🙄
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

NoxioGame.prototype.inputStep = function() { /* @FIXME step should do some of the stuff this does, its just that step is overrun with debug shit. Cleanup. */
  var cursor = this.input.getMouseActual(); /* mousActual deprecated? @FIXME */
  var obj = this.getObject(this.control);
  var inputs = this.input.keyboard.popInputs();
  var mouse = this.input.mouse.popMovement();
  
  /* Camera position */
  if(obj) { this.display.camera.setPos({x: -obj.pos.x, y: -obj.pos.y, z: 0.0}); }
  
  /* Send current user input to server */
  if(this.ui.menuOpen()) { main.net.game.send({type: "i01"}); return; } // Menu is open so send mouse neutral and return
  
  /* Apply popped inputs */
  this.display.camera.setZoom(mouse.s);
  
  for(var i=0;i<inputs.length;i++) {
    switch(inputs[i]) {
      case 32 : { main.net.game.send({type: "i02"}); break; } //Space
      case 37 : { this.display.camera.addRot({x: 0.0, y: 0.0, z: 0.1}); break; } //Left /* Debug camera controls @FIXME */
      case 39 : { this.display.camera.addRot({x: 0.0, y: 0.0, z: -0.1}); break; } //Right
      case 38 : { this.display.camera.addRot({x: 0.1, y: 0.0, z: 0.0}); break; } //Up
      case 40 : { this.display.camera.addRot({x: -0.1, y: 0.0, z: 0.0}); break; } //Dowhn
      case 70 : { if(obj) { obj.debugEffect.trigger({x: obj.pos.x, y: obj.pos.y, z: 0.0}, util.vec3.create()); break; } break; } // F /* @FIXME DEBUG */
      case 82 : { this.sound.getSound("audio/prank/ata.wav").play(); break; } // R /* @FIXME DEBUG */
      case 84 : { this.sound.getSound("audio/prank/ha.wav").play(); break; } // T /* @FIXME DEBUG */
      case 89 : { this.sound.getSound("audio/prank/toriya.wav").play(); break; } // Y /* @FIXME DEBUG */
      default : { break; }
    }
  }
  
  if(this.input.mouse.rmb && obj !== undefined) {
    var near = util.matrix.unprojection(this.window, this.display.camera, this.input.mouse.pos, 0.0);
    var far = util.matrix.unprojection(this.window, this.display.camera, this.input.mouse.pos, 1.0); /* @FIXME doing 2 unprojects is inefficent. Maybe calc camera center? */
    var floorPlane = {a: {x: 0.0, y: 0.0, z: 0.0}, b: {x: 1.0, y: 0.0, z: 0.0}, c: {x: 0.0, y: 1.0, z: 0.0}, n: {x: 0.0, y: 0.0, z: 1.0}};
    var result = util.intersection.linePlane({a: near, b: far}, floorPlane);
    
    if(!result) { main.net.game.send({type: "i01"}); return; } // Missed the floor plane.
   
    var dir = util.vec2.subtract(result.intersection, obj.pos);
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
  
  /* Send input data */
  this.inputStep();
  
  /* DEBUG INFORMATION */  
  for(var i=this.debug.ss;i>0;i--) {
    this.debug.ctime[i] = this.debug.ctime[i-1];
  }
  this.debug.ctime[0] = new Date().getTime() - now;
  
  this.ui.getElement("debug").debug([
    "STIME " + (this.debug.sAvg).toFixed(2) + " | CTIME " + (this.debug.cAvg).toFixed(2),
    "FPS " + (this.debug.fAvg).toFixed(2) + " | PING " + (this.debug.pAvg).toFixed(2),
    "ASSET[" + this.display.models.length + "," + this.display.materials.length + "," + this.display.shaders.length + "," + this.display.textures.length +"] FBO[3]",
    "SHADOW [" + this.display.fbo.shadow.fb.width + "," + this.display.fbo.shadow.fb.height + "]",
    "WORLD  [" + this.display.fbo.world.fb.width + "," + this.display.fbo.world.fb.height + "]",
    "UI     [" + this.display.fbo.ui.fb.width + "," + this.display.fbo.ui.fb.height + "]"
  ]);
};

NoxioGame.prototype.draw = function() {
    /* DEBUG FPS STUFF @FIXME */
    /* @FIXME Something seems a little off with the FPS counter. Seems like it's taking to small a sample of the avalible times... Most notable when tabbing out */
    var now = new Date().getTime();
    var fAvg = 0;
    for(var i=0;i<this.debug.ss-1&&this.debug.frames[i+1]!==0;i++) {
      fAvg += this.debug.frames[i] - this.debug.frames[i+1];
    }
    this.debug.fAvg = (1000*(i/(this.debug.ss-1)))/(fAvg/(this.debug.ss-1));
    
    /* Draw */
    this.display.draw();
    
    /* DEBUG FPS STUFF @FIXME */
    for(var i=this.debug.ss;i>0;i--) {
      this.debug.ctime[i] = this.debug.ctime[i-1];
      this.debug.frames[i] = this.debug.frames[i-1];
    }
    this.debug.frames[0] = new Date().getTime();
    this.debug.ctime[0] = new Date().getTime() - now;
    
  this.nextFrame = this.requestAnimFrameFunc.call(window, function() { if(main.inGame()) { main.game.draw(); }}); // Javascript 🙄
};

/* Leave the game and return to lobby menu */
NoxioGame.prototype.leave = function() {
  main.net.game.state.leaveGame();
};

NoxioGame.prototype.destroy = function() {
  this.cancelAnimFrameFunc.call(window, this.nextFrame);
  this.input.destroy();
  this.asset.destroy();
  this.display.destroy();
  this.sound.destroy();
  this.ui.destroy();
};