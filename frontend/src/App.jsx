// import Outlet component from react-router-dom 
// para exibição das páginas (componentes filhos) na 'App.jsx'
import { Outlet } from 'react-router-dom';
// import components
import Navbar from "./components/Navbar/Navbar";
// import Toastify components
import { ToastContainer } from 'react-toastify';
// import CSS
import './App.css'
import "react-toastify/ReactToastify.css";
// ErrorBoundary Component
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';

function App() {
  return (
    <>
      <div className='App'>
        <ErrorBoundary
            fallbackProps={{
              errorTitle: 'Erro personalizado',
              errorMessage: 'Algo deu errado na aplicação',
              showRetry: true
            }}
            onError={(error, errorInfo) => {
              // Enviar para serviço de error tracking (Sentry, etc)
              console.error(error, errorInfo);
            }}
        >
          <ToastContainer />
          <header>
            <Navbar />
          </header>
          <main>
            <Outlet />
          </main>
          <footer>
            <p>All rights reserved for John Victor Parreiras and Mattheus Battisti&copy;.</p>
          </footer>
        </ErrorBoundary>  
      </div>
    </>
  )
}

export default App;