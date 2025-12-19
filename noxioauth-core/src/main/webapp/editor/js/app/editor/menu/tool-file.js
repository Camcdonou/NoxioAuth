"use strict";
/* global main */

function ToolFile(menu) {
  this.menu = menu;
  
  this.element = document.getElementById("tool-file");
}

ToolFile.prototype.save = function() { //@TODO: Move to file.js where load functions are
    var type = "TEXT";
    var filename = main.file.lastFileName;
    var data = main.editor.compile();
  
    var file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
};

ToolFile.prototype.reload = function() {
};

ToolFile.prototype.show = function() {
  if(!main.editor) { this.element.innerHTML += "<div class='tool-header'>Error!</div>"; }
  main.editor.tool = undefined;
  main.editor.settings.cursor = 1;
  main.editor.selection = undefined;
  
  this.menu.hideAll();
  this.element.style.display = "block";
};

ToolFile.prototype.hide = function() {
  this.element.style.display = "none";
};