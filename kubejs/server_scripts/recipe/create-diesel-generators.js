// priority: 0

ServerEvents.recipes(event => {
  // バイオ燃料からエタノールを生成する発酵レシピ
  fermenting(
    event,
    {
      input: Item.of("mekanism:bio_fuel", 4),
      output: Fluid.of("createdieselgenerators:ethanol", 120),
      processingTime: 200,
      heatRequirement: "none"
    }
  )

  // バイオディーゼル生成のナーフ
  event.remove({
    id: 'createdieselgenerators:mixing/biodiesel'
  });
  event.recipes.create.mixing(
    // 200 -> 100
    Fluid.of("createdieselgenerators:biodiesel", 100),
    [
      Fluid.of("createdieselgenerators:plant_oil", 100),
      Fluid.of("createdieselgenerators:ethanol", 100),
    ]
  );
})
