import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import BlogForm from "./BlogForm";
import userEvent from "@testing-library/user-event";

test("<BlogForm /> gets correct details when submitted", async () => {
  const createBlog = jest.fn();
  const uEvent = userEvent.setup();

  render(<BlogForm createBlog={createBlog} />);

  const title = screen.getByPlaceholderText("Title");
  const author = screen.getByPlaceholderText("Author");
  const url = screen.getByPlaceholderText("Url");
  const sendButton = screen.getByText("Submit");

  await uEvent.type(title, "Test Blog Post");
  await uEvent.type(author, "Jest Test Suite");
  await uEvent.type(url, "https://jestjs.io/");
  await uEvent.click(sendButton);

  expect(createBlog.mock.calls).toHaveLength(1);
  expect(createBlog.mock.calls[0][0].title).toBe("Test Blog Post");
  expect(createBlog.mock.calls[0][0].author).toBe("Jest Test Suite");
  expect(createBlog.mock.calls[0][0].url).toBe("https://jestjs.io/");
});
