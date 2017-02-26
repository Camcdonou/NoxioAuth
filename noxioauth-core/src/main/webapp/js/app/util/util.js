"use strict";
/* global main */

/* Various utility functions */
var util = {
  /* Takes a string of <float x>,<float y> and makes an object out of it */
  parseVec2 : function(data) {
    var spl = data.split(",");
    return {x: parseFloat(spl[0]), y: parseFloat(spl[1])};
  },
  distanceVec2 : function(a, b) {
    var x = a.x - b.x;
    var y = a.y - b.y;
    return Math.sqrt((x*x)+(y*y));
  },
};