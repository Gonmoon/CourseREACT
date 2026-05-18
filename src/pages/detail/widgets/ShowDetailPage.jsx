import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ticketsApi, cartApi, favoritesApi, reviewsApi } from './api';
import { authApi } from '../../auth/api/auth';
import { ShowMeta } from '../components/ShowMeta';
import { ShowQuantitySelector } from '../components/ShowQuantitySelector';
import { ShowActions } from '../components/ShowActions';
import { ShowReviews } from '../components/ShowReviews';
import styles from './ShowDetailPage.module.css';

export const ShowDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [cartItemId, setCartItemId] = useState(null);
  const [favoriteItemId, setFavoriteItemId] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [ticketData, userData, reviewsData] = await Promise.all([
          ticketsApi.getById(id),
          authApi.me().catch(() => null),
          reviewsApi.getByTicketId(id).catch(() => [])
        ]);
        
        setTicket(ticketData);
        setUser(userData);
        setReviews(Array.isArray(reviewsData) ? reviewsData : []);

        if (userData) {
          const [cartItems, favoriteItems] = await Promise.all([
            cartApi.getByUserId(userData.id),
            favoritesApi.getByUserId(userData.id)
          ]);
          const inCart = cartItems.find(item => item.ticketId === Number(id));
          const inFavorites = favoriteItems.find(item => item.ticketId === Number(id));
          if (inCart) setCartItemId(inCart.id);
          if (inFavorites) setFavoriteItemId(inFavorites.id);
        }
      } catch (err) {
        setError('Не удалось загрузить данные');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  const handleActionWithAuth = async (actionCallback) => {
    if (!user) {
      navigate('/auth');
      return;
    }
    try {
      setActionLoading(true);
      setError(null);
      setSuccessMessage('');
      await actionCallback();
    } catch (err) {
      setError(err?.response?.data?.message || 'Произошла ошибка');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCartAction = () => {
    handleActionWithAuth(async () => {
      if (cartItemId) {
        await cartApi.remove(cartItemId);
        setCartItemId(null);
        setSuccessMessage('Билеты удалены из корзины');
      } else {
        const newCartItem = await cartApi.add({ userId: user.id, ticketId: Number(id), quantity });
        setCartItemId(newCartItem.id);
        setSuccessMessage('Билеты добавлены в корзину!');
      }
    });
  };

  const handleFavoritesAction = () => {
    handleActionWithAuth(async () => {
      if (favoriteItemId) {
        await favoritesApi.remove(favoriteItemId);
        setFavoriteItemId(null);
        setSuccessMessage('Удалено из избранного');
      } else {
        const newFavoriteItem = await favoritesApi.add({ userId: user.id, ticketId: Number(id) });
        setFavoriteItemId(newFavoriteItem.id);
        setSuccessMessage('Добавлено в избранное!');
      }
    });
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await reviewsApi.remove(reviewId);
      setReviews(prev => prev.filter(r => r.id !== reviewId));
    } catch (err) {
      setError('Ошибка при удалении отзыва');
    }
  };

  if (loading) return <div className={styles.centerLayout}><div className={styles.loader}>Загрузка...</div></div>;
  if (!ticket) return null;

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.imageSection}>
          <img src={ticket.posterUrl} alt={ticket.title} className={styles.poster} />
          {ticket.promotion?.discount > 0 && <span className={styles.discountBadge}>Акция -{ticket.promotion.discount}%</span>}
        </div>

        <div className={styles.infoSection}>
          <ShowMeta ticket={ticket} />

          {user && ticket.quantity > 0 && !cartItemId && (
            <ShowQuantitySelector quantity={quantity} maxQuantity={ticket.quantity} actionLoading={actionLoading} onChange={setQuantity} />
          )}

          {error && <div className={styles.inlineError}>{error}</div>}
          {successMessage && <div className={styles.inlineSuccess}>{successMessage}</div>}

          <ShowActions 
            user={user} ticket={ticket} cartItemId={cartItemId}
            favoriteItemId={favoriteItemId} actionLoading={actionLoading}
            onCartAction={handleCartAction} onFavoritesAction={handleFavoritesAction}
          />

          <ShowReviews 
            reviews={reviews} 
            currentUser={user} 
            onDeleteReview={handleDeleteReview} 
          />
        </div>
      </div>
    </div>
  );
};