// priority: 1

// Visit the wiki for more info - https://kubejs.com/

const CONST_SAFETY_MOON_SPAWN_THRESHOLD = 0.75;

/**
 * @param {Internal.EntitySpawnedEventJS_} entity
 * @param {number} threshold 
 */
function debounceMonsterSpawn(entity, threshold) {
  if (Math.random() < threshold) {
    entity.cancel();
  }
}

/**
 * モブの湧き潰し設定 (BloodMoon以外のイベント時)
 * - サーバサイドかつ夜間に敵対的モブ（モンスター）がスポーンする際に判定
 * - EnhancedCelestialsのイベントデータを取得し、ブラッドムーン以外のイベント（Blue Moon, Harvest Moon等）の場合はスポーンを抑制する
 */
EntityEvents.spawned(event => {
  const { level, entity } = event;

  /**
   * @type {(import("../event/enhanced-celestials").EnhancedCelestialsContext) | undefined}
   */
  const enhancedCelestialsData = level.persistentData.enhancedCelestials;
  if (!enhancedCelestialsData || !enhancedCelestialsData.isLunarEventActive) {
    return;
  }

  switch (enhancedCelestialsData.moonType) {
    case "blue_moon":
    case "harvest_moon": {
      debounceMonsterSpawn(entity, CONST_SAFETY_MOON_SPAWN_THRESHOLD);
    }
  }
});
