const express = require("express");
const { Todo } = require("../mongo");
const router = express.Router();
const redis = require("../redis");

/* GET todos listing. */
router.get("/", async (_, res) => {
  const todos = await Todo.find({});
  res.send(todos);
});

/* POST todo to listing. */
router.post("/", async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false,
  });
  const addedCount = parseInt(await redis.getAsync("added_todos")) + 1;
  console.log("added count: ", addedCount);
  redis.setAsync("added_todos", addedCount ? addedCount : 1);
  res.send(todo);
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params;
  req.todo = await Todo.findById(id);
  if (!req.todo) return res.sendStatus(404);

  next();
};

/* DELETE todo. */
singleRouter.delete("/", async (req, res) => {
  await req.todo.delete();
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get("/", async (req, res) => {
  res.send(req.todo);
});

/* PUT todo. */
singleRouter.put("/", async (req, res) => {
  const { text, done } = req.body;
  const updatedTodo = await Todo.findOneAndUpdate(
    { _id: req.todo._id },
    { text, done },
    { new: true, useFindAndModify: false }
  );
  res.status(200).send(updatedTodo);
});

router.use("/:id", findByIdMiddleware, singleRouter);

module.exports = router;
