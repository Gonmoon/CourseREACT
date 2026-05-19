import {
  Heart,
  Ticket,
  Calendar,
  ShoppingCart,
  Trash2
} from 'lucide-react';

import { Link } from 'react-router-dom';
import styles from './FavoritesTab.module.css';

export const FavoritesTab = ({
  favoriteItems,
  actionLoading,
  handleMoveToCart,
  handleRemoveFromFavorites,
  getDiscountedPrice
}) => {
  if (favoriteItems.length === 0) {
    return (
      <div className={styles.emptyBlock}>
        <Heart
          size={48}
          className={styles.emptyIcon}
        />

        <p>В избранном пока ничего нет</p>

        <Link to="/" className={styles.shopLink}>
          Перейти к афише
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.itemsList}>
      {favoriteItems.map((item) => {
        const discountPercent =
          item.ticket?.promotion?.discount || 0;

        const hasDiscount = discountPercent > 0;

        const finalPrice =
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
                  <span
                    className={styles.totalPrice}
                  >
                    {finalPrice} ₽
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

            <div
              className={styles.favoriteActions}
            >
              <button
                className={styles.moveToCartBtn}
                onClick={() =>
                  handleMoveToCart(item)
                }
                disabled={actionLoading}
              >
                <ShoppingCart size={16} />
                <span>В корзину</span>
              </button>

              <button
                className={styles.deleteBtn}
                onClick={() =>
                  handleRemoveFromFavorites(
                    item.id
                  )
                }
                disabled={actionLoading}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};