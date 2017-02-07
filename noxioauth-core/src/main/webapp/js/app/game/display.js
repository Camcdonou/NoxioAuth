"use strict";
/* global main */

/* Define Game Rendering Class */
function Display(game, container, window) {
  this.game = game; /* We will need to constantly get data from the game instance so we pass it through */
  this.container = container;
  this.window = window;
  
  if(!this.initWebGL()) { this.initFallback(); }
  
  this.rx = 0; /* @FIXME debug */
};

Display.prototype.initFallback = function() {
  /* Reset Canvas */
  this.gl = undefined;
  this.container.innerHTML = "<!-- Fallback Mode --><canvas id='canvas' width='320' height='240'>Your browser doesn't appear to support the <code>&lt;canvas&gt;</code> element.<canvas>";
  this.window = document.getElementById("canvas");
  this.game.window = this.window;
};

Display.prototype.initWebGL = function() {
  try { 
    this.gl = this.window.getContext("experimental-webgl", { premultipliedalpha: false });
    return this.setupWebGL();
  }
  catch(ex) { main.menu.error.showErrorException("WebGL Error", "Exception while initializing WebGL: ", ex.stack); return false; }
};

/* Returns boolean. If false then WebGL failed to setup and we should setup fallback rendering. If true we all good boyzzz. */
Display.prototype.setupWebGL = function() {
  var gl = this.gl; /* Sanity Save */
  gl.viewport(0, 0, this.window.width, this.window.height); // Resize to canvas
  gl.enable(gl.DEPTH_TEST);           // Enable depth testing
  gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

  gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Set clear color to black, fully opaque
  gl.clearDepth(1.0);                 // Clear everything
  
  this.shaders = [];
  this.models = [];
  
  /* @FIXME this is a temp thing */
  var defaultShaderSource = {
    fragment: "precision mediump float; varying vec3 vnormal; varying vec3 vcoord; varying vec3 color;  void main(void) { gl_FragColor = vec4(color, 1.0+((vnormal.x+vcoord.x)*0.001)); }",
    vertex: "precision mediump float; attribute vec3 position; attribute vec3 texcoord; attribute vec3 normal; uniform mat4 uMVMatrix; uniform mat4 uPMatrix; varying vec3 vnormal; varying vec3 vcoord; varying vec3 color; void main(void) { color = vec3(position.x+0.5,position.y+0.5,position.z+0.5); vnormal = normal; vcoord = texcoord; gl_Position = uPMatrix * uMVMatrix * vec4(position, 1.0); }"
  };
  
  /* @FIXME more temp stuff */
//  var defaultModelSource = {
//    vertices: [
//      -1.0, -1.0,  1.0, 1.0, -1.0,  1.0, 1.0,  1.0,  1.0, -1.0,  1.0,  1.0, -1.0, -1.0, -1.0, -1.0,  1.0, -1.0, 1.0,  1.0, -1.0,
//       1.0, -1.0, -1.0, -1.0,  1.0, -1.0, -1.0,  1.0,  1.0, 1.0,  1.0,  1.0, 1.0,  1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, -1.0,
//       1.0, -1.0,  1.0, -1.0, -1.0,  1.0, 1.0, -1.0, -1.0, 1.0,  1.0, -1.0,  1.0,  1.0,  1.0, 1.0, -1.0,  1.0, -1.0, -1.0, -1.0, 
//      -1.0, -1.0,  1.0, -1.0,  1.0,  1.0, -1.0,  1.0, -1.0
//    ],
//    indices: [
//      0,  1,  2,      0,  2,  3,    // front
//      4,  5,  6,      4,  6,  7,    // back
//      8,  9,  10,     8,  10, 11,   // top
//      12, 13, 14,     12, 14, 15,   // bottom
//      16, 17, 18,     16, 18, 19,   // right
//      20, 21, 22,     20, 22, 23    // left
//    ]
//  };
  
  if(!this.createShader("Default", defaultShaderSource)) { return false; }
  if(!this.createModel("Default", this.game.asset.basic.tilePillar)) { return false; }
  
  return true;
};

Display.prototype.compileVertexShader =  function(source) {
  var gl = this.gl; // Sanity Save
  var shader = gl.createShader(gl.VERTEX_SHADER); // Create shader object
  gl.shaderSource(shader, source); // Send the source to the shader object
  gl.compileShader(shader); // Compile the shader program
  
  // See if it compiled successfully
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    main.menu.error.showErrorException("WebGL Error", "An error occurred compiling the Vertex Shader: ", gl.getShaderInfoLog(shader));
    return undefined;
  }
  return shader;
};

Display.prototype.compileFragmentShader =  function(source) {
  var gl = this.gl; // Sanity Save
  var shader = gl.createShader(gl.FRAGMENT_SHADER); // Create shader object
  gl.shaderSource(shader, source); // Send the source to the shader object
  gl.compileShader(shader); // Compile the shader program
  
  // See if it compiled successfully
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    main.menu.error.showErrorException("WebGL Error", "An error occurred compiling the Fragment Shader: ", gl.getShaderInfoLog(shader));
    return undefined;
  }
  return shader;
};

/* Returns boolean. If returns false then failed to create shader. If returns true then shader was created and added to shaders array. */
Display.prototype.createShader = function(name, source) {
  var gl = this.gl; // Sanity Save
  
  var fragmentShader, vertexShader;
  if(!(fragmentShader = this.compileFragmentShader(source.fragment))) { return false; }
  if(!(vertexShader = this.compileVertexShader(source.vertex))) { return false; }

  // Create the shader program
  var shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // If creating the shader program failed display error & return false
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    main.menu.error.showErrorException("WebGL Error", "Unable to initialize the shader program: ", gl.getProgramInfoLog(shader));
    return false;
  }

  var vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "position");
  var textureCoordinateAttribute = gl.getAttribLocation(shaderProgram, "texcoord");
  var vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "normal");
  gl.enableVertexAttribArray(vertexPositionAttribute);
  
  var attributes = {
    vertexPositionAttribute: vertexPositionAttribute,
    textureCoordinateAttribute: textureCoordinateAttribute,
    vertexNormalAttribute: vertexNormalAttribute
  };
  this.shaders.push(new Shader(name, shaderProgram, attributes));
  return true;
};

/* Returns boolean. If false then failed to setup shaders and we fallback to 2D. */
Display.prototype.createModel = function(name, source) {
  var gl = this.gl; // Sanity Save
  
  var vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(source.vertices), gl.STATIC_DRAW);
  
  var indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(source.indices), gl.STATIC_DRAW);
  
  this.models.push(new Model(name, vertexBuffer, indexBuffer, source.indices.length, this.getShader("Default"))); /* @FIXME shader retrieval stub */
  
  return true;
};

Display.prototype.draw = function() {
  /* Update Canvas Size */
  this.window.width = this.container.clientWidth;
  this.window.height = (9/16)*(this.window.width);
  
  /* Check WebGL is OKAY */
  if(!this.gl) { this.drawFallback(); return; }
  
  /* Begin WebGL draw */
  var gl = this.gl; // Sanity Save

  gl.viewport(0, 0, this.window.width, this.window.height); // Resize to canvas
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // Clear Color and Depth from previous draw.
  gl.clearColor(0.5, 0.5, 0.5, 1.0);  // Set clear color to black, fully opaque
  var perspectiveMatrix = makePerspective(90, this.window.width/this.window.height, 0.1, 100.0); //FOV, Aspect Ratio, Near Plane, Far Plane
  
  /* Test Draw */
  this.rx++;
  var model = this.getModel("Default");
  model.draw(gl, perspectiveMatrix, {x: (Math.sin(this.rx/100)*3), y: (Math.cos(this.rx/100)*3), z: -6.0}, {x: 0.0, y: 0.0, z: 1.0, w: (this.rx/66)});

//  this.drawObjects(gl); /* Draw Game Objects */
//  this.drawControl(gl); /* Draw Controls */
//  this.drawText(gl); /* Draw Text */
//  this.drawBorder(gl); /* Draw Border */
};

/* Draws a 2D fallback render if WebGL fails to initialize */
Display.prototype.drawFallback = function() {
  var context = this.window.getContext('2d');
  context.clearRect(0, 0, this.window.width, this.window.height); /* Clear Canvas */
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, this.window.width, this.window.height);
  context.font = '24px Calibri';
  context.textAlign = 'center';
  context.fillStyle = '#e17fb0';
  context.fillText("Your browser does not support WebGL.", this.window.width/2, (this.window.height/2));
};

Display.prototype.drawObjects = function(context) {
  for(var i=0;i<this.game.objects.length;i++) {
    this.game.objects[i].draw();
  }
};

Display.prototype.drawControl = function(context) {
  
};

Display.prototype.drawText = function(context) {
  
};

Display.prototype.drawBorder = function(context) {
  
};

Display.prototype.loadIdentity = function() {
  this.mvMatrix = Matrix.I(4);
}

Display.prototype.multMatrix = function(m) {
  this.mvMatrix = this.mvMatrix.x(m);
}

Display.prototype.mvTranslate = function(v) {
  this.multMatrix(Matrix.Translation($V([v[0], v[1], v[2]])).ensure4x4());
}

/* Returns a shader by name. If shader is not found then returns default. */
Display.prototype.getShader = function(name) {
  for(var i=0;i<this.shaders.length;i++) {
    if(this.shaders[i].name === name) {
      return this.shaders[i];
    }
  }
  this.getShader("Default");
};

/* Returns a model by name. If model is not found then returns default. */
Display.prototype.getModel = function(name) {
  for(var i=0;i<this.models.length;i++) {
    if(this.models[i].name === name) {
      return this.models[i];
    }
  }
  this.getModel("Default");
};

Display.prototype.destroy = function() {
  /* @FIXME yohoho we need to delete the gl instance or whatever */
};