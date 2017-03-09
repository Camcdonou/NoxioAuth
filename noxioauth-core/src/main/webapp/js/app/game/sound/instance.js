"use strict";
/* global main */

/* Define Sound Instance Classes */
function SoundInstance(context, path, soundData) {
  this.context = context;
  this.path = path;
  this.data = soundData;
  this.ready = false;
  
  if(!this.data.ready()) {
    main.menu.warning.show("Attempted to instance partially loaded sound data.");
    return;
  }
  
  this.create();
}

SoundInstance.prototype.create = function() {
  this.source = this.context.createBufferSource();      // creates a sound source
  this.source.buffer = this.data.buffer;                // tell the source which sound to play
  this.source.connect(this.context.destination);        // connect the source to the context's destination (the speakers)
  this.ready = true;
};

SoundInstance.prototype.play = function() {
  if(this.data.ready() && this.ready) { this.source.start(0); }
  else if(this.data.ready() && !this.ready) { this.create(); }
};

SoundInstance.prototype.stop = function() {
  if(this.data.ready() && this.ready) { this.source.stop(); }
  else if(this.data.ready() && !this.ready) { this.create(); }
};

SoundInstance.prototype.loop = function(loop) {
  this.source.loop = loop;
};