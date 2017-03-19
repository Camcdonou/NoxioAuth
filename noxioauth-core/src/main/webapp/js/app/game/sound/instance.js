"use strict";
/* global main */

/* Define Sound Instance Classes */
function SoundInstance(context, path, soundData, gain) { /* @FIXME clean up this garbage! */
  this.context = context;
  this.path = path;
  this.data = soundData;
  this.ready = false;
  
  if(!this.data.ready()) {
    main.menu.warning.show("Attempted to instance partially loaded sound data.");
    return;
  }
  
  this.create(gain);
}

SoundInstance.prototype.create = function(gain) {
  this.source = this.context.createBufferSource();      // Creates source
  this.source.buffer = this.data.buffer;                // Set source audio
  this.gain = this.context.createGain();
  this.gain.gain.value = gain;
  this.source.connect(this.gain);                       // Source -> Gain
  this.gain.connect(this.context.destination);          // Gain -> Speakers
  this.ready = true;
};

SoundInstance.prototype.gain = function(gain) {
  this.gain.gain.value = gain;
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

/* Define World Sound Instance Classes */
function WorldSoundInstance(context, path, soundData, gain) {
  this.context = context;
  this.path = path;
  this.data = soundData;
  this.ready = false;
  
  if(!this.data.ready()) {
    main.menu.warning.show("Attempted to instance partially loaded sound data.");
    return;
  }
  
  this.create(gain);
}

WorldSoundInstance.prototype.create = function(gain) {
  this.source = this.context.createBufferSource();      // Creates source
  this.source.buffer = this.data.buffer;                // Set sourcea audio
  this.gain = this.context.createGain();
  this.gain.gain.value = gain;
  this.panner = this.context.createPanner();
  this.panner.panningModel = 'HRTF';
  this.panner.distanceModel = 'linear';
  this.panner.refDistance = 0.5;
  this.panner.maxDistance = 12.5;
  this.panner.rolloffFactor = 1;
  this.panner.coneInnerAngle = 360;
  this.panner.coneOuterAngle = 0;
  this.panner.coneOuterGain = 0;
  this.source.connect(this.gain);                      // Source -> Gain
  this.gain.connect(this.panner);                      // Gain -> Panner
  this.panner.connect(this.context.destination);       // Panner -> Speakers
  this.panner.setPosition(1.0, 0.0, 0.0);
  this.panner.setOrientation(1.0, 0.0, 0.0);
  
  this.ready = true;
};

WorldSoundInstance.prototype.orientation = function(orn) {
  if(this.data.ready() && this.ready) {
    if(this.panner.orientationX) {
      this.panner.orientationX.value = orn.x;
      this.panner.orientationY.value = orn.y;
      this.panner.orientationZ.value = orn.z;
    } else { this.panner.setOrientation(orn.x, orn.y, orn.z); }
  }
};

WorldSoundInstance.prototype.position = function(pos) {
  if(this.data.ready() && this.ready) {
    if(this.panner.positionX) {
      this.panner.positionX.value = pos.x;
      this.panner.positionY.value = pos.y;
      this.panner.positionZ.value = pos.z;
    }
    else { this.panner.setPosition(pos.x, pos.y, pos.z); }
  }
};

SoundInstance.prototype.gain = function(gain) {
  this.gain.gain.value = gain;
};

WorldSoundInstance.prototype.play = function() {
  if(this.data.ready() && this.ready) { this.source.start(0); }
  else if(this.data.ready() && !this.ready) { this.create(); }
};

WorldSoundInstance.prototype.stop = function() {
  if(this.data.ready() && this.ready) { this.source.stop(); }
  else if(this.data.ready() && !this.ready) { this.create(); }
};

WorldSoundInstance.prototype.loop = function(loop) {
  this.source.loop = loop;
};