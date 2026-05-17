import { Link } from 'react-router-dom';
import styles from './Button.module.css';

export const Button = ({ text, to }) => {
  if (to) {
    return (
      <Link to={to} className={styles.button}>
        {text}
      </Link>
    );
  }

  return (
    <button className={styles.button}>
      {text}
    </button>
  );
};