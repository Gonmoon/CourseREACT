import styles from './Tickets.module.css';
import { ShowCard } from '@shared/ShowCard';

export const Tickets = ({
  tickets,
  loading,
  page,
  setPage,
  limit,
}) => {
  const isEmpty = !loading && tickets.length === 0;

  return (
    <div className={styles.wrapper}>
      {loading ? (
        <div className={styles.state}>
          Загрузка...
        </div>
      ) : isEmpty ? (
        <div className={styles.empty}>
          Ничего не найдено
        </div>
      ) : (
        <div className={styles.grid}>
          {tickets.map((ticket) => (
            <ShowCard
              key={ticket.id}
              id={ticket.id}
              title={ticket.title}
              image={ticket.posterUrl}
              date={ticket.eventDate}
              price={ticket.price}
              quantity={ticket.quantity}
            />
          ))}
        </div>
      )}

      <div className={styles.pagination}>
        <button
          onClick={() =>
            setPage((p) => Math.max(1, p - 1))
          }
          disabled={page === 1}
        >
          Назад
        </button>

        <span>Страница {page}</span>

        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={tickets.length < limit}
        >
          Далее
        </button>
      </div>
    </div>
  );
};