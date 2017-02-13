/* Extention to add 'ortho' and 'look' to glm-js */
/* global glm */

glm.ortho = function(left, right, bottom, top, znear, zfar) {
  var tx = - (right + left) / (right - left);
  var ty = - (top + bottom) / (top - bottom);
  var tz = - (zfar + znear) / (zfar - znear);

  return glm.mat4(
    2 / (right - left), 0, 0, tx,
    0, 2 / (top - bottom), 0, ty,
    0, 0, -2 / (zfar - znear), tz,
    0, 0, 0, 1
  );
};

glm.look = function(eye, center, up) {
    var z = glm.normalize(eye.sub(center));
    var x = glm.normalize(glm.cross(up, z));
    var y = glm.normalize(glm.cross(z, x));

    var m = glm.mat4(
      x.x, x.y, x.z, 0,
      y.x, y.y, y.z, 0,
      z.x, z.y, z.z, 0,
      0, 0, 0, 1
    );

    var t = glm.mat4(
      1, 0, 0, -eye.x,
      0, 1, 0, -eye.y,
      0, 0, 1, -eye.z,
      0, 0, 0, 1
    );
    
    return m.mul(t);
};

/* @FIXME woo lad this is hacky */
glm.mat4.prototype.flatten = function() {
  return this.elements;
};