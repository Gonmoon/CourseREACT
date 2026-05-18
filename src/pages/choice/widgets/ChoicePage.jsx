import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Heart, Trash2, Plus, Minus, Ticket, Calendar, X } from 'lucide-react';
import { authApi } from '../../auth/api/auth';
import { cartApi, favoritesApi } from './api'; 
import styles from './ChoicePage.module.css';

export const ChoicePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('cart'); 

  const [cartItems, setCartItems] = useState([]);
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);

  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showNotification = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast({ show: false, message: '', type: 'success' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  const fetchChoiceData = async () => {
    try {
      setLoading(true);
      const userData = await authApi.me();

      if (!userData) {
        navigate('/auth');
        return;
      }
      setUser(userData);

      const [cartData, favoritesData] = await Promise.all([
        cartApi.getByUserId(userData.id).catch(() => []),
        favoritesApi.getByUserId(userData.id).catch(() => [])
      ]);

      setCartItems(Array.isArray(cartData) ? cartData : []);
      setFavoriteItems(Array.isArray(favoritesData) ? favoritesData : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChoiceData();
  }, [navigate]);

  const getDiscountedPrice = (ticket) => {
    const originalPrice = ticket?.price || 0;
    const discountPercent = ticket?.promotion?.discount || 0;
    
    if (discountPercent > 0) {
      return Math.round(originalPrice * (1 - discountPercent / 100));
    }
    return originalPrice;
  };

  const handleUpdateQuantity = async (item, delta) => {
    if (actionLoading) return;
    
    const currentQty = item.quantity || 1;
    const newQty = currentQty + delta;
    
    if (newQty < 1) return;

    try {
      setActionLoading(true);
      await cartApi.update(item.id, { quantity: Number(newQty) });
      
      setCartItems(prev =>
        prev.map(i => (i.id === item.id ? { ...i, quantity: newQty } : i))
      );
    } catch (err) {
      console.error(err);
      showNotification('Не удалось изменить количество билетов', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveFromCart = async (itemId) => {
    if (actionLoading) return;
    try {
      setActionLoading(true);
      await cartApi.remove(itemId);
      setCartItems(prev => prev.filter(item => item.id !== itemId));
      showNotification('Билет удален из корзины', 'success');
    } catch (err) {
      console.error(err);
      showNotification('Не удалось удалить товар из корзины', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveFromFavorites = async (itemId) => {
    if (actionLoading) return;
    try {
      setActionLoading(true);
      await favoritesApi.remove(itemId);
      setFavoriteItems(prev => prev.filter(item => item.id !== itemId));
      showNotification('Удалено из избранного', 'success');
    } catch (err) {
      console.error(err);
      showNotification('Не удалось удалить из избранного', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleMoveToCart = async (favItem) => {
    if (actionLoading) return;
    try {
      setActionLoading(true);
      
      await cartApi.add({
        userId: Number(user.id),
        ticketId: Number(favItem.ticketId),
        quantity: 1
      });

      await favoritesApi.remove(favItem.id);
      setFavoriteItems(prev => prev.filter(item => item.id !== favItem.id));
      
      const freshCart = await cartApi.getByUserId(user.id).catch(() => []);
      setCartItems(Array.isArray(freshCart) ? freshCart : []);
      
      showNotification('Билет успешно перемещен в корзину!', 'success');
    } catch (err) {
      console.error(err);
      showNotification('Не удалось переместить билет в корзину', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => (sum + (item.ticket?.price || 0) * (item.quantity || 1)), 0);
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => (sum + getDiscountedPrice(item.ticket) * (item.quantity || 1)), 0);
  };

  const calculateTotalDiscount = () => {
    return calculateSubtotal() - calculateTotal();
  };

  if (loading) {
    return (
      <div className={styles.centerLayout}>
        <div className={styles.loader}>Загрузка ваших списков...</div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      {toast.show && (
        <div className={`${styles.toast} ${styles[toast.type]}`}>
          <span>{toast.message}</span>
          <button 
            className={styles.toastClose} 
            onClick={() => setToast({ show: false, message: '', type: 'success' })}
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className={styles.container}>
        
        <div className={styles.header}>
          <button className={styles.backLink} onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
            <span>Назад</span>
          </button>
          <h1 className={styles.title}>Мой выбор</h1>
        </div>

        <div className={styles.tabsRow}>
          <button 
            className={`${styles.tabButton} ${activeTab === 'cart' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('cart')}
          >
            <ShoppingCart size={18} />
            <span>Корзина</span>
            <span className={styles.tabBadge}>{cartItems.length}</span>
          </button>

          <button 
            className={`${styles.tabButton} ${activeTab === 'favorites' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('favorites')}
          >
            <Heart size={18} />
            <span>Избранное</span>
            <span className={styles.tabBadge}>{favoriteItems.length}</span>
          </button>
        </div>

        {activeTab === 'cart' ? (
          <div className={styles.contentSection}>
            {cartItems.length === 0 ? (
              <div className={styles.emptyBlock}>
                <ShoppingCart size={48} className={styles.emptyIcon} />
                <p>Ваша корзина пуста</p>
                <Link to="/" className={styles.shopLink}>Перейти к афише</Link>
              </div>
            ) : (
              <div className={styles.cartLayout}>
                <div className={styles.itemsList}>
                  {cartItems.map((item) => {
                    const discountPercent = item.ticket?.promotion?.discount || 0;
                    const hasDiscount = discountPercent > 0;
                    const finalPriceOne = getDiscountedPrice(item.ticket);

                    return (
                      <div key={item.id} className={styles.card}>
                        <div className={styles.cardMain}>
                          <div className={styles.iconContainer}>
                            <Ticket size={24} className={styles.ticketIcon} />
                            {hasDiscount && (
                              <span className={styles.miniDiscountBadge}>
                                -{discountPercent}%
                              </span>
                            )}
                          </div>
                          <div className={styles.cardInfo}>
                            <h3>{item.ticket?.title || 'Билет на спектакль'}</h3>
                            <p className={styles.meta}>
                              <Calendar size={14} />
                              <span>
                                {item.ticket?.eventDate 
                                  ? new Date(item.ticket.eventDate).toLocaleDateString('ru-RU') 
                                  : 'Дата не указана'}
                              </span>
                            </p>
                            <div className={styles.priceMetaRow}>
                              <span className={styles.priceOne}>
                                {finalPriceOne} ₽ / шт.
                              </span>
                              {hasDiscount && (
                                <span className={styles.oldPriceOne}>
                                  {item.ticket.price} ₽
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className={styles.cardActions}>
                          <div className={styles.counter}>
                            <button 
                              onClick={() => handleUpdateQuantity(item, -1)}
                              disabled={item.quantity <= 1 || actionLoading}
                              className={styles.counterBtn}
                            >
                              <Minus size={14} />
                            </button>
                            <div className={styles.countValue}>{item.quantity || 1}</div>
                            <button 
                              onClick={() => handleUpdateQuantity(item, 1)}
                              disabled={actionLoading}
                              className={styles.counterBtn}
                            >
                              <Plus size={14} />
                            </button>
                          </div>

                          <div className={styles.priceBlock}>
                            <div className={styles.totalPriceContainer}>
                              <span className={styles.totalPrice}>
                                {finalPriceOne * (item.quantity || 1)} ₽
                              </span>
                              {hasDiscount && (
                                <span className={styles.oldTotalPrice}>
                                  {(item.ticket?.price || 0) * (item.quantity || 1)} ₽
                                </span>
                              )}
                            </div>
                            <button 
                              className={styles.deleteBtn}
                              onClick={() => handleRemoveFromCart(item.id)}
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
                    <span>Билеты ({cartItems.reduce((acc, i) => acc + (i.quantity || 1), 0)} шт.)</span>
                    <span>{calculateSubtotal()} ₽</span>
                  </div>
                  
                  {calculateTotalDiscount() > 0 && (
                    <div className={`${styles.summaryRow} ${styles.discountRow}`}>
                      <span>Скидка по акции</span>
                      <span>-{calculateTotalDiscount()} ₽</span>
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
            )}
          </div>
        ) : (
          <div className={styles.contentSection}>
            {favoriteItems.length === 0 ? (
              <div className={styles.emptyBlock}>
                <Heart size={48} className={styles.emptyIcon} />
                <p>В избранном пока ничего нет</p>
                <Link to="/" className={styles.shopLink}>Перейти к афише</Link>
              </div>
            ) : (
              <div className={styles.itemsList}>
                {favoriteItems.map((item) => {
                  const discountPercent = item.ticket?.promotion?.discount || 0;
                  const hasDiscount = discountPercent > 0;
                  const finalPrice = getDiscountedPrice(item.ticket);

                  return (
                    <div key={item.id} className={styles.card}>
                      <div className={styles.cardMain}>
                        <div className={styles.iconContainer}>
                          <Ticket size={24} className={styles.ticketIcon} />
                          {hasDiscount && (
                            <span className={styles.miniDiscountBadge}>
                              -{discountPercent}%
                            </span>
                          )}
                        </div>
                        <div className={styles.cardInfo}>
                          <h3>{item.ticket?.title || 'Билет на спектакль'}</h3>
                          <p className={styles.meta}>
                            <Calendar size={14} />
                            <span>
                              {item.ticket?.eventDate 
                                ? new Date(item.ticket.eventDate).toLocaleDateString('ru-RU') 
                                : 'Дата не указана'}
                            </span>
                          </p>
                          <div className={styles.priceMetaRow}>
                            <span className={styles.totalPrice}>
                              {finalPrice} ₽
                            </span>
                            {hasDiscount && (
                              <span className={styles.oldPriceOne}>
                                {item.ticket.price} ₽
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className={styles.favoriteActions}>
                        <button 
                          className={styles.moveToCartBtn}
                          onClick={() => handleMoveToCart(item)}
                          disabled={actionLoading}
                        >
                          <ShoppingCart size={16} />
                          <span>В корзину</span>
                        </button>
                        <button 
                          className={styles.deleteBtn}
                          onClick={() => handleRemoveFromFavorites(item.id)}
                          disabled={actionLoading}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};