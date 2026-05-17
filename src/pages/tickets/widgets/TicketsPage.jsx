import { useEffect, useState } from 'react';
import styles from './TicketsPage.module.css';

import { ticketsApi } from '../api/api';

import { TicketsManager } from '../components/TicketsManager';
import { Tickets } from '../components/Tickets';

export const TicketsPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('');

  const limit = 6;

  useEffect(() => {
    loadTickets();
  }, [page, query, sort]);

  const loadTickets = async () => {
    try {
      setLoading(true);

      const data = await ticketsApi.getTickets({
        page,
        limit,
        q: query,
        sort,
      });

      setTickets(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setQuery(value);
    setPage(1);
  };

  const handleSort = (type) => {
    setSort(type);
    setPage(1);
  };

  return (
    <section className={styles.section}>
      <TicketsManager
        query={query}
        onSearch={handleSearch}
        onSort={handleSort}
      />

      <Tickets
        tickets={tickets}
        loading={loading}
        page={page}
        setPage={setPage}
        limit={limit}
      />
    </section>
  );
};