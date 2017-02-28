"use strict";
/* global main */

/* Various utility/math functions */
var util = {
  vec2 : {},
  vec3 : {}
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