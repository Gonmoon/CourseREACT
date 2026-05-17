// prisma/seedPromotions.js

import { prisma } from './prisma.js';

async function seedPromotions() {
  await prisma.promotion.createMany({
    data: [
      {
        title: 'Летняя скидка',
        description:
          'Скидка 15% на все спектакли июня',
        discount: 15,
      },

      {
        title: 'Семейное предложение',
        description:
          'Специальная скидка для семейного посещения театра',
        discount: 20,
      },

      {
        title: 'VIP билеты',
        description:
          'Скидка на VIP места и лучшие ряды',
        discount: 10,
      },

      {
        title: 'Студенческая акция',
        description:
          'Скидка для студентов при предъявлении студенческого билета',
        discount: 25,
      },

      {
        title: 'Вечерняя премьера',
        description:
          'Специальные цены на премьерные показы',
        discount: 12,
      },
    ],
  });

  console.log('Акции успешно добавлены');
}

seedPromotions()
  .catch((error) => {
    console.error(error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });