const mongoose = require("mongoose");
const supertest = require("supertest");
const bcrypt = require("bcrypt");
const helper = require("./test-helper");
const app = require("../app");

const api = supertest(app);

const Blog = require("../models/blog");
const User = require("../models/user");

let token = null;

beforeAll(async () => {
  await User.deleteMany({});
  const password = "testpassword";
  const passwordHash = await bcrypt.hash(password, 10);
  const user = new User({ username: "testuser", passwordHash });
  await user.save();

  const loginResponse = await api
    .post("/api/login")
    .send({ username: user.username, password: password });
  return (token = loginResponse.body.token);
});

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(helper.initialBlogs);
});

describe("after initial blogs are saved", () => {
  test("expected number of blogs are returned", async () => {
    const response = await api.get("/api/blogs");
    expect(response.body).toHaveLength(helper.initialBlogs.length);
  });

  test("unique property is called id", async () => {
    const response = await api.get("/api/blogs");
    const blog = response.body[0];
    expect(blog.id).toBeDefined;
  });
});

describe("a new blog is posted", () => {
  test("valid data is handled correctly", async () => {
    const newBlog = {
      title: "Valid Blog Post",
      author: "James Ingerson",
      url: "https://www.example.com/valid-post",
      likes: 5,
    };

    await api
      .post("/api/blogs")
      .set("Authorization", `bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAfterPost = await helper.blogsInDb();
    expect(blogsAfterPost).toHaveLength(helper.initialBlogs.length + 1);

    const contents = blogsAfterPost.map((b) => b.title);
    expect(contents).toContain("Valid Blog Post");
  });

  test("missing likes means 0 likes", async () => {
    const newBlog = {
      title: "Missing Likes Post",
      author: "James Ingerson",
      url: "https://www.example.com/missing-likes-post",
    };

    await api
      .post("/api/blogs")
      .set("Authorization", `bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAfterPost = await helper.blogsInDb();
    const partialPost = blogsAfterPost.find(
      (p) => p.title === "Missing Likes Post"
    );
    expect(partialPost.likes).toEqual(0);
  });

  test("posts missing title and url are not accepted", async () => {
    const newBlog = {
      author: "James Ingerson",
      likes: 164,
    };

    await api
      .post("/api/blogs")
      .set("Authorization", `bearer ${token}`)
      .send(newBlog)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const blogsAfterPost = await helper.blogsInDb();
    expect(blogsAfterPost).toHaveLength(helper.initialBlogs.length);
  });

  test("valid post is declined without token", async () => {
    const newBlog = {
      title: "Valid Blog Post",
      author: "James Ingerson",
      url: "https://www.example.com/valid-post",
      likes: 5,
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(401)
      .expect("Content-Type", /application\/json/);

    const blogsAfterPost = await helper.blogsInDb();
    expect(blogsAfterPost).toHaveLength(helper.initialBlogs.length);

    const contents = blogsAfterPost.map((b) => b.title);
    expect(contents).not.toContain("Valid Blog Post");
  });
});

describe("blog post deletion", () => {
  test("removes post and returns 204", async () => {
    const toDeleteBlog = {
      title: "To Be Deleted",
      author: "James Ingerson",
      url: "https://www.example.com/soon-to-be-deleted",
      likes: 0,
    };

    await api
      .post("/api/blogs")
      .set("Authorization", `bearer ${token}`)
      .send(toDeleteBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart.find(
      (b) => b.title === toDeleteBlog.title
    );

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set("Authorization", `bearer ${token}`)
      .expect(204);

    const blogsAtEnd = await helper.blogsInDb();
    // Expect length to be the same as we started because we're adding and removing in isolation
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);

    const contents = blogsAtEnd.map((b) => b.title);
    expect(contents).not.toContain(blogToDelete.title);
  });

  test("attempting to delete with no token is denied", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(401);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);

    const contents = blogsAtEnd.map((b) => b.title);
    expect(contents).toContain(blogToDelete.title);
  });
});

describe("update an existing blog", () => {
  test("incrementing the likes count", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const initialBlog = blogsAtStart[0];

    const updatedBlog = {
      ...initialBlog,
      likes: initialBlog.likes + 1,
    };

    await api.put(`/api/blogs/${updatedBlog.id}`).send(updatedBlog).expect(200);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);

    const blogAtEnd = blogsAtEnd.find((b) => b.id === updatedBlog.id);

    expect(blogAtEnd.likes).toEqual(initialBlog.likes + 1);
    expect(blogAtEnd.title).toEqual(initialBlog.title);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
