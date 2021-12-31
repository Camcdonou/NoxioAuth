"use strict";
/* global main */
/* global util */

function ToolDoodad(menu) {
  this.menu = menu;
  
  this.element = document.getElementById("tool-doodad");
  this.block = document.getElementById("tool-doodad-block");
  
  this.selection = {
    name: document.getElementById("tool-doodad-nam"),
    index: document.getElementById("tool-doodad-ind"),
    pos: document.getElementById("tool-doodad-pos"),
    rot: document.getElementById("tool-doodad-rot"),
    scale: document.getElementById("tool-doodad-scale")
  };
}

ToolDoodad.prototype.update = function() {
  if(this.selection.object) {
    this.selection.object.doodad = isNaN(parseInt(this.selection.index.value)) ? 0 : parseInt(this.selection.index.value);
    this.selection.object.pos = {
      x: isNaN(parseFloat(this.selection.pos.value.split(",")[0])) ? 0 : parseFloat(this.selection.pos.value.split(",")[0]),
      y: isNaN(parseFloat(this.selection.pos.value.split(",")[1])) ? 0 : parseFloat(this.selection.pos.value.split(",")[1]),
      z: isNaN(parseFloat(this.selection.pos.value.split(",")[2])) ? 0 : parseFloat(this.selection.pos.value.split(",")[2])
    };
    this.selection.object.rot = isNaN(parseFloat(this.selection.rot.value)) ? 0 : parseFloat(this.selection.rot.value);
    this.selection.object.scale = isNaN(parseFloat(this.selection.scale.value)) ? 0 : parseFloat(this.selection.scale.value);
    main.editor.selection = this.selection.object.pos;
  }
};

ToolDoodad.prototype.selected = function(selection) {
  this.selection.object = selection;
  
  if(selection) {  
    this.selection.name.innerHTML = "Edit Selected";
    this.selection.index.value = selection.doodad;
    this.selection.pos.value = selection.pos.x + ", " + selection.pos.y + ", " + selection.pos.z;
    this.selection.rot.value = selection.rot;
    this.selection.scale.value = selection.scale;
  }
  else {
    this.selection.name.innerHTML = "New";
    this.selection.index.value = "";
    this.selection.pos.value = "";
    this.selection.rot.value = "";
    this.selection.scale.value = "";
  }
};

ToolDoodad.prototype.setTool = function(index) {
  main.editor.tool = new EditorToolDoodad(main.editor, this, index);
};

ToolDoodad.prototype.show = function() {
  if(!main.editor) { this.element.innerHTML += "<div class='tool-header'>Error!</div>"; }
  main.editor.tool = undefined;
  main.editor.settings.cursor = 1;
  main.editor.settings.doodad = true;
  this.setTool(0);
  
  var pal = main.editor.map.doodadPallete;
  this.block.innerHTML = "<div class='tool-header'>Doodad Pallete</div>";
  for(var i=0;i<pal.length;i++) {
    this.block.innerHTML += "<div class='tool-button sm' onclick='main.menu.editor.doodad.setTool(" + i + ");'>" + pal[i].model.name + ":" + pal[i].material.name + "</div>";
  }

  this.menu.hideAll();
  this.element.style.display = "block";
};

ToolDoodad.prototype.hide = function() {
  this.element.style.display = "none";
};

function EditorToolDoodad(editor, menu, index) {
  this.editor = editor;
  this.menu = menu;
  this.index = index;
  
  this.selection = undefined;
  this.sInd = undefined;
  main.editor.selection = undefined;
  
  this.lmbimp = false;
  this.rmbimp = false;
}

EditorToolDoodad.prototype.handleMouse = function(mouse, selection) {
  if(mouse.lmb) {
    if(this.selection) {
      if(this.editor.input.keyboard.keys[17]) { if(!this.lmbimp) {
          
      }}
      else { this.selection.pos.x = selection.x; this.selection.pos.y = selection.y; }
    }
    this.lmbimp = true;
  }
  else if(mouse.rmb) {
    if(this.editor.input.keyboard.keys[17]) {
      if(!this.rmbimp) {
        var zval = this.selection?this.selection.pos.z:0;
        this.editor.map.doodads.push({doodad: this.index, pos: util.vec2.toVec3(selection, zval), rot: 0.0, scale: 1.0}); 
        this.selection = this.editor.map.doodads[this.editor.map.doodads.length-1];
        this.sInd = this.editor.map.doodads.length-1;
        main.editor.selection = this.selection.pos;
      }
    }
    else {
      this.selection = undefined;
      this.sInd = undefined;
      main.editor.selection = undefined;
      for(var i=0;i<this.editor.map.doodads.length;i++) {
        if(util.vec2.distance(selection, this.editor.map.doodads[i].pos) < 0.5) {
          this.selection = this.editor.map.doodads[i];
          this.sInd = i;
          main.editor.selection = this.editor.map.doodads[i].pos;
        }
      }
    }
    this.rmbimp = true;
  }
  if(!mouse.lmb) { this.lmbimp = false; }
  if(!mouse.rmb) { this.rmbimp = false; }
  if(mouse.rmb || mouse.lmb) { this.menu.selected(this.selection); }
};

EditorToolDoodad.prototype.handleKeyboard = function(keyboard, imp) {
  for(var i=0;i<imp.length;i++) {
    switch(imp[i]) {
      case 46 : {
        if(this.selection) {
          this.editor.map.doodads.splice(this.sInd, 1);
          this.selection = undefined;
          this.sInd = undefined;
          main.editor.selection = undefined;
          this.menu.selected(undefined);
        }
        break;
      }
      case 82 : {
          if(this.selection) {
            this.selection.rot += 0.785398;
            this.menu.selected(this.selection);
          }
          break;
      }
      case 33 : {
          if(this.selection) {
            this.selection.pos.z += 0.5;
            this.menu.selected(this.selection);
          }
          break;
      }
      case 34 : {
          if(this.selection) {
            this.selection.pos.z -= 0.5;
            this.menu.selected(this.selection);
          }
          break;
      }
      default : { break; }
    }
  }
};