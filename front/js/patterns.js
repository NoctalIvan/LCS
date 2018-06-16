const getRandomPattern = () => {
  // return patterns[6]
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
  const pats = (patternSprites || []).concat(oldPatternSprites || []).filter(a => !a.collided)
  const licornHitbox = {... sprites.licorn,  x: sprites.licorn.x + 20, y: sprites.licorn.y + 20, width: sprites.licorn.width - 40, height: sprites.licorn.height - 40}
  for(const pat of pats) {
    if(isColliding(licornHitbox, pat)) return pat
  }
  return undefined
}