"use strict";
/* global main */
/* global util */

function ToolCollision(menu) {
  this.menu = menu;
  
  this.element = document.getElementById("tool-collision");
  
  this.elements = {
    floor : {
      edit: document.getElementById("tool-collision-floor-edit"),
      visible: document.getElementById("tool-collision-floor-visible")
    },
    wall : {
      edit: document.getElementById("tool-collision-wall-edit"),
      visible: document.getElementById("tool-collision-wall-visible")
    }
  };
  
  this.elements.floor.edit.checked = true;
}

ToolCollision.prototype.update = function() {  
  if(this.elements.floor.edit.checked) {
    this.elements.floor.visible.checked = true;
    main.editor.tool = new EditorToolCollision(main.editor, "floor");
  }
  else if(this.elements.wall.edit.checked) {
    this.elements.wall.visible.checked = true;
    main.editor.tool = new EditorToolCollision(main.editor, "wall");
  }
  else {
    main.editor.tool = undefined;
  }
  
  var floor = this.elements.floor.visible.checked;
  var wall = this.elements.wall.visible.checked;
  
  main.editor.settings.collision.draw = true;
  main.editor.settings.collision.floor = floor;
  main.editor.settings.collision.wall = wall;
};

ToolCollision.prototype.show = function() {
  if(!main.editor) { this.element.innerHTML += "<div class='tool-header'>Error!</div>"; }
  this.update();
  main.editor.settings.cursor = 1;
  main.editor.selection = undefined;

  this.menu.hideAll();
  this.element.style.display = "block";
};

ToolCollision.prototype.hide = function() {
  this.element.style.display = "none";
};

function EditorToolCollision(editor, index) {
  this.editor = editor;
  this.index = index;
  
  this.selection = {};
  main.editor.selection = undefined;
  
  this.lmbimp = false;
  this.rmbimp = false;
}

EditorToolCollision.prototype.handleMouse = function(mouse, selection) {
  if(mouse.lmb) {
    if(this.selection.point) {
      if(this.editor.input.keyboard.keys[17]) { if(!this.lmbimp) {
          this.editor.map.collision[this.index][this.selection.sind].splice(this.selection.pind, 0, selection);
          this.selection = {point: this.editor.map.collision[this.index][this.selection.sind][this.selection.pind], shape: this.editor.map.collision[this.index][this.selection.sind], sind: this.selection.sind, pind: this.selection.pind};
          main.editor.selection = this.selection.point;
      }}
      else { this.selection.point.x = selection.x; this.selection.point.y = selection.y; }
    }
    this.lmbimp = true;
  }
  else if(mouse.rmb) {
    if(this.editor.input.keyboard.keys[17]) {
      if(!this.rmbimp) { this.editor.map.collision[this.index].push( [ {x: selection.x, y: selection.y}, {x: selection.x+1.0, y: selection.y}, {x: selection.x+1.0, y: selection.y+1.0}, {x: selection.x, y: selection.y+1.0} ] ); }
    }
    else {
      this.selection = {};
      main.editor.selection = undefined;
      for(var i=0;i<this.editor.map.collision[this.index].length;i++) {
        for(var j=0;j<this.editor.map.collision[this.index][i].length;j++) {
          if(util.vec2.distance(selection, this.editor.map.collision[this.index][i][j]) < 0.5) {
            this.selection = {point: this.editor.map.collision[this.index][i][j], shape: this.editor.map.collision[this.index][i], sind: i, pind: j};
            main.editor.selection = this.selection.point;
          }
        }
      }
    }
    this.rmbimp = true;
  }
  if(!mouse.lmb) { this.lmbimp = false; }
  if(!mouse.rmb) { this.rmbimp = false; }
};

EditorToolCollision.prototype.handleKeyboard = function(keyboard, imp) {
  for(var i=0;i<imp.length;i++) {
    switch(imp[i]) {
      case 46 : {
          if(this.selection.shape) {
            if(this.editor.input.keyboard.keys[17]) { this.editor.map.collision[this.index].splice(this.selection.sind, 1); }
            else {
              this.editor.map.collision[this.index][this.selection.sind].splice(this.selection.pind, 1);
              if(this.editor.map.collision[this.index][this.selection.sind].length < 3) {
                this.editor.map.collision[this.index].splice(this.selection.sind, 1);
              }
            }
            this.selection = {}; this.editor.selection = undefined;
          }
          break;
        }
      default : { break; }
    }
  }
};