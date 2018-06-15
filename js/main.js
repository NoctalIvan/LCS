var demoText;
var app;

let data
const util = {}

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
  let images = ["health", "licorn", "parallax"]

  data = {
    life: 100,
    drop: 0.02,
    inv: 100,
    speed: 5,
  }

  let loader = PIXI.loader.add(images.map(getImagePath)).load(() => {

    // textures
    let textures = {}
    images.forEach(i => textures[i] = PIXI.loader.resources[getImagePath(i)].texture)

    let sprites = {
      parallax: new PIXI.Sprite(textures.parallax),
      parallax2: new PIXI.Sprite(textures.parallax),
      logo: new PIXI.Sprite(textures.logo),
      health: new PIXI.Sprite(textures.health),
      licorn: new PIXI.Sprite(textures.licorn),
    }

    // positions
    sprites.licorn.y = innerHeight - 100 - sprites.licorn.height
    sprites.licorn.x = 40

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
      sprites.parallax.x -= data.speed/2 * delta
      sprites.parallax2.x -= data.speed/2 * delta
      if(sprites.parallax.x < -sprites.parallax.width) sprites.parallax.x = sprites.parallax2.x + sprites.parallax2.width
      if(sprites.parallax2.x < -sprites.parallax2.width) sprites.parallax2.x = sprites.parallax.x + sprites.parallax.width
    }

    // add sprites
    for(var s in sprites) {
      app.stage.addChild(sprites[s])
    }

    app.ticker.add(loop)
  })
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
}

setup();