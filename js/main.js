var demoText;
var app;

// Fullscreen in pixi is resizing the renderer to be window.innerWidth by window.innerHeight
window.addEventListener("resize", function () {
  app.renderer.resize(window.innerWidth, window.innerHeight);
});

// Create some text. Not important for fullscreen
function setupDemo() {
  app = new PIXI.Application(window.innerWidth, window.innerHeight, {
    // backgroundColor: 0xcccccc
    // transparent: true
  });
  document.body.appendChild(app.view);

  
  // Update the text every pixi frame or 'tick'
  app.ticker.add(loop)
}

const loop = () => {
  console.log("a")
}

setup();