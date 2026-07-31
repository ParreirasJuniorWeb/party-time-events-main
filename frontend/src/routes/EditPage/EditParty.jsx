import partyFetch from "../../axios/config.js";
import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CurrencyInput } from "react-currency-mask";
import { toast } from "react-toastify";
import "../CreateParty/CreateParty.css";
import "./EditParty.css";

const EditParty = () => {
  const [party, setParty] = useState(null);
  const [services, setServices] = useState([]);
  const [displayUserBudget, setDisplayUserBudget] = useState(0);
  const [displayUserBudgetMessage, setDisplayUserBudgetMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // useNavigate deve ser chamado no topo, antes de qualquer retorno condicional
  const navigate = useNavigate();
  const { id } = useParams();

  // Função auxiliar para toasts
  const Toast = (msg, status = null) => {
    if (!status) {
      toast.success(msg, { position: "top-right", autoClose: 3000 });
    } else if (status === "error") {
      toast.error(msg, { position: "top-right", autoClose: 3000 });
    }
  };

  // 1. Carregar Serviços
  useEffect(() => {
    const loadServices = async () => {
      try {
        const response = await partyFetch.get("/services");
        setServices(response.data);
      } catch (error) {
        console.log(`ERROR: ${error}`);
      }
    };
    loadServices();
  }, []);

  // 2. Carregar Dados da Festa
  useEffect(() => {
    const loadParty = async () => {
      try {
        const response = await partyFetch.get(`/parties/${id}`);
        setParty(response.data);
      } catch (error) {
        console.log(`ERROR: ${error}`);
        Toast("Erro ao carregar dados da festa", "error");
      } finally {
        setIsLoading(false);
      }
    };
    loadParty();
  }, [id]);

  // Variáveis derivadas com verificação de null
  const partyServices = party?.services || [];
  const budget = party?.budget || 0;

  // Converter em formato monetário
  const convertCurrency = (value) => {
    const cleanValue = parseFloat(value);
    if (isNaN(cleanValue)) return "R$ 0,00";
    return cleanValue.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  // Função de lógica
  const checkPartyBudget = (currentBudget, currentServices) => {
    if (!currentServices || currentServices.length === 0) {
      return { isValid: true, value: currentBudget };
    }

    const priceSum = currentServices.reduce((sum, service) => sum + service.price, 0);

    if (priceSum > currentBudget) {
      return { isValid: false, value: 0 };
    }

    const remainingBudget = currentBudget - priceSum;
    return { isValid: true, value: remainingBudget };
  };

  // Função de ação
  const handleCheckPartyBudget = useCallback(() => {
    if (!budget || budget === 0) return;
    if (!partyServices || partyServices.length === 0) return;

    const result = checkPartyBudget(budget, partyServices);

    if (!result.isValid) {
      setDisplayUserBudgetMessage("O seu orçamento é insuficiente.");
      return;
    }

    setDisplayUserBudgetMessage("");
    const formattedValue = result.value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
    setDisplayUserBudget(formattedValue);
  }, [budget, partyServices]);

  // Escuta mudanças no orçamento ou serviços para recalcular
  useEffect(() => {
    if (displayUserBudgetMessage) {
      Toast(displayUserBudgetMessage, "error");
    }
  }, [displayUserBudgetMessage]);

  useEffect(() => {
    if (!party) return;
    
    if (partyServices.length > 0) {
      handleCheckPartyBudget();
    } else {
      setDisplayUserBudget(
        budget.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
      );
      setDisplayUserBudgetMessage("");
    }
  }, [party, partyServices, budget, handleCheckPartyBudget]);

  // Handlers de Input
  const handleDescriptionInput = (value) => {
    if (!party) return;
    setParty({ ...party, description: value });
  };

  const handleBudgetInput = (value) => {
    if (isNaN(value)) return;
    if (!party) return;
    setParty({ ...party, budget: value });
  };

  const handleURLInput = (value) => {
    if (!party) return;
    setParty({ ...party, image: value });
  };

  // Add or remove services
  const handleServices = (e) => {
    if (!party) return;
    
    const checked = e.target.checked;
    const value = e.target.value;
    const filteredService = services.filter((s) => s._id === value);
    
    if (!filteredService || filteredService.length === 0) return;
    
    let updatedServices = [...partyServices];
    if (checked) {
      updatedServices = [...updatedServices, filteredService[0]];
    } else {
      updatedServices = updatedServices.filter((s) => s._id !== value);
    }

    setParty({ ...party, services: updatedServices });
  };

  // Update party
  const updateParty = async (e) => {
    e.preventDefault();
    
    if (!party) return;

    // Validação do Orçamento
    const budgetCheck = checkPartyBudget(budget, partyServices);

    if (!budgetCheck.isValid) {
      Toast(
        "O seu orçamento é insuficiente para os serviços selecionados.",
        "error",
      );
      return;
    }

    try {
      const response = await partyFetch.put(`/parties/${party._id}`, party);

      if (response.status === 200) {
        Toast("Festa editada com sucesso!", "success");
        navigate(`/party/${party._id}`);
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
      Toast("Erro ao editar a festa. Tente novamente.", "error");
      console.error(`ERROR: ${error.response?.data?.msg || error.message}`);
    }
  };

  // Verificação de carregamento CORRETA
  if (isLoading || !party) {
    return <p className="loading">Carregando...</p>;
  }

  return (
    <div className="form-page">
      <h2>Editando: {party.title}</h2>
      <p>Ajuste as informações da sua festa</p>
      <form onSubmit={(e) => updateParty(e)} className="edit-form">
        <h2>Formulário</h2>
        <label htmlFor="title">
          <span>Nome da festa:</span>
          <input
            type="text"
            name="title"
            id="title"
            placeholder="Seja criativo..."
            required
            onChange={(e) => setParty({ ...party, title: e.target.value })}
            value={party.title || ""}
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
            onChange={(e) => setParty({ ...party, author: e.target.value })}
            value={party.author || ""}
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
            value={party.description || ""}
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
            value={party.budget || 0}
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
            value={party.image || ""}
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
          {services.length === 0 && (
            <p className="NoData">Não há serviços no momento.</p>
          )}
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
                    checked={
                      partyServices.some(
                        (partyService) => partyService._id === service._id,
                      ) || false
                    }
                  />
                  <p>Marque para solicitar</p>
                </div>
              </div>
            ))}
        </div>
        <input type="submit" value="Atualizar Festa" className="btn" />
      </form>
    </div>
  );
};

export default EditParty;
