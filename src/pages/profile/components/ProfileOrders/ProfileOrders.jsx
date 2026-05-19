import {
  Ticket,
  MessageSquare,
  Check,
} from 'lucide-react';

import styles from './ProfileOrders.module.css';

export const ProfileOrders = ({
  orders,
  activeOrderId,
  setActiveOrderId,
  reviewContent,
  setReviewContent,
  handleSendReview,
  reviewLoading,
}) => {
  return (
    <div className={styles.ordersSection}>
      <div className={styles.ordersHeader}>
        <Ticket
          size={22}
          className={styles.icon}
        />

        <h2>
          Мои покупки ({orders.length})
        </h2>
      </div>

      {orders.length === 0 ? (
        <p className={styles.noOrders}>
          Вы еще не приобрели билеты
        </p>
      ) : (
        <div className={styles.ordersList}>
          {orders.map((order) => (
            <div
              key={order.id}
              className={styles.orderCard}
            >
              <div className={styles.orderInfo}>
                <h3>
                  {order.ticket?.title}
                </h3>

                <p className={styles.orderMeta}>
                  Количество: {order.quantity}
                </p>
              </div>

              <div className={styles.reviewBlock}>
                {order.review ? (
                  <div
                    className={
                      styles.reviewStatus
                    }
                  >
                    <Check size={16} />
                    <span>
                      Отзыв отправлен
                    </span>
                  </div>
                ) : activeOrderId ===
                  order.id ? (
                  <div
                    className={
                      styles.reviewForm
                    }
                  >
                    <textarea
                      className={
                        styles.reviewTextarea
                      }
                      placeholder="Ваш отзыв..."
                      value={reviewContent}
                      onChange={(e) =>
                        setReviewContent(
                          e.target.value
                        )
                      }
                    />

                    <div
                      className={
                        styles.formActions
                      }
                    >
                      <button
                        className={
                          styles.submitReviewBtn
                        }
                        onClick={() =>
                          handleSendReview(
                            order.id
                          )
                        }
                      >
                        {reviewLoading
                          ? 'Отправка...'
                          : 'Отправить'}
                      </button>

                      <button
                        className={
                          styles.cancelReviewBtn
                        }
                        onClick={() => {
                          setActiveOrderId(
                            null
                          );
                          setReviewContent('');
                        }}
                      >
                        Отмена
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    className={
                      styles.addReviewBtn
                    }
                    onClick={() =>
                      setActiveOrderId(
                        order.id
                      )
                    }
                  >
                    <MessageSquare
                      size={16}
                    />

                    <span>
                      Оставить отзыв
                    </span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};