const coin = (x, y) => ({type: "coin", x, y})
const mine = (x, y) => ({type: "mine", x, y})
const life = (x, y) => ({type: "life", x, y})

const range = (min, max, step) => {
  const arr = []
  for(var i = min; i <= max; i += step) arr.push(i)
  return arr
}

const patterns = [
  [
    ... range(0,400, 100).map(x => mine(x,0)),
    mine(200,300),

    ... range(50, 400, 50).map(x => coin(x, 140)),
    ... range(50, 350, 50).map(x => coin(x+20, 220)),
  ],
  [
    mine(0,0),
    mine(320, 0),
    life(170, 0),

    ... range(0,200, 50).map(x => coin(x,  150 + x/2)),
    ... range(0, 150, 50).map(x => coin(400-x, 150 + x/2)),
  ],
  [
    ... range(0, 400, 30).map(x => coin(x, x)),
    ... range(0, 390, 30).map(x => coin(x, 390-x)),
  ],
  [
    ... range(0, 400, 30).map(x => coin(x, x)),
    ... range(0, 390, 30).map(x => coin(x, 390-x)),
    mine(0, 160),
    mine(340, 160),
  ],
]

const getRandomPattern = () => {
  //return patterns[0]
  return patterns[Math.floor(Math.random() * patterns.length)]
}

let patternSprites 
let oldPatternSprites

const putPattern = (pat) => {
  patternSprites = pat.map(item => {
    const a = new PIXI.Sprite(textures[item.type])
    a.type = item.type
    a.x = item.x + innerWidth
    a.y = innerHeight - item.y - 100 - a.height
    return a
  })
  patternSprites.map(p => app.stage.addChild(p))
}

const defilPattern = (delta) => {
  if(patternSprites){
    patternSprites.forEach(s => {
      s.x -= data.speed * delta
    })
  }

  if(oldPatternSprites){
    oldPatternSprites.forEach(s => {
      s.x -= data.speed * delta
    })
  }
}

const isFinishedPattern = () => {
  if(!patternSprites) return true
  const lastpat = patternSprites.sort((a,b) => (b.x + b.width) - (a.x + a.width))[0]
  return lastpat.x < 550
}

const deleteInvisiblePattern = () => {
  if(!oldPatternSprites) return true
  const lastpat = oldPatternSprites.sort((a,b) => (b.x + b.width) - (a.x + a.width))[0]
  if(lastpat.x < -lastpat.width) {
    oldPatternSprites.map(p => app.stage.removeChild(p))
    oldPatternSprites = undefined
  }
}

const archivePattern = () => {
  oldPatternSprites = patternSprites
  patternSprites = undefined
}

const isColliding = (s1, s2) => {
  if(s1.x + s1.width < s2.x) return false
  if(s1.x > s2.x + s2.width) return false
  if(s1.y + s1.height < s2.y) return false
  if(s1.y > s2.y + s2.height) return false
  return true
}

const checkLicornCollision = () => {
  const pats = (patternSprites || []).concat(oldPatternSprites || [])
  for(const pat of pats) {
    if(isColliding(sprites.licorn, pat)) return pat
  }
  return undefined
}