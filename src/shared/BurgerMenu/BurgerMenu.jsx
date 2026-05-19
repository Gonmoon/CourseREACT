import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { authApi } from '@pages/auth/api/auth';

import styles from './BurgerMenu.module.css';

const baseNavItems = [
  { title: 'Главная', path: '/' },
  { title: 'Билеты', path: '/tickets' },
  { title: 'Отзывы', path: '/reviews' },
];

export const BurgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const loadUser = async () => {
      setLoadingUser(true);

      try {
        const data = await authApi.me();

        if (!isMounted) return;

        setUser(data);
      } catch (err) {
        setUser(null);
      } finally {
        if (isMounted) setLoadingUser(false);
      }
    };

    loadUser();

    return () => {
      isMounted = false;
    };
  }, []);

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (e) {
      console.error(e);
    } finally {
      setUser(null);
      setIsOpen(false);
      navigate('/auth');
    }
  };

  const isAdmin = 
    user && 
    user.firstName === "admin" && 
    user.lastName === "admin" && 
    user.email === "admin";

  const navItems = isAdmin 
    ? [...baseNavItems, { title: 'Управление', path: '/owner' }] 
    : baseNavItems;

  return (
    <>
      <button className={styles.burgerButton} onClick={() => setIsOpen(v => !v)}>
        {isOpen ? <X size={26} /> : <Menu size={26} />}
      </button>

      <div
        className={`${styles.overlay} ${isOpen ? styles.active : ''}`}
        onClick={() => setIsOpen(false)}
      />

      <aside className={`${styles.menu} ${isOpen ? styles.open : ''}`}>
        <div className={styles.top}>
          {loadingUser ? (
            <div className={styles.login}>Загрузка...</div>
          ) : user ? (
            <Link
              to="/profile"
              className={styles.userBox}
              onClick={() => setIsOpen(false)}
            >
              <div className={styles.avatar}>
                {user.firstName?.[0]}
                {user.lastName?.[0]}
              </div>

              <div>
                <p className={styles.userName}>
                  {user.firstName} {user.lastName}
                </p>
                <span className={styles.userEmail}>
                  {user.email}
                </span>
              </div>
            </Link>
          ) : (
            <Link
              to="/auth"
              className={styles.login}
              onClick={() => setIsOpen(false)}
            >
              Войти / Регистрация
            </Link>
          )}
        </div>

        <nav className={styles.nav}>
          {navItems.map(item => (
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
          {user && (
            <button className={styles.logout} onClick={logout}>
              Выйти
            </button>
          )}

          <p className={styles.text}>
            Онлайн-бронирование билетов в театр
          </p>
        </div>
      </aside>
    </>
  );
};