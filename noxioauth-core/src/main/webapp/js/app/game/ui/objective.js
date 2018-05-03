"use strict";
/* global main */
/* global util */
/* global GenericUI */
/* global GenericUIBlock */
/* global GenericUIText */

/* Define Game UI Respawn Menu Class */
function ObjectiveUI(game, ui, name) {  
  this.ICON_FADE_RANG = 2.5;    // Radius to start fading in icon
  this.ICON_FADE_DIST = 1;      // Distance from starting fade to being fully opaque
  GenericUI.call(this, game, ui, name);
}

ObjectiveUI.prototype.setVisible = GenericUI.prototype.setVisible;
ObjectiveUI.prototype.show = GenericUI.prototype.show;
ObjectiveUI.prototype.hide = GenericUI.prototype.hide;
ObjectiveUI.prototype.refresh = function() {
  this.clear();
  this.generate();
};

ObjectiveUI.prototype.generate = function() {
  if(!this.game.objects) { return; }                                  // Initial generate() call must be ignored for safety!
                                                                      // This is because we look at game objects to place nametags on them.
  var parent = this;
  var colorMat = this.game.display.getMaterial("ui.color");           // Basic color material
  var flagMat = this.game.display.getMaterial("ui.flag");             // Flag icon
  var kingMat = this.game.display.getMaterial("ui.king");             // King of the Hill icon
  var ultMat = this.game.display.getMaterial("ui.ultimate");          // Ultimate Lifeform icon
  var fontMat  = this.game.display.getMaterial("ui.calibri");         // Font material
  var fontName = "Calibri";                                           // Name of this font for text rendering
  
  var black  = util.vec4.make(0.0, 0.0, 0.0, 0.5);
  var swhite = util.vec4.make(1.0, 1.0, 1.0, 1.0);
  
  var container = new UIContainer({x: '+', y: '+'});
  
  var objectives = [];
  for(var i=0;i<this.game.objects.length;i++) {
    if(this.game.objects[i].type() === "flg" && this.game.objects[i].onBase === 0 && !this.game.objects[i].hide) {
      var dist = util.vec2.distance(this.game.objects[i].pos, util.vec2.inverse(util.vec3.toVec2(this.game.display.camera.pos)));
      var fade = Math.min(Math.max(0, dist-this.ICON_FADE_RANG)/this.ICON_FADE_DIST, 1);
      objectives.push({mat: flagMat, pos: util.vec2.toVec3(this.game.objects[i].pos, this.game.objects[i].height+1.0), team: this.game.objects[i].team, fade: fade, offset: 0});
    }
    else if(this.game.objects[i].type() === "hil" && !this.game.objects[i].hide) {
      var dist = util.vec2.distance(this.game.objects[i].pos, util.vec2.inverse(util.vec3.toVec2(this.game.display.camera.pos)));
      var fade = Math.min(Math.max(0, dist-this.ICON_FADE_RANG)/this.ICON_FADE_DIST, 1);
      objectives.push({mat: kingMat, pos: util.vec2.toVec3(this.game.objects[i].pos, this.game.objects[i].height+1.0), team: -1, fade: fade, offset: 0});
    }
    else if(this.game.objects[i].objective && !this.game.objects[i].hide) {
      var dist = util.vec2.distance(this.game.objects[i].pos, util.vec2.inverse(util.vec3.toVec2(this.game.display.camera.pos)));
      var fade = Math.min(Math.max(0, dist-this.ICON_FADE_RANG)/this.ICON_FADE_DIST, 1);
      objectives.push({mat: ultMat, pos: util.vec2.toVec3(this.game.objects[i].pos, this.game.objects[i].height+1.0), team: -1, fade: fade, offset: 32});
    }
  }
  
  var s = 32;
  var v = s*0.5;
  
  for(var i=0;i<objectives.length;i++) {
    var screenCoord = util.matrix.projection(this.game.window, this.game.display.camera, objectives[i].pos);
    
    var x = (Math.min(0.9, Math.max(0.1, ((screenCoord.x*0.5)+0.5))) * this.game.display.window.width) - (v);
    var y = (Math.min(0.9, Math.max(0.1, ((screenCoord.y*0.5)+0.5))) * this.game.display.window.height) - (v) + objectives[i].offset;
    
    var bclr = util.vec4.copy(black); bclr.w *= objectives[i].fade;
    var fclr = util.vec4.copy(objectives[i].team===-1?swhite:util.kalide.getColorAuto(0, objectives[i].team)); fclr.w *= objectives[i].fade;
    container.add({
      neutral: {
        block: [
          new GenericUIBlock(util.vec2.make(x,y), util.vec2.make(s,s), bclr, colorMat),
          new GenericUIBlock(util.vec2.make(x,y), util.vec2.make(s,s), fclr, objectives[i].mat)
        ],
        text:  []
      },
      step: function(imp, state, window) { return false; },
      isHovered: false
    });
  }
  
  this.containers.push(container);
};

ObjectiveUI.prototype.pointInElement = GenericUI.prototype.pointInElement;

ObjectiveUI.prototype.step = GenericUI.prototype.step;
ObjectiveUI.prototype.getDraw = GenericUI.prototype.getDraw;

ObjectiveUI.prototype.clear = GenericUI.prototype.clear;
ObjectiveUI.prototype.destroy = GenericUI.prototype.destroy;