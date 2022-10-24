import { useState, useEffect, useRef } from "react";
import Notification from "./components/Notification";
import Blog from "./components/Blog";
import BlogForm from "./components/BlogForm";
import blogService from "./services/blogs";
import loginService from "./services/login";
import LoginForm from "./components/LoginForm";
import Togglable from "./components/Togglable";

import "./index.css";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState(null);
  const blogFormRef = useRef();

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedInBlogAppUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  function showNotification(message, status) {
    setNotification({ message, status });
    setTimeout(() => setNotification(null), 5000);
  }

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({
        username,
        password,
      });
      window.localStorage.setItem("loggedInBlogAppUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
      showNotification(`User ${user.name} logged in`, "success");
    } catch (exception) {
      showNotification("Invalid credentials", "error");
    }
  };

  const handleLogout = async (event) => {
    event.preventDefault();
    window.localStorage.removeItem("loggedInBlogAppUser");
    blogService.setToken("");
    setUser(null);
    setUsername("");
    setPassword("");
  };

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility();

    blogService.create(blogObject).then((returnedBlog) => {
      setBlogs(blogs.concat(returnedBlog));
    });

    showNotification(`New blog ${blogObject.title} added`, "success");
  };

  const increaseLikes = ({ blog }) => {
    const putBlog = {
      user: blog.user,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url,
    };
    blogService.update(blog.id, putBlog).then((returnedBlog) => {
      console.log(returnedBlog);
      setBlogs(blogs.map((b) => (b.id !== returnedBlog.id ? b : returnedBlog)));
    });
  };

  const removeBlog = ({ blog }) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      blogService.remove(blog.id).then(() => {
        setBlogs(blogs.filter((b) => b.id !== blog.id));
      });
    }
  };

  return (
    <div>
      <h2>blogs</h2>
      <Notification notification={notification} />
      {user === null ? (
        <LoginForm
          handleLogin={handleLogin}
          username={username}
          password={password}
          setUsername={setUsername}
          setPassword={setPassword}
        />
      ) : (
        <div>
          <p>
            {user.name} logged in <button onClick={handleLogout}>Logout</button>
          </p>
          <Togglable buttonLabel="new blog" ref={blogFormRef}>
            <BlogForm createBlog={addBlog} />
          </Togglable>
          {blogs
            .sort((a, b) => b.likes - a.likes)
            .map((blog) => (
              <Blog
                key={blog.id}
                blog={blog}
                increaseLikes={increaseLikes}
                removeBlog={removeBlog}
                user={user}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default App;
