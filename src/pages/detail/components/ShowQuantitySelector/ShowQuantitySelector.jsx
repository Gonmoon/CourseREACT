import styles from './ShowDetailPage.module.css';

export const ShowQuantitySelector = ({ quantity, maxQuantity, actionLoading, onChange }) => {
  return (
    <div className={styles.quantitySelector}>
      <span className={styles.quantityLabel}>Количество:</span>
      <div className={styles.quantityControls}>
        <button 
          type="button"
          disabled={quantity <= 1 || actionLoading} 
          onClick={() => onChange(quantity - 1)}
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
          disabled={quantity >= maxQuantity || actionLoading} 
          onClick={() => onChange(quantity + 1)}
        >
          +
        </button>
      </div>
    </div>
  );
};