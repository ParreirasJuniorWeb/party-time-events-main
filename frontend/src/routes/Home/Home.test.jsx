import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Home from "./Home";
import partyFetch from "../../axios/config";

vi.mock("../../axios/config", () => ({
  default: {
    get: vi.fn(),
  },
}));

describe("Home page", () => {
  it("should render fetched parties", async () => {
    partyFetch.get.mockResolvedValueOnce({
      data: [
        {
          _id: "1",
          title: "Festa Teste",
          image: "https://example.com/image.jpg",
        },
      ],
    });

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(screen.getByText(/carregando/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Festa Teste")).toBeInTheDocument();
    });
  });
});
