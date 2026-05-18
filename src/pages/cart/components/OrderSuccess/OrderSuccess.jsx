import { useNavigate } from 'react-router-dom';
import { CheckCircle, FileText, Download } from 'lucide-react';
import { generateDOCX, generatePDF } from '../documentHelpers';
import styles from './CartPage.module.css';

export const OrderSuccess = ({ orderSuccess, cartItems, totalPrice, user }) => {
  const navigate = useNavigate();

  return (
    <div className={styles.successBlock}>
      <CheckCircle size={64} className={styles.successIcon} />
      <h1 className={styles.title}>Заказ успешно оформлен!</h1>
      <p className={styles.successText}>
        Номер вашего заказа: <strong>#{orderSuccess.id}</strong>. Благодарим за покупку! Пожалуйста, скачайте ваши билеты ниже.
      </p>

      <div className={styles.downloadActions}>
        <button 
          className={styles.downloadButton} 
          onClick={() => generateDOCX(orderSuccess, cartItems, totalPrice, user)}
        >
          <FileText size={20} />
          <span>Скачать в DOCX</span>
          <Download size={16} />
        </button>

        <button 
          className={styles.downloadButton} 
          onClick={() => generatePDF(orderSuccess, cartItems, totalPrice, user)}
        >
          <FileText size={20} />
          <span>Скачать в PDF</span>
          <Download size={16} />
        </button>
      </div>

      <button className={styles.homeButton} onClick={() => navigate('/')}>
        Вернуться на главную
      </button>
    </div>
  );
};