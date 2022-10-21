const express = require("express");
const statisticsRouter = express.Router();

const redis = require("../redis");

/* GET data. */
statisticsRouter.get("/", async (req, res) => {
  const added_todos = await redis.getAsync("added_todos");
  res.send({
    added_todos: added_todos ? added_todos : "0",
  });
});

module.exports = statisticsRouter;
