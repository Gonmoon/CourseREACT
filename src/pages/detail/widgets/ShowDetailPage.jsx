import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Heart, ShoppingCart, Calendar, Ticket, ArrowRight } from 'lucide-react';
import { ticketsApi, cartApi, favoritesApi } from './api';
import { authApi } from '../../auth/api/auth';
import styles from './ShowDetailPage.module.css';

export const ShowDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [user, setUser] = useState(null);
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
        
        const [ticketData, userData] = await Promise.all([
          ticketsApi.getById(id),
          authApi.me()
        ]);
        
        setTicket(ticketData);
        setUser(userData);

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
        setError(err?.response?.data?.message || 'Спектакль не найден');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  const handleActionWithAuth = async (actionCallback) => {
    if (!user) {
      navigate('/register');
      return;
    }
    
    try {
      setActionLoading(true);
      setError(null);
      setSuccessMessage('');
      await actionCallback();
    } catch (err) {
      setError(err?.response?.data?.message || 'Произошла ошибка. Попробуйте позже.');
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
        const newCartItem = await cartApi.add({
          userId: user.id,
          ticketId: id,
          quantity: quantity
        });
        setCartItemId(newCartItem.id);
        setSuccessMessage('Билеты успешно добавлены в корзину!');
      }
    });
  };

  const handleFavoritesAction = () => {
    handleActionWithAuth(async () => {
      if (favoriteItemId) {
        await favoritesApi.remove(favoriteItemId);
        setFavoriteItemId(null);
        setSuccessMessage('Спектакль удален из избранного');
      } else {
        const newFavoriteItem = await favoritesApi.add({
          userId: user.id,
          ticketId: id
        });
        setFavoriteItemId(newFavoriteItem.id);
        setSuccessMessage('Спектакль добавлен в избранное!');
      }
    });
  };

  if (loading) return <div className={styles.centerLayout}><div className={styles.loader}>Загрузка информации...</div></div>;
  if (error && !ticket) return <div className={styles.centerLayout}><div className={styles.errorBlock}>{error}</div></div>;
  if (!ticket) return null;

  const formattedDate = new Date(ticket.eventDate).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.imageSection}>
          <img src={ticket.posterUrl} alt={ticket.title} className={styles.poster} />
          {ticket.promotion?.discount > 0 && (
            <span className={styles.discountBadge}>
              Акция -{ticket.promotion.discount}%
            </span>
          )}
        </div>

        <div className={styles.infoSection}>
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

          {user && ticket.quantity > 0 && !cartItemId && (
            <div className={styles.quantitySelector}>
              <span className={styles.quantityLabel}>Количество:</span>
              <div className={styles.quantityControls}>
                <button 
                  type="button"
                  disabled={quantity <= 1 || actionLoading} 
                  onClick={() => setQuantity(prev => prev - 1)}
                >
                  -
                </button>
                <input 
                  type="number" 
                  value={quantity} 
                  readOnly 
                />
                <button 
                  type="button"
                  disabled={quantity >= ticket.quantity || actionLoading} 
                  onClick={() => setQuantity(prev => prev + 1)}
                >
                  +
                </button>
              </div>
            </div>
          )}

          {error && <div className={styles.inlineError}>{error}</div>}
          {successMessage && <div className={styles.inlineSuccess}>{successMessage}</div>}

          <div className={styles.actionsContainer}>
            <div className={styles.actions}>
              <button 
                className={`${styles.buyButton} ${cartItemId ? styles.inCart : ''}`} 
                onClick={handleCartAction}
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
                onClick={handleFavoritesAction}
                disabled={actionLoading}
                title={favoriteItemId ? "Убрать из избранного" : "В избранное"}
              >
                <Heart size={20} fill={favoriteItemId ? "currentColor" : "none"} />
              </button>
            </div>

            {cartItemId && (
              <Link to="/cart" className={styles.checkoutButton}>
                <span>Перейти к покупке</span>
                <ArrowRight size={20} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};