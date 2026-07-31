import request from "supertest";
import app from "../server.js";

describe("Parties API", () => {
  it("POST /api/parties should return 406 when budget is insufficient", async () => {
    const res = await request(app)
      .post("/api/parties")
      .send({
        title: "Festa Premium",
        author: "João",
        description: "Evento grande",
        budget: 1000,
        image: "https://example.com/party.jpg",
        services: [
          {
            name: "Som",
            description: "Sistema de som",
            price: 1500,
            image: "https://example.com/som.jpg",
          },
        ],
      });

    expect(res.statusCode).toBe(406);
    expect(res.body.msg).toMatch(/orçamento insuficiente/i);
  });

  it("POST /api/parties should create a party when budget is valid", async () => {
    const res = await request(app)
      .post("/api/parties")
      .send({
        title: "Festa Simples",
        author: "Maria",
        description: "Evento pequeno",
        budget: 3000,
        image: "https://example.com/party2.jpg",
        services: [
          {
            name: "Decoração",
            description: "Balões e mesa",
            price: 800,
            image: "https://example.com/decor.jpg",
          },
        ],
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("response");
    expect(res.body.response.title).toBe("Festa Simples");
  });

  it("GET /api/parties/:id should return 404 for non existing id", async () => {
    const nonExistingId = "507f1f77bcf86cd799439011";
    const res = await request(app).get(`/api/parties/${nonExistingId}`);

    expect(res.statusCode).toBe(404);
  });

  it("GET /api/parties/:id should return created party", async () => {
    const createRes = await request(app).post("/api/parties").send({
      title: "Festa Retorno",
      author: "Carlos",
      description: "Teste de busca",
      budget: 2500,
      image: "https://example.com/party3.jpg",
      services: [],
    });

    const id = createRes.body.response._id;

    const getRes = await request(app).get(`/api/parties/${id}`);

    expect(getRes.statusCode).toBe(200);
    expect(getRes.body._id).toBe(id);
  });

  it("PUT /api/parties/:id should update party data", async () => {
    const createRes = await request(app).post("/api/parties").send({
      title: "Festa Inicial",
      author: "Ana",
      description: "Descrição inicial",
      budget: 4000,
      image: "https://example.com/party4.jpg",
      services: [],
    });

    const id = createRes.body.response._id;

    const updateRes = await request(app).put(`/api/parties/${id}`).send({
      title: "Festa Atualizada",
      author: "Ana",
      description: "Descrição atualizada",
      budget: 4000,
      image: "https://example.com/party4.jpg",
      services: [],
    });

    expect(updateRes.statusCode).toBe(200);
    expect(updateRes.body).toHaveProperty("updatedParty");
  });
});
