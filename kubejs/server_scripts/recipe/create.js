// priority: 0

ServerEvents.recipes(event => {
  // レシピが被るので再定義
  event.remove({
    id: 'create:crafting/materials/sand_paper'
  });
  event.recipes.minecraft.crafting_shaped(
    Item.of("create:sand_paper", 2),
    [
      'PS',
      'SP'
    ],
    {
      P: 'minecraft:paper',
      S: 'minecraft:sand'
    }
  );
})
