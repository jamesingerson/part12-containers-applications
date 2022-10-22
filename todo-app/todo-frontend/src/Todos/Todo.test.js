import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Todo from "./Todo";

describe("<Todo />", () => {
  it("should display text", () => {
    render(
      <Todo
        todo={{ text: "testing", done: false }}
        completeTodo={jest.fn()}
        deleteTodo={jest.fn()}
      />
    );
    expect(screen.getByText("testing")).toBeVisible();
  });
});
