const TARGET_BLOCKS = [
  "easy_villagers:trader",
  "easy_villagers:auto_trader",
  "easy_villagers:farmer",
  "easy_villagers:breeder",
  "easy_villagers:converter",
  "easy_villagers:iron_farm",
  "easy_villagers:incubator"
];

/**
 * @param {Internal.Level} level
 * @param {BlockPos} pos
 * @returns {string}
 */
function keyOf(level, pos) {
  return `${level.dimension}:${pos.x},${pos.y},${pos.z}`
}

/**
 * @param {Server} server
 * @returns {import("./easy-villagers").EasyVillagersContext}
 */
function getStore(server) {
  let data = server.persistentData;

  /** @type {import("./easy-villagers").EasyVillagersContext | undefined} */
  let ctx = data.easyVillagers;
  if (!data.easyVillagers) {
    data.easyVillagers = {};
    ctx = data.easyVillagers;
  }

  if (!ctx.placedBlocks) {
    ctx.placedBlocks = {};
  }

  if (!ctx.droppedItemsQueue) {
    ctx.droppedItemsQueue = [];
  }

  return ctx;
}

BlockEvents.placed(event => {
  const { level, player, block } = event;

  if (!TARGET_BLOCKS.includes(block.id)) {
    return;
  }

  // Easy Villagersのブロック設置を記録する
  const data = getStore(level.server).placedBlocks;
  data[keyOf(level, event.block.pos)] = {
    owner: player.uuid,
    blockId: block.id,
    placedAt: Date.now(),
    position: {
      dimension: level.dimension.toString(),
      x: event.block.pos.x,
      y: event.block.pos.y,
      z: event.block.pos.z
    }
  };
});


BlockEvents.broken(event => {
  const { level, block } = event;

  if (!TARGET_BLOCKS.includes(block.id)) {
    return;
  }

  // Easy Villagersのブロック破壊を記録から削除する
  const data = getStore(level.server).placedBlocks;
  delete data[keyOf(level, event.block.pos)];
});

LevelEvents.tick(event => {
  // 1秒に1回実行
  let level = event.level
  if (level.isClientSide() || event.level.time % 20 !== 0) {
    return;
  }

  forceExplodeCreeperIfNeeds(level, getStore(level.server));
})

/**
 * クリーパーがEasy Villagersのブロックを設置した範囲内で爆発するように強制する
 *
 * @param {Internal.Level} level
 * @param {import("./easy-villagers").EasyVillagersContext} ctx
 */
function forceExplodeCreeperIfNeeds(level, ctx) {
  // 着火範囲半径
  let R = 2;
  let store = ctx.placedBlocks;

  for (let k of Object.keys(store).filter(k => store[k].position.dimension === level.dimension.toString())) {
    let blockInfo = store[k];
    let { x, y, z } = blockInfo.position;

    let box = AABB.of(
      x - R, y - R, z - R,
      x + R + 1, y + R + 1, z + R + 1
    )

    let creepers = level.getEntitiesWithin(box).filter(e => e.type == "minecraft:creeper")
    creepers.forEach(c => {
      // 二重着火防止
      if (c.persistentData.__triggered) return
      c.persistentData.__triggered = true
      c.persistentData.__easyVillagersIgnite = true

      c.mergeNbt({ ignited: 1 })
    })
  }
}

LevelEvents.beforeExplosion(event => {
  const exploder = event.exploder;
  if (!exploder) return
  if (exploder.type != 'minecraft:creeper') return
  if (!exploder.persistentData.__easyVillagersIgnite) return

  const ctx = getStore(event.level.server)
  const R = 3;
  const level = event.level;
  const pos = {
    x: event.x,
    y: event.y,
    z: event.z
  }

  let box = AABB.of(
    pos.x - R, pos.y - R, pos.z - R,
    pos.x + R + 1, pos.y + R + 1, pos.z + R + 1
  )

  /** @type {Internal.Entity[]} */
  let delayedDrops = []
  for (let k of Object.keys(ctx.placedBlocks).filter(k => ctx.placedBlocks[k].position.dimension === level.dimension.toString())) {
    let blockInfo = ctx.placedBlocks[k];
    let bpos = blockInfo.position;
    if (box.contains(bpos.x, bpos.y, bpos.z)) {
      level.destroyBlock([bpos.x, bpos.y, bpos.z], false);

      // 範囲内にあるので爆発でドロップ化する.
      let block = level.getBlock([bpos.x, bpos.y, bpos.z]);
      let item = Item.of(block.id, 1, {
        BlockEntityTag: block.entity.getUpdateTag()
      });

      let drop = level.createEntity("minecraft:item");
      drop.x = bpos.x + 0.5;
      drop.y = bpos.y + 0.5;
      drop.z = bpos.z + 0.5;
      drop.item = item;

      delayedDrops.push(drop);

      // 記録から削除
      delete ctx.placedBlocks[k];
    }
  }

  // destroyBlockに巻き込まれてドロップしたアイテムが消えてしまうので1tick遅延させてドロップ化する
  event.server.scheduleInTicks(1, () => {
    delayedDrops.forEach(d => d.spawn());
  });
});
