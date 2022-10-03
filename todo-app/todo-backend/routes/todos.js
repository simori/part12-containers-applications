const express = require('express');
const { Todo } = require('../mongo')
const router = express.Router();
const redis = require('../redis')
const { MONGO_URL, REDIS_URL } = require('../util/config')

let added_todos
/* GET todos listing. */
router.get('/', async (_, res) => {
  console.log('mongourli',MONGO_URL);
  console.log('redisurli',REDIS_URL);
  console.log('getting some todos!');
  const todos = await Todo.find({})
  added_todos = todos.length
  // adding todos length to redis
  const value = await redis.getAsync('added_todos');

  const nextValue = value ? Number(value) + 1 : 1;

  await redis.setAsync('added_todos', added_todos);
  res.send(todos);
});

/* 12.10 */
router.get('/statistics', async (req, res) => {
  res.send({
    added_todos
  });
});

/* POST todo to listing. */
router.post('/', async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false
  })
  // increment redis added_todos by 1
  const value = await redis.getAsync('added_todos');

  const nextValue = value ? Number(value) + 1 : 1;

  await redis.setAsync('added_todos', Number(value) + 1);
  res.send(todo);
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  console.log('middleware',req.params);
  const { id } = req.params
  req.todo = await Todo.findById(id)
  if (!req.todo) return res.sendStatus(404)
  console.log("tuduu",req.todo);
  next()
}

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
  console.log("tuduu poisto",req.todo);
  await req.todo.delete()  
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get('/', async (req, res) => {
  const { _id } = req.todo._id
  req.todo = await Todo.findById(_id)
  if (!req.todo) return res.sendStatus(404)
  res.send(req.todo); // Implement this
});

/* PUT todo. */
singleRouter.put('/', async (req, res) => {
  console.log('req todo ',req.todo);
  const { _id } = req.todo._id
  const text = req.body.text
  const done = req.body.done
  //req.todo = await Todo.findById(id)
  console.log('parametrit ',text,done);
  await Todo.findByIdAndUpdate(_id, { text, done })
  res.sendStatus(204); // Implement this
});

router.use('/:id', findByIdMiddleware, singleRouter)


module.exports = router;
