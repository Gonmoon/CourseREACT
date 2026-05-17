import React, { useState } from 'react';
import styles from './Hero.module.css';

export const Hero = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Ищем сеансы:', { searchQuery, selectedDate, selectedGenre });
  };

  return (
    <section className={styles.heroSection}>
      {/* Фоновое изображение с затемнением */}
      <div className={styles.backgroundWrapper}>
        <img 
          src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1920&q=80" 
          alt="Cinema background" 
          className={styles.backgroundImage}
        />
        <div className={styles.gradientOverlay} />
      </div>

      {/* Контентная часть */}
      <div className={styles.content}>
        <span className={styles.badge}>
          Премьеры каждый четверг
        </span>
        <h1 className={styles.title}>
          Кино там, где <span className={styles.highlight}>удобно тебе</span>
        </h1>
        <p className={styles.description}>
          Покупка билетов в любые кинотеатры города за 30 секунд. Выбирай сеанс, оплачивай онлайн и проходи в зал по QR-коду.
        </p>
      </div>

      {/* Панель быстрого поиска */}
      <div className={styles.searchPanel}>
        <form onSubmit={handleSearch} className={styles.formGrid}>
          
          {/* Поиск по названию */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>Фильм</label>
            <input 
              type="text" 
              placeholder="Название или жанр..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.input}
            />
          </div>

          {/* Выбор даты */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>Когда</label>
            <select 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className={styles.select}
            >
              <option value="">Выбрать дату</option>
              <option value="today">Сегодня</option>
              <option value="tomorrow">Завтра</option>
              <option value="weekend">На выходных</option>
            </select>
          </div>

          {/* Выбор жанра */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>Жанр</label>
            <select 
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className={styles.select}
            >
              <option value="">Все жанры</option>
              <option value="action">Экшен</option>
              <option value="comedy">Комедия</option>
              <option value="drama">Драма</option>
              <option value="sci-fi">Фантастика</option>
            </select>
          </div>

          {/* Кнопка отправки */}
          <div>
            <button type="submit" className={styles.submitBtn}>
              Найти сеанс
            </button>
          </div>

        </form>
        
        {/* Информационная строка */}
        <div className={styles.infoRow}>
          <div>Сегодня в прокате: <span className={styles.infoWhite}>24 фильма</span></div>
          <div className={styles.hiddenMobile}>Ближайший сеанс через: <span className={styles.infoRed}>12 минут</span></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;