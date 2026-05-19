import { ArrowLeft, Shield } from 'lucide-react';
import styles from './ProfileHeader.module.css';

export const ProfileHeader = ({
  user,
  navigate,
}) => {
  return (
    <div className={styles.header}>
      <button
        className={styles.backLink}
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={20} />
        <span>Назад</span>
      </button>

      <div className={styles.avatarLarge}>
        {user.firstName?.[0]}
        {user.lastName?.[0]}
      </div>

      <h1 className={styles.fullName}>
        {user.firstName} {user.lastName}
      </h1>

      <p className={styles.roleBadge}>
        <Shield size={14} />
        <span>Зритель</span>
      </p>
    </div>
  );
};