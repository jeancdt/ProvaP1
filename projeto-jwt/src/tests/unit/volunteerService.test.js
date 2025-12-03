const VolunteerService = require("../../services/volunteerService");
const VolunteerModel = require("../../models/volunteerModel");

jest.mock("../../models/volunteerModel");

/**
 * Testes Unitários - VolunteerService
 */
describe("VolunteerService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Busca
  describe("getVolunteerById", () => {
    /**
     * Sucesso: Buscar voluntário por ID
     * Importante: Ter o usuário criado
     */
    test("Buscar voluntário por ID", async () => {
      const mockVolunteer = {
        id: 1,
        name: "João Silva",
        phone: "(54) 99999-9999",
        email: "joao@email.com",
      };

      VolunteerModel.findById.mockResolvedValue(mockVolunteer);

      const result = await VolunteerService.getVolunteerById(1);

      expect(VolunteerModel.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockVolunteer);
    });

    /**
     * Erro: Voluntário não encontrado
     */
    test("Realizar erro de voluntário não encontrado", async () => {
      VolunteerModel.findById.mockResolvedValue(null);

      await expect(VolunteerService.getVolunteerById(999)).rejects.toThrow("Voluntário não encontrado");
      expect(VolunteerModel.findById).toHaveBeenCalledWith(999);
    });
  });

  // Criação
  describe("createVolunteer", () => {
    /**
     * Sucesso: Criar voluntário
     */
    test("Realizar criação de voluntário", async () => {
      const volunteerData = {
        name: "Maria Santos",
        phone: "(54) 98888-8888",
        email: "maria@email.com",
      };

      const mockCreatedVolunteer = {
        id: 2,
        ...volunteerData,
      };

      VolunteerModel.create.mockResolvedValue(mockCreatedVolunteer);

      const result = await VolunteerService.createVolunteer(volunteerData);

      expect(VolunteerModel.create).toHaveBeenCalledWith(volunteerData);
      expect(result).toEqual(mockCreatedVolunteer);
      expect(result.id).toBe(2);
    });

    /**
     * Sucesso: Criar voluntário sem email (opcional)
     */
    test("Realizar criação de voluntário sem email", async () => {
      const volunteerData = {
        name: "Pedro Oliveira",
        phone: "(54) 97777-7777",
      };

      const mockCreatedVolunteer = {
        id: 3,
        ...volunteerData,
        email: null,
      };

      VolunteerModel.create.mockResolvedValue(mockCreatedVolunteer);

      const result = await VolunteerService.createVolunteer(volunteerData);

      expect(VolunteerModel.create).toHaveBeenCalledWith(volunteerData);
      expect(result.email).toBeNull();
    });
  });

  // Atualização
  describe("updateVolunteer", () => {
    /**
     * Sucesso: Atualizar voluntário
     */
    test("Realizar atualização de voluntário", async () => {
      const volunteerData = {
        name: "João Silva Atualizado",
        phone: "(54) 99999-0000",
        email: "joao.novo@email.com",
      };

      VolunteerModel.update.mockResolvedValue(true);

      const result = await VolunteerService.updateVolunteer(1, volunteerData);

      expect(VolunteerModel.update).toHaveBeenCalledWith(1, volunteerData);
      expect(result).toEqual({ id: 1, ...volunteerData });
    });

    /**
     * Erro: Atualizar voluntário inexistente
     */
    test("Realizar erro de atualização de voluntário inexistente", async () => {
      const volunteerData = {
        name: "Teste",
        phone: "(54) 99999-9999",
      };

      VolunteerModel.update.mockResolvedValue(false);

      await expect(VolunteerService.updateVolunteer(999, volunteerData)).rejects.toThrow("Voluntário não encontrado");
      expect(VolunteerModel.update).toHaveBeenCalledWith(999, volunteerData);
    });
  });

  // Exclusão
  describe("deleteVolunteer", () => {
    /**
     * Sucesso: Excluir voluntário
     */
    test("Realizar exclusão de voluntário", async () => {
      VolunteerModel.delete.mockResolvedValue(true);

      const result = await VolunteerService.deleteVolunteer(1);

      expect(VolunteerModel.delete).toHaveBeenCalledWith(1);
      expect(result).toEqual({ message: "Voluntário excluído com sucesso" });
    });

    /**
     * Erro: Excluir voluntário inexistente
     */
    test("Realizar erro de exclusão de voluntário inexistente", async () => {
      VolunteerModel.delete.mockResolvedValue(false);

      await expect(VolunteerService.deleteVolunteer(999)).rejects.toThrow("Voluntário não encontrado");
      expect(VolunteerModel.delete).toHaveBeenCalledWith(999);
    });
  });

  // Listagem
  describe("listVolunteers", () => {
    /**
     * Sucesso: Listar todos os voluntários
     */
    test("Realizar listagem de voluntários", async () => {
      const mockVolunteers = [
        { id: 1, name: "João Silva", phone: "(54) 99999-9999" },
        { id: 2, name: "Maria Santos", phone: "(54) 98888-8888" },
      ];

      VolunteerModel.findAll.mockResolvedValue(mockVolunteers);

      const result = await VolunteerService.listVolunteers();

      expect(VolunteerModel.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockVolunteers);
      expect(result).toHaveLength(2);
    });
  });
});
