import {
  User,
  Mail,
  Edit2,
  Check,
  X,
} from 'lucide-react';

import styles from './ProfileInfo.module.css';

export const ProfileInfo = ({
  user,
  isEditing,
  setIsEditing,
  editForm,
  setEditForm,
  handleUpdateProfile,
  updateLoading,
}) => {
  return (
    <div className={styles.infoGrid}>
      <div
        className={`${styles.infoCard} ${
          isEditing ? styles.fullWidthCard : ''
        }`}
      >
        <div className={styles.cardHeader}>
          <User size={20} className={styles.icon} />
          <h3>Личные данные</h3>

          {!isEditing && (
            <button
              className={styles.editBtn}
              onClick={() => setIsEditing(true)}
            >
              <Edit2 size={16} />
            </button>
          )}
        </div>

        {isEditing ? (
          <form
            onSubmit={handleUpdateProfile}
            className={styles.editForm}
          >
            <div className={styles.formRow}>
              <div className={styles.field}>
                <label className={styles.label}>
                  Имя
                </label>

                <input
                  type="text"
                  className={styles.input}
                  value={editForm.firstName}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      firstName: e.target.value,
                    })
                  }
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>
                  Фамилия
                </label>

                <input
                  type="text"
                  className={styles.input}
                  value={editForm.lastName}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      lastName: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.field}>
                <label className={styles.label}>
                  Новый пароль
                </label>

                <input
                  type="password"
                  className={styles.input}
                  value={editForm.password}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      password: e.target.value,
                    })
                  }
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>
                  Повторите пароль
                </label>

                <input
                  type="password"
                  className={styles.input}
                  value={editForm.confirmPassword}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      confirmPassword:
                        e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className={styles.editActions}>
              <button
                type="submit"
                className={styles.saveBtn}
                disabled={updateLoading}
              >
                <Check size={16} />
                <span>
                  {updateLoading
                    ? 'Сохранение...'
                    : 'Сохранить'}
                </span>
              </button>

              <button
                type="button"
                className={styles.cancelBtn}
                onClick={() => {
                  setIsEditing(false);

                  setEditForm({
                    firstName: user.firstName,
                    lastName: user.lastName,
                    password: '',
                    confirmPassword: '',
                  });
                }}
              >
                <X size={16} />
                <span>Отмена</span>
              </button>
            </div>
          </form>
        ) : (
          <div className={styles.cardContent}>
            <div className={styles.field}>
              <span className={styles.label}>
                Имя
              </span>

              <span className={styles.value}>
                {user.firstName}
              </span>
            </div>

            <div className={styles.field}>
              <span className={styles.label}>
                Фамилия
              </span>

              <span className={styles.value}>
                {user.lastName}
              </span>
            </div>
          </div>
        )}
      </div>

      {!isEditing && (
        <div className={styles.infoCard}>
          <div className={styles.cardHeader}>
            <Mail
              size={20}
              className={styles.icon}
            />
            <h3>Контакты</h3>
          </div>

          <div className={styles.cardContent}>
            <div className={styles.field}>
              <span className={styles.label}>
                Email
              </span>

              <span className={styles.value}>
                {user.email}
              </span>
            </div>

            <div className={styles.field}>
              <span className={styles.label}>
                Статус
              </span>

              <span className={styles.verified}>
                Подтвержден
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};