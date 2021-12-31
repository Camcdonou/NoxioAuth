"use strict";

var struct1 = [
  {id: "i", name: "Rank"},
  {id: "name", name: "Name"},
  {id: "lifeCredits", name: "Absolute Points"},
  {id: "kill", name: "Kills"},
  {id: "death", name: "Deaths"},
  {id: "betrayl", name: "Betrayals"},
  {id: "betrayed", name: "Betrayed"},
  {id: "firstBlood", name: "First Blood"},
  {id: "killJoy", name: "Killjoys"},
  {id: "endedReign", name: "Reigns Ended"},
  {id: "flagCapture", name: "Flags Capped"},
  {id: "hillControl", name: "Hills Kinged"},
  {id: "gameWin", name: "Wins"},
  {id: "gameLose", name: "Losses"},
  {id: "perfect", name: "Perfections"},
  {id: "humiliation", name: "Humiliations"},
  {id: "cumRes", name: "Cumulative Resistance <span class='btn' onclick='flip()'>↻</span>"}
];

var struct2 = [
  {id: "i", name: "Rank"},
  {id: "name", name: "Name"},
  {id: "mkx02", name: "Double"},
  {id: "mkx03", name: "Triple"},
  {id: "mkx04", name: "Quadra"},
  {id: "mkx05", name: "Ultra"},
  {id: "mkx06", name: "Mega"},
  {id: "mkx07", name: "Giga"},
  {id: "mkx08", name: "Killamity"},
  {id: "mkx09", name: "Killtrocity"},
  {id: "mkx10", name: "Killtastrophe"},
  {id: "mkx11", name: "Killpocalypse"},
  {id: "mkx12", name: "Killsplosion"},
  {id: "mkx13", name: "Killnado"},
  {id: "mkx14", name: "Killcumcision"},
  {id: "mkx15", name: "🍆"},
  {id: "mkx16", name: "🤔"},
  {id: "mkx17", name: "🐀"},
  {id: "mkx18", name: "💀"},
  {id: "ksx05", name: "Rampage"},
  {id: "ksx10", name: "Untouchable"},
  {id: "ksx15", name: "Impossible"},
  {id: "ksx20", name: "Invincible"},
  {id: "ksx25", name: "Inconceivable"},
  {id: "ksx30", name: "Godlike <span class='btn' onclick='flip()'>↻</span>"}
];

var flop = false;
var data;

var element = document.getElementById("main");
var generate = function() {
  var gen = "";
  
  var struct = flop?struct2:struct1;
  
  gen += "<table>";
  gen += "<tr>";
  for(var i=0;i<struct.length;i++) {
    var st = struct[i];
    gen += "<th>" + st.name + "</th>";
  }
  gen += "</tr>";
  
  for(var i=0;i<data.length;i++) {
    gen += "<tr>";
    var row = data[i];
    row.i = "#" + (i+1);
    for(var j=0;j<struct.length;j++) {
      var st = struct[j];
      gen += "<td>" + row[st.id] + "</td>";
    }
    gen += "</tr>";
  }
  gen += "</table>";
  
  element.innerHTML = gen;
};

var flip = function() {
  flop = !flop;
  generate();
};

var error = function() {
  element.innerHTML = "Something broke...";
};

var get = function() {
  $.ajax({
    url: "/nxc/leaders",
    type: 'GET',
    timeout: 3000,
    success: function(dat) { data = dat; generate(); },
    error: function() { error(); }
  });
};

get();