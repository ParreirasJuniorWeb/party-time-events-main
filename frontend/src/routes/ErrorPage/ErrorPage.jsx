import { useRouteError } from "react-router-dom";
import "./ErrorPage.css";
const ErrorPage = () => {
  const error = useRouteError();

  console.log(error);

  return (
    <div id="error-container">
      <h1>Ops!</h1>
      <p>Temos um problema na execução da aplicação.</p>
      <p>{error.statusText}</p>
      <p>Código HTTP:</p>
      <p id="status">{error.status}</p>
      <p id="status-msg">{error.error.message}</p>
    </div>
  );
};

export default ErrorPage;
