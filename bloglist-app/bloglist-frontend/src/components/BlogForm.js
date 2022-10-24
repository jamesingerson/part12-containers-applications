import { useState } from "react";
import PropTypes from "prop-types";

const BlogForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newUrl, setNewUrl] = useState("");

  const handleTitleChange = (event) => {
    setNewTitle(event.target.value);
  };

  const handleAuthorChange = (event) => {
    setNewAuthor(event.target.value);
  };

  const handleUrlChange = (event) => {
    setNewUrl(event.target.value);
  };

  const addBlog = (event) => {
    event.preventDefault();

    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    });

    setNewTitle("");
    setNewAuthor("");
    setNewUrl("");
  };

  return (
    <form onSubmit={addBlog}>
      <h2>new post</h2>
      <p>
        title:{" "}
        <input
          value={newTitle}
          onChange={handleTitleChange}
          placeholder="Title"
          id="title"
        />
      </p>
      <p>
        author:{" "}
        <input
          value={newAuthor}
          onChange={handleAuthorChange}
          placeholder="Author"
          id="author"
        />
      </p>
      <p>
        url:{" "}
        <input
          value={newUrl}
          onChange={handleUrlChange}
          placeholder="Url"
          id="url"
        />
      </p>
      <button type="submit" id="submit">
        Submit
      </button>
    </form>
  );
};

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired,
};

export default BlogForm;
