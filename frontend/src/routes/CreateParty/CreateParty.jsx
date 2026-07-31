// import partyFetch para montar a requisição personalizada
// de busca para o servidor de nossa API.
import partyFetch from "../../axios/config.js";
// import react hooks
import { useState, useEffect, useCallback } from "react";
// import o custom hook 'useNavigate' from react-router-dom
// para redirecionar os usuários, automaticamente, para uma
// página.
import { useNavigate } from "react-router-dom";
// import Custom Currency Format from Price Input:
import { CurrencyInput } from "react-currency-mask";
// import custom hook to Toastify components
import { toast } from "react-toastify";
// import CSS
import "./CreateParty.css";

const CreateParty = () => {
  const [services, setServices] = useState([]);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState(0);
  const [image, setImage] = useState("");
  const [partyServices, setPartyServices] = useState([]);
  const [displayUserBudget, setDisplayUserBudget] = useState(0);
  const [displayUserBudgetMessage, setDisplayUserBudgetMessage] = useState("");
  
  // Load services
  useEffect(() => {
    const loadServices = async () => {
      const response = await partyFetch.get("/services");
      setServices(response.data);
    };

    loadServices();
  }, []);

  const navigate = useNavigate();

  // funções auxiliares
  const Toast = (msg, status = null) => {
    if (!status) {
      toast.success(msg, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "light",
      });
    } else if (status === "error") {
      toast.error(msg, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        theme: "light",
      });
    }
  };

  // Converter em formato monetário
  const convertCurrency = (value) => {
    const updatedValue = parseFloat(value);
    updatedValue.toFixed(2);
    return updatedValue.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  // 1. Função de Lógica (Pura)
  // Separamos a lógica de cálculo da interface.
  const checkPartyBudget = (budget, services) => {
    // Soma os preços
    // função auxiliar para somar os valores dos serviços
    const priceSum = services.reduce((sum, service) => sum + service.price, 0);
    // Verifica se o orçamento é insuficiente
    if (priceSum > budget) {
      // Retornamos 0 como número, a formatação "R$" deve ser feita na tela
      return { isValid: false, value: 0 };
    }
    // Se passar, calcula o restante
    const remainingBudget = budget - priceSum;
    /**
     * 3. A lógica de soma/subtração está invertida (possivelmente)
      Se você está pasando a lista completa de serviços selecionados:

      Se o usuário adiciona um serviço → a lista cresce → o valor total aumenta → o orçamento diminui.
      Se o usuário remove um serviço → a lista diminui → o valor total diminui → o orçamento aumenta.
      Você não precisa fazer essa conta manualmente. É só recalcular com a lista atual.
     
      A lógica de "incrementar/decrementar" é automaticamente resolvida quando 
      você passa a lista atualizada de serviços para a função. 
      Se a lista cresce, o preço sobe. Se a lista dimiui, o preço cai
      */
    setDisplayUserBudgetMessage(""); 
    // reset da classe de saldo de orçamento negativo!
    return { isValid: true, value: remainingBudget };
  };

  // 2. Função de Ação (Handler)
  // Lida com o estado e a interação
  const handleCheckPartyBudget = useCallback(() => {
    // BUDGET < VALOR DOS SERVIÇOS
    // Validações iniciais
    if (!budget || budget === 0) return;
    if (!partyServices || partyServices.length === 0) return;
    // Executa a lógica APENAS uma vez e guarda o resultado
    const result = checkPartyBudget(budget, partyServices);

    if (!result.isValid) {
      // Orçamento insuficiente
      setDisplayUserBudgetMessage("O seu orçamento é insuficiente.");
      // Supondo que useToast seja uma função (não um hook) ou um hook ya memoizado
      // Se for um hook (ex: react-toastify), chame-o diretamente no corpo do componente
      // ou passe esta lógica para um useEffect. Aqui vou tratar como função simples para exemplo:
      return;
    }

    // Orçamento válido: Atualiza o estado com o valor calculado
    // Formata o número para Real (BRL) na própria hora de exibir
    const formattedValue = result.value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
    setDisplayUserBudget(formattedValue);
  }, [budget, partyServices]);

  // No useEffect (ouvindo mudanças na mensagem):
  useEffect(() => {
    if (displayUserBudgetMessage) {
      Toast(displayUserBudgetMessage, "error"); // Aqui você chama o toast
    }
  }, [displayUserBudgetMessage]);

  const handleDescriptionInput = (value) => {
    setDescription(value);
  };

  const handleBudgetInput = (value) => {
    if (isNaN(value)) return;
    setBudget(value);
  };
  // No useEffect (ouvindo mudanças na mensagem):
  useEffect(() => {
    if (isNaN(budget)) {
      Toast("Insira um valor monetário.", "error"); // Aqui você chama o toast
    }
  }, [budget]);

  const handleURLInput = (value) => {
    setImage(value);
  };

  // Add or remove services
  const handleServices = (e) => {
    const checked = e.target.checked;
    const value = e.target.value;
    const filteredService = services.filter((s) => s._id === value);
    if (checked) {
      setPartyServices((services) => [...services, filteredService[0]]);
    } else {
      setPartyServices((service) => service.filter((s) => s._id !== value));
    }
  };

  // useEffect que observa mudanças na lista de serviços
  useEffect(() => {
    // Se houver serviços, calcula. Se não, zera ou limpa.
    if (partyServices.length > 0) {
      handleCheckPartyBudget();
    } else {
      setDisplayUserBudget(
        budget.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
      );
      setDisplayUserBudgetMessage("");
    }
  }, [budget, partyServices, handleCheckPartyBudget]); // Executa sempre que partyServices mudar

  // Create a new party
  const createParty = async (e) => {
    e.preventDefault();
    // 1. Validação do Orçamento
    const budgetCheck = checkPartyBudget(budget, partyServices);

    if (!budgetCheck.isValid) {
      Toast(
        "O seu orçamento é insuficiente para os serviços selecionados.",
        "error",
      );
      return; // Para aqui e não envia para API
    }

    // 2. Se passou na validação, cria a festa
    try {
      const party = {
        title,
        author,
        description,
        budget,
        image,
        services: partyServices,
      };
      const response = await partyFetch.post("/parties", party);

      if (response.status === 201) {
        Toast("Festa criada com sucesso!", "success");
        navigate("/");
      }
      if (response.status === 406) {
        Toast(
          "O seu orçamento é insuficiente para os serviços selecionados",
          "error",
        );
        console.error(`ERROR do servidor: ${response.data.msg}`);
        return;
      }
    } catch (error) {
      Toast("Erro ao criar a festa. Tente novamente.", "error");
      console.error(`ERROR: ${error}`);
    }
  };

  return (
    <div className="form-page">
      <h2>Crie sua próxima Festa</h2>
      <p>Defina o seu orçamento e escolha os serviços</p>
      <form onSubmit={(e) => createParty(e)}>
        <h2>Formulário</h2>
        <label htmlFor="title">
          <span>Nome da festa:</span>
          <input
            type="text"
            name="title"
            id="title"
            placeholder="Seja criativo..."
            required
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />
        </label>
        <label htmlFor="author">
          <span>Anfitrião:</span>
          <input
            type="text"
            name="author"
            id="author"
            placeholder="Quem recepcionará a festa?"
            required
            onChange={(e) => setAuthor(e.target.value)}
            value={author}
          />
        </label>
        <label htmlFor="description">
          <span>Descrição:</span>
          <textarea
            name="description"
            id="description"
            placeholder="Conte mais sobre a festa..."
            required
            onChange={(e) => handleDescriptionInput(e.target.value)}
            value={description}
          ></textarea>
        </label>
        <label htmlFor="price">
          <span>Orçamento:</span>
          <CurrencyInput
            name="price"
            id="price"
            placeholder="Quanto você pretende investir? R$..."
            required
            onChangeValue={(event, originalValue, maskedValue) => {
              handleBudgetInput(parseFloat(originalValue));
              setDisplayUserBudget(maskedValue);
            }}
            value={budget}
          />
        </label>
        <label htmlFor="image">
          <span>Imagem:</span>
          <input
            type="url"
            name="image"
            id="image"
            placeholder="Insira a URL da imagem aqui"
            required
            onChange={(e) => handleURLInput(e.target.value)}
            value={image}
          />
        </label>
        <h2>Escolha os serviços</h2>
        <div
          className={`UserBudget ${displayUserBudgetMessage !== "" ? "negative" : ""}`}
        >
          <small>Seu orçamento é R$</small>
          <h3>{displayUserBudget}</h3>
          {displayUserBudgetMessage && <p>{displayUserBudgetMessage}</p>}
        </div>
        <div className="services-container">
          {!services && <p className="NoData">Não há serviços no momento.</p>}
          {services.length === 0 && <p className="loading">Carregando...</p>}
          {services.length > 0 &&
            services.map((service) => (
              <div className="service" key={service._id}>
                <img src={service.image} alt={service.name} />
                <p className="service-name">{service.name}</p>
                <p className="service-price">
                  R${convertCurrency(service.price)}
                </p>
                <div className="checkbox-container">
                  <input
                    type="checkbox"
                    value={service._id}
                    onChange={(e) => handleServices(e)}
                  />
                  <p>Marque para solicitar</p>
                </div>
              </div>
            ))}
        </div>
        <input type="submit" value="Criar Festa" className="btn" />
      </form>
    </div>
  );
};

export default CreateParty;
