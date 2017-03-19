"use strict";
/* global main */
/* global util */

/* Define Game Sound Class */
function Sound(game) {
  this.game = game;
  
  if(!this.initWebAudio()) { this.initFallback(); }
}

/* Returns true if webaudio is set up correctly, false if fuck no. */
Sound.prototype.initWebAudio = function() {
  try {
    this.game.window.AudioContext = this.game.window.AudioContext || this.game.window.webkitAudioContext;
    this.context = new AudioContext();
  }
  catch(ex) {
    main.menu.warning.show("WebAudio not supported. Sound disabled.");
    return false;
  }
  
  this.sounds = [];

  if(!this.createSound("multi/default.wav")) { return false; }
  
  this.loadAudio();
  
  return true;
};

/* Preloads all required audio assets for the game. */
Sound.prototype.loadAudio = function() {
  var paths = [
    "prank/classy.wav",
    "prank/uheh.wav",
    "prank/oowaa.wav",
    "prank/cumown.wav",
    "prank/blip.wav",
    "prank/ata.wav",
    "prank/toriya.wav",
    "prank/ha.wav"
  ];
  for(var i=0;i<paths.length;i++) { this.createSound(paths[i]); }
};

/* @FIXME do something */
Sound.prototype.initFallback = function() {
  this.context = undefined;
  // Lol ur fucked
};

/* Updates position of audio context for 3d sound */
Sound.prototype.update = function() {
  var pos = {x: -this.game.display.camera.pos.x, y: -this.game.display.camera.pos.y, z: 2.0};
  if(this.context.listener.positionX) {
    this.context.listener.positionX.value = pos.x;
    this.context.listener.positionY.value = pos.y;
    this.context.listener.positionZ.value = pos.z;
  }
  else { this.context.listener.setPosition(pos.x, pos.y, pos.z); }
  var forward = {x: 0.0, y: 0.0, z: -1.0};
  var up = util.vec3.rotateZ({x: 0.0, y: 1.0, z: 0.0}, this.game.display.camera.rot.z);
  if(this.context.listener.forwardX) {
    this.context.listener.forwardX.value = forward.x;
    this.context.listener.forwardY.value = forward.y;
    this.context.listener.forwardZ.value = forward.z;
    this.context.listener.upX.value = up.x;
    this.context.listener.upY.value = up.y;
    this.context.listener.upZ.value = up.z;
  } else {
    this.context.listener.setOrientation(0, 0,-1, 0, 1, 0);
  }
};

Sound.prototype.stopMusic = function() {
  if(this.music) { this.music.stop(); this.music = undefined; }
};

Sound.prototype.setMusic = function(sound, loop) {
  if(this.music) { 
    if(this.music.path === sound.path) { return; }
    this.music.stop();
  }
  this.music = sound;
  this.music.loop(loop);
  this.music.play();
};

/* Returns boolean. True if created succesfully and false if failed to create. */
Sound.prototype.createSound = function(path) {
  var snd = new SoundData(this.context, path);
  this.sounds.push(snd);
  return true;
};

/* Gets the sound at the path given. If it's not already loaded it loads it. If file not found returns default sound. */
Sound.prototype.getSound = function(path, gain) {
  for(var i=0;i<this.sounds.length;i++) {
    if(this.sounds[i].path === path) {
      return new SoundInstance(this.context, path, this.sounds[i], gain);
    }
  }
  
  if(this.createSound(path)) { return this.getSound(path); }
  
  main.menu.warning.show("Failed to load sound: '" + path + "'");
  return this.getSound("multi/default.wav");
};

Sound.prototype.getWorldSound = function(path, gain) {
  for(var i=0;i<this.sounds.length;i++) {
    if(this.sounds[i].path === path) {
      return new WorldSoundInstance(this.context, path, this.sounds[i], gain);
    }
  }
  
  if(this.createSound(path)) { return this.getWorldSound(path); }
  
  main.menu.warning.show("Failed to load sound: '" + path + "'");
  return this.getWorldSound("multi/default.wav");
};

/* Stop and unload all sounds */
Sound.prototype.destroy = function() {
  for(var i=0;i<this.sounds.length;i++) {
    this.sounds[i].destroy();
  }
  this.stopMusic();
};