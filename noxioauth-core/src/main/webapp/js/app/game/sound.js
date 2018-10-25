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
    var ACc = window.AudioContext || window.webkitAudioContext;
    this.context = new ACc();
  }
  catch(ex) {
    main.menu.warning.show("WebAudio not supported. Intializing fallback mode...");
    return false;
  }
  
  this.sounds = [];
  
  if(!this.createSound("multi/default.wav")) { return false; }
  if(!this.createSound("multi/reverb.wav")) { return false; }
  this.reverbData = this.sounds[this.sounds.length-1];
  
  this.masterVolume = this.context.createGain();
  this.masterVolume.gain.value = 1.0;
  this.masterVolume.connect(this.context.destination); // Global Volume -> Speakers
  
  this.reverb = this.context.createConvolver();
  //this.reverb.buffer = this.reverbData.buffer;
  this.reverb.connect(this.masterVolume);  // Reverb -> Global Volume
  
  this.effectVolume = this.context.createGain();
  this.effectVolume.gain.value = 1.0;
  this.effectVolume.connect(this.reverb); // Effect Volume -> Reverb
  
  this.voiceVolume = this.context.createGain();
  this.voiceVolume.gain.value = 1.0;
  this.voiceVolume.connect(this.reverb); // Voice Volume -> Reverb
  
  this.announcerVolume = this.context.createGain();
  this.announcerVolume.gain.value = 1.0;
  this.announcerVolume.connect(this.masterVolume); // Anouncer Volume -> Master Volume
  
  this.uiVolume = this.context.createGain();
  this.uiVolume.gain.value = 1.0;
  this.uiVolume.connect(this.masterVolume); // Ui Volume -> Master Volume
  
  this.musicVolume = this.context.createGain();
  this.musicVolume.gain.value = 1.0;
  this.musicVolume.connect(this.masterVolume); // Music Volume -> Master Volume
  
  this.updateVolume();
  
  return true;
};

Sound.prototype.initFallback = function() {
  this.context = undefined;
  this.sounds = [];
};

/* Updates position of audio context for 3d sound */
Sound.prototype.update = function() {
  if(this.reverbData.buffer !== undefined && this.oof !== true) { /* @TODO: Hacky but functional */
    this.reverb.buffer = this.reverbData.buffer;
    this.oof = true;
  }
  this.updateVolume();
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

/* Set Master Volume */
Sound.prototype.updateVolume = function() {
  this.masterVolume.gain.value = main.settings.volume.master;
  this.effectVolume.gain.value = main.settings.volume.fx;
  this.voiceVolume.gain.value = main.settings.volume.voice;
  this.announcerVolume.gain.value = main.settings.volume.announcer;
  this.uiVolume.gain.value = main.settings.volume.ui;
  this.musicVolume.gain.value = main.settings.volume.music;
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

Sound.prototype.stopMusic = function() {
  if(this.music) { this.music.stop(); this.music = undefined; }
};

/* Returns boolean. True if created succesfully and false if failed to create. */
Sound.prototype.createSound = function(path) {
  var snd = new SoundData(this.context, path);
  this.sounds.push(snd);
  return true;
};

/* Returns boolean. True if created succesfully and false if failed to create. */
Sound.prototype.createCustomSound = function(name) {
  var snd = new CustomSoundData(this.context, name);
  this.sounds.push(snd);
  return true;
};

/* Gets the sound at the path given. If it's not already loaded it loads it. If file not found returns default sound. */
Sound.prototype.getSound = function(path, gain, shift, type) {
  var volume;
  switch(type) {
    case "voice" : { volume = this.voiceVolume; break; }
    case "announcer" : { volume = this.announcerVolume; break; }
    case "ui" : { volume = this.uiVolume; break; }
    case "music" : { volume = this.musicVolume; break; }
    default : { volume = this.effectVolume; break; }
  }
  
  for(var i=0;i<this.sounds.length;i++) {
    if(this.sounds[i].path === path) {
      return new SoundInstance(this.context, path, this.sounds[i], gain, shift, volume);
    }
  }
  
  if(this.createSound(path)) { return this.getSound(path); }
  
  main.menu.warning.show("Failed to load sound: '" + path + "'");
  return this.getSound("multi/default.wav");
};

/* Gets the sound at the path given. If it's not already loaded it loads it. If file not found returns default sound. */
Sound.prototype.getSpatialSound = function(path, gain, shift, type) {
  var volume;
  switch(type) {
    case "voice" : { volume = this.voiceVolume; break; }
    case "announcer" : { volume = this.announcerVolume; break; }
    case "ui" : { volume = this.uiVolume; break; }
    case "music" : { volume = this.musicVolume; break; }
    default : { volume = this.effectVolume; break; }
  }
  
  for(var i=0;i<this.sounds.length;i++) {
    if(this.sounds[i].path === path) {
      return new SpatialSoundInstance(this.context, path, this.sounds[i], gain, shift, volume);
    }
  }
  
  if(this.createSound(path)) { return this.getSpatialSound(path); }
  
  main.menu.warning.show("Failed to load sound: '" + path + "'");
  return this.getSpatialSound("multi/default.wav");
};

/* Stop and unload all sounds */
Sound.prototype.destroy = function() {
  for(var i=0;i<this.sounds.length;i++) {
    this.sounds[i].destroy();
  }
  this.stopMusic();
  this.sounds = [];
  this.context.close();
};