"use strict";
/* global main */
/* global glm */

/* Define Game Rendering Class */
function Display(game, container, window) {
  this.game = game; /* We will need to constantly get data from the game instance so we pass it through */
  this.container = container;
  this.window = window;
  
  this.camera = {pos: {x: 0.0, y: 0.0, z: 0.0}}; /* UNUSED! */
  
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
    this.gl = this.window.getContext("experimental-webgl", {premultipliedalpha: false, antialias: true});
    return this.setupWebGL();
  }
  catch(ex) { main.menu.error.showErrorException("WebGL Error", "Exception while initializing WebGL: " + ex.message, ex.stack); return false; }
};

/* Returns boolean. If false then WebGL failed to setup and we should setup fallback rendering. If true we all good boyzzz. */
Display.prototype.setupWebGL = function() {
  var gl = this.gl; /* Sanity Save */
  gl.viewport(0, 0, this.window.width, this.window.height); // Resize to canvas
  gl.enable(gl.CULL_FACE);            // Do not draw backfacing triangles
  gl.cullFace(gl.BACK);
  gl.enable(gl.DEPTH_TEST);           // Enable depth testing
  gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

  gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Set clear color to black, fully opaque
  gl.clearDepth(1.0);                 // Clear everything
  
  //if(!gl.getExtension('OES_texture_float')) { return false; }   // Enable GL_Float textures for depth textures
  //if(!gl.getExtension('WEBGL_depth_texture')) { return false; } // Enable Depth Texture support shadow mapping
  if(!(
    gl.getExtension("OES_element_index_uint") ||
    gl.getExtension("MOZ_OES_element_index_uint") ||
    gl.getExtension("WEBKIT_OES_element_index_uint")
  )) { return false; }
  
  this.textures = [];
  this.shaders = [];
  this.models = [];
  this.shadow = {};
  
  /* @FIXME this is a temp thing */
  var defaultTextureSource = "img/multi/default.png";
  
  /* @FIXME this is a temp thing */
//  var defaultShaderSource = {
//    fragment: "precision mediump float; uniform sampler2D texture; varying vec3 vnormal; varying vec3 vcoord; void main(void) { gl_FragColor = (texture2D(texture, vcoord.st)*0.75)+(vec4(vnormal, 1.0)*0.25); }",
//    vertex: "precision mediump float; attribute vec3 position; attribute vec3 texcoord; attribute vec3 normal; uniform mat4 uMVMatrix; uniform mat4 uPMatrix; varying vec3 vnormal; varying vec3 vcoord; varying vec3 color; void main(void) { vnormal = normal; vcoord = texcoord; gl_Position = uPMatrix * uMVMatrix * vec4(position, 1.0); }"
//  };
//  var defaultShaderSource = {
//    fragment: "precision mediump float; varying vec3 vnormal; varying vec3 vcoord; varying vec3 color;  void main(void) { gl_FragColor = vec4(color, 1.0+((vnormal.x+vcoord.x)*0.001)); }",
//    vertex: "precision mediump float; attribute vec3 position; attribute vec3 texcoord; attribute vec3 normal; uniform mat4 uMVMatrix; uniform mat4 uPMatrix; varying vec3 vnormal; varying vec3 vcoord; varying vec3 color; void main(void) { color = vec3(position.x+0.5,position.y+0.5,position.z+0.5); vnormal = normal; vcoord = texcoord; gl_Position = uPMatrix * uMVMatrix * vec4(position, 1.0); }"
//  };
  
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
  
  if(!this.createTexture(defaultTextureSource)) { return false; }
  if(!this.createShader("Default", this.game.asset.shader.default)) { return false; }
  if(!this.createShader("Shadow", this.game.asset.shader.shadow)) { return false; }
  if(!this.createModel("Default", this.game.asset.basic.tilePillar)) { return false; }
  if(!this.createShadowFramebuffer()) { return false; }
  
  return true;
};

Display.prototype.createTexture = function(path) {
  var gl = this.gl; // Sanity Save
  var glTexture = gl.createTexture();
  this.textures.push(new Texture(gl, glTexture, path));
  return true;
};

Display.prototype.compileVertexShader =  function(name, source) {
  var gl = this.gl; // Sanity Save
  var shader = gl.createShader(gl.VERTEX_SHADER); // Create shader object
  gl.shaderSource(shader, source); // Send the source to the shader object
  gl.compileShader(shader); // Compile the shader program
  
  // See if it compiled successfully
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    main.menu.error.showErrorException("WebGL Error", "An error occurred compiling the Vertex Shader: " + name, gl.getShaderInfoLog(shader));
    return undefined;
  }
  return shader;
};

Display.prototype.compileFragmentShader =  function(name, source) {
  var gl = this.gl; // Sanity Save
  var shader = gl.createShader(gl.FRAGMENT_SHADER); // Create shader object
  gl.shaderSource(shader, source); // Send the source to the shader object
  gl.compileShader(shader); // Compile the shader program
  
  // See if it compiled successfully
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    main.menu.error.showErrorException("WebGL Error", "An error occurred compiling the Fragment Shader: " + name, gl.getShaderInfoLog(shader));
    return undefined;
  }
  return shader;
};

/* Returns boolean. If returns false then failed to create shader. If returns true then shader was created and added to shaders array. */
Display.prototype.createShader = function(name, source) {
  var gl = this.gl; // Sanity Save
  
  var fragmentShader, vertexShader;
  if(!(fragmentShader = this.compileFragmentShader(source.name, source.fragment))) { return false; }
  if(!(vertexShader = this.compileVertexShader(source.name, source.vertex))) { return false; }

  // Create the shader program
  var shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // If creating the shader program failed display error & return false
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    main.menu.error.showErrorException("WebGL Error", "Unable to initialize the shader program: ", gl.getProgramInfoLog(shaderProgram));
    return false;
  }
  
  var attributes = {};
  var uniforms = {};
  for(var i=0;i<source.attributes.length;i++) {
    attributes[source.attributes[i].name] = {type: source.attributes[i].type, location: gl.getAttribLocation(shaderProgram, source.attributes[i].name)};
  }
  for(var i=0;i<source.uniforms.length;i++) {
    uniforms[source.uniforms[i].name] = {type: source.uniforms[i].type, location: gl.getUniformLocation(shaderProgram, source.uniforms[i].name)};
  }
  
  this.shaders.push(new Shader(name, shaderProgram, attributes, uniforms));
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

/* Returns a shadow mapping framebuffer object */
Display.prototype.createShadowFramebuffer = function() {
  var gl = this.gl; // Sanity Save
  
  var fb=gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, fb);

  var rb=gl.createRenderbuffer();
  gl.bindRenderbuffer(gl.RENDERBUFFER, rb);
  gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16 , 512, 512);

  gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, rb);

  var texture_rtt=gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture_rtt);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 512, 512, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture_rtt, 0);
  
  if(gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) { return false; }
  
  this.shadow = {fb: fb, rb: rb, tex: texture_rtt};
  
  gl.bindTexture(gl.TEXTURE_2D, null);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  
  return true;
  
//  var fbo = gl.createFramebuffer();
//  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
//  fbo.width = 1024;
//  fbo.height = 1024;
//  
//  var depthTexture = gl.createTexture();
//  gl.bindTexture(gl.TEXTURE_2D, depthTexture);
//  gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT, 1024, 1024, 0, gl.DEPTH_COMPONENT, gl.FLOAT, null);
//  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
//  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
//  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
//  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
//  
//  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, depthTexture, 0);
//  //gl.drawBuffer(gl.NONE); idk webgl lol
//  
//  if(gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) { return false; }
//  
//  this.shadow = {fbo: fbo, tex: depthTexture};
//  return true;
};

  var LIGHTDIR=[0.58,0.58,-0.58];

Display.prototype.draw = function() {
  /* Update Canvas Size */
  this.window.width = this.container.clientWidth;
  this.window.height = (9/16)*(this.window.width);
  
  /* Update Camera */
  var mmov = this.game.input.mouse.popMovement();
  if(this.game.input.mouse.rmb) { this.camera.pos.x += mmov.x/128; this.camera.pos.y += mmov.y/128; }
  
  /* Check WebGL is OKAY */
  if(!this.gl) { this.drawFallback(); return; }
  
  /* Begin WebGL draw */
  var gl = this.gl; // Sanity Save
  
  /* Collect all geometry to draw.
     Format: {model: <Model>, pos: {x: <float>, y: <float>, z: <float>}, rot: {x: <float>, y: <float>, z: <float>, w: <float>}} */
  var geometry = [];
  this.game.map.getDraw(geometry);
  
  /* Draw Geometry to Shadow FBO */
  var PROJMATRIX=LIBS.get_projection(40, this.window.width/this.window.height, 1, 100);
  var MOVEMATRIX=LIBS.get_I4();
  var VIEWMATRIX=LIBS.get_I4();

  LIBS.translateZ(VIEWMATRIX, -20);
  LIBS.translateY(VIEWMATRIX, -4);
  var THETA=0,
      PHI=0;


  var PROJMATRIX_SHADOW=LIBS.get_projection_ortho(32, 1, 1, 64);
  var LIGHTMATRIX=LIBS.lookAtDir(LIGHTDIR, [0,1,0], [0,0,0]);
  
//  var test = Matrix.I(4);
//  test = test.x(Matrix.Translation($V([0, 0, 3])).ensure4x4());
//  test = Matrix.Rotation(0.6, $V([1, 0, 0.7])).ensure4x4();
//  
//  var LIGHTMATRIX = test.flatten();
//  var lightInvDir = glm.vec3(0.5, 2.0, 2.0);
//  var depthProjectionMatrix = glm.perspective(90, this.window.width/this.window.height, 0.1, 32.0); //glm.ortho(0,this.window.width,0,this.window.height,1,25); 
//  var depthViewMatrix = glm.look(lightInvDir, glm.vec3(0,0,0), glm.vec3(0,1,0));
//  var depthModelMatrix = glm.mat4(1.0);
//  var depthMVP = depthProjectionMatrix.mul(depthViewMatrix.mul(depthModelMatrix));

  gl.bindFramebuffer(gl.FRAMEBUFFER, this.shadow.fb); //Enable shadow frame buffers
  gl.viewport(0.0, 0.0, 512.0, 512.0); // Resize to FBO texture /* @FIXME hardcoded
  gl.clearColor(1.0, 0.0, 0.0, 1.0); // red -> Z=Zfar on the shadow map
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
  var shadowShader = this.getShader("Shadow");
  var shadowUniformData = [
    {name: "Pmatrix", data: PROJMATRIX_SHADOW},
    {name: "Lmatrix", data: LIGHTMATRIX}
  ];
  for(var i=0;i<geometry.length;i++) {
    geometry[i].model.draw(gl, shadowShader, geometry[i].pos, geometry[i].rot, this.camera, shadowUniformData);
  }

  gl.bindFramebuffer(gl.FRAMEBUFFER, null); //Disable frame buffer

  /* Draw Geometry */
  gl.viewport(0, 0, this.window.width, this.window.height); // Resize to canvas
  gl.clearColor(0.5, 0.5, 0.5, 1.0);  // Opaque grey backdrop
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // Clear Color and Depth from previous draw.
//  var perspectiveMatrix = makePerspective(90, this.window.width/this.window.height, 0.1, 10.0); //FOV, Aspect Ratio, Near Plane, Far Plane
//  var biasMatrix = glm.mat4(
//    0.5, 0.0, 0.0, 0.0,
//    0.0, 0.5, 0.0, 0.0,
//    0.0, 0.0, 0.5, 0.0,
//    0.5, 0.5, 0.5, 1.0
//  );
//  var depthBiasMVP = biasMatrix.mul(depthMVP);
  var shader = this.getShader("Default");
  this.getTexture("img/multi/default.png").bind(gl); /* @FIXME TESTING */
  gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, this.shadow.tex); /* @FIXME TESTING */
  var uniformData = [
    {name: "Pmatrix", data: PROJMATRIX},
    {name: "Vmatrix", data: VIEWMATRIX},
    {name: "Mmatrix", data: MOVEMATRIX},
    {name: "Lmatrix", data: LIGHTMATRIX},
    {name: "PmatrixLight", data: PROJMATRIX_SHADOW},
    {name: "sourceDirection", data: LIGHTDIR},
    {name: "sampler", data: 0},
    {name: "samplerShadowMap", data: 1}
  ];
  for(var i=0;i<geometry.length;i++) {
    geometry[i].model.draw(gl, shader, geometry[i].pos, geometry[i].rot, this.camera, uniformData);
  }
  
  gl.flush();
  
  /* Test Draw */
//  this.rx++;
//  var model = this.getModel("Default");
//  model.draw(gl, perspectiveMatrix, {x: (Math.sin(this.rx/100)*1)+10, y: (Math.cos(this.rx/100)*1), z: 0.0}, {x: 0.0, y: 0.0, z: 1.0, w: (this.rx/66)}, this.camera);
//  model.draw(gl, perspectiveMatrix, {x: (Math.sin(this.rx/-10)*1), y: (Math.cos(this.rx/-10)*1)+10, z: 0.0}, {x: 0.0, y: 0.0, z: 1.0, w: (this.rx/133)}, this.camera);

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
};

/* Returns a texture by path. If texture is not found then returns default. */
Display.prototype.getTexture = function(path) {
  for(var i=0;i<this.textures.length;i++) {
    if(this.textures[i].path === path) {
      return this.textures[i];
    }
  }
  return this.getTexture("img/multi/default.png");
};

/* Returns a shader by name. If shader is not found then returns default. */
Display.prototype.getShader = function(name) {
  for(var i=0;i<this.shaders.length;i++) {
    if(this.shaders[i].name === name) {
      return this.shaders[i];
    }
  }
  return this.getShader("Default");
};

/* Returns a model by name. If it is not loaded then it attempts to load it. If model is not found then returns default. */
Display.prototype.getModel = function(name) {
  for(var i=0;i<this.models.length;i++) {
    if(this.models[i].name === name) {
      return this.models[i];
    }
  }
  
  var spl = name.split(".");
  var src = this.game.asset;
  for(var i=0;i<spl.length&&src!==undefined;i++) {
    src = src[spl[i]];
  }
  if(src !== undefined) { this.createModel(name, src); return this.getModel(name); }
  
  return this.getModel("Default");
};

Display.prototype.destroy = function() {
  /* @FIXME yohoho we need to delete the gl instance or whatever */
};