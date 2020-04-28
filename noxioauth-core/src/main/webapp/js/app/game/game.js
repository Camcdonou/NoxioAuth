"use strict";
/* global main */
/* global util */
/* global URL */

/* Define NoxioGame Class */
function NoxioGame(name, settings, map) {
  this.settings = settings;
  
  this.window = document.getElementById("canvas");
  this.container = document.getElementById("canvas-container");
  
  this.SERVER_TICK_RATE = 33;               // Number of milliseconds per server tick
  this.FDLC_TARGET = main.settings.game.lagComp; this.FDLC_MAX = main.settings.game.lagComp+2;  // FDLC range constants
  this.packetFDLC = [{data:""},{data:""}];  // ~~~MAGIC~~~
  this.deltaFDLC = util.time.now();
  
  this.frame = 0;
  this.delta = util.time.now();     // Time of last frame in milliseconds
  
  this.input = new Input(this);     // Mouse, keyboard, and controller handler
  this.asset = new Asset();         // Raw data for models, animations, textures, shaders, sounds, etc, etc, etc...
  this.display = new Display(this); // Game rendering and general WebGL stuff
  this.sound = new Sound(this);     // Game audio handler
  this.ui = new GameUI(this);       // Ingame UI
  
  this.announcer = new Announcer(this); // Says things, kind of like Bubsy
  
  this.objects = [];                // All active game objects
  this.effects = [];                // Active effects in the world space
  
  this.ready = false, this.serverReady = false;
  this.loadCache(map.cache);
  this.loadMap(map);
  
  /* Set camera to the default camera specatate spot */
  var cdef = this.map.getCameraDefault("camera");
  this.display.camera.setPos(util.vec2.toVec3(util.vec2.inverse(cdef), 0.0));
  this.display.camera.immediate();
  
  this.forceSpawn = false;
  this.respawnTimer = 0;
  
  this.gameOver = false;
  
  this.control = -1;                  // OID of object that the player controls. ( -1 is null )
  this.charSelect = "box";            // ID of character the player wants to play as.
  this.chatMsgOut = [];               // Chat messages to send to server on next doInput()
  this.touchMode = false;             // Flagged true if we are using touch screen based controls
  this.lastDir = {x: 0.0, y: 1.0};    // Last valid move direction sent to server
  
  this.thumb = {id: undefined, origin: undefined, offset: undefined}; // Touch control thumbstick values
  this.tchAction = [];                                                // Hacky fix for touch controls
  
  this.packHand = new PackHand(this);
  
  this.pingOut = false;
  this.pingLast = 0;
  this.pingFrame = 90;
  this.ping = 0;
  
  this.specPos = undefined; // Anchor point when moving spectator camera
  
  this.debug = {ss: 128, stime: [], ctime: [], dtime: [], frames: [], sAvg: 0, cAvg: 0, fAvg: 0}; /* SS is Sample Size: The number of frames to sample for data. */
  for(var i=0;i<this.debug.ss;i++) { this.debug.stime[i] = 0; this.debug.ctime[i] = 0; this.debug.dtime[i] = 0; this.debug.frames[i] = 0; }
  
  this.requestAnimFrameFunc = (function() {
    return window.requestAnimationFrame         || 
           window.webkitRequestAnimationFrame   ||
           window.mozRequestAnimationFrame      ||
           window.oRequestAnimationFrame        ||
           window.msRequestAnimationFrame       ||
           function(callback) { window.setTimeout(callback, 16); };
  })();
  
  this.cancelAnimFrameFunc = (function() {
    return window.cancelAnimationFrame                 ||
           window.webkitCancelRequestAnimationFrame    ||
           window.mozCancelRequestAnimationFrame       ||
           window.oCancelRequestAnimationFrame         ||
           window.msCancelRequestAnimationFrame        ||
           clearTimeout;
  })();
  
  this.nextFrame = this.requestAnimFrameFunc.call(window, function() { if(main.inGame()) { main.game.draw(); }}); // Javascript 🙄
};

// @FIXME: remove from production code, this is for building and debugging
NoxioGame.prototype.generateCache = function() { 
    var type = "TEXT";
    var filename = "generated-cache";
    var data = "";
    for(var i=0;i<this.display.models.length;i++) {
      data += this.display.models[i].name + ",";
    }
    data += ";";
    for(var i=0;i<this.display.materials.length;i++) {
      data += this.display.materials[i].name + ",";
    }
    data += ";";
    for(var i=0;i<this.sound.sounds.length;i++) {
      data += this.sound.sounds[i].path + ",";
    }
  
    var file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
};

/* Updates loading screen and flags the client as ready when everything is done downloading. */
NoxioGame.prototype.loading = function() {
  if(this.ready) { return; }
  var r = true;
  var loadScreen = "<div style='text-align: center; width: 100%; text-justify: distribute;'>";
  loadScreen += "<div class='load-head'>Loading...</div>";
  for(var i=0;i<this.display.textures.length;i++) {
    if(!this.display.textures[i].ready) { loadScreen += "<span class='unselectable load-item'>" + this.display.textures[i].path + "</span>"; r = false; }
    else { loadScreen += "<span class='load-item-inverse'>" + this.display.textures[i].path + "</span>"; }
  }
  for(var i=0;i<this.sound.sounds.length;i++) {
    if(!this.sound.sounds[i].ready()) { loadScreen += "<span class='unselectable load-item'>" + this.sound.sounds[i].path + "</span>"; r = false; }
    else { loadScreen += "<span class='unselectable load-item-inverse'>" + this.sound.sounds[i].path + "</span>"; }
  }
  loadScreen += "</div>";
  if(r) { this.loadDone(); }
  else { main.menu.game.loading(loadScreen); }
};

/* Called when all cached asset files are done loading. */
NoxioGame.prototype.loadDone = function() {
  main.menu.game.loading("<div class='unselectable load-head'>Awaiting server reponse...</div> <div style='width: 100%;'>");
  this.ready = true;
  main.net.game.send({type: "g07"});
  main.gauss.hide();
};

/* Starts loading all textures/sounds in the map file cache. */
NoxioGame.prototype.loadCache = function(cache) {
  var spl = cache.split(";");
  var mod = spl[0].split(",");
  for(var i=0;i<mod.length;i++) {
    this.display.getModel(mod[i]);
  }
  var mat = spl[1].split(",");
  for(var i=0;i<mat.length;i++) {
    this.display.getMaterial(mat[i]);
  }
  var snd = spl[2].split(",");
  for(var i=0;i<snd.length;i++) {
    this.sound.createSound(snd[i]);
  }
};

NoxioGame.prototype.loadMap = function(map) {
  this.map = new Map(this.display, map);
};

/* Returns false if the packet is not of a type that we know how to handle */
NoxioGame.prototype.handlePacket = function(packet) {
  /* Parse packet and apply */
  switch(packet.type) {
    /* Ingame Type Packets gxx */
    case "g10" : { this.updatePacket(packet); return true; }
    case "g21" : { this.recievePing(packet); return true; }
    /* Input Type Packets ixx */
    default : { return false; }
  }
};

/* Handles PacketG10, this packet updates the gamestate and is essentially a "frame". */
NoxioGame.prototype.updatePacket = function(packet) {
  this.packetFDLC.push(packet);
  while(this.packetFDLC.length > this.FDLC_MAX) {
    packet = this.packetFDLC.shift();
    this.doUpdate(packet);
  }
};

NoxioGame.prototype.doUpdate = function(packet) {
  /* Handle server gamestate packet */
  this.packHand.gameDataUpdate(packet);
  
  /* Update Camera */
  var obj = this.getObject(this.control);                                               // Get the object that the player controls
  if(obj) { this.display.camera.setPos({x: -obj.pos.x, y: -obj.pos.y, z: 0.0}); }       // Update camera to player's object position
  this.display.camera.update();                                                         // Update camera interpolation
  this.map.sky.step();                                                                  // Step skybox 1 frame
  
  /* Step world effects */
  for(var i=0;i<this.effects.length;i++) {
    if(this.effects[i].active()) { this.effects[i].step(); }
    else { this.effects.splice(i--, 1); }
  }
  
  /* Update announcer */
  this.announcer.step();
  
  /* Update timers */
  if(this.respawnTimer>0) { this.respawnTimer--; }
  
  this.frame++;
};

NoxioGame.prototype.doInput = function() {
  /* Process player input and send along to server */
  this.determineInput();
};

NoxioGame.prototype.update = function(tick) {
  this.lastDelta = util.time.now();           // Update last delta first to avoid small time offsets
  
  /* Send ping */
  if(this.pingFrame++ > 90) {
    this.sendPing();
    this.pingFrame = 0;
  }
    
  /* === DEBUG BLOCK START ==================== */  
  this.debug.stime.pop();
  this.debug.stime.unshift(tick);
  
  var sAvg = 0, dAvg = 0, cAvg = 0, fAvg = 0;
  for(var i=0;i<this.debug.ss;i++) {
    sAvg += this.debug.stime[i];
    cAvg += this.debug.ctime[i];
    dAvg += this.debug.dtime[i];
  }
  for(var i=0;i<this.debug.ss-1&&this.debug.frames[i+1]!==0;i++) {
    fAvg += this.debug.frames[i] - this.debug.frames[i+1];
  }
  this.debug.fAvg = (1000*(i/(this.debug.ss-1)))/(fAvg/(this.debug.ss-1));
  this.debug.sAvg = sAvg/this.debug.ss;
  this.debug.cAvg = cAvg/this.debug.ss;
  this.debug.dAvg = dAvg/this.debug.ss;
  /* === DEBUG BLOCK END ==================== */
  
  /* === DEBUG BLOCK START ==================== */  
  this.ui.debug.setText(
    "WHO[ " + main.net.user + "@" + main.net.game.state.info.name + "@" + main.net.game.info.name + " ]\n-\n" +
    "S[ " + (this.debug.sAvg).toFixed(2) + "ms ] C[ " + (this.debug.cAvg).toFixed(2) + "ms ] D[ " + (this.debug.dAvg).toFixed(2) + "ms ]\n" +
    "FRAME  [ " + this.frame + " ] DELTA [ " + this.delta + " ]\n" +
    "FPS[ " + (this.debug.fAvg).toFixed(2) + " ] PING[ " + this.ping + "ms ]\n-\n" +
    "ASSET[ " + this.display.models.length + "," + this.display.materials.length + "," + this.display.shaders.length + "," + this.display.textures.length +" ] FBO[ 5 ]\n" +
    "SHADOW [ " + this.display.fbo.shadow.fb.width + "," + this.display.fbo.shadow.fb.height + " ]\n" +
    "WORLD  [ " + this.display.fbo.world.fb.width + "," + this.display.fbo.world.fb.height + " ]\n" +
    "SKY    [ " + this.display.fbo.sky.fb.width + "," + this.display.fbo.sky.fb.height + " ]\n" +
    "UI     [ " + this.display.fbo.ui.fb.width + "," + this.display.fbo.ui.fb.height + " ]\n" +
    "BLOOM  [ " + this.display.fbo.bloom.fb.width + "," + this.display.fbo.bloom.fb.height + " ]\n"
  );
  /* === DEBUG BLOCK END ==================== */
};

/* Determine input mode and handle it. */
NoxioGame.prototype.determineInput = function() {
  if(!(this.ready && this.serverReady)) { return; }
  
  var imp = this.input.popInputs(); // Pops Impulse inputs for this frame
  
  if(imp.touch.length > 0) { this.touchMode = true; }
  else if(imp.keyboard.length > 0) { this.touchMode = false; }
  
  if(!this.touchMode) { this.doInputMouse(imp); }
  else { this.doInputTouch(imp); }
};

/* Process player input for mouse and keyboard and send them along to the server */
NoxioGame.prototype.doInputMouse = function(imp) {
  if(!(this.ready && this.serverReady)) { return; }
  
  var obj = this.getObject(this.control);
  
  /* Pass input to UI, if UI uses the input it will return true, in that case the input will not go through to the game */
  var pass = this.ui.step(
    false,
    imp,
    {
      mouse: this.input.mouse,
      keyboard: this.input.keyboard
    },
    util.vec2.make(this.display.window.width, this.display.window.height)
  );
  
  var inputs = [];
  
  /* Chat Messages */
  for(var i=0;i<this.chatMsgOut.length;i++) {
    inputs.push("08;"+this.chatMsgOut[i].replace(/[;,]/g,"_"));
  }
  this.chatMsgOut.splice(0, this.chatMsgOut.length);
  
  /* Global-Client Impulse Input */
  if(!this.inx27 && this.input.keyboard.keys[27]) { this.ui.menuKey(); } this.inx27 = this.input.keyboard.keys[27];    // Hardcoded Main Menu to ESC
  if(!this.inx145 && this.input.keyboard.keys[145]) { this.ui.hideKey(); } this.inx145 = this.input.keyboard.keys[145]; // Hardcoded Hide UI to ScrollLock
  
  if(!pass) {
    /* Client Impulse Input */
    this.display.camera.setZoom(this.input.mouse.spin*0.65);
    
    /* Client State Input */
    this.ui.flags.score = !!this.input.keyboard.keys[main.settings.control.scoreboard];                                          //~
    
    /* Control Check */
    if(obj) {
      var actions = [];
      
      /* Control State Input */
      var near = util.matrix.unprojection(this.window, this.display.camera, this.input.mouse.pos, 0.0);
      var far = util.matrix.unprojection(this.window, this.display.camera, this.input.mouse.pos, 1.0); /** @FIXME doing 2 unprojects is inefficent. Maybe calc camera center? **/
      var floorPlane = {a: {x: 0.0, y: 0.0, z: 0.0}, b: {x: 1.0, y: 0.0, z: 0.0}, c: {x: 0.0, y: 1.0, z: 0.0}, n: {x: 0.0, y: 0.0, z: 1.0}};
      var result = util.intersection.linePlane({a: near, b: far}, floorPlane);

      if(result) { // Missed the floor plane.
        var dir = util.vec2.subtract(result.intersection, obj.pos);
        var mag = util.vec2.magnitude(dir);
        var norm = util.vec2.normalize(dir);

        this.lastDir = norm;
        if(this.input.mouse.rmb) { inputs.push("04;"+norm.x+","+norm.y+";"+Math.min(Math.max(mag/1.75, 0.33), 1.0)); }
        else { inputs.push("01;"+norm.x+","+norm.y); }
      }
      else { inputs.push("01;"+this.lastDir.x+","+this.lastDir.y); }
      
      if(this.input.keyboard.keys[main.settings.control.jump]) { actions.push("jmp"); }
      if(this.input.keyboard.keys[main.settings.control.actionA]) { actions.push("atk"); }
      if(this.input.keyboard.keys[main.settings.control.actionB]) { actions.push("mov"); }
      if(this.input.keyboard.keys[main.settings.control.toss]) { actions.push("tos"); }
      if(this.input.keyboard.keys[main.settings.control.taunt]) { actions.push("tnt"); }
      
      if(actions.length>0) {
        var act = "05;";
        for(var i=0;i<actions.length;i++) {
          act += actions[i] + (i<actions.length-1?",":"");
        }
        inputs.push(act);
      }
      
      /* Rotate Camera */
      if(this.input.mouse.mmb) {
        var rot = util.vec3.make(this.input.mouse.mov.y*0.002, 0, -this.input.mouse.mov.x*0.003);
        this.display.camera.addRot(rot);
      }
    }
    else {
      /* Spectate State Input */
      if(this.input.mouse.rmb || this.forceSpawn) { this.forceSpawn = false; inputs.push("02;"+this.charSelect); }
      inputs.push("01;"+this.lastDir.x+","+this.lastDir.y);
      
      /* Move Camera */
      if(this.input.mouse.mmb) {
        if(!this.specPos) { this.specPos = this.input.mouse.pos; }
        else {
          var dir = util.vec2.subtract(this.specPos, this.input.mouse.pos);
          dir.y *= -1.;
          dir = util.vec2.rotate(dir, this.display.camera.rot.z);
          this.display.camera.addPos(util.vec3.make(dir.x*0.0005, dir.y*0.0005, 0.0));
        }
      }
      else { this.specPos = undefined; }
    }
  }
  else {
    /* Menu-Focus State Input */
    inputs.push("01;"+this.lastDir.x+","+this.lastDir.y);
  }
  
  /* Send Input */
  var inp = "";
  for(var i=0;i<inputs.length;i++) {
    inp += inputs[i] + (i<inputs.length-1?";":"");
  }
  main.net.game.send({type: "i00", data: inp});
};

/* Process player input for touch screen and send them along to the server */
NoxioGame.prototype.doInputTouch = function(imp) {
  if(!(this.ready && this.serverReady)) { return; }
  
  var obj = this.getObject(this.control);
  
  /* Make copy of touch positions for UI to use */
  var tchs = [];
  var thmb = undefined;
  for(var i=0;i<this.input.touch.pos.length;i++) {
    if(this.input.touch.pos[i].id === this.thumb.id) { thmb = this.input.touch.pos[i]; continue; }
    tchs.push(this.input.touch.pos[i]);
  }
  
  /* Pass input to UI, if UI uses the input it will return true, in that case the input will not go through to the game */  
  var pass = this.ui.step(
    true,
    imp,
    {
      mouse: this.input.mouse,
      keyboard: this.input.keyboard,
      touch: tchs
    },
    util.vec2.make(this.display.window.width, this.display.window.height)
  );
  
  var inputs = [];
  
  /* Chat Messages */
  // No chat on mobile.
  
  /* Global-Client Impulse Input */
  // Main Menu is a button in touch mode.
  
  if(!pass) {
    /* Client Impulse Input */
    // Camera control not supported on touch mode.
    
    /* Client State Input */
    // Shows when dead only on touch mode.
    
    /* Control Check */
    
    if(obj) {
      var actions = [];
      if(!thmb && this.thumb.id !== undefined) {
        this.thumb.id = undefined;
        this.thumb.origin = undefined;
        this.thumb.offset = undefined;
      }
      if(tchs.length > 0 && this.thumb.id === undefined) {
        this.thumb.id = tchs[0].id;
        this.thumb.origin = util.vec2.make(tchs[0].x, tchs[0].y);
        thmb = tchs[0];
      }
      
      /* Control State Input */
      if(thmb) {
        var offset = util.vec2.subtract(thmb, this.thumb.origin);
        var mag = util.vec2.magnitude(offset);
        var norm = util.vec2.rotate(util.vec2.multiply(util.vec2.normalize(offset), util.vec2.make(1., -1.)), this.display.camera.rot.z);
        var speed = mag/100;
        
        this.thumb.offset = offset;
        
        if(speed > 0.01) {
          inputs.push("04;"+norm.x+","+norm.y+";"+Math.min(Math.max(speed, 0.33), 1.0));
          this.lastDir = norm;
        }
        else {
          inputs.push("01;"+this.lastDir.x+","+this.lastDir.y);
        }
      }
      else {
        inputs.push("01;"+this.lastDir.x+","+this.lastDir.y);
      }

      for(var i=0;i<this.tchAction.length;i++) {
        actions.push(this.tchAction[i]);
      }
      this.tchAction = [];
      
      if(actions.length>0) {
        var act = "05;";
        for(var i=0;i<actions.length;i++) {
          act += actions[i] + (i<actions.length-1?",":"");
        }
        inputs.push(act);
      }
    }
    else {
      /* Spectate State Input */
      if(this.forceSpawn) { this.forceSpawn = false; inputs.push("02;"+this.charSelect); }
      inputs.push("01;"+this.lastDir.x+","+this.lastDir.y);
    }
  }
  else {
    /* Menu-Focus State Input */
    inputs.push("01;"+this.lastDir.x+","+this.lastDir.y);
  }
  
  /* Send Input */
  var inp = "";
  for(var i=0;i<inputs.length;i++) {
    inp += inputs[i] + (i<inputs.length-1?";":"");
  }
  main.net.game.send({type: "i00", data: inp});
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
      this.objects.splice(i, 1);
      return true;
    }
  }
  return false;
};

/* Places an effect in the world, this effect is updated and rendered until it no longer active. */
NoxioGame.prototype.putEffect = function(effect) {
  this.effects.push(effect);
};

/* When an object has a camera shake effect it calls this method. If the object is our current player we apply that camera shake to the camera. */
/* If the object is not our current player we ignore it. */
NoxioGame.prototype.putCameraShake = function(object, magnitude) {
  if(object === this.getObject(this.control)) { this.display.camera.lowFrequencyShake(magnitude); }
};

NoxioGame.prototype.draw = function() {
  var now = util.time.now();
  
  if((now - this.deltaFDLC) / this.SERVER_TICK_RATE > 0.75) {
    this.delta = now;
                  /* DEBUG CTIME START */
                  /* */ var start = util.time.now();
                  /* DEBUG CTIME END */
    /* Attempt to stay at the FDLC_TARGET but always use a frame if we have one no matter what. */
    var initial = true;
    while(this.packetFDLC.length > this.FDLC_TARGET || (initial && this.packetFDLC.length > 0)) {
        var packet = this.packetFDLC.shift();
        this.doUpdate(packet);
        initial = false;
    }
    this.queueInput = setTimeout(function() { if(main.inGame()) { main.game.doInput(); }}, 1);
                  /* DEBUG CTIME START */
                  /* */ this.debug.ctime.pop();
                  /* */ this.debug.ctime.unshift(util.time.now() - start);
                  /* DEBUG CTIME END */
    if(this.ready && this.serverReady) {  // Don't draw or play sound until game is fully loaded
                  /* DEBUG FPS START */
                  /* */ var start = util.time.now();
                  /* DEBUG FPS END */
      this.display.draw();                // Draw game
      this.sound.update();                // Update 3d audio center            
                  /* DEBUG FPS START */
                  /* */ var finish = util.time.now();
                  /* */ this.debug.frames.pop();
                  /* */ this.debug.dtime.pop();
                  /* */ this.debug.frames.unshift(finish);
                  /* */ this.debug.dtime.unshift(finish - start);
                  /* DEBUG FPS END */
    }
    if(!this.ready || !this.serverReady) {
      this.loading();                     // Update loading screen
    }
    this.deltaFDLC = util.time.now();
  }
  
  this.nextFrame = this.requestAnimFrameFunc.call(window, function() { if(main.inGame()) { main.game.draw(); }}); // Javascript 🙄
};

NoxioGame.prototype.sendPing = function() {
  var now = util.time.now();
  
  if(this.pingOut && this.pingLast - now < 999) { return; }
  else if(this.pingOut) { this.ping = 999; }
  
  main.net.game.send({type: "g21", delta: now});
  this.pingOut = now;
  this.pingOut = true;
};

NoxioGame.prototype.recievePing = function(packet) {
  var now = util.time.now();
  this.ping = now - packet.delta;
  this.pingOut = false;
};

/* Leave the game and return to lobby menu */
NoxioGame.prototype.leave = function() {
  main.net.game.state.leaveGame();
};

NoxioGame.prototype.destroy = function() {
  this.cancelAnimFrameFunc.call(window, this.nextFrame);
  clearTimeout(this.queueInput);
  this.input.destroy();
  this.asset.destroy();
  this.display.destroy();
  this.sound.destroy();
  this.ui.destroy();
};