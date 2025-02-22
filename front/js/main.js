var demoText;
var app;

let data
const util = {}
let textures = {}
let sprites = {}
let score 

let clickEvent = () => {}

// Fullscreen in pixi is resizing the renderer to be window.innerWidth by window.innerHeight
window.addEventListener("resize", function () {
  app.renderer.resize(window.innerWidth, window.innerHeight);
});

// Create some text. Not important for fullscreen
function setup() {
  app = new PIXI.Application(window.innerWidth, window.innerHeight, {
    backgroundColor: 0xcccccc,
    transparent: true,
  });
  document.body.appendChild(app.view);

  const getImagePath = (a) => 'js/assets/' + a + ".png"
  let images = ["health", "licorn1", "licorn2", 'licorn3', 'licorn4', 'licorn5', 'licorn6', 'licornDown', 'licornUp', 'licornGlide', 'licornHurt', "parallax", "backParallax", "ground", "mine", "coin", "life", "boost", "cloud", "groundMine"]

  data = {
    time: 0,
    life: 100,
    drop: 0.02,
    inv: -1,
    speed: 8,
    momentum: 0,
    gravity: 0.8,
    jumpStrength: 20,
    isJumping: false,
    isGliding: false,
    superMode: -1,
    points: 0,
    invAlternator: 0,

    animateFrame: 0,
    frameSpeed: 5,
    frameTimeout: 5,
    ground: 80,
  }

  let loader = PIXI.loader.add(images.map(getImagePath)).load(() => {

    // textures
    images.forEach(i => textures[i] = PIXI.loader.resources[getImagePath(i)].texture)

    sprites = {
      backParallax: new PIXI.Sprite(textures.backParallax),
      backParallax2: new PIXI.Sprite(textures.backParallax),
      parallax: new PIXI.Sprite(textures.parallax),
      parallax2: new PIXI.Sprite(textures.parallax),
      ground: new PIXI.Sprite(textures.ground),
      ground2: new PIXI.Sprite(textures.ground),
      logo: new PIXI.Sprite(textures.logo),
      health: new PIXI.Sprite(textures.health),
      licorn: new PIXI.Sprite(textures.licorn1),
    }

    score = new PIXI.Text('0', { fill: 'white' })
    score.x = 20
    score.y = 20

    // positions
    util.licornOnGround = () => {sprites.licorn.y = innerHeight - data.ground - sprites.licorn.height}
    util.isLicornOnGround = () => sprites.licorn.y > innerHeight - data.ground - sprites.licorn.height
    util.licornOnGround()
    sprites.licorn.x = 150

    util.licornJump = () => {
      data.isJumping = true
      data.momentum -= data.jumpStrength
    }
    util.licornGlideOn = () => {
      if(data.life < 0) return
      data.isGliding = true
      data.momentum = 0
    }
    util.licornGlideOff = () => data.isGliding = false

    sprites.health.x = 10
    sprites.health.y = 10
    util.resizeHealth = () => { sprites.health.width = (innerWidth - 2*10) * Math.max(data.life,0)/100 }
    util.resizeHealth()

    const parallaxRatio = sprites.parallax.height / innerHeight
    sprites.parallax.height = innerHeight
    sprites.parallax2.height = innerHeight
    sprites.parallax.width = sprites.parallax.width * parallaxRatio
    sprites.parallax2.width = sprites.parallax.width * parallaxRatio
    sprites.parallax.x = 0
    sprites.parallax2.x = sprites.parallax.width
    sprites.parallax.y = 0
    sprites.parallax2.y = 0

    const backParallaxRatio = sprites.backParallax.height / innerHeight
    sprites.backParallax.height = innerHeight
    sprites.backParallax2.height = innerHeight
    sprites.backParallax.width = sprites.backParallax.width * backParallaxRatio
    sprites.backParallax2.width = sprites.backParallax.width * backParallaxRatio
    sprites.backParallax.x = 0
    sprites.backParallax2.x = sprites.backParallax.width
    sprites.backParallax.y = 0
    sprites.backParallax2.y = 0

    util.defilParallax = (delta) => {
      sprites.parallax.x -= data.speed * delta / 2
      sprites.parallax2.x -= data.speed * delta / 2
      if(sprites.parallax.x < -sprites.parallax.width) sprites.parallax.x = sprites.parallax2.x + sprites.parallax2.width
      if(sprites.parallax2.x < -sprites.parallax2.width) sprites.parallax2.x = sprites.parallax.x + sprites.parallax.width

      sprites.backParallax.x -= data.speed * delta / 4
      sprites.backParallax2.x -= data.speed * delta / 4
      if(sprites.backParallax.x < -sprites.backParallax.width) sprites.backParallax.x = sprites.backParallax2.x + sprites.backParallax2.width
      if(sprites.backParallax2.x < -sprites.backParallax2.width) sprites.backParallax2.x = sprites.backParallax.x + sprites.backParallax.width
    }

    sprites.ground.x = 0
    sprites.ground2.x = sprites.ground.width
    sprites.ground.y = innerHeight - 120
    sprites.ground2.y = innerHeight - 120
    util.defilGround = (delta) => {
      sprites.ground.x -= data.speed * delta
      sprites.ground2.x -= data.speed * delta
      if(sprites.ground.x < -sprites.ground.width) sprites.ground.x = sprites.ground2.x + sprites.ground2.width
      if(sprites.ground2.x < -sprites.ground2.width) sprites.ground2.x = sprites.ground.x + sprites.ground.width
    }

    // add sprites
    for(var s in sprites) {
      app.stage.addChild(sprites[s])
    }
    app.stage.addChild(score)

    app.ticker.add(loop)

    // click event
    document.getElementsByTagName('canvas')[0].ontouchstart = (e) => {
      clickHandler(e.screenX, e.screenY)
    }
    document.getElementsByTagName('canvas')[0].ontouchend = (e) => {
      unclickHandler(e.screenX, e.screenY)
    }
  })
}

const clickHandler = (x,y) => {
  if(!data.isJumping) {
    util.licornJump()
    return
  }

  if(!data.isGliding) {
    util.licornGlideOn()
  }
}

const unclickHandler = (x,y) => {
  if(data.isGliding){
    util.licornGlideOff()
  }
}

const loop = (delta) => {
  if(data.ended) return

  data.time += delta
  data.points += Math.floor(delta*10*data.speed)
  score.text = data.points.toLocaleString()

  // accelerate
  data.speed += 0.001 * delta

  // drop life
  data.inv -= delta
  if(data.inv < 0 && data.superMode < 0) {
    data.life -= data.drop * delta
    util.resizeHealth()
  }

  // supermode
  data.superMode -= 1 * delta
  const superModeMult = data.superMode > 0 ? 5 : 1
  if(data.superMode < 0 && data.superMode > -2) {
    data.inv = 100
  }

  // defil parallax
  util.defilParallax(delta * superModeMult)
  util.defilGround(delta * superModeMult)
  defilPattern(delta * superModeMult)
  defilClouds(delta * superModeMult)

  // animate
  animateClouds(delta)
  data.invAlternator = (data.invAlternator + 1) % 10
  if(data.inv > 0 && data.invAlternator > 5) {
    sprites.licorn.alpha = 0
  } else sprites.licorn.alpha = 1

  data.frameTimeout --
  if(data.frameTimeout <= 0) {
    data.frameTimeout = data.frameSpeed
    data.animateFrame = (data.animateFrame + 1) % 6
  }

  if(data.inv > 0) {
    sprites.licorn.texture = textures.licornHurt
  } else if(data.isGliding) {
    sprites.licorn.texture = textures.licornGlide
  } else if(!util.isLicornOnGround()){
    if(data.momentum < 0) {
      sprites.licorn.texture = textures.licornUp
    } else {
      sprites.licorn.texture = textures.licornDown
    }
  }
  else {
    sprites.licorn.texture = textures['licorn' + (data.animateFrame + 1)]
  }

  // momentum
  if(!data.isGliding) {
    sprites.licorn.y += data.momentum
    data.momentum += data.gravity
  }
  if(util.isLicornOnGround()){
    data.momentum = 0
    util.licornOnGround
    data.isJumping = false
  }

  // patterns
  deleteInvisiblePattern()
  if(isFinishedPattern()){ // && time > 30*3
    archivePattern()
    putPattern(getRandomPattern())
  }

  // collision
  let coll = checkLicornCollision()
  while(coll){
    if(coll.type == "coin"){
      data.points += 1000
    } else if(coll.type == "mine") {
      popCloud(coll.x, coll.y)
      if(data.superMode < 0 && data.inv <  0) {
        data.life -= 10
        data.inv = 30 * 2
        util.resizeHealth()
      }
    } else if(coll.type == "life") {
      data.life += 15
      util.resizeHealth()
      if(data.life > 100) data.life = 100
    } else if(coll.type == "boost") {
      data.superMode = 250
    }

    app.stage.removeChild(coll)
    coll.collided = true
    coll = checkLicornCollision()
  }

  // death
  if(data.life == 0) {
    util.licornGlideOff()
  }
  if(data.life < 0 && util.isLicornOnGround()){
    data.ended = true
    localStorage.setItem('score', data.score)
    window.location.reload()
  }
}

setup();