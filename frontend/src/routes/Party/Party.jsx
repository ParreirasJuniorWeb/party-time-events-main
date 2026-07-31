// import custom hook - instance of Axios
import partyFetch from "../../axios/config.js";
// import react hooks
import { useState, useEffect } from "react";
// import react-router-dom components
import {useParams, Link, useNavigate } from "react-router-dom";
// import custom hook to Toastify components
import { toast } from "react-toastify";
// import CSS
import "./Party.css";

const Party = () => {

  const { id } = useParams();

  const [party, setParty] = useState(null);

  const navigate = useNavigate();

  // Funções auxiliares
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

  // load party
  useEffect(() => {
    const loadParty = async() => {
      try {
        const response = await partyFetch.get(`/parties/${id}`);
        if(response.status === 200) {
          setParty(response.data);
        } else {
          throw new Error(`ERROR: ${response.data.msg}`);
        }
      } catch(error) {
        console.log(`ERROR: ${error}`);
        throw new Error(`ERROR: ${error.message}`);
      }
    };
    loadParty();
  }, [id]);

  // Delete this party
  const handleDelete = async () => {
    const response = await partyFetch.delete(`/parties/${id}`);
    try {
      if(response.status === 200) {
        Toast(response.data.msg, "success");
        navigate("/");
      } else {
        Toast("Falha ao excluir festa.", "error");
        return;
      };
    } catch (error) {
      console.error(`ERROR: ${error}`);
    }
  };

  if(party === null) return <p className="loading">Carregando...</p>

  return (
    <div className="party">
      <h1>{party.title}</h1>
      <h2>{party.description}</h2>
      <div className="actions-container">
        <Link className="btn" to={`/party/edit/${party._id}`}>Editar</Link>
        <button onClick={handleDelete} className="btn-secondary">Excluir</button>
      </div>
      <p>Orçamento da Festa: R${party.budget}</p>
      <img src={party.image} alt={party.image} />
      <h3>Serviços contratados:</h3>
      <div className="services-container">
        {party.services.length === 0 && <h3 className="NoData">Sem serviços cadastrados na sua festa.</h3>}
        {party.services.map((service) => (
          <div className="service" key={service._id}>
            <img src={service.image} alt={service.name} />
            <p>{service.name}</p>
            <p>{service.description}</p>
            <p>R${service.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Party;