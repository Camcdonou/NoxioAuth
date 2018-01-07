"use strict";
/* global main */
/* global util */

/* Define Camera Class */
function Camera() {
  this.pos = {x: 0.0, y: 0.0, z: 0.0};
  this.rot = {x: -0.349066, y: 0.0, z: 2.35619};
  this.zoom = 15.0;
  this.fov = 0.698132;
  this.near = 1.0;
  this.far = 64.0;
  
  this.interp = {pos: this.pos, rot: this.rot, zoom: 0.0};
}

/* End all interpolation of camera values and jump straight to final */
Camera.prototype.immediate = function() {
  var CAMERA_MIN_ZOOM = 5.0;
  var CAMERA_MAX_ZOOM = 50.0;
    
  this.pos = this.interp.pos;
  this.rot = this.interp.rot;
  this.zoom = Math.max(CAMERA_MIN_ZOOM, Math.min(CAMERA_MAX_ZOOM, this.zoom-this.interp.zoom));
  
  this.interp.zoom = 0.0;
};

/* Do interpolation of camera values */
Camera.prototype.update = function() {
  var INTERP_RATE = 0.33;
  var CAMERA_MIN_ZOOM = 5.0;
  var CAMERA_MAX_ZOOM = 50.0;
  
  var z = this.interp.zoom*INTERP_RATE; this.interp.zoom -= z;
  
  this.pos = util.vec3.lerp(this.pos, this.interp.pos, INTERP_RATE);
  this.rot = util.vec3.lerp(this.rot, this.interp.rot, INTERP_RATE);
  this.zoom = Math.max(CAMERA_MIN_ZOOM, Math.min(CAMERA_MAX_ZOOM, this.zoom-z));
};

Camera.prototype.setZoom = function(z) {
  this.interp.zoom += z;
};

Camera.prototype.setPos = function(pos) {
  this.interp.pos = pos;
};

Camera.prototype.setRot = function(rot) {
  this.interp.rot = rot;
  this.interp.rot.x = Math.min(-0.01, Math.max(-1.1765659999999967, this.interp.rot.x));
};

Camera.prototype.addRot = function(rot) {
  this.interp.rot = util.vec3.add(this.interp.rot, rot);
  this.interp.rot.x = Math.min(-0.01, Math.max(-1.1765659999999967, this.interp.rot.x));
};

/* Returns worldspace center point of camera and a eye direction normal */
/* {pos: <vec3>, dir: <vec3>} */
Camera.prototype.getEye = function() {
  var ep = util.vec3.add(this.pos, util.vec3.rotate(util.vec3.make(0,0,-this.zoom), this.rot));
  var ed = util.vec3.normalize(util.vec3.subtract(this.pos, ep));
  return {pos: ep, dir: ed};
};

Camera.prototype.getBounds = function(aspect) {
  /* @FIXME inefficent. It should be possible to get 2 opposite corners and calcualte the rest of the polygon. That would be better. */
  var a1 = util.matrix.unprojection({width: 1.0, height: aspect}, this, {x: 0.0, y: 0.0}, 0.0);
  var a2 = util.matrix.unprojection({width: 1.0, height: aspect}, this, {x: 0.0, y: 0.0}, 1.0);
  
  var b1 = util.matrix.unprojection({width: 1.0, height: aspect}, this, {x: 1.0, y: 0.0}, 0.0);
  var b2 = util.matrix.unprojection({width: 1.0, height: aspect}, this, {x: 1.0, y: 0.0}, 1.0);
  
  var c1 = util.matrix.unprojection({width: 1.0, height: aspect}, this, {x: 0.0, y: aspect}, 0.0);
  var c2 = util.matrix.unprojection({width: 1.0, height: aspect}, this, {x: 0.0, y: aspect}, 1.0);
  
  var d1 = util.matrix.unprojection({width: 1.0, height: aspect}, this, {x: 1.0, y: aspect}, 0.0);
  var d2 = util.matrix.unprojection({width: 1.0, height: aspect}, this, {x: 1.0, y: aspect}, 1.0);
  
  var floorPlane = {a: {x: 0.0, y: 0.0, z: 0.0}, b: {x: 1.0, y: 0.0, z: 0.0}, c: {x: 0.0, y: 1.0, z: 0.0}, n: {x: 0.0, y: 0.0, z: 1.0}};
  var A = util.intersection.linePlane({a: a1, b: a2}, floorPlane);
  var B = util.intersection.linePlane({a: b1, b: b2}, floorPlane);
  var C = util.intersection.linePlane({a: c1, b: c2}, floorPlane);
  var D = util.intersection.linePlane({a: d1, b: d2}, floorPlane);
    
  if(!A || !B || !C || !D) { return [util.vec3.create(), util.vec3.create(), util.vec3.create(), util.vec3.create()]; }
  return [A.intersection, B.intersection, D.intersection, C.intersection];
};