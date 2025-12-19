"use strict";
/* global main */

/* Custom game setup menu */
function AdvCustomMenu() {
  this.element = document.getElementById("advcustom");
    
  this.settings = {
    game_name: "",
    max_players: "",
    randomize: "",
    private: "",
    rotation: [
      {
        gametype: "deathmatch",
        map_name: "final"
      }
    ]
  };
  
  var loadSettings = JSON.parse(localStorage.getItem("customGameSettings"));
  if(loadSettings) { this.settings = loadSettings; }
  
  this.maps = [ // Temp. Filled out by a rest request for maps
    {id: 'final', name: "Final Destination"}
  ];
  
  this.gametypes = [
    {
      name: "Elimination",
      id: "elimination",
      team: false,
      settings: [
        {name: "Minimum Players", id: "min_players", type: "#"},
        {name: "Round Countdown", id: "round_start_time", type: "# Frames"}
      ]
    },
    {
      name: "Deathmatch",
      id: "deathmatch",
      team: false,
      settings: [
        {name: "Score Limit", id: "score_to_win", type: "#"},
        {name: "Respawn Time", id: "respawn_time", type: "# Frames"}
      ]
    },
    {
      name: "King",
      id: "king",
      team: false,
      settings: [
        {name: "Score Limit", id: "score_to_win", type: "#"},
        {name: "Respawn Time", id: "respawn_time", type: "# Frames"},
        {name: "Moving Hill", id: "static_hill", type: "0/1"},
        {name: "Points To Move", id: "score_to_move", type: "#"}
      ]
    },
    {
      name: "Ultimate",
      id: "ultimate",
      team: false,
      settings: [
        {name: "Score Limit", id: "score_to_win", type: "#"},
        {name: "Respawn Time", id: "respawn_time", type: "# Frames"}
      ]
    },
    {
      name: "Rabbit",
      id: "rabbit",
      team: false,
      settings: [
        {name: "Score Limit", id: "score_to_win", type: "#"},
        {name: "Respawn Time", id: "respawn_time", type: "# Frames"}
      ]
    },
    {
      name: "Tag",
      id: "tag",
      team: false,
      settings: [
        {name: "Score Limit", id: "score_to_win", type: "#"},
        {name: "Respawn Time", id: "respawn_time", type: "# Frames"}
      ]
    },
    {
      name: "Team Elimination",
      id: "teamelimination",
      team: true,
      settings: [
        {name: "Auto-Balance", id: "auto_balance", type: "0/1"},
        {name: "Minimum Players", id: "min_players", type: "#"},
        {name: "Round Countdown", id: "round_start_time", type: "# Frames"}
      ]
    },
    {
      name: "Team Deathmatch",
      id: "teamdeathmatch",
      team: true,
      settings: [
        {name: "Score", id: "score_to_win", type: "#"},
        {name: "Respawn", id: "respawn_time", type: "# Frames"},
        {name: "Auto-Balance", id: "auto_balance", type: "0/1"}
      ]
    },
    {
      name: "Team King",
      id: "teamking",
      team: true,
      settings: [
        {name: "Score", id: "score_to_win", type: "#"},
        {name: "Respawn", id: "respawn_time", type: "# Frames"},
        {name: "Auto-Balance", id: "auto_balance", type: "0/1"},
        {name: "Moving Hill", id: "static_hill", type: "0/1"},
        {name: "Points To Move", id: "score_to_move", type: "#"}
      ]
    },
    {
      name: "Capture The Flag",
      id: "capturetheflag",
      team: true,
      settings: [
        {name: "Score", id: "score_to_win", type: "#"},
        {name: "Respawn", id: "respawn_time", type: "# Frames"},
        {name: "Auto-Balance", id: "auto_balance", type: "0/1"}
      ]
    },
    {
      name: "Free Flag",
      id: "freestyleflag",
      team: true,
      settings: [
        {name: "Score", id: "score_to_win", type: "#"},
        {name: "Respawn", id: "respawn_time", type: "# Frames"},
        {name: "Auto-Balance", id: "auto_balance", type: "0/1"}
      ]
    },
    {
      name: "Assault",
      id: "assault",
      team: true,
      settings: [
        {name: "Score", id: "score_to_win", type: "#"},
        {name: "Respawn", id: "respawn_time", type: "# Frames"},
        {name: "Auto-Balance", id: "auto_balance", type: "0/1"}
      ]
    },
    {
      name: "Sports Ball",
      id: "sportsball",
      team: true,
      settings: [
        {name: "Score", id: "score_to_win", type: "#"},
        {name: "Respawn", id: "respawn_time", type: "# Frames"},
        {name: "Auto-Balance", id: "auto_balance", type: "0/1"}
      ]
    }
  ];
};

AdvCustomMenu.prototype.generate = function() {
  var gen = "";
  gen += "<div class='adv-cstm-main'>";
  
    /* Main Settings */
    gen += "<span id='advcustom-back' class='adv-cstm-btn' onclick='main.menu.advcustom.back()'>Back</span>";
    gen += "<span id='advcustom-create' class='adv-cstm-btn' onclick='main.menu.advcustom.create()'>Create Game</span>";
    gen += "||";
    gen += "<span id='advcustom-back' class='adv-cstm-btn' onclick='main.menu.advcustom.add()'>Add Map</span>";
    gen += "<span id='advcustom-create' class='adv-cstm-btn' onclick='main.menu.advcustom.remove()'>Remove Map</span>";
    gen += "<br>";
    gen += "<span class='adv-cstm-input'>Name<input class='adv-cstm-input-field' type='text' placeholder='Text' value='" + this.settings.game_name + "' onchange='main.menu.advcustom.set(\"game_name\", this.value)'></input></span>";
    gen += "<span class='adv-cstm-input'>Players<input class='adv-cstm-input-field' type='text' placeholder='#' value='" + this.settings.max_players + "' onchange='main.menu.advcustom.set(\"max_players\", this.value)'></input></span>";
    gen += "<span class='adv-cstm-input'>Randomize<input class='adv-cstm-input-field' type='text' placeholder='0/1' value='" + (this.settings.randomize?this.settings.randomize:"") + "' onchange='main.menu.advcustom.set(\"randomize\", this.value)'></input></span>";
    gen += "<span class='adv-cstm-input'>Private<input class='adv-cstm-input-field' type='text' placeholder='0/1' value='" + (this.settings.private?this.settings.private:"") + "' onchange='main.menu.advcustom.set(\"private\", this.value)'></input></span>";
    gen += "<div class='adv-cstm-splt'></div>";

    /* Individual map settings */
    for(var i=0;i<this.settings.rotation.length;i++) {
      var set = this.settings.rotation[i];
      var sgt; // Selected gametype object (not just the id)
      for(var j=0;j<this.gametypes.length;j++) {
        var gt = this.gametypes[j];
        if(set.gametype === gt.id) {
          sgt = gt;
          break;
        }
      }
      
      gen += "<div class='adv-cstm-section'>";
        /* # in list */
        gen += "<div class='adv-cstm-section-head'>";
        gen += "#" + (i+1);

        /* Gametype */
        gen += "<select class='adv-cstm-drop' name='Gametype-" + i + "' onchange='main.menu.advcustom.setGametype(" + i + ", this.value)'>";
        for(var j=0;j<this.gametypes.length;j++) {
          var gt = this.gametypes[j];
          if(set.gametype === gt.id) { gen += "<option value='" + gt.id + "' selected>" + gt.name + "</option>"; }
          else { gen += "<option value='" + gt.id + "'>" + gt.name + "</option>"; }
        }
        gen += "</select>";

        /* Map */
        gen += "<select class='adv-cstm-drop' name='Map-" + i + "' onchange='main.menu.advcustom.setMap(" + i + ", this.value)'>";
        for(var j=0;j<this.maps.length;j++) {
          var m = this.maps[j];
          if(set.map_name === m.id) { gen += "<option value='" + m.id + "' selected>" + m.name + " - " + m.author + "</option>"; }
          else { gen += "<option value='" + m.id + "'>" + m.name + " - " + m.author + "</option>"; }
        }
        gen += "</select>";

        gen += "</div>";
        
        /* Gametype specific settings */
        for(var j=0;j<sgt.settings.length;j++) {
          var s = sgt.settings[j];
          var v = set[s.id] ? set[s.id] : "";
          gen += "<span class='adv-cstm-input'>" + s.name + "<input class='adv-cstm-input-field' type='text' placeholder='" + s.type + "' value='" + v + "' onchange='main.menu.advcustom.setKey(" + i + ", \"" + s.id + "\", this.value)'></input></span>";
        }

      gen += "</div>";
    }
  
  gen += "</div>";
  
  this.element.innerHTML = gen;
};

AdvCustomMenu.prototype.setGametype = function(i, v) {
  this.settings.rotation[i] = {map_name: this.settings.rotation[i].map_name, gametype: v};
  this.generate();
  localStorage.setItem("customGameSettings", JSON.stringify(this.settings));
};

AdvCustomMenu.prototype.setMap = function(i, v) {
  this.settings.rotation[i].map_name = v;
  localStorage.setItem("customGameSettings", JSON.stringify(this.settings));
};

AdvCustomMenu.prototype.setKey = function(i, id, v) {
  if(v === "" || v === undefined) { delete this.settings.rotation[i][id]; }
  else { this.settings.rotation[i][id] = v; }
  localStorage.setItem("customGameSettings", JSON.stringify(this.settings));
};

AdvCustomMenu.prototype.set = function(id, v) {
  if(v === "" || v === undefined) { delete this.settings[id]; }
  else { this.settings[id] = v; }
  localStorage.setItem("customGameSettings", JSON.stringify(this.settings));
};

AdvCustomMenu.prototype.add = function() {
  this.settings.rotation.push({
    gametype: "deathmatch",
    map_name: "final"
  });
  this.generate();
  localStorage.setItem("customGameSettings", JSON.stringify(this.settings));
};

AdvCustomMenu.prototype.remove = function() {
  this.settings.rotation.splice(this.settings.rotation.length-1, 1);
  this.generate();
  localStorage.setItem("customGameSettings", JSON.stringify(this.settings));
};

AdvCustomMenu.prototype.create = function() {
  if(!this.settings.game_name || this.settings.game_name.trim().length < 3) {
    main.menu.warning.show("You must set a lobby name that is at least 3 characters.");
    return;
  }
  if(!this.settings.max_players) {
    main.menu.warning.show("You must set a max player limit.");
    return;
  }
  
  if(this.settings.randomize === "" || this.settings.randomize === undefined) { delete this.settings.randomize; }
  if(this.settings.private === "" || this.settings.private === undefined) { delete this.settings.private; }
  
  localStorage.setItem("customGameSettings", JSON.stringify(this.settings));
  
  main.net.game.state.createLobby(this.settings);
};

AdvCustomMenu.prototype.back = function() {
  main.menu.lobby.show();
  localStorage.setItem("customGameSettings", JSON.stringify(this.settings));
};

AdvCustomMenu.prototype.show = function() {
  main.menu.navigation("advcustom", "advcustom");
  main.menu.hideAll();
  main.menu.credit.hide();
  main.menu.rank.hide();
  
  var parent = this;
  
  var yee1 = function(data1) {
    /* Get stock map list */
    $.ajax({
      url: "/nxc/file/maps",
      type: 'GET',
      timeout: 3000,
      success: function(data2) { yee2(data1, data2); },
      error: function() { nee(); }
    });
  };
  
  var yee2 = function(data1, data2) {
    parent.maps = data1;
    for(var i=0;i<data2.length;i++) {
      parent.maps.push(data2[i]);
    }
    
    parent.generate();
    parent.element.style.display = "block";
  };
  
  var nee = function() {
    main.menu.warning.show("Failed to retrieve map list from server.");
    main.menu.lobby.show();
  };
  
  var address = main.net.game.address;
  var port = String(main.net.game.port);
  var protocol = (port === "443") ? "https://" : "http://";
  var portSuffix = (port === "443" || port === "80") ? "" : ":" + port;

  /* Get stock map list */
  $.ajax({
    url: protocol + address + portSuffix + "/nxg/maps",
    type: 'GET',
    timeout: 3000,
    success: function(data1) { yee1(data1); },
    error: function() { nee(); }
  });
};

AdvCustomMenu.prototype.hide = function() {
  this.element.style.display = "none";
};

/* Called when the back button is hit on this menu */
AdvCustomMenu.prototype.onBack = function() {
  this.back();
};