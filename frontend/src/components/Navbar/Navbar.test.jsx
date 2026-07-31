import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navbar from "./Navbar";

describe("Navbar", () => {
  it("should render title and navigation links", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByText("Party Time!")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /minhas festas/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /criar festa/i })).toBeInTheDocument();
  });
});
