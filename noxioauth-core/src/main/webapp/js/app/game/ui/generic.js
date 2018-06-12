"use strict";
/* global main */
/* global util */

/* Define Abstract Generic UI Superclass Class */
function GenericUI(game, ui, name) {
  this.game = game;
  this.ui = ui;
  this.name = name;
  
  this.containers = [];
  this.sounds = [];
  
  this.generate();
  
  this.FADE_TIME = 10;
  this.fade = 0;
  
  this.hidden = true;               // Don't draw if hidden!
  this.interactable = false;        // Can this be clicked or typed on?
}

/* Container spec:
 * var container = new UIContainer(<ALIGN>);
 * container.add(<ELEMENT>);
 */

/* Align spec:
 * {x: <CHARACTER +-=>, y: <CHARACTER +-=>},     // +,+ would be TOP LEFT -,- would be BOTTOM RIGHT and =,= would be CENTER CENTER
 */

/* Element spec:
 * Element should conform to this data structure :
 * {
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

GenericUI.prototype.setVisible = function(bool) { if(bool) { this.show(); } else { this.hide(); } };
GenericUI.prototype.show = function() { this.hidden = false; };
GenericUI.prototype.hide = function() {
  for(var i=0;i<this.containers.length&&!this.hidden;i++) {                        // When a UI is hidden we disable the hover of each element so it wont show hovered when shown later.
    for(var j=0;j<this.containers[i].elements.length;j++) {
      this.containers[i].elements[j].isHovered = false;
    }
  }
  this.hidden = true;
};

/* ABSTRACT -- Called at the start of each step, if you want to rebuild the ui elements every frame then override this */
GenericUI.prototype.refresh = function() { };

/* ABSTRACT --Called at construction, override this method and build your elements in here */
GenericUI.prototype.generate = function() { };

/* Steps UI and returns true if imp input is absorbed by a UI element */
/* Window is a Vec2 of the size, in pixels, of the game window for this draw */
GenericUI.prototype.step = function(imp, state, window) {
  if(this.hidden) { this.fade = Math.max(0, Math.min(this.FADE_TIME, this.fade-1)); return false; }
  this.fade = Math.max(0, Math.min(this.FADE_TIME, this.fade+1));
  
  this.refresh();
  var hit = false;
  for(var i=0;i<this.containers.length;i++) {
    var elements = this.containers[i].elements;
    var align = this.containers[i].makeAlign(window);
    for(var j=0;j<elements.length;j++) {
      var hov = this.pointInElement(state.mouse.pos, elements[j], window, align);
      if(elements[j].hover) {  // Hover is an optional field so we check if it exists
        if(elements[j].hover.sound && !elements[j].isHovered && hov) {
          this.play(elements[j].hover.sound.path, elements[j].hover.sound.gain, elements[j].hover.sound.shift);
        }
        elements[j].isHovered = hov;
      }
    }
    for(var j=0;j<elements.length;j++) {
      if(elements[j].step(imp, state, window)) { hit = true; }
    }
  }
  return hit;
};

/* Tests if a point is inside of an element or not and returns true/false */
GenericUI.prototype.pointInElement = function(pos, element, window, align) {
  for(var j=0;j<element.neutral.block.length;j++) {
    var blok = element.neutral.block[j];
    var coordAdjust = util.vec2.make(pos.x, window.y-pos.y);                    // GL draws from bottom-left because.... downs?
    if(util.intersection.pointRectangle(coordAdjust, util.vec2.add(blok.pos, align), blok.size)) { return true; }
  }
  return false;
};

GenericUI.prototype.play = function(path, gain, shift) {
  var snd = this.game.sound.getSound(path, gain, shift, "ui");
  this.sounds.push(snd);
  snd.play();
};

/* Window is a Vec2 of the size, in pixels, of the game window for this draw */
GenericUI.prototype.getDraw = function(blocks, texts, window) {
  if(this.hidden && this.fade < 1) { return false; }
  var fademult = this.fade/this.FADE_TIME;
  
  for(var i=0;i<this.containers.length;i++) {
    var elements = this.containers[i].elements;
    var align = this.containers[i].makeAlign(window);
    for(var j=0;j<elements.length;j++) {
      var fld = elements[j].isHovered ? "hover" : "neutral";                 // Oh yeah Mr. Krabs
      var blc = elements[j][fld].block;
      var txt = elements[j][fld].text;
      for(var k=0;k<blc.length;k++) {
        blocks.push({
          material: blc[k].material,
          uniforms: [
            {name: "transform", data: util.vec2.toArray(util.vec2.add(blc[k].pos, align))},
            {name: "size", data: util.vec2.toArray(blc[k].size)},
            {name: "color", data: util.vec4.toArray(util.vec4.multiply(blc[k].color, util.vec4.make(1,1,1,fademult)))}
          ]
        });
      }
      for(var k=0;k<txt.length;k++) {
        texts.push({
          font: txt[k].font,
          material: txt[k].material,
          text: txt[k].text,
          pos: util.vec2.add(txt[k].pos, align),
          size: txt[k].size,
          uniforms: [
            {name: "color", data: util.vec4.toArray(util.vec4.multiply(txt[k].color, util.vec4.make(1,1,1,fademult)))}
          ]
        });
      }
    }
  }
};

/* Clears UI, generally called if a UI is going to repeat it's generate() function to update itself. */
GenericUI.prototype.clear = function() {
  this.containers.splice(0, this.containers.length);
};

/* -- ABSTRACT cleanup when closing game */
GenericUI.prototype.destroy = function() {
  for(var i=0;i<this.sounds.length;i++) {
    this.sounds[i].stop();
  }
};

/* Define UIContainer */
/* The point of this class is to have an object to place elements in so I can align them as
 * a group, instead of individually.
 */
function UIContainer(align) {
  this.align = align;
  this.elements = [];
};

UIContainer.prototype.add = function(element) {
  this.elements.push(element);
};

/* Returns a vec2 with the offset needed to align this container correctly on the screen */
UIContainer.prototype.makeAlign = function(window) {
  var x,y;
  var w,h;
  for(var i=0;i<this.elements.length;i++) {
    for(var j=0;j<this.elements[i].neutral.block.length;j++) {
      var block = this.elements[i].neutral.block[j];
      if(!x || block.pos.x < x) { x = block.pos.x; }
      if(!y || block.pos.y < y) { y = block.pos.y; }
      if(!w || block.pos.x+block.size.x > w) { w = block.pos.x+block.size.x; }
      if(!h || block.pos.y+block.size.y > h) { h = block.pos.y+block.size.y; }
    }
  }
  
  var a,b;
  switch(this.align.x) {
    case "-" : { a = window.x-w; break; }
    case "=" : { a = (window.x-w)*0.5; break; }
    default  : { a = 0; break; }
  }
  switch(this.align.y) {
    case "-" : { b = window.y-h; break; }
    case "=" : { b = (window.y-h)*0.5; break; }
    default  : { b = 0; break; }
  }
  return util.vec2.make(a,b);
};

/* Define Abstract Generic UI Block Super Class */
function GenericUIBlock(pos, size, color, material) {
  this.pos = pos;           // <Vec2>
  this.size = size;         // <Vec2>
  this.color = color;       // <Vec4>
  this.material = material; // <Material>
}

/* Define Abstract Generic UI Text Super Class */
function GenericUIText(pos, size, color, font, material, text) {
  this.pos = pos;           // <Vec2>
  this.size = size;         // <Float>
  this.color = color;       // <Vec4>
  this.font = font;         // <String>
  this.material = material; // <Material>
  this.text = text;         // <String>
}