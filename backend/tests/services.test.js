import request from "supertest";
import app from "../server.js";

describe("Services API", () => {
  it("POST /api/services should create a service", async () => {
    const payload = {
      name: "DJ",
      description: "Música ao vivo",
      price: 1200,
      image: "https://example.com/dj.jpg",
    };

    const res = await request(app).post("/api/services").send(payload);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("response");
    expect(res.body.response.name).toBe(payload.name);
  });

  it("GET /api/services should list services", async () => {
    await request(app).post("/api/services").send({
      name: "Buffet",
      description: "Comidas e bebidas",
      price: 2000,
      image: "https://example.com/buffet.jpg",
    });

    const res = await request(app).get("/api/services");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });
});
