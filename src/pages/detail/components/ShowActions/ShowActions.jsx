import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, ArrowRight } from 'lucide-react';
import styles from './ShowDetailPage.module.css';

export const ShowActions = ({ 
  user, 
  ticket, 
  cartItemId, 
  favoriteItemId, 
  actionLoading, 
  onCartAction, 
  onFavoritesAction 
}) => {
  return (
    <div className={styles.actionsContainer}>
      <div className={styles.actions}>
        <button 
          className={`${styles.buyButton} ${cartItemId ? styles.inCart : ''}`} 
          onClick={onCartAction}
          disabled={actionLoading || (ticket.quantity <= 0 && !cartItemId)}
        >
          <ShoppingCart size={20} />
          {ticket.quantity <= 0 && !cartItemId 
            ? 'Билетов нет' 
            : !user 
              ? 'Купить билет' 
              : cartItemId 
                ? 'Убрать из корзины' 
                : 'В корзину'
          }
        </button>

        <button 
          className={`${styles.favoriteButton} ${favoriteItemId ? styles.inFavorites : ''}`} 
          onClick={onFavoritesAction}
          disabled={actionLoading}
          title={favoriteItemId ? "Убрать из избранного" : "В избранное"}
        >
          <Heart size={20} fill={favoriteItemId ? "currentColor" : "none"} />
        </button>
      </div>

      {cartItemId && (
        <Link to="/choice" className={styles.checkoutButton}>
          <span>Перейти к покупке</span>
          <ArrowRight size={20} />
        </Link>
      )}
    </div>
  );
};