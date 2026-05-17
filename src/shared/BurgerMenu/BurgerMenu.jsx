import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

import styles from './BurgerMenu.module.css';

const navItems = [
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

export const BurgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <>
      <button
        className={styles.burgerButton}
        onClick={toggleMenu}
      >
        {isOpen ? (
          <X size={26} />
        ) : (
          <Menu size={26} />
        )}
      </button>

      <div
        className={`${styles.overlay} ${
          isOpen ? styles.active : ''
        }`}
        onClick={toggleMenu}
      />

      <aside
        className={`${styles.menu} ${
          isOpen ? styles.open : ''
        }`}
      >
        <div className={styles.top}>
          <h2 className={styles.logo}>
            Theater
          </h2>
        </div>

        <nav className={styles.nav}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={styles.link}
              onClick={() => setIsOpen(false)}
            >
              {item.title}
            </Link>
          ))}
        </nav>

        <div className={styles.bottom}>
          <p className={styles.text}>
            Онлайн-бронирование билетов в театр
          </p>
        </div>
      </aside>
    </>
  );
};