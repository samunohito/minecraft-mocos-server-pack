// priority: 0

ServerEvents.recipes(event => {
  // エンチャント装置を自動定型クラフトに縛る+難易度上げ
  event.remove({
    output: [
      "ars_nouveau:enchanting_apparatus"
    ]
  })
  event.recipes.create.mechanical_crafting(
    "ars_nouveau:enchanting_apparatus",
    [
      'NSN',
      'IDI',
      'NSN',
    ],
    {
      N: "minecraft:gold_nugget",
      S: "ars_nouveau:sourcestone",
      I: "minecraft:gold_ingot",
      D: "minecraft:diamond",
    }
  );

  // アークウッド木材でのチェスト作成
  event.recipes.minecraft.crafting_shaped(
    Item.of("minecraft:chest", 1),
    [
      'WWW',
      'W W',
      'WWW'
    ],
    {
      W: "ars_nouveau:archwood_planks",
    }
  );
})
