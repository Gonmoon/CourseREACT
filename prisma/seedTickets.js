// prisma/seedTickets.js

import { prisma } from './prisma.js';

async function seed() {
  await prisma.ticket.createMany({
    data: [
      {
        title: 'Гамлет',
        description:
          'Легендарная трагедия Уильяма Шекспира в современной постановке.',
        price: 2500,
        eventDate: new Date('2026-06-12T19:00:00'),
        posterUrl:
          'https://images.unsplash.com/photo-1507924538820-ede94a04019d',
        quantity: 120,
        promotionId: 1,
      },

      {
        title: 'Ревизор',
        description:
          'Классическая комедия Николая Гоголя о коррупции и человеческих слабостях.',
        price: 1800,
        eventDate: new Date('2026-06-18T18:30:00'),
        posterUrl:
          'https://images.unsplash.com/photo-1518998053901-5348d3961a04',
        quantity: 85,
        promotionId: 1,
      },

      {
        title: 'Щелкунчик',
        description:
          'Волшебный балет Петра Ильича Чайковского для всей семьи.',
        price: 3200,
        eventDate: new Date('2026-06-25T19:30:00'),
        posterUrl:
          'https://images.unsplash.com/photo-1516280440614-37939bbacd81',
        quantity: 60,
        promotionId: 2,
      },

      {
        title: 'Мастер и Маргарита',
        description:
          'Мистическая театральная постановка по роману Михаила Булгакова.',
        price: 2900,
        eventDate: new Date('2026-07-02T20:00:00'),
        posterUrl:
          'https://images.unsplash.com/photo-1503095396549-807759245b35',
        quantity: 74,
        promotionId: 2,
      },

      {
        title: 'Анна Каренина',
        description:
          'Драматическая история любви и трагедии по роману Льва Толстого.',
        price: 2700,
        eventDate: new Date('2026-07-09T19:00:00'),
        posterUrl:
          'https://images.unsplash.com/photo-1513106580091-1d82408b8cd6',
        quantity: 91,
        promotionId: 1,
      },

      {
        title: 'Лебединое озеро',
        description:
          'Знаменитый балет в исполнении ведущих артистов театра.',
        price: 3500,
        eventDate: new Date('2026-07-15T19:30:00'),
        posterUrl:
          'https://images.unsplash.com/photo-1501386761578-eac5c94b800a',
        quantity: 48,
        promotionId: 3,
      },

      {
        title: 'Вишнёвый сад',
        description:
          'Классическая пьеса Антона Чехова о переменах эпохи.',
        price: 2100,
        eventDate: new Date('2026-07-21T18:00:00'),
        posterUrl:
          'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba',
        quantity: 130,
        promotionId: 2,
      },

      {
        title: 'Призрак оперы',
        description:
          'Музыкальный спектакль с впечатляющими декорациями и живым оркестром.',
        price: 4100,
        eventDate: new Date('2026-08-03T20:00:00'),
        posterUrl:
          'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf',
        quantity: 55,
        promotionId: 3,
      },
    ],
  });

  console.log('Билеты успешно добавлены');
}

seed()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });