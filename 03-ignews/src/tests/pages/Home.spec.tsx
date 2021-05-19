import { render, screen } from "@testing-library/react";

import Home from "../../pages";

jest.mock("next/router");
jest.mock("next-auth/client", () => {
  return {
    useSession: () => [null, false],
  };
});

describe("Home Page", () => {
  it("renders correctly", () => {
    render(
      <Home
        product={{
          amount: "$9.90",
          priceId: "fake priceId",
        }}
      />
    );

    expect(screen.getByText("for $9.90 month")).toBeInTheDocument();
  });
});
