import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';

import { authApi } from '../../auth/api/auth';
import { cartApi, favoritesApi } from './api';

import { ChoiceHeader } from '../components/ChoiceHeader';
import { CartTab } from '../components/CartTab';
import { FavoritesTab } from '../components/FavoritesTab';

import styles from './ChoicePage.module.css';

export const ChoicePage = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState('cart');

  const [cartItems, setCartItems] = useState([]);
  const [favoriteItems, setFavoriteItems] = useState([]);

  const [actionLoading, setActionLoading] = useState(false);

  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'success'
  });

  const showNotification = (
    message,
    type = 'success'
  ) => {
    setToast({
      show: true,
      message,
      type
    });
  };

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast({
          show: false,
          message: '',
          type: 'success'
        });
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

      const [cartData, favoritesData] =
        await Promise.all([
          cartApi
            .getByUserId(userData.id)
            .catch(() => []),

          favoritesApi
            .getByUserId(userData.id)
            .catch(() => [])
        ]);

      setCartItems(
        Array.isArray(cartData)
          ? cartData
          : []
      );

      setFavoriteItems(
        Array.isArray(favoritesData)
          ? favoritesData
          : []
      );
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
    const originalPrice =
      ticket?.price || 0;

    const discountPercent =
      ticket?.promotion?.discount || 0;

    if (discountPercent > 0) {
      return Math.round(
        originalPrice *
          (1 - discountPercent / 100)
      );
    }

    return originalPrice;
  };

  const handleUpdateQuantity = async (
    item,
    delta
  ) => {
    if (actionLoading) return;

    const currentQty =
      item.quantity || 1;

    const newQty =
      currentQty + delta;

    if (newQty < 1) return;

    try {
      setActionLoading(true);

      await cartApi.update(item.id, {
        quantity: Number(newQty)
      });

      setCartItems((prev) =>
        prev.map((i) =>
          i.id === item.id
            ? {
                ...i,
                quantity: newQty
              }
            : i
        )
      );
    } catch (err) {
      console.error(err);

      showNotification(
        'Не удалось изменить количество билетов',
        'error'
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveFromCart = async (
    itemId
  ) => {
    if (actionLoading) return;

    try {
      setActionLoading(true);

      await cartApi.remove(itemId);

      setCartItems((prev) =>
        prev.filter(
          (item) => item.id !== itemId
        )
      );

      showNotification(
        'Билет удален из корзины',
        'success'
      );
    } catch (err) {
      console.error(err);

      showNotification(
        'Не удалось удалить товар из корзины',
        'error'
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveFromFavorites =
    async (itemId) => {
      if (actionLoading) return;

      try {
        setActionLoading(true);

        await favoritesApi.remove(itemId);

        setFavoriteItems((prev) =>
          prev.filter(
            (item) => item.id !== itemId
          )
        );

        showNotification(
          'Удалено из избранного',
          'success'
        );
      } catch (err) {
        console.error(err);

        showNotification(
          'Не удалось удалить из избранного',
          'error'
        );
      } finally {
        setActionLoading(false);
      }
    };

  const handleMoveToCart = async (
    favItem
  ) => {
    if (actionLoading) return;

    try {
      setActionLoading(true);

      await cartApi.add({
        userId: Number(user.id),
        ticketId: Number(
          favItem.ticketId
        ),
        quantity: 1
      });

      await favoritesApi.remove(
        favItem.id
      );

      setFavoriteItems((prev) =>
        prev.filter(
          (item) =>
            item.id !== favItem.id
        )
      );

      const freshCart =
        await cartApi
          .getByUserId(user.id)
          .catch(() => []);

      setCartItems(
        Array.isArray(freshCart)
          ? freshCart
          : []
      );

      showNotification(
        'Билет успешно перемещен в корзину!',
        'success'
      );
    } catch (err) {
      console.error(err);

      showNotification(
        'Не удалось переместить билет в корзину',
        'error'
      );
    } finally {
      setActionLoading(false);
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce(
      (sum, item) =>
        sum +
        (item.ticket?.price || 0) *
          (item.quantity || 1),
      0
    );
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (sum, item) =>
        sum +
        getDiscountedPrice(
          item.ticket
        ) *
          (item.quantity || 1),
      0
    );
  };

  const calculateTotalDiscount =
    () => {
      return (
        calculateSubtotal() -
        calculateTotal()
      );
    };

  if (loading) {
    return (
      <div className={styles.centerLayout}>
        <div className={styles.loader}>
          Загрузка ваших списков...
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      {toast.show && (
        <div
          className={`${styles.toast} ${styles[toast.type]}`}
        >
          <span>{toast.message}</span>

          <button
            className={styles.toastClose}
            onClick={() =>
              setToast({
                show: false,
                message: '',
                type: 'success'
              })
            }
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className={styles.container}>
        <ChoiceHeader
          navigate={navigate}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          cartItems={cartItems}
          favoriteItems={favoriteItems}
        />

        {activeTab === 'cart' ? (
          <div className={styles.contentSection}>
            <CartTab
              cartItems={cartItems}
              actionLoading={
                actionLoading
              }
              handleUpdateQuantity={
                handleUpdateQuantity
              }
              handleRemoveFromCart={
                handleRemoveFromCart
              }
              getDiscountedPrice={
                getDiscountedPrice
              }
              calculateSubtotal={
                calculateSubtotal
              }
              calculateTotal={
                calculateTotal
              }
              calculateTotalDiscount={
                calculateTotalDiscount
              }
              navigate={navigate}
            />
          </div>
        ) : (
          <div className={styles.contentSection}>
            <FavoritesTab
              favoriteItems={
                favoriteItems
              }
              actionLoading={
                actionLoading
              }
              handleMoveToCart={
                handleMoveToCart
              }
              handleRemoveFromFavorites={
                handleRemoveFromFavorites
              }
              getDiscountedPrice={
                getDiscountedPrice
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};