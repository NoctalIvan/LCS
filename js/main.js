var demoText;
var app;

let data
const util = {}
let textures = {}
let sprites = {}

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
  let images = ["health", "licorn", "parallax", "ground"]

  data = {
    life: 100,
    drop: 0.02,
    inv: 100,
    speed: 5,
    momentum: 0,
    gravity: 0.3,
    jumpStrength: 12,
    isJumping: false,
    isGliding: false,
  }

  let loader = PIXI.loader.add(images.map(getImagePath)).load(() => {

    // textures
    images.forEach(i => textures[i] = PIXI.loader.resources[getImagePath(i)].texture)

    sprites = {
      parallax: new PIXI.Sprite(textures.parallax),
      parallax2: new PIXI.Sprite(textures.parallax),
      ground: new PIXI.Sprite(textures.ground),
      ground2: new PIXI.Sprite(textures.ground),
      logo: new PIXI.Sprite(textures.logo),
      health: new PIXI.Sprite(textures.health),
      licorn: new PIXI.Sprite(textures.licorn),
    }

    // positions
    util.licornOnGround = () => {sprites.licorn.y = innerHeight - 100 - sprites.licorn.height}
    util.isLicornOnGround = () => sprites.licorn.y > innerHeight - 100 - sprites.licorn.height
    util.licornOnGround()
    sprites.licorn.x = 150

    util.licornJump = () => {
      data.isJumping = true
      data.momentum -= data.jumpStrength
    }
    util.licornGlideOn = () => {
      data.isGliding = true
      data.momentum = 0
    }
    util.licornGlideOff = () => data.isGliding = false

    sprites.health.x = 10
    sprites.health.y = 10
    util.resizeHealth = () => { sprites.health.width = (innerWidth - 2*10) * data.life/100 }
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

    util.defilParallax = (delta) => {
      sprites.parallax.x -= data.speed * delta / 2
      sprites.parallax2.x -= data.speed * delta / 2
      if(sprites.parallax.x < -sprites.parallax.width) sprites.parallax.x = sprites.parallax2.x + sprites.parallax2.width
      if(sprites.parallax2.x < -sprites.parallax2.width) sprites.parallax2.x = sprites.parallax.x + sprites.parallax.width
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

    app.ticker.add(loop)

    // click event
    document.getElementsByTagName('canvas')[0].onclick = (e) => {
      clickHandler(e.screenX, e.screenY)
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
  } else {
    util.licornGlideOff()
  }
}

const loop = (delta) => {
  // drop life
  data.inv -= delta
  if(data.inv < 0) {
    data.life -= data.drop * delta
    util.resizeHealth()
  }

  // defil parallax
  util.defilParallax(delta)
  util.defilGround(delta)

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
}

setup();