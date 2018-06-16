let clouds = []
const popCloud = (x,y) => {
  const c = new PIXI.Sprite(textures.cloud)
  c.startTime = data.time
  c.x = x
  c.y = y
  app.stage.addChild(c)
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
    }
  })

  clouds = clouds.filter(c => c.age < 100)
}