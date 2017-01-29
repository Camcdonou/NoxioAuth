"use strict";
/* global main */

/* Define NoxioGame Class */
function NoxioGame() {
  this.window = document.getElementById("canvas");
  this.container = document.getElementById("canvas-container");
  
  this.input = new Input(this.window);
  
  this.scores = [];
  
  this.debug = {ss: 128, stime: [], ctime: [], ping: [], frames: [], sAvg: 0, cAvg: 0, pAvg: 0, fAvg: 0}; /* SS is Sample Size: The number of frames to sample for data. */
  for(var i=0;i<this.debug.ss;i++) { this.debug.stime[i] = 0; this.debug.ctime[i] = 0; this.debug.ping[i] = 0; this.debug.frames[i] = 0; }
  
  this.control = -1;
  this.objects = [];
  
  this.packHand.game = this;
};

/* Returns false if failed handled packet */
NoxioGame.prototype.update = function(packet) {
  /* Parse packet and apply */
  switch(packet.type) {
    /* Ingame Type Packets gxx */
    case "g10" : { this.packHand.createObject(packet); return true; }
    case "g11" : { this.packHand.deleteObject(packet); return true; }
    case "g12" : { this.packHand.updateObjectPosVel(packet); return true; }
    case "g13" : { this.packHand.shineAbility(packet); return true; }
    case "g14" : { this.packHand.scoreUpdate(packet); return true; }
    /* Input Type Packets ixx */
    case "i03" : { this.packHand.playerControl(packet); return true; }
    /* Game Step End g05 */
    case "g05" : { this.step(packet); return true; } 
    default : { return false; }
  }
};

/* NoxioGame Packet Handler Functions */
NoxioGame.prototype.packHand = {};

/* PacketG10 */
NoxioGame.prototype.packHand.createObject = function(packet) {
  var obj = this.game.getObject(packet.oid);
  if(obj !== undefined) { return; } /* @FIXME error report, this object already exists for some reason... */ 
  switch(packet.otype) {
    case "obj" : { break; } //NO. BAD DOG. I SAID NO.
    case "obj.player" : { this.game.objects.push(new PlayerObject(packet.oid, packet.pos, packet.vel)); break; }
    case "obj.bullet" : { this.game.objects.push(new BulletObject(packet.oid, packet.pos, packet.vel)); break; }
    default : { /* @FIXME ERRORRRRRRRR */ break; }
  }
};

/* PacketG11 */
NoxioGame.prototype.packHand.deleteObject = function(packet) {
  if(!this.game.deleteObject(packet.oid)) { /* @FIXME log this error cuz its bad if this happens */ }
};

/* PacketG12 */
NoxioGame.prototype.packHand.updateObjectPosVel = function(packet) {
  var obj = this.game.getObject(packet.oid);
  if(obj !== undefined) {
    obj.setPos(packet.pos);
    obj.setVel(packet.vel);
  }
};

/* PacketG13 */
NoxioGame.prototype.packHand.shineAbility = function(packet) {
  var obj = this.game.getObject(packet.oid);
  if(obj !== undefined) {
    obj.shineCooldown = 5;
  }
};

/* PacketG14 */
NoxioGame.prototype.packHand.scoreUpdate = function(packet) {
  for(var i=0;i<this.game.scores.length;i++) {
    if(this.game.scores[i].user === packet.score.user) {
      this.game.scores[i] = packet.score;
      return;
    }
  }
  this.game.scores.push(packet.score);
};

/* PacketI00 */
NoxioGame.prototype.packHand.playerControl = function(packet) {
  this.game.control = packet.oid;
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

NoxioGame.prototype.sendInput = function() {
  var cursor = this.input.getMouseActual();
  var obj = this.getObject(this.control);
  
  /* Send current user input to server */
  var inputs = this.input.keyboard.popInputs();
  for(var i=0;i<inputs.length;i++) {
    switch(inputs[i]) {
      case 32 : { main.net.game.send({type: "i02"}); break; } //Space
      default : { break; }
    }
  }
       if(this.input.keyboard.keys[81]) { main.net.game.send({type: "i10", action: "q", pos: cursor}); } //Q
  else if(this.input.keyboard.keys[87]) { main.net.game.send({type: "i10", action: "w", pos: cursor}); } //W
  else if(this.input.keyboard.keys[69]) { main.net.game.send({type: "i10", action: "e", pos: cursor}); } //E
  else if(this.input.keyboard.keys[82]) { main.net.game.send({type: "i10", action: "r", pos: cursor}); } //R
  
  if(this.input.mouse.lmb && obj !== undefined) {
    main.net.game.send({type: "i00", pos: cursor});
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
  
  var sAvg = 0, cAvg = 0, pAvg = 0, fAvg = 0;
  for(var i=0;i<this.debug.ss;i++) {
    sAvg += this.debug.stime[i];
    cAvg += this.debug.ctime[i];
    pAvg += this.debug.ping[i];
  }
  for(var i=0;i<this.debug.ss-1&&this.debug.frames[i+1]!==0;i++) {
    fAvg += this.debug.frames[i] - this.debug.frames[i+1];
  }
  this.debug.sAvg = sAvg/this.debug.ss;
  this.debug.cAvg = cAvg/this.debug.ss;
  this.debug.pAvg = pAvg/this.debug.ss;
  this.debug.fAvg = (1000*(i/(this.debug.ss-1)))/(fAvg/(this.debug.ss-1));
  
  /* Draw game and send input data */
  this.draw();
  this.sendInput();
  
  /* DEBUG INFORMATION */  
  for(var i=this.debug.ss;i>0;i--) {
    this.debug.ctime[i] = this.debug.ctime[i-1];
    this.debug.frames[i] = this.debug.frames[i-1];
  }
  this.debug.frames[0] = new Date().getTime();
  this.debug.ctime[0] = new Date().getTime() - now;
};

NoxioGame.prototype.draw = function() {
  /* Update Canvas Size */
  this.window.width = this.container.clientWidth;
  this.window.height = (9/16)*(this.window.width);
  
  /* Clear Canvas */
  var context = this.window.getContext('2d');
  context.clearRect(0, 0, this.window.width, this.window.height);  
   
  /* Draw Game Objects */
  for(var i=0;i<this.objects.length;i++) {
    this.objects[i].draw(context);
  }
  
  /* Draw Debug Info */
  context.font = '16px Calibri';
  context.textAlign = 'right';
  context.fillStyle = 'white';
  context.fillText("STIME " + (this.debug.sAvg).toFixed(2) + " | CTIME " + (this.debug.cAvg).toFixed(2) + " | FPS " + (this.debug.fAvg).toFixed(2) + " | PING " + (this.debug.pAvg).toFixed(2), this.window.width-8, 24);
  
  /* Draw Score List */
  context.font = '16px Calibri';
  context.textAlign = 'left';
  context.fillStyle = 'white';
  for(var i=0;i<this.scores.length;i++) {
    context.fillText(this.scores[i].user + " " + this.scores[i].kills, 8, 24*(i+1));
  }
  
  
  /* Draw Cursor */
  var cursor = this.input.getMouseActual();
  context.beginPath();
  context.strokeStyle = '#FFFFFF';
  context.lineWidth = 5;
  context.moveTo(cursor.x, cursor.y+10);
  context.lineTo(cursor.x, cursor.y-10);
  context.moveTo(cursor.x+10, cursor.y);
  context.lineTo(cursor.x-10, cursor.y);
  context.stroke();
  
  /* Draw Target Line */
  if(this.control !== -1) {
    var obj = this.getObject(this.control);
    context.beginPath();
    context.strokeStyle = 'rgba(255, 255, 255, 0.33)';
    context.lineWidth = 5;
    context.setLineDash([5, 15]);
    context.moveTo(cursor.x, cursor.y);
    context.lineTo(obj.pos.x, obj.pos.y);
    context.stroke();
  }
  
  /* Draw Helper Text */
  if(this.control === -1) {
    context.font = '24px Calibri';
    context.textAlign = 'center';
    context.fillStyle = 'white';
    context.fillText("Press space to respawn!", this.window.width/2, this.window.height-24);
  }
  
  /* Draw Border */
  context.beginPath();
  context.setLineDash([]);
  context.strokeStyle = '#FFFFFF';
  context.lineWidth = 10;
  context.moveTo(0, 0);
  context.lineTo(this.window.width, 0);
  context.moveTo(this.window.width, this.window.height); //Not drawing right border
  context.lineTo(0, this.window.height);
  context.lineTo(0, 0);
  context.stroke();
  
};

NoxioGame.prototype.destroy = function() {
  this.input.destroy();
};