// priority: 1

// Visit the wiki for more info - https://kubejs.com/

const CONST_BLOOD_MOON_HAND_DROP_CHANCE_RATE = 1.25;
const CONST_BLOOD_MOON_ARMOR_DROP_CHANCE_RATE = 1.25;
const CONST_BLOOD_MOON_GENERIC_DROP_CHANCE_RATE = 2.0;

const CONST_HARVEST_MOON_NON_MONSTER_DROP_CHANCE_RATE = 2.0;

/**
 * InControl! で賄えない調整はここで行う.
 * - EnhancedCelestials のイベント時におけるエンティティのドロップ率上昇処理（InControl!では倍率で設定できないため）
 */
EntityEvents.death(event => {
  const { level, entity, source } = event;

  // console.log({
  //   event: 'EntityEvents.death',
  //   type: entity.type,
  //   source: source.actual?.name,
  //   nbt: entity.nbt
  // })

  /**
   * @type {(import("../event/enhanced-celestials").EnhancedCelestialsContext) | undefined}
   */
  let enhancedCelestialsData = level.persistentData.enhancedCelestials;
  if (enhancedCelestialsData && enhancedCelestialsData.isLunarEventActive) {
    let moonType = enhancedCelestialsData.moonType;
    switch (moonType) {
      case 'blood_moon': {
        if (!source.actual || !source.actual.isPlayer()) {
          // プレイヤー以外がキルした場合はドロップ率を変更しない
          return;
        }

        if (!entity.isMonster()) {
          // モンスター以外はドロップ率を変更しない
          return;
        }

        let nbt = entity.nbt;
        let updateNbt = {};
        let isModified = false;

        // メインハンド・オフハンドのドロップ率 (HandDropChances)
        if (nbt.HandDropChances) {
          updateNbt.HandDropChances = nbt.HandDropChances.map(chance => NBT.f(chance.getAsFloat() * CONST_BLOOD_MOON_HAND_DROP_CHANCE_RATE))
          isModified = true
        }

        // 装備4部位のドロップ率 (ArmorDropChances)
        if (nbt.ArmorDropChances) {
          updateNbt.ArmorDropChances = nbt.ArmorDropChances.map(chance => NBT.f(chance.getAsFloat() * CONST_BLOOD_MOON_ARMOR_DROP_CHANCE_RATE))
          isModified = true
        }

        if (isModified) {
          entity.mergeNbt(updateNbt)
        }
        break;
      }
      default:
        return;
    }
  }
});

// LootJS.modifiers((event) => {
//   event.addLootTableModifier(LootType.ENTITY)
//     .hasAnyStage("bloodmoon")
//     .matchEntity(entity => entity.isMonster())
//     .modifyLoot(Ingredient.all, stack => {
//       stack.count *= CONST_BLOOD_MOON_GENERIC_DROP_CHANCE_RATE;
//       return stack;
//     });

//   event.addLootTableModifier(LootType.ENTITY)
//     .hasAnyStage("harvestmoon")
//     .matchEntity(entity => !entity.isMonster())
//     .modifyLoot(Ingredient.all, stack => {
//       stack.count *= CONST_HARVEST_MOON_NON_MONSTER_DROP_CHANCE_RATE;
//       return stack;
//     });
// });
