import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

describe("Home", () => {
  it("renders a heading", () => {
    render(<>hello</>);

    expect(screen.getByText("hello")).toBeInTheDocument();
  });
});
