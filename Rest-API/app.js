const express = require('express')
const path = require('path')
const {v4} = require('uuid')

const app = express()

let BETS = [
  {id: v4(), name: 'Реал-Атлетико', value:' 2:1 '}
] 

app.use(express.static(path.join(__dirname,'public')))
app.use(express.static(path.join(__dirname,'images')))

app.use(express.json())


app.get('/app/bets', (req, res) => {
  try {
      articles.find({}, function (err, articles) {
          res.status(200).json(articles)
      });
  } catch (e) {
      console.log(e)
      res.status(400).json({message: 'Error retrieving data from the database'})
  }
})

// GET
app.get('/api/bets', (req, res) => {
    res.status(200).json(BETS)
})

// POST
app.post('/api/bets', (req, res) => {
  const bet = {...req.body, id: v4(), marked: false}
  BETS.push(bet)
  res.status(201).json(bet)
})

// DELETE
app.delete('/api/bets/:id', (req, res) => {
  BETS = BETS.filter(c => c.id !== req.params.id)
  res.status(200).json({message: 'Контакт был удален'})
})

// PUT
app.put('/api/bets/:id', (req, res) => {
  const idx = BETS.findIndex(c => c.id === req.params.id)
  BETS[idx] = req.body
  res.json(BETS[idx])
})


app.use(express.static(path.resolve(__dirname, 'client')))

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client', 'index.html'))
})
app.listen(3000, () => {
  console.log('Server has been started successfully....')})