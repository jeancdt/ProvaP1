const request = require("supertest");
const app = require("../../app");

// Testes Integração - Rota Pública - GET Eventos
describe("GET /events - Integração", () => {
  // Sucesso: Listar todos os eventos
  test("Retorna lista de eventos com sucesso", async () => {
    const response = await request(app).get("/events").expect("Content-Type", /json/).expect(200);

    expect(response.body).toBeDefined();
    expect(Array.isArray(response.body)).toBe(true);

    if (response.body.length > 0) {
      const evento = response.body[0];
      expect(evento).toHaveProperty("id");
      expect(evento).toHaveProperty("title");
      expect(evento).toHaveProperty("description");
      expect(evento).toHaveProperty("location");
      expect(evento).toHaveProperty("start_date");
      expect(evento).toHaveProperty("end_date");
    }
  });

  // Sucesso: Buscar evento por ID
  test("Retorna evento específico por ID", async () => {
    const listResponse = await request(app).get("/events");

    if (listResponse.body.length > 0) {
      const primeiroEvento = listResponse.body[0];

      const response = await request(app)
        .get(`/events/${primeiroEvento.id}`)
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body).toHaveProperty("id", primeiroEvento.id);
      expect(response.body).toHaveProperty("title");
      expect(response.body).toHaveProperty("description");
    }
  });

  // Erro: Evento não encontrado
  test("Retorna erro 404 quando evento não existe", async () => {
    const idInexistente = 99999;

    const response = await request(app).get(`/events/${idInexistente}`).expect("Content-Type", /json/).expect(404);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("Erro ao buscar evento");
  });
});
