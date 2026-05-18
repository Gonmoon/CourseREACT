import { CreditCard } from 'lucide-react';
import styles from './CartPage.module.css';

export const OrderCheckout = ({ cartItems, totalPrice, error, isProcessing, onCheckout }) => {
  return (
    <>
      <h1 className={styles.title}>Оформление заказа</h1>
      <div className={styles.summaryCard}>
        <div className={styles.itemsList}>
          {cartItems.map((item) => (
            <div key={item.id} className={styles.ticketInfo} style={{ marginBottom: '16px' }}>
              <h2>{item.ticket?.title}</h2>
              <p>Дата: {item.ticket?.eventDate ? new Date(item.ticket.eventDate).toLocaleDateString('ru-RU') : 'Не указана'}</p>
              <p>Количество: {item.quantity} шт.</p>
              <p>Цена за билет: {item.ticket?.price} ₽</p>
            </div>
          ))}
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