"use strict";
/* global main */

/* Define Light Classes */
function PointLight(pos, color, rad) {
  this.pos = pos;
  this.color = color;
  this.rad = rad;
};

/* pos in this context is {a: {x: <float>, y: <float>, z: <float>}, b: {x: <float>, y: <float>, z: <float>}} */
function LineLight(pos, color, rad) {
  this.pos = pos;
  this.color = color;
  this.rad = rad;
};