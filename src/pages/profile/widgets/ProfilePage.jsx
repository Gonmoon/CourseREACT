import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, Mail, Shield, LogOut, ArrowLeft, Ticket, 
  MessageSquare, ShoppingCart, Heart, Edit2, Check, X, AlertCircle 
} from 'lucide-react';
import { authApi } from '../../auth/api/auth';
import { cartApi, favoritesApi, ordersApi, reviewsApi } from './api'; 
import styles from './ProfilePage.module.css';

export const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ cartCount: 0, favoritesCount: 0 });
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  const [notification, setNotification] = useState({ message: '', type: '', id: null });

  const [activeOrderId, setActiveOrderId] = useState(null);
  const [reviewContent, setReviewContent] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ firstName: '', lastName: '', password: '', confirmPassword: '' });
  const [updateLoading, setUpdateLoading] = useState(false);

  const showNotification = (message, type = 'success') => {
    const id = Date.now();
    setNotification({ message, type, id });
    setTimeout(() => {
      setNotification(prev => prev.id === id ? { message: '', type: '', id: null } : prev);
    }, 4000);
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const userData = await authApi.me();

        if (!userData) {
          navigate('/auth');
          return;
        }

        setUser(userData);
        setEditForm({
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          password: '',
          confirmPassword: ''
        });

        const [cartItems, favoriteItems, userOrders] = await Promise.all([
          cartApi.getByUserId(userData.id).catch(() => []),
          favoritesApi.getByUserId(userData.id).catch(() => []),
          ordersApi.getByUserId(userData.id).catch(() => [])
        ]);

        setStats({
          cartCount: Array.isArray(cartItems) ? cartItems.length : 0,
          favoritesCount: Array.isArray(favoriteItems) ? favoriteItems.length : 0
        });
        setOrders(Array.isArray(userOrders) ? userOrders : []);
      } catch (err) {
        setError('Не удалось загрузить данные профиля');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await authApi.logout();
      navigate('/auth');
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendReview = async (orderId) => {
    if (!reviewContent.trim()) return;

    const targetOrder = orders.find(o => o.id === orderId);
    if (targetOrder?.review) {
      showNotification('Вы уже оставили отзыв к этому заказу', 'error');
      return;
    }

    try {
      setReviewLoading(true);
      const newReview = await reviewsApi.create({
        content: reviewContent,
        orderId: orderId
      });

      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { ...order, review: newReview } : order
        )
      );
      
      setReviewContent('');
      setActiveOrderId(null);
      showNotification('Отзыв успешно отправлен!');
    } catch (err) {
      showNotification(err?.response?.data?.message || 'Не удалось отправить отзыв', 'error');
    } finally {
      setReviewLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!editForm.firstName.trim() || !editForm.lastName.trim()) {
      showNotification('Имя и фамилия не могут быть пустыми', 'error');
      return;
    }

    if (editForm.password && editForm.password !== editForm.confirmPassword) {
      showNotification('Пароли не совпадают', 'error');
      return;
    }

    try {
      setUpdateLoading(true);
      
      const updateData = {
        email: user.email,
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        password: editForm.password ? editForm.password : user.password 
      };

      const updatedUser = await authApi.updateProfile(user.id, updateData);
      
      setUser(updatedUser);
      setIsEditing(false);
      setEditForm(prev => ({ ...prev, password: '', confirmPassword: '' }));
      showNotification('Данные успешно обновлены!');
    } catch (err) {
      showNotification(err?.response?.data?.message || 'Не удалось обновить профиль', 'error');
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.centerLayout}>
        <div className={styles.loader}>Загрузка профиля...</div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className={styles.centerLayout}>
        <div className={styles.errorBlock}>{error || 'Сессия истекла'}</div>
        <Link to="/auth" className={styles.backButton}>Войти в аккаунт</Link>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      {notification.message && (
        <div className={`${styles.toastNotification} ${notification.type === 'error' ? styles.toastError : styles.toastSuccess}`}>
          {notification.type === 'error' ? <AlertCircle size={20} /> : <Check size={20} />}
          <span>{notification.message}</span>
        </div>
      )}

      <div className={styles.container}>
        <div className={styles.header}>
          <button className={styles.backLink} onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
            <span>Назад</span>
          </button>
          
          <div className={styles.avatarLarge}>
            {user.firstName ? user.firstName[0] : ''}
            {user.lastName ? user.lastName[0] : ''}
          </div>
          
          <h1 className={styles.fullName}>
            {user.firstName} {user.lastName}
          </h1>
          <p className={styles.roleBadge}>
            <Shield size={14} />
            <span>Зритель</span>
          </p>
        </div>

        <div className={styles.navigationRow}>
          <Link to="/choice" className={styles.combinedNavButton} aria-label="Корзина и Избранное">
            <span className={styles.combinedLabel}>Мой выбор</span>
            
            <div className={styles.combinedBadges}>
              <div className={styles.iconWrapper}>
                <ShoppingCart size={20} className={styles.navIcon} />
                {stats.cartCount > 0 && (
                  <span className={`${styles.navBadge} ${styles.badgeCart}`}>{stats.cartCount}</span>
                )}
              </div>

              <div className={styles.badgeDivider} />

              <div className={styles.iconWrapper}>
                <Heart size={20} className={styles.navIcon} />
                {stats.favoritesCount > 0 && (
                  <span className={`${styles.navBadge} ${styles.badgeFavorites}`}>{stats.favoritesCount}</span>
                )}
              </div>
            </div>
          </Link>
        </div>

        <div className={styles.infoGrid}>
          <div className={`${styles.infoCard} ${isEditing ? styles.fullWidthCard : ''}`}>
            <div className={styles.cardHeader}>
              <User size={20} className={styles.icon} />
              <h3>Личные данные</h3>
              {!isEditing && (
                <button className={styles.editBtn} onClick={() => setIsEditing(true)}>
                  <Edit2 size={16} />
                </button>
              )}
            </div>
            
            {isEditing ? (
              <form onSubmit={handleUpdateProfile} className={styles.editForm}>
                <div className={styles.formRow}>
                  <div className={styles.field}>
                    <label className={styles.label}>Имя</label>
                    <input
                      type="text"
                      className={styles.input}
                      value={editForm.firstName}
                      onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                      disabled={updateLoading}
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Фамилия</label>
                    <input
                      type="text"
                      className={styles.input}
                      value={editForm.lastName}
                      onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                      disabled={updateLoading}
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.field}>
                    <label className={styles.label}>Новый пароль (необязательно)</label>
                    <input
                      type="password"
                      className={styles.input}
                      placeholder="Оставьте пустым"
                      value={editForm.password}
                      onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                      disabled={updateLoading}
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Подтвердите пароль</label>
                    <input
                      type="password"
                      className={styles.input}
                      placeholder="Повторите новый пароль"
                      value={editForm.confirmPassword}
                      onChange={(e) => setEditForm({ ...editForm, confirmPassword: e.target.value })}
                      disabled={updateLoading}
                    />
                  </div>
                </div>

                <div className={styles.editActions}>
                  <button type="submit" className={styles.saveBtn} disabled={updateLoading}>
                    <Check size={16} />
                    <span>{updateLoading ? 'Сохранение...' : 'Сохранить'}</span>
                  </button>
                  <button 
                    type="button" 
                    className={styles.cancelBtn} 
                    onClick={() => { setIsEditing(false); setEditForm({ firstName: user.firstName, lastName: user.lastName, password: '', confirmPassword: '' }); }}
                    disabled={updateLoading}
                  >
                    <X size={16} />
                    <span>Отмена</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className={styles.cardContent}>
                <div className={styles.field}>
                  <span className={styles.label}>Имя</span>
                  <span className={styles.value}>{user.firstName || 'Не указано'}</span>
                </div>
                <div className={styles.field}>
                  <span className={styles.label}>Фамилия</span>
                  <span className={styles.value}>{user.lastName || 'Не указано'}</span>
                </div>
              </div>
            )}
          </div>

          {!isEditing && (
            <div className={styles.infoCard}>
              <div className={styles.cardHeader}>
                <Mail size={20} className={styles.icon} />
                <h3>Контакты</h3>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.field}>
                  <span className={styles.label}>Email</span>
                  <span className={styles.value}>{user.email}</span>
                </div>
                <div className={styles.field}>
                  <span className={styles.label}>Статус аккаунта</span>
                  <span className={styles.verified}>Подтвержден</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className={styles.ordersSection}>
          <div className={styles.ordersHeader}>
            <Ticket size={22} className={styles.icon} />
            <h2>Мои покупки ({orders.length})</h2>
          </div>

          {orders.length === 0 ? (
            <p className={styles.noOrders}>Вы еще не приобрели ни одного билета.</p>
          ) : (
            <div className={styles.ordersList}>
              {orders.map((order) => (
                <div key={order.id} className={styles.orderCard}>
                  <div className={styles.orderInfo}>
                    <h3>{order.ticket?.title || `Заказ №${order.id}`}</h3>
                    <p className={styles.orderMeta}>
                      Дата сеанса: {order.ticket?.eventDate ? new Date(order.ticket.eventDate).toLocaleDateString('ru-RU') : 'Не указана'}
                    </p>
                    <p className={styles.orderMeta}>Количество: {order.quantity || 1} шт.</p>
                  </div>

                  <div className={styles.reviewBlock}>
                    {order.review ? (
                      <div className={styles.reviewStatus}>
                        <Check size={16} className={styles.successCheckIcon} />
                        <span>Ваш отзыв отправлен</span>
                      </div>
                    ) : activeOrderId === order.id ? (
                      <div className={styles.reviewForm}>
                        <textarea
                          placeholder="Напишите ваш отзыв о спектакле..."
                          value={reviewContent}
                          onChange={(e) => setReviewContent(e.target.value)}
                          disabled={reviewLoading}
                          className={styles.reviewTextarea}
                        />
                        <div className={styles.formActions}>
                          <button 
                            className={styles.submitReviewBtn} 
                            onClick={() => handleSendReview(order.id)}
                            disabled={reviewLoading || !reviewContent.trim()}
                          >
                            {reviewLoading ? 'Отправка...' : 'Отправить'}
                          </button>
                          <button 
                            className={styles.cancelReviewBtn} 
                            onClick={() => { setActiveOrderId(null); setReviewContent(''); }}
                            disabled={reviewLoading}
                          >
                            Отмена
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button 
                        className={styles.addReviewBtn} 
                        onClick={() => setActiveOrderId(order.id)}
                      >
                        <MessageSquare size={16} />
                        <span>Оставить отзыв</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <button className={styles.logoutButton} onClick={handleLogout}>
          <LogOut size={20} />
          <span>Выйти из профиля</span>
        </button>
      </div>
    </div>
  );
};