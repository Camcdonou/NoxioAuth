"use strict";
/* global main */
/* global mat4 */
/* global vec4 */
/* global GLU */

/* Various utility/math functions */
var util = {
  vec2 : {},
  vec3 : {},
  vec4 : {},
  quat : {},
  line2: {},
  matrix: {},
  intersection: {},
  font : {},
  time: {}
};

/* === Vec2 =============================================================================== */
/* ======================================================================================== */

util.vec2.create = function() {
  return {x: 0.0, y: 0.0};
};

util.vec2.make = function(x, y) {
  return {x: x, y: y};
};

util.vec2.copy = function(a) {
  return {x: a.x, y: a.y};
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
  return mag !== 0.0 ? {x: a.x/mag, y: a.y/mag} : {x: 0.0, y: 1.0};
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

/* Linear interpolation from a@(i=0.0) to b@(i=1.0) */
util.vec2.lerp = function(a, b, i) {
  return util.vec2.add(util.vec2.scale(a, 1.0-i), util.vec2.scale(b, i));
};

util.vec2.average = function(ary) {
  var c = util.vec2.create();
  for(var i=0;i<ary.length;i++) {
    c = util.vec2.add(c, ary[i]);
  }
  return util.vec2.scale(c, 1/ary.length);
};

util.vec2.equals = function(a, b) {
  return a.x === b.x && a.y === b.y;
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

util.vec3.make = function(x, y, z) {
  return {x: x, y: y, z: z};
};

util.vec3.copy = function(a) {
  return {x: a.x, y: a.y, z: a.z};
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

util.vec3.multiply = function(a, b) {
  return {x: a.x*b.x, y: a.y*b.y, z: a.z*b.z};
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

util.vec3.rotateZ = function(a, r) {
    var cosDegrees = Math.cos(r);
    var sinDegrees = Math.sin(r);

    var x = (a.x * cosDegrees) + (a.y * sinDegrees);
    var y = (a.x * -sinDegrees) + (a.y * cosDegrees);

    return {x: x, y: y, z: a.z};
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

util.vec3.toVec2 = function(a) {
  return {x: a.x, y: a.y};
};

util.vec3.toArray = function(a) {
  return [a.x, a.y, a.z];
};

/* === Vec4 =============================================================================== */
/* ======================================================================================== */

util.vec4.create = function() {
  return {x: 0.0, y: 0.0, z: 0.0, w: 1.0};
};

util.vec4.make = function(x, y, z, w) {
  return {x: x, y: y, z: z, w: w};
};

util.vec4.copy = function(a) {
  return {x: a.x, y: a.y, z: a.z, w: a.w};
};

util.vec4.multiply = function(a, b) {
  return {x: a.x*b.x, y: a.y*b.y, z: a.z*b.z, w: a.w*b.w};
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

/* === Line2 =============================================================================== */
/* ======================================================================================== */

util.line2.normal = function(A) {
  return util.vec2.normalize({x: A.b.y-A.a.y, y: -1*(A.b.x-A.a.x)});
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
    
  if(!success) { return {x: 0.0, y: 0.0, z: 0.0}; }
  return {x: modelPointArrayResults[0], y: modelPointArrayResults[1], z: modelPointArrayResults[2]};
};

util.matrix.projection = function(window, camera, coord) { 
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
  var MVP = mat4.create(); mat4.multiply(MVP, PROJMATRIX, MV);
  
  var COORDINATE = vec4.create(); vec4.set(COORDINATE, coord.x, coord.y, coord.z, 1.0);
  var PROJECTION = vec4.create(); mat4.multiply(PROJECTION, MVP, COORDINATE);
  
  return {x: PROJECTION[0]/PROJECTION[3], y: PROJECTION[1]/PROJECTION[3]};
};

/* Vec2[x] poly, float distance */
/* Expands a polygon by it's vertex normals. */
util.matrix.expandPolygon = function(poly, d) {
  var c = util.vec2.average(poly);
  var expoly = [];
  for(var i=0;i<poly.length;i++) {
    var a = i<1 ? poly[poly.length-1] : poly[i-1];
    var b = poly[i];
    var c = i<poly.length-1 ? poly[i+1] : poly[0];
    
    var na = util.vec2.normalize(util.vec2.subtract(b, a));
    var nb = util.vec2.normalize(util.vec2.subtract(b, c));
    
    var n = util.vec2.normalize(util.vec2.add(na, nb));         // Normal to expand on
    
    var ex = util.vec2.add(b, util.vec2.scale(n, d));           // Expand point by d
    expoly.push(ex);
  }
  return expoly;
};

/* === Intersection ======================================================================= */
/* ======================================================================================== */

/* Vec2 p, Vec2 a, Vec2 b */
/* a is the starting corner, b is the size of the rectangle */
util.intersection.pointRectangle = function(p, a, b) {
  return a.x <= p.x &&
         a.x+b.x > p.x &&
         a.y <= p.y &&
         a.y+b.y > p.y;
};

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
      var iv = util.vec3.inverse(v);
      dp = util.vec3.dot(pl.n, iv);
      return {intersection: p};
  }
  return undefined;
};

/* Generates some extra data about the collision */
util.intersection.linePlaneVerbose = function(l, pl) {
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
      return {intersection: p, reflection: r, plane: pl, distance: ad};
  }
  return undefined;
};

/* Vec2 p, Vec2[] poly */
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

/* Line2 A, Line2 B */
util.intersection.lineLine = function(A, B) {
  var s1_x, s1_y, s2_x, s2_y;
  var i_x, i_y;
  s1_x = A.b.x - A.a.x; s1_y = A.b.y - A.a.y;
  s2_x = B.b.x - B.a.x; s2_y = B.b.y - B.a.y;

  var s, t;
  s = (-s1_y * (A.a.x - B.a.x) + s1_x * (A.a.y - B.a.y)) / (-s2_x * s1_y + s1_x * s2_y);
  t = ( s2_x * (A.a.y - B.a.y) - s2_y * (A.a.x - B.a.x)) / (-s2_x * s1_y + s1_x * s2_y);

  if (s >= 0 && s <= 1 && t >= 0 && t <= 1)
  {
      // Collision detected
      i_x = A.a.x + (t * s1_x);
      i_y = A.a.y + (t * s1_y);
      var intersection = {x: i_x, y: i_y};
      //var normal = util.vec2.normalize(util.vec2.subtract(intersection, A.a));
      var normal = util.line2.normal(B);
      return {intersection: intersection, normal: normal, distance: util.vec2.distance(intersection, A.a)};
  }

  return undefined; // No collision
};

/* Vec2 P, Line2 L, float r */
util.intersection.lineCircle = function(P, L, r) {
  var nearest = util.intersection.lineNearestPoint(P, L);
  if(util.vec2.equals(nearest, L.a)) {
    var dir = util.vec2.subtract(P, L.a);
    var dist = util.vec2.magnitude(dir);
    if(dist >= r) { return undefined; }
    var norm = util.vec2.normalize(dir);
    return {intersection: L.a, normal: norm, dist};
  }
  else if(util.vec2.equals(nearest, L.b)) {
    var dir = util.vec2.subtract(P, L.b);
    var dist = util.vec2.magnitude(dir);
    if(dist >= r) { return undefined; }
    var norm = util.vec2.normalize(dir);
    return {intersection: L.b, normal: norm, distance: dist};
  }
  else {
    var dir = util.vec2.subtract(P, nearest);
    var dist = util.vec2.magnitude(dir);
    if(dist >= r) { return undefined; }
    var norm = util.vec2.normalize(dir);
    return {intersection: nearest, normal: norm, distance: dist};
  }
};

/* Line2 L, Polygon G, float r */
util.intersection.polygonLine = function(L, G) {
  var hits = [];
  for(var i=0;i<G.v.length;i++) {
    var L2 = {a: G.v[i], b: G.v[i+1<G.v.length?i+1:0]};
    var inst = util.intersection.lineLine(L, L2);
    if(inst) { hits.push(inst); }
  }
  if(hits.length < 1) { return undefined; }
  var nearest = hits[0];
  for(var i=1;i<hits.length;i++) {
    if(hits[i].distance < nearest.distance) {
      nearest = hits[i];
    }
  }
  return nearest;
};

/* Vec2 P, Polygon G, float r */
util.intersection.polygonCircle = function(P, G, r) {
  var hits = [];
  for(var i=0;i<G.v.length;i++) {
    var L = {a: G.v[i], b: G.v[i+1<G.v.length?i+1:0]};
    var inst = util.intersection.lineCircle(P, L, r);
    if(inst) { hits.push(inst); }
  }
  if(hits.length < 1) { return undefined; }
  var nearest = hits[0];
  for(var i=1;i<hits.length;i++) {
    if(hits[i].distance < nearest.distance) {
      nearest = hits[i];
    }
  }
  return nearest;
};

/* Vec2 P, Line2 L */
util.intersection.lineNearestPoint = function(P, L) {
  var v = util.vec2.subtract(L.b, L.a);
  var w = util.vec2.subtract(P, L.a);
  var c1 = util.vec2.dot(w, v);
  if ( c1 <= 0 ) { return L.a; }
  var c2 = util.vec2.dot(v, v);
  if ( c2 <= c1 ) { return L.b; }
  var b = c1 / c2;
  return util.vec2.add(L.a, util.vec2.scale(v, b));
};

/* === Time =============================================================================== */
/* ======================================================================================== */

util.time.now = function() {
  return Date.now();
};