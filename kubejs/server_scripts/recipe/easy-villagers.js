// priority: 0

// Visit the wiki for more info - https://kubejs.com/

ServerEvents.recipes(event => {
  event.remove({
    output: [
      'easy_villagers:auto_trader',
      'easy_villagers:farmer',
      'easy_villagers:converter',
    ]
  })
})