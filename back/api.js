// scoreboard api
const express = require('express')
const app = express()
const fs = require('fs')

let scores
if(fs.existsSync('scores.json')) {
  scores = fs.readFileSync('scores.json')
} else {
  scores = {}
  fs.writeFileSync('scores.json', '{}')
}

app.get('/scores', function (req, res) {
  res.send(scores)
})

app.post('/scores/:name/:score', function(req, res) {
  try {
    let udpated = false
    let score = parseInt(req.params.score)
    if(!scores[req.params.name] || scores[req.params.name] < score) {
      this.score[req.params.name] = score
      updated = true
    }

    res.send({name: req.params.name, score: this.score[req.params.name], updated})
  } catch (e) {
    res.status(400).send()
  }
})

app.listen(9513, function () {
  console.log('LCS listening on port 9513!')
})
