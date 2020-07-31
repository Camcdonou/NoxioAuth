"use strict";
/* global main */

/* Define Sound Data Class */
function SoundData(context, path) {
  this.path = path;
  
  var tmp = this; /* Oh look. Javascript. */
  var request = new XMLHttpRequest();
  request.open('GET', "audio/" + path + "?v=_" + _VER() + "_", true);
  request.responseType = 'arraybuffer';

  // Decode asynchronously
  request.onload = function() { tmp.onload(request, context); };
  request.send();
}

SoundData.prototype.onload = function(request, context) {
  var tmp = this; /* Anger... Rising... */
  context.decodeAudioData(request.response,
    function(buffer) {   // Success
      tmp.buffer = buffer;
    },
    function() {  // Error
      main.menu.warning.show("Failed to decode audio file: " + tmp.path);
      tmp.buffer = main.game.sound.getSound("multi/default.wav", 1., 0., "ui").data.buffer; // @TODO: Hack! If audio fails to decode we go to default.wav's buffer
    }
  );
};

SoundData.prototype.ready = function() {
  return this.buffer !== undefined;
};

SoundData.prototype.destroy = function() {
  
};

/* ====== Custom Sound ====== */
/* Essentially identical but custom sounds pull from a different path */

function CustomSoundData(context, path) {
  this.path = path;
  
  var tmp = this; /* Oh look. Javascript. */
  var request = new XMLHttpRequest();
  request.open('GET', "file/sound/" + path + "?v=_" + _VER() + "_", true);
  request.responseType = 'arraybuffer';

  // Decode asynchronously
  request.onload = function() { tmp.onload(request, context); };
  request.send();
}

CustomSoundData.prototype.onload = SoundData.prototype.onload;
CustomSoundData.prototype.ready = SoundData.prototype.ready;
CustomSoundData.prototype.destroy = SoundData.prototype.destroy;