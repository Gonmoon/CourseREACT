import {
  ShoppingCart,
  Ticket,
  Calendar,
  Minus,
  Plus,
  Trash2
} from 'lucide-react';

import { Link } from 'react-router-dom';
import styles from './CartTab.module.css';

export const CartTab = ({
  cartItems,
  actionLoading,
  handleUpdateQuantity,
  handleRemoveFromCart,
  getDiscountedPrice,
  calculateSubtotal,
  calculateTotal,
  calculateTotalDiscount,
  navigate
}) => {
  if (cartItems.length === 0) {
    return (
      <div className={styles.emptyBlock}>
        <ShoppingCart
          size={48}
          className={styles.emptyIcon}
        />

        <p>Ваша корзина пуста</p>

        <Link to="/" className={styles.shopLink}>
          Перейти к афише
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.cartLayout}>
      <div className={styles.itemsList}>
        {cartItems.map((item) => {
          const discountPercent =
            item.ticket?.promotion?.discount || 0;

          const hasDiscount = discountPercent > 0;

          const finalPriceOne =
            getDiscountedPrice(item.ticket);

          return (
            <div
              key={item.id}
              className={styles.card}
            >
              <div className={styles.cardMain}>
                <div className={styles.iconContainer}>
                  <Ticket
                    size={24}
                    className={styles.ticketIcon}
                  />

                  {hasDiscount && (
                    <span
                      className={
                        styles.miniDiscountBadge
                      }
                    >
                      -{discountPercent}%
                    </span>
                  )}
                </div>

                <div className={styles.cardInfo}>
                  <h3>
                    {item.ticket?.title ||
                      'Билет на спектакль'}
                  </h3>

                  <p className={styles.meta}>
                    <Calendar size={14} />

                    <span>
                      {item.ticket?.eventDate
                        ? new Date(
                            item.ticket.eventDate
                          ).toLocaleDateString(
                            'ru-RU'
                          )
                        : 'Дата не указана'}
                    </span>
                  </p>

                  <div
                    className={styles.priceMetaRow}
                  >
                    <span className={styles.priceOne}>
                      {finalPriceOne} ₽ / шт.
                    </span>

                    {hasDiscount && (
                      <span
                        className={
                          styles.oldPriceOne
                        }
                      >
                        {item.ticket.price} ₽
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className={styles.cardActions}>
                <div className={styles.counter}>
                  <button
                    onClick={() =>
                      handleUpdateQuantity(
                        item,
                        -1
                      )
                    }
                    disabled={
                      item.quantity <= 1 ||
                      actionLoading
                    }
                    className={styles.counterBtn}
                  >
                    <Minus size={14} />
                  </button>

                  <div className={styles.countValue}>
                    {item.quantity || 1}
                  </div>

                  <button
                    onClick={() =>
                      handleUpdateQuantity(
                        item,
                        1
                      )
                    }
                    disabled={actionLoading}
                    className={styles.counterBtn}
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <div className={styles.priceBlock}>
                  <div
                    className={
                      styles.totalPriceContainer
                    }
                  >
                    <span
                      className={styles.totalPrice}
                    >
                      {finalPriceOne *
                        (item.quantity || 1)}{' '}
                      ₽
                    </span>

                    {hasDiscount && (
                      <span
                        className={
                          styles.oldTotalPrice
                        }
                      >
                        {(item.ticket?.price ||
                          0) *
                          (item.quantity || 1)}{' '}
                        ₽
                      </span>
                    )}
                  </div>

                  <button
                    className={styles.deleteBtn}
                    onClick={() =>
                      handleRemoveFromCart(
                        item.id
                      )
                    }
                    disabled={actionLoading}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.summaryCard}>
        <h3>Детали заказа</h3>

        <div className={styles.summaryRow}>
          <span>
            Билеты (
            {cartItems.reduce(
              (acc, i) =>
                acc + (i.quantity || 1),
              0
            )}{' '}
            шт.)
          </span>

          <span>{calculateSubtotal()} ₽</span>
        </div>

        {calculateTotalDiscount() > 0 && (
          <div
            className={`${styles.summaryRow} ${styles.discountRow}`}
          >
            <span>Скидка по акции</span>

            <span>
              -{calculateTotalDiscount()} ₽
            </span>
          </div>
        )}

        <div className={styles.summaryDivider} />

        <div className={styles.summaryTotal}>
          <span>Итого:</span>
          <span>{calculateTotal()} ₽</span>
        </div>

        <button
          className={styles.checkoutBtn}
          onClick={() => navigate('/cart')}
        >
          Оформить заказ
        </button>
      </div>
    </div>
  );
};