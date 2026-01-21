// priority: 0

// Visit the wiki for more info - https://kubejs.com/

ServerEvents.recipes(event => {
  event.remove({
    output: "waystones:warp_stone",
  })

  event.recipes.minecraft.crafting_shaped('waystones:warp_stone', [
    'APA',
    'PDP',
    'APA'
  ], {
    A: "minecraft:amethyst_shard",
    D: 'minecraft:diamond',
    P: 'minecraft:ender_pearl',
  })
})