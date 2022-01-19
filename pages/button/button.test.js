import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { fireEvent, render } from "@testing-library/react";
import Button from "./index.jsx";

const mockFn = jest.fn();
describe("<Button/>", () => {
  it("must call handleAddArticleToTrolley", () => {
    const component = render(<Button handle={mockFn} text="+" />);
    const button = component.getByText("+");
    fireEvent.click(button);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });
});
