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
  
  this.SERVER_TICK_RATE = 33;       // Number of milliseconds per server tick
  this.delta = util.time.now();     // Number of milliseconds since last server update() or step()
  this.packetFDLC = [{data:""},{data:""}];             // ~~~MAGIC~~~
  
  this.input = new Input(this);     // Mouse, keyboard, and controller handler
  this.asset = new Asset();         // Raw data for models, animations, textures, shaders, sounds, etc, etc, etc...
  this.display = new Display(this); // Game rendering and general WebGL stuff
  this.sound = new Sound(this);     // Game audio handler
  this.ui = new GameUI(this);       // Ingame UI
  
  this.loadMap(map);
  
  this.respawnTimer = 0;
  
  this.gameOver = false;
  
  this.debug = {ss: 128, stime: [], ctime: [], dtime: [], ping: [], frames: [], sAvg: 0, cAvg: 0, pAvg: 0, fAvg: 0}; /* SS is Sample Size: The number of frames to sample for data. */
  for(var i=0;i<this.debug.ss;i++) { this.debug.stime[i] = 0; this.debug.ctime[i] = 0; this.debug.dtime[i] = 0; this.debug.ping[i] = 0; this.debug.frames[i] = 0; }
  
  this.objects = [];                  // All active game objects
  this.effects = [];                  // Active effects in the world space
  
  this.control = -1;                  // OID of object that the player controls. ( -1 is null )
  this.lastMouse = {x: 0.0, y: 1.0};  // Last valid mouse direction sent to server
  
  this.packHand = new PackHand(this);
  
  this.requestAnimFrameFunc = (function() {
    return window.requestAnimationFrame || 
           window.webkitRequestAnimationFrame ||
           window.mozRequestAnimationFrame ||
           window.oRequestAnimationFrame ||
           window.msRequestAnimationFrame ||
           function(callback) { window.setTimeout(callback, 16); }; /* @FIXME warn for this? */
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
NoxioGame.prototype.handlePacket = function(packet) {
  /* Parse packet and apply */
  switch(packet.type) {
    /* Ingame Type Packets gxx */
    case "g10" : { this.packetFDLC.push(packet); return true; }
    /* Input Type Packets ixx */
    default : { return false; }
  }
};

NoxioGame.prototype.doUpdate = function(packet) {  
  this.packHand.gameDataUpdate(packet);
  
  /* Update Camera */
  var obj = this.getObject(this.control);                                               // Get the object that the player controls
  if(obj) { this.display.camera.setPos({x: -obj.pos.x, y: -obj.pos.y, z: 0.0}); }       // Update camera to player's object position
  this.display.camera.update();                                                         // Update camera interpolation
  
  /* Step world effects */
  for(var i=0;i<this.effects.length;i++) {
    if(this.effects[i].effect.active()) { this.effects[i].effect.step(util.vec2.toVec3(this.effects[i].pos, 0.0), {x: 0.0, y: 0.0, z: 0.0}); }
    else { this.effects.splice(i--, 1); }
  }
  
  /* Update timers */
  if(this.respawnTimer>0) { this.respawnTimer--; }
  
  /* Send player input to server */
  this.sendInput();
  
  /* Update UI State */
  var obj = this.getObject(this.control);
  var respawnUI = this.ui.getElement("respawn"); 
  var meterUI = this.ui.getElement("meter");
  var nameUI = this.ui.getElement("name"); nameUI.show(); // Currently always shows!
  var objectiveUI = this.ui.getElement("objective"); objectiveUI.show(); // Currently always shows!
  if(!obj && !this.gameOver) { respawnUI.show(); meterUI.hide(); }
  else if(!this.gameOver) {
    respawnUI.hide();
    if(obj.getType() === "obj.player") {
      var blipScalar = 1.0-Math.max(Math.min(obj.blipCooldown/obj.BLIP_COOLDOWN_MAX, 1.0), 0.0);
      var dashScalar = 1.0-Math.max(Math.min(obj.dashCooldown/obj.DASH_COOLDOWN_MAX, 1.0), 0.0);
      meterUI.meters(blipScalar, dashScalar, 0.0);
      meterUI.show();
    }
  }
  else {
    var endUI = this.ui.getElement("end");
    respawnUI.hide();
    meterUI.hide();
    endUI.show();
  }
};

NoxioGame.prototype.update = function(tick) {
  this.lastDelta = util.time.now();           // Update last delta first to avoid small time offsets
  
  /* === DEBUG BLOCK START ==================== */
  var now = util.time.now();
  var ping = 1337;
  
  this.debug.ping.pop();
  this.debug.stime.pop();
  this.debug.ping.unshift(ping);
  this.debug.stime.unshift(tick);
  
  var sAvg = 0, dAvg = 0, cAvg = 0, pAvg = 0, fAvg = 0;
  for(var i=0;i<this.debug.ss;i++) {
    sAvg += this.debug.stime[i];
    cAvg += this.debug.ctime[i];
    dAvg += this.debug.dtime[i];
    pAvg += this.debug.ping[i];
  }
  for(var i=0;i<this.debug.ss-1&&this.debug.frames[i+1]!==0;i++) {
    fAvg += this.debug.frames[i] - this.debug.frames[i+1];
  }
  this.debug.fAvg = (1000*(i/(this.debug.ss-1)))/(fAvg/(this.debug.ss-1));
  this.debug.sAvg = sAvg/this.debug.ss;
  this.debug.cAvg = cAvg/this.debug.ss;
  this.debug.dAvg = dAvg/this.debug.ss;
  this.debug.pAvg = pAvg/this.debug.ss;
  /* === DEBUG BLOCK END ==================== */
  
  /* === DEBUG BLOCK START ==================== */
  this.debug.ctime.pop();
  this.debug.ctime.unshift(util.time.now() - now);
  
  this.ui.getElement("debug").debug([
    "S[" + (this.debug.sAvg).toFixed(2) + "ms] C[" + (this.debug.cAvg).toFixed(2) + "ms] D[" + (this.debug.dAvg).toFixed(2) + "ms]",
    "FPS[" + (this.debug.fAvg).toFixed(2) + "] MEME[" + (this.debug.pAvg).toFixed(2) + "ms]",
    "ASSET[" + this.display.models.length + "," + this.display.materials.length + "," + this.display.shaders.length + "," + this.display.textures.length +"] FBO[3]",
    "SHADOW [" + this.display.fbo.shadow.fb.width + "," + this.display.fbo.shadow.fb.height + "]",
    "WORLD  [" + this.display.fbo.world.fb.width + "," + this.display.fbo.world.fb.height + "]",
    "UI     [" + this.display.fbo.ui.fb.width + "," + this.display.fbo.ui.fb.height + "]"
  ]);
  /* === DEBUG BLOCK END ==================== */
};

NoxioGame.prototype.sendInput = function() { /* @FIXME step should do some of the stuff this does, its just that step is overrun with debug shit. Cleanup. */
  var cursor = this.input.getMouseActual(); /* mousActual deprecated? @FIXME */
  var obj = this.getObject(this.control);
  var inputs = this.input.keyboard.popInputs();
  var mouse = this.input.mouse.popMovement();
  
  /* Send current user input to server */
  if(this.ui.menuOpen()) { main.net.game.send({type: "i00", data: "01;"+this.lastMouse.x+","+this.lastMouse.y}); return; } // Menu is open so send mouse neutral and return
  
  /* Apply popped inputs */
  this.display.camera.setZoom(mouse.s);
  
  /* Apply state inputs */    // @FIXME this is all messy and debug...
  var inputs = [];
  var actions = [];
  if(this.input.keyboard.keys[37]) { this.display.camera.addRot({x: 0.0, y: 0.0, z: 0.01}); } //Left /* Debug camera controls @FIXME */
  if(this.input.keyboard.keys[39]) { this.display.camera.addRot({x: 0.0, y: 0.0, z: -0.01}); } //Right
  if(this.input.keyboard.keys[38]) { this.display.camera.addRot({x: 0.01, y: 0.0, z: 0.0}); } //Up
  if(this.input.keyboard.keys[40]) { this.display.camera.addRot({x: -0.01, y: 0.0, z: 0.0}); } //Down
  if(this.input.keyboard.keys[32]) { actions.push("jump"); }
  if(this.input.keyboard.keys[70]) { actions.push("blip"); }
  if(this.input.keyboard.keys[16]) { actions.push("dash"); }
  if(this.input.keyboard.keys[84]) { actions.push("taunt"); }
  //if(this.input.keyboard.keys[66]) { if(obj) { obj.bloodEffect.trigger(util.vec2.toVec3(obj.pos, obj.height), {x: 0, y: 0, z: 1}); } } // B
  if(this.input.keyboard.keys[192] || !obj) { this.ui.getElement("score").show(); } else { this.ui.getElement("score").hide(); } // ~
  
  if(obj) {
    var near = util.matrix.unprojection(this.window, this.display.camera, this.input.mouse.pos, 0.0);
    var far = util.matrix.unprojection(this.window, this.display.camera, this.input.mouse.pos, 1.0); /* @FIXME doing 2 unprojects is inefficent. Maybe calc camera center? */
    var floorPlane = {a: {x: 0.0, y: 0.0, z: 0.0}, b: {x: 1.0, y: 0.0, z: 0.0}, c: {x: 0.0, y: 1.0, z: 0.0}, n: {x: 0.0, y: 0.0, z: 1.0}};
    var result = util.intersection.linePlane({a: near, b: far}, floorPlane);
    
    if(result) { // Missed the floor plane.
      var dir = util.vec2.subtract(result.intersection, obj.pos);
      var mag = util.vec2.magnitude(dir);
      var norm = util.vec2.normalize(dir);

      this.lastMouse = norm;
      if(this.input.mouse.rmb) { inputs.push("04;"+norm.x+","+norm.y+";"+Math.min(Math.max(mag/1.75, 0.33), 1.0)); }
      else { inputs.push("01;"+norm.x+","+norm.y); }
    }
    else { inputs.push("01;"+this.lastMouse.x+","+this.lastMouse.y); }
    
    if(actions.length>0) {
      var act = "05;";
      for(var i=0;i<actions.length;i++) {
        act += actions[i] + (i<actions.length-1?",":"");
      }
      inputs.push(act);
    }
    
    var inp = "";
    for(var i=0;i<inputs.length;i++) {
      inp += inputs[i] + (i<inputs.length-1?";":"");
    }
    main.net.game.send({type: "i00", data: inp});
  }
  else {
    if(this.input.mouse.lmb) { inputs.push("02"); }
    inputs.push("01;"+this.lastMouse.x+","+this.lastMouse.y);
    
    var inp = "";
    for(var i=0;i<inputs.length;i++) {
      inp += inputs[i] + (i<inputs.length-1?";":"");
    }
    main.net.game.send({type: "i00", data: inp});
  }
};

/* Input overhaul? @FIXME maybe handle inputs in real time but if they are not client inputs then queue them? */
NoxioGame.prototype.handleInput = function(key) {
  this.ui.handleInput(key);
};

NoxioGame.prototype.handleClick = function(button, mouse) {
  this.ui.handleClick(button, mouse, {x: this.window.width, y: this.window.height});
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
      this.objects[i].destroy();
      for(var j=0;j<this.objects[i].effects.length;j++) {
        if(this.objects[i].effects[j].active()) { this.effects.push({pos: this.objects[i].pos, effect: this.objects[i].effects[j]}); }
      }
      this.objects.splice(i, 1);
      return true;
    }
  }
  return false;
};

var FDLC_TARGET = 1;
NoxioGame.prototype.draw = function() {
  /* @FIXME Something seems a little off with the FPS counter. Seems like it's taking too small a sample of the avalible times... Most notable when tabbing out */
  var start = util.time.now();
  var now = start;
  
  if(this.delta + this.SERVER_TICK_RATE <= now) {
    this.delta = now;
    var packet;
    if(this.packetFDLC.length === FDLC_TARGET) { console.log("NAILED frame: " + this.delta); }
    else if(this.packetFDLC.length < FDLC_TARGET) { console.log("MISSED frame: " + this.delta); }
    else {
      if(this.packetFDLC.length > FDLC_TARGET+2) { console.log("BEHIND by ["+this.packetFDLC.length+"]: " + this.delta); }
      while(this.packetFDLC.length > FDLC_TARGET) {
        packet = this.packetFDLC.shift();
        this.doUpdate(packet);
        this.sound.update();                                                                  // Update 3d audio center
        this.display.draw();                                                                  // Draw game
      }
    }
  }

  /* DEBUG FPS STUFF */
  var finish = util.time.now();
  this.debug.frames.pop();
  this.debug.dtime.pop();
  this.debug.frames.unshift(finish);
  this.debug.dtime.unshift(finish - start);
  
    
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