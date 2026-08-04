// import partyFetch - instância global e customizada do Axios
import partyFetch from "../../axios/config.js";
// import react hooks
import React, { useState, useEffect } from "react";
// import Link component from react-router-dom
import { Link } from "react-router-dom";
// import CSS
import "./Home.css";

const Home = () => {
  const [parties, setParties] = useState(null);

  // load parties
  useEffect(() => {
    const loadParties = async () => {
      const res = await partyFetch.get("parties");
      setParties(res.data);
    };

    loadParties();
  }, []);

  return (
    <div className="home">
      <h1>Suas Festas</h1>
      {!parties && <p className="loading">Carregando...</p>}
      {parties && parties.length === 0 && <p className="NoData">Não há festas cadastradas!</p>}
      <div className="parties-container">
        {parties && parties.map((party) => (
          <div className="party" key={party._id}>
            <img src={party.image} alt={party.title} />
            <h2>{party.title}</h2>
            <Link to={`/party/${party._id}`} className="btn-secondary">
              Detalhes
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
