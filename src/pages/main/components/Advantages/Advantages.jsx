import styles from './Advantages.module.css';
import {
  Ticket,
  Armchair,
  Smartphone,
  ShieldCheck,
} from 'lucide-react';

const advantages = [
  {
    id: 1,
    title: 'Мгновенное бронирование',
    text: 'Покупайте билеты онлайн за несколько кликов без очередей и ожидания.',
    icon: <Ticket size={34} />,
  },
  {
    id: 2,
    title: 'Выбор лучших мест',
    text: 'Интерактивная схема зала поможет выбрать идеальные места для просмотра.',
    icon: <Armchair size={34} />,
  },
  {
    id: 3,
    title: 'Электронные билеты',
    text: 'Получайте билеты на email и показывайте их прямо со смартфона.',
    icon: <Smartphone size={34} />,
  },
  {
    id: 4,
    title: 'Безопасная оплата',
    text: 'Все платежи защищены современными технологиями шифрования данных.',
    icon: <ShieldCheck size={34} />,
  },
];

export const Advantages = () => {
  return (
    <section className={styles.section}>
      <div className={styles.top}>
        <span className={styles.subtitle}>Преимущества сервиса</span>

        <h2 className={styles.title}>
          Всё для комфортного бронирования билетов
        </h2>

        <p className={styles.description}>
          Мы сделали процесс покупки театральных билетов
          максимально удобным, быстрым и безопасным.
        </p>
      </div>

      <div className={styles.cards}>
        {advantages.map((item) => (
          <article className={styles.card} key={item.id}>
            <div className={styles.icon}>{item.icon}</div>

            <h3 className={styles.cardTitle}>
              {item.title}
            </h3>

            <p className={styles.cardText}>
              {item.text}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
};