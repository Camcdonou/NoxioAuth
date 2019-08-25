"use strict";
/* global main */

/* Custom game setup menu */
function CustomMenu() {
  this.element = document.getElementById("custom");
  this.elementMap = document.getElementById("custom-map");
  this.elementType = document.getElementById("custom-type");
  this.elementSettings = document.getElementById("custom-set");
  
  this.selectedMap = 6;
  this.selectedType = 1;
  this.selectedSettings = {rotation:[{}]};
  this.teamType = false;
  
  this.typeData = [
    {
      name: "Elimination",
      id: "elimination",
      team: false,
      settings: [
        {name: "Minimum Players", id: "min_players", type: "int"},
        {name: "Round Countdown", id: "round_start_time", type: "sec"}
      ]
    },
    {
      name: "Deathmatch",
      id: "deathmatch",
      team: false,
      settings: [
        {name: "Score Limit", id: "score_to_win", type: "int"},
        {name: "Respawn Time", id: "respawn_time", type: "sec"}
      ]
    },
    {
      name: "King",
      id: "king",
      team: false,
      settings: [
        {name: "Score Limit", id: "score_to_win", type: "int"},
        {name: "Respawn Time", id: "respawn_time", type: "sec"},
        {name: "Moving Hill", id: "static_hill", type: "bool"},
        {name: "Points To Move", id: "score_to_move", type: "int"}
      ]
    },
    {
      name: "Ultimate",
      id: "ultimate",
      team: false,
      settings: [
        {name: "Score Limit", id: "score_to_win", type: "int"},
        {name: "Respawn Time", id: "respawn_time", type: "sec"}
      ]
    },
    {
      name: "Rabbit",
      id: "rabbit",
      team: false,
      settings: [
        {name: "Score Limit", id: "score_to_win", type: "int"},
        {name: "Respawn Time", id: "respawn_time", type: "sec"}
      ]
    },
    {
      name: "Tag",
      id: "tag",
      team: false,
      settings: [
        {name: "Score Limit", id: "score_to_win", type: "int"},
        {name: "Respawn Time", id: "respawn_time", type: "sec"}
      ]
    },
    {
      name: "Team Elimination",
      id: "teamelimination",
      team: true,
      settings: [
        {name: "Auto-Balance", id: "auto_balance", type: "bool"},
        {name: "Minimum Players", id: "min_players", type: "int"},
        {name: "Round Countdown", id: "round_start_time", type: "sec"}
      ]
    },
    {
      name: "Team Deathmatch",
      id: "teamdeathmatch",
      team: true,
      settings: [
        {name: "Score", id: "score_to_win", type: "int"},
        {name: "Respawn", id: "respawn_time", type: "sec"},
        {name: "Auto-Balance", id: "auto_balance", type: "bool"}
      ]
    },
    {
      name: "Team King",
      id: "teamking",
      team: true,
      settings: [
        {name: "Score", id: "score_to_win", type: "int"},
        {name: "Respawn", id: "respawn_time", type: "sec"},
        {name: "Auto-Balance", id: "auto_balance", type: "bool"},
        {name: "Moving Hill", id: "static_hill", type: "bool"},
        {name: "Points To Move", id: "score_to_move", type: "int"}
      ]
    },
    {
      name: "Capture The Flag",
      id: "capturetheflag",
      team: true,
      settings: [
        {name: "Score", id: "score_to_win", type: "int"},
        {name: "Respawn", id: "respawn_time", type: "sec"},
        {name: "Auto-Balance", id: "auto_balance", type: "bool"}
      ]
    },
    {
      name: "Free Flag",
      id: "freestyleflag",
      team: true,
      settings: [
        {name: "Score", id: "score_to_win", type: "int"},
        {name: "Respawn", id: "respawn_time", type: "sec"},
        {name: "Auto-Balance", id: "auto_balance", type: "bool"}
      ]
    },
    {
      name: "Assault",
      id: "assault",
      team: true,
      settings: [
        {name: "Score", id: "score_to_win", type: "int"},
        {name: "Respawn", id: "respawn_time", type: "sec"},
        {name: "Auto-Balance", id: "auto_balance", type: "bool"}
      ]
    },
//    {
//      name: "Bomb",
//      id: "bomb",
//      team: true,
//      settings: [
//        {name: "Score", id: "score_to_win", type: "int"},
//        {name: "Respawn", id: "respawn_time", type: "sec"},
//        {name: "Auto-Balance", id: "auto_balance", type: "bool"},
//        {name: "Minimum Players", id: "min_players", type: "int"},
//        {name: "Round Countdown", id: "round_start_time", type: "sec"},
//        {name: "Round Time Limit", id: "round_time_limit", type: "sec"},
//        {name: "Round Limit", id: "round_limit", type: "int"}
//      ]
//    },
//    {
//      name: "Sports Ball",
//      id: "football",
//      team: true,
//      settings: [
//        {name: "Score", id: "score_to_win", type: "int"},
//        {name: "Respawn", id: "respawn_time", type: "sec"},
//        {name: "Auto-Balance", id: "auto_balance", type: "bool"}
//      ]
//    }
  ];
  
  this.mapData = [
    {
      name: "Attack Area",
      id: "attack",
      players: "3"
    },
    {
      name: "Battle Field",
      id: "battle",
      players: "12"
    },
    {
      name: "Big Place",
      id: "big",
      players: "16"
    },
    {
      name: "Cache 404",
      id: "area",
      players: "6"
    },
    {
      name: "Combat Zone",
      id: "combat",
      players: "4"
    },
    {
      name: "Dig Build",
      id: "dig",
      players: "4"
    },
    {
      name: "Final Destination",
      id: "final",
      players: "4"
    },
    {
      name: "Last Location",
      id: "last",
      players: "8"
    },
    {
      name: "Penultimate Platform",
      id: "pen",
      players: "10"
    },
    {
      name: "Prerequisite Point",
      id: "pre",
      players: "5"
    },
    {
      name: "War Ground",
      id: "war",
      players: "10"
    }
  ];
};

CustomMenu.prototype.generate = function() {
  this.generateMap();
  this.generateType();
};

CustomMenu.prototype.generateMap = function() {
  var gen = "";
  for(var i=0;i<this.mapData.length;i++) {
      var map = this.mapData[i];
      gen += "<div class='cstm-box " + (i===this.selectedMap?" cstm-box-selected":"") + "' onclick='main.menu.custom.selectMap("+i+")'>";
      gen += "<div class='cstm-box-img-cont'><img src='img/aes/map/" + map.id + ".png' class='cstm-box-img'></div>";
      gen += "<div class='cstm-box-name'>" + map.name + "</div>";
      gen += "<div class='cstm-box-players'>" + map.players + " Players</div></div>";
  }
  this.elementMap.innerHTML = gen;
};

CustomMenu.prototype.generateType = function() {
  var gen = "<div class='menu cat selected btn' onclick='main.menu.custom.toggleTeamType()'>" + (!this.teamType?"◄ Free For All ►":"◄ Team Game ►") + "</div>";
  for(var i=0;i<this.typeData.length;i++) {
      var type = this.typeData[i];
      if(type.team !== this.teamType) { continue; }
      gen += "<div id='custom-type-0' class='menu sub btn" + (i===this.selectedType?" selected":"") + "' onclick='main.menu.custom.selectType("+i+")'>" + type.name + "</div>";
  }
  this.elementType.innerHTML = gen;
  this.selectedSettings = {rotation:[{}]};
  this.generateSettings();
};

CustomMenu.prototype.generateSettings = function() {
  var type = this.typeData[this.selectedType];
  var gen = "<div class='menu cat selected not-btn'>Settings</div>";
  
  gen += "<div class='menu sub drop combo'>";
  gen += "<span class='combo-l'>Game Name&nbsp;</span>";
  gen += "<input class='combo-r' type='text' onchange='main.menu.custom.setNam(this.value)' placeholder=''/></div>";
  
  gen += "<div class='menu sub drop combo'>";
  gen += "<span class='combo-l'>Max Players&nbsp;</span>";
  gen += "<input class='combo-r' type='number' onchange='main.menu.custom.setMax(this.value)' placeholder='Default'/></div>";
  for(var i=0;i<type.settings.length;i++) {
    var set = type.settings[i];
    switch(set.type) {
      case "int" : {
        gen += "<div class='menu sub drop combo'>";
        gen += "<span class='combo-l'>" + set.name + "&nbsp;</span>";
        gen += "<input class='combo-r' type='number' onchange='main.menu.custom.setInt(this.value, \"" + set.id + "\")' placeholder='Default'/></div>";
        break;
      }
      case "sec" : {
        gen += "<div class='menu sub drop combo'>";
        gen += "<span class='combo-l'>" + set.name + "&nbsp;</span>";
        gen += "<input class='combo-r' type='number' onchange='main.menu.custom.setSec(this.value, \"" + set.id + "\")' placeholder='Default'/></div>";
        break;
      }
      case "bool" : {
        gen += "<div class='menu sub drop combo' onclick=''>";
        gen += "<span class='combo-l'>" + set.name + "&nbsp;</span>";
        gen += "<input id='custom-set-' class='combo-r' type='text' onclick='main.menu.custom.setBool(\"" + set.id + "\", this)' placeholder='Default'/></div>";
        break;
      }
    }
  }
  this.elementSettings.innerHTML = gen;
};

/* switch between showing ffa and team gametypes */
CustomMenu.prototype.toggleTeamType = function() {
  this.teamType = !this.teamType;
  this.selectedType = !this.teamType?1:7;
  this.generateType();
};

CustomMenu.prototype.selectMap = function(index) {
  this.selectedMap = index;
  this.generateMap();
};

CustomMenu.prototype.selectType = function(index) {
  this.selectedType = index;
  this.generateType();
  this.generateSettings();
};

CustomMenu.prototype.setNam = function(val) {
  if(val === undefined || val.trim() === "") { delete this.selectedSettings.game_name; return; }
  this.selectedSettings.game_name = val;
};

CustomMenu.prototype.setMax = function(val) {
  if(val === undefined || val.trim() === "") { delete this.selectedSettings.max_players; return; }
  this.selectedSettings.max_players = parseInt(val);
};

CustomMenu.prototype.setInt = function(val, id) {
  if(val === undefined || val.trim() === "") { delete this.selectedSettings.rotation[0][id]; return; }
  this.selectedSettings.rotation[0][id] = parseInt(val);
};

CustomMenu.prototype.setSec = function(val, id) {
  if(val === undefined || val.trim() === "") { delete this.selectedSettings.rotation[0][id]; return; }
  this.selectedSettings.rotation[0][id] = parseInt(val)*33;
};

CustomMenu.prototype.setBool = function(id, ele) {
  this.selectedSettings.rotation[0][id] = this.selectedSettings.rotation[0][id]===1?0:1;
  ele.value = this.selectedSettings.rotation[0][id]===1?"On":"Off";
};

CustomMenu.prototype.create = function() {
  if(!this.selectedSettings.game_name || this.selectedSettings.game_name.trim().length < 3) {
    main.menu.warning.show("You must set a lobby name that is at least 3 characters.");
    return;
  }
  this.selectedSettings.rotation[0].gametype = this.typeData[this.selectedType].id;
  this.selectedSettings.rotation[0].map_name = this.mapData[this.selectedMap].id;
  main.net.game.state.createLobby(this.selectedSettings);
};

CustomMenu.prototype.back = function() {
  main.menu.lobby.show();
};

CustomMenu.prototype.show = function() {
  main.menu.navigation("custom", "custom");
  main.menu.hideAll();
  main.menu.credit.show();
  main.menu.rank.show();
  this.generate();
  this.element.style.display = "block";
};

CustomMenu.prototype.hide = function() {
  this.element.style.display = "none";
};

/* Called when the back button is hit on this menu */
CustomMenu.prototype.onBack = function() {
  this.back();
};