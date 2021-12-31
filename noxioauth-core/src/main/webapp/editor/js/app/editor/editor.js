"use strict";
/* global main */
/* global util */

/* Define NoxioEditor Class */
function NoxioEditor(map) {
  this.window = document.getElementById("canvas");
  this.container = document.getElementById("canvas-container");
  
  this.asset = new Asset();         // Raw data for models, animations, textures, shaders, sounds, etc, etc, etc...
  this.display = new Display(this); // Game rendering and general WebGL stuff
  this.input = new Input(this);     // Input handling
  
  this.tool = undefined;            // The actual tool object currently being used. If undefined then no tool active.
  
  this.loadMap(map);
  
  this.cursor = undefined;                  // The point that the mouse is over.
  this.hover = undefined;                   // Tile the mouse is over, if any.
  this.selection = undefined;               // Small selection circle to show if something is selected
  this.cameraScrollPoint = undefined;       // Point of camera scrolling
  this.cameraLastScrollPoint = undefined;   // Previuos point of camera scrolling
  this.cameraOriginScrollPoint = undefined; // Origin point of camera scrolling
  
  this.settings = {
    grid: true,
    snap: 0.25,
    cursor: 1,
    collision: {
      draw: true,
      floor: true,
      wall: true
    },
    doodad: true,
    spawn: true
  };
  
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
  
  this.nextFrame = this.requestAnimFrameFunc.call(window, function() { main.editor.draw(); }); // Javascript 🙄
};

NoxioEditor.prototype.loadMap = function(map) {
  this.map = new Map(this.display, map);
};

NoxioEditor.prototype.step = function() {
  var mpos = this.input.mouse.pos;
  var kbimp = this.input.keyboard.popInputs();
  var mmov = this.input.mouse.popMovement();
  
  /* Mouse */
  var near = util.matrix.unprojection(this.window, this.display.camera, mpos, 0.0);
  var far = util.matrix.unprojection(this.window, this.display.camera, mpos, 1.0); /* @FIXME doing 2 unprojects is inefficent. Maybe calc camera center? */
  var floorPlane = {a: {x: 0.0, y: 0.0, z: 0.0}, b: {x: 1.0, y: 0.0, z: 0.0}, c: {x: 0.0, y: 1.0, z: 0.0}, n: {x: 0.0, y: 0.0, z: 1.0}};
  var result = util.intersection.linePlane({a: near, b: far}, floorPlane);
  if(!result) { this.hover = undefined; } // Missed the floor plane.
  else {
    this.hover = {x: parseInt(Math.floor(result.intersection.x+0.5)), y: parseInt(Math.floor(result.intersection.y+0.5))}; // Tiles are centered so we offset
    this.cursor = util.vec2.snap({x: result.intersection.x+0.5, y: result.intersection.y+0.5}, this.settings.snap);        // Actual point
    if(this.tool) { this.tool.handleMouse(this.input.mouse, this.settings.cursor===0?{x: this.hover.x, y: this.hover.y}:{x: this.cursor.x, y: this.cursor.y}); }
  }
  
  /* Camera */
  if(this.input.mouse.mmb && result) {                                                                // Position
    if(!this.cameraScrollPoint) {
      this.cameraScrollPoint = result.intersection;
      this.cameraOriginScrollPoint = result.intersection;
    }
    else if(this.cameraLastScrollPoint) {
      var dist = util.vec3.subtract(this.cameraScrollPoint, this.cameraLastScrollPoint);
      this.display.camera.addPos(dist);
    }
    this.cameraLastScrollPoint = this.cameraScrollPoint;
    this.cameraScrollPoint = result.intersection;
  }
  else {
    this.cameraScrollPoint = undefined;
    this.cameraLastScrollPoint = undefined;
    this.cameraOriginScrollPoint = undefined;
  }
  if(this.input.keyboard.keys[37]) { this.display.camera.addRot({x: 0.0, y: 0.0, z: 0.01}); }        // Left
  if(this.input.keyboard.keys[39]) { this.display.camera.addRot({x: 0.0, y: 0.0, z: -0.01}); }       // Right
  if(this.input.keyboard.keys[38]) { this.display.camera.addRot({x: 0.01, y: 0.0, z: 0.0}); }        // Up
  if(this.input.keyboard.keys[40]) { this.display.camera.addRot({x: -0.01, y: 0.0, z: 0.0}); }       // Down
  this.display.camera.setZoom(mmov.s);                                                               // Zoom
  
  /* Keyboard */
  for(var i=0;i<kbimp.length;i++) {
    switch(kbimp[i]) {
      case 71 : { this.settings.grid = !this.settings.grid; break; }
      case 67 : { this.settings.collision.draw = !this.settings.collision.draw; break; }
      case 68 : { this.settings.doodad = !this.settings.doodad; break; }
      case 83 : { this.settings.spawn = !this.settings.spawn; break; }
      case 36 : {
          this.display.camera.setPos(util.vec3.make(this.map.size.x*-.5, this.map.size.y*-.4, 0.));
          this.display.camera.zoom = 60.;
          this.settings.grid = false; this.settings.collision.draw = false; this.settings.doodad = false; this.settings.spawn = false;
          break;
      }
      default : { break; }
    }
  }
  if(this.tool) { this.tool.handleKeyboard(this.input.keyboard, kbimp); }
  
};

/* Converts currently open map project back into .map file for saving. Returns compiled map as text. */
NoxioEditor.prototype.compile = function() {
  var data = "";
  data += this.map.name + ";" + this.map.description + ";";
  for(var i=0;i<this.map.gametypes.length;i++) {
    data += this.map.gametypes[i] + (i+1<this.map.gametypes.length?",":"");
  }
  data += "|\n";
  data += this.map.sky;
  data += "|\n";
  for(var i=0;i<this.map.pallete.length;i++) {
    data += this.map.pallete[i].model.name + "," + this.map.pallete[i].material.name + (i+1<this.map.pallete.length?";\n":"");
  }
  data += "|\n";
  data += this.map.size.x + "," + this.map.size.y;
  data += "|\n";
  for(var i=0;i<this.map.size.y;i++) {
    for(var j=0;j<this.map.size.x;j++) {
      data += this.map.data[this.map.size.y-1-i][j].ind + ",";
    }
    data += (i+1<this.map.size.y?"\n":"");
  }
  for(var i=0;i<this.map.size.y;i++) {
    for(var j=0;j<this.map.size.x;j++) {
      data += this.map.data[this.map.size.y-1-i][j].rot + (i+1<this.map.size.y||j+1<this.map.size.x?",":"");
    }
    data += (i+1<this.map.size.y?"\n":"");
  }
  data += "|\n";
  for(var i=0;i<this.map.doodadPallete.length;i++) {
    data += this.map.doodadPallete[i].model.name + "," + this.map.doodadPallete[i].material.name + (i+1<this.map.doodadPallete.length?";\n":"");
  }
  data += "|\n";
  for(var i=0;i<this.map.doodads.length;i++) {
    data += this.map.doodads[i].doodad + "," + this.map.doodads[i].pos.x + "," + this.map.doodads[i].pos.y + "," + this.map.doodads[i].pos.z + "," + this.map.doodads[i].rot + "," + this.map.doodads[i].scale + (i+1<this.map.doodads.length?";\n":"");
  }
  data += "|\n";
  var f = this.map.collision.floor;
  for(var i=0;i<f.length;i++) {
    for(var j=0;j<f[i].length;j++) {
      data += f[i][j].x + "," + f[i][j].y + (j+1<f[i].length?",":"");
    }
    data += (i+1<f.length?";\n":"");
  }
  data += "|\n";
  var w = this.map.collision.wall;
  for(var i=0;i<w.length;i++) {
    for(var j=0;j<w[i].length;j++) {
      data += w[i][j].x + "," + w[i][j].y + (j+1<w[i].length?",":"");
    }
    data += (i+1<w.length?";\n":"");
  }
  data += "|\n";
  for(var i=0;i<this.map.spawns.length;i++) {
    data += this.map.spawns[i].type + "," + this.map.spawns[i].team + "," + this.map.spawns[i].pos.x + "," + this.map.spawns[i].pos.y + ",";
    for(var j=0;j<this.map.spawns[i].mode.length;j++) {
      data += this.map.spawns[i].mode[j] + (j+1<this.map.spawns[i].mode.length?",":"");
    }
    data += (i+1<this.map.spawns.length?";\n":"");
  }
  data += "|\n";
  for(var i=0;i<this.display.models.length;i++) {
    if(this.display.models[i].name === "multi.debug" || this.display.models[i].name === "multi.shadow") { continue; }
    data += this.display.models[i].name + (i<this.display.models.length-1?",":";\n");
  }
  for(var i=0;i<this.display.materials.length;i++) {
    data += this.display.materials[i].name + (i<this.display.materials.length-1?",":";\n");
  }
  data += "multi/default.wav\n\n";
  
  return data;
};

NoxioEditor.prototype.draw = function() {
  this.step();                                                                                 // Handle user inputs
  this.display.draw();                                                                         // Draw game
  this.nextFrame = this.requestAnimFrameFunc.call(window, function() { main.editor.draw(); }); // Javascript 🙄
};

NoxioEditor.prototype.destroy = function() {
  this.cancelAnimFrameFunc.call(window, this.nextFrame);
  this.asset.destroy();
  this.display.destroy();
};