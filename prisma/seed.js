// prisma/seed.js

import bcrypt from 'bcrypt';
import { prisma } from './prisma.js';

async function seed() {
  console.log('🗑 Очистка базы...');

  await prisma.$executeRawUnsafe(`
    TRUNCATE TABLE
      reviews,
      order_documents,
      orders,
      carts,
      favorites,
      tickets,
      promotions,
      users
    RESTART IDENTITY CASCADE;
  `);

  console.log('✅ База очищена');

  // ================= USERS =================

  const passwordHash = await bcrypt.hash('123456', 10);

  await prisma.user.createMany({
    data: Array.from({ length: 70 }, (_, i) => ({
      email: `user${i + 1}@mail.ru`,
      firstName: `Пользователь${i + 1}`,
      lastName: `Тестовый${i + 1}`,
      password: passwordHash,
    })),
  });

  const users = await prisma.user.findMany({
    orderBy: { id: 'asc' },
  });

  console.log(`✅ Users: ${users.length}`);

  // ================= PROMOTIONS =================

  await prisma.promotion.createMany({
    data: Array.from({ length: 60 }, (_, i) => ({
      title: `Акция №${i + 1}`,
      description: `Специальное предложение по акции №${i + 1}`,
      discount: [5, 10, 15, 20, 25, 30][i % 6],
    })),
  });

  const promotions = await prisma.promotion.findMany({
    orderBy: { id: 'asc' },
  });

  console.log(`✅ Promotions: ${promotions.length}`);

  // ================= TICKETS =================

  const eventTitles = [
    'Гамлет',
    'Ревизор',
    'Щелкунчик',
    'Лебединое озеро',
    'Вишневый сад',
    'Мастер и Маргарита',
    'Анна Каренина',
    'Призрак оперы',
    'Кармен',
    'Евгений Онегин',
    'Фауст',
    'Дон Кихот',
    'Ромео и Джульетта',
    'Отелло',
    'Макбет',
    'Король Лир',
    'Три сестры',
    'Чайка',
    'Дядя Ваня',
    'Идиот',
    'Преступление и наказание',
    'Белая гвардия',
    'Пиковая дама',
    'Руслан и Людмила',
    'Жизель',
    'Спящая красавица',
    'Золушка',
    'Снежная королева',
    'Алые паруса',
    'Юнона и Авось',
    'Notre Dame de Paris',
    'Cats',
    'Chicago',
    'Mamma Mia',
    'Les Miserables',
    'Queen Symphony',
    'Rock Legends',
    'Вечер джаза',
    'Симфония кино',
    'Оркестр при свечах',
    'Времена года',
    'Музыка Ханса Циммера',
    'Музыка Людовико Эйнауди',
    'Саундтреки Голливуда',
    'Классика в парке',
    'Балет Гала',
    'Опера Гала',
    'Ночь музыки',
    'День театра',
    'Шоу барабанщиков',
    'Танцы народов мира',
    'Современный балет',
    'Фестиваль оперы',
    'Фестиваль джаза',
    'Фестиваль классики',
    'Камерный вечер',
    'Симфонический концерт',
    'Рок симфония',
    'Вечер романса',
    'Музыкальный салон',
    'Планета танца',
    'Сказки Пушкина',
    'Легенды Бродвея',
    'Венецианский карнавал',
    'Испанская ночь',
    'Французский вечер',
    'Итальянская опера',
    'Вальсы Штрауса',
    'Бетховен Live',
    'Моцарт Гала',
  ];

  await prisma.ticket.createMany({
    data: eventTitles.map((title, index) => ({
      title,
      description: `${title} — яркое культурное событие с участием известных артистов и музыкантов.`,
      price: 1500 + (index % 10) * 300,
      eventDate: new Date(
        2026,
        index % 12,
        (index % 28) + 1,
        19,
        0
      ),
      posterUrl: `https://picsum.photos/seed/event-${index + 1}/800/1200`,
      quantity: 50 + (index % 100),
      promotionId: promotions[index % promotions.length].id,
    })),
  });

  const tickets = await prisma.ticket.findMany({
    orderBy: { id: 'asc' },
  });

  console.log(`✅ Tickets: ${tickets.length}`);

  // ================= CARTS =================

  await prisma.cart.createMany({
    data: Array.from({ length: 120 }, (_, i) => ({
      quantity: (i % 4) + 1,
      userId: users[i % users.length].id,
      ticketId: tickets[i % tickets.length].id,
    })),
  });

  console.log('✅ Carts: 120');

  // ================= FAVORITES =================

  await prisma.favorite.createMany({
    data: Array.from({ length: 120 }, (_, i) => ({
      userId: users[i % users.length].id,
      ticketId: tickets[(i * 3) % tickets.length].id,
    })),
  });

  console.log('✅ Favorites: 120');

  // ================= ORDERS =================

  const createdOrders = [];

  for (let i = 0; i < tickets.length; i++) {
    const ticket = tickets[i];
    const quantity = (i % 4) + 1;

    const order = await prisma.order.create({
      data: {
        quantity,
        totalPrice: ticket.price * quantity,
        userId: users[i % users.length].id,
        ticketId: ticket.id,
      },
    });

    createdOrders.push(order);
  }

  console.log(`✅ Orders: ${createdOrders.length}`);

  // ================= REVIEWS =================

  const reviewTexts = [
    'Отличная постановка.',
    'Очень понравилось мероприятие.',
    'Прекрасная атмосфера.',
    'Незабываемые впечатления.',
    'Рекомендую друзьям.',
    'Отличная организация.',
    'Замечательный концерт.',
    'Красивые декорации.',
    'Великолепная музыка.',
    'Обязательно приду ещё раз.',
  ];

  await prisma.review.createMany({
    data: createdOrders.map((order, index) => ({
      orderId: order.id,
      content: reviewTexts[index % reviewTexts.length],
    })),
  });

  console.log(`✅ Reviews: ${createdOrders.length}`);

  // ================= DOCUMENTS =================

  await prisma.orderDocument.createMany({
    data: createdOrders.map((order, index) => ({
      orderId: order.id,
      type: index % 2 === 0 ? 'PDF' : 'DOCX',
    })),
  });

  console.log(`✅ Documents: ${createdOrders.length}`);

  console.log('🎉 Seed completed successfully');

  console.log('');
  console.log('Тестовые аккаунты:');
  console.log('email: user1@mail.ru');
  console.log('email: user7@mail.ru');
  console.log('email: user70@mail.ru');
  console.log('password: 123456');
}

seed()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });