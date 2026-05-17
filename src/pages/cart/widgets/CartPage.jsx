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
  const [ticket, setTicket] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [cartItemId, setCartItemId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [error, setError] = useState(null);

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

        const cartItems = await cartApi.getByUserId(userData.id);
        
        if (!cartItems || cartItems.length === 0) {
          setError('Ваша корзина пуста. Нечего оформлять.');
          return;
        }

        const activeCartItem = cartItems[0]; 
        setCartItemId(activeCartItem.id);
        const qty = activeCartItem.quantity;

        const ticketData = await ticketsApi.getById(activeCartItem.ticketId);

        if (!ticketData) {
          setError('Информация о билете не найдена');
          return;
        }

        if (ticketData.quantity <= 0) {
          setError('Билетов больше нет в наличии');
          return;
        }

        if (qty > ticketData.quantity) {
          setError(`Доступно только ${ticketData.quantity} шт. В корзине отложено: ${qty} шт.`);
          return;
        }

        setTicket(ticketData);
        setQuantity(qty);
      } catch (err) {
        setError('Ошибка при загрузке данных корзины из базы');
      } finally {
        setLoading(false);
      }
    };
    initPage();
  }, [navigate]);

  const totalPrice = ticket ? ticket.price * quantity : 0;

  const handleCheckout = async () => {
    try {
      setIsProcessing(true);
      setError(null);

      const currentTicket = await ticketsApi.getById(ticket.id);
      if (quantity > currentTicket.quantity) {
        setError(`Ошибка: билеты закончились. Доступно для заказа: ${currentTicket.quantity} шт.`);
        return;
      }

      const response = await ordersApi.create({
        userId: user.id,
        ticketId: ticket.id,
        quantity: quantity,
        totalPrice: totalPrice
      });

      try {
        if (cartItemId) {
          await cartApi.remove(cartItemId);
        }
      } catch (cartErr) {
        console.error("Не удалось удалить товар из корзины после покупки", cartErr);
      }

      setOrderSuccess(response);
    } catch (err) {
      setError(err?.response?.data?.message || 'Не удалось совершить покупку');
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) return <div className={styles.center}><Loader className={styles.spin} /></div>;
  if (error && !ticket) return <div className={styles.center}><div className={styles.error}>{error}</div></div>;

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {!orderSuccess ? (
          <OrderCheckout 
            ticket={ticket}
            quantity={quantity}
            totalPrice={totalPrice}
            error={error}
            isProcessing={isProcessing}
            onCheckout={handleCheckout}
          />
        ) : (
          <OrderSuccess 
            orderSuccess={orderSuccess}
            ticket={ticket}
            quantity={quantity}
            totalPrice={totalPrice}
            user={user}
          />
        )}
      </div>
    </div>
  );
};