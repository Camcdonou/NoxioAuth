"use strict";
/* global main */
/* global mat4 */
/* global GLU */

/* Various utility/math functions */
var util = {
  vec2 : {},
  vec3 : {},
  vec4 : {},
  quat : {},
  matrix: {},
  intersection: {},
  text : {}
};

/* === Vec2 =============================================================================== */
/* ======================================================================================== */

util.vec2.create = function() {
  return {x: 0.0, y: 0.0};
};

/* Takes a string of <float x>,<float y> and makes an object out of it */
util.vec2.parse = function(data) {
  var spl = data.split(",");
  return {x: parseFloat(spl[0]), y: parseFloat(spl[1])};
};

util.vec2.add = function(a, b) {
  return {x: a.x + b.x, y: a.y + b.y};
};

util.vec2.subtract = function(a, b) {
  return {x: a.x - b.x, y: a.y - b.y};
};

util.vec2.scale = function(a, s) {
  return {x: a.x*s, y: a.y*s};
};

util.vec2.multiply = function(a, b) {
  return {x: a.x*b.x, y: a.y*b.y};
};

util.vec2.divide = function(a, b) {
  return {x: a.x/b.x, y: a.y/b.y};
};

util.vec2.magnitude = function(a) {
  return Math.sqrt((a.x*a.x) + (a.y*a.y));
};

util.vec2.normalize = function(a) {
  var mag = util.vec2.magnitude(a);
  return {x: a.x/mag, y: a.y/mag};
};

util.vec2.distance = function(a, b) {
  return util.vec2.magnitude(util.vec2.subtract(a, b));
};

util.vec2.dot = function(a, b) {
  return (a.x*b.x)+(a.y*b.y);
};

util.vec2.inverse = function(a) {
  return {x: -1.0*a.x, y: -1.0*a.y};
};

util.vec2.average = function(ary) {
  var c = util.vec2.create();
  for(var i=0;i<ary.length;i++) {
    c = util.vec2.add(c, ary[i]);
  }
  return util.vec2.scale(c, 1/ary.length);
};

util.vec2.toVec3 = function(a, z) {
  return {x: a.x, y: a.y, z: z};
};

util.vec2.toArray = function(a) {
  return [a.x, a.y];
};


/* === Vec3 =============================================================================== */
/* ======================================================================================== */

util.vec3.create = function() {
  return {x: 0.0, y: 0.0, z: 0.0};
};

util.vec3.random = function() {
  return util.vec3.normalize({x: (Math.random()*2.0)-1.0, y: (Math.random()*2.0)-1.0, z: (Math.random()*2.0)-1.0});
};

util.vec3.add = function(a, b) {
  return {x: a.x + b.x, y: a.y + b.y, z: a.z + b.z};
};

util.vec3.subtract = function(a, b) {
  return {x: a.x - b.x, y: a.y - b.y, z: a.z - b.z};
};

util.vec3.scale = function(a, b) {
  return {x: a.x*b, y: a.y*b, z: a.z*b};
};

util.vec3.magnitude = function(a) {
  return Math.sqrt((a.x*a.x) + (a.y*a.y) + (a.z*a.z));
};

util.vec3.normalize = function(a) {
  var mag = util.vec3.magnitude(a);
  return {x: a.x/mag, y: a.y/mag, z: a.z/mag};
};

util.vec3.dot = function(a, b) {
  return (a.x*b.x)+(a.y*b.y)+(a.z*b.z);
};

util.vec3.distance = function(a, b) {
  return util.vec3.magnitude(util.vec3.subtract(a, b));
};

util.vec3.inverse = function(a) {
  return {x: -1.0*a.x, y: -1.0*a.y, z: -1.0*a.z};
};

/* Linear interpolation from a@(i=0.0) to b@(i=1.0) */
util.vec3.lerp = function(a, b, i) {
  return util.vec3.add(util.vec3.scale(a, 1.0-i), util.vec3.scale(b, i));
};

util.vec3.toQuat = function(a) {
  // Assuming the angles are in radians.
  var c1 = Math.cos(a.x);
  var s1 = Math.sin(a.x);
  var c2 = Math.cos(a.y);
  var s2 = Math.sin(a.y);
  var c3 = Math.cos(a.z);
  var s3 = Math.sin(a.z);
  var w = Math.sqrt(1.0 + c1 * c2 + c1*c3 - s1 * s2 * s3 + c2*c3) / 2.0;
  var w4 = (4.0 * w);
  var x = (c2 * s3 + c1 * s3 + s1 * s2 * c3) / w4 ;
  var y = (s1 * c2 + s1 * c3 + c1 * s2 * s3) / w4 ;
  var z = (-s1 * s3 + c1 * s2 * c3 +s2) / w4 ;
  return {x: x, y: y, z: z, w: w};
};

util.vec3.toVec4 = function(a, w) {
  return {x: a.x, y: a.y, z: a.z, w: w};
};

util.vec3.toArray = function(a) {
  return [a.x, a.y, a.z];
};

/* === Vec4 =============================================================================== */
/* ======================================================================================== */

util.vec4.create = function() {
  return {x: 0.0, y: 0.0, z: 0.0, w: 1.0};
};

util.vec4.toArray = function(a) {
  return [a.x, a.y, a.z, a.w];
};


/* === Quaternion ========================================================================= */
/* ======================================================================================== */

util.quat.create = function() {
  return {x: 0.0, y: 0.0, z: 0.0, w: 1.0};
};

util.quat.generate = function(x, y, z, w) {
  var mag = Math.sqrt((x*x) + (y*y) + (z*z) + (w*w));
  if (mag > 0.0) {
      return {x: x/mag, y: y/mag, z: z/mag, w: w/mag};
  } else {
    return {x: 0.0, y: 0.0, z: 0.0, w: 1.0};
  }
};

util.quat.toEuler = function(q1) {
    	var heading;
    	var attitude;
    	var bank;
    	
        var sqw = q1.w*q1.w;
        var sqx = q1.x*q1.x;
        var sqy = q1.y*q1.y;
        var sqz = q1.z*q1.z;
    	var unit = sqx + sqy + sqz + sqw; // if normalised is one, otherwise is correction factor
    	var test = q1.x*q1.y + q1.z*q1.w;
    	if (test > 0.499*unit) { // singularity at north pole
    		heading = 2.0 * Math.atan2(q1.x,q1.w);
    		attitude = Math.PI/2.0;
    		bank = 0.0;
    		return {x: bank, y: heading, z: attitude};
    	}
    	if (test < -0.499*unit) { // singularity at south pole
    		heading = -2.0 * Math.atan2(q1.x,q1.w);
    		attitude = -Math.PI/2.0;
    		bank = 0;
    		return {x: bank, y: heading, z: attitude};
    	}
        heading = Math.atan2(2.0*q1.y*q1.w-2.0*q1.x*q1.z , sqx - sqy - sqz + sqw);
    	attitude = Math.asin(2.0*test/unit);
    	bank = Math.atan2((2.0*q1.x*q1.w)-(2.0*q1.y*q1.z) , -sqx + sqy - sqz + sqw);
    	
		return {x: bank, y: heading, z: attitude};
};

/* === Matrix ============================================================================= */
/* ======================================================================================== */

util.matrix.unprojection = function(window, camera, cursor, depth) {
  var VIEWPORT = [0, 0, window.width, window.height];
  var PROJMATRIX = mat4.create(); mat4.perspective(PROJMATRIX, camera.fov, window.width/window.height, camera.near, camera.far); // Perspective
  var MOVEMATRIX = mat4.create();
    mat4.translate(MOVEMATRIX, MOVEMATRIX, [0.0, 0.0, -camera.zoom]);
    mat4.rotate(MOVEMATRIX, MOVEMATRIX, camera.rot.x, [1.0, 0.0, 0.0]);
    mat4.rotate(MOVEMATRIX, MOVEMATRIX, camera.rot.y, [0.0, 1.0, 0.0]);
    mat4.rotate(MOVEMATRIX, MOVEMATRIX, camera.rot.z, [0.0, 0.0, 1.0]);
    mat4.translate(MOVEMATRIX, MOVEMATRIX, [camera.pos.x, camera.pos.y, camera.pos.z]);
  var VIEWMATRIX = mat4.create();
  var MV = mat4.create(); mat4.multiply(MV, VIEWMATRIX, MOVEMATRIX);

  var modelPointArrayResults = [];
  var success = GLU.unProject(
    cursor.x, window.height-cursor.y, depth,
    MV, PROJMATRIX,
    VIEWPORT, modelPointArrayResults);
    
  if(!success) { return {x: 0.0, y: 0.0, z: 0.0}; /* @FIXME error!*/ }
  return {x: modelPointArrayResults[0], y: modelPointArrayResults[1], z: modelPointArrayResults[2]};
};

/* Vec2[x] poly, float distance */
util.matrix.expandPolygon = function(poly, d) {
  /* @FIXME doing this ghetto style for now. Redo it correctly with normals later. */
  var c = util.vec2.average(poly);
  var expoly = [];
  for(var i=0;i<poly.length;i++) {
    var pc = util.vec2.subtract(poly[i], c);           // Point moved so center is 0,0
    var n = util.vec2.normalize(pc);                   // Normal to expand on
    var ex = util.vec2.add(pc, util.vec2.scale(n, d)); // Expand point by d
    expoly.push(util.vec2.add(ex, c));                // Move it back to orignal position
  }
  return expoly;
};

/* === Intersection ======================================================================= */
/* ======================================================================================== */

/* Line l {a: <startpoint vec3>, b: <endpoint vec3>} */
/* Plane pl {a: <p1 vec3>, b: <p2 vec3>, c: <p3 vec3>, n: <normal vec3>} */
util.intersection.linePlane = function(l, pl) {
  // Does the line intersect the plane?
  var b = util.vec3.subtract(l.b, l.a);
  var v = util.vec3.normalize(b);
  var dp = util.vec3.dot(pl.n, util.vec3.subtract(pl.c, l.a)) / util.vec3.dot(pl.n, v);
  var p = {x: l.a.x + (dp*v.x), y: l.a.y + (dp*v.y), z: l.a.z + (dp*v.z)};
  // Make sure we are not getting a collision in the inverse direction
  if(util.vec3.distance(v, pl.n) >= util.vec3.distance(v, util.vec3.inverse(pl.n))) {
      var ad = util.vec3.distance(l.a, p);
      var iv = util.vec3.inverse(v);
      dp = util.vec3.dot(pl.n, iv);
      var r = util.vec3.scale(util.vec3.normalize(util.vec3.subtract(util.vec3.scale(pl.n, 2*dp), iv)), util.vec3.distance(p, l.b));
      return {intersection: p, reflection: r, plane: pl, distance: ad}; /* @FIXME might be generating more data than needed for some stuff. optmize. */
  }
  return undefined;
};

/* Vec2 p, Vec2[x] poly */
util.intersection.pointPoly = function(p, poly) {
  var i = 0;
  var j = 0;
  var c = false;
  var nvert = poly.length;
  for (i = 0, j = nvert-1; i < nvert; j = i++) {
    if ( ((poly[i].y>p.y) !== (poly[j].y>p.y)) &&
     (p.x < (poly[j].x-poly[i].x) * (p.y-poly[i].y) / (poly[j].y-poly[i].y) + poly[i].x) )
       c = !c;
  }
  return c;
};

/* === Text =============================================================================== */
/* ======================================================================================== */

/* Used for measuring text before drawing in OpenGL. */
util.text.lengthOnScreen = function(text, fontSize) {
  return (text.length * 0.9)*fontSize;
};