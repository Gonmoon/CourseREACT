import styles from './HeroSection.module.css';
import { Button } from '@shared/Button';

export const HeroSection = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.overlay}>
        <div className={styles.content}>
          <span className={styles.subtitle}>
            Онлайн-платформа для бронирования билетов
          </span>

          <h1 className={styles.title}>
            Лучшие театральные постановки вашего города
          </h1>

          <p className={styles.description}>
            Покупайте билеты в театр быстро, удобно и без очередей.
          </p>

          <Button text="Выбрать спектакль" to="/tickets" />
        </div>
      </div>
    </section>
  );
};