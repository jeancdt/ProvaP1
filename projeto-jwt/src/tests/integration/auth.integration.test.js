const request = require("supertest");
const app = require("../../app");

/**
 * Testes Integração - Rota de Autenticação - POST /auth/login
 */
describe("POST /auth/login - Integração", () => {
  /**
   * Sucesso: Login com credenciais válidas
   * Importante: Ter pelo menos um usuário criado
   */
  test("Fazer login e retornar token", async () => {
    const credentials = {
      email: "usuario@ifrs.edu.br",
      password: "senha123",
    };

    const response = await request(app)
      .post("/auth/login")
      .send(credentials)
      .expect("Content-Type", /json/)
      .expect(200);

    expect(response.body).toHaveProperty("token");
    expect(response.body).toHaveProperty("user");
    expect(response.body.user.email).toBe("usuario@ifrs.edu.br");
    expect(response.body.user.role).toBeDefined();
  });

  /**
   * Erro: Credenciais inválidas
   */
  test("Retornar erro 401 (senha inválida)", async () => {
    const credentials = {
      email: "usuario@ifrs.edu.br",
      password: "senhaerrada",
    };
    const response = await request(app)
      .post("/auth/login")
      .send(credentials)
      .expect("Content-Type", /json/)
      .expect(401);

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("Senha inválida");
  });

  /**
   * Erro: Usuário não existe
   */
  test("Retornar erro 401 (usuário não encontrado)", async () => {
    const credentials = {
      email: "naoexiste@ifrs.edu.br",
      password: "senha123",
    };

    const response = await request(app)
      .post("/auth/login")
      .send(credentials)
      .expect("Content-Type", /json/)
      .expect(401);

    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("Usuário não encontrado");
  });
});
