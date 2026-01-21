// priority: 0

// Visit the wiki for more info - https://kubejs.com/

ServerEvents.recipes(event => {
  event.remove({
    output: "farmersdelight:organic_compost",
  })

  event.recipes.create.mixing(
    "farmersdelight:organic_compost",
    [
      Item.of("minecraft:rotten_flesh", 2),
      Item.of("minecraft:bone_meal", 4),
      Item.of("farmersdelight:straw", 2),
      Item.of("minecraft:dirt", 1),
    ]
  );
})