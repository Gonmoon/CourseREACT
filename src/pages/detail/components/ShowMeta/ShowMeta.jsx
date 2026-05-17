import { Calendar, Ticket } from 'lucide-react';
import styles from './ShowDetailPage.module.css';

export const ShowMeta = ({ ticket }) => {
  const formattedDate = new Date(ticket.eventDate).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <>
      <h1 className={styles.title}>{ticket.title}</h1>
      
      <div className={styles.metaList}>
        <div className={styles.metaItem}>
          <Calendar size={20} className={styles.icon} />
          <span>{formattedDate}</span>
        </div>
        <div className={styles.metaItem}>
          <Ticket size={20} className={styles.icon} />
          <span>Осталось билетов: <strong>{ticket.quantity}</strong> шт.</span>
        </div>
      </div>

      <div className={styles.descriptionContainer}>
        <h3>О спектакле</h3>
        <p className={styles.description}>{ticket.description}</p>
      </div>

      {ticket.promotion && (
        <div className={styles.promotionBox}>
          <h4>{ticket.promotion.title}</h4>
          <p>{ticket.promotion.description}</p>
        </div>
      )}

      <div className={styles.priceContainer}>
        <span className={styles.priceLabel}>Стоимость билета</span>
        <span className={styles.priceValue}>{ticket.price} ₽</span>
      </div>
    </>
  );
};