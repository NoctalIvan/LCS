let clouds = []
const popCloud = (x,y) => {
  const c = new PIXI.Sprite(textures.cloud)
  c.startTime = data.time
  c.x = x + 40
  c.y = y + 40
  app.stage.addChild(c)
  c.anchor.set(0.5)
  clouds.push(c)
}

const defilClouds = (delta) => {
  clouds.forEach(c => c.x -= data.speed * delta)
}

const animateClouds = (delta) => {
  clouds.forEach(c => {
    c.age = data.time - c.startTime
    if(c.age >= 100) {
      app.stage.removeChild(c)
      return
    }
    if(c.age > 15) c.alpha = (100 - c.age)/100
    c.rotation += 0.1 * delta
    c.y -= 1*delta
  })

  clouds = clouds.filter(c => c.age < 100)
}