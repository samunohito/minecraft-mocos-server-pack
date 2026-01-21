// priority: 0

// Visit the wiki for more info - https://kubejs.com/

ServerEvents.recipes(event => {
  event.remove({
    output: "refinedstorage:quartz_enriched_iron",
  })

  event.recipes.minecraft.crafting_shapeless(
    Item.of("refinedstorage:quartz_enriched_iron", 9),
    "refinedstorage:quartz_enriched_iron_block"
  );

  event.recipes.create.mixing(
    Item.of("refinedstorage:quartz_enriched_iron", 4),
    [
      Item.of("minecraft:iron_ingot", 3),
      Item.of("minecraft:quartz", 1),
    ]
  ).heated();
})