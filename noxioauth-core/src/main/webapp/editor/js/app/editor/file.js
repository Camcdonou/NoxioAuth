"use strict";
/* global main */

/* Class that reads, parses, and writes map files for Noxio Mapper */
function File() {
  this.lastFileName = "untitled.map";
}

File.prototype.open = function(e) {
  var file = e.target.files[0];
  var tmp = this; // Fucking javascript ugh...
  this.lastFileName = file.name;
  if (!file) {
    return;
  }
  this.file = undefined;
  var reader = new FileReader();
  reader.onload = function(e) {
    var r = e.target.result;
		tmp.file = r;
  };
  reader.readAsText(file);
  
  //Wait until map is fully loaded then parse...
  var opened = function() {
    if(tmp.file === undefined) {
      setTimeout(function() { opened(); }, 500);
    }
    else {
      //GOTCHA!
      tmp.parse(tmp.file);
    }
  };

  opened();
};

File.prototype.parse = function(raw) {
  var map = {};
  
  try {
    var fields = raw.replace(/[\n\r]/g, "").split("\|");

    /* Field#0 - Info */
    var info = fields[0].split(";");
    map.name = info[0];
    map.description = info[1];
    map.gametypes = [];
    var gts = info[2].split(",");
    for(var i=0;i<gts.length;i++) { 
      map.gametypes.push(gts[i]);
    }
    
    /* Field#1 - Sky */
    map.sky = fields[1];

    /* Field#2 - Tile Set */
    var ts = fields[2].split(";");
    map.tileSet = [];
    for(var i=0;i<ts.length;i++) {
      var t = ts[i].split(",");
      map.tileSet.push({model: t[0], material: t[1]});
    }

    /* Field#3 - Map Bounds */
    var bnds = fields[3].split(",");
    map.bounds = [];
    for(var i=0;i<bnds.length;i++) {
      map.bounds[i] = parseInt(bnds[i]);
    }

    /* Field#4 - Map Data */
    var m = fields[4].split(",");
    var k = 0;
    map.map = [];
    for(var i=0;i<map.bounds[1];i++) { //Fill 2D arary because javascript reasons
      map.map.push([]);
    }
    for(var i=0;i<map.bounds[1];i++) {
      for(var j=0;j<map.bounds[0];j++) {
       map.map[map.bounds[1]-i-1][j] = {ind: parseInt(m[k++]), rot: 0}; //Read map y backwards because GL renders from bottom not top
      }
    }
    for(var i=0;i<map.bounds[1];i++) {
      for(var j=0;j<map.bounds[0];j++) {
       map.map[map.bounds[1]-i-1][j].rot = parseInt(m[k++]);            //Read map y backwards because GL renders from bottom not top
      }
    }
    
    /* Field#5 - Doodad Pallete */
    var dp = fields[5].split(";");
    map.doodadPallete = [];
    if(dp[0].length < 1) { dp = []; }
    for(var i=0;i<dp.length;i++) {
      var d = dp[i].split(",");
      map.doodadPallete.push({model: d[0], material: d[1]});
    }
    
    /* Field#6 - Doodads */
    var dds = fields[6].split(";");
    if(dds[0].length < 1) { dds = []; }
    map.doodads = [];
    for(var i=0;i<dds.length;i++) {
      var dd = dds[i].split(",");
      map.doodads.push({doodad: parseInt(dd[0]), pos: {x: parseFloat(dd[1]), y: parseFloat(dd[2]), z: parseFloat(dd[3])}, rot: parseFloat(dd[4]), scale: parseFloat(dd[5])});
    }
    
    map.collision = {floor: [], wall: []};
    
    /* Field#7 - Floor Collision */
    var cf = fields[7].split(";");
    if(cf[0].length < 1) { cf = []; }
    for(var i=0;i<cf.length;i++) {
      var c = cf[i].split(",");
      var s = [];
      for(var j=0;j<c.length;j+=2) {
        s.push({x: parseFloat(c[j]), y: parseFloat(c[j+1])});
      }
      map.collision.floor.push(s);
    }
    
    /* Field#8 - Wall Collision */
    var cw = fields[8].split(";");
    if(cw[0].length < 1) { cw = []; }
    for(var i=0;i<cw.length;i++) {
      var c = cw[i].split(",");
      var s = [];
      for(var j=0;j<c.length;j+=2) {
        s.push({x: parseFloat(c[j]), y: parseFloat(c[j+1])});
      }
      map.collision.wall.push(s);
    }
    
    /* Field#9 - Spawns */
    var sps = fields[9].split(";");
    if(sps[0].length < 1) { sps = []; }
    map.spawns = [];
    for(var i=0;i<sps.length;i++) {
      var sp = sps[i].split(",");
      map.spawns.push({type: sp[0], team: parseInt(sp[1]), pos: {x: parseFloat(sp[2]), y: parseFloat(sp[3])}, mode: sp.splice(4,sp.length-4)});
    }
    
    /* Field#10 - Cache */
    map.cache = fields[10];
  }
  catch(ex) {
    /* main.menu.file.error(ex); */
    return;
  }
  
  main.load(map);
};