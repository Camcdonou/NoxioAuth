"use strict";
/* global Asset */
/* global util */

/* Defines sky sources */
Asset.prototype.sky = {};

Asset.prototype.sky.final = {
  name: "Final",
  components: [
    {model: "sky.final.outer", material: "sky.final.outer", offset: util.vec3.create(), velocity: util.vec3.make(0,0,0.00006)},
    {model: "sky.final.space", material: "sky.final.space", offset: util.vec3.create(), velocity: util.vec3.make(0,0,-0.00013)},
    {model: "sky.final.inner", material: "sky.final.inner", offset: util.vec3.create(), velocity: util.vec3.create()},
    {model: "sky.final.comet", material: "sky.final.comet", offset: util.vec3.make(1.35,0,-0.74), velocity: util.vec3.make(0,0,-0.0055)},
    {model: "sky.final.comet", material: "sky.final.comet", offset: util.vec3.make(0.45,0,1.34), velocity: util.vec3.make(0,0,-0.0045)},
    {model: "sky.final.comet", material: "sky.final.comet", offset: util.vec3.make(0.33,0,-2.64), velocity: util.vec3.make(0,0,-0.0055)},
    {model: "sky.final.comet", material: "sky.final.comet", offset: util.vec3.make(-0.75,0,1.14), velocity: util.vec3.make(0,0,-0.00475)},
    {model: "sky.final.comet", material: "sky.final.comet", offset: util.vec3.make(2.66,0,-0.9), velocity: util.vec3.make(0,0,-0.006)},
    {model: "sky.final.comet", material: "sky.final.comet", offset: util.vec3.make(0.95,0,-2.34), velocity: util.vec3.make(0,0,-0.00625)}
  ]
};
