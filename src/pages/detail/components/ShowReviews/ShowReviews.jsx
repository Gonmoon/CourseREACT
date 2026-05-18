import styles from './ShowReviews.module.css';

export const ShowReviews = ({ reviews, currentUser, onDeleteReview }) => {
  const safeReviews = Array.isArray(reviews) ? reviews : [];

  if (safeReviews.length === 0) {
    return (
      <div className={styles.reviewsContainer}>
        <h3 className={styles.sectionTitle}>Отзывы зрителей</h3>
        <p className={styles.noReviews}>Оставь первый отзыв после покупки билета!</p>
      </div>
    );
  }

  return (
    <div className={styles.reviewsContainer}>
      <h3 className={styles.sectionTitle}>Отзывы зрителей ({safeReviews.length})</h3>
      
      <div className={styles.reviewsList}>
        {safeReviews.map((review) => {
          const isOwnReview = currentUser && (review.userId === currentUser.id || review.order?.userId === currentUser.id);
          
          return (
            <div key={review.id} className={styles.reviewCard}>
              <div className={styles.reviewHeader}>
                <div className={styles.authorInfo}>
                  <div className={styles.avatarMini}>
                    {review.order?.user?.firstName?.[0] || 'З'}
                  </div>
                  <div>
                    <span className={styles.authorName}>
                      {review.order?.user?.firstName} {review.order?.user?.lastName || 'Зритель'}
                    </span>
                    <span className={styles.reviewDate}>
                      {new Date(review.createdAt).toLocaleDateString('ru-RU', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>

                {isOwnReview && (
                  <button 
                    onClick={() => onDeleteReview(review.id)}
                    className={styles.deleteReviewBtn}
                    title="Удалить отзыв"
                  >
                    Удалить
                  </button>
                )}
              </div>
              
              <p className={styles.reviewContent}>{review.content}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};