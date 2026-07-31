import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import CreateParty from "./CreateParty";
import partyFetch from "../../axios/config";

const mockedNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

vi.mock("../../axios/config", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("CreateParty page", () => {
  it("should render form and submit successfully", async () => {
    partyFetch.get.mockResolvedValueOnce({
      data: [
        {
          _id: "s1",
          name: "DJ",
          description: "Música",
          price: 500,
          image: "https://example.com/dj.jpg",
        },
      ],
    });

    partyFetch.post.mockResolvedValueOnce({
      status: 201,
      data: { msg: "Festa criada com sucesso!" },
    });

    render(
      <MemoryRouter>
        <CreateParty />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/crie sua próxima festa/i)).toBeInTheDocument();
    });

    await userEvent.type(screen.getByLabelText(/nome da festa/i), "Meu Evento");
    await userEvent.type(screen.getByLabelText(/anfitrião/i), "João");
    await userEvent.type(screen.getByLabelText(/descrição/i), "Descrição teste");
    await userEvent.type(screen.getByLabelText(/imagem/i), "https://example.com/image.jpg");

    const submitButton = screen.getByRole("button", { name: /criar festa/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(partyFetch.post).toHaveBeenCalled();
      expect(mockedNavigate).toHaveBeenCalledWith("/");
    });
  });
});
