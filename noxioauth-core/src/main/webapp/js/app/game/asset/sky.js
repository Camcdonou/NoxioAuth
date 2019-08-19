"use strict";
/* global Asset */
/* global util */

/* Defines sky sources */
Asset.prototype.sky = {};

Asset.prototype.sky.final = {
  name: "Final",
  components: [
    {model: "sky.final.outer", material: "sky.final.outer", pos: util.vec3.create(), offset: util.vec3.create(), velocity: util.vec3.make(0,0,0.00006)},
    {model: "sky.final.space", material: "sky.final.space", pos: util.vec3.create(), offset: util.vec3.create(), velocity: util.vec3.make(0,0,-0.00013)},
    {model: "sky.final.inner", material: "sky.final.inner", pos: util.vec3.create(), offset: util.vec3.create(), velocity: util.vec3.create()},
    {model: "sky.final.comet", material: "sky.final.comet", pos: util.vec3.create(), offset: util.vec3.make(1.35,0,-0.74), velocity: util.vec3.make(0,0,-0.0055)},
    {model: "sky.final.comet", material: "sky.final.comet", pos: util.vec3.create(), offset: util.vec3.make(0.45,0,1.34), velocity: util.vec3.make(0,0,-0.0045)},
    {model: "sky.final.comet", material: "sky.final.comet", pos: util.vec3.create(), offset: util.vec3.make(0.33,0,-2.64), velocity: util.vec3.make(0,0,-0.0055)},
    {model: "sky.final.comet", material: "sky.final.comet", pos: util.vec3.create(), offset: util.vec3.make(-0.75,0,1.14), velocity: util.vec3.make(0,0,-0.00475)},
    {model: "sky.final.comet", material: "sky.final.comet", pos: util.vec3.create(), offset: util.vec3.make(2.66,0,-0.9), velocity: util.vec3.make(0,0,-0.006)},
    {model: "sky.final.comet", material: "sky.final.comet", pos: util.vec3.create(), offset: util.vec3.make(0.95,0,-2.34), velocity: util.vec3.make(0,0,-0.00625)}
  ]
};

Asset.prototype.sky.gold = {
  name: "Gold",
  components: [
    {model: "sky.gold.sky", material: "sky.gold.sky", pos: util.vec3.create(), offset: util.vec3.create(), velocity: util.vec3.make(0,0,0.000006)},
    {model: "sky.gold.void", material: "sky.gold.void", pos: util.vec3.create(), offset: util.vec3.create(), velocity: util.vec3.make(0,0,-0.000013)},
    {model: "sky.gold.cloud", material: "sky.gold.cloud", pos: util.vec3.create(), offset: util.vec3.create(), velocity: util.vec3.create()},
    {model: "sky.gold.cloud", material: "sky.gold.cloud", pos: util.vec3.make(0.,-350.,0.), offset: util.vec3.create(), velocity: util.vec3.create()}
  ]
};

Asset.prototype.sky.vapor = {
  name: "Vapor",
  components: [
    {model: "sky.final.outer", material: "sky.final.outer", pos: util.vec3.create(), offset: util.vec3.create(), velocity: util.vec3.make(0,0,0.00006)},
    {model: "sky.final.space", material: "sky.final.space", pos: util.vec3.create(), offset: util.vec3.create(), velocity: util.vec3.make(0,0,-0.00013)},
    {model: "sky.final.inner", material: "sky.final.inner", pos: util.vec3.create(), offset: util.vec3.create(), velocity: util.vec3.create()},
    {model: "sky.vapor.grid", material: "sky.vapor.grid", pos: util.vec3.create(), offset: util.vec3.make(0.23,0,0.5), velocity: util.vec3.make(0,0,0.00017)},
    {model: "sky.final.comet", material: "sky.vapor.comet", pos: util.vec3.create(), offset: util.vec3.make(1.35,0,-0.74), velocity: util.vec3.make(0,0,-0.0055)},
    {model: "sky.final.comet", material: "sky.vapor.comet", pos: util.vec3.create(), offset: util.vec3.make(0.45,0,1.34), velocity: util.vec3.make(0,0,-0.0045)},
    {model: "sky.final.comet", material: "sky.vapor.comet", pos: util.vec3.create(), offset: util.vec3.make(0.33,0,-2.64), velocity: util.vec3.make(0,0,-0.0055)},
    {model: "sky.final.comet", material: "sky.vapor.comet", pos: util.vec3.create(), offset: util.vec3.make(-0.75,0,1.14), velocity: util.vec3.make(0,0,-0.00475)},
    {model: "sky.final.comet", material: "sky.vapor.comet", pos: util.vec3.create(), offset: util.vec3.make(2.66,0,-0.9), velocity: util.vec3.make(0,0,-0.006)},
    {model: "sky.final.comet", material: "sky.vapor.comet", pos: util.vec3.create(), offset: util.vec3.make(0.95,0,-2.34), velocity: util.vec3.make(0,0,-0.00625)}
  ]
};
