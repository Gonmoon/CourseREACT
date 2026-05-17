import { useEffect, useState } from 'react';
import styles from './PopularShows.module.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ShowCard } from '@shared/ShowCard';
import { ticketsApi } from '../../api/api';

export const PopularShows = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSort, setActiveSort] = useState('date-desc');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(3);

  const fetchTickets = async (sortType) => {
    try {
      setLoading(true);
      setCurrentSlide(0);

      const data = await ticketsApi.getPage({
        sort: sortType,
        limit: 12,
      });

      setTickets(data || []);
    } catch (error) {
      console.error('Ошибка при загрузке билетов:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets(activeSort);
  }, []);

  useEffect(() => {
    const updateCardsPerView = () => {
      if (window.innerWidth <= 768) {
        setCardsPerView(1);
      } else if (window.innerWidth <= 1200) {
        setCardsPerView(2);
      } else {
        setCardsPerView(3);
      }
    };

    updateCardsPerView();
    window.addEventListener('resize', updateCardsPerView);
    return () => window.removeEventListener('resize', updateCardsPerView);
  }, []);

  const handleSortChange = (type) => {
    if (type === activeSort) return;
    setActiveSort(type);
    fetchTickets(type);
  };

  const nextSlide = () => {
    if (currentSlide < tickets.length - cardsPerView) {
      setCurrentSlide((prev) => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  const dotsCount = Math.max(0, tickets.length - cardsPerView + 1);

  return (
    <section className={styles.section}>
      <div className={styles.top}>
        <div>
          <span className={styles.subtitle}>Афиша театра</span>
          <h2 className={styles.title}>Популярные спектакли</h2>
        </div>

        <div className={styles.actions}>
          <button
            className={`${styles.sortButton} ${activeSort === 'date-desc' ? styles.active : ''}`}
            onClick={() => handleSortChange('date-desc')}
          >
            Новые
          </button>

          <button
            className={`${styles.sortButton} ${activeSort === 'price-asc' ? styles.active : ''}`}
            onClick={() => handleSortChange('price-asc')}
          >
            Дешевле
          </button>

          <button
            className={`${styles.sortButton} ${activeSort === 'price-desc' ? styles.active : ''}`}
            onClick={() => handleSortChange('price-desc')}
          >
            Дороже
          </button>
        </div>
      </div>

      {loading ? (
        <div className={styles.loader}>Загрузка спектаклей...</div>
      ) : tickets.length > 0 ? (
        <>
          <div className={styles.sliderWrapper}>
            <button
              className={styles.arrow}
              onClick={prevSlide}
              disabled={currentSlide === 0}
            >
              <ChevronLeft size={24} />
            </button>

            <div className={styles.slider}>
              <div
                className={styles.track}
                style={{
                  transform: `translateX(-${currentSlide * (100 / cardsPerView)}%)`,
                }}
              >
                {tickets.map((ticket) => (
                  <div className={styles.slide} key={ticket.id}>
                    <ShowCard
                      id={ticket.id}
                      title={ticket.title}
                      image={ticket.posterUrl}
                      date={ticket.eventDate}
                      price={ticket.price}
                      quantity={ticket.quantity}
                    />
                  </div>
                ))}
              </div>
            </div>

            <button
              className={styles.arrow}
              onClick={nextSlide}
              disabled={currentSlide >= tickets.length - cardsPerView}
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {dotsCount > 1 && (
            <div className={styles.dots}>
              {Array.from({ length: dotsCount }).map((_, index) => (
                <button
                  key={index}
                  className={`${styles.dot} ${currentSlide === index ? styles.activeDot : ''}`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <div className={styles.empty}>Спектакли не найдены</div>
      )}
    </section>
  );
};