"use strict";
/* global util */
/* global PointLight */
/* global PointLightInterp */
/* global Decal */
/* global SpatialSoundInstance */

/* Effect definitions. EffectDefinition objects in this class are called ''''''statically'''''' to generate effects. */
var NxFx = {};

NxFx.map = {
  telenter: new EffectDefinition(
    "Map-Teleport-Enter", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerBlock.COLORA, 1.0), util.vec4.copy3(PlayerBlock.COLORB, 0)], [2.45, 1.25], 18, "fast"], attachment: false, delay: 0},
      {class: ParticleVoxelVanish, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerBlock.COLORA, PlayerBlock.COLORB], attachment: false, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/xob/rewind0.wav", 0.7, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  telexit: new EffectDefinition(
    "Map-Teleport-Exit", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerBlock.COLORA, 1.0), util.vec4.copy3(PlayerBlock.COLORB, 0)], [2.45, 1.25], 18, "fast"], attachment: false, delay: 0},
      {class: ParticleVoxelVanish, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerBlock.COLORA, PlayerBlock.COLORB], attachment: false, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/box/dash0.wav", 0.3, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  voided: new EffectDefinition(
    "Map-Void", util.vec3.make(0, 0, 0.5), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerCrateBlack.LIGHT_COLOR_A, util.vec4.copy3(PlayerCrateBlack.LIGHT_COLOR_A, 0.75), util.vec4.copy3(PlayerCrateBlack.LIGHT_COLOR_B, 0)], [2.75, 4.5], 18, "fast"], attachment: true, delay: 0},
      {class: ParticleVoxelRecall, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerCrateBlack.FX_COLOR_A, PlayerCrateBlack.FX_COLOR_B], attachment: false, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "object/void/succ.wav", 0.6, 0.0, "effect"], attachment: false, delay: 0}
    ]
  ),
  bumper: new EffectDefinition(
    "Map-Bumper", util.vec3.make(0, 0, 0.5), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerCrateBlack.LIGHT_COLOR_A, util.vec4.copy3(PlayerCrateBlack.LIGHT_COLOR_A, 0.75), util.vec4.copy3(PlayerCrateBlack.LIGHT_COLOR_B, 0)], [2.75, 4.5], 18, "fast"], attachment: true, delay: 0},
      {class: ParticleVoxelRecall, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerCrateBlack.FX_COLOR_A, PlayerCrateBlack.FX_COLOR_B], attachment: false, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/voxel/recall1.wav", 0.6, 0.0, "effect"], attachment: false, delay: 0}
    ]
  ),
  jumper: new EffectDefinition(
    "Map-Jumper", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerBlock.REST_LIGHT, 0.7), util.vec4.copy3(PlayerBlock.REST_LIGHT, 0.0)], [1.5, 2.55], 15, "fast"], attachment: true, delay: 0},
      {class: ParticleBlockSlap, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerBlock.COLORA, PlayerBlock.COLORB], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "object/jumper/boing.wav", 0.35, 0.0, "effect"], attachment: true, delay: 0}
    ]
  )
};

/* global PlayerBox */
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
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerQuad.COLOR_A, 0.85), util.vec4.copy3(PlayerQuad.COLOR_B, 0.0)], [1.5, 2.0], 15, "fast"], attachment: true, delay: 0},
      {class: ParticleSlashHit, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerQuad.COLOR_A, PlayerQuad.COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", ["multi/hit/slash0.wav", "multi/hit/slash1.wav", "multi/hit/slash2.wav"], 0.5, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  electric: new EffectDefinition(
    "Hit-Electric", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerBox.BLIP_COLOR_A, util.vec4.copy3(PlayerBox.BLIP_COLOR_B, 0)], [1.75, 2.5], 24, "slow"], attachment: true, delay: 0},
      {class: ParticleZap, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerBox.BLIP_COLOR_A, PlayerBox.BLIP_COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", ["multi/hit/electric0.wav", "multi/hit/electric1.wav", "multi/hit/electric2.wav"], 0.4, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  fire: new EffectDefinition(
    "Hit-Fire", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerCrate.FIRE_COLOR_B, util.vec4.copy3(PlayerCrate.FIRE_COLOR_C, 0)], [1.75, 2.5], 30, "slow"], attachment: true, delay: 0},
      {class: ParticleBurn, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerCrate.FIRE_COLOR_A, PlayerCrate.FIRE_COLOR_C], attachment: true, delay: 0},
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
/* global ParticleRecoveryJump */
/* global ParticleRecovery */
/* global ParticleBloodSplat */
/* global ParticleShatter */
/* global ParticleBlockCharge */
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
      {class: SpatialSoundInstance, params: ["<sound *>", ["character/generic/air0.wav", "character/generic/air1.wav", "character/generic/air2.wav"], 0.35, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  recover: new EffectDefinition(
    "Player-Recover", util.vec3.make(0, 0, 0), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerBlock.REST_LIGHT, 0.0), PlayerBlock.REST_LIGHT], [2.65, 1.55], 9, "slow"], attachment: true, delay: 0},
      {class: ParticleBlockCharge, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerBlock.COLORA, PlayerBlock.COLORB], attachment: true, delay: 0},
      {class: ParticleRecovery, params: ["<game *>", "<vec3 pos>", "<vec3 vel>"], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/generic/recover0.wav", 0.35, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  recoverJump: new EffectDefinition(
    "Player-Recover-Jump", util.vec3.make(0, 0, 0.01), 0, true,
    [
      {class: ParticleRecoveryJump, params: ["<game *>", "<vec3 pos>", "<vec3 vel>"], attachment: false, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", ["character/generic/air0.wav", "character/generic/air1.wav", "character/generic/air2.wav"], 0.85, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  land: new EffectDefinition(
    "Player-Land", util.vec3.make(0, 0, 0), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", ["character/generic/land0.wav", "character/generic/land1.wav", "character/generic/land2.wav"], 0.2, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  bloodSplat: new EffectDefinition(
    "Player-BloodSplat", util.vec3.make(0, 0, 0.25), 0, false,
    [
      {class: ParticleBloodSplat, params: ["<game *>", "<vec3 pos>", "<vec3 vel>"], attachment: false, delay: 0},
      {class: Decal, params: ["<game *>", "character.generic.decal.bloodsplat", "<vec3 pos>", util.vec3.make(0.0, 0.0, 1.0), 1.5, Math.random()*6.28319 /* @TODO: fixed random */, util.vec4.make(1, 1, 1, 1), 2, 450, 150], attachment: false, delay: 0}
      /*{class: SpatialSoundInstance, params: ["<sound *>", ["multi/impact/impact0.wav", "multi/impact/impact1.wav", "multi/impact/impact2.wav"], 0.5, 0.0, "effect"], attachment: false, delay: 0} */
    ]
  ),
  shatter: new EffectDefinition(
    "Player-Shatter", util.vec3.make(0, 0, 0), 0 , false,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.make(1., 1., 1., .25), util.vec4.make(1., 1., 1., 0.)], [1.25, 2.15], 18, "fast"], attachment: true, delay: 0},
      {class: ParticleShatter, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", util.vec4.make(1., 1., 1., 1.), util.vec4.make(1., 1., 1., .75)], attachment: false, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", ["character/generic/shatter0.wav", "character/generic/shatter1.wav", "character/generic/shatter2.wav"], 1.0, 0.0, "effect"], attachment: false, delay: 0}
    ]
  ),
  pickup: new EffectDefinition(
    "Player-Pickup", util.vec3.make(0, 0, 0), 0 , true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", ["character/generic/pickup0.wav"], 0.3, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  toss: new EffectDefinition(
    "Player-Toss", util.vec3.make(0, 0, 0), 0 , true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", ["character/generic/toss0.wav"], 0.3, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  fall: new EffectDefinition(
    "Player-Fall", util.vec3.make(0, 0, 0.25), 0, true,
    [
    ]
  )
};

/* global PlayerBox */
/* global ParticleBlip */
/* global ParticleDash */
NxFx.box = {
  blip: new EffectDefinition(
    "Box-Blip", util.vec3.make(0, 0, 0.6), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerBox.BLIP_COLOR_A, util.vec4.copy3(PlayerBox.BLIP_COLOR_B, 0.75), util.vec4.copy3(PlayerBox.BLIP_COLOR_B, 0)], [2.75, 4.5], 18, "fast"], attachment: true, delay: 0},
      {class: ParticleBlip, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerBox.BLIP_COLOR_A, PlayerBox.BLIP_COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/box/blip0.wav", 0.35, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  dash: new EffectDefinition(
    "Box-Dash", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerBox.BLIP_COLOR_A, PlayerBox.BLIP_COLOR_B, util.vec4.copy3(PlayerBox.BLIP_COLOR_B, 0)], [1.25, 4.0], 30, "fast"], attachment: false, delay: 0},
      {class: ParticleDash, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerBox.BLIP_COLOR_A, PlayerBox.BLIP_COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/box/dash0.wav", 0.45, 0.0, "effect"], attachment: true, delay: 0}
    ]
  )
};
/* global ParticleShatterSmall */
/* global ParticleBitBlip */
/* global ParticleBitDash */
NxFx.bit = {
  blip: new EffectDefinition(
    "Bit-Blip", util.vec3.make(0, 0, 0.35), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerBox.BLIP_COLOR_A, 0.6), util.vec4.copy3(PlayerBox.BLIP_COLOR_B, 0.45), util.vec4.copy3(PlayerBox.BLIP_COLOR_B, 0)], [1.75, 3.5], 18, "fast"], attachment: true, delay: 0},
      {class: ParticleBitBlip, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerBox.BLIP_COLOR_A, PlayerBox.BLIP_COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/poly/blip0.wav", 0.2, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  dash: new EffectDefinition(
    "Bit-Dash", util.vec3.make(0, 0, 0.15), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerBox.BLIP_COLOR_A, 0.6), util.vec4.copy3(PlayerBox.BLIP_COLOR_B, 0.45), util.vec4.copy3(PlayerBox.BLIP_COLOR_B, 0)], [0.65, 3.0], 30, "fast"], attachment: false, delay: 0},
      {class: ParticleBitDash, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerBox.BLIP_COLOR_A, PlayerBox.BLIP_COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/poly/dash0.wav", 0.225, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  shatter: new EffectDefinition(
    "Bit-Shatter", util.vec3.make(0, 0, 0), 0 , false,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.make(1., 1., 1., .2), util.vec4.make(1., 1., 1., 0.)], [0.9, 1.55], 18, "fast"], attachment: true, delay: 0},
      {class: ParticleShatterSmall, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", util.vec4.make(1., 1., 1., 1.), util.vec4.make(1., 1., 1., .75)], attachment: false, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", ["character/generic/shatter0.wav", "character/generic/shatter1.wav", "character/generic/shatter2.wav"], 0.7, 0.0, "effect"], attachment: false, delay: 0}
    ]
  )
};

/* global PlayerCrate */
/* global ParticleBlip */
/* global ParticleCrateCharge */
/* global ParticleCrateDash */
NxFx.crate = {
  charge: new EffectDefinition(
    "Crate-Charge", util.vec3.make(0, 0, 0.0), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerCrate.FIRE_COLOR_B, 0), PlayerCrate.FIRE_COLOR_C], [1.25, 2.45], 20, "fast"], attachment: true, delay: 0},
      {class: ParticleCrateCharge, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerCrate.FIRE_COLOR_A, PlayerCrate.FIRE_COLOR_C], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/crate/dash0.wav", 0.6, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  dash: new EffectDefinition(
    "Crate-Dash", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerCrate.FIRE_COLOR_B, util.vec4.copy3(PlayerCrate.FIRE_COLOR_C, 0)], [2.6, 3.45], 25, "slow"], attachment: true, delay: 0},
      {class: ParticleCrateDash, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerCrate.FIRE_COLOR_A, PlayerCrate.FIRE_COLOR_C], attachment: true, delay: 0},
      {class: ParticleBurn, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerCrate.FIRE_COLOR_A, PlayerCrate.FIRE_COLOR_C], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/crate/dash1.wav", 0.8, 0.0, "effect"], attachment: true, delay: 0}
    ]
  )
};

/* global PlayerVoxel */
/* global ParticleBlip */
/* global ParticleMark */
/* global ParticleVoxelMark */
/* global ParticleVoxelRecall */
/* global ParticleVoxelCharge */
/* global ParticleVoxelVanish */
NxFx.voxel = {
  mark: new EffectDefinition(
    "Voxel-Mark", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerBox.BLIP_COLOR_A, 0.5), util.vec4.copy3(PlayerBox.BLIP_COLOR_B, 0)], [2.45, 1.25], 18, "fast"], attachment: false, delay: 0},
      {class: ParticleVoxelMark, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerBox.BLIP_COLOR_A, PlayerBox.BLIP_COLOR_B], attachment: false, delay: 0}//,
      //{class: SpatialSoundInstance, params: ["<sound *>", "multi/hit/slash0.wav", 0.5, 0.0, "effect"], attachment: false, delay: 0}
    ]
  ),
  no: new EffectDefinition(
    "Voxel-NoMark", util.vec3.make(0, 0, 0.01), 0, true,
    [
//      {class: SpatialSoundInstance, params: ["<sound *>", "multi/hit/slash0.wav", 0.5, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  location: new EffectDefinition(
    "Voxel-Location", util.vec3.make(0, 0, 0.01), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerBox.BLIP_COLOR_A, util.vec4.copy3(PlayerBox.BLIP_COLOR_B, 0.5), util.vec4.copy3(PlayerBox.BLIP_COLOR_B, 0)], [1.75, 2.5], 15, "fast"], attachment: false, delay: 0},
      {class: ParticleMark, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerBox.BLIP_COLOR_A, PlayerBox.BLIP_COLOR_B], attachment: false, delay: 0}
    ]
  ),
  charge: new EffectDefinition(
    "Voxel-Charge", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerBox.BLIP_COLOR_A, 0.15), util.vec4.copy3(PlayerBox.BLIP_COLOR_B, 1.0)], [1.75, 3.5], 7, "linear"], attachment: true, delay: 0},
      {class: ParticleVoxelCharge, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerBox.BLIP_COLOR_A, PlayerBox.BLIP_COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/voxel/recall0.wav", 0.9, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  vanish: new EffectDefinition(
    "Voxel-Vanish", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerBox.BLIP_COLOR_A, 1.0), util.vec4.copy3(PlayerBox.BLIP_COLOR_B, 0)], [2.45, 1.25], 18, "fast"], attachment: false, delay: 0},
      {class: ParticleVoxelVanish, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerBox.BLIP_COLOR_A, PlayerBox.BLIP_COLOR_B], attachment: false, delay: 0}
    ]
  ),
  recall: new EffectDefinition(
    "Voxel-Recall", util.vec3.make(0, 0, 0.5), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerBox.BLIP_COLOR_A, util.vec4.copy3(PlayerBox.BLIP_COLOR_B, 0.75), util.vec4.copy3(PlayerBox.BLIP_COLOR_B, 0)], [2.75, 4.5], 18, "fast"], attachment: true, delay: 0},
      {class: ParticleVoxelRecall, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerBox.BLIP_COLOR_A, PlayerBox.BLIP_COLOR_B], attachment: false, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/voxel/recall1.wav", 0.75, 0.0, "effect"], attachment: false, delay: 0}
    ]
  )
};

/* global PlayerBlock */
/* global ParticleSleep */
/* global ParticleBlockCharge */
/* global ParticleBlockDash */
/* global ParticleBlockSlap */
/* global ParticleBlockWave */
/* global ParticleBlockShockwave */
NxFx.block = {
  rest: new EffectDefinition(
    "Block-Rest", util.vec3.make(0.1, -0.2, 0.55), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerBlock.REST_LIGHT, util.vec4.copy3(PlayerBlock.REST_LIGHT, 0.0)], [1.25, 2.15], 18, "fast"], attachment: true, delay: 0},
      {class: ParticleSleep, params: ["<game *>", "<vec3 pos>", "<vec3 vel>"], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/block/rest0.wav", 0.8, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  shockwave: new EffectDefinition(
    "Block-Shockwave", util.vec3.make(0.1, -0.2, 0.55), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerBlock.REST_LIGHT, util.vec4.copy3(PlayerBlock.REST_LIGHT, 0.0)], [1.25, 3.55], 7, "fast"], attachment: true, delay: 0},
      {class: ParticleBlockShockwave, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerBlock.COLORA, PlayerBlock.COLORB], attachment: true, delay: 0}
    ]
  ),
  wake: new EffectDefinition(
    "Block-Wake", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", "character/block/rest1.wav", 0.85, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  charge: new EffectDefinition(
    "Block-Charge", util.vec3.make(0, 0, 0), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerBlock.REST_LIGHT, 0.0), PlayerBlock.REST_LIGHT], [2.65, 1.55], 9, "slow"], attachment: true, delay: 0},
      {class: ParticleBlockCharge, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerBlock.COLORA, PlayerBlock.COLORB], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/block/slap0.wav", 0.3, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  dash: new EffectDefinition(
    "Block-Dash", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerBlock.REST_LIGHT, util.vec4.copy3(PlayerBlock.REST_LIGHT, 0.65), util.vec4.copy3(PlayerBlock.REST_LIGHT, 0.0)], [1.55, 2.35], 9, "fast"], attachment: true, delay: 0},
      {class: ParticleBlockDash, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerBlock.COLORA, PlayerBlock.COLORB], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/block/slap1.wav", 0.35, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  slap: new EffectDefinition(
    "Block-Slap", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerBlock.REST_LIGHT, 0.7), util.vec4.copy3(PlayerBlock.REST_LIGHT, 0.0)], [1.5, 2.55], 15, "fast"], attachment: true, delay: 0},
      {class: ParticleBlockSlap, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerBlock.COLORA, PlayerBlock.COLORB], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/block/slap2.wav", 1.0, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  wave: new EffectDefinition(
    "Block-Wave", util.vec3.make(0.0, 0.0, 0.0), 0, true,
    [
        {class: ParticleBlockWave, params: ["<game *>", "<vec3 pos>", "<vec3 vel>"], attachment: true, delay: 0}
    ]
  )
};

/* global PlayerCargo */
/* global ParticleCargoCharge */
/* global ParticleCargoPunch */
/* global ParticleCargoKick */
NxFx.cargo = {
  charge: new EffectDefinition(
    "Cargo-Charge", util.vec3.make(0, 0, 0.0), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerCrate.FIRE_COLOR_B, 0), PlayerCrate.FIRE_COLOR_C], [1.25, 2.45], 35, "slow"], attachment: true, delay: 0},
      {class: ParticleCargoCharge, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerCrate.FIRE_COLOR_A, PlayerCrate.FIRE_COLOR_C], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/cargo/punch0.wav", 0.6, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  punch: new EffectDefinition(
    "Cargo-Punch", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerCrate.FIRE_COLOR_B, util.vec4.copy3(PlayerCrate.FIRE_COLOR_C, 0)], [2.6, 3.45], 25, "slow"], attachment: true, delay: 0},
      {class: ParticleCargoPunch, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerCrate.FIRE_COLOR_A, PlayerCrate.FIRE_COLOR_C], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/cargo/punch1.wav", 0.75, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  kick: new EffectDefinition(
    "Cargo-Kick", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerCrate.FIRE_COLOR_B, util.vec4.copy3(PlayerCrate.FIRE_COLOR_C, 0)], [2.6, 3.45], 25, "slow"], attachment: true, delay: 0},
      {class: ParticleCargoKick, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerCrate.FIRE_COLOR_A, PlayerCrate.FIRE_COLOR_C], attachment: true, delay: 0},
      {class: ParticleBurn, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerCrate.FIRE_COLOR_A, PlayerCrate.FIRE_COLOR_C], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/cargo/kick0.wav", 0.8, 0.0, "effect"], attachment: true, delay: 0}
    ]
  )
};

/* global PlayerQuad */
/* global ParticleSlash */
/* global ParticleReady */
/* global ParticleRiposte */
NxFx.quad = {
  light: new EffectDefinition(
    "Quad-Light", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: ParticleSlash, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerQuad.COLOR_A, PlayerQuad.COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", ["character/quad/light0.wav", "character/quad/light1.wav", "character/quad/light2.wav"], 0.5, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  combo: new EffectDefinition(
    "Quad-Combo", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerQuad.COLOR_A, 0.55), util.vec4.copy3(PlayerQuad.COLOR_B, 0.0)], [1.25, 2.15], 18, "fast"], attachment: true, delay: 0},
      {class: ParticleReady, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerQuad.COLOR_A, PlayerQuad.COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/quad/combo0.wav", 0.6, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  heavy: new EffectDefinition(
    "Quad-Heavy", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerQuad.COLOR_A, 0.75), util.vec4.copy3(PlayerQuad.COLOR_B, 0.0)], [1.25, 2.25], 18, "fast"], attachment: true, delay: 0},
      {class: ParticleRiposte, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerQuad.COLOR_A, PlayerQuad.COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", ["character/quad/heavy0.wav", "character/quad/heavy1.wav"], 0.7, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  counter: new EffectDefinition(
    "Quad-Counter", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", "character/quad/counter0.wav", 0.6, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  riposte: new EffectDefinition(
    "Quad-Riposte", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerQuad.COLOR_A, 0.9), util.vec4.copy3(PlayerQuad.COLOR_B, 0.0)], [1.35, 2.85], 25, "fast"], attachment: true, delay: 0},
      {class: ParticleRiposte, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerQuad.COLOR_A, PlayerQuad.COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/quad/counter1.wav", 0.7, 0.0, "effect"], attachment: true, delay: 0}
    ]
  )
};

/* global PlayerCube */
/* global ParticleCubeCharge */
/* global ParticleCubeDetonateBlip */
NxFx.cube = {
  charge: new EffectDefinition(
    "Cube-Charge", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerBox.BLIP_COLOR_A, 0.8), util.vec4.copy3(PlayerBox.BLIP_COLOR_B, 1.0)], [2.15, 0.85], 35, "slow"], attachment: false, delay: 0},
      {class: ParticleCubeCharge, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerBox.BLIP_COLOR_A, PlayerBox.BLIP_COLOR_B], attachment: false, delay: 0},
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerBox.BLIP_COLOR_A, 0.15), util.vec4.copy3(PlayerBox.BLIP_COLOR_B, 1.0)], [1.75, 3.5], 7, "linear"], attachment: false, delay: 35},
      {class: ParticleVoxelCharge, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerBox.BLIP_COLOR_A, PlayerBox.BLIP_COLOR_B], attachment: false, delay: 35},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/voxel/recall0.wav", 0.7, 0.0, "effect"], attachment: false, delay: 35}
    ]
  ),
  detonate: new EffectDefinition(
    "Cube-Detonate", util.vec3.make(0, 0, 0.5), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerBox.BLIP_COLOR_A, util.vec4.copy3(PlayerBox.BLIP_COLOR_B, 0.75), util.vec4.copy3(PlayerBox.BLIP_COLOR_B, 0)], [2.75, 4.5], 18, "fast"], attachment: false, delay: 0},
      {class: ParticleCubeDetonateBlip, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerBox.BLIP_COLOR_A, PlayerBox.BLIP_COLOR_B], attachment: false, delay: 0},
      {class: ParticleVoxelRecall, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerBox.BLIP_COLOR_A, PlayerBox.BLIP_COLOR_B], attachment: false, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/voxel/recall1.wav", 0.75, 0.0, "effect"], attachment: false, delay: 0}
    ]
  )
};

NxFx.xob = {
  charge: new EffectDefinition(
    "Xob-Charge", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerBox.BLIP_COLOR_A, 0.15), util.vec4.copy3(PlayerBox.BLIP_COLOR_B, 1.0)], [1.75, 3.5], 4, "linear"], attachment: true, delay: 0},
      {class: ParticleVoxelCharge, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerBox.BLIP_COLOR_A, PlayerBox.BLIP_COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/xob/rewind0.wav", 0.8, 0.0, "effect"], attachment: true, delay: 0}
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

/* global PlayerBoxRed, PlayerCrateOrange, PlayerVoxelGreen, PlayerBoxGold, PlayerBoxRainbow, PlayerCrateBlack */
/* global ParticleZapRainbow */

NxFx.hit.alt = {};

/* global ParticleSlashHitRainbow */
NxFx.hit.alt.slash = {
  purple: new EffectDefinition(
    "Hit-Slash-Purple", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerBoxGold.BLIP_COLOR_A, 0.85), util.vec4.copy3(PlayerBoxGold.BLIP_COLOR_B, 0.0)], [1.5, 2.0], 15, "fast"], attachment: true, delay: 0},
      {class: ParticleSlashHit, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerBoxGold.BLIP_COLOR_A, PlayerBoxGold.BLIP_COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", ["multi/hit/slash0.wav", "multi/hit/slash1.wav", "multi/hit/slash2.wav"], 0.5, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  fire: new EffectDefinition(
    "Hit-Slash-Fire", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerCrate.FIRE_COLOR_B, util.vec4.copy3(PlayerCrate.FIRE_COLOR_C, 0)], [1.75, 2.5], 30, "slow"], attachment: true, delay: 0},
      {class: ParticleSlashHit, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerQuadFire.COLOR_A, PlayerQuadFire.COLOR_B], attachment: true, delay: 0},
      {class: ParticleBurn, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerCrate.FIRE_COLOR_A, PlayerCrate.FIRE_COLOR_C], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", ["multi/hit/fire0.wav", "multi/hit/fire1.wav", "multi/hit/fire2.wav"], 0.55, 0.0, "effect"], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", ["multi/hit/slash0.wav", "multi/hit/slash1.wav", "multi/hit/slash2.wav"], 0.35, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  rainbow: new EffectDefinition(
    "Hit-Slash-Rainbow", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerQuad.COLOR_A, 0.85), util.vec4.copy3(PlayerQuad.COLOR_A, 0.0)], [1.5, 2.0], 15, "fast"], attachment: true, delay: 0},
      {class: ParticleSlashHitRainbow, params: ["<game *>", "<vec3 pos>", "<vec3 vel>"], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", ["multi/hit/slash0.wav", "multi/hit/slash1.wav", "multi/hit/slash2.wav"], 0.5, 0.0, "effect"], attachment: true, delay: 0}
    ]
  )
};

NxFx.hit.alt.electric = {
  red: new EffectDefinition(
    "Hit-Electric-Red", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerBoxRed.BLIP_COLOR_A, util.vec4.copy3(PlayerBoxRed.BLIP_COLOR_B, 0)], [1.75, 2.5], 24, "slow"], attachment: true, delay: 0},
      {class: ParticleZap, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerBoxRed.BLIP_COLOR_A, PlayerBoxRed.BLIP_COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", ["multi/hit/electric0.wav", "multi/hit/electric1.wav", "multi/hit/electric2.wav"], 0.4, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  orange: new EffectDefinition(
    "Hit-Electric-Orange", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerCrateOrange.BLIP_COLOR_A, util.vec4.copy3(PlayerCrateOrange.BLIP_COLOR_B, 0)], [1.75, 2.5], 24, "slow"], attachment: true, delay: 0},
      {class: ParticleZap, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerCrateOrange.BLIP_COLOR_A, PlayerCrateOrange.BLIP_COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", ["multi/hit/electric0.wav", "multi/hit/electric1.wav", "multi/hit/electric2.wav"], 0.4, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  green: new EffectDefinition(
    "Hit-Electric-Green", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerVoxelGreen.BLIP_COLOR_A, util.vec4.copy3(PlayerVoxelGreen.BLIP_COLOR_B, 0)], [1.75, 2.5], 24, "slow"], attachment: true, delay: 0},
      {class: ParticleZap, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerVoxelGreen.BLIP_COLOR_A, PlayerVoxelGreen.BLIP_COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", ["multi/hit/electric0.wav", "multi/hit/electric1.wav", "multi/hit/electric2.wav"], 0.4, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  purple: new EffectDefinition(
    "Hit-Electric-Purple", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerBoxGold.BLIP_COLOR_A, util.vec4.copy3(PlayerBoxGold.BLIP_COLOR_B, 0)], [1.75, 2.5], 24, "slow"], attachment: true, delay: 0},
      {class: ParticleZap, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerBoxGold.BLIP_COLOR_A, PlayerBoxGold.BLIP_COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", ["multi/hit/electric0.wav", "multi/hit/electric1.wav", "multi/hit/electric2.wav"], 0.4, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  black: new EffectDefinition(
    "Hit-Electric-Black", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerCrateBlack.LIGHT_COLOR_A, util.vec4.copy3(PlayerCrateBlack.LIGHT_COLOR_B, 0)], [1.75, 2.5], 24, "slow"], attachment: true, delay: 0},
      {class: ParticleZap, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerCrateBlack.FX_COLOR_A, PlayerCrateBlack.FX_COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", ["multi/hit/electric0.wav", "multi/hit/electric1.wav", "multi/hit/electric2.wav"], 0.4, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  rainbow: new EffectDefinition(
    "Hit-Electric-Rainbow", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerBoxRainbow.LIGHT_COLOR_A, util.vec4.copy3(PlayerBoxRainbow.LIGHT_COLOR_B, 0)], [1.75, 2.5], 24, "slow"], attachment: true, delay: 0},
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
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerBoxGold.BLIP_COLOR_A, util.vec4.copy3(PlayerBoxGold.BLIP_COLOR_B, 0)], [1.75, 2.5], 30, "slow"], attachment: true, delay: 0},
      {class: ParticleBurn, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerBoxGold.BLIP_COLOR_A, PlayerBoxGold.BLIP_COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", ["multi/hit/fire0.wav", "multi/hit/fire1.wav", "multi/hit/fire2.wav"], 0.6, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  blue: new EffectDefinition(
    "Hit-Fire-Blue", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerBoxDelta.COLOR_A, util.vec4.copy3(PlayerBoxDelta.COLOR_B, 0)], [1.75, 2.5], 30, "slow"], attachment: true, delay: 0},
      {class: ParticleBurn, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerBoxDelta.COLOR_A, PlayerBoxDelta.COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", ["multi/hit/fire0.wav", "multi/hit/fire1.wav", "multi/hit/fire2.wav"], 0.6, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  black: new EffectDefinition(
    "Hit-Fire-Black", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerCrateBlack.LIGHT_COLOR_A, util.vec4.copy3(PlayerCrateBlack.LIGHT_COLOR_B, 0)], [1.75, 2.5], 30, "slow"], attachment: true, delay: 0},
      {class: ParticleBurn, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerCrateBlack.FX_COLOR_A, PlayerCrateBlack.FX_COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", ["multi/hit/fire0.wav", "multi/hit/fire1.wav", "multi/hit/fire2.wav"], 0.6, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  rainbow: new EffectDefinition(
    "Hit-Fire-Rainbow", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerBoxRainbow.LIGHT_COLOR_A, util.vec4.copy3(PlayerBoxRainbow.LIGHT_COLOR_B, 0)], [1.75, 2.5], 30, "slow"], attachment: true, delay: 0},
      {class: ParticleBurnRainbow, params: ["<game *>", "<vec3 pos>", "<vec3 vel>"], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", ["multi/hit/fire0.wav", "multi/hit/fire1.wav", "multi/hit/fire2.wav"], 0.6, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  retro: new EffectDefinition(
    "Hit-Fire-Retro", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerCrate.FIRE_COLOR_B, util.vec4.copy3(PlayerCrate.FIRE_COLOR_C, 0)], [1.75, 2.5], 30, "slow"], attachment: true, delay: 0},
      {class: ParticleBurn, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerCrate.FIRE_COLOR_A, PlayerCrate.FIRE_COLOR_C], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", ["multi/hit/fire0.wav", "multi/hit/fire1.wav", "multi/hit/fire2.wav"], 0.6, 0.0, "effect"], attachment: true, delay: 0}
    ]
  )
};

NxFx.box.alt = {};

/* global PlayerBoxRed */
NxFx.box.alt.red = {
  blip: new EffectDefinition(
    "Box-Red-Blip", util.vec3.make(0, 0, 0.6), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerBoxRed.BLIP_COLOR_A, util.vec4.copy3(PlayerBoxRed.BLIP_COLOR_B, 0.75), util.vec4.copy3(PlayerBoxRed.BLIP_COLOR_B, 0)], [2.75, 4.5], 18, "fast"], attachment: true, delay: 0},
      {class: ParticleBlip, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerBoxRed.BLIP_COLOR_A, PlayerBoxRed.BLIP_COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/box/blip0.wav", 0.35, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  dash: new EffectDefinition(
    "Box-Red-Dash", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerBoxRed.BLIP_COLOR_A, PlayerBoxRed.BLIP_COLOR_B, util.vec4.copy3(PlayerBoxRed.BLIP_COLOR_B, 0)], [1.25, 4.0], 30, "fast"], attachment: false, delay: 0},
      {class: ParticleDash, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerBoxRed.BLIP_COLOR_A, PlayerBoxRed.BLIP_COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/box/dash0.wav", 0.45, 0.0, "effect"], attachment: true, delay: 0}
    ]
  )
};

/* global PlayerBoxRainbow */
/* global ParticleBlipRainbow */
/* global ParticleDashRainbow */
NxFx.box.alt.rainbow = {
  blip: new EffectDefinition(
    "Box-Rainbow-Blip", util.vec3.make(0, 0, 0.6), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerBoxRainbow.LIGHT_COLOR_A, util.vec4.copy3(PlayerBoxRainbow.LIGHT_COLOR_B, 0.75), util.vec4.copy3(PlayerBoxRainbow.LIGHT_COLOR_B, 0)], [2.75, 4.5], 18, "fast"], attachment: true, delay: 0},
      {class: ParticleBlipRainbow, params: ["<game *>", "<vec3 pos>", "<vec3 vel>"], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/box/blip0.wav", 0.35, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  dash: new EffectDefinition(
    "Box-Rainbow-Dash", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerBoxRainbow.LIGHT_COLOR_A, PlayerBoxRainbow.LIGHT_COLOR_B, util.vec4.copy3(PlayerBoxRainbow.LIGHT_COLOR_B, 0)], [1.25, 4.0], 30, "fast"], attachment: false, delay: 0},
      {class: ParticleDashRainbow, params: ["<game *>", "<vec3 pos>", "<vec3 vel>"], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/box/dash0.wav", 0.45, 0.0, "effect"], attachment: true, delay: 0}
    ]
  )
};

/* global PlayerBoxGold */
NxFx.box.alt.gold = {
  blip: new EffectDefinition(
    "Box-Gold-Blip", util.vec3.make(0, 0, 0.6), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerBoxGold.BLIP_COLOR_A, util.vec4.copy3(PlayerBoxGold.BLIP_COLOR_B, 0.75), util.vec4.copy3(PlayerBoxGold.BLIP_COLOR_B, 0)], [2.75, 4.5], 18, "fast"], attachment: true, delay: 0},
      {class: ParticleBlip, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerBoxGold.BLIP_COLOR_A, PlayerBoxGold.BLIP_COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/box/blip0.wav", 0.35, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  dash: new EffectDefinition(
    "Box-Gold-Dash", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerBoxGold.BLIP_COLOR_A, PlayerBoxGold.BLIP_COLOR_B, util.vec4.copy3(PlayerBoxGold.BLIP_COLOR_B, 0)], [1.25, 4.0], 30, "fast"], attachment: false, delay: 0},
      {class: ParticleDash, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerBoxGold.BLIP_COLOR_A, PlayerBoxGold.BLIP_COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/box/dash0.wav", 0.45, 0.0, "effect"], attachment: true, delay: 0}
    ]
  )
};

/* global PlayerBoxDelta */
/* global ParticleBlipDelta */
NxFx.box.alt.delta = {
  blip: new EffectDefinition(
    "Box-Delta-Blip", util.vec3.make(0, 0, 0.6), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerBoxDelta.COLOR_A, util.vec4.copy3(PlayerBoxDelta.COLOR_B, 0.75), util.vec4.copy3(PlayerBoxDelta.COLOR_B, 0)], [2.75, 4.5], 18, "fast"], attachment: true, delay: 0},
      {class: ParticleBlipDelta, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerBoxDelta.COLOR_A, PlayerBoxDelta.COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/box/blip0.wav", 0.35, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  dash: new EffectDefinition(
    "Box-Delta-Dash", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerBoxDelta.COLOR_A, PlayerBoxDelta.COLOR_B, util.vec4.copy3(PlayerBoxDelta.COLOR_B, 0)], [1.25, 4.0], 30, "fast"], attachment: false, delay: 0},
      {class: ParticleDash, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerBoxDelta.COLOR_A, PlayerBoxDelta.COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/box/dash0.wav", 0.45, 0.0, "effect"], attachment: true, delay: 0}
    ]
  )
};

/* global PlayerBoxHit */
/* global ParticleHitMarker */
NxFx.box.alt.hit = {
  blip: new EffectDefinition(
    "Box-Hit-Blip", util.vec3.make(0, 0, 0.65), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerBoxHit.COLOR_A, util.vec4.copy3(PlayerBoxHit.COLOR_B, 0.75), util.vec4.copy3(PlayerBoxHit.COLOR_B, 0)], [2.75, 4.5], 18, "fast"], attachment: true, delay: 0},
      {class: ParticleHitMarker, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerBoxHit.COLOR_A, PlayerBoxHit.COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/box/hit0.wav", 0.6, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  dash: new EffectDefinition(
    "Box-Hit-Dash", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerBoxHit.COLOR_A, PlayerBoxHit.COLOR_B, util.vec4.copy3(PlayerBoxHit.COLOR_B, 0)], [1.25, 4.0], 30, "fast"], attachment: false, delay: 0},
      {class: ParticleDash, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerBoxHit.COLOR_A, PlayerBoxHit.COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/box/dash0.wav", 0.45, 0.0, "effect"], attachment: true, delay: 0}
    ]
  )
};

NxFx.crate.alt = {};

NxFx.crate.alt.voice = {
  jump: new EffectDefinition(
    "Crate-Voice-Jump", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", ["character/crate/voice/jump0.wav", "character/crate/voice/jump1.wav", "character/crate/voice/jump2.wav"], 0.45, 0.0, "voice"], attachment: true, delay: 0}
    ]
  ),
  hit: new EffectDefinition(
    "Crate-Voice-Hit", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", ["character/crate/voice/hit0.wav", "character/crate/voice/hit1.wav"], 0.45, 0.0, "voice"], attachment: true, delay: 0}
    ]
  ),
  dash: new EffectDefinition(
    "Crate-Voice-Dash", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", "character/crate/voice/dash0.wav", 0.45, 0.0, "voice"], attachment: true, delay: 0}
    ]
  ),
  taunt: new EffectDefinition(
    "Crate-Voice-Taunt", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", ["character/crate/voice/taunt0.wav", "character/crate/voice/taunt1.wav", "character/crate/voice/taunt2.wav"], 0.45, 0.0, "voice"], attachment: true, delay: 0}
    ]
  ),
  explode: new EffectDefinition(
    "Crate-Voice-Explode", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", ["character/crate/voice/impact0.wav", "character/crate/voice/impact1.wav", "character/crate/voice/impact2.wav"], 0.45, 0.0, "voice"], attachment: true, delay: 0}
    ]
  ),
  fall: new EffectDefinition(
    "Crate-Voice-Fall", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", "character/crate/voice/fall0.wav", 0.45, 0.0, "voice"], attachment: true, delay: 0}
    ]
  )
};

/* global PlayerCrateOrange */
NxFx.crate.alt.orange = {
  blip: new EffectDefinition(
    "Crate-Orange-Blip", util.vec3.make(0, 0, 0.6), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerCrateOrange.BLIP_COLOR_A, util.vec4.copy3(PlayerCrateOrange.BLIP_COLOR_B, 0.75), util.vec4.copy3(PlayerCrateOrange.BLIP_COLOR_B, 0)], [2.75, 4.5], 18, "fast"], attachment: true, delay: 0},
      {class: ParticleBlip, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerCrateOrange.BLIP_COLOR_A, PlayerCrateOrange.BLIP_COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/box/blip0.wav", 0.35, 0.0, "effect"], attachment: true, delay: 0}
    ]
  )
};

/* global PlayerCrateRainbow */
/* global ParticleBlipRainbow */
/* global ParticleCrateChargeRainbow */
/* global ParticleCrateDashRainbow */
NxFx.crate.alt.rainbow = {
  charge: new EffectDefinition(
    "Crate-Rainbow-Charge", util.vec3.make(0, 0, 0.0), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerBoxRainbow.LIGHT_COLOR_B, 0), PlayerBoxRainbow.LIGHT_COLOR_A], [1.25, 2.45], 20, "fast"], attachment: true, delay: 0},
      {class: ParticleCrateChargeRainbow, params: ["<game *>", "<vec3 pos>", "<vec3 vel>"], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/crate/dash0.wav", 0.6, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  dash: new EffectDefinition(
    "Crate-Rainbow-Dash", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerBoxRainbow.LIGHT_COLOR_A, util.vec4.copy3(PlayerBoxRainbow.LIGHT_COLOR_B, 0)], [2.6, 3.45], 25, "slow"], attachment: true, delay: 0},
      {class: ParticleCrateDashRainbow, params: ["<game *>", "<vec3 pos>", "<vec3 vel>"], attachment: true, delay: 0},
      {class: ParticleBurnRainbow, params: ["<game *>", "<vec3 pos>", "<vec3 vel>"], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/crate/dash1.wav", 0.8, 0.0, "effect"], attachment: true, delay: 0}
    ]
  )
};

/* global PlayerCrateGold */
NxFx.crate.alt.gold = {
  charge: new EffectDefinition(
    "Crate-Gold-Charge", util.vec3.make(0, 0, 0.0), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerBoxGold.BLIP_COLOR_A, 0), PlayerBoxGold.BLIP_COLOR_B], [1.25, 2.45], 20, "fast"], attachment: true, delay: 0},
      {class: ParticleCrateCharge, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerBoxGold.BLIP_COLOR_A, PlayerBoxGold.BLIP_COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/crate/dash0.wav", 0.6, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  dash: new EffectDefinition(
    "Crate-Gold-Dash", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerBoxGold.BLIP_COLOR_B, util.vec4.copy3(PlayerBoxGold.BLIP_COLOR_A, 0)], [2.6, 3.45], 25, "slow"], attachment: true, delay: 0},
      {class: ParticleCrateDash, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerBoxGold.BLIP_COLOR_A, PlayerBoxGold.BLIP_COLOR_B], attachment: true, delay: 0},
      {class: ParticleBurn, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerBoxGold.BLIP_COLOR_A, PlayerBoxGold.BLIP_COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/crate/dash1.wav", 0.8, 0.0, "effect"], attachment: true, delay: 0}
    ]
  )
};

/* global PlayerCrateDelta */
NxFx.crate.alt.delta = {
  charge: new EffectDefinition(
    "Crate-Delta-Charge", util.vec3.make(0, 0, 0.0), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerBoxDelta.COLOR_A, 0), PlayerBoxDelta.COLOR_B], [1.25, 2.45], 20, "fast"], attachment: true, delay: 0},
      {class: ParticleCrateCharge, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerBoxDelta.COLOR_A, PlayerBoxDelta.COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/crate/dash0.wav", 0.6, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  dash: new EffectDefinition(
    "Crate-Delta-Dash", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerBoxDelta.COLOR_B, util.vec4.copy3(PlayerBoxDelta.COLOR_A, 0)], [2.6, 3.45], 25, "slow"], attachment: true, delay: 0},
      {class: ParticleCrateDash, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerBoxDelta.COLOR_A, PlayerBoxDelta.COLOR_B], attachment: true, delay: 0},
      {class: ParticleBurn, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerBoxDelta.COLOR_A, PlayerBoxDelta.COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/crate/dash1.wav", 0.8, 0.0, "effect"], attachment: true, delay: 0}
    ]
  )
};

/* global PlayerCrateBlack */
NxFx.crate.alt.black = {
  blip: new EffectDefinition(
    "Crate-Black-Blip", util.vec3.make(0, 0, 0.6), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerCrateBlack.LIGHT_COLOR_A, util.vec4.copy3(PlayerCrateBlack.LIGHT_COLOR_A, 0.75), util.vec4.copy3(PlayerCrateBlack.LIGHT_COLOR_B, 0)], [2.75, 4.5], 18, "fast"], attachment: true, delay: 0},
      {class: ParticleBlip, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerCrateBlack.FX_COLOR_B, PlayerCrateBlack.FX_COLOR_A], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/box/blip0.wav", 0.35, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  charge: new EffectDefinition(
    "Crate-Black-Charge", util.vec3.make(0, 0, 0.0), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerCrateBlack.LIGHT_COLOR_B, 0), PlayerCrateBlack.LIGHT_COLOR_A], [1.25, 2.45], 20, "fast"], attachment: true, delay: 0},
      {class: ParticleCrateCharge, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerCrateBlack.FX_COLOR_A, PlayerCrateBlack.FX_COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/crate/dash0.wav", 0.6, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  dash: new EffectDefinition(
    "Crate-Black-Dash", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerCrateBlack.LIGHT_COLOR_A, util.vec4.copy3(PlayerCrateBlack.LIGHT_COLOR_B, 0)], [2.6, 3.45], 25, "slow"], attachment: true, delay: 0},
      {class: ParticleCrateDash, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerCrateBlack.FX_COLOR_A, PlayerCrateBlack.FX_COLOR_B], attachment: true, delay: 0},
      {class: ParticleBurn, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerCrateBlack.FX_COLOR_A, PlayerCrateBlack.FX_COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/crate/dash1.wav", 0.8, 0.0, "effect"], attachment: true, delay: 0}
    ]
  )
};

NxFx.voxel.alt = {};

/* global PlayerVoxelGreen */
NxFx.voxel.alt.green = {
  blip: new EffectDefinition(
    "Voxel-Green-Blip", util.vec3.make(0, 0, 0.6), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerVoxelGreen.BLIP_COLOR_A, util.vec4.copy3(PlayerVoxelGreen.BLIP_COLOR_B, 0.75), util.vec4.copy3(PlayerVoxelGreen.BLIP_COLOR_B, 0)], [2.75, 4.5], 18, "fast"], attachment: true, delay: 0},
      {class: ParticleBlip, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerVoxelGreen.BLIP_COLOR_A, PlayerVoxelGreen.BLIP_COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/box/blip0.wav", 0.35, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  mark: new EffectDefinition(
    "Voxel-Green-Mark", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerVoxelGreen.BLIP_COLOR_A, 0.5), util.vec4.copy3(PlayerVoxelGreen.BLIP_COLOR_B, 0)], [2.45, 1.25], 18, "fast"], attachment: false, delay: 0},
      {class: ParticleVoxelMark, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerVoxelGreen.BLIP_COLOR_A, PlayerVoxelGreen.BLIP_COLOR_B], attachment: false, delay: 0}//,
      //{class: SpatialSoundInstance, params: ["<sound *>", "multi/hit/slash0.wav", 0.5, 0.0, "effect"], attachment: false, delay: 0}
    ]
  ),
  no: new EffectDefinition(
    "Voxel-Green-NoMark", util.vec3.make(0, 0, 0.01), 0, true,
    [
//      {class: SpatialSoundInstance, params: ["<sound *>", "multi/hit/slash0.wav", 0.5, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  location: new EffectDefinition(
    "Voxel-Green-Location", util.vec3.make(0, 0, 0.01), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerVoxelGreen.BLIP_COLOR_A, util.vec4.copy3(PlayerVoxelGreen.BLIP_COLOR_B, 0.5), util.vec4.copy3(PlayerVoxelGreen.BLIP_COLOR_B, 0)], [1.75, 2.5], 15, "fast"], attachment: false, delay: 0},
      {class: ParticleMark, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerVoxelGreen.BLIP_COLOR_A, PlayerVoxelGreen.BLIP_COLOR_B], attachment: false, delay: 0}
    ]
  ),
  charge: new EffectDefinition(
    "Voxel-Green-Charge", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerVoxelGreen.BLIP_COLOR_A, 0.15), util.vec4.copy3(PlayerVoxelGreen.BLIP_COLOR_B, 1.0)], [1.75, 3.5], 7, "linear"], attachment: true, delay: 0},
      {class: ParticleVoxelCharge, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerVoxelGreen.BLIP_COLOR_A, PlayerVoxelGreen.BLIP_COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/voxel/recall0.wav", 0.7, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  vanish: new EffectDefinition(
    "Voxel-Green-Vanish", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerVoxelGreen.BLIP_COLOR_A, 1.0), util.vec4.copy3(PlayerVoxelGreen.BLIP_COLOR_B, 0)], [2.45, 1.25], 18, "fast"], attachment: false, delay: 0},
      {class: ParticleVoxelVanish, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerVoxelGreen.BLIP_COLOR_A, PlayerVoxelGreen.BLIP_COLOR_B], attachment: false, delay: 0}
    ]
  ),
  recall: new EffectDefinition(
    "Voxel-Green-Recall", util.vec3.make(0, 0, 0.5), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerVoxelGreen.BLIP_COLOR_A, util.vec4.copy3(PlayerVoxelGreen.BLIP_COLOR_B, 0.75), util.vec4.copy3(PlayerVoxelGreen.BLIP_COLOR_B, 0)], [2.75, 4.5], 18, "fast"], attachment: true, delay: 0},
      {class: ParticleVoxelRecall, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerVoxelGreen.BLIP_COLOR_A, PlayerVoxelGreen.BLIP_COLOR_B], attachment: false, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/voxel/recall1.wav", 0.6, 0.0, "effect"], attachment: false, delay: 0}
    ]
  )
};

/* global PlayerVoxelRainbow */
/* global ParticleVoxelLocationRainbow */
/* global ParticleVoxelMarkRainbow */
/* global ParticleVoxelRecallRainbow */
/* global ParticleVoxelChargeRainbow */
/* global ParticleVoxelVanishRainbow */
NxFx.voxel.alt.rainbow = {
  mark: new EffectDefinition(
    "Voxel-Rainbow-Mark", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerBoxRainbow.LIGHT_COLOR_A, 0.5), util.vec4.copy3(PlayerBoxRainbow.LIGHT_COLOR_B, 0)], [2.45, 1.25], 18, "fast"], attachment: false, delay: 0},
      {class: ParticleVoxelMarkRainbow, params: ["<game *>", "<vec3 pos>", "<vec3 vel>"], attachment: false, delay: 0}//,
      //{class: SpatialSoundInstance, params: ["<sound *>", "multi/hit/slash0.wav", 0.5, 0.0, "effect"], attachment: false, delay: 0}
    ]
  ),
  no: new EffectDefinition(
    "Voxel-Rainbow-NoMark", util.vec3.make(0, 0, 0.01), 0, true,
    [
//      {class: SpatialSoundInstance, params: ["<sound *>", "multi/hit/slash0.wav", 0.5, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  location: new EffectDefinition(
    "Voxel-Rainbow-Location", util.vec3.make(0, 0, 0.01), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerBoxRainbow.LIGHT_COLOR_A, util.vec4.copy3(PlayerBoxRainbow.LIGHT_COLOR_B, 0.5), util.vec4.copy3(PlayerBoxRainbow.LIGHT_COLOR_B, 0)], [1.75, 2.5], 15, "fast"], attachment: false, delay: 0},
      {class: ParticleVoxelLocationRainbow, params: ["<game *>", "<vec3 pos>", "<vec3 vel>"], attachment: false, delay: 0}
    ]
  ),
  charge: new EffectDefinition(
    "Voxel-Rainbow-Charge", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerBoxRainbow.LIGHT_COLOR_A, 0.15), util.vec4.copy3(PlayerBoxRainbow.LIGHT_COLOR_B, 1.0)], [1.75, 3.5], 7, "linear"], attachment: true, delay: 0},
      {class: ParticleVoxelChargeRainbow, params: ["<game *>", "<vec3 pos>", "<vec3 vel>"], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/voxel/recall0.wav", 0.7, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  vanish: new EffectDefinition(
    "Voxel-Rainbow-Vanish", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerBoxRainbow.LIGHT_COLOR_A, 1.0), util.vec4.copy3(PlayerBoxRainbow.LIGHT_COLOR_B, 0)], [2.45, 1.25], 18, "fast"], attachment: false, delay: 0},
      {class: ParticleVoxelVanishRainbow, params: ["<game *>", "<vec3 pos>", "<vec3 vel>"], attachment: false, delay: 0}
    ]
  ),
  recall: new EffectDefinition(
    "Voxel-Rainbow-Recall", util.vec3.make(0, 0, 0.5), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerBoxRainbow.LIGHT_COLOR_A, util.vec4.copy3(PlayerBoxRainbow.LIGHT_COLOR_B, 0.75), util.vec4.copy3(PlayerBox.BLIP_COLOR_B, 0)], [2.75, 4.5], 18, "fast"], attachment: true, delay: 0},
      {class: ParticleVoxelRecallRainbow, params: ["<game *>", "<vec3 pos>", "<vec3 vel>"], attachment: false, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/voxel/recall1.wav", 0.6, 0.0, "effect"], attachment: false, delay: 0}
    ]
  )
};

/* global PlayerVoxelGold */
NxFx.voxel.alt.gold = {
  mark: new EffectDefinition(
    "Voxel-Gold-Mark", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerBoxGold.BLIP_COLOR_A, 0.5), util.vec4.copy3(PlayerBoxGold.BLIP_COLOR_B, 0)], [2.45, 1.25], 18, "fast"], attachment: false, delay: 0},
      {class: ParticleVoxelMark, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerBoxGold.BLIP_COLOR_A, PlayerBoxGold.BLIP_COLOR_B], attachment: false, delay: 0}//,
      //{class: SpatialSoundInstance, params: ["<sound *>", "multi/hit/slash0.wav", 0.5, 0.0, "effect"], attachment: false, delay: 0}
    ]
  ),
  no: new EffectDefinition(
    "Voxel-Gold-NoMark", util.vec3.make(0, 0, 0.01), 0, true,
    [
//      {class: SpatialSoundInstance, params: ["<sound *>", "multi/hit/slash0.wav", 0.5, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  location: new EffectDefinition(
    "Voxel-Gold-Location", util.vec3.make(0, 0, 0.01), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerBoxGold.BLIP_COLOR_A, util.vec4.copy3(PlayerBoxGold.BLIP_COLOR_B, 0.5), util.vec4.copy3(PlayerBoxGold.BLIP_COLOR_B, 0)], [1.75, 2.5], 15, "fast"], attachment: false, delay: 0},
      {class: ParticleMark, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerBoxGold.BLIP_COLOR_A, PlayerBoxGold.BLIP_COLOR_B], attachment: false, delay: 0}
    ]
  ),
  charge: new EffectDefinition(
    "Voxel-Gold-Charge", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerBoxGold.BLIP_COLOR_A, 0.15), util.vec4.copy3(PlayerBoxGold.BLIP_COLOR_B, 1.0)], [1.75, 3.5], 7, "linear"], attachment: true, delay: 0},
      {class: ParticleVoxelCharge, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerBoxGold.BLIP_COLOR_A, PlayerBoxGold.BLIP_COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/voxel/recall0.wav", 0.7, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  vanish: new EffectDefinition(
    "Voxel-Gold-Vanish", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerBoxGold.BLIP_COLOR_A, 1.0), util.vec4.copy3(PlayerBoxGold.BLIP_COLOR_B, 0)], [2.45, 1.25], 18, "fast"], attachment: false, delay: 0},
      {class: ParticleVoxelVanish, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerBoxGold.BLIP_COLOR_A, PlayerBoxGold.BLIP_COLOR_B], attachment: false, delay: 0}
    ]
  ),
  recall: new EffectDefinition(
    "Voxel-Gold-Recall", util.vec3.make(0, 0, 0.5), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerBoxGold.BLIP_COLOR_A, util.vec4.copy3(PlayerBoxGold.BLIP_COLOR_B, 0.75), util.vec4.copy3(PlayerBoxGold.BLIP_COLOR_B, 0)], [2.75, 4.5], 18, "fast"], attachment: true, delay: 0},
      {class: ParticleVoxelRecall, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerBoxGold.BLIP_COLOR_A, PlayerBoxGold.BLIP_COLOR_B], attachment: false, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/voxel/recall1.wav", 0.6, 0.0, "effect"], attachment: false, delay: 0}
    ]
  )
};

/* global PlayerVoxelDelta */
NxFx.voxel.alt.delta = {
  mark: new EffectDefinition(
    "Voxel-Delta-Mark", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerBoxDelta.COLOR_A, 0.5), util.vec4.copy3(PlayerBoxDelta.COLOR_B, 0)], [2.45, 1.25], 18, "fast"], attachment: false, delay: 0},
      {class: ParticleVoxelMark, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerBoxDelta.COLOR_A, PlayerBoxDelta.COLOR_B], attachment: false, delay: 0}//,
      //{class: SpatialSoundInstance, params: ["<sound *>", "multi/hit/slash0.wav", 0.5, 0.0, "effect"], attachment: false, delay: 0}
    ]
  ),
  no: new EffectDefinition(
    "Voxel-Delta-NoMark", util.vec3.make(0, 0, 0.01), 0, true,
    [
//      {class: SpatialSoundInstance, params: ["<sound *>", "multi/hit/slash0.wav", 0.5, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  location: new EffectDefinition(
    "Voxel-Delta-Location", util.vec3.make(0, 0, 0.01), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerBoxDelta.COLOR_A, util.vec4.copy3(PlayerBoxDelta.COLOR_B, 0.5), util.vec4.copy3(PlayerBoxDelta.COLOR_B, 0)], [1.75, 2.5], 15, "fast"], attachment: false, delay: 0},
      {class: ParticleMark, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerBoxDelta.COLOR_A, PlayerBoxDelta.COLOR_B], attachment: false, delay: 0}
    ]
  ),
  charge: new EffectDefinition(
    "Voxel-Delta-Charge", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerBoxDelta.COLOR_A, 0.15), util.vec4.copy3(PlayerBoxDelta.COLOR_B, 1.0)], [1.75, 3.5], 7, "linear"], attachment: true, delay: 0},
      {class: ParticleVoxelCharge, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerBoxDelta.COLOR_A, PlayerBoxDelta.COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/voxel/recall0.wav", 0.7, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  vanish: new EffectDefinition(
    "Voxel-Delta-Vanish", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerBoxDelta.COLOR_A, 1.0), util.vec4.copy3(PlayerBoxDelta.COLOR_B, 0)], [2.45, 1.25], 18, "fast"], attachment: false, delay: 0},
      {class: ParticleVoxelVanish, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerBoxDelta.COLOR_A, PlayerBoxDelta.COLOR_B], attachment: false, delay: 0}
    ]
  ),
  recall: new EffectDefinition(
    "Voxel-Delta-Recall", util.vec3.make(0, 0, 0.5), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerBoxDelta.COLOR_A, util.vec4.copy3(PlayerBoxDelta.COLOR_B, 0.75), util.vec4.copy3(PlayerBoxDelta.COLOR_B, 0)], [2.75, 4.5], 18, "fast"], attachment: true, delay: 0},
      {class: ParticleVoxelRecall, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerBoxDelta.COLOR_A, PlayerBoxDelta.COLOR_B], attachment: false, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/voxel/recall1.wav", 0.6, 0.0, "effect"], attachment: false, delay: 0}
    ]
  )
};

/* global PlayerCrateBlack */
/* global PlayerVoxelBlack */
NxFx.voxel.alt.black = {
  mark: new EffectDefinition(
    "Voxel-Black-Mark", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerCrateBlack.LIGHT_COLOR_A, 0.5), util.vec4.copy3(PlayerCrateBlack.LIGHT_COLOR_B, 0)], [2.45, 1.25], 18, "fast"], attachment: false, delay: 0},
      {class: ParticleVoxelMark, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerCrateBlack.FX_COLOR_A, PlayerCrateBlack.FX_COLOR_B], attachment: false, delay: 0}//,
      //{class: SpatialSoundInstance, params: ["<sound *>", "multi/hit/slash0.wav", 0.5, 0.0, "effect"], attachment: false, delay: 0}
    ]
  ),
  no: new EffectDefinition(
    "Voxel-Black-NoMark", util.vec3.make(0, 0, 0.01), 0, true,
    [
//      {class: SpatialSoundInstance, params: ["<sound *>", "multi/hit/slash0.wav", 0.5, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  location: new EffectDefinition(
    "Voxel-Black-Location", util.vec3.make(0, 0, 0.01), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerCrateBlack.LIGHT_COLOR_A, util.vec4.copy3(PlayerCrateBlack.LIGHT_COLOR_A, 0.5), util.vec4.copy3(PlayerCrateBlack.LIGHT_COLOR_B, 0)], [1.75, 2.5], 15, "fast"], attachment: false, delay: 0},
      {class: ParticleMark, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerCrateBlack.FX_COLOR_A, PlayerCrateBlack.FX_COLOR_B], attachment: false, delay: 0}
    ]
  ),
  charge: new EffectDefinition(
    "Voxel-Black-Charge", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerCrateBlack.LIGHT_COLOR_A, 0.15), util.vec4.copy3(PlayerCrateBlack.LIGHT_COLOR_B, 1.0)], [1.75, 3.5], 7, "linear"], attachment: true, delay: 0},
      {class: ParticleVoxelCharge, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerCrateBlack.FX_COLOR_A, PlayerCrateBlack.FX_COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/voxel/recall0.wav", 0.7, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  vanish: new EffectDefinition(
    "Voxel-Black-Vanish", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerCrateBlack.LIGHT_COLOR_A, 1.0), util.vec4.copy3(PlayerCrateBlack.LIGHT_COLOR_B, 0)], [2.45, 1.25], 18, "fast"], attachment: false, delay: 0},
      {class: ParticleVoxelVanish, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerCrateBlack.FX_COLOR_A, PlayerCrateBlack.FX_COLOR_B], attachment: false, delay: 0}
    ]
  ),
  recall: new EffectDefinition(
    "Voxel-Black-Recall", util.vec3.make(0, 0, 0.5), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerCrateBlack.LIGHT_COLOR_A, util.vec4.copy3(PlayerCrateBlack.LIGHT_COLOR_A, 0.75), util.vec4.copy3(PlayerCrateBlack.LIGHT_COLOR_B, 0)], [2.75, 4.5], 18, "fast"], attachment: true, delay: 0},
      {class: ParticleVoxelRecall, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerCrateBlack.FX_COLOR_A, PlayerCrateBlack.FX_COLOR_B], attachment: false, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/voxel/recall1.wav", 0.6, 0.0, "effect"], attachment: false, delay: 0}
    ]
  )
};


NxFx.block.alt = {};

NxFx.block.alt.voice = {
  rest: new EffectDefinition(
    "Block-Voice-Rest", util.vec3.make(0.0, 0.0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerBlock.REST_LIGHT, util.vec4.copy3(PlayerBlock.REST_LIGHT, 0.0)], [1.25, 2.15], 18, "fast"], attachment: true, delay: 0},
      {class: ParticleSleep, params: ["<game *>", "<vec3 pos>", "<vec3 vel>"], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/block/voice/rest0.wav", 0.5, 0.0, "voice"], attachment: true, delay: 0}
    ]
  ),
  wake: new EffectDefinition(
    "Block-Voice-Wake", util.vec3.make(0.0, 0.0, 0.25), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", "character/block/voice/rest1.wav", 0.5, 0.0, "voice"], attachment: true, delay: 0}
    ]
  ),
  pound: new EffectDefinition(
    "Block-Voice-Pound", util.vec3.make(0.0, 0.0, 0.25), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", ["character/block/voice/attack0.wav", "character/block/voice/attack1.wav"], 0.5, 0.0, "voice"], attachment: true, delay: 0}
    ]
  ),
  jump: new EffectDefinition(
    "Block-Voice-Jump", util.vec3.make(0.0, 0.0, 0.25), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", ["character/block/voice/jump0.wav", "character/block/voice/jump1.wav", "character/block/voice/jump2.wav"], 0.5, 0.0, "voice"], attachment: true, delay: 0}
    ]
  ),
  hit: new EffectDefinition(
    "Block-Voice-Hit", util.vec3.make(0.0, 0.0, 0.25), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", "character/block/voice/hit0.wav", 0.5, 0.0, "voice"], attachment: true, delay: 0}
    ]
  ),
  explode: new EffectDefinition(
    "Block-Voice-Explode", util.vec3.make(0.0, 0.0, 0.25), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", "character/block/voice/impact0.wav", 0.5, 0.0, "voice"], attachment: true, delay: 0}
    ]
  ),
  fall: new EffectDefinition(
    "Block-Voice-Fall", util.vec3.make(0.0, 0.0, 0.25), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", "character/block/voice/fall0.wav", 0.5, 0.0, "voice"], attachment: true, delay: 0}
    ]
  ),
  taunt: new EffectDefinition(
    "Block-Voice-Taunt", util.vec3.make(0.0, 0.0, 0.25), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", ["character/block/voice/taunt0.wav", "character/block/voice/taunt1.wav", "character/block/voice/taunt2.wav"], 0.5, 0.0, "voice"], attachment: true, delay: 0}
    ]
  )
};

/* global PlayerBlockGold */
NxFx.block.alt.gold = {
  rest: new EffectDefinition(
    "Block-Gold-Rest", util.vec3.make(0.1, -0.2, 0.55), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerBlock.REST_LIGHT, util.vec4.copy3(PlayerBlock.REST_LIGHT, 0.0)], [1.25, 2.15], 18, "fast"], attachment: true, delay: 0},
      {class: ParticleSleep, params: ["<game *>", "<vec3 pos>", "<vec3 vel>"], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/block/rest0.wav", 0.8, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  wake: new EffectDefinition(
    "Block-Gold-Wake", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", "character/block/rest1.wav", 0.85, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  charge: new EffectDefinition(
    "Block-Gold-Charge", util.vec3.make(0, 0, 0), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerBlock.REST_LIGHT, 0.0), PlayerBlock.REST_LIGHT], [2.65, 1.55], 9, "slow"], attachment: true, delay: 0},
      {class: ParticleBlockCharge, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerBlock.COLORA, PlayerBlock.COLORB], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/block/slap0.wav", 0.3, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  dash: new EffectDefinition(
    "Block-Gold-Dash", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerBlock.REST_LIGHT, util.vec4.copy3(PlayerBlock.REST_LIGHT, 0.65), util.vec4.copy3(PlayerBlock.REST_LIGHT, 0.0)], [1.55, 2.35], 9, "fast"], attachment: true, delay: 0},
      {class: ParticleBlockDash, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerBlock.COLORA, PlayerBlock.COLORB], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/block/slap1.wav", 0.35, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  slap: new EffectDefinition(
    "Block-Gold-Slap", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerBlock.REST_LIGHT, 0.7), util.vec4.copy3(PlayerBlock.REST_LIGHT, 0.0)], [1.5, 2.55], 15, "fast"], attachment: true, delay: 0},
      {class: ParticleBlockSlap, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerBlock.COLORA, PlayerBlock.COLORB], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/block/slap2.wav", 1.0, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  wave: new EffectDefinition(
    "Block-Gold-Wave", util.vec3.make(0.0, 0.0, 0.0), 0, true,
    [
        {class: ParticleBlockWave, params: ["<game *>", "<vec3 pos>", "<vec3 vel>"], attachment: true, delay: 0}
    ]
  )
};

/* global PlayerBlockWindow */
NxFx.block.alt.window = {
  rest: new EffectDefinition(
    "Block-Window-Rest", util.vec3.make(0.1, -0.2, 0.55), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerBlock.REST_LIGHT, util.vec4.copy3(PlayerBlock.REST_LIGHT, 0.0)], [1.25, 2.15], 18, "fast"], attachment: true, delay: 0},
      {class: ParticleSleep, params: ["<game *>", "<vec3 pos>", "<vec3 vel>"], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/block/xp2.wav", 0.2, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  wake: new EffectDefinition(
    "Block-Window-Wake", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", "character/block/xp3.wav", 0.25, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  charge: new EffectDefinition(
    "Block-Window-Charge", util.vec3.make(0, 0, 0), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerBlock.REST_LIGHT, 0.0), PlayerBlock.REST_LIGHT], [2.65, 1.55], 9, "slow"], attachment: true, delay: 0},
      {class: ParticleBlockCharge, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerBlock.COLORA, PlayerBlock.COLORB], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/block/slap0.wav", 0.3, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  dash: new EffectDefinition(
    "Block-Window-Dash", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerBlock.REST_LIGHT, util.vec4.copy3(PlayerBlock.REST_LIGHT, 0.65), util.vec4.copy3(PlayerBlock.REST_LIGHT, 0.0)], [1.55, 2.35], 9, "fast"], attachment: true, delay: 0},
      {class: ParticleBlockDash, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerBlock.COLORA, PlayerBlock.COLORB], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/block/xp5.wav", 0.85, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  slap: new EffectDefinition(
    "Block-Window-Slap", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerBlock.REST_LIGHT, 0.7), util.vec4.copy3(PlayerBlock.REST_LIGHT, 0.0)], [1.5, 2.55], 15, "fast"], attachment: true, delay: 0},
      {class: ParticleBlockSlap, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerBlock.COLORA, PlayerBlock.COLORB], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/block/xp1.wav", 0.55, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  wave: new EffectDefinition(
    "Block-Window-Wave", util.vec3.make(0.0, 0.0, 0.0), 0, true,
    [
        {class: ParticleBlockWave, params: ["<game *>", "<vec3 pos>", "<vec3 vel>"], attachment: true, delay: 0}
    ]
  ),
  hit: new EffectDefinition(
    "Block-Window-Hit", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", "character/block/xp0.wav", 0.55, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  die: new EffectDefinition(
    "Block-Window-Die", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", "character/block/xp4.wav", 0.55, 0.0, "effect"], attachment: true, delay: 0}
    ]
  )
};

/* global ParticleBlockSleepRainbow, ParticleBlockChargeRainbow, ParticleBlockDashRainbow, ParticleBlockSlapRainbow, ParticleBlockWaveRainbow */
NxFx.block.alt.rainbow = {
  rest: new EffectDefinition(
    "Block-Rainbow-Rest", util.vec3.make(0.1, -0.2, 0.55), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerBlock.REST_LIGHT, util.vec4.copy3(PlayerBlock.REST_LIGHT, 0.0)], [1.25, 2.15], 18, "fast"], attachment: true, delay: 0},
      {class: ParticleBlockSleepRainbow, params: ["<game *>", "<vec3 pos>", "<vec3 vel>"], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/block/rest0.wav", 0.8, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  wake: new EffectDefinition(
    "Block-Rainbow-Wake", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", "character/block/rest1.wav", 0.85, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  charge: new EffectDefinition(
    "Block-Rainbow-Charge", util.vec3.make(0, 0, 0), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerBlock.REST_LIGHT, 0.0), PlayerBlock.REST_LIGHT], [2.65, 1.55], 9, "slow"], attachment: true, delay: 0},
      {class: ParticleBlockChargeRainbow, params: ["<game *>", "<vec3 pos>", "<vec3 vel>"], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/block/slap0.wav", 0.3, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  dash: new EffectDefinition(
    "Block-Rainbow-Dash", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerBlock.REST_LIGHT, util.vec4.copy3(PlayerBlock.REST_LIGHT, 0.65), util.vec4.copy3(PlayerBlock.REST_LIGHT, 0.0)], [1.55, 2.35], 9, "fast"], attachment: true, delay: 0},
      {class: ParticleBlockDashRainbow, params: ["<game *>", "<vec3 pos>", "<vec3 vel>"], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/block/slap1.wav", 0.35, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  slap: new EffectDefinition(
    "Block-Rainbow-Slap", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerBlock.REST_LIGHT, 0.7), util.vec4.copy3(PlayerBlock.REST_LIGHT, 0.0)], [1.5, 2.55], 15, "fast"], attachment: true, delay: 0},
      {class: ParticleBlockSlapRainbow, params: ["<game *>", "<vec3 pos>", "<vec3 vel>"], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/block/slap2.wav", 1.0, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  wave: new EffectDefinition(
    "Block-Rainbow-Wave", util.vec3.make(0.0, 0.0, 0.0), 0, true,
    [
      {class: ParticleBlockWaveRainbow, params: ["<game *>", "<vec3 pos>", "<vec3 vel>"], attachment: true, delay: 0}
    ]
  )
};

NxFx.cargo.alt = {};

NxFx.cargo.alt.voice = {
  jump: new EffectDefinition(
    "Cargo-Voice-Jump", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", ["character/cargo/voice/jump0.wav", "character/cargo/voice/jump1.wav"], 0.4, 0.0, "voice"], attachment: true, delay: 0}
    ]
  ),
  hit: new EffectDefinition(
    "Cargo-Voice-Hit", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", ["character/cargo/voice/hit0.wav", "character/cargo/voice/hit1.wav"], 0.4, 0.0, "voice"], attachment: true, delay: 0}
    ]
  ),
  charge: new EffectDefinition(
    "Cargo-Voice-Charge", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", "character/cargo/voice/punch0.wav", 0.4, 0.0, "voice"], attachment: true, delay: 0}
    ]
  ),
  punch: new EffectDefinition(
    "Cargo-Voice-Punch", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", "character/cargo/voice/punch1.wav", 0.4, 0.0, "voice"], attachment: true, delay: 0}
    ]
  ),
  taunt: new EffectDefinition(
    "Cargo-Voice-Taunt", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", ["character/cargo/voice/taunt0.wav", "character/cargo/voice/taunt1.wav", "character/cargo/voice/taunt2.wav", "character/cargo/voice/taunt3.wav"], 0.4, 0.0, "voice"], attachment: true, delay: 0}
    ]
  ),
  explode: new EffectDefinition(
    "Cargo-Voice-Explode", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", "character/cargo/voice/death0.wav", 0.4, 0.0, "voice"], attachment: true, delay: 0}
    ]
  ),
  fall: new EffectDefinition(
    "Cargo-Voice-Fall", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", "character/cargo/voice/death1.wav", 0.4, 0.0, "voice"], attachment: true, delay: 0}
    ]
  )
};

/* global PlayerCargoGold */
NxFx.cargo.alt.gold = {
  charge: new EffectDefinition(
    "Cargo-Gold-Charge", util.vec3.make(0, 0, 0.0), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerBoxGold.BLIP_COLOR_A, 0), PlayerBoxGold.BLIP_COLOR_B], [1.25, 2.45], 35, "slow"], attachment: true, delay: 0},
      {class: ParticleCargoCharge, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerBoxGold.BLIP_COLOR_A, PlayerBoxGold.BLIP_COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/cargo/punch0.wav", 0.6, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  punch: new EffectDefinition(
    "Cargo-Gold-Punch", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerBoxGold.BLIP_COLOR_B, util.vec4.copy3(PlayerBoxGold.BLIP_COLOR_A, 0)], [2.6, 3.45], 25, "slow"], attachment: true, delay: 0},
      {class: ParticleCargoPunch, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerBoxGold.BLIP_COLOR_A, PlayerBoxGold.BLIP_COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/cargo/punch1.wav", 0.75, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  kick: new EffectDefinition(
    "Cargo-Gold-Kick", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerBoxGold.BLIP_COLOR_B, util.vec4.copy3(PlayerBoxGold.BLIP_COLOR_A, 0)], [2.6, 3.45], 25, "slow"], attachment: true, delay: 0},
      {class: ParticleCargoKick, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerBoxGold.BLIP_COLOR_A, PlayerBoxGold.BLIP_COLOR_B], attachment: true, delay: 0},
      {class: ParticleBurn, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerBoxGold.BLIP_COLOR_A, PlayerBoxGold.BLIP_COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/cargo/kick0.wav", 0.8, 0.0, "effect"], attachment: true, delay: 0}
    ]
  )
};

/* global PlayerCargoDelta */
NxFx.cargo.alt.delta = {
  charge: new EffectDefinition(
    "Cargo-Delta-Charge", util.vec3.make(0, 0, 0.0), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerBoxDelta.COLOR_A, 0), PlayerBoxDelta.COLOR_B], [1.25, 2.45], 35, "slow"], attachment: true, delay: 0},
      {class: ParticleCargoCharge, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerBoxDelta.COLOR_A, PlayerBoxDelta.COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/cargo/punch0.wav", 0.6, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  punch: new EffectDefinition(
    "Cargo-Delta-Punch", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerBoxDelta.COLOR_B, util.vec4.copy3(PlayerBoxDelta.COLOR_A, 0)], [2.6, 3.45], 25, "slow"], attachment: true, delay: 0},
      {class: ParticleCargoPunch, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerBoxDelta.COLOR_A, PlayerBoxDelta.COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/cargo/punch1.wav", 0.75, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  kick: new EffectDefinition(
    "Cargo-Delta-Kick", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerBoxDelta.COLOR_B, util.vec4.copy3(PlayerBoxDelta.COLOR_A, 0)], [2.6, 3.45], 25, "slow"], attachment: true, delay: 0},
      {class: ParticleCargoKick, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerBoxDelta.COLOR_A, PlayerBoxDelta.COLOR_B], attachment: true, delay: 0},
      {class: ParticleBurn, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerBoxDelta.COLOR_A, PlayerBoxDelta.COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/cargo/kick0.wav", 0.8, 0.0, "effect"], attachment: true, delay: 0}
    ]
  )
};

/* global ParticleCargoChargeRainbow, ParticleCargoPunchRainbow, ParticleCargoKickRainbow, ParticleBurnRainbow */
NxFx.cargo.alt.rainbow = {
  charge: new EffectDefinition(
    "Cargo-Rainbow-Charge", util.vec3.make(0, 0, 0.0), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerBoxRainbow.LIGHT_COLOR_B, 0), PlayerBoxRainbow.LIGHT_COLOR_A], [1.25, 2.45], 35, "slow"], attachment: true, delay: 0},
      {class: ParticleCargoChargeRainbow, params: ["<game *>", "<vec3 pos>", "<vec3 vel>"], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/cargo/punch0.wav", 0.6, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  punch: new EffectDefinition(
    "Cargo-Rainbow-Punch", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerBoxRainbow.LIGHT_COLOR_A, util.vec4.copy3(PlayerBoxRainbow.LIGHT_COLOR_B, 0)], [2.6, 3.45], 25, "slow"], attachment: true, delay: 0},
      {class: ParticleCargoPunchRainbow, params: ["<game *>", "<vec3 pos>", "<vec3 vel>"], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/cargo/punch1.wav", 0.75, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  kick: new EffectDefinition(
    "Cargo-Rainbow-Kick", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [PlayerBoxRainbow.LIGHT_COLOR_A, util.vec4.copy3(PlayerBoxRainbow.LIGHT_COLOR_B, 0)], [2.6, 3.45], 25, "slow"], attachment: true, delay: 0},
      {class: ParticleCargoKickRainbow, params: ["<game *>", "<vec3 pos>", "<vec3 vel>"], attachment: true, delay: 0},
      {class: ParticleBurnRainbow, params: ["<game *>", "<vec3 pos>", "<vec3 vel>"], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/cargo/kick0.wav", 0.8, 0.0, "effect"], attachment: true, delay: 0}
    ]
  )
};

NxFx.quad.alt = {};

NxFx.quad.alt.voice = {
  jump: new EffectDefinition(
    "Quad-Voice-Jump", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", ["character/quad/voice/jump0.wav", "character/quad/voice/jump1.wav", "character/quad/voice/jump2.wav"], 0.5, 0.0, "voice"], attachment: true, delay: 0}
    ]
  ),
  hit: new EffectDefinition(
    "Quad-Voice-Hit", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", ["character/quad/voice/hit0.wav", "character/quad/voice/hit1.wav", "character/quad/voice/hit2.wav"], 0.5, 0.0, "voice"], attachment: true, delay: 0}
    ]
  ),
  heavy: new EffectDefinition(
    "Quad-Voice-heavy", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", ["character/quad/voice/heavy0.wav", "character/quad/voice/heavy1.wav", "character/quad/voice/heavy2.wav"], 0.5, 0.0, "voice"], attachment: true, delay: 0}
    ]
  ),
  counter: new EffectDefinition(
    "Quad-Voice-Counter", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", "character/quad/voice/counter0.wav", 0.5, 0.0, "voice"], attachment: true, delay: 0}
    ]
  ),
  riposte: new EffectDefinition(
    "Quad-Voice-Riposte", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", ["character/quad/voice/riposte0.wav", "character/quad/voice/riposte1.wav", "character/quad/voice/riposte2.wav"], 0.5, 0.0, "voice"], attachment: true, delay: 0}
    ]
  ),
  taunt: new EffectDefinition(
    "Quad-Voice-Taunt", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", ["character/quad/voice/taunt0.wav", "character/quad/voice/taunt1.wav"], 0.5, 0.0, "voice"], attachment: true, delay: 0}
    ]
  ),
  explode: new EffectDefinition(
    "Quad-Voice-Explode", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", ["character/quad/voice/impact0.wav", "character/quad/voice/impact1.wav", "character/quad/voice/impact2.wav"], 0.5, 0.0, "voice"], attachment: true, delay: 0}
    ]
  ),
  fall: new EffectDefinition(
    "Quad-Voice-Fall", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", "character/quad/voice/fall0.wav", 0.5, 0.0, "voice"], attachment: true, delay: 0}
    ]
  )
};

/* global PlayerQuadRainbow */
/* global ParticleQuadSlashRainbow, ParticleQuadReadyRainbow, ParticleQuadRiposteRainbow */
NxFx.quad.alt.rainbow = {
  light: new EffectDefinition(
    "Quad-Rainbow-Light", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: ParticleQuadSlashRainbow, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerQuad.COLOR_A, PlayerQuad.COLOR_A], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", ["character/quad/light0.wav", "character/quad/light1.wav", "character/quad/light2.wav"], 0.5, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  combo: new EffectDefinition(
    "Quad-Rainbow-Combo", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerQuad.COLOR_A, 0.55), util.vec4.copy3(PlayerQuad.COLOR_A, 0.0)], [1.25, 2.15], 18, "fast"], attachment: true, delay: 0},
      {class: ParticleQuadReadyRainbow, params: ["<game *>", "<vec3 pos>", "<vec3 vel>"], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/quad/combo0.wav", 0.6, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  heavy: new EffectDefinition(
    "Quad-Rainbow-Heavy", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerQuad.COLOR_A, 0.75), util.vec4.copy3(PlayerQuad.COLOR_A, 0.0)], [1.25, 2.25], 18, "fast"], attachment: true, delay: 0},
      {class: ParticleQuadRiposteRainbow, params: ["<game *>", "<vec3 pos>", "<vec3 vel>"], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", ["character/quad/heavy0.wav", "character/quad/heavy1.wav"], 0.7, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  counter: new EffectDefinition(
    "Quad-Rainbow-Counter", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", "character/quad/counter0.wav", 0.6, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  riposte: new EffectDefinition(
    "Quad-Rainbow-Riposte", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerQuad.COLOR_A, 0.9), util.vec4.copy3(PlayerQuad.COLOR_A, 0.0)], [1.35, 2.85], 25, "fast"], attachment: true, delay: 0},
      {class: ParticleQuadRiposteRainbow, params: ["<game *>", "<vec3 pos>", "<vec3 vel>"], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/quad/counter1.wav", 0.7, 0.0, "effect"], attachment: true, delay: 0}
    ]
  )
};

/* global PlayerQuadGold */
NxFx.quad.alt.gold = {
  light: new EffectDefinition(
    "Quad-Gold-Light", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: ParticleSlash, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerBoxGold.BLIP_COLOR_A, PlayerBoxGold.BLIP_COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", ["character/quad/light0.wav", "character/quad/light1.wav", "character/quad/light2.wav"], 0.5, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  combo: new EffectDefinition(
    "Quad-Gold-Combo", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerBoxGold.BLIP_COLOR_A, 0.55), util.vec4.copy3(PlayerBoxGold.BLIP_COLOR_B, 0.0)], [1.25, 2.15], 18, "fast"], attachment: true, delay: 0},
      {class: ParticleReady, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerQuad.COLOR_A, PlayerQuad.COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/quad/combo0.wav", 0.6, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  heavy: new EffectDefinition(
    "Quad-Gold-Heavy", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerBoxGold.BLIP_COLOR_A, 0.75), util.vec4.copy3(PlayerBoxGold.BLIP_COLOR_B, 0.0)], [1.25, 2.25], 18, "fast"], attachment: true, delay: 0},
      {class: ParticleRiposte, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerBoxGold.BLIP_COLOR_A, PlayerBoxGold.BLIP_COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", ["character/quad/heavy0.wav", "character/quad/heavy1.wav"], 0.7, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  counter: new EffectDefinition(
    "Quad-Gold-Counter", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", "character/quad/counter0.wav", 0.6, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  riposte: new EffectDefinition(
    "Quad-Gold-Riposte", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerBoxGold.BLIP_COLOR_A, 0.9), util.vec4.copy3(PlayerBoxGold.BLIP_COLOR_B, 0.0)], [1.35, 2.85], 25, "fast"], attachment: true, delay: 0},
      {class: ParticleRiposte, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerBoxGold.BLIP_COLOR_A, PlayerBoxGold.BLIP_COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/quad/counter1.wav", 0.7, 0.0, "effect"], attachment: true, delay: 0}
    ]
  )
};
/* global PlayerQuadDelta */
NxFx.quad.alt.delta = {
  light: new EffectDefinition(
    "Quad-Delta-Light", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: ParticleSlash, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerBoxDelta.COLOR_A, PlayerBoxDelta.COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", ["character/quad/light0.wav", "character/quad/light1.wav", "character/quad/light2.wav"], 0.5, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  combo: new EffectDefinition(
    "Quad-Delta-Combo", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerBoxDelta.COLOR_A, 0.55), util.vec4.copy3(PlayerBoxDelta.COLOR_B, 0.0)], [1.25, 2.15], 18, "fast"], attachment: true, delay: 0},
      {class: ParticleReady, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerBoxDelta.COLOR_A, PlayerBoxDelta.COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/quad/combo0.wav", 0.6, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  heavy: new EffectDefinition(
    "Quad-Delta-Heavy", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerBoxDelta.COLOR_A, 0.75), util.vec4.copy3(PlayerBoxDelta.COLOR_B, 0.0)], [1.25, 2.25], 18, "fast"], attachment: true, delay: 0},
      {class: ParticleRiposte, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerBoxDelta.COLOR_A, PlayerBoxDelta.COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", ["character/quad/heavy0.wav", "character/quad/heavy1.wav"], 0.7, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  counter: new EffectDefinition(
    "Quad-Delta-Counter", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", "character/quad/counter0.wav", 0.6, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  riposte: new EffectDefinition(
    "Quad-Delta-Riposte", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerBoxDelta.COLOR_A, 0.9), util.vec4.copy3(PlayerBoxDelta.COLOR_B, 0.0)], [1.35, 2.85], 25, "fast"], attachment: true, delay: 0},
      {class: ParticleRiposte, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerBoxDelta.COLOR_A, PlayerBoxDelta.COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/quad/counter1.wav", 0.7, 0.0, "effect"], attachment: true, delay: 0}
    ]
  )
};

/* global PlayerQuadFire */
NxFx.quad.alt.fire = {
  light: new EffectDefinition(
    "Quad-Fire-Light", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: ParticleSlash, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerQuadFire.COLOR_A, PlayerQuadFire.COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", ["character/quad/light0.wav", "character/quad/light1.wav", "character/quad/light2.wav"], 0.5, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  combo: new EffectDefinition(
    "Quad-Fire-Combo", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerQuadFire.COLOR_A, 0.55), util.vec4.copy3(PlayerQuadFire.COLOR_B, 0.0)], [1.25, 2.15], 18, "fast"], attachment: true, delay: 0},
      {class: ParticleReady, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerQuadFire.COLOR_A, PlayerQuadFire.COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/quad/combo0.wav", 0.6, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  heavy: new EffectDefinition(
    "Quad-Fire-Heavy", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerQuadFire.COLOR_A, 0.75), util.vec4.copy3(PlayerQuadFire.COLOR_B, 0.0)], [1.25, 2.25], 18, "fast"], attachment: true, delay: 0},
      {class: ParticleRiposte, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerQuadFire.COLOR_A, PlayerQuadFire.COLOR_B], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", ["character/quad/heavy0.wav", "character/quad/heavy1.wav"], 0.7, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  counter: new EffectDefinition(
    "Quad-Fire-Counter", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: SpatialSoundInstance, params: ["<sound *>", "character/quad/counter0.wav", 0.6, 0.0, "effect"], attachment: true, delay: 0}
    ]
  ),
  riposte: new EffectDefinition(
    "Quad-Fire-Riposte", util.vec3.make(0, 0, 0.25), 0, true,
    [
      {class: PointLightInterp, params: ["<vec3 pos>", [util.vec4.copy3(PlayerQuadFire.COLOR_A, 0.9), util.vec4.copy3(PlayerQuadFire.COLOR_B, 0.0)], [1.35, 2.85], 25, "fast"], attachment: true, delay: 0},
      {class: ParticleRiposte, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerQuadFire.COLOR_A, PlayerQuadFire.COLOR_B], attachment: true, delay: 0},
      /* {class: ParticleCargoPunch, params: ["<game *>", "<vec3 pos>", "<vec3 vel>", PlayerCrate.FIRE_COLOR_A, PlayerCrate.FIRE_COLOR_C], attachment: true, delay: 0}, */
      {class: SpatialSoundInstance, params: ["<sound *>", "character/cargo/punch1.wav", 0.45, 0.0, "effect"], attachment: true, delay: 0},
      {class: SpatialSoundInstance, params: ["<sound *>", "character/quad/counter1.wav", 0.65, 0.0, "effect"], attachment: true, delay: 0}
    ]
  )
};