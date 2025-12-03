const UserService = require("../../services/userService");
const UserModel = require("../../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

jest.mock("../../models/userModel");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

/**
 * Testes Unitários - UserService
 */
describe("UserService - loginUser", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Sucesso: Login com credenciais válidas
   */
  test("Realizar login", async () => {
    const mockUser = {
      id: 1,
      email: "teste@ifrs.edu.br",
      password: "$2a$10$hashedpassword",
      role: "user",
    };

    const credentials = {
      email: "teste@ifrs.edu.br",
      password: "senha123",
    };

    const mockToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock.token";

    // Config mocks
    UserModel.findByEmail.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue(mockToken);

    const result = await UserService.loginUser(credentials);

    expect(UserModel.findByEmail).toHaveBeenCalledWith("teste@ifrs.edu.br");
    expect(bcrypt.compare).toHaveBeenCalledWith("senha123", "$2a$10$hashedpassword");
    expect(jwt.sign).toHaveBeenCalled();
    expect(result).toEqual({
      token: mockToken,
      user: {
        email: "teste@ifrs.edu.br",
        role: "user",
      },
    });
  });

  /**
   * Erro: Usuário não encontrado
   */
  test("Realizar erro de usuário não encontrado", async () => {
    const credentials = {
      email: "naoexiste@ifrs.edu.br",
      password: "senha123",
    };

    UserModel.findByEmail.mockResolvedValue(null);

    await expect(UserService.loginUser(credentials)).rejects.toThrow("Usuário não encontrado");
    expect(UserModel.findByEmail).toHaveBeenCalledWith("naoexiste@ifrs.edu.br");
    expect(bcrypt.compare).not.toHaveBeenCalled();
  });

  /**
   * Erro: Senha inválida
   */
  test("Realizar erro de senha inválida", async () => {
    const mockUser = {
      id: 1,
      email: "teste@ifrs.edu.br",
      password: "$2a$10$hashedpassword",
      role: "user",
    };

    const credentials = {
      email: "teste@ifrs.edu.br",
      password: "senhaerrada",
    };

    UserModel.findByEmail.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(false);

    await expect(UserService.loginUser(credentials)).rejects.toThrow("Senha inválida");
    expect(UserModel.findByEmail).toHaveBeenCalledWith("teste@ifrs.edu.br");
    expect(bcrypt.compare).toHaveBeenCalledWith("senhaerrada", "$2a$10$hashedpassword");
    expect(jwt.sign).not.toHaveBeenCalled();
  });
});
