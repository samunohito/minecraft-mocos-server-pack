// priority: 0

ServerEvents.recipes(event => {
  event.remove({
    output: [
      "alltheores:brass_dust",
      "alltheores:brass_ingot",
    ]
  });
})
