const { Router } = require('express')
const Todo = require('../models/Todo')
const router = Router()
const path = require('path')

router.get('/', async (req, res) => {
  const todos = await Todo.find({}).lean()

  res.render('index', {
    title: 'Todos list',
    isIndex: true,
    todos
  })
})

router.get('/create', (req, res) => {
  res.render('create', {
    title: 'Create todo',
    isCreate: true
  })
})

router.post('/create', async (req, res) => {
  const todo = new Todo({
    title: req.body.title,
    message: req.body.message,
    status: req.body.status_order,
    date: req.body.date 
  }) 
  await todo.save()
  res.redirect('/')
})

router.post('/complete', async (req, res) => {
    const todo = await Todo.findById(req.body.id)

    if(req.body.hasOwnProperty("save")){
      if (todo.status == "Cancelled"){
        todo.status = "Shipped"
        todo.completed = false
      }
      else{
        todo.status = "Cancelled"
        todo.completed = true
      }
      await todo.save()  
      res.redirect('/')
    }
})

module.exports = router
