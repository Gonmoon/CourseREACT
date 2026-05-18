import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader } from 'lucide-react';
import { ticketsApi, ordersApi, cartApi } from '../api/api';
import { authApi } from '../../auth/api/auth';
import { OrderCheckout } from '../components/OrderCheckout';
import { OrderSuccess } from '../components/OrderSuccess';
import styles from './CartPage.module.css';

export const CartPage = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [error, setError] = useState(null);

  const getDiscountedPrice = (ticket) => {
    const originalPrice = ticket?.price || 0;
    const discountPercent = ticket?.promotion?.discount || 0;
    
    if (discountPercent > 0) {
      return Math.round(originalPrice * (1 - discountPercent / 100));
    }
    return originalPrice;
  };

  useEffect(() => {
    const initPage = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const userData = await authApi.me();
        if (!userData) {
          navigate('/auth');
          return;
        }
        setUser(userData);

        const items = await cartApi.getByUserId(userData.id);
        
        if (!items || items.length === 0) {
          setError('Ваша корзина пуста. Нечего оформлять.');
          return;
        }

        for (const item of items) {
          const ticketData = await ticketsApi.getById(item.ticketId);
          
          if (!ticketData) {
            setError('Информация о билете для одного из товаров не найдена');
            return;
          }

          if (ticketData.quantity <= 0) {
            setError(`Билетов на мероприятие "${ticketData.title}" больше нет в наличии`);
            return;
          }

          if (item.quantity > ticketData.quantity) {
            setError(`Недостаточно билетов на "${ticketData.title}". Доступно: ${ticketData.quantity} шт., в корзине: ${item.quantity} шт.`);
            return;
          }
          
          item.ticket = ticketData;
        }

        setCartItems(items);
      } catch (err) {
        setError('Ошибка при загрузке данных корзины из базы');
      } finally {
        setLoading(false);
      }
    };
    initPage();
  }, [navigate]);

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + getDiscountedPrice(item.ticket) * (item.quantity || 1), 0);
  };

  const handleCheckout = async () => {
    try {
      setIsProcessing(true);
      setError(null);

      for (const item of cartItems) {
        const currentTicket = await ticketsApi.getById(item.ticketId);
        if (item.quantity > currentTicket.quantity) {
          setError(`Ошибка: билеты на "${currentTicket.title}" закончились или их количество изменилось. Доступно: ${currentTicket.quantity} шт.`);
          return;
        }
      }

      const response = await ordersApi.create({
        userId: user.id,
        items: cartItems.map(item => ({
          ticketId: item.ticketId,
          quantity: item.quantity,
          price: getDiscountedPrice(item.ticket)
        })),
        totalPrice: calculateTotal()
      });

      await Promise.all(
        cartItems.map(item => 
          cartApi.remove(item.id).catch(cartErr => 
            console.error(`Не удалось удалить товар ${item.id} из корзины после покупки`, cartErr)
          )
        )
      );

      setOrderSuccess(response);
    } catch (err) {
      setError(err?.response?.data?.message || 'Не удалось совершить покупку');
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) return <div className={styles.center}><Loader className={styles.spin} /></div>;
  if (error && cartItems.length === 0) return <div className={styles.center}><div className={styles.error}>{error}</div></div>;

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {!orderSuccess ? (
          <OrderCheckout 
            cartItems={cartItems}
            totalPrice={calculateTotal()}
            error={error}
            isProcessing={isProcessing}
            onCheckout={handleCheckout}
          />
        ) : (
          <OrderSuccess 
            orderSuccess={orderSuccess}
            cartItems={cartItems}
            totalPrice={calculateTotal()}
            user={user}
          />
        )}
      </div>
    </div>
  );
};