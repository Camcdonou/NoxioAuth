"use strict";
/* global main */
/* global util */

/* Define Light Classes */

/* color is a Vec4 {x: <float>, y: <float>, z: <float>, w: <float>} */

/* A static PointLight with given position3, color4, and radius */
function PointLight(pos, color, rad) {
  this.pos = pos;
  this.color = util.vec4.copy(color);    // Copy color since it may have it's value edited by it's owner.
  this.rad = rad;
};

PointLight.prototype.step = function(pos) {
  if(pos) { this.pos = pos; }
};

PointLight.prototype.active = function() {
  return true;
};

/* A PointLight that interpolates through colors4[] & rads[] over the given length of time */
/* Supported equations for interpolation:
 * - "linear"
 * - "fast"
 * - "slow"
 */
function PointLightInterp(pos, colors, rads, length, eq) {
  this.pos = pos;
  
  this.color = colors[0];
  this.rad = rads[0];
  
  this.colors = colors;
  this.rads = rads;
  
  this.length = length;
  this.eq = eq?eq:"linear";
  
  this.age = 0;
};

PointLightInterp.prototype.step = function(pos) {
  if(pos) { this.pos = pos; }
  
  var prg;
  switch(this.eq) {
    case "fast" : { prg = Math.pow((this.age/this.length), 0.5); break; }
    case "slow" : { prg = Math.pow((this.age/this.length), 2); break; }
    case "2fast" : { prg = Math.pow((this.age/this.length), 0.25); break; }
    case "2slow" : { prg = Math.pow((this.age/this.length), 4); break; }
    default : { prg = (this.age/this.length); break; }
  }
  
  var ind = Math.min(Math.floor(prg*(this.colors.length-1)), this.colors.length-2);
  this.color = util.vec4.lerp(this.colors[ind], this.colors[ind+1], (prg*(this.colors.length-1))-ind);
  ind = Math.min(Math.floor(prg*(this.rads.length-1)), this.rads.length-2);
  var nbt = (prg*(this.rads.length-1))-ind;
  this.rad = (this.rads[ind]*(1-nbt))+(this.rads[ind+1]*nbt);
  
  this.age++;
};

PointLightInterp.prototype.active = function() {
  return this.age <= this.length;
};

/* Used by EffectDefinition.js */
PointLight.fxId = "light";
PointLightInterp.fxId = "light";