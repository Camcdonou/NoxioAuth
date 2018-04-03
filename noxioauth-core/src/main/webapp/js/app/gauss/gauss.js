"use strict";
/* global util */
/* global main */
/* global mat4 */

/* Handles HTML5 background and HW Accel benchmark and status check */
function Gauss() {
  this.element = document.getElementById("gauss");
  this.container = document.getElementById("gauss-container");
  this.window = document.getElementById("gauss-canvas");
  
  this.frame = 0;
  this.loaded = false;
  
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
};

Gauss.prototype.init = function() {
  try {
    this.gl = this.window.getContext("webgl", {antialias: false});
    if(!this.gl) { throw new Error("Browser does not appear to support WebGL") ; }
    if(!this.setupWebGL()) { throw new Error("Failed to setup WebGL."); }
  }
  catch(ex) { main.menu.warning.show("WebGL Error: \n" + "Exception while initializing WebGL: \n" + ex.message); console.error(ex.stack); }
};

/* Returns boolean. If false then WebGL failed to setup and we should setup fallback rendering. */
Gauss.prototype.setupWebGL = function() {
  var gl = this.gl; /* Sanity Save */
  this.window.width = this.container.clientWidth;                                   // Does not enforce aspect ratio so it can be made ultra widescreen if desired.
  this.window.height = this.container.clientHeight;
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
  
  this.tex = {};
  if((this.tex.sky = this.createTexture("sky")) === undefined) { return false; }
  if((this.tex.star = this.createTexture("star")) === undefined) { return false; }
  if((this.tex.cloud = this.createTexture("cloud")) === undefined) { return false; }
  if((this.tex.linea = this.createTexture("linea")) === undefined) { return false; }
  if((this.tex.lineb = this.createTexture("lineb")) === undefined) { return false; }
  if((this.tex.noise = this.createTexture("noise")) === undefined) { return false; }
  
  this.shader = {};
  if((this.shader.sky = this.createShader(this.shader_src_sky)) === undefined) { return false; }
  if((this.shader.cloud = this.createShader(this.shader_src_cloud)) === undefined) { return false; }
  if((this.shader.lines = this.createShader(this.shader_src_lines)) === undefined) { return false; }
  
  this.model = {};
  if((this.model.sheet = this.createModel(this.model_src_sheet)) === undefined) { return false; }
  
  /* ----------------------------------------------------      */
  
  return true;
};

Gauss.prototype.draw = function() {
  this.window.width = this.container.clientWidth;                                   // Does not enforce aspect ratio so it can be made ultra widescreen if desired.
  this.window.height = this.container.clientHeight;
  if(!this.loaded) { this.loading(); }
  else if(!(this.container.clientWidth < 1 || this.container.clientHeight < 1)) {        // Only draw when visible
    if(this.gl) { this.drawSpace(); }
    else { this.drawFallback(); }
  }
  
  /* Base Benchmark */
  this.nextFrame = this.requestAnimFrameFunc.call(window, function() { main.gauss.draw(); }); // Javascript 🙄
};

Gauss.prototype.loading = function() {
  if( this.gl &&
      this.tex.sky.ready &&
      this.tex.star.ready &&
      this.tex.cloud.ready &&
      this.tex.linea.ready &&
      this.tex.lineb.ready &&
      this.tex.noise.ready
    ) {
      this.loaded = true;
      var parent = this;
      setTimeout( function() {
        if(parent.frame < (29*5)) {
          parent.hide();
          main.menu.info.show(
            "Warning!",
            "Your browser failed the base performance benchmark for 20XX.</br>" +
            "This generally means that Hardware Acceleration is disabled on your browser.</br>" +
            "Please enable Hardware Acceleration and refresh the page.</br></br>" +
            "If this issue continues try switching to an officially supported browser: <i>Google Chrome</i> or <i>Mozilla Firefox</i></br></br>" +
            "This message can also sometimes be erronesouly flagged by minimizing/switching tabs.</br>"
          );
        }
      }, 5000);
    }
};

Gauss.prototype.drawSpace = function() {
  var gl = this.gl;
  this.frame++;
  
  /* === Draw Sky ======================================================================================================== */
  /* ===================================================================================================================== */
  gl.viewport(0, 0, this.window.width, this.window.height); // Resize to canvas
  gl.clearColor(0.5, 0.5, 0.5, 1.0);                                                                      // Transparent Black Background
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);                                                    // Clear Color and Depth from previous draw.
  gl.depthMask(false);                                                                                    // Disable depth write for UI Draw
  gl.disable(gl.DEPTH_TEST);                                                                              // Disable depth testing for UI Draw
  gl.enable(gl.BLEND);                                                                                    // Enable Transparency 
  
  if(this.window.height > this.window.width) {
    var ASPECT = this.window.width/this.window.height;
    var PROJMATRIX_SKY = mat4.create(); mat4.ortho(PROJMATRIX_SKY, -0.5*ASPECT, 0.5*ASPECT, -0.5, 0.5, 0.0, 1.0);
  }
  else {
    var ASPECT = this.window.height/this.window.width;
    var PROJMATRIX_SKY = mat4.create(); mat4.ortho(PROJMATRIX_SKY, -0.5, 0.5, -0.5*ASPECT, 0.5*ASPECT, 0.0, 1.0);
  }
  var VIEWMATRIX_SKY= mat4.create();
  var uniformDataSky = [
    {name: "Pmatrix", data: PROJMATRIX_SKY},
    {name: "Vmatrix", data: VIEWMATRIX_SKY},
    {name: "time", data: this.frame},
    {name: "transform", data: [0.0, 0.0, -0.5]},
    {name: "size", data: [1.0, 1.0]},
    {name: "texture0", data: 0},
    {name: "texture1", data: 1},
    {name: "texture2", data: 1}
  ];
  
  this.shader.sky.enable(gl);
  this.tex.sky.enable(gl, 0);
  this.tex.star.enable(gl, 1);
  this.shader.sky.applyUniforms(gl, uniformDataSky);
  this.model.sheet.draw(gl, this.shader.sky);
  this.tex.sky.disable(gl, 0);
  this.tex.star.disable(gl, 1);
  this.shader.sky.disable(gl);
  
  
  this.shader.cloud.enable(gl);
  this.tex.cloud.enable(gl, 0);
  this.tex.noise.enable(gl, 1);
  this.shader.cloud.applyUniforms(gl, uniformDataSky);
  this.model.sheet.draw(gl, this.shader.cloud);
  this.tex.cloud.disable(gl, 0);
  this.tex.noise.disable(gl, 1);
  this.shader.cloud.disable(gl);
  
  this.shader.lines.enable(gl);
  this.tex.linea.enable(gl, 0);
  this.tex.lineb.enable(gl, 1);
  this.tex.noise.enable(gl, 2);
  this.shader.lines.applyUniforms(gl, uniformDataSky);
  this.model.sheet.draw(gl, this.shader.lines);
  this.tex.linea.disable(gl, 0);
  this.tex.lineb.disable(gl, 1);
  this.tex.noise.disable(gl, 2);
  this.shader.lines.disable(gl);

  gl.depthMask(true);                       // Reenable depth write after UI draw
  gl.enable(gl.DEPTH_TEST);                 // Reenable after UI Draw
  gl.disable(gl.BLEND);                     // Disable transparency
};

Gauss.prototype.drawFallback = function() {
  
};

Gauss.prototype.show = function() {
  this.element.style.display = "block";
  this.nextFrame = this.requestAnimFrameFunc.call(window, function() { main.gauss.draw(); }); // Javascript 🙄
};

Gauss.prototype.hide = function() {
  this.cancelAnimFrameFunc.call(window, this.nextFrame);
  this.element.style.display = "none";
};


/* ========================================================================== */

Gauss.prototype.createTexture = function(path) {
  var gl = this.gl; // Sanity Save
  var glTexture = gl.createTexture();
  
  var tex = {
    glTexture: glTexture,
    path: path,
    ready: false,
    handleTextureLoaded: function(gl) {
      gl.bindTexture(gl.TEXTURE_2D, this.glTexture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.img);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.bindTexture(gl.TEXTURE_2D, null);
    },
    enable: function(gl, location) {
      switch(location) {
        case 0 : { gl.activeTexture(gl.TEXTURE0); break; }
        case 1 : { gl.activeTexture(gl.TEXTURE1); break; }
        case 2 : { gl.activeTexture(gl.TEXTURE2); break; }
        case 3 : { gl.activeTexture(gl.TEXTURE3); break; }
        case 4 : { gl.activeTexture(gl.TEXTURE4); break; }
        case 5 : { gl.activeTexture(gl.TEXTURE5); break; }
        case 6 : { gl.activeTexture(gl.TEXTURE6); break; }
        case 7 : { gl.activeTexture(gl.TEXTURE7); break; }
        case 8 : { gl.activeTexture(gl.TEXTURE8); break; }
        case 9 : { gl.activeTexture(gl.TEXTURE9); break; }
        default : { main.menu.warning.show("Gauss.enable() invalid texture location: " + location); return; }
      }
      gl.bindTexture(gl.TEXTURE_2D, this.glTexture);
    },
    disable: function(gl, location) {
      switch(location) {
        case 0 : { gl.activeTexture(gl.TEXTURE0); break; }
        case 1 : { gl.activeTexture(gl.TEXTURE1); break; }
        case 2 : { gl.activeTexture(gl.TEXTURE2); break; }
        case 3 : { gl.activeTexture(gl.TEXTURE3); break; }
        case 4 : { gl.activeTexture(gl.TEXTURE4); break; }
        case 5 : { gl.activeTexture(gl.TEXTURE5); break; }
        case 6 : { gl.activeTexture(gl.TEXTURE6); break; }
        case 7 : { gl.activeTexture(gl.TEXTURE7); break; }
        case 8 : { gl.activeTexture(gl.TEXTURE8); break; }
        case 9 : { gl.activeTexture(gl.TEXTURE9); break; }
        default : { main.menu.warning.show("Gauss.disable() invalid texture location: " + location); return; }
      }
      gl.bindTexture(gl.TEXTURE_2D, null);
    }
  };
  tex.img = new Image();
  tex.img.onload = function() { tex.handleTextureLoaded(gl); tex.ready = true; };
  tex.img.src = "img/gauss/" + path + ".png";
  
  return tex;
};

Gauss.prototype.compileVertexShader =  function(name, source) {
  var gl = this.gl; // Sanity Save
  var shader = gl.createShader(gl.VERTEX_SHADER); // Create shader object
  gl.shaderSource(shader, source); // Send the source to the shader object
  gl.compileShader(shader); // Compile the shader program
  
  // See if it compiled successfully
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.log("WebGL Error\n " + "An error occurred compiling the Vertex Shader: " + name); console.log(gl.getShaderInfoLog(shader));
    return undefined;
  }
  return shader;
};

Gauss.prototype.compileFragmentShader =  function(name, source) {
  var gl = this.gl; // Sanity Save
  var shader = gl.createShader(gl.FRAGMENT_SHADER); // Create shader object
  gl.shaderSource(shader, source); // Send the source to the shader object
  gl.compileShader(shader); // Compile the shader program
  
  // See if it compiled successfully
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
   console.log("WebGL Error\n " + "An error occurred compiling the Fragment Shader: " + name); console.log(gl.getShaderInfoLog(shader));
    return undefined;
  }
  return shader;
};

/* Returns boolean. If returns false then failed to create shader. If returns true then shader was created and added to shaders array. */
Gauss.prototype.createShader = function(source) {
  var gl = this.gl; // Sanity Save
  
  var fragmentShader, vertexShader;
  if(!(fragmentShader = this.compileFragmentShader(source.name, source.fragment))) { return undefined; }
  if(!(vertexShader = this.compileVertexShader(source.name, source.vertex))) { return undefined; }

  // Create the shader program
  var shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // If creating the shader program failed display error & return false
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    console.log("WebGL Error\n" + "Unable to initialize the shader program: "); console.log(gl.getProgramInfoLog(shaderProgram));
    return undefined;
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
  // Delete vert and frag as they are no longer needed after shader program is linked.
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);
  
  return new Shader(source.name, shaderProgram, attributes, uniforms);
};

/* Returns boolean. If false then failed to setup shaders and we fallback to 2D. */
Gauss.prototype.createModel = function(source) {
  var gl = this.gl; // Sanity Save
  
  var vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(source.vertices), gl.STATIC_DRAW);
  
  var indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(source.indices), gl.STATIC_DRAW);
  
  return new Model(source.name, vertexBuffer, indexBuffer, source.indices.length);
};

/* Checks to see if WebGL is supported and working, then benchmarks to make sure hardware acceleration is on. */
/* If a problem is detected then the user is notified with a warning */
Gauss.prototype.status = function() {
  if(!this.gl) {
    main.menu.info.show(
      "Warning!",
      "Your browser does not appear to have Hardware Accereration enabled or your browser does not support WebGL.</br>" +
      "20XX requires Hardware Acceleration to run. Please enable it and refresh the page.</br></br>" +
      "If this issue continues try switching to an officially supported browser: <i>Google Chrome</i> or <i>Mozilla Firefox</i>"
    ); return;
  }
};

/* ========================================================================== */

Gauss.prototype.shader_src_sky = {
  name: "gauss_sky",
  attributes: [
    {type: "vec3", name: "position"},
    {type: "vec3", name: "texcoord"}
  ],
  uniforms: [
    {type: "mat4", name: "Pmatrix"},
    {type: "mat4", name: "Vmatrix"},
    {type: "vec3", name: "transform"},
    {type: "vec2", name: "size"},
    {type: "sampler2D", name: "texture0"},
    {type: "sampler2D", name: "texture1"},
    {type: "int", name: "time"}
  ],
  vertex: "precision mediump float;  \n" + 
"    \n" + 
"  attribute vec3 position;  \n" + 
"  attribute vec3 texcoord;  \n" + 
"    \n" + 
"  uniform mat4 Pmatrix;  \n" + 
"  uniform mat4 Vmatrix;  \n" + 
"    \n" + 
"  uniform vec3 transform;  \n" + 
"  uniform vec2 size;  \n" + 
"    \n" + 
"  varying vec2 vUV;  \n" + 
"    \n" + 
"  void main(void) {  \n" + 
"    vec4 cPos = vec4((position*vec3(size,1.0))+transform, 1.0);  \n" + 
"    vUV=texcoord.st;  \n" + 
"    gl_Position = Pmatrix*Vmatrix*cPos;  \n" + 
"  }  \n" + 
"  ",
  fragment: "precision mediump float;  \n" + 
"    \n" + 
"  uniform sampler2D texture0;  \n" + 
"  uniform sampler2D texture1;  \n" + 
"    \n" + 
"  uniform int time;  \n" + 
"    \n" + 
"  varying vec2 vUV;  \n" + 
"    \n" + 
"  void main(void) {  \n" + 
"    float ftime = float(time);  // No implicit casting in glsl.   \n" + 
"    \n" + 
"    vec4  texSky = texture2D(texture0, vUV);  \n" + 
"    float texStarMask = texture2D(texture1, ((vUV*3.25)+(vec2(-0.00023*ftime, -0.00015*ftime)))).r;  \n" + 
"    float texStarTwink = texture2D(texture1, ((vUV*1.25)+(vec2(0.000337*ftime, 0.000097*ftime)))).g;  \n" + 
"    float star = texStarMask; \n" +
"    vec4 space = vec4(mix(texSky.rgb, vec3(star), (1.-texSky.a)*pow(texStarTwink+.25, 2.)*star), 1.0); \n" +
"    \n" + 
"    gl_FragColor = space;  \n" + 
"  }  \n" + 
"  "
};

Gauss.prototype.shader_src_cloud = {
  name: "gauss_cloud",
  attributes: [
    {type: "vec3", name: "position"},
    {type: "vec3", name: "texcoord"}
  ],
  uniforms: [
    {type: "mat4", name: "Pmatrix"},
    {type: "mat4", name: "Vmatrix"},
    {type: "vec3", name: "transform"},
    {type: "vec2", name: "size"},
    {type: "sampler2D", name: "texture0"},
    {type: "sampler2D", name: "texture1"},
    {type: "int", name: "time"}
  ],
  vertex: "precision mediump float;  \n" + 
"    \n" + 
"  attribute vec3 position;  \n" + 
"  attribute vec3 texcoord;  \n" + 
"    \n" + 
"  uniform mat4 Pmatrix;  \n" + 
"  uniform mat4 Vmatrix;  \n" + 
"    \n" + 
"  uniform vec3 transform;  \n" + 
"  uniform vec2 size;  \n" + 
"    \n" + 
"  varying vec2 vUV;  \n" + 
"    \n" + 
"  void main(void) {  \n" + 
"    vec4 cPos = vec4((position*vec3(size,1.0))+transform, 1.0);  \n" + 
"    vUV=texcoord.st;  \n" + 
"    gl_Position = Pmatrix*Vmatrix*cPos;  \n" + 
"  }  \n" + 
"  ",
  fragment: "precision mediump float;  \n" + 
"    \n" + 
"  uniform sampler2D texture0;  \n" +
"  uniform sampler2D texture1;  \n" +
"    \n" + 
"  uniform int time;  \n" + 
"    \n" + 
"  varying vec2 vUV;  \n" + 
"    \n" + 
"  void main(void) {  \n" + 
"    float ftime = float(time);  // No implicit casting in glsl.   \n" + 
"    \n" + 
"    vec2  hUV = vUV; hUV.y *= 2.;\n" +
"    vec4  texCloud = texture2D(texture0, hUV);  \n" +
"    float texDiffA = texture2D(texture1, ((vUV*3.5)+(vec2(-0.00053*ftime, -0.00025*ftime)))).r;  \n" + 
"    float texDiffB = texture2D(texture1, ((vUV*3.3)+(vec2(0.00042*ftime, -0.00033*ftime)))).g;  \n" + 
"    float texDiffC = texture2D(texture1, ((vUV*3.7)+(vec2(0.00033*ftime, 0.00021*ftime)))).b;  \n" + 
"    float noise = (texDiffA+texDiffB+texDiffC)*0.333;\n" + 
"    \n" + 
"    if(hUV.y < 1.01) { discard; } \n" +
"    gl_FragColor = vec4(vec3(1.), pow(texCloud.r*noise, 2.));  \n" + 
"  }  \n" + 
"  "
};

Gauss.prototype.shader_src_lines = {
  name: "gauss_lines",
  attributes: [
    {type: "vec3", name: "position"},
    {type: "vec3", name: "texcoord"}
  ],
  uniforms: [
    {type: "mat4", name: "Pmatrix"},
    {type: "mat4", name: "Vmatrix"},
    {type: "vec3", name: "transform"},
    {type: "vec2", name: "size"},
    {type: "sampler2D", name: "texture0"},
    {type: "sampler2D", name: "texture1"},
    {type: "sampler2D", name: "texture2"},
    {type: "int", name: "time"}
  ],
  vertex: "precision mediump float;  \n" + 
"    \n" + 
"  attribute vec3 position;  \n" + 
"  attribute vec3 texcoord;  \n" + 
"    \n" + 
"  uniform mat4 Pmatrix;  \n" + 
"  uniform mat4 Vmatrix;  \n" + 
"    \n" + 
"  uniform vec3 transform;  \n" + 
"  uniform vec2 size;  \n" + 
"    \n" + 
"  varying vec2 vUV;  \n" + 
"    \n" + 
"  void main(void) {  \n" + 
"    vec4 cPos = vec4((position*vec3(size,1.0))+transform, 1.0);  \n" + 
"    vUV=texcoord.st;  \n" + 
"    gl_Position = Pmatrix*Vmatrix*cPos;  \n" + 
"  }  \n" + 
"  ",
  fragment: "precision mediump float;  \n" + 
"    \n" + 
"  uniform sampler2D texture0;  \n" +
"  uniform sampler2D texture1;  \n" +
"  uniform sampler2D texture2;  \n" +
"    \n" + 
"  uniform int time;  \n" + 
"    \n" + 
"  varying vec2 vUV;  \n" + 
"    \n" + 
"  void main(void) {  \n" + 
"    float ftime = float(time);  // No implicit casting in glsl.   \n" + 
"    \n" + 
"    vec4  texLinesA = texture2D(texture0, vUV);  \n" +
"    vec4  texLinesB = texture2D(texture1, vUV);  \n" +
"    float timeA = mod((.75+ftime)*-0.0041, 2.5)-1.; \n" + 
"    float timeB = mod((.15+ftime)*-0.0042, 3.3)-1.; \n" + 
"    float timeC = mod((1.65+ftime)*-0.0045, 4.5)-1.; \n" + 
"    float timeD = mod((3.25+ftime)*-0.0043, 3.9)-1.; \n" + 
"    float colorA = texLinesA.g > timeA ? (1.-min(1., texLinesA.g-timeA)*3.) : 0.;\n" +
"    float colorB = texLinesA.a > timeB ? (1.-min(1., texLinesA.a-timeB)*5.) : 0.;\n" +
"    float colorC = texLinesB.g > timeC ? (1.-min(1., texLinesB.g-timeC)*3.) : 0.;\n" +
"    float colorD = texLinesB.a > timeD ? (1.-min(1., texLinesB.a-timeD)*5.) : 0.;\n" +
"    float lineA =  texLinesA.r*colorA;\n" + 
"    float lineB =  texLinesA.b*colorB;\n" + 
"    float lineC =  texLinesB.r*colorC;\n" + 
"    float lineD =  texLinesB.b*colorD;\n" + 
"    \n" + 
"    gl_FragColor = vec4(vec3(1.), min(1., max(0., lineA) + max(0., lineB) + max(0., lineC) + max(0., lineD)));  \n" + 
"  }  \n" + 
"  "
};

/* Source File: sheet.obj */
Gauss.prototype.model_src_sheet = {
  name: "multi.square",
  vertices : [-0.5,-0.5,0.0,0.0,1.0,0.0,0.0,0.0,1.0,0.5,-0.5,0.0,1.0,1.0,0.0,0.0,0.0,1.0,0.5,0.5,0.0,1.0,0.0,0.0,0.0,0.0,1.0,-0.5,-0.5,0.0,0.0,1.0,0.0,0.0,0.0,1.0,0.5,0.5,0.0,1.0,0.0,0.0,0.0,0.0,1.0,-0.5,0.5,0.0,0.0,0.0,0.0,0.0,0.0,1.0,],
  indices : [0,1,2,3,4,5,]
};