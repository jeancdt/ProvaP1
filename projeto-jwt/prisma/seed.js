const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Começando seed...");

  // Limpar dados existentes
  await prisma.eventVolunteer.deleteMany();
  await prisma.event.deleteMany();
  await prisma.volunteer.deleteMany();
  await prisma.user.deleteMany();

  console.log("Dados existentes limpos");

  // Criar usuários
  const hashedPasswordUser = await bcrypt.hash("senha123", 10);
  const hashedPasswordAdmin = await bcrypt.hash("admin123", 10);

  const user = await prisma.user.create({
    data: {
      email: "usuario@ifrs.edu.br",
      password: hashedPasswordUser,
      role: "user",
    },
  });

  const admin = await prisma.user.create({
    data: {
      email: "admin@ifrs.edu.br",
      password: hashedPasswordAdmin,
      role: "admin",
    },
  });

  console.log("Usuários criados");

  // Criar eventos
  const event1 = await prisma.event.create({
    data: {
      title: "Evento 1",
      description: "Desc Evento 1",
      location: "Local Evento 1",
      start_date: new Date("2025-10-10T09:00:00"),
      end_date: new Date("2025-10-10T17:00:00"),
    },
  });

  const event2 = await prisma.event.create({
    data: {
      title: "Evento 2",
      description: "Desc Evento 2",
      location: "Local Evento 2",
      start_date: new Date("2025-10-10T09:00:00"),
      end_date: new Date("2025-10-10T17:00:00"),
    },
  });

  const event3 = await prisma.event.create({
    data: {
      title: "Evento 3",
      description: "Desc Evento 3",
      location: "Local Evento 3",
      start_date: new Date("2025-10-10T09:00:00"),
      end_date: new Date("2025-10-10T17:00:00"),
    },
  });

  console.log("Eventos criados");

  // Criar voluntários
  const volunteer1 = await prisma.volunteer.create({
    data: {
      name: "Voluntario 1",
      phone: "(54) 99999-9991",
      email: "vol1@email.com",
    },
  });

  const volunteer2 = await prisma.volunteer.create({
    data: {
      name: "Voluntario 2",
      phone: "(54) 99999-9992",
      email: "vol2@email.com",
    },
  });

  const volunteer3 = await prisma.volunteer.create({
    data: {
      name: "Voluntario 3",
      phone: "(54) 99999-9993",
      email: null,
    },
  });

  const volunteer4 = await prisma.volunteer.create({
    data: {
      name: "Voluntario 4",
      phone: "(54) 99999-9994",
      email: "vol4@email.com",
    },
  });

  const volunteer5 = await prisma.volunteer.create({
    data: {
      name: "Voluntario 5",
      phone: "(54) 99999-9995",
      email: null,
    },
  });

  console.log("Voluntários criados");

  // Criar associações entre eventos e voluntários
  await prisma.eventVolunteer.createMany({
    data: [
      { event_id: event1.id, volunteer_id: volunteer1.id },
      { event_id: event1.id, volunteer_id: volunteer2.id },
      { event_id: event1.id, volunteer_id: volunteer3.id },
      { event_id: event2.id, volunteer_id: volunteer2.id },
      { event_id: event2.id, volunteer_id: volunteer4.id },
      { event_id: event3.id, volunteer_id: volunteer1.id },
      { event_id: event3.id, volunteer_id: volunteer5.id },
    ],
  });

  console.log("Associações entre eventos e voluntários criadas");
  console.log("Seed concluído com sucesso!");
}

main()
  .catch((e) => {
    console.error("Erro na seed: ", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
