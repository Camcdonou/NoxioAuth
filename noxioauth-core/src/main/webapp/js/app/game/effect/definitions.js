"use strict";
/* global util */
/* global PointLight */
/* global PointLightInterp */
/* global Decal */
/* global SpatialSoundInstance */

/* Effect definitions. EffectDefinition objects in this class are called ''''''statically'''''' to generate effects. */
var NxFx = {};

/* global ParticleStun */
NxFx.hit = {
  generic: new EffectDefinition(
    "Hit-Generic", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: ParticleStun, params: ["<game *>", "<vec3 pos>", "<vec3 vel>"], attachment: true, delay: 0}
    ]
  ),
  slash: new EffectDefinition(
    "Hit-Slash", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", ["multi/hit/slash0.wav", "multi/hit/slash1.wav", "multi/hit/slash2.wav"], 0.5, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  electric: new EffectDefinition(
    "Hit-Electric", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", ["multi/hit/electric0.wav", "multi/hit/electric1.wav", "multi/hit/electric2.wav"], 0.5, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  fire: new EffectDefinition(
    "Hit-Fire", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", ["multi/hit/fire0.wav", "multi/hit/fire1.wav", "multi/hit/fire2.wav"], 0.5, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  critical: new EffectDefinition(
    "Hit-Critical", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", ["multi/hit/critical0.wav"], 0.5, 0.0, "effect"], attachment: true, delay: 0}
    ]
  )
};

/* global ParticleAirJump */
/* global ParticleBloodSplat */
NxFx.player = {
  jump: new EffectDefinition(
    "Player-Jump", util.vec3.make(0, 0, 0), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", ["character/generic/jump0.wav", "character/generic/jump1.wav", "character/generic/jump2.wav"], 0.5, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  airJump: new EffectDefinition(
    "Player-AirJump", util.vec3.make(0, 0, 0.01), 0, true,
    [
      {class: ParticleAirJump, params: ["<game *>", "<vec3 pos>", "<vec3 vel>"], attachment: false, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", ["character/generic/air0.wav", "character/generic/air1.wav", "character/generic/air2.wav"], 0.5, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  land: new EffectDefinition(
    "Player-Land", util.vec3.make(0, 0, 0), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", ["character/generic/land0.wav", "character/generic/land1.wav", "character/generic/land2.wav"], 0.5, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  splat: new EffectDefinition(
    "Player-Splat", util.vec3.make(0, 0, 0.25), 0, false,
    [
      {class: ParticleBloodSplat, params: ["<game *>", "<vec3 pos>", "<vec3 vel>"], attachment: false, delay: 0},
      {class: Decal, params: ["<game *>", "character.player.decal.bloodsplat", "<vec3 pos>", util.vec3.make(0.0, 0.0, 1.0), 1.5, Math.random()*6.28319 /* @TODO: fixed random */, util.vec4.make(1, 1, 1, 1), 2, 450, 150], attachment: false, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", ["multi/impact/impact0.wav", "multi/impact/impact1.wav", "multi/impact/impact2.wav"], 0.5, 0.0, "effect"], attachment: false, delay: 0}
    ]
  )
};

/* global PlayerFox */
/* global ParticleBlip */
/* global ParticleDash */
NxFx.fox = {
  blip: new EffectDefinition(
    "Fox-Blip", util.vec3.make(0, 0, 0.5), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerFox.BLIP_COLOR_A, util.vec4.copy3(PlayerFox.BLIP_COLOR_B, 0.75), util.vec4.copy3(PlayerFox.BLIP_COLOR_B, 0)], [2.75, 4.5], 18, "fast"], attachment: true, delay: 0},
      {class: ParticleBlip, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerFox.BLIP_COLOR_A, PlayerFox.BLIP_COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/fox/blip0.wav", 0.5, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  dash: new EffectDefinition(
    "Fox-Dash", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerFox.BLIP_COLOR_A, util.vec4.copy3(PlayerFox.BLIP_COLOR_B, 0.5), util.vec4.copy3(PlayerFox.BLIP_COLOR_B, 0)], [2.75, 4.0], 30, "fast"], attachment: false, delay: 0},
      {class: ParticleDash, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerFox.BLIP_COLOR_A, PlayerFox.BLIP_COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/fox/dash0.wav", 0.5, 0.0, "effect"], attachment: true, delay: 0}
    ]
  )
};

/* global PlayerFalco */
/* global ParticleBlip */
/* global ParticleCharge */
NxFx.falco = {
  blip: new EffectDefinition(
    "Falco-Blip", util.vec3.make(0, 0, 0.5), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerFalco.BLIP_COLOR_A, util.vec4.copy3(PlayerFalco.BLIP_COLOR_B, 0.75), util.vec4.copy3(PlayerFalco.BLIP_COLOR_B, 0)], [2.75, 4.5], 18, "fast"], attachment: true, delay: 0},
      {class: ParticleBlip, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerFalco.BLIP_COLOR_A, PlayerFalco.BLIP_COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/falco/blip0.wav", 0.5, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  charge: new EffectDefinition(
    "Falco-Charge", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerFalco.CHARGE_COLOR_A, PlayerFalco.CHARGE_COLOR_B], [1.25, 2.25], 30, "linear"], attachment: true, delay: 0},
      {class: ParticleCharge, params: ["<game *>", "<vec3 pos>", "<vec3 vel>"], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/falco/dash0.wav", 0.5, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  dash: new EffectDefinition(
    "Falco-Dash", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerFalco.BLIP_COLOR_A, util.vec4.copy3(PlayerFalco.BLIP_COLOR_B, 0.5), util.vec4.copy3(PlayerFalco.BLIP_COLOR_B, 0)], [2.75, 4.0], 30, "fast"], attachment: false, delay: 0},
      {class: ParticleDash, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerFalco.BLIP_COLOR_A, PlayerFalco.BLIP_COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/falco/dash1.wav", 0.5, 0.0, "effect"], attachment: true, delay: 0}
    ]
  )
};

/* global PlayerShiek */
/* global ParticleBlip */
/* global ParticleMark */
NxFx.shiek = {
  blip: new EffectDefinition(
    "Shiek-Blip", util.vec3.make(0, 0, 0.5), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerShiek.BLIP_COLOR_A, util.vec4.copy3(PlayerShiek.BLIP_COLOR_B, 0.75), util.vec4.copy3(PlayerShiek.BLIP_COLOR_B, 0)], [2.75, 4.5], 18, "fast"], attachment: true, delay: 0},
      {class: ParticleBlip, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerShiek.BLIP_COLOR_A, PlayerShiek.BLIP_COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/shiek/blip0.wav", 0.5, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  mark: new EffectDefinition(
    "Shiek-Mark", util.vec3.make(0, 0, 0.01), 0, true,
    [
//      {class: SpatialSoundInstance, params: ["<sound *>", "multi/hit/slash0.wav", 0.5, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  no: new EffectDefinition(
    "Shiek-Mark", util.vec3.make(0, 0, 0.01), 0, true,
    [
//      {class: SpatialSoundInstance, params: ["<sound *>", "multi/hit/slash0.wav", 0.5, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  location: new EffectDefinition(
    "Shiek-Location", util.vec3.make(0, 0, 0.01), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerFox.BLIP_COLOR_A, util.vec4.copy3(PlayerFox.BLIP_COLOR_B, 0.5), util.vec4.copy3(PlayerFox.BLIP_COLOR_B, 0)], [1.75, 2.5], 15, "fast"], attachment: false, delay: 0},
      {class: ParticleMark, params: ["<game *>", "<vec3 pos>", "<vec3 vel>"], attachment: false, delay: 0}
    ]
  ),
  charge: new EffectDefinition(
    "Shiek-Charge", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", "character/shiek/recall0.wav", 0.5, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  recall: new EffectDefinition(
    "Shiek-Recall", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", "character/shiek/recall1.wav", 0.5, 0.0, "effect"], attachment: true, delay: 0}
    ]
  )
};

/* global PlayerPuff */
/* global ParticleSleep */
/* global ParticleCharge */
NxFx.puff = {
  rest: new EffectDefinition(
    "Puff-Rest", util.vec3.make(0.1, -0.2, 0.55), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerPuff.REST_LIGHT, util.vec4.copy3(PlayerPuff.REST_LIGHT, 0.0)], [1.25, 2.15], 18, "fast"], attachment: true, delay: 0},
      {class: ParticleSleep, params: ["<game *>", "<vec3 pos>", "<vec3 vel>"], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/puff/rest0.wav", 0.5, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  wake: new EffectDefinition(
    "Puff-Wake", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", "character/puff/rest1.wav", 0.5, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  charge: new EffectDefinition(
    "Puff-Charge", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", "character/puff/slap0.wav", 0.5, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  dash: new EffectDefinition(
    "Puff-Dash", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", "character/puff/slap1.wav", 0.5, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  slap: new EffectDefinition(
    "Puff-Slap", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", "character/puff/slap2.wav", 0.5, 0.0, "effect"], attachment: true, delay: 0}
    ]
  )
};

/* global PlayerCaptain */
NxFx.captain = {
  charge: new EffectDefinition(
    "Captain-Charge", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", "character/captain/punch0.wav", 0.5, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  punch: new EffectDefinition(
    "Captain-Punch", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", "character/captain/punch1.wav", 0.5, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  kick: new EffectDefinition(
    "Captain-Punch", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", "character/captain/kick0.wav", 0.5, 0.0, "effect"], attachment: true, delay: 0}
    ]
  )
};

/* global PlayerMarth */
/* global ParticleSlash */
/* global ParticleReady */
/* global ParticleRiposte */
NxFx.marth = {
  light: new EffectDefinition(
    "Marth-Light", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: ParticleSlash, params: ["<game *>", "<vec3 pos>", "<vec3 vel>"], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", ["character/marth/light0.wav", "character/marth/light1.wav", "character/marth/light2.wav"], 0.5, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  combo: new EffectDefinition(
    "Marth-Combo", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerMarth.COMBO_LIGHT, util.vec4.copy3(PlayerMarth.COMBO_LIGHT, 0.0)], [1.25, 2.15], 18, "fast"], attachment: true, delay: 0},
      {class: ParticleReady, params: ["<game *>", "<vec3 pos>", "<vec3 vel>"], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/marth/combo0.wav", 0.5, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  heavy: new EffectDefinition(
    "Marth-Heavy", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: ParticleSlash, params: ["<game *>", "<vec3 pos>", "<vec3 vel>"], attachment: true, delay: 0},
      {class: ParticleReady, params: ["<game *>", "<vec3 pos>", "<vec3 vel>"], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", ["character/marth/heavy0.wav", "character/marth/heavy1.wav"], 0.5, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  counter: new EffectDefinition(
    "Marth-Counter", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", "character/marth/counter0.wav", 0.5, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  riposte: new EffectDefinition(
    "Marth-Riposte", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerMarth.RIPOSTE_LIGHT, util.vec4.copy3(PlayerMarth.RIPOSTE_LIGHT, 0.0)], [1.25, 2.15], 25, "fast"], attachment: true, delay: 0},
      {class: ParticleRiposte, params: ["<game *>", "<vec3 pos>", "<vec3 vel>"], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/marth/counter1.wav", 0.5, 0.0, "effect"], attachment: true, delay: 0}
    ]
  )
};