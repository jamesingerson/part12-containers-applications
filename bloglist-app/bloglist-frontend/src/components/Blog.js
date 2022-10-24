import { useState } from "react";

const Blog = ({ blog, increaseLikes, removeBlog, user }) => {
  const [expanded, setExpanded] = useState(false);

  const hideWhenExpanded = { display: expanded ? "none" : "" };
  const showWhenExpanded = {
    display: expanded ? "" : "none",
    paddingTop: 2,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <>
      <div style={hideWhenExpanded} className="collapsed-blog">
        {blog.title} {blog.author}
        <button onClick={() => toggleExpanded()}>View Details</button>
      </div>
      <div
        style={showWhenExpanded}
        className="expanded-blog"
        data-cy={blog.title}
      >
        <p>
          {blog.title}{" "}
          <button onClick={() => toggleExpanded()}>Collapse</button>
        </p>
        <p>{blog.url}</p>
        <p>
          {blog.likes}{" "}
          <button onClick={() => increaseLikes({ blog })}>Like</button>
        </p>
        <p>{blog.author}</p>
        {user.username === blog.user.username && (
          <button onClick={() => removeBlog({ blog })}>Remove</button>
        )}
      </div>
    </>
  );
};

export default Blog;
