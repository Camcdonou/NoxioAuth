"use strict";
/* global util */
/* global PointLight */
/* global PointLightInterp */
/* global Decal */
/* global SpatialSoundInstance */

/* Effect definitions. EffectDefinition objects in this class are called ''''''statically'''''' to generate effects. */
var NxFx = {};

/* global PlayerFox */
/* global ParticleStun */
/* global ParticleZap */
/* global ParticleSlashHit */
/* global ParticleBurn */
/* global ParticleCrit */
NxFx.hit = {
  generic: new EffectDefinition(
    "Hit-Generic", util.vec3.make(0, 0, 0.55), 0, true,
    [
      {class: ParticleStun, params: ["<game *>", "<vec3 pos>", "<vec3 vel>"], attachment: true, delay: 0}
    ]
  ),
  slash: new EffectDefinition(
    "Hit-Slash", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerMarth.COLOR_A, 0.85), util.vec4.copy3(PlayerMarth.COLOR_B, 0.0)], [1.5, 2.0], 15, "fast"], attachment: true, delay: 0},
      {class: ParticleSlashHit, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerMarth.COLOR_A, PlayerMarth.COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", ["multi/hit/slash0.wav", "multi/hit/slash1.wav", "multi/hit/slash2.wav"], 0.5, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  electric: new EffectDefinition(
    "Hit-Electric", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerFox.BLIP_COLOR_A, util.vec4.copy3(PlayerFox.BLIP_COLOR_B, 0)], [1.75, 2.5], 24, "slow"], attachment: true, delay: 0},
      {class: ParticleZap, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerFox.BLIP_COLOR_A, PlayerFox.BLIP_COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", ["multi/hit/electric0.wav", "multi/hit/electric1.wav", "multi/hit/electric2.wav"], 0.4, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  fire: new EffectDefinition(
    "Hit-Fire", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerFalco.FIRE_COLOR_B, util.vec4.copy3(PlayerFalco.FIRE_COLOR_C, 0)], [1.75, 2.5], 30, "slow"], attachment: true, delay: 0},
      {class: ParticleBurn, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerFalco.FIRE_COLOR_A, PlayerFalco.FIRE_COLOR_C], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", ["multi/hit/fire0.wav", "multi/hit/fire1.wav", "multi/hit/fire2.wav"], 0.6, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  critical: new EffectDefinition(
    "Hit-Critical", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.make(1,1,1,1), util.vec4.make(1,1,1,0)], [1.75, 2.5], 30, "fast"], attachment: true, delay: 0},
      {class: ParticleCrit, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", util.vec4.make(1,1,1,1)], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", ["multi/hit/critical0.wav"], 0.5, 0.0, "effect"], attachment: true, delay: 0}
    ]
  )
};

/* global ParticleAirJump */
/* global ParticleBloodSplat */
/* global ParticleShatter */
NxFx.player = {
  jump: new EffectDefinition(
    "Player-Jump", util.vec3.make(0, 0, 0), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", ["character/generic/jump0.wav", "character/generic/jump1.wav", "character/generic/jump2.wav"], 0.25, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  airJump: new EffectDefinition(
    "Player-AirJump", util.vec3.make(0, 0, 0.01), 0, true,
    [
      {class: ParticleAirJump, params: ["<game *>", "<vec3 pos>", "<vec3 vel>"], attachment: false, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", ["character/generic/air0.wav", "character/generic/air1.wav", "character/generic/air2.wav"], 0.4, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  land: new EffectDefinition(
    "Player-Land", util.vec3.make(0, 0, 0), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", ["character/generic/land0.wav", "character/generic/land1.wav", "character/generic/land2.wav"], 0.25, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  bloodSplat: new EffectDefinition(
    "Player-BloodSplat", util.vec3.make(0, 0, 0.25), 0, false,
    [
      {class: ParticleBloodSplat, params: ["<game *>", "<vec3 pos>", "<vec3 vel>"], attachment: false, delay: 0},
      {class: Decal, params: ["<game *>", "character.generic.decal.bloodsplat", "<vec3 pos>", util.vec3.make(0.0, 0.0, 1.0), 1.5, Math.random()*6.28319 /* @TODO: fixed random */, util.vec4.make(1, 1, 1, 1), 2, 450, 150], attachment: false, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", ["multi/impact/impact0.wav", "multi/impact/impact1.wav", "multi/impact/impact2.wav"], 0.5, 0.0, "effect"], attachment: false, delay: 0}
    ]
  ),
  shatter: new EffectDefinition(
    "Player-Shatter", util.vec3.make(0, 0, 0), 0 , false,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.make(1., 1., 1., .25), util.vec4.make(1., 1., 1., 0.)], [1.25, 2.15], 18, "fast"], attachment: true, delay: 0},
      {class: ParticleShatter, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", util.vec4.make(1., 1., 1., 1.), util.vec4.make(1., 1., 1., .75)], attachment: false, delay: 0}
    ]
  ),
  fall: new EffectDefinition(
    "Player-Fall", util.vec3.make(0, 0, 0.25), 0, true,
    [
    ]
  )
};

/* global PlayerFox */
/* global ParticleBlip */
/* global ParticleDash */
NxFx.fox = {
  blip: new EffectDefinition(
    "Fox-Blip", util.vec3.make(0, 0, 0.6), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerFox.BLIP_COLOR_A, util.vec4.copy3(PlayerFox.BLIP_COLOR_B, 0.75), util.vec4.copy3(PlayerFox.BLIP_COLOR_B, 0)], [2.75, 4.5], 18, "fast"], attachment: true, delay: 0},
      {class: ParticleBlip, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerFox.BLIP_COLOR_A, PlayerFox.BLIP_COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/fox/blip0.wav", 0.6, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  dash: new EffectDefinition(
    "Fox-Dash", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerFox.BLIP_COLOR_A, PlayerFox.BLIP_COLOR_B, util.vec4.copy3(PlayerFox.BLIP_COLOR_B, 0)], [1.25, 4.0], 30, "fast"], attachment: false, delay: 0},
      {class: ParticleDash, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerFox.BLIP_COLOR_A, PlayerFox.BLIP_COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/fox/dash0.wav", 0.45, 0.0, "effect"], attachment: true, delay: 0}
    ]
  )
};

/* global PlayerFalco */
/* global ParticleBlip */
/* global ParticleFalcoCharge */
/* global ParticleFalcoDash */
NxFx.falco = {
  charge: new EffectDefinition(
    "Falco-Charge", util.vec3.make(0, 0, 0.0), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerFalco.FIRE_COLOR_B, 0), PlayerFalco.FIRE_COLOR_C], [1.25, 2.45], 20, "fast"], attachment: true, delay: 0},
      {class: ParticleFalcoCharge, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerFalco.FIRE_COLOR_A, PlayerFalco.FIRE_COLOR_C], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/falco/dash0.wav", 0.6, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  dash: new EffectDefinition(
    "Falco-Dash", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerFalco.FIRE_COLOR_B, util.vec4.copy3(PlayerFalco.FIRE_COLOR_C, 0)], [2.6, 3.45], 25, "slow"], attachment: true, delay: 0},
      {class: ParticleFalcoDash, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerFalco.FIRE_COLOR_A, PlayerFalco.FIRE_COLOR_C], attachment: true, delay: 0},
      {class: ParticleBurn, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerFalco.FIRE_COLOR_A, PlayerFalco.FIRE_COLOR_C], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/falco/dash1.wav", 0.7, 0.0, "effect"], attachment: true, delay: 0}
    ]
  )
};

/* global PlayerShiek */
/* global ParticleBlip */
/* global ParticleMark */
/* global ParticleShiekMark */
/* global ParticleShiekRecall */
/* global ParticleShiekCharge */
/* global ParticleShiekVanish */
NxFx.shiek = {
  mark: new EffectDefinition(
    "Shiek-Mark", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerFox.BLIP_COLOR_A, 0.5), util.vec4.copy3(PlayerFox.BLIP_COLOR_B, 0)], [2.45, 1.25], 18, "fast"], attachment: false, delay: 0},
      {class: ParticleShiekMark, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerFox.BLIP_COLOR_A, PlayerFox.BLIP_COLOR_B], attachment: false, delay: 0}//,
      //{class: SpatialSoundInstance, params: ["<sound *>", "multi/hit/slash0.wav", 0.5, 0.0, "effect"], attachment: false, delay: 0}
    ]
  ),
  no: new EffectDefinition(
    "Shiek-NoMark", util.vec3.make(0, 0, 0.01), 0, true,
    [
//      {class: SpatialSoundInstance, params: ["<sound *>", "multi/hit/slash0.wav", 0.5, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  location: new EffectDefinition(
    "Shiek-Location", util.vec3.make(0, 0, 0.01), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerFox.BLIP_COLOR_A, util.vec4.copy3(PlayerFox.BLIP_COLOR_B, 0.5), util.vec4.copy3(PlayerFox.BLIP_COLOR_B, 0)], [1.75, 2.5], 15, "fast"], attachment: false, delay: 0},
      {class: ParticleMark, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerFox.BLIP_COLOR_A, PlayerFox.BLIP_COLOR_B], attachment: false, delay: 0}
    ]
  ),
  charge: new EffectDefinition(
    "Shiek-Charge", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerFox.BLIP_COLOR_A, 0.15), util.vec4.copy3(PlayerFox.BLIP_COLOR_B, 1.0)], [1.75, 3.5], 7, "linear"], attachment: true, delay: 0},
      {class: ParticleShiekCharge, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerFox.BLIP_COLOR_A, PlayerFox.BLIP_COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/shiek/recall0.wav", 0.7, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  vanish: new EffectDefinition(
    "Shiek-Vanish", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerFox.BLIP_COLOR_A, 1.0), util.vec4.copy3(PlayerFox.BLIP_COLOR_B, 0)], [2.45, 1.25], 18, "fast"], attachment: false, delay: 0},
      {class: ParticleShiekVanish, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerFox.BLIP_COLOR_A, PlayerFox.BLIP_COLOR_B], attachment: false, delay: 0}
    ]
  ),
  recall: new EffectDefinition(
    "Shiek-Recall", util.vec3.make(0, 0, 0.5), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerFox.BLIP_COLOR_A, util.vec4.copy3(PlayerFox.BLIP_COLOR_B, 0.75), util.vec4.copy3(PlayerFox.BLIP_COLOR_B, 0)], [2.75, 4.5], 18, "fast"], attachment: true, delay: 0},
      {class: ParticleShiekRecall, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerFox.BLIP_COLOR_A, PlayerFox.BLIP_COLOR_B], attachment: false, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/shiek/recall1.wav", 0.6, 0.0, "effect"], attachment: false, delay: 0}
    ]
  )
};

/* global PlayerPuff */
/* global ParticleSleep */
/* global ParticlePuffCharge */
/* global ParticlePuffDash */
/* global ParticlePuffSlap */
/* global ParticlePuffWave */
NxFx.puff = {
  rest: new EffectDefinition(
    "Puff-Rest", util.vec3.make(0.1, -0.2, 0.55), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerPuff.REST_LIGHT, util.vec4.copy3(PlayerPuff.REST_LIGHT, 0.0)], [1.25, 2.15], 18, "fast"], attachment: true, delay: 0},
      {class: ParticleSleep, params: ["<game *>", "<vec3 pos>", "<vec3 vel>"], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/puff/rest0.wav", 0.8, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  wake: new EffectDefinition(
    "Puff-Wake", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", "character/puff/rest1.wav", 0.85, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  charge: new EffectDefinition(
    "Puff-Charge", util.vec3.make(0, 0, 0), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerPuff.REST_LIGHT, 0.0), PlayerPuff.REST_LIGHT], [2.65, 1.55], 9, "slow"], attachment: true, delay: 0},
      {class: ParticlePuffCharge, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerPuff.COLORA, PlayerPuff.COLORB], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/puff/slap0.wav", 0.3, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  dash: new EffectDefinition(
    "Puff-Dash", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerPuff.REST_LIGHT, util.vec4.copy3(PlayerPuff.REST_LIGHT, 0.65), util.vec4.copy3(PlayerPuff.REST_LIGHT, 0.0)], [1.55, 2.35], 9, "fast"], attachment: true, delay: 0},
      {class: ParticlePuffDash, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerPuff.COLORA, PlayerPuff.COLORB], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/puff/slap1.wav", 0.35, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  slap: new EffectDefinition(
    "Puff-Slap", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerPuff.REST_LIGHT, 0.7), util.vec4.copy3(PlayerPuff.REST_LIGHT, 0.0)], [1.5, 2.55], 15, "fast"], attachment: true, delay: 0},
      {class: ParticlePuffSlap, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerPuff.COLORA, PlayerPuff.COLORB], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/puff/slap2.wav", 1.0, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  wave: new EffectDefinition(
    "Puff-Wave", util.vec3.make(0.0, 0.0, 0.0), 0, true,
    [
        {class: ParticlePuffWave, params: ["<game *>", "<vec3 pos>", "<vec3 vel>"], attachment: true, delay: 0}
    ]
  )
};

/* global PlayerCaptain */
/* global ParticleCaptainCharge */
/* global ParticleCaptainPunch */
/* global ParticleCaptainKick */
NxFx.captain = {
  charge: new EffectDefinition(
    "Captain-Charge", util.vec3.make(0, 0, 0.0), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerFalco.FIRE_COLOR_B, 0), PlayerFalco.FIRE_COLOR_C], [1.25, 2.45], 35, "slow"], attachment: true, delay: 0},
      {class: ParticleCaptainCharge, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerFalco.FIRE_COLOR_A, PlayerFalco.FIRE_COLOR_C], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/captain/punch0.wav", 0.6, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  punch: new EffectDefinition(
    "Captain-Punch", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerFalco.FIRE_COLOR_B, util.vec4.copy3(PlayerFalco.FIRE_COLOR_C, 0)], [2.6, 3.45], 25, "slow"], attachment: true, delay: 0},
      {class: ParticleCaptainPunch, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerFalco.FIRE_COLOR_A, PlayerFalco.FIRE_COLOR_C], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/captain/punch1.wav", 0.75, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  kick: new EffectDefinition(
    "Captain-Kick", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerFalco.FIRE_COLOR_B, util.vec4.copy3(PlayerFalco.FIRE_COLOR_C, 0)], [2.6, 3.45], 25, "slow"], attachment: true, delay: 0},
      {class: ParticleCaptainKick, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerFalco.FIRE_COLOR_A, PlayerFalco.FIRE_COLOR_C], attachment: true, delay: 0},
      {class: ParticleBurn, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerFalco.FIRE_COLOR_A, PlayerFalco.FIRE_COLOR_C], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/captain/kick0.wav", 0.8, 0.0, "effect"], attachment: true, delay: 0}
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
      {class: ParticleSlash, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerMarth.COLOR_A, PlayerMarth.COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", ["character/marth/light0.wav", "character/marth/light1.wav", "character/marth/light2.wav"], 0.5, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  combo: new EffectDefinition(
    "Marth-Combo", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerMarth.COLOR_A, 0.55), util.vec4.copy3(PlayerMarth.COLOR_B, 0.0)], [1.25, 2.15], 18, "fast"], attachment: true, delay: 0},
      {class: ParticleReady, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerMarth.COLOR_A, PlayerMarth.COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/marth/combo0.wav", 0.6, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  heavy: new EffectDefinition(
    "Marth-Heavy", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerMarth.COLOR_A, 0.75), util.vec4.copy3(PlayerMarth.COLOR_B, 0.0)], [1.25, 2.25], 18, "fast"], attachment: true, delay: 0},
      {class: ParticleRiposte, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerMarth.COLOR_A, PlayerMarth.COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", ["character/marth/heavy0.wav", "character/marth/heavy1.wav"], 0.7, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  counter: new EffectDefinition(
    "Marth-Counter", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", "character/marth/counter0.wav", 0.6, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  riposte: new EffectDefinition(
    "Marth-Riposte", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerMarth.COLOR_A, 0.9), util.vec4.copy3(PlayerMarth.COLOR_B, 0.0)], [1.35, 2.85], 25, "fast"], attachment: true, delay: 0},
      {class: ParticleRiposte, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerMarth.COLOR_A, PlayerMarth.COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/marth/counter1.wav", 0.7, 0.0, "effect"], attachment: true, delay: 0}
    ]
  )
};

/* global PlayerInferno */
NxFx.inferno = {
  jump: new EffectDefinition(
    "Inferno-Jump", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", ["character/inferno/voice/jump0.wav", "character/inferno/voice/jump1.wav", "character/inferno/voice/jump2.wav"], 0.5, 0.0, "voice"], attachment: true, delay: 0}
    ]
  ),
  hit: new EffectDefinition(
    "Inferno-Hit", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", ["character/inferno/voice/hit0.wav", "character/inferno/voice/hit1.wav", "character/inferno/voice/hit2.wav"], 0.5, 0.0, "voice"], attachment: true, delay: 0}
    ]
  ),
  explode: new EffectDefinition(
    "Inferno-Explode", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", ["character/inferno/voice/impact0.wav", "character/inferno/voice/impact1.wav"], 0.5, 0.0, "voice"], attachment: true, delay: 0}
    ]
  ),
  fall: new EffectDefinition(
    "Inferno-Fall", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", "character/inferno/voice/fall0.wav", 0.5, 0.0, "voice"], attachment: true, delay: 0}
    ]
  ),
  taunt: new EffectDefinition(
    "Inferno-Taunt", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", ["character/inferno/voice/taunt0.wav", "character/inferno/voice/taunt1.wav", "character/inferno/voice/taunt2.wav"], 0.5, 0.0, "voice"], attachment: true, delay: 0}
    ]
  )
};

/* ================================================================================================================================= */
/* ================================================================================================================================= */
/* ================================================================================================================================= */

/* global PlayerFoxRed, PlayerFalcoOrange, PlayerShiekGreen, PlayerFoxGold, PlayerFoxRainbow, PlayerFalcoBlack */
/* global ParticleZapRainbow */

NxFx.hit.alt = {};

/* global ParticleSlashHitRainbow */
NxFx.hit.alt.slash = {
  purple: new EffectDefinition(
    "Hit-Slash-Purple", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerFoxGold.BLIP_COLOR_A, 0.85), util.vec4.copy3(PlayerFoxGold.BLIP_COLOR_B, 0.0)], [1.5, 2.0], 15, "fast"], attachment: true, delay: 0},
      {class: ParticleSlashHit, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerFoxGold.BLIP_COLOR_A, PlayerFoxGold.BLIP_COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", ["multi/hit/slash0.wav", "multi/hit/slash1.wav", "multi/hit/slash2.wav"], 0.5, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  fire: new EffectDefinition(
    "Hit-Slash-Fire", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerFalco.FIRE_COLOR_B, util.vec4.copy3(PlayerFalco.FIRE_COLOR_C, 0)], [1.75, 2.5], 30, "slow"], attachment: true, delay: 0},
      {class: ParticleSlashHit, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerMarthFire.COLOR_A, PlayerMarthFire.COLOR_B], attachment: true, delay: 0},
      {class: ParticleBurn, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerFalco.FIRE_COLOR_A, PlayerFalco.FIRE_COLOR_C], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", ["multi/hit/fire0.wav", "multi/hit/fire1.wav", "multi/hit/fire2.wav"], 0.55, 0.0, "effect"], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", ["multi/hit/slash0.wav", "multi/hit/slash1.wav", "multi/hit/slash2.wav"], 0.35, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  rainbow: new EffectDefinition(
    "Hit-Slash-Rainbow", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerMarth.COLOR_A, 0.85), util.vec4.copy3(PlayerMarth.COLOR_A, 0.0)], [1.5, 2.0], 15, "fast"], attachment: true, delay: 0},
      {class: ParticleSlashHitRainbow, params: ["<game *>", "<vec3 pos>", "<vec3 vel>"], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", ["multi/hit/slash0.wav", "multi/hit/slash1.wav", "multi/hit/slash2.wav"], 0.5, 0.0, "effect"], attachment: true, delay: 0}
    ]
  )
};

NxFx.hit.alt.electric = {
  red: new EffectDefinition(
    "Hit-Electric-Red", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerFoxRed.BLIP_COLOR_A, util.vec4.copy3(PlayerFoxRed.BLIP_COLOR_B, 0)], [1.75, 2.5], 24, "slow"], attachment: true, delay: 0},
      {class: ParticleZap, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerFoxRed.BLIP_COLOR_A, PlayerFoxRed.BLIP_COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", ["multi/hit/electric0.wav", "multi/hit/electric1.wav", "multi/hit/electric2.wav"], 0.4, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  orange: new EffectDefinition(
    "Hit-Electric-Orange", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerFalcoOrange.BLIP_COLOR_A, util.vec4.copy3(PlayerFalcoOrange.BLIP_COLOR_B, 0)], [1.75, 2.5], 24, "slow"], attachment: true, delay: 0},
      {class: ParticleZap, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerFalcoOrange.BLIP_COLOR_A, PlayerFalcoOrange.BLIP_COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", ["multi/hit/electric0.wav", "multi/hit/electric1.wav", "multi/hit/electric2.wav"], 0.4, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  green: new EffectDefinition(
    "Hit-Electric-Green", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerShiekGreen.BLIP_COLOR_A, util.vec4.copy3(PlayerShiekGreen.BLIP_COLOR_B, 0)], [1.75, 2.5], 24, "slow"], attachment: true, delay: 0},
      {class: ParticleZap, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerShiekGreen.BLIP_COLOR_A, PlayerShiekGreen.BLIP_COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", ["multi/hit/electric0.wav", "multi/hit/electric1.wav", "multi/hit/electric2.wav"], 0.4, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  purple: new EffectDefinition(
    "Hit-Electric-Purple", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerFoxGold.BLIP_COLOR_A, util.vec4.copy3(PlayerFoxGold.BLIP_COLOR_B, 0)], [1.75, 2.5], 24, "slow"], attachment: true, delay: 0},
      {class: ParticleZap, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerFoxGold.BLIP_COLOR_A, PlayerFoxGold.BLIP_COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", ["multi/hit/electric0.wav", "multi/hit/electric1.wav", "multi/hit/electric2.wav"], 0.4, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  black: new EffectDefinition(
    "Hit-Electric-Black", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerFalcoBlack.LIGHT_COLOR_A, util.vec4.copy3(PlayerFalcoBlack.LIGHT_COLOR_B, 0)], [1.75, 2.5], 24, "slow"], attachment: true, delay: 0},
      {class: ParticleZap, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerFalcoBlack.FX_COLOR_A, PlayerFalcoBlack.FX_COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", ["multi/hit/electric0.wav", "multi/hit/electric1.wav", "multi/hit/electric2.wav"], 0.4, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  rainbow: new EffectDefinition(
    "Hit-Electric-Rainbow", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerFoxRainbow.LIGHT_COLOR_A, util.vec4.copy3(PlayerFoxRainbow.LIGHT_COLOR_B, 0)], [1.75, 2.5], 24, "slow"], attachment: true, delay: 0},
      {class: ParticleZapRainbow, params: ["<game *>", "<vec3 pos>", "<vec3 vel>"], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", ["multi/hit/electric0.wav", "multi/hit/electric1.wav", "multi/hit/electric2.wav"], 0.4, 0.0, "effect"], attachment: true, delay: 0}
    ]
  )
};

/* global ParticleBurnRainbow */

NxFx.hit.alt.fire = {
  purple: new EffectDefinition(
    "Hit-Fire-Purple", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerFoxGold.BLIP_COLOR_A, util.vec4.copy3(PlayerFoxGold.BLIP_COLOR_B, 0)], [1.75, 2.5], 30, "slow"], attachment: true, delay: 0},
      {class: ParticleBurn, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerFoxGold.BLIP_COLOR_A, PlayerFoxGold.BLIP_COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", ["multi/hit/fire0.wav", "multi/hit/fire1.wav", "multi/hit/fire2.wav"], 0.6, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  black: new EffectDefinition(
    "Hit-Fire-Black", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerFalcoBlack.LIGHT_COLOR_A, util.vec4.copy3(PlayerFalcoBlack.LIGHT_COLOR_B, 0)], [1.75, 2.5], 30, "slow"], attachment: true, delay: 0},
      {class: ParticleBurn, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerFalcoBlack.FX_COLOR_A, PlayerFalcoBlack.FX_COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", ["multi/hit/fire0.wav", "multi/hit/fire1.wav", "multi/hit/fire2.wav"], 0.6, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  rainbow: new EffectDefinition(
    "Hit-Fire-Rainbow", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerFoxRainbow.LIGHT_COLOR_A, util.vec4.copy3(PlayerFoxRainbow.LIGHT_COLOR_B, 0)], [1.75, 2.5], 30, "slow"], attachment: true, delay: 0},
      {class: ParticleBurnRainbow, params: ["<game *>", "<vec3 pos>", "<vec3 vel>"], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", ["multi/hit/fire0.wav", "multi/hit/fire1.wav", "multi/hit/fire2.wav"], 0.6, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  retro: new EffectDefinition(
    "Hit-Fire-Retro", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerFalco.FIRE_COLOR_B, util.vec4.copy3(PlayerFalco.FIRE_COLOR_C, 0)], [1.75, 2.5], 30, "slow"], attachment: true, delay: 0},
      {class: ParticleBurn, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerFalco.FIRE_COLOR_A, PlayerFalco.FIRE_COLOR_C], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", ["multi/hit/fire0.wav", "multi/hit/fire1.wav", "multi/hit/fire2.wav"], 0.6, 0.0, "effect"], attachment: true, delay: 0}
    ]
  )
};

NxFx.fox.alt = {};

/* global PlayerFoxRed */
NxFx.fox.alt.red = {
  blip: new EffectDefinition(
    "Fox-Red-Blip", util.vec3.make(0, 0, 0.6), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerFoxRed.BLIP_COLOR_A, util.vec4.copy3(PlayerFoxRed.BLIP_COLOR_B, 0.75), util.vec4.copy3(PlayerFoxRed.BLIP_COLOR_B, 0)], [2.75, 4.5], 18, "fast"], attachment: true, delay: 0},
      {class: ParticleBlip, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerFoxRed.BLIP_COLOR_A, PlayerFoxRed.BLIP_COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/fox/blip0.wav", 0.6, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  dash: new EffectDefinition(
    "Fox-Red-Dash", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerFoxRed.BLIP_COLOR_A, PlayerFoxRed.BLIP_COLOR_B, util.vec4.copy3(PlayerFoxRed.BLIP_COLOR_B, 0)], [1.25, 4.0], 30, "fast"], attachment: false, delay: 0},
      {class: ParticleDash, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerFoxRed.BLIP_COLOR_A, PlayerFoxRed.BLIP_COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/fox/dash0.wav", 0.45, 0.0, "effect"], attachment: true, delay: 0}
    ]
  )
};

/* global PlayerFoxRainbow */
/* global ParticleBlipRainbow */
/* global ParticleDashRainbow */
NxFx.fox.alt.rainbow = {
  blip: new EffectDefinition(
    "Fox-Rainbow-Blip", util.vec3.make(0, 0, 0.6), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerFoxRainbow.LIGHT_COLOR_A, util.vec4.copy3(PlayerFoxRainbow.LIGHT_COLOR_B, 0.75), util.vec4.copy3(PlayerFoxRainbow.LIGHT_COLOR_B, 0)], [2.75, 4.5], 18, "fast"], attachment: true, delay: 0},
      {class: ParticleBlipRainbow, params: ["<game *>", "<vec3 pos>", "<vec3 vel>"], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/fox/blip0.wav", 0.6, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  dash: new EffectDefinition(
    "Fox-Rainbow-Dash", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerFoxRainbow.LIGHT_COLOR_A, PlayerFoxRainbow.LIGHT_COLOR_B, util.vec4.copy3(PlayerFoxRainbow.LIGHT_COLOR_B, 0)], [1.25, 4.0], 30, "fast"], attachment: false, delay: 0},
      {class: ParticleDashRainbow, params: ["<game *>", "<vec3 pos>", "<vec3 vel>"], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/fox/dash0.wav", 0.45, 0.0, "effect"], attachment: true, delay: 0}
    ]
  )
};

/* global PlayerFoxGold */
NxFx.fox.alt.gold = {
  blip: new EffectDefinition(
    "Fox-Gold-Blip", util.vec3.make(0, 0, 0.6), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerFoxGold.BLIP_COLOR_A, util.vec4.copy3(PlayerFoxGold.BLIP_COLOR_B, 0.75), util.vec4.copy3(PlayerFoxGold.BLIP_COLOR_B, 0)], [2.75, 4.5], 18, "fast"], attachment: true, delay: 0},
      {class: ParticleBlip, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerFoxGold.BLIP_COLOR_A, PlayerFoxGold.BLIP_COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/fox/blip0.wav", 0.6, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  dash: new EffectDefinition(
    "Fox-Gold-Dash", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerFoxGold.BLIP_COLOR_A, PlayerFoxGold.BLIP_COLOR_B, util.vec4.copy3(PlayerFoxGold.BLIP_COLOR_B, 0)], [1.25, 4.0], 30, "fast"], attachment: false, delay: 0},
      {class: ParticleDash, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerFoxGold.BLIP_COLOR_A, PlayerFoxGold.BLIP_COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/fox/dash0.wav", 0.45, 0.0, "effect"], attachment: true, delay: 0}
    ]
  )
};

/* global PlayerFoxDelta */
/* global ParticleBlipDelta */
NxFx.fox.alt.delta = {
  blip: new EffectDefinition(
    "Fox-Delta-Blip", util.vec3.make(0, 0, 0.6), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerFoxDelta.COLOR_A, util.vec4.copy3(PlayerFoxDelta.COLOR_B, 0.75), util.vec4.copy3(PlayerFoxDelta.COLOR_B, 0)], [2.75, 4.5], 18, "fast"], attachment: true, delay: 0},
      {class: ParticleBlipDelta, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerFoxDelta.COLOR_A, PlayerFoxDelta.COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/fox/blip0.wav", 0.6, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  dash: new EffectDefinition(
    "Fox-Delta-Dash", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerFoxDelta.COLOR_A, PlayerFoxDelta.COLOR_B, util.vec4.copy3(PlayerFoxDelta.COLOR_B, 0)], [1.25, 4.0], 30, "fast"], attachment: false, delay: 0},
      {class: ParticleDash, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerFoxDelta.COLOR_A, PlayerFoxDelta.COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/fox/dash0.wav", 0.45, 0.0, "effect"], attachment: true, delay: 0}
    ]
  )
};

/* global PlayerFoxHit */
/* global ParticleHitMarker */
NxFx.fox.alt.hit = {
  blip: new EffectDefinition(
    "Fox-Hit-Blip", util.vec3.make(0, 0, 0.65), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerFoxHit.COLOR_A, util.vec4.copy3(PlayerFoxHit.COLOR_B, 0.75), util.vec4.copy3(PlayerFoxHit.COLOR_B, 0)], [2.75, 4.5], 18, "fast"], attachment: true, delay: 0},
      {class: ParticleHitMarker, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerFoxHit.COLOR_A, PlayerFoxHit.COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/fox/hit0.wav", 0.6, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  dash: new EffectDefinition(
    "Fox-Hit-Dash", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerFoxHit.COLOR_A, PlayerFoxHit.COLOR_B, util.vec4.copy3(PlayerFoxHit.COLOR_B, 0)], [1.25, 4.0], 30, "fast"], attachment: false, delay: 0},
      {class: ParticleDash, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerFoxHit.COLOR_A, PlayerFoxHit.COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/fox/dash0.wav", 0.45, 0.0, "effect"], attachment: true, delay: 0}
    ]
  )
};

NxFx.falco.alt = {};

NxFx.falco.alt.voice = {
  jump: new EffectDefinition(
    "Falco-Voice-Jump", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", ["character/falco/voice/jump0.wav", "character/falco/voice/jump1.wav", "character/falco/voice/jump2.wav"], 0.45, 0.0, "voice"], attachment: true, delay: 0}
    ]
  ),
  hit: new EffectDefinition(
    "Falco-Voice-Hit", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", ["character/falco/voice/hit0.wav", "character/falco/voice/hit1.wav"], 0.45, 0.0, "voice"], attachment: true, delay: 0}
    ]
  ),
  dash: new EffectDefinition(
    "Falco-Voice-Dash", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", "character/falco/voice/dash0.wav", 0.45, 0.0, "voice"], attachment: true, delay: 0}
    ]
  ),
  taunt: new EffectDefinition(
    "Falco-Voice-Taunt", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", ["character/falco/voice/taunt0.wav", "character/falco/voice/taunt1.wav", "character/falco/voice/taunt2.wav"], 0.45, 0.0, "voice"], attachment: true, delay: 0}
    ]
  ),
  explode: new EffectDefinition(
    "Falco-Voice-Explode", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", ["character/falco/voice/impact0.wav", "character/falco/voice/impact1.wav", "character/falco/voice/impact2.wav"], 0.45, 0.0, "voice"], attachment: true, delay: 0}
    ]
  ),
  fall: new EffectDefinition(
    "Falco-Voice-Fall", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", "character/falco/voice/fall0.wav", 0.45, 0.0, "voice"], attachment: true, delay: 0}
    ]
  )
};

/* global PlayerFalcoOrange */
NxFx.falco.alt.orange = {
  blip: new EffectDefinition(
    "Falco-Orange-Blip", util.vec3.make(0, 0, 0.6), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerFalcoOrange.BLIP_COLOR_A, util.vec4.copy3(PlayerFalcoOrange.BLIP_COLOR_B, 0.75), util.vec4.copy3(PlayerFalcoOrange.BLIP_COLOR_B, 0)], [2.75, 4.5], 18, "fast"], attachment: true, delay: 0},
      {class: ParticleBlip, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerFalcoOrange.BLIP_COLOR_A, PlayerFalcoOrange.BLIP_COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/fox/blip0.wav", 0.6, 0.0, "effect"], attachment: true, delay: 0}
    ]
  )
};

/* global PlayerFalcoRainbow */
/* global ParticleBlipRainbow */
/* global ParticleFalcoChargeRainbow */
/* global ParticleFalcoDashRainbow */
NxFx.falco.alt.rainbow = {
  charge: new EffectDefinition(
    "Falco-Rainbow-Charge", util.vec3.make(0, 0, 0.0), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerFoxRainbow.LIGHT_COLOR_B, 0), PlayerFoxRainbow.LIGHT_COLOR_A], [1.25, 2.45], 20, "fast"], attachment: true, delay: 0},
      {class: ParticleFalcoChargeRainbow, params: ["<game *>", "<vec3 pos>", "<vec3 vel>"], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/falco/dash0.wav", 0.6, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  dash: new EffectDefinition(
    "Falco-Rainbow-Dash", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerFoxRainbow.LIGHT_COLOR_A, util.vec4.copy3(PlayerFoxRainbow.LIGHT_COLOR_B, 0)], [2.6, 3.45], 25, "slow"], attachment: true, delay: 0},
      {class: ParticleFalcoDashRainbow, params: ["<game *>", "<vec3 pos>", "<vec3 vel>"], attachment: true, delay: 0},
      {class: ParticleBurnRainbow, params: ["<game *>", "<vec3 pos>", "<vec3 vel>"], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/falco/dash1.wav", 0.7, 0.0, "effect"], attachment: true, delay: 0}
    ]
  )
};

/* global PlayerFalcoGold */
NxFx.falco.alt.gold = {
  charge: new EffectDefinition(
    "Falco-Gold-Charge", util.vec3.make(0, 0, 0.0), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerFoxGold.BLIP_COLOR_A, 0), PlayerFoxGold.BLIP_COLOR_B], [1.25, 2.45], 20, "fast"], attachment: true, delay: 0},
      {class: ParticleFalcoCharge, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerFoxGold.BLIP_COLOR_A, PlayerFoxGold.BLIP_COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/falco/dash0.wav", 0.6, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  dash: new EffectDefinition(
    "Falco-Gold-Dash", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerFoxGold.BLIP_COLOR_B, util.vec4.copy3(PlayerFoxGold.BLIP_COLOR_A, 0)], [2.6, 3.45], 25, "slow"], attachment: true, delay: 0},
      {class: ParticleFalcoDash, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerFoxGold.BLIP_COLOR_A, PlayerFoxGold.BLIP_COLOR_B], attachment: true, delay: 0},
      {class: ParticleBurn, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerFoxGold.BLIP_COLOR_A, PlayerFoxGold.BLIP_COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/falco/dash1.wav", 0.7, 0.0, "effect"], attachment: true, delay: 0}
    ]
  )
};

/* global PlayerFalcoDelta */
NxFx.falco.alt.delta = {
  charge: new EffectDefinition(
    "Falco-Delta-Charge", util.vec3.make(0, 0, 0.0), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerFoxDelta.COLOR_A, 0), PlayerFoxDelta.COLOR_B], [1.25, 2.45], 20, "fast"], attachment: true, delay: 0},
      {class: ParticleFalcoCharge, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerFoxDelta.COLOR_A, PlayerFoxDelta.COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/falco/dash0.wav", 0.6, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  dash: new EffectDefinition(
    "Falco-Delta-Dash", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerFoxDelta.COLOR_B, util.vec4.copy3(PlayerFoxDelta.COLOR_A, 0)], [2.6, 3.45], 25, "slow"], attachment: true, delay: 0},
      {class: ParticleFalcoDash, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerFoxDelta.COLOR_A, PlayerFoxDelta.COLOR_B], attachment: true, delay: 0},
      {class: ParticleBurn, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerFoxDelta.COLOR_A, PlayerFoxDelta.COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/falco/dash1.wav", 0.7, 0.0, "effect"], attachment: true, delay: 0}
    ]
  )
};

/* global PlayerFalcoBlack */
NxFx.falco.alt.black = {
  blip: new EffectDefinition(
    "Falco-Black-Blip", util.vec3.make(0, 0, 0.6), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerFalcoBlack.LIGHT_COLOR_A, util.vec4.copy3(PlayerFalcoBlack.LIGHT_COLOR_A, 0.75), util.vec4.copy3(PlayerFalcoBlack.LIGHT_COLOR_B, 0)], [2.75, 4.5], 18, "fast"], attachment: true, delay: 0},
      {class: ParticleBlip, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerFalcoBlack.FX_COLOR_B, PlayerFalcoBlack.FX_COLOR_A], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/fox/blip0.wav", 0.6, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  charge: new EffectDefinition(
    "Falco-Black-Charge", util.vec3.make(0, 0, 0.0), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerFalcoBlack.LIGHT_COLOR_B, 0), PlayerFalcoBlack.LIGHT_COLOR_A], [1.25, 2.45], 20, "fast"], attachment: true, delay: 0},
      {class: ParticleFalcoCharge, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerFalcoBlack.FX_COLOR_A, PlayerFalcoBlack.FX_COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/falco/dash0.wav", 0.6, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  dash: new EffectDefinition(
    "Falco-Black-Dash", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerFalcoBlack.LIGHT_COLOR_A, util.vec4.copy3(PlayerFalcoBlack.LIGHT_COLOR_B, 0)], [2.6, 3.45], 25, "slow"], attachment: true, delay: 0},
      {class: ParticleFalcoDash, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerFalcoBlack.FX_COLOR_A, PlayerFalcoBlack.FX_COLOR_B], attachment: true, delay: 0},
      {class: ParticleBurn, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerFalcoBlack.FX_COLOR_A, PlayerFalcoBlack.FX_COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/falco/dash1.wav", 0.7, 0.0, "effect"], attachment: true, delay: 0}
    ]
  )
};

NxFx.shiek.alt = {};

/* global PlayerShiekGreen */
NxFx.shiek.alt.green = {
  blip: new EffectDefinition(
    "Shiek-Green-Blip", util.vec3.make(0, 0, 0.6), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerShiekGreen.BLIP_COLOR_A, util.vec4.copy3(PlayerShiekGreen.BLIP_COLOR_B, 0.75), util.vec4.copy3(PlayerShiekGreen.BLIP_COLOR_B, 0)], [2.75, 4.5], 18, "fast"], attachment: true, delay: 0},
      {class: ParticleBlip, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerShiekGreen.BLIP_COLOR_A, PlayerShiekGreen.BLIP_COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/fox/blip0.wav", 0.6, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  mark: new EffectDefinition(
    "Shiek-Green-Mark", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerShiekGreen.BLIP_COLOR_A, 0.5), util.vec4.copy3(PlayerShiekGreen.BLIP_COLOR_B, 0)], [2.45, 1.25], 18, "fast"], attachment: false, delay: 0},
      {class: ParticleShiekMark, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerShiekGreen.BLIP_COLOR_A, PlayerShiekGreen.BLIP_COLOR_B], attachment: false, delay: 0}//,
      //{class: SpatialSoundInstance, params: ["<sound *>", "multi/hit/slash0.wav", 0.5, 0.0, "effect"], attachment: false, delay: 0}
    ]
  ),
  no: new EffectDefinition(
    "Shiek-Green-NoMark", util.vec3.make(0, 0, 0.01), 0, true,
    [
//      {class: SpatialSoundInstance, params: ["<sound *>", "multi/hit/slash0.wav", 0.5, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  location: new EffectDefinition(
    "Shiek-Green-Location", util.vec3.make(0, 0, 0.01), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerShiekGreen.BLIP_COLOR_A, util.vec4.copy3(PlayerShiekGreen.BLIP_COLOR_B, 0.5), util.vec4.copy3(PlayerShiekGreen.BLIP_COLOR_B, 0)], [1.75, 2.5], 15, "fast"], attachment: false, delay: 0},
      {class: ParticleMark, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerShiekGreen.BLIP_COLOR_A, PlayerShiekGreen.BLIP_COLOR_B], attachment: false, delay: 0}
    ]
  ),
  charge: new EffectDefinition(
    "Shiek-Green-Charge", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerShiekGreen.BLIP_COLOR_A, 0.15), util.vec4.copy3(PlayerShiekGreen.BLIP_COLOR_B, 1.0)], [1.75, 3.5], 7, "linear"], attachment: true, delay: 0},
      {class: ParticleShiekCharge, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerShiekGreen.BLIP_COLOR_A, PlayerShiekGreen.BLIP_COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/shiek/recall0.wav", 0.7, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  vanish: new EffectDefinition(
    "Shiek-Green-Vanish", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerShiekGreen.BLIP_COLOR_A, 1.0), util.vec4.copy3(PlayerShiekGreen.BLIP_COLOR_B, 0)], [2.45, 1.25], 18, "fast"], attachment: false, delay: 0},
      {class: ParticleShiekVanish, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerShiekGreen.BLIP_COLOR_A, PlayerShiekGreen.BLIP_COLOR_B], attachment: false, delay: 0}
    ]
  ),
  recall: new EffectDefinition(
    "Shiek-Green-Recall", util.vec3.make(0, 0, 0.5), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerShiekGreen.BLIP_COLOR_A, util.vec4.copy3(PlayerShiekGreen.BLIP_COLOR_B, 0.75), util.vec4.copy3(PlayerShiekGreen.BLIP_COLOR_B, 0)], [2.75, 4.5], 18, "fast"], attachment: true, delay: 0},
      {class: ParticleShiekRecall, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerShiekGreen.BLIP_COLOR_A, PlayerShiekGreen.BLIP_COLOR_B], attachment: false, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/shiek/recall1.wav", 0.6, 0.0, "effect"], attachment: false, delay: 0}
    ]
  )
};

/* global PlayerShiekRainbow */
/* global ParticleShiekLocationRainbow */
/* global ParticleShiekMarkRainbow */
/* global ParticleShiekRecallRainbow */
/* global ParticleShiekChargeRainbow */
/* global ParticleShiekVanishRainbow */
NxFx.shiek.alt.rainbow = {
  mark: new EffectDefinition(
    "Shiek-Rainbow-Mark", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerFoxRainbow.LIGHT_COLOR_A, 0.5), util.vec4.copy3(PlayerFoxRainbow.LIGHT_COLOR_B, 0)], [2.45, 1.25], 18, "fast"], attachment: false, delay: 0},
      {class: ParticleShiekMarkRainbow, params: ["<game *>", "<vec3 pos>", "<vec3 vel>"], attachment: false, delay: 0}//,
      //{class: SpatialSoundInstance, params: ["<sound *>", "multi/hit/slash0.wav", 0.5, 0.0, "effect"], attachment: false, delay: 0}
    ]
  ),
  no: new EffectDefinition(
    "Shiek-Rainbow-NoMark", util.vec3.make(0, 0, 0.01), 0, true,
    [
//      {class: SpatialSoundInstance, params: ["<sound *>", "multi/hit/slash0.wav", 0.5, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  location: new EffectDefinition(
    "Shiek-Rainbow-Location", util.vec3.make(0, 0, 0.01), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerFoxRainbow.LIGHT_COLOR_A, util.vec4.copy3(PlayerFoxRainbow.LIGHT_COLOR_B, 0.5), util.vec4.copy3(PlayerFoxRainbow.LIGHT_COLOR_B, 0)], [1.75, 2.5], 15, "fast"], attachment: false, delay: 0},
      {class: ParticleShiekLocationRainbow, params: ["<game *>", "<vec3 pos>", "<vec3 vel>"], attachment: false, delay: 0}
    ]
  ),
  charge: new EffectDefinition(
    "Shiek-Rainbow-Charge", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerFoxRainbow.LIGHT_COLOR_A, 0.15), util.vec4.copy3(PlayerFoxRainbow.LIGHT_COLOR_B, 1.0)], [1.75, 3.5], 7, "linear"], attachment: true, delay: 0},
      {class: ParticleShiekChargeRainbow, params: ["<game *>", "<vec3 pos>", "<vec3 vel>"], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/shiek/recall0.wav", 0.7, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  vanish: new EffectDefinition(
    "Shiek-Rainbow-Vanish", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerFoxRainbow.LIGHT_COLOR_A, 1.0), util.vec4.copy3(PlayerFoxRainbow.LIGHT_COLOR_B, 0)], [2.45, 1.25], 18, "fast"], attachment: false, delay: 0},
      {class: ParticleShiekVanishRainbow, params: ["<game *>", "<vec3 pos>", "<vec3 vel>"], attachment: false, delay: 0}
    ]
  ),
  recall: new EffectDefinition(
    "Shiek-Rainbow-Recall", util.vec3.make(0, 0, 0.5), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerFoxRainbow.LIGHT_COLOR_A, util.vec4.copy3(PlayerFoxRainbow.LIGHT_COLOR_B, 0.75), util.vec4.copy3(PlayerFox.BLIP_COLOR_B, 0)], [2.75, 4.5], 18, "fast"], attachment: true, delay: 0},
      {class: ParticleShiekRecallRainbow, params: ["<game *>", "<vec3 pos>", "<vec3 vel>"], attachment: false, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/shiek/recall1.wav", 0.6, 0.0, "effect"], attachment: false, delay: 0}
    ]
  )
};

/* global PlayerShiekGold */
NxFx.shiek.alt.gold = {
  mark: new EffectDefinition(
    "Shiek-Gold-Mark", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerFoxGold.BLIP_COLOR_A, 0.5), util.vec4.copy3(PlayerFoxGold.BLIP_COLOR_B, 0)], [2.45, 1.25], 18, "fast"], attachment: false, delay: 0},
      {class: ParticleShiekMark, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerFoxGold.BLIP_COLOR_A, PlayerFoxGold.BLIP_COLOR_B], attachment: false, delay: 0}//,
      //{class: SpatialSoundInstance, params: ["<sound *>", "multi/hit/slash0.wav", 0.5, 0.0, "effect"], attachment: false, delay: 0}
    ]
  ),
  no: new EffectDefinition(
    "Shiek-Gold-NoMark", util.vec3.make(0, 0, 0.01), 0, true,
    [
//      {class: SpatialSoundInstance, params: ["<sound *>", "multi/hit/slash0.wav", 0.5, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  location: new EffectDefinition(
    "Shiek-Gold-Location", util.vec3.make(0, 0, 0.01), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerFoxGold.BLIP_COLOR_A, util.vec4.copy3(PlayerFoxGold.BLIP_COLOR_B, 0.5), util.vec4.copy3(PlayerFoxGold.BLIP_COLOR_B, 0)], [1.75, 2.5], 15, "fast"], attachment: false, delay: 0},
      {class: ParticleMark, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerFoxGold.BLIP_COLOR_A, PlayerFoxGold.BLIP_COLOR_B], attachment: false, delay: 0}
    ]
  ),
  charge: new EffectDefinition(
    "Shiek-Gold-Charge", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerFoxGold.BLIP_COLOR_A, 0.15), util.vec4.copy3(PlayerFoxGold.BLIP_COLOR_B, 1.0)], [1.75, 3.5], 7, "linear"], attachment: true, delay: 0},
      {class: ParticleShiekCharge, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerFoxGold.BLIP_COLOR_A, PlayerFoxGold.BLIP_COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/shiek/recall0.wav", 0.7, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  vanish: new EffectDefinition(
    "Shiek-Gold-Vanish", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerFoxGold.BLIP_COLOR_A, 1.0), util.vec4.copy3(PlayerFoxGold.BLIP_COLOR_B, 0)], [2.45, 1.25], 18, "fast"], attachment: false, delay: 0},
      {class: ParticleShiekVanish, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerFoxGold.BLIP_COLOR_A, PlayerFoxGold.BLIP_COLOR_B], attachment: false, delay: 0}
    ]
  ),
  recall: new EffectDefinition(
    "Shiek-Gold-Recall", util.vec3.make(0, 0, 0.5), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerFoxGold.BLIP_COLOR_A, util.vec4.copy3(PlayerFoxGold.BLIP_COLOR_B, 0.75), util.vec4.copy3(PlayerFoxGold.BLIP_COLOR_B, 0)], [2.75, 4.5], 18, "fast"], attachment: true, delay: 0},
      {class: ParticleShiekRecall, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerFoxGold.BLIP_COLOR_A, PlayerFoxGold.BLIP_COLOR_B], attachment: false, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/shiek/recall1.wav", 0.6, 0.0, "effect"], attachment: false, delay: 0}
    ]
  )
};

/* global PlayerShiekDelta */
NxFx.shiek.alt.delta = {
  mark: new EffectDefinition(
    "Shiek-Delta-Mark", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerFoxDelta.COLOR_A, 0.5), util.vec4.copy3(PlayerFoxDelta.COLOR_B, 0)], [2.45, 1.25], 18, "fast"], attachment: false, delay: 0},
      {class: ParticleShiekMark, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerFoxDelta.COLOR_A, PlayerFoxDelta.COLOR_B], attachment: false, delay: 0}//,
      //{class: SpatialSoundInstance, params: ["<sound *>", "multi/hit/slash0.wav", 0.5, 0.0, "effect"], attachment: false, delay: 0}
    ]
  ),
  no: new EffectDefinition(
    "Shiek-Delta-NoMark", util.vec3.make(0, 0, 0.01), 0, true,
    [
//      {class: SpatialSoundInstance, params: ["<sound *>", "multi/hit/slash0.wav", 0.5, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  location: new EffectDefinition(
    "Shiek-Delta-Location", util.vec3.make(0, 0, 0.01), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerFoxDelta.COLOR_A, util.vec4.copy3(PlayerFoxDelta.COLOR_B, 0.5), util.vec4.copy3(PlayerFoxDelta.COLOR_B, 0)], [1.75, 2.5], 15, "fast"], attachment: false, delay: 0},
      {class: ParticleMark, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerFoxDelta.COLOR_A, PlayerFoxDelta.COLOR_B], attachment: false, delay: 0}
    ]
  ),
  charge: new EffectDefinition(
    "Shiek-Delta-Charge", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerFoxDelta.COLOR_A, 0.15), util.vec4.copy3(PlayerFoxDelta.COLOR_B, 1.0)], [1.75, 3.5], 7, "linear"], attachment: true, delay: 0},
      {class: ParticleShiekCharge, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerFoxDelta.COLOR_A, PlayerFoxDelta.COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/shiek/recall0.wav", 0.7, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  vanish: new EffectDefinition(
    "Shiek-Delta-Vanish", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerFoxDelta.COLOR_A, 1.0), util.vec4.copy3(PlayerFoxDelta.COLOR_B, 0)], [2.45, 1.25], 18, "fast"], attachment: false, delay: 0},
      {class: ParticleShiekVanish, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerFoxDelta.COLOR_A, PlayerFoxDelta.COLOR_B], attachment: false, delay: 0}
    ]
  ),
  recall: new EffectDefinition(
    "Shiek-Delta-Recall", util.vec3.make(0, 0, 0.5), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerFoxDelta.COLOR_A, util.vec4.copy3(PlayerFoxDelta.COLOR_B, 0.75), util.vec4.copy3(PlayerFoxDelta.COLOR_B, 0)], [2.75, 4.5], 18, "fast"], attachment: true, delay: 0},
      {class: ParticleShiekRecall, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerFoxDelta.COLOR_A, PlayerFoxDelta.COLOR_B], attachment: false, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/shiek/recall1.wav", 0.6, 0.0, "effect"], attachment: false, delay: 0}
    ]
  )
};

/* global PlayerFalcoBlack */
/* global PlayerShiekBlack */
NxFx.shiek.alt.black = {
  mark: new EffectDefinition(
    "Shiek-Black-Mark", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerFalcoBlack.LIGHT_COLOR_A, 0.5), util.vec4.copy3(PlayerFalcoBlack.LIGHT_COLOR_B, 0)], [2.45, 1.25], 18, "fast"], attachment: false, delay: 0},
      {class: ParticleShiekMark, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerFalcoBlack.FX_COLOR_A, PlayerFalcoBlack.FX_COLOR_B], attachment: false, delay: 0}//,
      //{class: SpatialSoundInstance, params: ["<sound *>", "multi/hit/slash0.wav", 0.5, 0.0, "effect"], attachment: false, delay: 0}
    ]
  ),
  no: new EffectDefinition(
    "Shiek-Black-NoMark", util.vec3.make(0, 0, 0.01), 0, true,
    [
//      {class: SpatialSoundInstance, params: ["<sound *>", "multi/hit/slash0.wav", 0.5, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  location: new EffectDefinition(
    "Shiek-Black-Location", util.vec3.make(0, 0, 0.01), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerFalcoBlack.LIGHT_COLOR_A, util.vec4.copy3(PlayerFalcoBlack.LIGHT_COLOR_A, 0.5), util.vec4.copy3(PlayerFalcoBlack.LIGHT_COLOR_B, 0)], [1.75, 2.5], 15, "fast"], attachment: false, delay: 0},
      {class: ParticleMark, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerFalcoBlack.FX_COLOR_A, PlayerFalcoBlack.FX_COLOR_B], attachment: false, delay: 0}
    ]
  ),
  charge: new EffectDefinition(
    "Shiek-Black-Charge", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerFalcoBlack.LIGHT_COLOR_A, 0.15), util.vec4.copy3(PlayerFalcoBlack.LIGHT_COLOR_B, 1.0)], [1.75, 3.5], 7, "linear"], attachment: true, delay: 0},
      {class: ParticleShiekCharge, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerFalcoBlack.FX_COLOR_A, PlayerFalcoBlack.FX_COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/shiek/recall0.wav", 0.7, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  vanish: new EffectDefinition(
    "Shiek-Black-Vanish", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerFalcoBlack.LIGHT_COLOR_A, 1.0), util.vec4.copy3(PlayerFalcoBlack.LIGHT_COLOR_B, 0)], [2.45, 1.25], 18, "fast"], attachment: false, delay: 0},
      {class: ParticleShiekVanish, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerFalcoBlack.FX_COLOR_A, PlayerFalcoBlack.FX_COLOR_B], attachment: false, delay: 0}
    ]
  ),
  recall: new EffectDefinition(
    "Shiek-Black-Recall", util.vec3.make(0, 0, 0.5), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerFalcoBlack.LIGHT_COLOR_A, util.vec4.copy3(PlayerFalcoBlack.LIGHT_COLOR_A, 0.75), util.vec4.copy3(PlayerFalcoBlack.LIGHT_COLOR_B, 0)], [2.75, 4.5], 18, "fast"], attachment: true, delay: 0},
      {class: ParticleShiekRecall, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerFalcoBlack.FX_COLOR_A, PlayerFalcoBlack.FX_COLOR_B], attachment: false, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/shiek/recall1.wav", 0.6, 0.0, "effect"], attachment: false, delay: 0}
    ]
  )
};


NxFx.puff.alt = {};

NxFx.puff.alt.voice = {
  rest: new EffectDefinition(
    "Puff-Voice-Rest", util.vec3.make(0.0, 0.0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerPuff.REST_LIGHT, util.vec4.copy3(PlayerPuff.REST_LIGHT, 0.0)], [1.25, 2.15], 18, "fast"], attachment: true, delay: 0},
      {class: ParticleSleep, params: ["<game *>", "<vec3 pos>", "<vec3 vel>"], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/puff/voice/rest0.wav", 0.5, 0.0, "voice"], attachment: true, delay: 0}
    ]
  ),
  wake: new EffectDefinition(
    "Puff-Voice-Wake", util.vec3.make(0.0, 0.0, 0.25), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", "character/puff/voice/rest1.wav", 0.5, 0.0, "voice"], attachment: true, delay: 0}
    ]
  ),
  pound: new EffectDefinition(
    "Puff-Voice-Pound", util.vec3.make(0.0, 0.0, 0.25), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", ["character/puff/voice/attack0.wav", "character/puff/voice/attack1.wav"], 0.5, 0.0, "voice"], attachment: true, delay: 0}
    ]
  ),
  jump: new EffectDefinition(
    "Puff-Voice-Jump", util.vec3.make(0.0, 0.0, 0.25), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", ["character/puff/voice/jump0.wav", "character/puff/voice/jump1.wav", "character/puff/voice/jump2.wav"], 0.5, 0.0, "voice"], attachment: true, delay: 0}
    ]
  ),
  hit: new EffectDefinition(
    "Puff-Voice-Hit", util.vec3.make(0.0, 0.0, 0.25), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", "character/puff/voice/hit0.wav", 0.5, 0.0, "voice"], attachment: true, delay: 0}
    ]
  ),
  explode: new EffectDefinition(
    "Puff-Voice-Explode", util.vec3.make(0.0, 0.0, 0.25), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", "character/puff/voice/impact0.wav", 0.5, 0.0, "voice"], attachment: true, delay: 0}
    ]
  ),
  fall: new EffectDefinition(
    "Puff-Voice-Fall", util.vec3.make(0.0, 0.0, 0.25), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", "character/puff/voice/fall0.wav", 0.5, 0.0, "voice"], attachment: true, delay: 0}
    ]
  ),
  taunt: new EffectDefinition(
    "Puff-Voice-Taunt", util.vec3.make(0.0, 0.0, 0.25), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", ["character/puff/voice/taunt0.wav", "character/puff/voice/taunt1.wav", "character/puff/voice/taunt2.wav"], 0.5, 0.0, "voice"], attachment: true, delay: 0}
    ]
  )
};

/* global PlayerPuffGold */
NxFx.puff.alt.gold = {
  rest: new EffectDefinition(
    "Puff-Gold-Rest", util.vec3.make(0.1, -0.2, 0.55), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerPuff.REST_LIGHT, util.vec4.copy3(PlayerPuff.REST_LIGHT, 0.0)], [1.25, 2.15], 18, "fast"], attachment: true, delay: 0},
      {class: ParticleSleep, params: ["<game *>", "<vec3 pos>", "<vec3 vel>"], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/puff/rest0.wav", 0.8, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  wake: new EffectDefinition(
    "Puff-Gold-Wake", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", "character/puff/rest1.wav", 0.85, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  charge: new EffectDefinition(
    "Puff-Gold-Charge", util.vec3.make(0, 0, 0), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerPuff.REST_LIGHT, 0.0), PlayerPuff.REST_LIGHT], [2.65, 1.55], 9, "slow"], attachment: true, delay: 0},
      {class: ParticlePuffCharge, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerPuff.COLORA, PlayerPuff.COLORB], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/puff/slap0.wav", 0.3, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  dash: new EffectDefinition(
    "Puff-Gold-Dash", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerPuff.REST_LIGHT, util.vec4.copy3(PlayerPuff.REST_LIGHT, 0.65), util.vec4.copy3(PlayerPuff.REST_LIGHT, 0.0)], [1.55, 2.35], 9, "fast"], attachment: true, delay: 0},
      {class: ParticlePuffDash, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerPuff.COLORA, PlayerPuff.COLORB], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/puff/slap1.wav", 0.35, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  slap: new EffectDefinition(
    "Puff-Gold-Slap", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerPuff.REST_LIGHT, 0.7), util.vec4.copy3(PlayerPuff.REST_LIGHT, 0.0)], [1.5, 2.55], 15, "fast"], attachment: true, delay: 0},
      {class: ParticlePuffSlap, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerPuff.COLORA, PlayerPuff.COLORB], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/puff/slap2.wav", 1.0, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  wave: new EffectDefinition(
    "Puff-Gold-Wave", util.vec3.make(0.0, 0.0, 0.0), 0, true,
    [
        {class: ParticlePuffWave, params: ["<game *>", "<vec3 pos>", "<vec3 vel>"], attachment: true, delay: 0}
    ]
  )
};

/* global PlayerPuffWindow */
NxFx.puff.alt.window = {
  rest: new EffectDefinition(
    "Puff-Window-Rest", util.vec3.make(0.1, -0.2, 0.55), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerPuff.REST_LIGHT, util.vec4.copy3(PlayerPuff.REST_LIGHT, 0.0)], [1.25, 2.15], 18, "fast"], attachment: true, delay: 0},
      {class: ParticleSleep, params: ["<game *>", "<vec3 pos>", "<vec3 vel>"], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/puff/xp2.wav", 0.2, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  wake: new EffectDefinition(
    "Puff-Window-Wake", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", "character/puff/xp3.wav", 0.25, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  charge: new EffectDefinition(
    "Puff-Window-Charge", util.vec3.make(0, 0, 0), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerPuff.REST_LIGHT, 0.0), PlayerPuff.REST_LIGHT], [2.65, 1.55], 9, "slow"], attachment: true, delay: 0},
      {class: ParticlePuffCharge, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerPuff.COLORA, PlayerPuff.COLORB], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/puff/slap0.wav", 0.3, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  dash: new EffectDefinition(
    "Puff-Window-Dash", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerPuff.REST_LIGHT, util.vec4.copy3(PlayerPuff.REST_LIGHT, 0.65), util.vec4.copy3(PlayerPuff.REST_LIGHT, 0.0)], [1.55, 2.35], 9, "fast"], attachment: true, delay: 0},
      {class: ParticlePuffDash, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerPuff.COLORA, PlayerPuff.COLORB], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/puff/xp5.wav", 0.85, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  slap: new EffectDefinition(
    "Puff-Window-Slap", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerPuff.REST_LIGHT, 0.7), util.vec4.copy3(PlayerPuff.REST_LIGHT, 0.0)], [1.5, 2.55], 15, "fast"], attachment: true, delay: 0},
      {class: ParticlePuffSlap, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerPuff.COLORA, PlayerPuff.COLORB], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/puff/xp1.wav", 0.55, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  wave: new EffectDefinition(
    "Puff-Window-Wave", util.vec3.make(0.0, 0.0, 0.0), 0, true,
    [
        {class: ParticlePuffWave, params: ["<game *>", "<vec3 pos>", "<vec3 vel>"], attachment: true, delay: 0}
    ]
  ),
  hit: new EffectDefinition(
    "Puff-Window-Hit", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", "character/puff/xp0.wav", 0.55, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  die: new EffectDefinition(
    "Puff-Window-Die", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", "character/puff/xp4.wav", 0.55, 0.0, "effect"], attachment: true, delay: 0}
    ]
  )
};

/* global ParticlePuffSleepRainbow, ParticlePuffChargeRainbow, ParticlePuffDashRainbow, ParticlePuffSlapRainbow, ParticlePuffWaveRainbow */
NxFx.puff.alt.rainbow = {
  rest: new EffectDefinition(
    "Puff-Rainbow-Rest", util.vec3.make(0.1, -0.2, 0.55), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerPuff.REST_LIGHT, util.vec4.copy3(PlayerPuff.REST_LIGHT, 0.0)], [1.25, 2.15], 18, "fast"], attachment: true, delay: 0},
      {class: ParticlePuffSleepRainbow, params: ["<game *>", "<vec3 pos>", "<vec3 vel>"], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/puff/rest0.wav", 0.8, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  wake: new EffectDefinition(
    "Puff-Rainbow-Wake", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", "character/puff/rest1.wav", 0.85, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  charge: new EffectDefinition(
    "Puff-Rainbow-Charge", util.vec3.make(0, 0, 0), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerPuff.REST_LIGHT, 0.0), PlayerPuff.REST_LIGHT], [2.65, 1.55], 9, "slow"], attachment: true, delay: 0},
      {class: ParticlePuffChargeRainbow, params: ["<game *>", "<vec3 pos>", "<vec3 vel>"], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/puff/slap0.wav", 0.3, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  dash: new EffectDefinition(
    "Puff-Rainbow-Dash", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerPuff.REST_LIGHT, util.vec4.copy3(PlayerPuff.REST_LIGHT, 0.65), util.vec4.copy3(PlayerPuff.REST_LIGHT, 0.0)], [1.55, 2.35], 9, "fast"], attachment: true, delay: 0},
      {class: ParticlePuffDashRainbow, params: ["<game *>", "<vec3 pos>", "<vec3 vel>"], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/puff/slap1.wav", 0.35, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  slap: new EffectDefinition(
    "Puff-Rainbow-Slap", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerPuff.REST_LIGHT, 0.7), util.vec4.copy3(PlayerPuff.REST_LIGHT, 0.0)], [1.5, 2.55], 15, "fast"], attachment: true, delay: 0},
      {class: ParticlePuffSlapRainbow, params: ["<game *>", "<vec3 pos>", "<vec3 vel>"], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/puff/slap2.wav", 1.0, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  wave: new EffectDefinition(
    "Puff-Rainbow-Wave", util.vec3.make(0.0, 0.0, 0.0), 0, true,
    [
      {class: ParticlePuffWaveRainbow, params: ["<game *>", "<vec3 pos>", "<vec3 vel>"], attachment: true, delay: 0}
    ]
  )
};

NxFx.captain.alt = {};

NxFx.captain.alt.voice = {
  jump: new EffectDefinition(
    "Captain-Voice-Jump", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", ["character/captain/voice/jump0.wav", "character/captain/voice/jump1.wav"], 0.4, 0.0, "voice"], attachment: true, delay: 0}
    ]
  ),
  hit: new EffectDefinition(
    "Captain-Voice-Hit", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", ["character/captain/voice/hit0.wav", "character/captain/voice/hit1.wav"], 0.4, 0.0, "voice"], attachment: true, delay: 0}
    ]
  ),
  charge: new EffectDefinition(
    "Captain-Voice-Charge", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", "character/captain/voice/punch0.wav", 0.4, 0.0, "voice"], attachment: true, delay: 0}
    ]
  ),
  punch: new EffectDefinition(
    "Captain-Voice-Punch", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", "character/captain/voice/punch1.wav", 0.4, 0.0, "voice"], attachment: true, delay: 0}
    ]
  ),
  taunt: new EffectDefinition(
    "Captain-Voice-Taunt", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", ["character/captain/voice/taunt0.wav", "character/captain/voice/taunt1.wav", "character/captain/voice/taunt2.wav", "character/captain/voice/taunt3.wav"], 0.4, 0.0, "voice"], attachment: true, delay: 0}
    ]
  ),
  explode: new EffectDefinition(
    "Captain-Voice-Explode", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", "character/captain/voice/death0.wav", 0.4, 0.0, "voice"], attachment: true, delay: 0}
    ]
  ),
  fall: new EffectDefinition(
    "Captain-Voice-Fall", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", "character/captain/voice/death1.wav", 0.4, 0.0, "voice"], attachment: true, delay: 0}
    ]
  )
};

/* global PlayerCaptainGold */
NxFx.captain.alt.gold = {
  charge: new EffectDefinition(
    "Captain-Gold-Charge", util.vec3.make(0, 0, 0.0), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerFoxGold.BLIP_COLOR_A, 0), PlayerFoxGold.BLIP_COLOR_B], [1.25, 2.45], 35, "slow"], attachment: true, delay: 0},
      {class: ParticleCaptainCharge, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerFoxGold.BLIP_COLOR_A, PlayerFoxGold.BLIP_COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/captain/punch0.wav", 0.6, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  punch: new EffectDefinition(
    "Captain-Gold-Punch", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerFoxGold.BLIP_COLOR_B, util.vec4.copy3(PlayerFoxGold.BLIP_COLOR_A, 0)], [2.6, 3.45], 25, "slow"], attachment: true, delay: 0},
      {class: ParticleCaptainPunch, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerFoxGold.BLIP_COLOR_A, PlayerFoxGold.BLIP_COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/captain/punch1.wav", 0.75, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  kick: new EffectDefinition(
    "Captain-Gold-Kick", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerFoxGold.BLIP_COLOR_B, util.vec4.copy3(PlayerFoxGold.BLIP_COLOR_A, 0)], [2.6, 3.45], 25, "slow"], attachment: true, delay: 0},
      {class: ParticleCaptainKick, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerFoxGold.BLIP_COLOR_A, PlayerFoxGold.BLIP_COLOR_B], attachment: true, delay: 0},
      {class: ParticleBurn, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerFoxGold.BLIP_COLOR_A, PlayerFoxGold.BLIP_COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/captain/kick0.wav", 0.8, 0.0, "effect"], attachment: true, delay: 0}
    ]
  )
};

/* global PlayerCaptainDelta */
NxFx.captain.alt.delta = {
  charge: new EffectDefinition(
    "Captain-Delta-Charge", util.vec3.make(0, 0, 0.0), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerFoxDelta.COLOR_A, 0), PlayerFoxDelta.COLOR_B], [1.25, 2.45], 35, "slow"], attachment: true, delay: 0},
      {class: ParticleCaptainCharge, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerFoxDelta.COLOR_A, PlayerFoxDelta.COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/captain/punch0.wav", 0.6, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  punch: new EffectDefinition(
    "Captain-Delta-Punch", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerFoxDelta.COLOR_B, util.vec4.copy3(PlayerFoxDelta.COLOR_A, 0)], [2.6, 3.45], 25, "slow"], attachment: true, delay: 0},
      {class: ParticleCaptainPunch, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerFoxDelta.COLOR_A, PlayerFoxDelta.COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/captain/punch1.wav", 0.75, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  kick: new EffectDefinition(
    "Captain-Delta-Kick", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerFoxDelta.COLOR_B, util.vec4.copy3(PlayerFoxDelta.COLOR_A, 0)], [2.6, 3.45], 25, "slow"], attachment: true, delay: 0},
      {class: ParticleCaptainKick, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerFoxDelta.COLOR_A, PlayerFoxDelta.COLOR_B], attachment: true, delay: 0},
      {class: ParticleBurn, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerFoxDelta.COLOR_A, PlayerFoxDelta.COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/captain/kick0.wav", 0.8, 0.0, "effect"], attachment: true, delay: 0}
    ]
  )
};

/* global ParticleCaptainChargeRainbow, ParticleCaptainPunchRainbow, ParticleCaptainKickRainbow, ParticleBurnRainbow */
NxFx.captain.alt.rainbow = {
  charge: new EffectDefinition(
    "Captain-Rainbow-Charge", util.vec3.make(0, 0, 0.0), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerFoxRainbow.LIGHT_COLOR_B, 0), PlayerFoxRainbow.LIGHT_COLOR_A], [1.25, 2.45], 35, "slow"], attachment: true, delay: 0},
      {class: ParticleCaptainChargeRainbow, params: ["<game *>", "<vec3 pos>", "<vec3 vel>"], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/captain/punch0.wav", 0.6, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  punch: new EffectDefinition(
    "Captain-Rainbow-Punch", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerFoxRainbow.LIGHT_COLOR_A, util.vec4.copy3(PlayerFoxRainbow.LIGHT_COLOR_B, 0)], [2.6, 3.45], 25, "slow"], attachment: true, delay: 0},
      {class: ParticleCaptainPunchRainbow, params: ["<game *>", "<vec3 pos>", "<vec3 vel>"], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/captain/punch1.wav", 0.75, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  kick: new EffectDefinition(
    "Captain-Rainbow-Kick", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerFoxRainbow.LIGHT_COLOR_A, util.vec4.copy3(PlayerFoxRainbow.LIGHT_COLOR_B, 0)], [2.6, 3.45], 25, "slow"], attachment: true, delay: 0},
      {class: ParticleCaptainKickRainbow, params: ["<game *>", "<vec3 pos>", "<vec3 vel>"], attachment: true, delay: 0},
      {class: ParticleBurnRainbow, params: ["<game *>", "<vec3 pos>", "<vec3 vel>"], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/captain/kick0.wav", 0.8, 0.0, "effect"], attachment: true, delay: 0}
    ]
  )
};

NxFx.marth.alt = {};

NxFx.marth.alt.voice = {
  jump: new EffectDefinition(
    "Marth-Voice-Jump", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", ["character/marth/voice/jump0.wav", "character/marth/voice/jump1.wav", "character/marth/voice/jump2.wav"], 0.5, 0.0, "voice"], attachment: true, delay: 0}
    ]
  ),
  hit: new EffectDefinition(
    "Marth-Voice-Hit", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", ["character/marth/voice/hit0.wav", "character/marth/voice/hit1.wav", "character/marth/voice/hit2.wav"], 0.5, 0.0, "voice"], attachment: true, delay: 0}
    ]
  ),
  heavy: new EffectDefinition(
    "Marth-Voice-heavy", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", ["character/marth/voice/heavy0.wav", "character/marth/voice/heavy1.wav", "character/marth/voice/heavy2.wav"], 0.5, 0.0, "voice"], attachment: true, delay: 0}
    ]
  ),
  counter: new EffectDefinition(
    "Marth-Voice-Counter", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", "character/marth/voice/counter0.wav", 0.5, 0.0, "voice"], attachment: true, delay: 0}
    ]
  ),
  riposte: new EffectDefinition(
    "Marth-Voice-Riposte", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", ["character/marth/voice/riposte0.wav", "character/marth/voice/riposte1.wav", "character/marth/voice/riposte2.wav"], 0.5, 0.0, "voice"], attachment: true, delay: 0}
    ]
  ),
  taunt: new EffectDefinition(
    "Marth-Voice-Taunt", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", ["character/marth/voice/taunt0.wav", "character/marth/voice/taunt1.wav"], 0.5, 0.0, "voice"], attachment: true, delay: 0}
    ]
  ),
  explode: new EffectDefinition(
    "Marth-Voice-Explode", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", ["character/marth/voice/impact0.wav", "character/marth/voice/impact1.wav", "character/marth/voice/impact2.wav"], 0.5, 0.0, "voice"], attachment: true, delay: 0}
    ]
  ),
  fall: new EffectDefinition(
    "Marth-Voice-Fall", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", "character/marth/voice/fall0.wav", 0.5, 0.0, "voice"], attachment: true, delay: 0}
    ]
  )
};

/* global PlayerMarthRainbow */
/* global ParticleMarthSlashRainbow, ParticleMarthReadyRainbow, ParticleMarthRiposteRainbow */
NxFx.marth.alt.rainbow = {
  light: new EffectDefinition(
    "Marth-Rainbow-Light", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: ParticleMarthSlashRainbow, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerMarth.COLOR_A, PlayerMarth.COLOR_A], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", ["character/marth/light0.wav", "character/marth/light1.wav", "character/marth/light2.wav"], 0.5, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  combo: new EffectDefinition(
    "Marth-Rainbow-Combo", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerMarth.COLOR_A, 0.55), util.vec4.copy3(PlayerMarth.COLOR_A, 0.0)], [1.25, 2.15], 18, "fast"], attachment: true, delay: 0},
      {class: ParticleMarthReadyRainbow, params: ["<game *>", "<vec3 pos>", "<vec3 vel>"], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/marth/combo0.wav", 0.6, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  heavy: new EffectDefinition(
    "Marth-Rainbow-Heavy", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerMarth.COLOR_A, 0.75), util.vec4.copy3(PlayerMarth.COLOR_A, 0.0)], [1.25, 2.25], 18, "fast"], attachment: true, delay: 0},
      {class: ParticleMarthRiposteRainbow, params: ["<game *>", "<vec3 pos>", "<vec3 vel>"], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", ["character/marth/heavy0.wav", "character/marth/heavy1.wav"], 0.7, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  counter: new EffectDefinition(
    "Marth-Rainbow-Counter", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", "character/marth/counter0.wav", 0.6, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  riposte: new EffectDefinition(
    "Marth-Rainbow-Riposte", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerMarth.COLOR_A, 0.9), util.vec4.copy3(PlayerMarth.COLOR_A, 0.0)], [1.35, 2.85], 25, "fast"], attachment: true, delay: 0},
      {class: ParticleMarthRiposteRainbow, params: ["<game *>", "<vec3 pos>", "<vec3 vel>"], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/marth/counter1.wav", 0.7, 0.0, "effect"], attachment: true, delay: 0}
    ]
  )
};

/* global PlayerMarthGold */
NxFx.marth.alt.gold = {
  light: new EffectDefinition(
    "Marth-Gold-Light", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: ParticleSlash, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerFoxGold.BLIP_COLOR_A, PlayerFoxGold.BLIP_COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", ["character/marth/light0.wav", "character/marth/light1.wav", "character/marth/light2.wav"], 0.5, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  combo: new EffectDefinition(
    "Marth-Gold-Combo", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerFoxGold.BLIP_COLOR_A, 0.55), util.vec4.copy3(PlayerFoxGold.BLIP_COLOR_B, 0.0)], [1.25, 2.15], 18, "fast"], attachment: true, delay: 0},
      {class: ParticleReady, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerMarth.COLOR_A, PlayerMarth.COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/marth/combo0.wav", 0.6, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  heavy: new EffectDefinition(
    "Marth-Gold-Heavy", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerFoxGold.BLIP_COLOR_A, 0.75), util.vec4.copy3(PlayerFoxGold.BLIP_COLOR_B, 0.0)], [1.25, 2.25], 18, "fast"], attachment: true, delay: 0},
      {class: ParticleRiposte, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerFoxGold.BLIP_COLOR_A, PlayerFoxGold.BLIP_COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", ["character/marth/heavy0.wav", "character/marth/heavy1.wav"], 0.7, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  counter: new EffectDefinition(
    "Marth-Gold-Counter", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", "character/marth/counter0.wav", 0.6, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  riposte: new EffectDefinition(
    "Marth-Gold-Riposte", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerFoxGold.BLIP_COLOR_A, 0.9), util.vec4.copy3(PlayerFoxGold.BLIP_COLOR_B, 0.0)], [1.35, 2.85], 25, "fast"], attachment: true, delay: 0},
      {class: ParticleRiposte, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerFoxGold.BLIP_COLOR_A, PlayerFoxGold.BLIP_COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/marth/counter1.wav", 0.7, 0.0, "effect"], attachment: true, delay: 0}
    ]
  )
};
/* global PlayerMarthDelta */
NxFx.marth.alt.delta = {
  light: new EffectDefinition(
    "Marth-Delta-Light", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: ParticleSlash, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerFoxDelta.COLOR_A, PlayerFoxDelta.COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", ["character/marth/light0.wav", "character/marth/light1.wav", "character/marth/light2.wav"], 0.5, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  combo: new EffectDefinition(
    "Marth-Delta-Combo", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerFoxDelta.COLOR_A, 0.55), util.vec4.copy3(PlayerFoxDelta.COLOR_B, 0.0)], [1.25, 2.15], 18, "fast"], attachment: true, delay: 0},
      {class: ParticleReady, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerFoxDelta.COLOR_A, PlayerFoxDelta.COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/marth/combo0.wav", 0.6, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  heavy: new EffectDefinition(
    "Marth-Delta-Heavy", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerFoxDelta.COLOR_A, 0.75), util.vec4.copy3(PlayerFoxDelta.COLOR_B, 0.0)], [1.25, 2.25], 18, "fast"], attachment: true, delay: 0},
      {class: ParticleRiposte, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerFoxDelta.COLOR_A, PlayerFoxDelta.COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", ["character/marth/heavy0.wav", "character/marth/heavy1.wav"], 0.7, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  counter: new EffectDefinition(
    "Marth-Delta-Counter", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", "character/marth/counter0.wav", 0.6, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  riposte: new EffectDefinition(
    "Marth-Delta-Riposte", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerFoxDelta.COLOR_A, 0.9), util.vec4.copy3(PlayerFoxDelta.COLOR_B, 0.0)], [1.35, 2.85], 25, "fast"], attachment: true, delay: 0},
      {class: ParticleRiposte, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerFoxDelta.COLOR_A, PlayerFoxDelta.COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/marth/counter1.wav", 0.7, 0.0, "effect"], attachment: true, delay: 0}
    ]
  )
};

/* global PlayerMarthFire */
NxFx.marth.alt.fire = {
  light: new EffectDefinition(
    "Marth-Fire-Light", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: ParticleSlash, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerMarthFire.COLOR_A, PlayerMarthFire.COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", ["character/marth/light0.wav", "character/marth/light1.wav", "character/marth/light2.wav"], 0.5, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  combo: new EffectDefinition(
    "Marth-Fire-Combo", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerMarthFire.COLOR_A, 0.55), util.vec4.copy3(PlayerMarthFire.COLOR_B, 0.0)], [1.25, 2.15], 18, "fast"], attachment: true, delay: 0},
      {class: ParticleReady, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerMarthFire.COLOR_A, PlayerMarthFire.COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/marth/combo0.wav", 0.6, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  heavy: new EffectDefinition(
    "Marth-Fire-Heavy", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerMarthFire.COLOR_A, 0.75), util.vec4.copy3(PlayerMarthFire.COLOR_B, 0.0)], [1.25, 2.25], 18, "fast"], attachment: true, delay: 0},
      {class: ParticleRiposte, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerMarthFire.COLOR_A, PlayerMarthFire.COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", ["character/marth/heavy0.wav", "character/marth/heavy1.wav"], 0.7, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  counter: new EffectDefinition(
    "Marth-Fire-Counter", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", "character/marth/counter0.wav", 0.6, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  riposte: new EffectDefinition(
    "Marth-Fire-Riposte", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerMarthFire.COLOR_A, 0.9), util.vec4.copy3(PlayerMarthFire.COLOR_B, 0.0)], [1.35, 2.85], 25, "fast"], attachment: true, delay: 0},
      {class: ParticleRiposte, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerMarthFire.COLOR_A, PlayerMarthFire.COLOR_B], attachment: true, delay: 0},
      /* {class: ParticleCaptainPunch, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerFalco.FIRE_COLOR_A, PlayerFalco.FIRE_COLOR_C], attachment: true, delay: 0}, */
      {class: SpatialSoundInstance, params: ["<sound *>", "character/captain/punch1.wav", 0.45, 0.0, "effect"], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/marth/counter1.wav", 0.65, 0.0, "effect"], attachment: true, delay: 0}
    ]
  )
};