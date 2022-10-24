import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";

describe("<Blog />", () => {
  let post;
  const mockLikes = jest.fn();
  beforeEach(() => {
    const blog = {
      title: "Test Post",
      author: "James Ingerson",
      url: "https://example.com",
      likes: 5,
      user: {
        username: "jamesi",
      },
    };

    const user = {
      username: "jamesi",
    };

    post = render(
      <Blog blog={blog} user={user} increaseLikes={mockLikes} />
    ).container;
  });

  test("renders content", () => {
    // Blog name and author are present
    const collapsedPost = screen.getByText("Test Post James Ingerson");
    expect(collapsedPost).toBeDefined();

    // Collapsed blog with title and author is visible to start with
    const collapsed = post.querySelector(".collapsed-blog");
    expect(collapsed).not.toHaveStyle("display: none");

    // Expanded blog with url and likes are not visible to start with
    const expanded = post.querySelector(".expanded-blog");
    expect(expanded).toHaveStyle("display: none");
  });

  test("clicking view details makes blog expand", async () => {
    const uEvent = userEvent.setup();
    const button = screen.getByText("View Details");
    await uEvent.click(button);

    // Collapsed blog with title and author is hidden
    const collapsed = post.querySelector(".collapsed-blog");
    expect(collapsed).toHaveStyle("display: none");

    // Expanded blog with url and likes is now visible
    const expanded = post.querySelector(".expanded-blog");
    expect(expanded).not.toHaveStyle("display: none");

    // Blog name and author are present
    const expandedPost = screen.getByText("https://example.com");
    expect(expandedPost).toBeDefined();
  });

  test("clicking like twice calls increaseLikes twice", async () => {
    const uEvent = userEvent.setup();
    const button = screen.getByText("Like");
    await uEvent.click(button);
    await uEvent.click(button);
    expect(mockLikes.mock.calls).toHaveLength(2);
  });
});
