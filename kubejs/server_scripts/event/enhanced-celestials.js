// priority: 0

// Visit the wiki for more info - https://kubejs.com/

const $EnhancedCelestials = Java.loadClass('dev.corgitaco.enhancedcelestials.EnhancedCelestials');
const $ResourceKey = Java.loadClass('net.minecraft.resources.ResourceKey');
const $ResourceLocation = Java.loadClass('net.minecraft.resources.ResourceLocation');
const $EnhancedCelestialsRegistry = Java.loadClass('dev.corgitaco.enhancedcelestials.api.EnhancedCelestialsRegistry');

/** @return {(import("./enhanced-celestials.js").EnhancedCelestialsEventId|null)} */
function getLunarEventId(level) {
  let lunarData = $EnhancedCelestials.lunarForecastWorldData(level);
  if (lunarData.isPresent()) {
    let eventKey = lunarData.get().currentLunarEvent().getTextComponents().name().getKey();
    return eventKey;
  }

  return null;
}

/** 
 * @param {import("./enhanced-celestials.js").EnhancedCelestialsEventId} eventId 
 * @return {(import("./enhanced-celestials.js").MoonType|null)} 
 */
function extractMoonType(eventId) {
  switch (eventId) {
    case "enhancedcelestials.name.blood_moon":
    case "enhancedcelestials.name.super_blood_moon":
      return "blood_moon";
    case "enhancedcelestials.name.blue_moon":
    case "enhancedcelestials.name.super_blue_moon":
      return "blue_moon";
    case "enhancedcelestials.name.harvest_moon":
    case "enhancedcelestials.name.super_harvest_moon":
      return "harvest_moon";
    default:
      return null;
  }
}

/** 
 * @param {import("./enhanced-celestials.js").EnhancedCelestialsEventId} eventId 
 * @return {boolean}
 */
function isSuperMoon(eventId) {
  return eventId.includes("super_");
}

// デバッグ用
BlockEvents.rightClicked((event) => {
  const { item, level, block } = event
  if (block.id != "minecraft:oak_log" || level.isClientSide()) {
    return
  }

  if (!["minecraft:bowl", "minecraft:torch"].includes(item.id)) {
    return;
  }

  const lunarForecastData = $EnhancedCelestials.lunarForecastWorldData(level);
  if (!lunarForecastData.isPresent()) {
    console.log("No lunar forecast data available.");
    return;
  }

  if (!level.isRaining() && !level.isDay()) {
    const registry = level.registryAccess().registry($EnhancedCelestialsRegistry.LUNAR_EVENT_KEY).orElseThrow();

    const moonType = item.id == "minecraft:bowl" ? "blue_moon" : "blood_moon";
    const lunarEventKey = $ResourceKey.create(
      $EnhancedCelestialsRegistry.LUNAR_EVENT_KEY,
      new $ResourceLocation(`enhancedcelestials:${moonType}`)
    );

    if (registry.containsKey(lunarEventKey.location()) && registry.getHolderOrThrow(lunarEventKey).isBound()) {
      const data = lunarForecastData.get();
      data.setLunarEvent(lunarEventKey);
    }
  }

  event.cancel()
});


/**
 * EnhancedCelestialsからイベントデータを取得し、KubeJSの世界から参照しやすくする.
 * また、プレイヤーに対して特殊な月のステージを付与・削除する.
 * - サーバサイドで1秒ごとに判定
 * - EnhancedCelestialsのイベントデータを取得し、特殊な月がアクティブな場合はプレイヤーにステージを付与、非アクティブの場合は削除する
 */
LevelEvents.tick(event => {
  // パフォーマンスのため 20ティック(1秒)ごとに判定
  if (event.level.time % 20 != 0 || event.level.isClientSide()) {
    return;
  }

  let eventId = getLunarEventId(event.level);
  if (eventId == null) {
    return;
  }

  let isNight = !event.level.isDay();
  let moonType = extractMoonType(eventId);

  let isBloodMoonActive = (moonType === "blood_moon" && isNight);
  let isBlueMoonActive = (moonType === "blue_moon" && isNight);
  let isHarvestMoonActive = (moonType === "harvest_moon" && isNight);
  let isLunarEventActive = isBloodMoonActive || isBlueMoonActive || isHarvestMoonActive;

  let prev = event.level.persistentData.enhancedCelestials || {
    isLunarEventActive: false,
    moonType: null,
    eventId: null,
  };

  if (
    // serializeの過程でbooleanが0/1に変換されるらしい
    Boolean(prev.isLunarEventActive) === isLunarEventActive &&
    prev.eventId === eventId
  ) {
    // No change in state
    return;
  }

  let superMoon = isSuperMoon(eventId);
  console.log(`Lunar event state changed: MoonType=${moonType}, isSuperMoon=${superMoon}`);

  event.level.persistentData.enhancedCelestials = {
    isLunarEventActive: isLunarEventActive,
    moonType: moonType,
    isSuperMoon: superMoon,
    eventId: eventId,
  };

  event.server.players.forEach(player => {
    let hasBloodMoon = player.stages.has("bloodmoon");
    if (isBloodMoonActive) {
      if (!hasBloodMoon) {
        player.stages.add("bloodmoon");
        console.log(`Blood Moon effect applied to player: ${player.name}`);
      }
    } else {
      if (hasBloodMoon) {
        player.stages.remove("bloodmoon");
        console.log(`Blood Moon effect removed from player: ${player.name}`);
      }
    }

    let hasBlueMoon = player.stages.has("bluemoon");
    if (isBlueMoonActive) {
      if (!hasBlueMoon) {
        player.stages.add("bluemoon");
        console.log(`Blue Moon effect applied to player: ${player.name}`);
      }
    } else {
      if (hasBlueMoon) {
        player.stages.remove("bluemoon");
        console.log(`Blue Moon effect removed from player: ${player.name}`);
      }
    }

    let hasHarvestMoon = player.stages.has("harvestmoon");
    if (isHarvestMoonActive) {
      if (!hasHarvestMoon) {
        player.stages.add("harvestmoon");
        console.log(`Harvest Moon effect applied to player: ${player.name}`);
      }
    } else {
      if (hasHarvestMoon) {
        player.stages.remove("harvestmoon");
        console.log(`Harvest Moon effect removed from player: ${player.name}`);
      }
    }
  });
});