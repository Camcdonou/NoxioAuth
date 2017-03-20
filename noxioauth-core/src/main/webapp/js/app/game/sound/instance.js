"use strict";
/* global main */

/* Define Sound Instance Classes */
function SoundInstance(context, path, soundData, gain, volume) {
  this.context = context;
  this.path = path;
  this.data = soundData;
  this.ready = false;
  this.played = false;
  
  if(!this.data.ready()) {
    main.menu.warning.show("Attempted to instance partially loaded sound data: '" + path + "'");
    return;
  }
  
  this.create(volume);
  if(gain) { this.volume(gain); }
}

SoundInstance.prototype.create = function(volume) {
  this.source = this.context.createBufferSource();      // Creates source
  this.source.buffer = this.data.buffer;                // Set source audio
  this.gain = this.context.createGain();
  this.gain.gain.value = 1.0;
  this.source.connect(this.gain);                       // Source -> Gain
  this.gain.connect(volume);                            // Gain -> Global Volume
  this.ready = true;
};

SoundInstance.prototype.orientation = function() { /* UNSUPPORTED */ };
SoundInstance.prototype.position = function() { /* UNSUPPORTED */ };

SoundInstance.prototype.volume = function(gain) {
  if(this.ready) { this.gain.gain.value = gain; }
};

SoundInstance.prototype.play = function() {
  if(this.ready && !this.played) { this.source.start(0); this.played = true; }
  else if(this.played) { main.menu.warning.show("Attempted to replay sound instance: '" + this.path + "'"); }
};

SoundInstance.prototype.stop = function() {
  if(this.ready && this.played) { this.source.stop(); }
};

SoundInstance.prototype.loop = function(loop) {
  if(this.ready) { this.source.loop = loop; }
};

/* Define Spatial Sound Instance Classes */
function SpatialSoundInstance(context, path, soundData, gain, volume) {
  SoundInstance.call(this, context, path, soundData, gain, volume);
}

SpatialSoundInstance.prototype.create = function(volume) {
  this.source = this.context.createBufferSource();      // Creates source
  this.source.buffer = this.data.buffer;                // Set sourcea audio
  this.gain = this.context.createGain();
  this.gain.gain.value = 1.0;
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
  this.panner.connect(volume);                         // Panner -> Global Volume
  this.panner.setPosition(1.0, 0.0, 0.0);
  this.panner.setOrientation(1.0, 0.0, 0.0);
  
  this.ready = true;
};

SpatialSoundInstance.prototype.orientation = function(orn) {
  if(this.data.ready() && this.ready) {
    if(this.panner.orientationX) {
      this.panner.orientationX.value = orn.x;
      this.panner.orientationY.value = orn.y;
      this.panner.orientationZ.value = orn.z;
    } else { this.panner.setOrientation(orn.x, orn.y, orn.z); }
  }
};

SpatialSoundInstance.prototype.position = function(pos) {
  if(this.data.ready() && this.ready) {
    if(this.panner.positionX) {
      this.panner.positionX.value = pos.x;
      this.panner.positionY.value = pos.y;
      this.panner.positionZ.value = pos.z;
    }
    else { this.panner.setPosition(pos.x, pos.y, pos.z); }
  }
};

SpatialSoundInstance.prototype.volume = SoundInstance.prototype.volume;
SpatialSoundInstance.prototype.play = SoundInstance.prototype.play;
SpatialSoundInstance.prototype.stop = SoundInstance.prototype.stop;
SpatialSoundInstance.prototype.loop = SoundInstance.prototype.loop;