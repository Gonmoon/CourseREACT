import styles from './TicketsManager.module.css';

export const TicketsManager = ({
  query,
  onSearch,
  onSort,
}) => {
  return (
    <div className={styles.manager}>
      <h2 className={styles.title}>
        Билеты
      </h2>

      <input
        className={styles.search}
        value={query}
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Поиск спектакля..."
      />

      <div className={styles.actions}>
        <button onClick={() => onSort('date-desc')}>
          Новые
        </button>

        <button onClick={() => onSort('price-asc')}>
          Дешевле
        </button>

        <button onClick={() => onSort('price-desc')}>
          Дороже
        </button>
      </div>
    </div>
  );
};