import { Link } from 'react-router-dom';
import styles from './ShowCard.module.css';

export const ShowCard = ({
  id,
  title,
  image,
  date,
  price,
  quantity,
}) => {
  const formattedDate = new Date(date).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <article className={styles.card}>
      <div className={styles.imageWrapper}>
        <img
          src={image}
          alt={title}
          className={styles.image}
        />

        <span className={styles.badge}>
          {quantity} билетов
        </span>
      </div>

      <div className={styles.content}>
        <div className={styles.info}>
          <p className={styles.date}>
            {formattedDate}
          </p>

          <h3 className={styles.title}>
            {title}
          </h3>
        </div>

        <div className={styles.bottom}>
          <div>
            <span className={styles.priceLabel}>
              Цена
            </span>

            <p className={styles.price}>
              {price} ₽
            </p>
          </div>

          <Link
            to={`/tickets/${id}`}
            className={styles.button}
          >
            Подробнее
          </Link>
        </div>
      </div>
    </article>
  );
};