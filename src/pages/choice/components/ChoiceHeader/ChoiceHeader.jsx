import { ArrowLeft, ShoppingCart, Heart } from 'lucide-react';
import styles from './ChoiceHeader.module.css';

export const ChoiceHeader = ({
  navigate,
  activeTab,
  setActiveTab,
  cartItems,
  favoriteItems
}) => {
  return (
    <>
      <div className={styles.header}>
        <button
          className={styles.backLink}
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={20} />
          <span>Назад</span>
        </button>

        <h1 className={styles.title}>Мой выбор</h1>
      </div>

      <div className={styles.tabsRow}>
        <button
          className={`${styles.tabButton} ${
            activeTab === 'cart' ? styles.tabActive : ''
          }`}
          onClick={() => setActiveTab('cart')}
        >
          <ShoppingCart size={18} />
          <span>Корзина</span>
          <span className={styles.tabBadge}>
            {cartItems.length}
          </span>
        </button>

        <button
          className={`${styles.tabButton} ${
            activeTab === 'favorites' ? styles.tabActive : ''
          }`}
          onClick={() => setActiveTab('favorites')}
        >
          <Heart size={18} />
          <span>Избранное</span>
          <span className={styles.tabBadge}>
            {favoriteItems.length}
          </span>
        </button>
      </div>
    </>
  );
};