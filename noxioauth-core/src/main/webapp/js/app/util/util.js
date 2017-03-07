"use strict";
/* global main */
/* global mat4 */
/* global GLU */

/* Various utility/math functions */
var util = {
  vec2 : {},
  vec3 : {},
  matrix: {},
  intersection: {},
  text : {}
};

/* === Vec2 =============================================================================== */
/* ======================================================================================== */

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

/* === Vec3 =============================================================================== */
/* ======================================================================================== */

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

/* === Matrix ============================================================================= */
/* ======================================================================================== */

util.matrix.unprojection = function(window, camera, cursor, depth) {
  var VIEWPORT = [0, 0, window.width, window.height];
  var PROJMATRIX = mat4.create(); mat4.perspective(PROJMATRIX, camera.fov, window.width/window.height, camera.near, camera.far); // Perspective
  var MOVEMATRIX = mat4.create();
    mat4.translate(MOVEMATRIX, MOVEMATRIX, [0.0, 0.0, -camera.zoom]);
    mat4.rotate(MOVEMATRIX, MOVEMATRIX, camera.rot.z, [0.0, 0.0, 1.0]);
    mat4.rotate(MOVEMATRIX, MOVEMATRIX, camera.rot.y, [0.0, 1.0, 0.0]);
    mat4.rotate(MOVEMATRIX, MOVEMATRIX, camera.rot.x, [1.0, 0.0, 0.0]);
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
      return {intersection: p, reflection: r, plane: pl, distance: ad};
  }
  return undefined;
};

/* === Text =============================================================================== */
/* ======================================================================================== */

/* Used for measuring text before drawing in OpenGL. */
util.text.lengthOnScreen = function(text, fontSize) {
  return (text.length * 0.9)*fontSize;
};