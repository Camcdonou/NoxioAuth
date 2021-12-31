"use strict";
/* global main */
/* global util */

function ToolSpawn(menu) {
  this.menu = menu;
  
  this.element = document.getElementById("tool-spawn");
  
  this.selection = {
    name: document.getElementById("tool-spawn-name"),
    type: document.getElementById("tool-spawn-type"),
    team: document.getElementById("tool-spawn-team"),
    pos: document.getElementById("tool-spawn-pos"),
    block: document.getElementById("tool-spawn-block")
  };
  
  this.selection.name.innerHTML = "Create New";
  this.selection.type.value = "player";
  this.selection.team.value = "0";
  this.selection.pos.value = "";
  this.selection.block.value = "deathmatch";
}

ToolSpawn.prototype.update = function() {
  if(this.selection.object) {
    this.selection.object.type = this.selection.type.value;
    this.selection.object.team = isNaN(parseInt(this.selection.team.value)) ? 0 : parseInt(this.selection.team.value);
    this.selection.object.pos = {
      x: isNaN(parseFloat(this.selection.pos.value.split(",")[0])) ? 0 : parseFloat(this.selection.pos.value.split(",")[0]),
      y: isNaN(parseFloat(this.selection.pos.value.split(",")[1])) ? 0 : parseFloat(this.selection.pos.value.split(",")[1])
    };
    this.selection.object.mode = this.selection.block.value.replace(/\s/g, "").split(",");
    main.editor.selection = this.selection.object.pos;
  }
};

ToolSpawn.prototype.selected = function(selection) {
  this.selection.object = selection;
  
  if(selection) {  
    this.selection.name.innerHTML = "Edit Selected";
    this.selection.type.value = selection.type;
    this.selection.team.value = selection.team;
    this.selection.pos.value = selection.pos.x + ", " + selection.pos.y;
    this.selection.block.value = "";
    for(var i=0;i<selection.mode.length;i++) {
      this.selection.block.value += selection.mode[i] + (i<selection.mode.length-1 ? "," : "");
    }
  }
  else {
    this.selection.name.innerHTML = "Create New";
    this.selection.pos.value = "";
  }
};

ToolSpawn.prototype.show = function() {
  if(!main.editor) { this.element.innerHTML += "<div class='tool-header'>Error!</div>"; }
  main.editor.tool = undefined;
  main.editor.settings.cursor = 1;
  main.editor.settings.spawn = true;
  main.editor.tool = new EditorToolSpawn(main.editor, this);

  this.menu.hideAll();
  this.element.style.display = "block";
};

ToolSpawn.prototype.hide = function() {
  this.element.style.display = "none";
};

function EditorToolSpawn(editor, menu) {
  this.editor = editor;
  this.menu = menu;
  
  this.selection = undefined;
  this.sInd = undefined;
  main.editor.selection = undefined;
  
  this.lmbimp = false;
  this.rmbimp = false;
}

EditorToolSpawn.prototype.handleMouse = function(mouse, selection) {
  if(mouse.lmb) {
    if(this.selection) {
      this.selection.pos.x = selection.x; this.selection.pos.y = selection.y;
    }
    this.lmbimp = true;
  }
  else if(mouse.rmb) {
    if(this.editor.input.keyboard.keys[17]) {
      if(!this.rmbimp) {
        this.editor.map.spawns.push({type: this.menu.selection.type.value, team: this.menu.selection.team.value, pos: selection, mode: this.menu.selection.block.value.replace(/\s/g, "").split(",")}); 
        this.selection = this.editor.map.spawns[this.editor.map.spawns.length-1];
        this.sInd = this.editor.map.spawns.length-1;
        main.editor.selection = this.selection.pos;
      }
    }
    else {
      this.selection = undefined;
      this.sInd = undefined;
      main.editor.selection = undefined;
      for(var i=0;i<this.editor.map.spawns.length;i++) {
        if(util.vec2.distance(selection, this.editor.map.spawns[i].pos) < 0.5) {
          this.selection = this.editor.map.spawns[i];
          this.sInd = i;
          main.editor.selection = this.editor.map.spawns[i].pos;
        }
      }
    }
    this.rmbimp = true;
  }
  if(!mouse.lmb) { this.lmbimp = false; }
  if(!mouse.rmb) { this.rmbimp = false; }
  if(mouse.rmb || mouse.lmb) { this.menu.selected(this.selection); }
};

EditorToolSpawn.prototype.handleKeyboard = function(keyboard, imp) {
  for(var i=0;i<imp.length;i++) {
    switch(imp[i]) {
      case 46 : { 
        if(this.selection) {
          this.editor.map.spawns.splice(this.sInd, 1);
          this.selection = undefined;
          this.sInd = undefined;
          main.editor.selection = undefined;
          this.menu.selected(undefined);
        }
        break;
      }
      default : { break; }
    }
  }
};