"use strict";
/* global main */

/* Define Sound Data Class */
function SoundData(context, path) {
  this.path = path;
  
  var tmp = this; /* Oh look. Javascript. */
  var request = new XMLHttpRequest();
  request.open('GET', "audio/" + path, true);
  request.responseType = 'arraybuffer';

  // Decode asynchronously
  request.onload = function() { tmp.onload(request, context); };
  request.send();
}

SoundData.prototype.onload = function(request, context) {
  var tmp = this; /* Anger... Rising... */
  context.decodeAudioData(request.response, function(buffer) {
    tmp.buffer = buffer;
  }, tmp.onError);
};

SoundData.prototype.onError = function() {
  
};

SoundData.prototype.ready = function() {
  return this.buffer !== undefined;
};

SoundData.prototype.destroy = function() {
  
};