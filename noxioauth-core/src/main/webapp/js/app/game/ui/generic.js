"use strict";
/* global main */
/* global util */

/* Define Abstract Generic UI Superclass Class */
function GenericUI(game, name) {
  this.game = game;
  this.name = name;
  
  this.elements = [];               // Stuff to draw!
  
  this.generate();
  
  this.hidden = true;               // Don't draw if hidden!
  this.interactable = false;        // Can this be clicked or typed on?
}

/* Elements spec:
 * Elements should conform to this data structure :
 * {
 *    align: {x: <CHARACTER +-=>, y: <CHARACTER +-=>},     // +,+ would be TOP LEFT -,- would be BOTTOM RIGHT and =,= would be CENTER CENTER
 *    neutral: {
 *      block: [<GENERICUIBLOCK>],
 *      text:  [<GENERICUITEXT>],
 *    },
 *    hover: {                                             // Optional!
 *      block: [<GENERICUIBLOCK>],
 *      text:  [<GENERICUITEXT>],
 *    },
 *    step:  <BOOLEAN FUNCTION(imp, state, window)>,       // Returns true if the imp input is used by this element, else it returns false.
 *    isHovered: <FALSE>                                   // This will be automatically flagged if mouse is over this element
 * }
 */

GenericUI.prototype.show = function() { this.hidden = false; };
GenericUI.prototype.hide = function() { this.hidden = true;  };

/* ABSTRACT -- Called at the start of each step, if you want to rebuild the ui elements every frame then override this */
GenericUI.prototype.refresh = function() { };

/* ABSTRACT --Called at construction, override this method and build your elements in here */
GenericUI.prototype.generate = function() { };

/* Steps UI and returns true if imp input is absorbed by a UI element */
/* Window is a Vec2 of the size, in pixels, of the game window for this draw */
GenericUI.prototype.step = function(imp, state, window) {
  if(this.hidden) { return false; }
  
  this.refresh();
  for(var i=0;i<this.elements.length;i++) {
    var hov = this.pointInElement(state.mouse.pos, this.elements[i], window);
    if(this.elements[i].hover) { this.elements[i].isHovered = hov; }            // Hover is an optional field so we check if it exists
  }
  var hit = false;
  for(var i=0;i<this.elements.length;i++) {
    if(this.elements[i].step(imp, state, window)) { hit = true; }
  }
  return hit;
};

/* Tests if a point is inside of an element or not and returns true/false */
GenericUI.prototype.pointInElement = function(pos, element, window) {
  for(var j=0;j<element.neutral.block.length;j++) {
    var blok = element.neutral.block[j];
    var align = util.vec2.create();
    var coordAdjust = util.vec2.make(pos.x, window.y-pos.y);                    // GL draws from bottom-left because.... downs?
    var ss = util.vec2.multiply(util.vec2.divide(coordAdjust, window), {x: 100.0, y: 100.0*(window.y/window.x)});
    if(util.intersection.pointRectangle(ss, blok.pos, blok.size)) { return true; }
  }
  return false;
};

/* Window is a Vec2 of the size, in pixels, of the game window for this draw */
GenericUI.prototype.getDraw = function(blocks, texts, window) {
  if(this.hidden) { return false; }
  
  for(var i=0;i<this.elements.length;i++) {
    var align = util.vec2.create();
    
    var fld = this.elements[i].isHovered ? "hover" : "neutral";                 // Oh yeah Mr. Krabs
    var blc = this.elements[i][fld].block;
    var txt = this.elements[i][fld].text;
    for(var j=0;j<blc.length;j++) {
      blocks.push({
        material: blc[j].material,
        uniforms: [
          {name: "transform", data: util.vec2.toArray(util.vec2.add(blc[j].pos, align))},
          {name: "size", data: util.vec2.toArray(blc[j].size)},
          {name: "color", data: util.vec4.toArray(blc[j].color)}
        ]
      });
    }
    for(var j=0;j<txt.length;j++) {
      texts.push({
        material: txt[j].material,
        text: txt[j].text,
        pos: util.vec2.add(txt[j].pos, align),
        size: txt[j].size,
        uniforms: [
          {name: "fontSize", data: txt[j].size},
          {name: "color", data: util.vec4.toArray(txt[j].color)}
        ]
      });
    }
  }
};

/* -- ABSTRACT cleanup when closing game */
GenericUI.prototype.destroy = function() { };

/* Define Abstract Generic UI Block Super Class */
function GenericUIBlock(pos, size, color, material) {
  this.pos = pos;           // <Vec2>
  this.size = size;         // <Vec2>
  this.color = color;       // <Vec4>
  this.material = material; // <Material>
}

/* Define Abstract Generic UI Text Super Class */
function GenericUIText(pos, size, color, material, text) {
  this.pos = pos;           // <Vec2>
  this.size = size;         // <Float>
  this.color = color;       // <Vec4>
  this.material = material; // <Material>
  this.text = text;         // <String>
}