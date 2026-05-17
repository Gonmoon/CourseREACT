import { Routes, Route } from 'react-router-dom';

import { BurgerMenu } from '@shared/BurgerMenu';
import { Footer } from '@shared/Footer';

import { Main } from '@pages/main';

const TicketsPage = () => {
  return <div>Страница билетов</div>;
};

const ReviewsPage = () => {
  return <div>Страница отзывов</div>;
};

const AuthPage = () => {
  return <div>Вход и регистрация</div>;
};

export const App = () => {
  return (
    <>
      <BurgerMenu />

      <Routes>
        <Route path="/" element={<Main />} />

        <Route
          path="/tickets"
          element={<TicketsPage />}
        />

        <Route
          path="/reviews"
          element={<ReviewsPage />}
        />

        <Route
          path="/auth"
          element={<AuthPage />}
        />
      </Routes>

      <Footer />
    </>
  );
};