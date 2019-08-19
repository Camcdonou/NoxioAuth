"use strict";
/* global main */
/* global util */

/* Define Skybox Class */

/* Sky Source Definition
 * { name: <name>, components: [ {model: <model name>,  material: <mat name>, offset: <vec3 rotation offset>, velocity: <vec3 rotation speed>} ...  ] }
 */

function Sky(display, source) {
  this.frame = 0;
  this.components = [];
  for(var i=0;i<source.components.length;i++) {
    this.components.push(this.genComp(display, source.components[i]));
  }
};

/* Takes the source of a single sky component and returns an object of it */
Sky.prototype.genComp = function(display, source) {
  var comp = {};
  comp.model = display.getModel(source.model);
  comp.material = display.getMaterial(source.material);
  comp.pos = source.pos;
  comp.offset = source.offset;
  comp.velocity = source.velocity;
  return comp;
};

Sky.prototype.step = function() {
  this.frame++;
};

Sky.prototype.getDraw = function(geometry) {
  for(var i=0;i<this.components.length;i++) {
    var cr = util.vec3.scale(this.components[i].velocity, this.frame);
    
    var skyUniformData = [
      {name: "transform", data: util.vec3.toArray(this.components[i].pos)},
      {name: "rotation", data: util.vec3.toArray(cr)},
      {name: "offset", data: util.vec3.toArray(this.components[i].offset)},
      {name: "scale", data: 1.0}
    ];
    geometry.push({model: this.components[i].model, material: this.components[i].material, uniforms: skyUniformData});
  }
};