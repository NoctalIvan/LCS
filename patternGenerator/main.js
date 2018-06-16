/* node gen algo pat generator */
const range = (min, max, step) => {
  const arr = []
  for(var i = min; i <= max; i += step) arr.push(i)
  return arr
}

const coin = (x, y) => ({type: "coin", x: Math.floor(x), y: Math.floor(y)})
const mine = (x, y) => ({type: "mine", x: Math.floor(x), y: Math.floor(y)})
const life = (x, y) => ({type: "life", x: Math.floor(x), y: Math.floor(y)})
const boost = (x, y) => ({type: "boost", x: Math.floor(x), y: Math.floor(y)})

const createPattern = (seed) => {
  const sinOrCos = Math.random() > 0.5 ? Math.sin : Math.cos

  // super boost
  if(seed < 0.05) return [
    boost(200, Math.random()*400),
    ... range(0,400,100).map(y => mine(300, y)),
  ]
  // coin sin
  if(seed < 0.15) return [
    ... range(Math.random()*10, Math.random()*800 + 400, 25).map(x => coin(x, sinOrCos(x/100)*150 + 150)),
  ]
  // coins + random mines
  if(seed < 0.45) {
    const maxStep = Math.random()*800 + 400
    return [
      ... range(Math.random()*10, maxStep, 50).map(x => coin(x, sinOrCos(x/150)*150 + 150)),
      ... range(Math.random()*10, maxStep, 100 + Math.random()*100).map(x => mine(x, sinOrCos(x)*200 + 150)),
    ]
  }
  // mine lines + potion
  if(seed < 0.55) {
    const height = Math.floor(Math.random()*3) * 150
    let potHeight = Math.floor(Math.random()*3) * 150
    while(potHeight == height) potHeight = Math.floor(Math.random()*3) * 150
    return [
      ... range(0, 800, 100).map(x => mine(x, height)),
      life(600, potHeight),
    ]
  }
  // floor pikes + coins
  if(seed < 0.65) {
    const maxStep = Math.random()*800 + 400
    return [
      ... range(0, maxStep, 100).map(x => mine(x, 0)),
      ... range(0,1,1).map(x => mine(Math.random()*maxStep, Math.random() * 200 + 150)),
      ... range(Math.random()*10, maxStep, 50).map(x => coin(x, sinOrCos(x/150)*120 + 220)),
    ]
  }
  // inter + random coins
  if(seed < 0.75) {
    const maxStep = Math.random()*800 + 400
    return [
      ... range(0, maxStep, 100).map(x => mine(x, 0)),
      ... range(0, maxStep, 100).map(x => mine(x, 300)),
      ... range(Math.random()*10, maxStep, 50).map(x => coin(x, sinOrCos(x/150)*150 + 150)),
    ]
  }
  // mine walls
  if(seed < 0.9) {
    const nbr = Math.floor(Math.random() * 3) + 1
    let arr = []
    range(0, nbr-1, 1).forEach((i) => {
      const skip = Math.floor(Math.random() * 3) * 120
      arr = arr.concat([
        ... range(0,360,120).map(y => y == skip ? undefined : mine(i*500, y)).filter(a => a != undefined),
        ... range(0,8,1).map(k => coin(i*500 + (k%3) * 30, skip + Math.floor(k/3) * 30))
      ])
    })

    return arr
  }

  // life & coins
  const maxStepSeed = Math.random()*600
  return [
    ... range(Math.random()*10, maxStepSeed + 400, 50).map(x => coin(x, sinOrCos(x/150)*150 + 150)),
    life(Math.random()*maxStepSeed + 300, Math.random()*200 + 100)
  ] 
}

const params = {
  population: 1000,
  result: 100,
  crossRatio: 0.3,
  mutationChances: 0.2,
  mutationDegree: 0.1,
  maxIteration: 100,
}

const heuristique = (pat) => {
  let score = 0

  for(var item1 of pat){
    for(var item2 of pat) {
      if(item1.type == "coin" && item2.type == "coin"){
        score -= Math.abs(item1.x - item2.x) + Math.abs(item1.x - item2.x)
      } else {
        score += Math.abs(item1.x - item2.x) + Math.abs(item1.x - item2.x)
      }
    }
  }

  score = score / pat.length
  return score
}

const crossPattern = (p1, p2) => {
  const arr =  p1.concat(p2).shuffle().slice((p1.length + p2.length) / 2)
}

const mutatePattern = (pat) => {
  for(var p of pat){
    p.x = p.x + Math.random() * params.mutationChances * 50 * (Math.random() > 0.5 ? -1 : 1)
    p.y = p.y + Math.random() * params.mutationChances * 50 * (Math.random() > 0.5 ? -1 : 1)
  }
}

/* RUN */
function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

Array.prototype.shuffle = function()  {
  for (let i = this.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this[i], this[j]] = [this[j], this[i]];
  }
  return this
}

let population = range(1,params.population,1).map(a => createPattern(Math.random()))
for(var iteration = 1; iteration <= params.maxIteration; iteration ++) {
  console.log("iteration " + iteration)

  // tournament
  population.shuffle()
  const newPopulation = []
  for(var i = 0; i < population.length; i += 2){
    if(heuristique(population[i]) > heuristique(population[i+1])) newPopulation.push(population[i])
    else newPopulation.push(population[i+1])
  }

  // reinforcement
  population = newPopulation
  population.shuffle()
  const lengthXclossRatio = population.length * params.crossRatio
  for(var i = 0; i < lengthXclossRatio; i += 2){
    population.push(crossPattern(population[i], population[i+1]))
  }
  
  population = population.filter(p => p != undefined)
  while(population.length < params.population) {
    population.push(createPattern(Math.random()))
  }

  for(var p of population) if(Math.random() < params.mutationChances) {
    mutatePattern(p)
  }
}

// elimination
population = population.sort((a,b) => heuristique(b) - heuristique(a)).slice(0, 100)

// sauvegarde
const fs = require('fs')
fs.writeFileSync('patternList.js', 'const patterns = ' + JSON.stringify(population))
console.log("done")