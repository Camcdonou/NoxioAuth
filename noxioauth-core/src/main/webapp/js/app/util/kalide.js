"use strict";
/* global main */
/* global util */

/* Pre defined color list, used for player colors */
/* Colors are identified by their index in the colors array. */
/* This class needs to directly match the list on the game server and auth server */

/* Converts 256 rgb colors to vec3 float colors */
util.kalide.rgb255vec3 = function(r, g, b) {
  return util.vec3.make(r/255, g/255, b/255);
};

/* Max size of this array is 255 */
util.kalide.COLORS = [
  util.kalide.rgb255vec3(127, 127, 127), /* Considered a 'no color' slot. Defaults to grey or is unused. */
  util.kalide.rgb255vec3(127, 127, 127),
  util.kalide.rgb255vec3(255, 0, 0),
  util.kalide.rgb255vec3(255, 127, 0),
  util.kalide.rgb255vec3(255, 255, 0),
  util.kalide.rgb255vec3(127, 255, 0),
  util.kalide.rgb255vec3(0, 255, 0),
  util.kalide.rgb255vec3(0, 255, 127),
  util.kalide.rgb255vec3(0, 255, 255),
  util.kalide.rgb255vec3(0, 127, 255),
  util.kalide.rgb255vec3(127, 0, 255),
  util.kalide.rgb255vec3(127, 0, 255),
  util.kalide.rgb255vec3(255, 0, 255),
  util.kalide.rgb255vec3(255, 0, 127)
];

/* Max size of this array is 255 */
util.kalide.REDS = [
  util.kalide.rgb255vec3(192, 62, 62), /* Considered a 'no color' slot. Uses default red color or is unused. */
  util.kalide.rgb255vec3(255, 0, 0),
  util.kalide.rgb255vec3(255, 76, 76),
  util.kalide.rgb255vec3(223, 31, 31),
  util.kalide.rgb255vec3(193, 66, 66)
];

/* Max size of this array is 255 */
util.kalide.BLUES = [
  util.kalide.rgb255vec3(62, 62, 192), /* Considered a 'no color' slot. Uses default blue color or is unused. */
  util.kalide.rgb255vec3(0, 0, 255),
  util.kalide.rgb255vec3(76, 76, 255),
  util.kalide.rgb255vec3(31, 31, 223),
  util.kalide.rgb255vec3(66, 66, 193)
];

/* ID and Team, team=0 returns red team colors, team=1 returns blue team colors, all else returns regular colors */
util.kalide.getColorAuto = function(id, team) {
  switch(team) {
    case 0 : { return util.kalide.getRed(id); }
    case 1 : { return util.kalide.getBlue(id); }
    default : { return util.kalide.getColor(id); }
  }
};

/* ID and Team, team=0 returns red team colors, team=1 returns blue team colors, all else returns regular colors */
util.kalide.getColorsAuto = function(id, team) {
  switch(team) {
    case 0 : { return util.kalide.getReds(id); }
    case 1 : { return util.kalide.getBlues(id); }
    default : { return util.kalide.getColors(id); }
  }
};

/* Single id single color */
util.kalide.getColor = function(id) { return util.kalide.kalide(id, util.kalide.COLORS); };

/* Retrieves up to 4 color ids (0-255) from a single 32bit integer, used for animated colors */
util.kalide.getColors = function(id) { return util.kalide.kalides(id, util.kalide.COLORS); };

/* Same as getColors(id) but will return 4 slots with 'undefined' anywhere there is no set color (used in UI where the empty slots are shown) */
util.kalide.getColorsNoTruncate = function(id) { return util.kalide.kalidesNoTrunc(id, util.kalide.COLORS); };

/* Single id single red team color */
util.kalide.getRed = function(id) { return util.kalide.kalide(id, util.kalide.REDS); };

/* Retrieves up to 4 color ids (0-255) from a single 32bit integer, used for animated red team colors */
util.kalide.getReds = function(id) { return util.kalide.kalides(id, util.kalide.REDS); };

/* Same as getReds(id) but will return 4 slots with 'undefined' anywhere there is no set color (used in UI where the empty slots are shown) */
util.kalide.getRedsNoTruncate = function(id) { return util.kalide.kalidesNoTrunc(id, util.kalide.REDS); };

/* Single id single blue team color */
util.kalide.getBlue = function(id) { return util.kalide.kalide(id, util.kalide.BLUES); };

/* Retrieves up to 4 color ids (0-255) from a single 32bit integer, used for animated blue team colors */
util.kalide.getBlues = function(id) { return util.kalide.kalides(id, util.kalide.BLUES); };

/* Same as getBlues(id) but will return 4 slots with 'undefined' anywhere there is no set color (used in UI where the empty slots are shown) */
util.kalide.getBluesNoTruncate = function(id) { return util.kalide.kalidesNoTrunc(id, util.kalide.BLUES); };

/* does the magic */
util.kalide.kalide = function(id, list) {
  if(id >= 0 && id < list.length) { return list[id]; }
  else { return list[0]; }
};

/* does the magic up to 4 times */
util.kalide.kalides = function(id, list) {
  var ex = [
    id & 0xFF, (id >> 8) & 0xFF, (id >> 16) & 0xFF, (id >> 24) & 0xFF
  ];
  var colors = [];
  for(var i=0;i<ex.length;i++) {
    if(ex[i] !== 0 && ex[i] >= 0 && ex[i] < list.length) { colors.push(list[ex[i]]); }
  }
  if(colors.length < 1) { colors.push(list[0]); }
  return colors;
};

/* does the magic always 4 times */
util.kalide.kalidesNoTrunc = function(id, list) {
  var ex = [
    id & 0xFF, (id >> 8) & 0xFF, (id >> 16) & 0xFF, (id >> 24) & 0xFF
  ];
  var colors = [];
  for(var i=0;i<ex.length;i++) {
    if(ex[i] !== 0 && ex[i] >= 0 && ex[i] < list.length) { colors.push(list[ex[i]]); }
    else { colors.push(undefined); }
  }
  return colors;
};

/* Compresses up to 4 color ids (0-255) into a single 32bit integer */
util.kalide.compressColors = function(a, b, c, d) {
  a = a || 0;  b = b || 0;  c = c || 0;  d = d || 0;
  var comp = 0;
  comp = comp | (a & 0xFF) | ((b << 8) & 0xFF00) | ((c << 16) & 0xFF0000) | ((d << 24) & 0xFF000000);
  return comp;
};

/* Converts compressed color id back to 4 color ids. **does not truncate blanks */
util.kalide.decompressColors = function(id) {
  return [ id & 0xFF, (id >> 8) & 0xFF, (id >> 16) & 0xFF, (id >> 24) & 0xFF ];
};

util.kalide.getColor = function(id) {
  if(id >= 0 && id < util.kalide.COLORS.length) { return util.kalide.COLORS[id]; }
  else { return util.kalide.COLORS[0]; }
};