import { Routes, Route } from 'react-router-dom';

import { BurgerMenu } from '@shared/BurgerMenu';
import { Footer } from '@shared/Footer';

import { Main } from '@pages/main';
import { TicketsPage } from '@pages/tickets';
import { AuthPage } from '@pages/auth';
import { ShowDetailPage } from '@pages/detail';
import { CartPage } from '@pages/cart';

const ReviewsPage = () => {
  return <div>Страница отзывов</div>;
};

const Profile = () => {
  return <div>Страница user</div>;
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
          path="/tickets/:id"
          element={<ShowDetailPage />}
        />

        <Route
          path="/reviews"
          element={<ReviewsPage />}
        />

        <Route
          path="/auth"
          element={<AuthPage />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        />

        <Route
          path="/cart"
          element={<CartPage />}
        />
      </Routes>

      <Footer />
    </>
  );
};