import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Party from "./Party";
import partyFetch from "../../axios/config";

const mockedNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useParams: () => ({ id: "p1" }),
    useNavigate: () => mockedNavigate,
  };
});

vi.mock("../../axios/config", () => ({
  default: {
    get: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("Party page", () => {
  it("should load and render party details", async () => {
    partyFetch.get.mockResolvedValueOnce({
      status: 200,
      data: {
        _id: "p1",
        title: "Festa A",
        description: "Descrição A",
        budget: 1000,
        image: "https://example.com/a.jpg",
        services: [],
      },
    });

    render(
      <MemoryRouter>
        <Party />
      </MemoryRouter>
    );

    expect(screen.getByText(/carregando/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Festa A")).toBeInTheDocument();
      expect(screen.getByText("Descrição A")).toBeInTheDocument();
    });
  });

  it("should delete party and navigate home", async () => {
    partyFetch.get.mockResolvedValueOnce({
      status: 200,
      data: {
        _id: "p1",
        title: "Festa B",
        description: "Descrição B",
        budget: 1200,
        image: "https://example.com/b.jpg",
        services: [],
      },
    });

    partyFetch.delete.mockResolvedValueOnce({
      status: 200,
      data: { msg: "Festa excluída com sucesso." },
    });

    render(
      <MemoryRouter>
        <Party />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Festa B")).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole("button", { name: /excluir/i }));

    await waitFor(() => {
      expect(partyFetch.delete).toHaveBeenCalledWith("/parties/p1");
      expect(mockedNavigate).toHaveBeenCalledWith("/");
    });
  });
});
