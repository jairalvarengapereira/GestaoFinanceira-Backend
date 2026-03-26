import { PrismaClient } from './src/generated/client';

const prisma = new PrismaClient({});

async function main() {
  // Create User
  const user = await prisma.usuario.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      nome: 'Usuário Teste',
      email: 'user@example.com',
      senhaHash: 'hashed_password',
    },
  });

  // Create Categories (Check if they exist first or delete all)
  await prisma.categoria.deleteMany();
  await prisma.transacao.deleteMany();

  const catSalario = await prisma.categoria.create({
    data: { userId: user.id, nome: 'Salário', icone: 'dollar-sign', tipo: 'RECEITA' }
  });

  const catAluguel = await prisma.categoria.create({
    data: { userId: user.id, nome: 'Aluguel', icone: 'home', tipo: 'DESPESA' }
  });

  // Create Transactions
  await prisma.transacao.createMany({
    data: [
      {
        userId: user.id,
        categoriaId: catSalario.id,
        valor: 5000,
        descricao: 'Salário de Março',
        data: new Date(),
        tipo: 'RECEITA',
        status: 'PAGO'
      },
      {
        userId: user.id,
        categoriaId: catAluguel.id,
        valor: 1500,
        descricao: 'Aluguel do Mês',
        data: new Date(),
        tipo: 'DESPESA',
        status: 'PAGO'
      }
    ]
  });

  console.log('Seed completed successfully!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
