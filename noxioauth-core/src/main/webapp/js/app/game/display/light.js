"use strict";
/* global main */
/* global util */

/* Define Light Classes */

/* color is a Vec4 {x: <float>, y: <float>, z: <float>, w: <float>} */
/* line is a Line3 {a: {x: <float>, y: <float>, z: <float>}, b: {x: <float>, y: <float>, z: <float>}} */

function PointLight(pos, color, rad) {
  this.pos = pos;
  this.color = util.vec4.copy(color);    // Copy color since it will commonly have it's values edited directly by effects.
  this.rad = rad;
};

function LineLight(line, color, rad) {
  this.line = line;
  this.color = util.vec4.copy(color);    // Copy color since it will commonly have it's values edited directly by effects.
  this.rad = rad;
};