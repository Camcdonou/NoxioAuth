"use strict";
/* global main */
/* global Display */

/* Converts string to an array of indices pointing to charcters in a font bitmap */
Display.prototype.font = {};
Display.prototype.font.getFontData = function(font) {
  for(var i=0;i<this.fonts.length;i++) {
    if(this.fonts[i].name === font) {
      return this.fonts[i];
    }
  }
  main.menu.warning.show("Invalid font lookup :: " + font);
  return undefined;
};

Display.prototype.font.getCharacterData = function(font, character) {
  for(var i=0;i<this.fonts.length;i++) {
    if(this.fonts[i].name === font) {
      var c = this.fonts[i].characters[character];
      if(!c) { return this.fonts[i].characters["!"]; }
      else { return c; }
    }
  }
  main.menu.warning.show("Invalid font lookup :: " + font + " :: " + character);
  return undefined; 
};

Display.prototype.font.fonts = [];
Display.prototype.font.fonts.push({
  "name": "Calibri",
  "size": 40,
  "bold": false,
  "italic": false,
  "width": 512,
  "height": 128,
  "characters": {
    "0":{"x":458,"y":39,"width":21,"height":28,"originX":0,"originY":27,"advance":20},
    "1":{"x":171,"y":68,"width":18,"height":28,"originX":-2,"originY":27,"advance":20},
    "2":{"x":0,"y":68,"width":20,"height":28,"originX":0,"originY":27,"advance":20},
    "3":{"x":20,"y":68,"width":20,"height":28,"originX":0,"originY":27,"advance":20},
    "4":{"x":350,"y":39,"width":22,"height":28,"originX":1,"originY":27,"advance":20},
    "5":{"x":79,"y":68,"width":19,"height":28,"originX":0,"originY":27,"advance":20},
    "6":{"x":427,"y":0,"width":20,"height":30,"originX":0,"originY":29,"advance":20},
    "7":{"x":40,"y":68,"width":20,"height":28,"originX":0,"originY":27,"advance":20},
    "8":{"x":296,"y":0,"width":20,"height":31,"originX":0,"originY":30,"advance":20},
    "9":{"x":98,"y":68,"width":19,"height":28,"originX":-1,"originY":27,"advance":20},
    " ":{"x":228,"y":96,"width":3,"height":3,"originX":1,"originY":1,"advance":9},
    "!":{"x":391,"y":0,"width":7,"height":31,"originX":-3,"originY":30,"advance":13},
    "\"":{"x":116,"y":96,"width":13,"height":12,"originX":-2,"originY":29,"advance":16},
    "#":{"x":405,"y":0,"width":22,"height":30,"originX":1,"originY":29,"advance":20},
    "$":{"x":180,"y":0,"width":18,"height":33,"originX":-1,"originY":27,"advance":20},
    "%":{"x":227,"y":0,"width":29,"height":31,"originX":0,"originY":30,"advance":29},
    "&":{"x":198,"y":0,"width":29,"height":31,"originX":0,"originY":30,"advance":27},
    "'":{"x":129,"y":96,"width":6,"height":12,"originX":-1,"originY":29,"advance":9},
    "(":{"x":0,"y":0,"width":11,"height":39,"originX":-1,"originY":32,"advance":12},
    ")":{"x":11,"y":0,"width":10,"height":39,"originX":-1,"originY":32,"advance":12},
    "*":{"x":94,"y":96,"width":14,"height":15,"originX":-3,"originY":31,"advance":20},
    "+":{"x":330,"y":68,"width":21,"height":22,"originX":1,"originY":24,"advance":20},
    ",":{"x":108,"y":96,"width":8,"height":13,"originX":-1,"originY":6,"advance":10},
    "-":{"x":216,"y":96,"width":12,"height":5,"originX":0,"originY":14,"advance":12},
    ".":{"x":186,"y":96,"width":8,"height":7,"originX":-1,"originY":6,"advance":10},
    "/":{"x":142,"y":0,"width":19,"height":33,"originX":2,"originY":30,"advance":15},
    ":":{"x":30,"y":96,"width":8,"height":21,"originX":-1,"originY":20,"advance":11},
    ";":{"x":240,"y":68,"width":8,"height":26,"originX":-1,"originY":19,"advance":11},
    "<":{"x":38,"y":96,"width":18,"height":20,"originX":0,"originY":23,"advance":20},
    "=":{"x":135,"y":96,"width":20,"height":11,"originX":0,"originY":19,"advance":20},
    ">":{"x":56,"y":96,"width":18,"height":20,"originX":-2,"originY":23,"advance":20},
    "?":{"x":353,"y":0,"width":17,"height":31,"originX":-1,"originY":30,"advance":19},
    "@":{"x":83,"y":0,"width":30,"height":33,"originX":-3,"originY":27,"advance":36},
    "A":{"x":140,"y":39,"width":25,"height":28,"originX":1,"originY":27,"advance":23},
    "B":{"x":416,"y":39,"width":21,"height":28,"originX":-1,"originY":27,"advance":22},
    "C":{"x":328,"y":39,"width":22,"height":28,"originX":0,"originY":27,"advance":21},
    "D":{"x":190,"y":39,"width":24,"height":28,"originX":-1,"originY":27,"advance":25},
    "E":{"x":153,"y":68,"width":18,"height":28,"originX":-1,"originY":27,"advance":20},
    "F":{"x":117,"y":68,"width":18,"height":28,"originX":-1,"originY":27,"advance":18},
    "G":{"x":115,"y":39,"width":25,"height":28,"originX":0,"originY":27,"advance":25},
    "H":{"x":283,"y":39,"width":23,"height":28,"originX":-1,"originY":27,"advance":25},
    "I":{"x":234,"y":68,"width":6,"height":28,"originX":-2,"originY":27,"advance":10},
    "J":{"x":221,"y":68,"width":13,"height":28,"originX":1,"originY":27,"advance":13},
    "K":{"x":437,"y":39,"width":21,"height":28,"originX":-1,"originY":27,"advance":21},
    "L":{"x":189,"y":68,"width":17,"height":28,"originX":-1,"originY":27,"advance":17},
    "M":{"x":58,"y":39,"width":30,"height":28,"originX":-2,"originY":27,"advance":34},
    "N":{"x":237,"y":39,"width":23,"height":28,"originX":-1,"originY":27,"advance":26},
    "O":{"x":88,"y":39,"width":27,"height":28,"originX":0,"originY":27,"advance":26},
    "P":{"x":479,"y":39,"width":20,"height":28,"originX":-1,"originY":27,"advance":21},
    "Q":{"x":113,"y":0,"width":29,"height":33,"originX":0,"originY":27,"advance":27},
    "R":{"x":394,"y":39,"width":22,"height":28,"originX":-1,"originY":27,"advance":22},
    "S":{"x":135,"y":68,"width":18,"height":28,"originX":0,"originY":27,"advance":18},
    "T":{"x":372,"y":39,"width":22,"height":28,"originX":1,"originY":27,"advance":19},
    "U":{"x":214,"y":39,"width":23,"height":28,"originX":-1,"originY":27,"advance":26},
    "V":{"x":165,"y":39,"width":25,"height":28,"originX":1,"originY":27,"advance":23},
    "W":{"x":20,"y":39,"width":38,"height":28,"originX":1,"originY":27,"advance":36},
    "X":{"x":260,"y":39,"width":23,"height":28,"originX":1,"originY":27,"advance":21},
    "Y":{"x":306,"y":39,"width":22,"height":28,"originX":1,"originY":27,"advance":19},
    "Z":{"x":60,"y":68,"width":19,"height":28,"originX":0,"originY":27,"advance":19},
    "[":{"x":73,"y":0,"width":10,"height":38,"originX":-2,"originY":31,"advance":12},
    "\\":{"x":161,"y":0,"width":19,"height":33,"originX":2,"originY":30,"advance":15},
    "]":{"x":63,"y":0,"width":10,"height":38,"originX":-1,"originY":31,"advance":12},
    "^":{"x":74,"y":96,"width":20,"height":17,"originX":0,"originY":30,"advance":20},
    "_":{"x":194,"y":96,"width":22,"height":5,"originX":1,"originY":-2,"advance":20},
    "`":{"x":175,"y":96,"width":11,"height":8,"originX":-1,"originY":30,"advance":12},
    "a":{"x":466,"y":68,"width":18,"height":22,"originX":0,"originY":21,"advance":19},
    "b":{"x":276,"y":0,"width":20,"height":31,"originX":-1,"originY":30,"advance":21},
    "c":{"x":448,"y":68,"width":18,"height":22,"originX":0,"originY":21,"advance":17},
    "d":{"x":256,"y":0,"width":20,"height":31,"originX":0,"originY":30,"advance":21},
    "e":{"x":371,"y":68,"width":20,"height":22,"originX":0,"originY":21,"advance":20},
    "f":{"x":370,"y":0,"width":14,"height":31,"originX":1,"originY":30,"advance":12},
    "g":{"x":447,"y":0,"width":20,"height":29,"originX":0,"originY":21,"advance":19},
    "h":{"x":316,"y":0,"width":19,"height":31,"originX":-1,"originY":30,"advance":21},
    "i":{"x":398,"y":0,"width":7,"height":31,"originX":-1,"originY":30,"advance":9},
    "j":{"x":51,"y":0,"width":12,"height":38,"originX":3,"originY":30,"advance":10},
    "k":{"x":335,"y":0,"width":18,"height":31,"originX":-1,"originY":30,"advance":18},
    "l":{"x":384,"y":0,"width":7,"height":31,"originX":-1,"originY":30,"advance":9},
    "m":{"x":279,"y":68,"width":30,"height":22,"originX":-1,"originY":21,"advance":32},
    "n":{"x":391,"y":68,"width":19,"height":22,"originX":-1,"originY":21,"advance":21},
    "o":{"x":309,"y":68,"width":21,"height":22,"originX":0,"originY":21,"advance":21},
    "p":{"x":467,"y":0,"width":20,"height":29,"originX":-1,"originY":21,"advance":21},
    "q":{"x":487,"y":0,"width":20,"height":29,"originX":0,"originY":21,"advance":21},
    "r":{"x":16,"y":96,"width":14,"height":22,"originX":-1,"originY":21,"advance":14},
    "s":{"x":0,"y":96,"width":16,"height":22,"originX":0,"originY":21,"advance":16},
    "t":{"x":206,"y":68,"width":15,"height":28,"originX":1,"originY":27,"advance":13},
    "u":{"x":410,"y":68,"width":19,"height":22,"originX":-1,"originY":21,"advance":21},
    "v":{"x":351,"y":68,"width":20,"height":22,"originX":1,"originY":21,"advance":18},
    "w":{"x":248,"y":68,"width":31,"height":22,"originX":1,"originY":21,"advance":29},
    "x":{"x":429,"y":68,"width":19,"height":22,"originX":1,"originY":21,"advance":17},
    "y":{"x":0,"y":39,"width":20,"height":29,"originX":1,"originY":21,"advance":18},
    "z":{"x":484,"y":68,"width":16,"height":22,"originX":0,"originY":21,"advance":16},
    "{":{"x":27,"y":0,"width":12,"height":38,"originX":0,"originY":31,"advance":13},
    "|":{"x":21,"y":0,"width":6,"height":39,"originX":-6,"originY":31,"advance":18},
    "}":{"x":39,"y":0,"width":12,"height":38,"originX":-1,"originY":31,"advance":13},
    "~":{"x":155,"y":96,"width":20,"height":9,"originX":0,"originY":16,"advance":20}
  }
});