import { Link } from 'react-router-dom';

import {
  FaInstagram,
  FaFacebook,
  FaTelegram,
} from 'react-icons/fa';

import styles from './Footer.module.css';

const navigation = [
  {
    title: 'Главная',
    path: '/',
  },
  {
    title: 'Билеты',
    path: '/tickets',
  },
  {
    title: 'Отзывы',
    path: '/reviews',
  },
  {
    title: 'Вход / Регистрация',
    path: '/auth',
  },
];

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div className={styles.info}>
          <h2 className={styles.logo}>
            Theater
          </h2>

          <p className={styles.description}>
            Онлайн-платформа для
            бронирования билетов в театр.
            Удобный поиск спектаклей,
            лучшие места и мгновенная
            покупка билетов.
          </p>
        </div>

        <div className={styles.linksBlock}>
          <h3 className={styles.heading}>
            Навигация
          </h3>

          <nav className={styles.nav}>
            {navigation.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={styles.link}
              >
                {item.title}
              </Link>
            ))}
          </nav>
        </div>

        <div className={styles.contacts}>
          <h3 className={styles.heading}>
            Контакты
          </h3>

          <a
            href="mailto:info@theater.ru"
            className={styles.contact}
          >
            info@theater.ru
          </a>

          <a
            href="tel:+79999999999"
            className={styles.contact}
          >
            +7 (999) 999-99-99
          </a>

          <div className={styles.socials}>
            <a
              href="/"
              className={styles.social}
            >
              <FaInstagram size={20} />
            </a>

            <a
              href="/"
              className={styles.social}
            >
              <FaFacebook size={20} />
            </a>

            <a
              href="/"
              className={styles.social}
            >
              <FaTelegram size={20} />
            </a>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <p>
          © 2026 Theater. Все права
          защищены.
        </p>
      </div>
    </footer>
  );
};