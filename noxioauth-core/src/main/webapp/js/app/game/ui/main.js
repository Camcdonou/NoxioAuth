"use strict";
/* global main */
/* global util */

/* Define Game UI Main Menu Class */
function MainUI(game, name) {
  this.game = game;
  this.name = name;
  this.create(this.game.display);
  
  this.hidden = true;
  this.interactable = true;
}

MainUI.prototype.show = function() {
  this.hidden = false;
  this.blocks[0].text = main.net.user + "@" + main.net.game.state.info.name + "@" + main.net.game.info.name;
  this.blocks[0].size.x = util.text.lengthOnScreen(this.blocks[0].text, this.blocks[0].fontSize);
};

MainUI.prototype.hide = function() {
  this.hidden = true;
};

MainUI.prototype.create = function(display) {
  var containsProto = function(point, window) {
    var ss = util.vec2.multiply(util.vec2.divide(point, window), {x: 100.0, y: 100.0*(window.y/window.x)});
    var align = {x: 0, y: 100.0*(window.y/window.x)};
    var pos = util.vec2.add(this.pos, align);
    ss.y = align.y - ss.y;
    return ss.x >= pos.x &&
           ss.x < pos.x+this.size.x &&
           ss.y >= pos.y &&
           ss.y < pos.y+this.size.y;
  };
  
  var tmp = this; // Fucking javascript get out reeeeeeeeeeeeeeeeeeeee
  
  this.blocks = [
    {
      neutral: {
        material: display.getMaterial("material.ui.grey"),
        text: [1.0, 1.0, 1.0]
      },
      text: "[Server Info]",
      fontSize: 2.0,
      pos: {x: 0.0, y: -2.0},
      size: {x: 26.0, y: 2.0},
      contains: function() { return false; },
      click: function() { }
    },
    {
      neutral: {
        material: display.getMaterial("material.ui.white_solid"),
      },
      pos: {x: 0.0, y: -2.2},
      size: {x: 18.0, y: 0.2},
      contains: function() { return false; },
      click: function() { }
    },
    {
      neutral: {
        material: display.getMaterial("material.ui.grey"),
        text: [1.0, 1.0, 1.0]
      },
      hover: {
        material: display.getMaterial("material.ui.white"),
        text: [0.0, 0.0, 0.0]
      },
      text: "Change Team",
      fontSize: 1.5,
      pos: {x: 0.0, y: -3.7},
      size: {x: 20.0, y: 1.5},
      contains: containsProto,
      click: function() {
        main.net.game.send({type: "i00", data: "07;"});
      }
    },
    {
      neutral: {
        material: display.getMaterial("material.ui.grey"),
        text: [1.0, 1.0, 1.0]
      },
      hover: {
        material: display.getMaterial("material.ui.white"),
        text: [0.0, 0.0, 0.0]
      },
      text: "Reset Game",
      fontSize: 1.5,
      pos: {x: 0.0, y: -5.2},
      size: {x: 20.0, y: 1.5},
      contains: containsProto,
      click: function() {
        main.net.game.send({type: "i00", data: "06;"});
      }
    },
    {
      neutral: {
        material: display.getMaterial("material.ui.grey"),
        text: [1.0, 1.0, 1.0]
      },
      hover: {
        material: display.getMaterial("material.ui.white"),
        text: [0.0, 0.0, 0.0]
      },
      text: "Mute Sound",
      fontSize: 1.5,
      pos: {x: 0.0, y: -6.7},
      size: {x: 20.0, y: 1.5},
      contains: containsProto,
      tog: true,
      click: function() {
        if(this.tog) { tmp.game.sound.setVolume(0.0); this.text = "Unmute Sound"; }
        else { tmp.game.sound.setVolume(0.5); this.text = "Mute Sound"; }
        this.tog = !this.tog;
      }
    },
    {
      neutral: {
        material: display.getMaterial("material.ui.grey"),
        text: [1.0, 1.0, 1.0]
      },
      hover: {
        material: display.getMaterial("material.ui.white"),
        text: [0.0, 0.0, 0.0]
      },
      text: "Enable Debug",
      fontSize: 1.5,
      pos: {x: 0.0, y: -8.2},
      size: {x: 20.0, y: 1.5},
      contains: containsProto,
      click: function() {
        var debugMenu = tmp.game.ui.getElement("debug"); 
        if(!debugMenu.hidden) { debugMenu.hide(); this.text = "Enable Debug"; }
        else { debugMenu.show(); this.text = "Disable Debug"; }
      }
    },
    {
      neutral: {
        material: display.getMaterial("material.ui.grey"),
        text: [1.0, 1.0, 1.0]
      },
      hover: {
        material: display.getMaterial("material.ui.white"),
        text: [0.0, 0.0, 0.0]
      },
      text: "Enable Cheats",
      fontSize: 1.5,
      pos: {x: 0.0, y: -9.7},
      size: {x: 20.0, y: 1.5},
      contains: containsProto,
      click: function() { tmp.game.sound.setMusic(tmp.game.sound.getSound("prank/classy.wav", 1.0), true); this.text = "Hahahahaha"; }
    },
    {
      neutral: {
        material: display.getMaterial("material.ui.grey"),
        text: [1.0, 1.0, 1.0]
      },
      hover: {
        material: display.getMaterial("material.ui.white"),
        text: [0.0, 0.0, 0.0]
      },
      text: "Generate Cache",
      fontSize: 1.5,
      pos: {x: 0.0, y: -11.2},
      size: {x: 20.0, y: 1.5},
      contains: containsProto,
      click: function() { tmp.game.generateCache(); }
    },
    {
      neutral: {
        material: display.getMaterial("material.ui.grey"),
        text: [1.0, 1.0, 1.0]
      },
      hover: {
        material: display.getMaterial("material.ui.white"),
        text: [0.0, 0.0, 0.0]
      },
      text: "Leave Game",
      fontSize: 1.5,
      pos: {x: 0.0, y: -12.7},
      size: {x: 20.0, y: 1.5},
      contains: containsProto,
      click: function(button) { tmp.game.leave(); }
    }
  ];
};

MainUI.prototype.handleInput = function(key) {
  // Escape key toggles this menu
  if(key === 27) {
    if(this.hidden) { this.show(); }
    else { this.hide(); }
    return true;
  } 
  if(this.hidden) { return false; }
  return false;
};

/* Window size is needed since UI is scaled to window size. */
MainUI.prototype.handleClick = function(button, mouse, window) {
  if(this.hidden) { return false; }
  
  for(var i=0;i<this.blocks.length;i++) {
    var block = this.blocks[i];
    if(block.contains(mouse, window)) {
      block.click(button);
      return true;
    }
  }
  return false;
};

MainUI.prototype.getDraw = function(blocks, text, mouse, window) {
  if(this.hidden) { return false; }
  
  var align = {x: 0, y: 100.0*(window.y/window.x)};
  for(var i=0;i<this.blocks.length;i++) {
    var block = this.blocks[i];
    if(block.contains(mouse, window)) {
      blocks.push({material: block.hover.material, pos: util.vec2.add(block.pos, align), size: block.size});
      if(block.text) { text.push({text: block.text, size: block.fontSize, color: block.hover.text, pos: util.vec2.add(block.pos, align)}); }
    }
    else {
      blocks.push({material: block.neutral.material, pos: util.vec2.add(block.pos, align), size: block.size});
      if(block.text) { text.push({text: block.text, size: block.fontSize, color: block.neutral.text, pos: util.vec2.add(block.pos, align)}); }
    }
  }
};

MainUI.prototype.destroy = function() {
  
};