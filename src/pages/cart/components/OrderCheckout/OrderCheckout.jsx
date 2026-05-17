import { CreditCard } from 'lucide-react';
import styles from './CartPage.module.css';

export const OrderCheckout = ({ ticket, quantity, totalPrice, error, isProcessing, onCheckout }) => {
  return (
    <>
      <h1 className={styles.title}>Оформление заказа</h1>
      <div className={styles.summaryCard}>
        <div className={styles.ticketInfo}>
          <h2>{ticket.title}</h2>
          <p>Дата: {new Date(ticket.eventDate).toLocaleDateString('ru-RU')}</p>
          <p>Количество: {quantity} шт.</p>
          <p>Цена за билет: {ticket.price} ₽</p>
        </div>
        <div className={styles.divider} />
        <div className={styles.totalRow}>
          <span>К оплате:</span>
          <span className={styles.totalValue}>{totalPrice} ₽</span>
        </div>
      </div>

      {error && <div className={styles.inlineError}>{error}</div>}

      <button 
        className={styles.payButton} 
        onClick={onCheckout}
        disabled={isProcessing}
      >
        <CreditCard size={20} />
        {isProcessing ? 'Обработка платежа...' : 'Оплатить заказ'}
      </button>
    </>
  );
};