"use strict";
/* global main */
/* global Texture */
/* global mat4 */
/* global vec3 */

/* Define Game Rendering Class */
function Display(game, container, window) {
  this.game = game; /* We will need to constantly get data from the game instance so we pass it through */
  this.container = container;
  this.window = window;
  
  this.camera = {pos: {x: 0.0, y: 0.0, z: -10.0}}; /* UNUSED! */
  
  if(!this.initWebGL()) { this.initFallback(); }
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
  
  if(!(
    gl.getExtension("OES_element_index_uint") ||
    gl.getExtension("MOZ_OES_element_index_uint") ||
    gl.getExtension("WEBKIT_OES_element_index_uint")
  )) { return false; }
  
  this.textures = [];
  this.shaders = [];
  this.materials = [];
  this.models = [];
  this.shadow = {};
  
  /* @FIXME this is a temp thing */
  var defaultTextureSource = "img/multi/default.png";
  
  if(!this.createTexture(defaultTextureSource)) { return false; }
  if(!this.createShader(this.game.asset.shader.default)) { return false; }
  if(!this.createShader(this.game.asset.shader.shadow)) { return false; }
  //if(!this.createShader(this.game.asset.shader.debug)) { return false; } /* @FIXME DEBUG */
  if(!this.createMaterial(this.game.asset.material.multi.default)) { return false; }
  if(!this.createMaterial(this.game.asset.material.multi.shadow)) { return false; }
  if(!this.createModel(this.game.asset.model.multi.box)) { return false; }
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
Display.prototype.createShader = function(source) {
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
  
  this.shaders.push(new Shader(source.name, shaderProgram, attributes, uniforms));
  
  /* @FIXME Delete frag and vert objects as they dont do anything once the program is linked. */
  
  return true;
};

/* Returns boolean. If returns false then failed to create material. If returns true then material was created and added to materials array. */
Display.prototype.createMaterial = function(source) {
  var shader = this.getShader(source.shader);
  var texture = {};
  if(source.texture0) { texture.texture0 = this.getTexture(source.texture0); }
  if(source.texture1) { texture.texture1 = this.getTexture(source.texture1); }
  if(source.texture2) { texture.texture2 = this.getTexture(source.texture2); }
  if(source.texture3) { texture.texture3 = this.getTexture(source.texture3); }
  if(source.texture4) { texture.texture4 = this.getTexture(source.texture4); }
  
  this.materials.push(new Material(source.name, shader, texture));
  
  return true;
};

/* Returns boolean. If false then failed to setup shaders and we fallback to 2D. */
Display.prototype.createModel = function(source) {
  var gl = this.gl; // Sanity Save
  
  var vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(source.vertices), gl.STATIC_DRAW);
  
  var indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(source.indices), gl.STATIC_DRAW);
  
  this.models.push(new Model(source.name, vertexBuffer, indexBuffer, source.indices.length));
  
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
};

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
  
  /* Generate all matrices for the render */
  var PROJMATRIX = mat4.create(); mat4.perspective(PROJMATRIX, 0.785398, this.window.width/this.window.height, 1.0, 64.0); // Perspective
  var TRANSLATE  = vec3.create(); vec3.set(TRANSLATE, 0.0, 0.0, 0.0);
  var MOVEMATRIX = mat4.create(); mat4.translate(MOVEMATRIX, MOVEMATRIX, TRANSLATE);
  var VIEWMATRIX = mat4.create();

   /* We basically place the center of the shadow proj on the ground of the map and put the near clip behind us. Allows for easier centering. */
  var PROJMATRIX_SHADOW = mat4.create(); mat4.ortho(PROJMATRIX_SHADOW, -8.0, 8.0,-8.0, 8.0, -16.0, 16.0);
  var SMSIZE=1; /* @FIXME my understanding is that you have to do this calculation against the PROJ * LIGHT * TRANSFORM matrix. */
  var OFFSET = vec3.create(); 
    vec3.set(
      OFFSET,
      (Math.floor(this.camera.pos.x*SMSIZE)-(this.camera.pos.x*SMSIZE))/SMSIZE,
      (Math.floor(this.camera.pos.y*SMSIZE)-(this.camera.pos.y*SMSIZE))/SMSIZE,
      ((Math.floor(this.camera.pos.z*SMSIZE)-(this.camera.pos.z*SMSIZE))/SMSIZE)-this.camera.pos.z
    );
  var OFFSETMATRIX = mat4.create(); mat4.translate(OFFSETMATRIX, OFFSETMATRIX, OFFSET);
  var LIGHTMATRIX = mat4.create();
    mat4.translate(LIGHTMATRIX, LIGHTMATRIX, [0.0, 0.0, 1.0]);
    mat4.rotate(LIGHTMATRIX, LIGHTMATRIX, -0.5, [1.0, 0.0, 0.0]);
    mat4.rotate(LIGHTMATRIX, LIGHTMATRIX, 0.35, [0.0, 1.0, 0.0]);
  var LIGHTDIR = vec3.create(); vec3.set(LIGHTDIR, LIGHTMATRIX[8], LIGHTMATRIX[9], -LIGHTMATRIX[10]);
  
  /* Draw Geometry to Shadow FBO */
  gl.bindFramebuffer(gl.FRAMEBUFFER, this.shadow.fb); //Enable shadow frame buffers
  gl.viewport(0.0, 0.0, 512.0, 512.0); // Resize to FBO texture /* @FIXME hardcodedw4
  gl.clearColor(1.0, 0.0, 0.0, 1.0); // red -> Z=Zfar on the shadow map
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
  var shadowMaterial = this.getMaterial("material.multi.shadow");
  var shadowUniformData = [
    {name: "Pmatrix", data: PROJMATRIX_SHADOW},
    {name: "Lmatrix", data: LIGHTMATRIX},
    {name: "Omatrix", data: OFFSETMATRIX}
  ];
  for(var i=0;i<geometry.length;i++) {
    geometry[i].model.draw(gl, shadowMaterial, geometry[i].pos, geometry[i].rot, this.camera, shadowUniformData);
  }

  gl.bindFramebuffer(gl.FRAMEBUFFER, null); //Disable frame buffer

  /* Draw Geometry */
  gl.viewport(0, 0, this.window.width, this.window.height); // Resize to canvas
  gl.clearColor(0.5, 0.5, 0.5, 1.0);  // Opaque grey backdrop
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // Clear Color and Depth from previous draw.
  gl.activeTexture(gl.TEXTURE5); gl.bindTexture(gl.TEXTURE_2D, this.shadow.tex); /* @FIXME TESTING */
  var uniformData = [
    {name: "Pmatrix", data: PROJMATRIX},
    {name: "Vmatrix", data: VIEWMATRIX},
    {name: "Mmatrix", data: MOVEMATRIX},
    {name: "Lmatrix", data: LIGHTMATRIX},
    {name: "PmatrixLight", data: PROJMATRIX_SHADOW},
    {name: "Omatrix", data: OFFSETMATRIX},
    {name: "sourceDirection", data: LIGHTDIR},
    {name: "texture5", data: 5}
  ];
  for(var i=0;i<geometry.length;i++) {
    geometry[i].model.draw(gl, geometry[i].material, geometry[i].pos, geometry[i].rot, this.camera, uniformData);
  }
  
  /* DEBUG DRAW */
  var debugTexture = {glTexture: this.shadow.tex, bind: Texture.prototype.bind}; /* Hackyyyy */
  var debugShader = this.getShader("debug");
  var debugMaterial = new Material("!DEBUG", debugShader, {texture0: debugTexture}); /* Even hackier */
  var debugModel = this.getModel("model.multi.square");
  debugTexture.bind(gl, 0);
  
  var ASPECT = this.window.height/this.window.width;
  var PROJMATRIX_DEBUG = mat4.create(); mat4.ortho(PROJMATRIX_DEBUG, -1.0, 1.0,-1.0*ASPECT, 1.0*ASPECT, 0.0, 1.0);
  var VIEWMATRIX_DEBUG= mat4.create();
  var uniformDataDebug = [
    {name: "Pmatrix", data: PROJMATRIX_DEBUG},
    {name: "Vmatrix", data: VIEWMATRIX_DEBUG}
  ];

  debugModel.draw(gl, debugMaterial, {x: 0.5, y: 0, z: -0.5}, {x: 0, y: 0, z: 0, w: 0}, {pos: {x: 0, y: 0, z: 0}}, uniformDataDebug);

  gl.flush();
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

/* Returns a texture by path. If texture is not found then returns default. */
Display.prototype.getTexture = function(path) {
  for(var i=0;i<this.textures.length;i++) {
    if(this.textures[i].path === path) {
      return this.textures[i];
    }
  }
  
  if(this.createTexture(path)) { return this.getTexture(path); }
  
  main.menu.warning.show("Failed to load texture: '" + path + "'");
  return this.getTexture("img/multi/default.png");
};

/* Returns a shader by name. If shader is not found then returns default. */
Display.prototype.getShader = function(name) {
  for(var i=0;i<this.shaders.length;i++) {
    if(this.shaders[i].name === name) {
      return this.shaders[i];
    }
  }

  var src = this.game.asset.shader[name];
  if(src !== undefined) { if(this.createShader(src)) { return this.getShader(name); } }
  
  main.menu.warning.show("Failed to load shader: '" + name + "'");
  return this.getShader("default");
};

/* Returns a material by name. If it is not loaded then it attempts to load it. If material is not found then returns default. */
Display.prototype.getMaterial = function(name) {
  for(var i=0;i<this.materials.length;i++) {
    if(this.materials[i].name === name) {
      return this.materials[i];
    }
  }
  
  var spl = name.split(".");
  var src = this.game.asset;
  for(var i=0;i<spl.length&&src!==undefined;i++) {
    src = src[spl[i]];
  }
  if(src !== undefined) { if(this.createMaterial(src)) { return this.getMaterial(name); } }
  
  main.menu.warning.show("Failed to load material: '" + name + "'");
  return this.getMaterial("material.multi.default");
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
  if(src !== undefined) { if(this.createModel(src)) { return this.getModel(name); } }
  
  main.menu.warning.show("Failed to load model: '" + name + "'");
  return this.getModel("model.multi.box");
};

Display.prototype.destroy = function() {
  /* @FIXME Make sure we unload and delete all resources loaded! */ 
  if(!gl) { return; }
  var gl = this.gl; // Sanity Save
  for(var i=0;i<this.models.length;i++) { gl.deleteBuffer(this.models[i].vertexBuffer); gl.deleteBuffer(this.models[i].indexBuffer); }
  for(var i=0;i<this.shaders.length;i++) { gl.deleteProgram(this.shaders[i].program); }
  for(var i=0;i<this.textures.length;i++) { gl.deleteTexture(this.textures[i].glTexture); }
  gl.deleteRenderbuffer(this.shadow.rb);
  gl.deleteFramebuffer(this.shadow.fb);
  gl.deleteTexture(this.shadow.tex);
  this.window.width = 1; this.window.height = 1;
};