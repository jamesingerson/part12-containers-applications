const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const supertest = require("supertest");
const helper = require("./test-helper");
const app = require("../app");

const api = supertest(app);

const User = require("../models/user");

describe("initialize and test user set up", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("testpassword", 10);
    const user = new User({ username: "testuser", passwordHash });

    await user.save();
  });

  test("valid new user is created correctly", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "notjames",
      name: "Someoneelse",
      password: "verygoodpassword",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    expect(usernames).toContain(newUser.username);
  });

  test("don't create a new user if username is taken", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "testuser",
      name: "A Duplicate",
      password: "covertcode",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toContain("username must be unique");

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });

  test("stop creating a new user if no username is provided", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      name: "Incomplete",
      password: "passwo",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toContain("a username must be provided");

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });

  test("stop creating a new user if no password is provided", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "nopass",
      name: "Double Agent",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toContain("a password must be provided");

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });

  test("stop creating a new user if no password is provided", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "nopass",
      name: "Double Agent",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toContain("a password must be provided");

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });

  test("stop creating a new user if password is too short", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "key",
      name: "Mr Key",
      password: "mk",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toContain(
      "password must be at least three characters"
    );

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });

  test("stop creating a new user if username is too short", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "jd",
      name: "John Doe",
      password: "littleknown",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toContain(
      "username must be at least three characters"
    );

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
