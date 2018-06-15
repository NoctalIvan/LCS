var demoText;
var app;

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
  let images = ["logo", "health"]

  let data = {
    life: 100,
  }

  let loader = PIXI.loader.add(images.map(getImagePath)).load(() => {

    // textures
    let textures = {}
    images.forEach(i => textures[i] = PIXI.loader.resources[getImagePath(i)].texture)

    let sprites = {
      logo: new PIXI.Sprite(textures.logo),
    }

    // position
    sprites.logo.x = innerWidth/2 - sprites.logo.width /2
    sprites.logo.y = innerHeight/2 - sprites.logo.height /2
    console.log(sprites.logo.x, sprites.logo.width)

    sp

    // add sprites
    for(var s in sprites) {
      app.stage.addChild(sprites[s])
    }

    app.ticker.add(loop)
  })
}

const loop = (delta) => {

}

setup();