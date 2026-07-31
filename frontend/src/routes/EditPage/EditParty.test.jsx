import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import EditParty from "./EditParty";
import partyFetch from "../../axios/config";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useParams: () => ({ id: "p1" }),
    useNavigate: () => vi.fn(),
  };
});

vi.mock("../../axios/config", () => ({
  default: {
    get: vi.fn(),
    put: vi.fn(),
  },
}));

vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("EditParty page", () => {
  it("should load and render form with party data", async () => {
    partyFetch.get
      .mockResolvedValueOnce({
        data: [
          {
            _id: "s1",
            name: "DJ",
            description: "Música",
            price: 500,
            image: "https://example.com/dj.jpg",
          },
        ],
      })
      .mockResolvedValueOnce({
        data: {
          _id: "p1",
          title: "Festa Editável",
          author: "João",
          description: "Desc",
          budget: 2000,
          image: "https://example.com/p.jpg",
          services: [],
        },
      });

    render(
      <MemoryRouter>
        <EditParty />
      </MemoryRouter>
    );

    expect(screen.getByText(/carregando/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByDisplayValue("Festa Editável")).toBeInTheDocument();
      expect(screen.getByDisplayValue("João")).toBeInTheDocument();
    });
  });
});
