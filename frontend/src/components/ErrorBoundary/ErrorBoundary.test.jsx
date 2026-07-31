import { render, screen } from "@testing-library/react";
import ErrorBoundaryWrapper from "./ErrorBoundary";

function BuggyComponent() {
  throw new Error("Falha simulada");
}

describe("ErrorBoundaryWrapper", () => {
  it("should render fallback UI when child throws", () => {
    const originalError = console.error;
    console.error = () => {};

    render(
      <ErrorBoundaryWrapper
        fallbackProps={{
          errorTitle: "Erro personalizado",
          errorMessage: "Algo deu errado na aplicação",
          showRetry: false,
        }}
      >
        <BuggyComponent />
      </ErrorBoundaryWrapper>
    );

    expect(screen.getByText("Erro personalizado")).toBeInTheDocument();
    expect(screen.getByText("Algo deu errado na aplicação")).toBeInTheDocument();

    console.error = originalError;
  });
});
