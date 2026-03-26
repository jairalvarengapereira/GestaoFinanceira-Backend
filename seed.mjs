import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

  // Clear existing
  await prisma.transacao.deleteMany();
  await prisma.categoria.deleteMany();

  // Create Categories (using lowercase to match frontend expectations)
  const catSalario = await prisma.categoria.create({
    data: { userId: user.id, nome: 'Salário', icone: 'dollar-sign', tipo: 'receita' }
  });

  const catAluguel = await prisma.categoria.create({
    data: { userId: user.id, nome: 'Aluguel', icone: 'home', tipo: 'despesa' }
  });

  // Create Transactions
  await prisma.transacao.create({
    data: {
      userId: user.id,
      categoriaId: catSalario.id,
      valor: 5000,
      descricao: 'Salário de Março',
      data: new Date(),
      tipo: 'receita',
      status: 'pago'
    }
  });

  await prisma.transacao.create({
    data: {
      userId: user.id,
      categoriaId: catAluguel.id,
      valor: 1500,
      descricao: 'Aluguel do Mês',
      data: new Date(),
      tipo: 'despesa',
      status: 'pago'
    }
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
