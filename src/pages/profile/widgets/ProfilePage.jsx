import { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShoppingCart,
  Heart,
  LogOut,
  AlertCircle,
  Check,
} from 'lucide-react';

import { authApi } from '../../auth/api/auth';
import {
  cartApi,
  favoritesApi,
  ordersApi,
  reviewsApi,
} from './api';

import { ProfileHeader } from '../components/ProfileHeader';
import { ProfileInfo } from '../components/ProfileInfo';
import { ProfileOrders } from '../components/ProfileOrders';

import styles from './ProfilePage.module.css';

export const ProfilePage = () => {
  const navigate = useNavigate();
  const timerRef = useRef(null);

  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [stats, setStats] = useState({
    cartCount: 0,
    favoritesCount: 0,
  });

  const [notification, setNotification] = useState({
    message: '',
    type: '',
  });

  const [activeOrderId, setActiveOrderId] = useState(null);
  const [reviewContent, setReviewContent] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
  });

  const showNotification = (message, type = 'success') => {
    if (timerRef.current) clearTimeout(timerRef.current);

    setNotification({ message, type });

    timerRef.current = setTimeout(() => {
      setNotification({ message: '', type: '' });
    }, 3000);
  };

  useEffect(() => {
    loadProfile();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const loadProfile = async () => {
    try {
      const userData = await authApi.me();
      if (!userData) {
        navigate('/auth');
        return;
      }
      setUser(userData);
      setEditForm({
        firstName: userData.firstName,
        lastName: userData.lastName,
        password: '',
        confirmPassword: '',
      });

      const [cartItems, favoriteItems, userOrders] = await Promise.all([
        cartApi.getByUserId(userData.id),
        favoritesApi.getByUserId(userData.id),
        ordersApi.getByUserId(userData.id),
      ]);

      setStats({
        cartCount: cartItems.length,
        favoritesCount: favoriteItems.length,
      });
      setOrders(userOrders);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await authApi.logout();
    navigate('/auth');
  };

  const handleSendReview = async (orderId) => {
    if (!reviewContent.trim()) {
      return showNotification('Введите отзыв', 'error');
    }
    try {
      setReviewLoading(true);
      const review = await reviewsApi.create({
        content: reviewContent,
        orderId,
      });
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, review } : order
        )
      );
      setReviewContent('');
      setActiveOrderId(null);
      showNotification('Отзыв отправлен');
    } catch {
      showNotification('Ошибка отправки', 'error');
    } finally {
      setReviewLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (editForm.password !== editForm.confirmPassword) {
      return showNotification('Пароли не совпадают', 'error');
    }
    try {
      setUpdateLoading(true);
      const updatedUser = await authApi.updateProfile(user.id, {
        email: user.email,
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        password: editForm.password || user.password,
      });
      setUser(updatedUser);
      setIsEditing(false);
      showNotification('Профиль обновлен');
    } catch {
      showNotification('Ошибка обновления', 'error');
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) {
    return <div className={styles.centerLayout}><div className={styles.loader}>Загрузка...</div></div>;
  }

  return (
    <div className={styles.wrapper}>
      {/* Уведомление теперь вынесено из контейнера и использует верные классы */}
      {notification.message && (
        <div className={`${styles.toastNotification} ${notification.type === 'error' ? styles.toastError : styles.toastSuccess}`}>
          {notification.type === 'error' ? (
            <AlertCircle size={20} />
          ) : (
            <Check size={20} className={styles.successCheckIcon} />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      <div className={styles.container}>
        <ProfileHeader user={user} navigate={navigate} />

        <div className={styles.navigationRow}>
          <Link to="/choice" className={styles.combinedNavButton}>
            <span className={styles.combinedLabel}>Мой выбор</span>
            <div className={styles.combinedBadges}>
              <div className={styles.iconWrapper}>
                <ShoppingCart size={20} className={styles.navIcon} />
                {stats.cartCount > 0 && <span className={`${styles.navBadge} ${styles.badgeCart}`}>{stats.cartCount}</span>}
              </div>
              <div className={styles.badgeDivider} />
              <div className={styles.iconWrapper}>
                <Heart size={20} className={styles.navIcon} />
                {stats.favoritesCount > 0 && <span className={`${styles.navBadge} ${styles.badgeFavorites}`}>{stats.favoritesCount}</span>}
              </div>
            </div>
          </Link>
        </div>

        <ProfileInfo
          user={user}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          editForm={editForm}
          setEditForm={setEditForm}
          handleUpdateProfile={handleUpdateProfile}
          updateLoading={updateLoading}
        />

        <ProfileOrders
          orders={orders}
          activeOrderId={activeOrderId}
          setActiveOrderId={setActiveOrderId}
          reviewContent={reviewContent}
          setReviewContent={setReviewContent}
          handleSendReview={handleSendReview}
          reviewLoading={reviewLoading}
        />

        <button className={styles.logoutButton} onClick={handleLogout}>
          <LogOut size={20} />
          <span>Выйти из профиля</span>
        </button>
      </div>
    </div>
  );
};