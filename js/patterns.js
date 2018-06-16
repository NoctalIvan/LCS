const patterns = [
  [
    {type: 'mine', x: 500, y: 0},
  ]
]

const getRandomPattern = () => {
  return patterns[Math.floor(Math.random() * patterns.length)]
}

let patternSprites 
const putPattern = (pat) => {
  patternSprites = pat.map(item => {
    const a = new PIXI.Sprite(textures[item.type])
    a.x = item.x + innerWidth
    a.y = innerHeight - item.y - 100 - a.height
    return a
  })
  patternSprites.map(p => app.stage.addChild(p))
}

const defilPattern = (delta) => {
  if(!patternSprites) return
  patternSprites.forEach(s => {
    s.x -= data.speed * delta
  })
}

const isFinishedPattern = () => {
  if(!patternSprites) return true
  const lastpat = patternSprites.slice(-1)[0]
  return lastpat.x < -lastpat.width
}

const deletePattern = () => {
  if(!patternSprites) return
  patternSprites.map(p => app.stage.removeChild(p))
  patternSprites = undefined
}

const checkLicornCollision = () => {
  if(!patternSprites) return undefined
  
}