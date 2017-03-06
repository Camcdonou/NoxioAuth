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
  
  this.camera = {pos: {x: 0.0, y: 0.0, z: -10.0}}; /* @FIXME rotation? */
  
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
    this.gl = this.window.getContext("webgl", {antialias: false});
    if(!this.gl) { return false; }
    return this.setupWebGL();
  }
  catch(ex) { main.menu.error.showErrorException("WebGL Error", "Exception while initializing WebGL: " + ex.message, ex.stack); return false; }
};

/* Returns boolean. If false then WebGL failed to setup and we should setup fallback rendering. */
Display.prototype.setupWebGL = function() {
  var gl = this.gl; /* Sanity Save */
  gl.viewport(0, 0, this.window.width, this.window.height); // Resize to canvas
  gl.enable(gl.CULL_FACE);                                  // Enable culling triangles
  gl.cullFace(gl.BACK);                                     // Cull triangles that aren't facing the camera
  gl.enable(gl.DEPTH_TEST);                                 // Enable depth testing
  gl.depthFunc(gl.LEQUAL);                                  // Near things obscure far things
  gl.disable(gl.BLEND);                                     // Disable transparency blend by default
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE);                       // Transparency function

  gl.clearColor(0.0, 0.0, 0.0, 1.0);                        // Set clear color to black, fully opaque
  gl.clearDepth(1.0);                                       // Clear depth
  
  if(!(
    gl.getExtension("OES_element_index_uint") ||
    gl.getExtension("MOZ_OES_element_index_uint") ||
    gl.getExtension("WEBKIT_OES_element_index_uint")
  )) { return false; }
  
  this.upscale = {world: 2.0, ui: 1.0}; /* @FIXME */
  
  this.textures = [];
  this.shaders = [];
  this.materials = [];
  this.models = [];
  this.fbo = {};
  
  var maxUniform = gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS);
  if(maxUniform < 64) { main.menu.error.showError("GLSL returned MAX_VERTEX_UNIFORM_VECTORS as : " + maxUniform); return false; }
  this.PL_UNIFORM_MAX = maxUniform * 0.33; this.LL_UNIFORM_MAX = maxUniform * 0.33;
  
  if(!this.createTexture("img/multi/default.png")) { return false; }
    
  //if(!this.createShader(this.game.asset.shader.debug)) { return false; } /* @FIXME DEBUG */
  if(!this.createMaterial(this.game.asset.material.multi.default)) { return false; }
  if(!this.createMaterial(this.game.asset.material.multi.shadow)) { return false; }
  if(!this.createMaterial(this.game.asset.material.multi.post_msaa)) { return false; } /* @FIXME default post_msaa for testing */
  if(!this.createMaterial(this.game.asset.material.multi.gulm)) { return false; }
  
  if(!this.createModel(this.game.asset.model.multi.box)) { return false; }
  if(!this.createModel(this.game.asset.model.multi.square)) { return false; }
  
  if(!this.createShadowFramebuffer("shadow", 512)) { return false; }
  if(!this.createFramebuffer("world", this.upscale.world)) { return false; }
  if(!this.createFramebuffer("ui", this.upscale.ui)) { return false; }
  
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

/* Returns true if a shadow mapping framebuffer object is created */
Display.prototype.createShadowFramebuffer = function(name, size) {
  var gl = this.gl; // Sanity Save
  
  var fb=gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
  fb.width = size;
  fb.height = size;

  var rb=gl.createRenderbuffer();
  gl.bindRenderbuffer(gl.RENDERBUFFER, rb);
  gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, size, size);

  gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, rb);

  var tex=gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, size, size, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
  
  if(gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) { return false; }
  
  this.fbo[name] = {fb: fb, rb: rb, tex: new RenderTexture(tex)};
  
  gl.bindTexture(gl.TEXTURE_2D, null);
  gl.bindRenderbuffer(gl.RENDERBUFFER, null);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  
  return true;
};

/* Returns true if a framebuffer object is created */
Display.prototype.createFramebuffer = function(name, upscale) {
  var gl = this.gl; // Sanity Save
  
  var size = 512;
  
  var fb = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
  fb.width = size;
  fb.height = size;
  
  var tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  //gl.generateMipmap(gl.TEXTURE_2D); /* @FIXME why? Error? gl.LINEAR_MIPMAP_NEAREST */
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, fb.width, fb.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  
  var rb = gl.createRenderbuffer();
  gl.bindRenderbuffer(gl.RENDERBUFFER, rb);
  gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, fb.width, fb.height);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
  gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, rb);
  
  if(gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) { return false; }
  
  this.fbo[name] = {fb: fb, rb: rb, tex: new RenderTexture(tex), upscale: upscale};
  
  gl.bindTexture(gl.TEXTURE_2D, null);
  gl.bindRenderbuffer(gl.RENDERBUFFER, null);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  
  return true;
};

/* Updates framebuffer texture size and shape based on window size */
Display.prototype.updateFramebuffer = function(name) {
  var gl = this.gl; // Sanity Save
  var fbo = this.fbo[name];
  
  var x=2, y=2;
  while(x<=(this.window.width*fbo.upscale)) { x = x*2; }
  while(y<=(this.window.height*fbo.upscale)) { y = y*2; }
  
  if(x !== fbo.fb.width || y !== fbo.fb.height) {
    main.menu.warning.show("FBO RESIZE OP: " + name + ":" + x + "," + y);
    fbo.fb.width = x;
    fbo.fb.height = y;
    
    gl.bindTexture(gl.TEXTURE_2D, fbo.tex.glTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, fbo.fb.width, fbo.fb.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, fbo.rb);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, fbo.fb.width, fbo.fb.height);
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
  }
};

var RXD = 0; /* @FIXME debug from lights */
Display.prototype.draw = function() {
  /* Update Canvas Size */
  this.window.width = this.container.clientWidth;
  this.window.height = (9/16)*(this.window.width);
  
  /* Check WebGL is OKAY */
  if(!this.gl) { this.drawFallback(); return; }
  var gl = this.gl; // Sanity Save
  
  /* Update Framebuffers */
  this.updateFramebuffer("world");
  this.updateFramebuffer("ui");
  
  /* Generate all matrices for the render */
  var PROJMATRIX = mat4.create(); mat4.perspective(PROJMATRIX, 0.785398, this.window.width/this.window.height, 1.0, 64.0); // Perspective
  var TRANSLATE  = vec3.create(); vec3.set(TRANSLATE, 0.0, 0.0, 0.0);
  var MOVEMATRIX = mat4.create(); mat4.translate(MOVEMATRIX, MOVEMATRIX, TRANSLATE);
  var VIEWMATRIX = mat4.create();

  // We basically place the center of the shadow proj on the ground of the map and put the near clip behind us. Allows for easier centering.
  var PROJMATRIX_SHADOW = mat4.create(); mat4.ortho(PROJMATRIX_SHADOW, -8.0, 8.0,-8.0, 8.0, -16.0, 16.0); /* @FIXME HARDCODED SIZE! NEEDS TO RESIZE TO VIEW FRUSTRUM */
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
  
  /* Collect all geometry to draw.
     Format: {model: <Model>, material: <Material>, pos: {x: <float>, y: <float>, z: <float>}, rot: {x: <float>, y: <float>, z: <float>, w: <float>}} */
  var geometry = [];
  this.game.map.getDraw(geometry, this.camera);
  for(var i=0;i<this.game.objects.length;i++) {
    this.game.objects[i].getDraw(geometry, this.camera);
  }

  /* Sort geometry by shader -> material -> draws */
  var geomSorted = [];
  for(var i=0;i<geometry.length;i++) {
    var geom = geometry[i];
    var shaderGroup = undefined;
    for(var j=0;j<geomSorted.length;j++) {
      if(geomSorted[j].shader.name === geom.material.shader.name) {
        shaderGroup = geomSorted[j];
      }
    }
    if(!shaderGroup) {
      shaderGroup = {shader: geom.material.shader, materials: []};
      geomSorted.push(shaderGroup);
    }
    var materialGroup = undefined;
    for(var j=0;j<shaderGroup.materials.length;j++) {
      if(shaderGroup.materials[j].material.name === geom.material.name) {
        materialGroup = shaderGroup.materials[j];
      }
    }
    if(!materialGroup) {
      materialGroup = {material: geom.material, draws: []};
      shaderGroup.materials.push(materialGroup);
    }
    materialGroup.draws.push({model: geom.model, pos: geom.pos, rot: geom.rot});
  }
  
  /* === Draw Geometry to Shadow FBO ===================================================================================== */
  /* ===================================================================================================================== */
  gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo.shadow.fb);                     // Enable shadow framebuffer
  gl.viewport(0.0, 0.0, this.fbo.shadow.fb.width, this.fbo.shadow.fb.height); // Resize viewport to FBO texture
  gl.clearColor(1.0, 0.0, 0.0, 1.0);                                          // red -> Z=Zfar on the shadow map
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
  var shadowMaterial = this.getMaterial("material.multi.shadow");
  var shadowUniformData = [
    {name: "Pmatrix", data: PROJMATRIX_SHADOW},
    {name: "Lmatrix", data: LIGHTMATRIX},
    {name: "Omatrix", data: OFFSETMATRIX}
  ];
  
  shadowMaterial.shader.enable(gl);
  shadowMaterial.shader.applyUniforms(gl, shadowUniformData);
  shadowMaterial.enable(gl);
  for(var i=0;i<geometry.length;i++) {
    geometry[i].model.draw(gl, shadowMaterial.shader, geometry[i].pos, geometry[i].rot, this.camera);
  }
  shadowMaterial.disable(gl);
  shadowMaterial.shader.disable(gl);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null); //Disable frame buffer
  
  /* Compile Dynamic Light Information */
  var testA = new PointLight( /* @FIXME DEBUG */
    {x: 6.0+(Math.sin(RXD*0.01)*4), y: 8.0+(Math.cos(RXD*0.01)*4), z: 0.5},
    {r: 1.0, g: 0.0, b: 0.5, a: 1.0},
    2.0
  );
  var testB = new PointLight(
    {x: 22.0, y: 22.0, z: 0.5},
    {r: 0.0, g: 1.0, b: 0.5, a: 1.0},
    7.0
  );
  var testC = new PointLight( /* @FIXME DEBUG */
    {x: 11.0+(Math.sin(RXD*0.05)*9), y: 5.0+(Math.cos(RXD*0.05)*9), z: 0.5},
    {r: 0.0, g: 0.5, b: 0.5, a: 1.0},
    3.0
  );
  var testD = new PointLight( /* @FIXME DEBUG */
    {x: 16.0+(Math.sin(RXD*0.09)*2), y: 11.0+(Math.cos(RXD*0.09)*2), z: 0.5},
    {r: 1.0, g: 0.5, b: 0.5, a: 1.0},
    4.0
  );
  var testE = new PointLight( /* @FIXME DEBUG */
    {x: 8.0+(Math.sin(RXD*0.02)*3), y: 22.0+(Math.cos(RXD*0.02)*3), z: 0.5},
    {r: 1.0, g: 1.0, b: 1.0, a: 1.0},
    6.0
  );
  RXD++;
  
  var lights = [testA, testB, testC, testD, testE];
  var pLightLength = 0;
  var pLightPos = [];
  var pLightColor = [];
  var pLightRadius = [];
  for(var i=0;i<lights.length;i++) {
    /* @FIXME CULL? Probably do it in the owners function... */
    if(i*8 >= this.PL_UNIFORM_MAX) { break; } /* At max capacity for light rendering! @FIXME WARNING */
    else {
      var pl = lights[i];
      pLightPos.push(pl.pos.x+this.camera.pos.x); pLightPos.push(pl.pos.y+this.camera.pos.y); pLightPos.push(pl.pos.z+this.camera.pos.z);
      pLightColor.push(pl.color.r*pl.color.a); pLightColor.push(pl.color.g*pl.color.a); pLightColor.push(pl.color.b*pl.color.a);
      pLightRadius.push(pl.rad);
      pLightLength++;
    }
  }
  var uniformLightData = [
    {name: "pLightLength", data: pLightLength},
    {name: "pLightPos", data: pLightPos},
    {name: "pLightColor", data: pLightColor},
    {name: "pLightRadius", data: pLightRadius}
  ];
  
  /* === Draw Geometry =================================================================================================== */
  /* ===================================================================================================================== */  
  gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo.world.fb);                                                      // Enable world framebuffer
  gl.viewport(0, 0, (this.window.width*this.fbo.world.upscale), (this.window.height*this.fbo.world.upscale)); // Resize viewport to window size
  gl.clearColor(0.5, 0.5, 0.5, 1.0);                                                                          // Opaque grey background
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);                                                        // Clear Color and Depth from previous draw.
  this.fbo.shadow.tex.enable(gl, 5);                                                                          // Enable shadow depth texture
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
  for(var i=0;i<geomSorted.length;i++) {
    var shaderGroup = geomSorted[i];
    shaderGroup.shader.enable(gl);
    shaderGroup.shader.applyUniforms(gl, uniformData);
    shaderGroup.shader.applyUniforms(gl, uniformLightData); /* @FIXME Check if nesscary? */
    for(var j=0;j<shaderGroup.materials.length;j++) {
      var materialGroup = shaderGroup.materials[j];
      materialGroup.material.enable(gl);
      for(var k=0;k<materialGroup.draws.length;k++) {
        var draw = materialGroup.draws[k];
        draw.model.draw(gl, shaderGroup.shader, draw.pos, draw.rot, this.camera);
      }
      materialGroup.material.disable(gl);
    }
    shaderGroup.shader.disable(gl);
  }
  this.fbo.shadow.tex.disable(gl, 5);       // Disable shadow depth texture
  gl.bindFramebuffer(gl.FRAMEBUFFER, null); // Disable world framebuffer
    
  /* === Draw UI ========================================================================================================= */
  /* ===================================================================================================================== */
  var blocks = [];
  var texts = [];
  this.game.ui.getDraw(blocks, texts, this.game.input.mouse.pos, {x: this.window.width, y: this.window.height}); //Get all UI elements to draw
  
  gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo.ui.fb);                                                   // Enable menu framebuffer
  gl.viewport(0, 0, (this.window.width*this.fbo.ui.upscale), (this.window.height*this.fbo.ui.upscale)); // Resize to canvas
  gl.clearColor(0.0, 0.0, 0.0, 0.0);                                                                    // Transparent Black Background
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);                                                  // Clear Color and Depth from previous draw.
  gl.depthMask(false);                                                                                  // Disable depth write for UI Draw
  gl.disable(gl.DEPTH_TEST);                                                                            // Disable depth testing for UI Draw
  gl.enable(gl.BLEND);                                                                                  // Enable Transparency 
  var fontMaterial = this.getMaterial("material.multi.gulm");
  var fontShader = fontMaterial.shader;
  var squareModel = this.getModel("model.multi.square");
  
  var ASPECT = this.window.height/this.window.width;
  var PROJMATRIX_DEBUG = mat4.create(); mat4.ortho(PROJMATRIX_DEBUG, 0.0, 100.0,0.0*ASPECT, 100.0*ASPECT, 0.0, 1.0);
  var VIEWMATRIX_DEBUG= mat4.create();
  var uniformDataDebug = [
    {name: "Pmatrix", data: PROJMATRIX_DEBUG},
    {name: "Vmatrix", data: VIEWMATRIX_DEBUG}
  ];
  
  for(var i=0;i<blocks.length;i++) {
    var block = blocks[i];
    block.material.shader.enable(gl);
    block.material.shader.applyUniforms(gl, uniformDataDebug);
    block.material.enable(gl);
    var uniformBlockSize = [
      {name: "transform", data: [block.pos.x, block.pos.y, -0.5]},
      {name: "size", data: [block.size.x, block.size.y]}
    ];
    block.material.shader.applyUniforms(gl, uniformBlockSize);
    squareModel.drawDirect(gl, block.material.shader);
    block.material.disable(gl);
    block.material.shader.disable(gl);
  }
  
  fontShader.enable(gl);
  fontShader.applyUniforms(gl, uniformDataDebug);
  fontMaterial.enable(gl);
  for(var j=0;j<texts.length;j++) {
    var text = texts[j];
    var characters = this.stringToIndices(text.text);
    var uniformFontSize = [
      {name: "fontSize", data: text.size}
    ];
    fontShader.applyUniforms(gl, uniformFontSize);
    for(var i=0;i<characters.length;i++) {
      var uniformDataTextIndex = [
        {name: "transform", data: [(text.size*(i*0.9))+text.pos.x, text.pos.y, -0.5]},
        {name: "index", data: characters[i]}
      ];
      fontShader.applyUniforms(gl, uniformDataTextIndex);
      squareModel.drawDirect(gl, fontShader);
    }
  }
  fontShader.disable(gl);
  fontMaterial.disable(gl);
  gl.depthMask(true);                       // Reenable depth write after UI draw
  gl.enable(gl.DEPTH_TEST);                 // Reenable after UI Draw
  gl.disable(gl.BLEND);                     // Disable transparency
  gl.bindFramebuffer(gl.FRAMEBUFFER, null); // Disable menu framebuffer
  
  /* === Render to screen ================================================================================================ */
  /* ===================================================================================================================== */
  gl.viewport(0, 0, this.window.width, this.window.height); // Resize to canvas
  gl.clearColor(0.5, 0.5, 0.5, 1.0);                        // Opaque grey backdrop
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);      // Clear Color and Depth from previous draw.
  gl.depthMask(false);                                      // Disable depth write for post Draw
  gl.disable(gl.DEPTH_TEST);                                // Disable depth testing for post Draw
  this.fbo.world.tex.enable(gl, 6);                         // Enable world FBO render texture
  this.fbo.ui.tex.enable(gl, 7);                            // Enable ui FBO render texture
  var renderMaterial = this.getMaterial("material.multi.post_msaa");
  var renderShader = renderMaterial.shader;
  var squareModel = this.getModel("model.multi.square");
  
  var ASPECT = this.window.height/this.window.width;
  var PROJMATRIX_DEBUG = mat4.create(); mat4.ortho(PROJMATRIX_DEBUG, 0.0, 1.0, 0.0, 1.0, 0.0, 1.0);
  var VIEWMATRIX_DEBUG= mat4.create();
  var TEXTURE_PROP = [this.window.width/this.fbo.world.fb.width, this.window.height/this.fbo.world.fb.height, (this.fbo.world.fb.height-(this.window.height*this.fbo.world.upscale))/this.fbo.world.fb.height,
                      this.window.width/this.fbo.ui.fb.width, this.window.height/this.fbo.ui.fb.height, (this.fbo.ui.fb.height-(this.window.height*this.fbo.ui.upscale))/this.fbo.ui.fb.height];
  var uniformDataPost = [
    {name: "Pmatrix", data: PROJMATRIX_DEBUG},
    {name: "Vmatrix", data: VIEWMATRIX_DEBUG},
    {name: "textureProp", data: TEXTURE_PROP},
    {name: "resolution", data: [(this.window.width*this.fbo.world.upscale), (this.window.width*this.fbo.world.upscale)]},
    {name: "upscale", data: [this.fbo.world.upscale, this.fbo.ui.upscale]},
    {name: "texture6", data: 6},
    {name: "texture7", data: 7}
  ];
  
  renderShader.enable(gl);
  renderShader.applyUniforms(gl, uniformDataPost);
  renderMaterial.enable(gl);
  squareModel.drawDirect(gl, renderShader);
  renderShader.disable(gl);
  renderMaterial.disable(gl);
  gl.depthMask(true);                 // Reenable depth write after post draw
  gl.enable(gl.DEPTH_TEST);           // Reenable depth testing after post draw
  this.fbo.world.tex.disable(gl, 6);  // Disable world FBO render texture
  this.fbo.ui.tex.disable(gl, 7);     // Disable ui FBO render texture
  
  /* DEBUG DRAW */ //I DOUBT ANY OF THIS STILL WORKS !!! <-----------------------
//  var debugTexture = {glTexture: this.fbo.shadow.tex, enable: Texture.prototype.enable, disable: Texture.prototype.disable}; /* Hackyyyy */
//  var debugShader = this.getShader("debug");
//  var debugMaterial = new Material("!DEBUG", debugShader, {texture0: debugTexture}); /* Even hackier */
//  var debugModel = this.getModel("model.multi.square");
//  
//  var ASPECT = this.window.height/this.window.width;
//  var PROJMATRIX_DEBUG = mat4.create(); mat4.ortho(PROJMATRIX_DEBUG, -1.0, 1.0,-1.0*ASPECT, 1.0*ASPECT, 0.0, 1.0);
//  var VIEWMATRIX_DEBUG= mat4.create();
//  var uniformDataDebug = [
//    {name: "Pmatrix", data: PROJMATRIX_DEBUG},
//    {name: "Vmatrix", data: VIEWMATRIX_DEBUG}
//  ];
//  
//  debugShader.enable(gl);
//  debugShader.applyUniforms(gl, uniformDataDebug);
//  debugMaterial.enable(gl);
//  debugModel.draw(gl, debugShader, {x: 0.5, y: 0, z: -0.5}, {x: 0, y: 0, z: 0, w: 0}, {pos: {x: 0, y: 0, z: 0}});
//  debugMaterial.disable(gl);
//  debugShader.disable(gl);

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

Display.prototype.unproject = function(cursor) {
  var PROJMATRIX = mat4.create(); mat4.perspective(PROJMATRIX, 0.785398, this.window.width/this.window.height, 1.0, 64.0); // Perspective
  var TRANSLATE  = vec3.create(); vec3.set(TRANSLATE, 0.0, 0.0, 0.0);
  var MOVEMATRIX = mat4.create(); mat4.translate(MOVEMATRIX, MOVEMATRIX, TRANSLATE);
  var VIEWMATRIX = mat4.create();
  
  var MV = mat4.create(); mat4.multiply(MV, VIEWMATRIX, MOVEMATRIX);
  var MVP = mat4.create(); mat4.multiply(MVP, PROJMATRIX, MV);
  mat4.invert(MVP, MVP);

  // from this line we see zNear and zFar
  // this.perspectiveMatrix.perspective(30, canvas.clientWidth / canvas.clientHeight, 1, 10000);
  var zNear = 1.0;
  var zFar  = 64.0;

  // var coord = new J3DIVector3(0.7, 0.5, 1)
  // I'm going to assume since you put 1 for z you wanted zFar
  var wx = (cursor.x/this.window.width*2)-1;
  var wy = (cursor.y/this.window.height*-2)+1;
  
  var x = wx * zNear;
  var y = wy * zNear;
  var z = zFar;
  var w = zNear;
  
  var upm = [
    x * MVP[0] + y * MVP[4] + z * MVP[8] + w * MVP[12], 
    x * MVP[1] + y * MVP[5] + z * MVP[9] + w * MVP[13],
    x * MVP[2] + y * MVP[6] + z * MVP[10] + w * MVP[14],
    x * MVP[3] + y * MVP[7] + z * MVP[11] + w * MVP[15],
  ];
  
  return {x: (upm[0]*10.0)-this.camera.pos.x, y: (upm[1]*10.0)-this.camera.pos.y, z: (upm[2]*10.0)-this.camera.pos.z}; /* @FIXME only works on straight down projection */
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
  this.models = [];
  this.materials = [];
  this.shaders = [];
  this.textures = [];
  var deleteFBO = function(fbo) {
    gl.deleteFramebuffer(fbo.fb);
    gl.deleteRenderbuffer(fbo.rb);
    gl.deleteTexture(fbo.tex);
  };
  deleteFBO(this.fbo.shadow);
  deleteFBO(this.fbo.world);
  deleteFBO(this.fbo.ui);
  this.fbo = {};
  this.window.width = 1; this.window.height = 1;
  this.gl = null;
};