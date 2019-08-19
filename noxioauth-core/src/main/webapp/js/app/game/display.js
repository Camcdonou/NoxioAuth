"use strict";
/* global main */
/* global util */
/* global mat4 */
/* global vec3 */

/* Define Game Rendering Class */
function Display(game) {
  this.game = game;                       // We will need to constantly get data from the game instance so we pass it through
  this.container = this.game.container;   // DOM element containing the canvas
  this.window = this.game.window;         // The canvas we are going to render to
  
  this.frame = 0;                         // Used by some shaders as a uniform to animate things @TODO: link to this.game.frame counter instead
  this.camera = new Camera();
  
  if(!this.initWebGL()) { main.menu.error.showError("WebGL Error", "Your browser does not appear to support WebGL."); main.net.close(); }
};

Display.prototype.initFallback = function() {
  /* Reset Canvas */
  this.gl = undefined;
  this.container.innerHTML = "<!-- Fallback Mode --><canvas id='canvas' width='320' height='240'>Your browser doesn't appear to support the <code>&lt;canvas&gt;</code> element.</canvas>";
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
  gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);       // Transparency function

  gl.clearColor(0.0, 0.0, 0.0, 1.0);                        // Set clear color to black, fully opaque
  gl.clearDepth(1.0);                                       // Clear depth
  
  if(!(
    gl.getExtension("OES_element_index_uint") ||
    gl.getExtension("MOZ_OES_element_index_uint") ||
    gl.getExtension("WEBKIT_OES_element_index_uint")
  )) { return false; }
  
  if(!gl.getExtension('OES_standard_derivatives')) { return false; }

  this.shadow = {size: main.settings.graphics.shadowSize};
  this.upscale = {sky: main.settings.graphics.upSky, world: main.settings.graphics.upGame, ui: main.settings.graphics.upUi};
  
  this.textures = [];
  this.cubes = [];
  this.shaders = [];
  this.materials = [];
  this.models = [];
  this.fbo = {};
  
  var maxUniform = gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS);
  if(maxUniform < 64) { main.menu.error.showError("GLSL returned MAX_VERTEX_UNIFORM_VECTORS as : " + maxUniform); return false; }
  this.PL_UNIFORM_MAX = maxUniform * 0.33; this.LL_UNIFORM_MAX = maxUniform * 0.33;
  console.log("##DEBUG GLSL UNIFORM MAX: " + maxUniform); /* @DEBUG */
  
  if(!this.createTexture("multi/default")) { return false; }
  if(!this.createCube(["multi/cube0","multi/cube1","multi/cube2","multi/cube3","multi/cube4","multi/cube5"])) { return false; }
  
  if(!this.createMaterial(this.game.asset.material.multi.default)) { return false; }
  if(!this.createMaterial(this.game.asset.material.multi.shadow)) { return false; }
  if(!this.createMaterial(this.game.asset.material.multi.shadowmask)) { return false; }
  if(!this.createMaterial(this.game.asset.material.multi.post_msaa)) { return false; }
  if(!this.createMaterial(this.game.asset.material.ui.calibri)) { return false; }
  
  if(!this.createModel(this.game.asset.model.multi.box)) { return false; }
  if(!this.createModel(this.game.asset.model.multi.sheet)) { return false; }
  
  if(!this.createShadowFramebuffer("shadow", this.shadow.size)) { return false; }
  if(!this.createFramebuffer("sky", this.upscale.sky)) { return false; }
  if(!this.createFramebuffer("world", this.upscale.world)) { return false; }
  if(!this.createFramebuffer("ui", this.upscale.ui)) { return false; }
  
  /* debug @TODO: */
  this.sky = new Sky(this, this.game.asset.sky.vapor);
  
  /* @TODO: @DEBUG: Used by js/app/game/ui/debug.js exclusively. */
  this.shadowDebugMat = new Material("~SHADOW_DEBUG_MATERIAL", this.getShader("simpletrans"), {texture0: this.fbo.shadow.tex}, false);
  this.materials.push(this.shadowDebugMat);
  /* ----------------------------------------------------      */
  
  return true;
};

Display.prototype.createTexture = function(path) {
  var gl = this.gl; // Sanity Save
  var glTexture = gl.createTexture();
  this.textures.push(new Texture(gl, glTexture, path));
  return true;
};

Display.prototype.createCube = function(path) {
  var gl = this.gl; // Sanity Save
  var glTexture = gl.createTexture();
  this.cubes.push(new TextureCube(gl, glTexture, path));
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
    var loc = gl.getAttribLocation(shaderProgram, source.attributes[i].name);                                      // Ditches attributes that are optimized out of shader by GLSL
    if(loc !== -1) { attributes[source.attributes[i].name] = {type: source.attributes[i].type, location: loc}; }
  }
  for(var i=0;i<source.uniforms.length;i++) {
    var loc = gl.getUniformLocation(shaderProgram, source.uniforms[i].name);                                       // Same thing for uniforms
    if(loc !== -1) { uniforms[source.uniforms[i].name] = {type: source.uniforms[i].type, location: loc}; }
  }
  
  this.shaders.push(new Shader(source.name, shaderProgram, attributes, uniforms));
  
  // Delete vert and frag as they are no longer needed after shader program is linked.
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);
  
  return true;
};

/* Returns boolean. If returns false then failed to create material. If returns true then material was created and added to materials array. */
Display.prototype.createMaterial = function(source) {
  var shader = this.getShader(source.shader);
  var texture = {};
  var cube;
  if(source.texture0) { texture.texture0 = this.getTexture(source.texture0); }
  if(source.texture1) { texture.texture1 = this.getTexture(source.texture1); }
  if(source.texture2) { texture.texture2 = this.getTexture(source.texture2); }
  if(source.texture3) { texture.texture3 = this.getTexture(source.texture3); }
  if(source.texture4) { texture.texture4 = this.getTexture(source.texture4); }
  if(source.cube) { cube = this.getCube(source.cube); }
  
  this.materials.push(new Material(source.name, shader, texture, cube, source.shadow));
  
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
  
  var fb = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
  fb.width = 512;
  fb.height = 512;
  
  var tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, fb.width, fb.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);  // No mipmaps generated on FBOs
  
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

Display.prototype.draw = function() {
  /* Update Canvas Size & Camera */
  if(this.container.clientWidth < 1 || this.container.clientHeight < 1) { return; } // Draw window not visible. Don't draw.
  this.window.width = this.container.clientWidth;                                   // Does not enforce aspect ratio so it can be made ultra widescreen if desired.
  this.window.height = this.container.clientHeight;
  
  /* Check WebGL is OKAY */
  var gl = this.gl; // Sanity Save
  this.frame++;
  
  /* Update Framebuffers */
  this.updateFramebuffer("world");
  this.updateFramebuffer("ui");
  this.updateFramebuffer("sky");
  
  /* Generate all matrices for the render */
  var PROJMATRIX = mat4.create(); mat4.perspective(PROJMATRIX, this.camera.fov, this.window.width/this.window.height, this.camera.near, this.camera.far); // Perspective
  var MOVEMATRIX = mat4.create();
    mat4.translate(MOVEMATRIX, MOVEMATRIX, [0.0, 0.0, -this.camera.zoom]);
    mat4.rotate(MOVEMATRIX, MOVEMATRIX, this.camera.rot.x, [1.0, 0.0, 0.0]);
    mat4.rotate(MOVEMATRIX, MOVEMATRIX, this.camera.rot.y, [0.0, 1.0, 0.0]);
    mat4.rotate(MOVEMATRIX, MOVEMATRIX, this.camera.rot.z, [0.0, 0.0, 1.0]);
    mat4.translate(MOVEMATRIX, MOVEMATRIX, [this.camera.pos.x, this.camera.pos.y, this.camera.pos.z]);
  var VIEWMATRIX = mat4.create();
  var DEROTATEMATRIX = mat4.create();
    mat4.rotate(DEROTATEMATRIX, DEROTATEMATRIX, this.camera.rot.x, [1.0, 0.0, 0.0]);
    mat4.rotate(DEROTATEMATRIX, DEROTATEMATRIX, this.camera.rot.y, [0.0, 1.0, 0.0]);
    mat4.rotate(DEROTATEMATRIX, DEROTATEMATRIX, this.camera.rot.z, [0.0, 0.0, 1.0]);
  var eye = this.camera.getEye();
  var EYEPOS = util.vec3.toArray(eye.pos);
  var EYEDIR = util.vec3.toArray(eye.dir);

  // We basically place the center of the shadow proj on the ground of the map and put the near clip behind us. Allows for easier centering.
  var SHADOW_MAX_RADIUS = 12.0;                       // After this point everything is shadow. Prevents cheating via hacking camera around. (also a const in shaders, so change there as well if you change here)
  var sbnd = SHADOW_MAX_RADIUS+1.0;
  var sclip = (SHADOW_MAX_RADIUS+1.0)*2.0;
  var PROJMATRIX_SHADOW = mat4.create(); mat4.ortho(PROJMATRIX_SHADOW, -sbnd, sbnd,-sbnd, sbnd, -sclip, sclip); /* @FIXME HARDCODED SIZE! NEEDS TO RESIZE TO VIEW FRUSTRUM */
  var SMSIZE=1; /* @FIXME my understanding is that you have to do this calculation against the PROJ * LIGHT * TRANSFORM matrix. */
  var OFFSET = vec3.create(); /* @FIXME we can probably ditch this since all it does is offset the camera position which we ditched from the draw call. */
    vec3.set(
      OFFSET,
      (Math.floor(this.camera.pos.x*SMSIZE)-(this.camera.pos.x*SMSIZE))/SMSIZE,
      (Math.floor(this.camera.pos.y*SMSIZE)-(this.camera.pos.y*SMSIZE))/SMSIZE,
      ((Math.floor(this.camera.pos.z*SMSIZE)-(this.camera.pos.z*SMSIZE))/SMSIZE)
    );
  var OFFSETMATRIX = mat4.create(); mat4.translate(OFFSETMATRIX, OFFSETMATRIX, OFFSET);
  var LIGHTMATRIX = mat4.create();
    mat4.translate(LIGHTMATRIX, LIGHTMATRIX, [0.0, 0.0, 1.0]);
    mat4.rotate(LIGHTMATRIX, LIGHTMATRIX, -0.5, [1.0, 0.0, 0.0]);
    mat4.rotate(LIGHTMATRIX, LIGHTMATRIX, 0.35, [0.0, 1.0, 0.0]);
    mat4.translate(LIGHTMATRIX, LIGHTMATRIX, [this.camera.pos.x, this.camera.pos.y, 0.0]);
  var LIGHTDIR = vec3.create(); vec3.set(LIGHTDIR, LIGHTMATRIX[8], LIGHTMATRIX[9], -LIGHTMATRIX[10]);
  
  /* Collect & sort all geometry/decals/lights to draw.
     Geometry Format: {model: <Model>, material: <Material>, uniforms: <UniformData[]>} */
  var bounds = this.camera.getBounds(this.window.height/this.window.width); // An array of 4 vec2s that defines the view area on the z=0 plane
  var geometry = [];                                                        // All geometry combined
  var mapGeom = [];                                                         // All static game world geometry we need to draw
  var objGeom = [];                                                         // All object geometry
  var decals = [];                                                          // All decals to apply to world
  var lights = [];                                                          // All lights in game world
  
  var preCalcBounds = util.matrix.expandPolygon(bounds, 4.0);               // Slightly innacurate way to precalc radius of tiles so we can just test a point
  this.game.map.getDraw(mapGeom, preCalcBounds);
  for(var i=0;i<this.game.objects.length;i++) {
    if(!this.game.objects[i].hide) { this.game.objects[i].getDraw(objGeom, decals, lights, bounds); }
  }
  for(var i=0;i<this.game.effects.length;i++) {
    var exbounds = util.matrix.expandPolygon(bounds, 1.0);  /* @TODO: fixed bounding radius for effects... */
    if(util.intersection.pointPoly(this.game.effects[i].pos, exbounds)) {
      this.game.effects[i].getDraw(objGeom, decals, lights, bounds);
    }
  }
  geometry = mapGeom.concat(objGeom);
  
  /* Sort geometry by shader -> material -> draws */
  var mapGeomSorted = this.sortGeometry(mapGeom);
  var objGeomSorted = this.sortGeometry(objGeom);
  
  /* === Draw Geometry to Shadow FBO ===================================================================================== */
  /* ===================================================================================================================== */
  gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo.shadow.fb);                     // Enable shadow framebuffer
  gl.viewport(0.0, 0.0, this.fbo.shadow.fb.width, this.fbo.shadow.fb.height); // Resize viewport to FBO texture
  gl.clearColor(1.0, 0.0, 0.0, 1.0);                                          // red -> Z=Zfar on the shadow map
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
  
  /* Setup & draw shadows for materials that cast full opaque shadows. */
  var shadowMaterial = this.getMaterial("multi.shadow");
  var shadowUniformData = [
    {name: "Pmatrix", data: PROJMATRIX_SHADOW},
    {name: "Lmatrix", data: LIGHTMATRIX},
    {name: "Omatrix", data: OFFSETMATRIX}
  ];
  
  shadowMaterial.shader.enable(gl);
  shadowMaterial.shader.applyUniforms(gl, shadowUniformData);
  shadowMaterial.enable(gl);
  for(var i=0;i<geometry.length;i++) {
    if(geometry[i].material.castShadow === 1) {
      shadowMaterial.shader.applyUniforms(gl, geometry[i].uniforms);
      geometry[i].model.draw(gl, shadowMaterial.shader);
    }
  }
  shadowMaterial.disable(gl);
  shadowMaterial.shader.disable(gl);
  
  /* Setup & draw shadows for materials that cast masked shadows. */
  var shadowMaskMaterial = this.getMaterial("multi.shadowmask");
  var shadowMaskUniformData = [
    {name: "Pmatrix", data: PROJMATRIX_SHADOW},
    {name: "Lmatrix", data: LIGHTMATRIX},
    {name: "Omatrix", data: OFFSETMATRIX},
    {name: "texture0", data: 0}
  ];
  
  shadowMaskMaterial.shader.enable(gl);
  shadowMaskMaterial.shader.applyUniforms(gl, shadowMaskUniformData);
  shadowMaskMaterial.enable(gl);
  for(var i=0;i<geometry.length;i++) {
    if(geometry[i].material.castShadow === 2) {
      if(geometry[i].material.texture.texture0) { geometry[i].material.texture.texture0.enable(gl, 0); }
      else { main.menu.warning.show("Material '" + geometry[i].material.name + "' was flagged for masked shadows but lacks a texture0 for masking."); }
      shadowMaskMaterial.shader.applyUniforms(gl, geometry[i].uniforms);
      geometry[i].model.draw(gl, shadowMaskMaterial.shader);
      if(geometry[i].material.texture.texture0) { geometry[i].material.texture.texture0.disable(gl, 0); }
    }
  }
  shadowMaskMaterial.disable(gl);
  shadowMaskMaterial.shader.disable(gl);
  
  gl.bindFramebuffer(gl.FRAMEBUFFER, null); //Disable frame buffer

  /* === Compile Dynamic Lighting Information ============================================================================ */
  /* ===================================================================================================================== */
  /* @TODO: Line Lights are not implemented! */
  var pLightLength = 0;
  var pLightPos = [];
  var pLightColor = [];
  var pLightRadius = [];
  for(var i=0;i<lights.length;i++) {
    if(i*8 >= this.PL_UNIFORM_MAX) { main.menu.warning.show("@LIGHT -> GL_UNIFORM capacity maxed: " + this.PL_UNIFORM_MAX); break; }
    else {
      var pl = lights[i];
      pLightPos.push(pl.pos.x); pLightPos.push(pl.pos.y); pLightPos.push(pl.pos.z);
      pLightColor.push(pl.color.x*pl.color.w); pLightColor.push(pl.color.y*pl.color.w); pLightColor.push(pl.color.z*pl.color.w);
      pLightRadius.push(pl.rad);
      pLightLength++;
    }
  }
  if(pLightLength <= 0) {                   // To avoid empty uniform array we use this default blank light.
    pLightLength = 0;
    pLightPos = [0.0, 0.0, 0.0];
    pLightColor = [0.0, 0.0, 0.0];
    pLightRadius = [0.0];
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
  gl.clearColor(0.0, 0.0, 0.0, 0.0);                                                                          // Clear black backdrop
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);                                                        // Clear Color and Depth from previous draw.
  gl.enable(gl.BLEND);                                                                                        // Enable Transparency 
  this.fbo.shadow.tex.enable(gl, 5);                                                                          // Enable shadow depth texture
  var uniformData = [
    {name: "Pmatrix", data: PROJMATRIX},
    {name: "Vmatrix", data: VIEWMATRIX},
    {name: "Mmatrix", data: MOVEMATRIX},
    {name: "Dmatrix", data: DEROTATEMATRIX},
    {name: "Lmatrix", data: LIGHTMATRIX},
    {name: "PmatrixLight", data: PROJMATRIX_SHADOW},
    {name: "Omatrix", data: OFFSETMATRIX},
    {name: "cameraCenter", data: [-this.camera.pos.x, -this.camera.pos.y]},
    {name: "eyeCenter", data: EYEPOS},
    {name: "eyeDirection", data: EYEDIR},
    {name: "aLightDirection", data: LIGHTDIR},
    {name: "shadowTextureSize", data: this.fbo.shadow.fb.width},
    {name: "frame", data: this.frame},
    {name: "texture5", data: 5}
  ];
  for(var i=0;i<mapGeomSorted.length;i++) {                                       // Draws world
    var shaderGroup = mapGeomSorted[i];
    shaderGroup.shader.enable(gl);
    shaderGroup.shader.applyUniforms(gl, uniformData);
    shaderGroup.shader.applyUniforms(gl, uniformLightData);
    for(var j=0;j<shaderGroup.materials.length;j++) {
      var materialGroup = shaderGroup.materials[j];
      materialGroup.material.enable(gl);
      gl.depthMask(materialGroup.material.castShadow  !== 0);
      for(var k=0;k<materialGroup.draws.length;k++) {
        var draw = materialGroup.draws[k];
        shaderGroup.shader.applyUniforms(gl, draw.uniforms);
        draw.model.draw(gl, shaderGroup.shader);
      }
      materialGroup.material.disable(gl);
    }
    shaderGroup.shader.disable(gl);
  }
  for(var i=0;i<decals.length;i++) {                                              // Draws decals
    var decal = decals[i];
    var uniformDecal = [
      {name: "dPos", data: [decal.pos.x, decal.pos.y, decal.pos.z]},
      {name: "dNormal", data: [decal.normal.x, decal.normal.y, decal.normal.z]},
      {name: "dSize", data: decal.size},
      {name: "dAngle", data: decal.angle},
      {name: "color", data: util.vec4.toArray(decal.color)}
    ];
    decal.material.shader.enable(gl);
    decal.material.enable(gl);
    decal.material.shader.applyUniforms(gl, uniformData);
    decal.material.shader.applyUniforms(gl, uniformLightData);
    decal.material.shader.applyUniforms(gl, uniformDecal);
    gl.depthMask(decal.material.castShadow !== 0);
    for(var j=0;j<decal.geometry.length;j++) {
      decal.material.shader.applyUniforms(gl, decal.geometry[j].uniforms);
      decal.geometry[j].model.draw(gl, decal.material.shader);
    }
    decal.material.disable(gl);
    decal.material.shader.disable(gl);
  }
  for(var i=0;i<objGeomSorted.length;i++) {                                       // Draws objects/effects
    var shaderGroup = objGeomSorted[i];
    shaderGroup.shader.enable(gl);
    shaderGroup.shader.applyUniforms(gl, uniformData);
    shaderGroup.shader.applyUniforms(gl, uniformLightData);
    for(var j=0;j<shaderGroup.materials.length;j++) {
      var materialGroup = shaderGroup.materials[j];
      materialGroup.material.enable(gl);
      gl.depthMask(materialGroup.material.castShadow === 1);
      for(var k=0;k<materialGroup.draws.length;k++) {
        var draw = materialGroup.draws[k];
        shaderGroup.shader.applyUniforms(gl, draw.uniforms);
        draw.model.draw(gl, shaderGroup.shader);
      }
      materialGroup.material.disable(gl);
    }
    shaderGroup.shader.disable(gl);
  }
  this.fbo.shadow.tex.disable(gl, 5);       // Disable shadow depth texture
  gl.depthMask(true);                       // Enable writing to depth buffer
  gl.bindFramebuffer(gl.FRAMEBUFFER, null); // Disable world framebuffer
  gl.disable(gl.BLEND);                     // Disable Transparency 
  
  /* === Draw Sky ======================================================================================================== */
  /* ===================================================================================================================== */
  gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo.sky.fb);                                                    // Enable Sky framebuffer
  gl.viewport(0, 0, (this.window.width*this.fbo.sky.upscale), (this.window.height*this.fbo.sky.upscale)); // Resize to canvas
  gl.clearColor(0.0, 0.0, 0.0, 1.0);                                                                      // Transparent Black Background
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);                                                    // Clear Color and Depth from previous draw.
  gl.depthMask(true);                                                                                     // Enables depth buffer
  gl.enable(gl.DEPTH_TEST);                                                                               // Enable depth test
  gl.enable(gl.BLEND);                                                                                    // Enable Transparency 
  
  var SKYPROJMATRIX = mat4.create(); mat4.perspective(SKYPROJMATRIX, this.camera.fov, this.window.width/this.window.height, 8, 256); // Perspective
  var SKYMOVEMATRIX = mat4.create();
    mat4.translate(SKYMOVEMATRIX, SKYMOVEMATRIX, [0.0, 0.0, -this.camera.zoom]);
    mat4.rotate(SKYMOVEMATRIX, SKYMOVEMATRIX, this.camera.rot.x, [1.0, 0.0, 0.0]);
    mat4.rotate(SKYMOVEMATRIX, SKYMOVEMATRIX, this.camera.rot.y, [0.0, 1.0, 0.0]);
    mat4.rotate(SKYMOVEMATRIX, SKYMOVEMATRIX, this.camera.rot.z, [0.0, 0.0, 1.0]);
    mat4.translate(SKYMOVEMATRIX, SKYMOVEMATRIX, [0, 0, 0]);
  var SKYVIEWMATRIX = mat4.create();

  var uniformDataSky = [
    {name: "Pmatrix", data: SKYPROJMATRIX},
    {name: "Vmatrix", data: SKYVIEWMATRIX},
    {name: "Mmatrix", data: SKYMOVEMATRIX},
    {name: "color", data: [0.0, 0.0, 1.0]},
    {name: "frame", data: this.frame}
  ];
  
  var skyGeom = [];
  this.sky.getDraw(skyGeom);
  
  for(var i=0;i<skyGeom.length;i++) {
    gl.clear(gl.DEPTH_BUFFER_BIT);                          // Clears depth buffer between each layer of sky
    skyGeom[i].material.shader.enable(gl);
    skyGeom[i].material.enable(gl);
    skyGeom[i].material.shader.applyUniforms(gl, skyGeom[i].uniforms);
    skyGeom[i].material.shader.applyUniforms(gl, uniformDataSky);
    skyGeom[i].model.draw(gl, skyGeom[i].material.shader);
    skyGeom[i].material.shader.disable(gl);
    skyGeom[i].material.disable(gl);
  }

  gl.disable(gl.BLEND);                     // Disable transparency
  gl.bindFramebuffer(gl.FRAMEBUFFER, null); // Disable Sky framebuffer
    
  /* === Draw UI ========================================================================================================= */
  /* ===================================================================================================================== */
  var blocks = [];
  var texts = [];
  this.game.ui.getDraw(blocks, texts, util.vec2.make(this.window.width, this.window.height));           // Collect all UI elements to draw
  
  gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo.ui.fb);                                                   // Enable menu framebuffer
  gl.viewport(0, 0, (this.window.width*this.fbo.ui.upscale), (this.window.height*this.fbo.ui.upscale)); // Resize to canvas
  gl.clearColor(0.0, 0.0, 0.0, 0.0);                                                                    // Transparent Black Background
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);                                                  // Clear Color and Depth from previous draw.
  gl.depthMask(false);                                                                                  // Disable depth write for UI Draw
  gl.disable(gl.DEPTH_TEST);                                                                            // Disable depth testing for UI Draw
  gl.enable(gl.BLEND);                                                                                  // Enable Transparency 
  var sheetModel = this.getModel("multi.sheet");
  
  var PROJMATRIX_UI = mat4.create(); mat4.ortho(PROJMATRIX_UI, 0.0, this.window.width, 0.0, this.window.height, 0.0, 1.0);
  var VIEWMATRIX_UI= mat4.create();
  var uniformDataUi = [
    {name: "Pmatrix", data: PROJMATRIX_UI},
    {name: "Vmatrix", data: VIEWMATRIX_UI}
  ];
  
  for(var i=0;i<blocks.length;i++) {
    var block = blocks[i];
    block.material.shader.enable(gl);
    block.material.shader.applyUniforms(gl, uniformDataUi);
    block.material.enable(gl);
    
    block.material.shader.applyUniforms(gl, block.uniforms);
    sheetModel.draw(gl, block.material.shader);
    block.material.disable(gl);
    block.material.shader.disable(gl);
  }
  
  for(var j=0;j<texts.length;j++) {
    var text = texts[j];
    text.material.shader.enable(gl);
    text.material.shader.applyUniforms(gl, uniformDataUi);
    text.material.enable(gl);
    text.material.shader.applyUniforms(gl, text.uniforms);
    var fontDat = util.font.getFontData(text.font);
    var adv = 0;
    for(var i=0;i<text.text.length;i++) {
      var charDat = util.font.getCharacterData(text.font, text.text[i]);
      var offset = util.vec2.make((-charDat.originX/fontDat.size)*text.size, (-(charDat.height-charDat.originY)/fontDat.size)*text.size);
      var transform = util.vec2.add(text.pos, util.vec2.add(offset, util.vec2.make(adv, 0.0)));
      var size = util.vec2.scale(util.vec2.make(charDat.width/fontDat.size, charDat.height/fontDat.size), text.size);
      var uv = util.vec2.make(charDat.x/fontDat.width, charDat.y/fontDat.height);
      var st = util.vec2.make(charDat.width/fontDat.width, charDat.height/fontDat.height);
      var uniformDataTextIndex = [
        {name: "transform", data: util.vec2.toArray(transform)},
        {name: "size", data: util.vec2.toArray(size)},
        {name: "fUV", data: util.vec2.toArray(uv)},
        {name: "fST", data: util.vec2.toArray(st)}
      ];
      text.material.shader.applyUniforms(gl, uniformDataTextIndex);
      sheetModel.draw(gl, text.material.shader);
      adv += (charDat.advance/fontDat.size)*text.size;
    }
    text.material.shader.disable(gl);
    text.material.disable(gl);
  }
  
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
  this.fbo.sky.tex.enable(gl, 8);                            // Enable sky FBO render texture
  var renderMaterial = this.getMaterial("multi.post_msaa");
  var renderShader = renderMaterial.shader;
  var sheetModel = this.getModel("multi.sheet");
  
  var ASPECT = this.window.height/this.window.width;
  var PROJMATRIX_POST = mat4.create(); mat4.ortho(PROJMATRIX_POST, 0.0, 1.0, 0.0, 1.0, 0.0, 1.0);
  var VIEWMATRIX_POST = mat4.create();
  var TEXTURE_PROP = [this.window.width/this.fbo.world.fb.width, this.window.height/this.fbo.world.fb.height, (this.fbo.world.fb.height-(this.window.height*this.fbo.world.upscale))/this.fbo.world.fb.height,
                      this.window.width/this.fbo.ui.fb.width, this.window.height/this.fbo.ui.fb.height, (this.fbo.ui.fb.height-(this.window.height*this.fbo.ui.upscale))/this.fbo.ui.fb.height,
                      this.window.width/this.fbo.sky.fb.width, this.window.height/this.fbo.sky.fb.height, (this.fbo.sky.fb.height-(this.window.height*this.fbo.sky.upscale))/this.fbo.sky.fb.height];
  var uniformDataPost = [
    {name: "Pmatrix", data: PROJMATRIX_POST},
    {name: "Vmatrix", data: VIEWMATRIX_POST},
    {name: "textureProp", data: TEXTURE_PROP},
    {name: "resolution", data: [(this.window.width*this.fbo.world.upscale), (this.window.width*this.fbo.world.upscale)]},
    {name: "upscale", data: [this.fbo.world.upscale, this.fbo.ui.upscale, this.fbo.sky.upscale]},
    {name: "texture6", data: 6},
    {name: "texture7", data: 7},
    {name: "texture8", data: 8}
  ];
  
  renderShader.enable(gl);
  renderShader.applyUniforms(gl, uniformDataPost);
  renderMaterial.enable(gl);
  sheetModel.draw(gl, renderShader);
  renderShader.disable(gl);
  renderMaterial.disable(gl);
  gl.depthMask(true);                 // Reenable depth write after post draw
  gl.enable(gl.DEPTH_TEST);           // Reenable depth testing after post draw
  this.fbo.world.tex.disable(gl, 6);  // Disable world FBO render texture
  this.fbo.ui.tex.disable(gl, 7);     // Disable ui FBO render texture
  this.fbo.sky.tex.enable(gl, 8);     // Disable sky FBO render texture 
  
  gl.flush();
};

Display.prototype.sortGeometry = function(geometry) {
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
    materialGroup.draws.push({model: geom.model, uniforms: geom.uniforms});
  }
  for(var i=0,j=0;j<geomSorted.length;i++,j++) {
    if(geomSorted[i].materials[0].material.castShadow === 0) {
      var spl = geomSorted.splice(i, 1)[0];
      geomSorted.push(spl);
      i--;
    }
  }
  return geomSorted;
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
  return this.getTexture("multi/default");
};

/* Returns a cube by path. If cube is not found then returns default. */
Display.prototype.getCube = function(path) {
  for(var i=0;i<this.cubes.length;i++) {
    if(this.cubes[i].path === path[0]) {
      return this.cubes[i];
    }
  }
  
  if(this.createCube(path)) { return this.getCube(path); }
  
  main.menu.warning.show("Failed to load cubemap: '" + path[0] + "'");
  return this.getCube("multi/cube0");
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
  var src = this.game.asset.material;
  for(var i=0;i<spl.length&&src!==undefined;i++) {
    src = src[spl[i]];
  }
  if(src !== undefined) { if(this.createMaterial(src)) { return this.getMaterial(name); } }
  
  main.menu.warning.show("Failed to load material: '" + name + "'");
  return this.getMaterial("multi.default");
};

/* Returns a model by name. If it is not loaded then it attempts to load it. If model is not found then returns default. */
Display.prototype.getModel = function(name) {
  for(var i=0;i<this.models.length;i++) {
    if(this.models[i].name === name) {
      return this.models[i];
    }
  }
  
  var spl = name.split(".");
  var src = this.game.asset.model;
  for(var i=0;i<spl.length&&src!==undefined;i++) {
    src = src[spl[i]];
  }
  if(src !== undefined) { if(this.createModel(src)) { return this.getModel(name); } }
  
  main.menu.warning.show("Failed to load model: '" + name + "'");
  return this.getModel("multi.box");
};

/* Called when graphics settings are changed and we need to adjust to the new settings. */
Display.prototype.settingsChanged = function() {
  if(!this.gl) { return; }
  var gl = this.gl; // Sanity Save
  
  this.fbo.world.upscale = main.settings.graphics.upGame;
  this.fbo.ui.upscale = main.settings.graphics.upUi;
  this.fbo.sky.upscale = main.settings.graphics.upSky;
  if(main.settings.graphics.shadowSize !== this.fbo.shadow.fb.width) {
    this.shadow.size = main.settings.graphics.shadowSize;
    var deleteFBO = function(fbo) {
      gl.deleteFramebuffer(fbo.fb);
      gl.deleteRenderbuffer(fbo.rb);
      gl.deleteTexture(fbo.tex.glTexture);
    };
    deleteFBO(this.fbo.shadow);
    this.createShadowFramebuffer("shadow", this.shadow.size);
    this.shadowDebugMat.texture = {texture0: this.fbo.shadow.tex};
  }
};

Display.prototype.destroy = function() {
  if(!this.gl) { return; }
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
    gl.deleteTexture(fbo.tex.glTexture);
  };
  deleteFBO(this.fbo.shadow);
  deleteFBO(this.fbo.world);
  deleteFBO(this.fbo.ui);
  deleteFBO(this.fbo.sky);
  this.fbo = {};
  
  /* Clear canvas so when we load a game the last frame of the previous game dosen't show. */
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clearDepth(1.0);
  
  this.window.width = 1; this.window.height = 1;
  this.gl = null;
};