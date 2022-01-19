import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { fireEvent, render } from "@testing-library/react";
import Home from "./index";

describe("<Home/>", () => {
  it("snapshot home", async () => {
    const products = [
      {
        id: 1,
        name: "Product 1",
        price: 100,
      },
    ];

    const homeComponent = render(<Home products={products} />);
    expect(homeComponent.asFragment()).toMatchSnapshot();
  });

  const mockHandleAddTroley = { handleAddToTroley: jest.fn() };
  it("clicking the button +", () => {
    const products = [
      {
        id: 1,
        name: "Product 1",
        price: 100,
      },
    ];

    const homeComponent = render(<Home products={products} />);
    const button = homeComponent.getByText("+");
    fireEvent.click(button);
    expect(button).toHaveBeenCalled(1);
  });
});
