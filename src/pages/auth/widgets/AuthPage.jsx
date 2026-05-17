import { useState, useEffect } from 'react';
import styles from './AuthPage.module.css';
import { authApi } from '../api/auth';

export const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    repeatPassword: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm({
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      repeatPassword: '',
    });
    setErrors({});
  }, [isLogin]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    
    if (errors[name] || errors.main) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        delete next.main;
        return next;
      });
    }
  };

  const validate = () => {
    const newErrors = {};

    const emailTrimmed = form.email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailTrimmed) {
      newErrors.email = 'Email обязателен для заполнения';
    } else if (!emailRegex.test(emailTrimmed)) {
      newErrors.email = 'Некорректный формат email';
    }

    if (!form.password) {
      newErrors.password = 'Пароль обязателен для заполнения';
    } else if (form.password.length < 6) {
      newErrors.password = 'Минимум 6 символов';
    }

    if (!isLogin) {
      const firstNameTrimmed = form.firstName.trim();
      const lastNameTrimmed = form.lastName.trim();

      if (!firstNameTrimmed) {
        newErrors.firstName = 'Имя обязательно для заполнения';
      } else if (firstNameTrimmed.length < 2) {
        newErrors.firstName = 'Имя слишком короткое';
      }

      if (!lastNameTrimmed) {
        newErrors.lastName = 'Фамилия обязательна для заполнения';
      } else if (lastNameTrimmed.length < 2) {
        newErrors.lastName = 'Фамилия слишком короткая';
      }

      if (form.password !== form.repeatPassword) {
        newErrors.repeatPassword = 'Пароли не совпадают';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);

      if (isLogin) {
        await authApi.login({ 
          email: form.email.trim(), 
          password: form.password 
        });
      } else {
        await authApi.register({
          email: form.email.trim(),
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          password: form.password,
        });
      }

      window.location.href = '/';
    } catch (error) {
      const serverMessage = error?.response?.data?.message || error?.response?.data?.error;
      const serverFieldsErrors = error?.response?.data?.errors;
      
      if (serverFieldsErrors) {
        setErrors(serverFieldsErrors);
      } else if (serverMessage) {
        if (serverMessage.toLowerCase().includes('email')) {
          setErrors({ email: serverMessage });
        } else {
          setErrors({ main: serverMessage });
        }
      } else if (error?.response?.status === 401) {
        setErrors({ main: 'Неверная почта или пароль' });
      } else {
        setErrors({ main: 'Ошибка соединения с сервером' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <h2 className={styles.title}>{isLogin ? 'Вход' : 'Регистрация'}</h2>

        <div className={styles.inputField}>
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />
          {errors.email && <span className={styles.errorText}>{errors.email}</span>}
        </div>

        {!isLogin && (
          <>
            <div className={styles.inputField}>
              <input
                name="firstName"
                placeholder="Имя"
                value={form.firstName}
                onChange={handleChange}
              />
              {errors.firstName && <span className={styles.errorText}>{errors.firstName}</span>}
            </div>

            <div className={styles.inputField}>
              <input
                name="lastName"
                placeholder="Фамилия"
                value={form.lastName}
                onChange={handleChange}
              />
              {errors.lastName && <span className={styles.errorText}>{errors.lastName}</span>}
            </div>
          </>
        )}

        <div className={styles.inputField}>
          <input
            type="password"
            name="password"
            placeholder="Пароль"
            value={form.password}
            onChange={handleChange}
          />
          {errors.password && <span className={styles.errorText}>{errors.password}</span>}
        </div>

        {!isLogin && form.password.length > 0 && (
          <div className={styles.inputField}>
            <input
              type="password"
              name="repeatPassword"
              placeholder="Повторите пароль"
              value={form.repeatPassword}
              onChange={handleChange}
            />
            {errors.repeatPassword && (
              <span className={styles.errorText}>{errors.repeatPassword}</span>
            )}
          </div>
        )}

        {errors.main && <div className={styles.errorText} style={{ textAlign: 'center' }}>{errors.main}</div>}

        <button type="submit" disabled={loading}>
          {loading ? 'Загрузка...' : isLogin ? 'Войти' : 'Зарегистрироваться'}
        </button>

        <p className={styles.switch} onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Нет аккаунта? Регистрация' : 'Уже есть аккаунт? Войти'}
        </p>
      </form>
    </div>
  );
};