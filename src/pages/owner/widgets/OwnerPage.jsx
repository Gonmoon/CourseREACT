import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../OwnerPage.module.css";

import { ownerApi } from "../api/api";

import {
  Users,
  Ticket,
  BadgePercent,
  ShoppingBag,
  FileText,
  MessageSquare,
  Trash2,
  Pencil,
  Plus,
  Save,
  X,
} from "lucide-react";

export const OwnerPage = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("tickets");

  const [users, setUsers] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [orders, setOrders] = useState([]);
  const [documents, setDocuments] = useState([]);

  const [editingId, setEditingId] = useState(null);

  const [ticketForm, setTicketForm] = useState({
    title: "",
    description: "",
    price: "",
    eventDate: "",
    posterUrl: "",
    quantity: "",
    promotionId: "",
  });

  const [promotionForm, setPromotionForm] = useState({
    title: "",
    description: "",
    discount: "",
  });

  const fetchAll = async () => {
    try {
      setLoading(true);

      const me = await ownerApi.me();

      if (
        me.firstName !== "admin" ||
        me.lastName !== "admin" ||
        me.email !== "admin@admin.com"
      ) {
        navigate("/");
        return;
      }

      const [
        usersData,
        ticketsData,
        promotionsData,
        reviewsData,
        ordersData,
        documentsData,
      ] = await Promise.all([
        ownerApi.getUsers(),
        ownerApi.getTickets(),
        ownerApi.getPromotions(),
        ownerApi.getReviews(),
        ownerApi.getOrders(),
        ownerApi.getDocuments(),
      ]);

      setUsers(usersData);
      setTickets(ticketsData);
      setPromotions(promotionsData);
      setReviews(reviewsData);
      setOrders(ordersData);
      setDocuments(documentsData);
    } catch (err) {
      console.error(err);
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const createTicket = async () => {
    await ownerApi.createTicket(ticketForm);

    setTicketForm({
      title: "",
      description: "",
      price: "",
      eventDate: "",
      posterUrl: "",
      quantity: "",
      promotionId: "",
    });

    fetchAll();
  };

  const createPromotion = async () => {
    await ownerApi.createPromotion(promotionForm);

    setPromotionForm({
      title: "",
      description: "",
      discount: "",
    });

    fetchAll();
  };

  if (loading) {
    return (
      <div className={styles.loader}>
        Загрузка панели owner...
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.sidebar}>
        <button
          className={activeTab === "tickets" ? styles.active : ""}
          onClick={() => setActiveTab("tickets")}
        >
          <Ticket size={18} />
          Билеты
        </button>

        <button
          className={activeTab === "users" ? styles.active : ""}
          onClick={() => setActiveTab("users")}
        >
          <Users size={18} />
          Пользователи
        </button>

        <button
          className={activeTab === "reviews" ? styles.active : ""}
          onClick={() => setActiveTab("reviews")}
        >
          <MessageSquare size={18} />
          Отзывы
        </button>

        <button
          className={activeTab === "orders" ? styles.active : ""}
          onClick={() => setActiveTab("orders")}
        >
          <ShoppingBag size={18} />
          Заказы
        </button>

        <button
          className={activeTab === "documents" ? styles.active : ""}
          onClick={() => setActiveTab("documents")}
        >
          <FileText size={18} />
          Документы
        </button>

        <button
          className={activeTab === "promotions" ? styles.active : ""}
          onClick={() => setActiveTab("promotions")}
        >
          <BadgePercent size={18} />
          Акции
        </button>
      </div>

      <div className={styles.content}>
        {activeTab === "tickets" && (
          <>
            <div className={styles.createCard}>
              <h2>Создать билет</h2>

              <input
                placeholder="Название"
                value={ticketForm.title}
                onChange={(e) =>
                  setTicketForm({
                    ...ticketForm,
                    title: e.target.value,
                  })
                }
              />

              <textarea
                placeholder="Описание"
                value={ticketForm.description}
                onChange={(e) =>
                  setTicketForm({
                    ...ticketForm,
                    description: e.target.value,
                  })
                }
              />

              <input
                placeholder="Цена"
                value={ticketForm.price}
                onChange={(e) =>
                  setTicketForm({
                    ...ticketForm,
                    price: e.target.value,
                  })
                }
              />

              <input
                type="datetime-local"
                value={ticketForm.eventDate}
                onChange={(e) =>
                  setTicketForm({
                    ...ticketForm,
                    eventDate: e.target.value,
                  })
                }
              />

              <input
                placeholder="Poster URL"
                value={ticketForm.posterUrl}
                onChange={(e) =>
                  setTicketForm({
                    ...ticketForm,
                    posterUrl: e.target.value,
                  })
                }
              />

              <input
                placeholder="Количество"
                value={ticketForm.quantity}
                onChange={(e) =>
                  setTicketForm({
                    ...ticketForm,
                    quantity: e.target.value,
                  })
                }
              />

              <input
                placeholder="Promotion ID"
                value={ticketForm.promotionId}
                onChange={(e) =>
                  setTicketForm({
                    ...ticketForm,
                    promotionId: e.target.value,
                  })
                }
              />

              <button onClick={createTicket}>
                + Создать
              </button>
            </div>

            <div className={styles.grid}>
              {tickets.map((ticket) => (
                <div key={ticket.id} className={styles.card}>
                  <img
                    src={ticket.posterUrl}
                    className={styles.poster}
                  />

                  <h3>{ticket.title}</h3>

                  <p>{ticket.description}</p>

                  <span>{ticket.price} ₽</span>

                  <div className={styles.actions}>
                    <button
                      onClick={async () => {
                        await ownerApi.deleteTicket(ticket.id);
                        fetchAll();
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === "users" && (
          <div className={styles.grid}>
            {users.map((user) => (
              <div key={user.id} className={styles.card}>
                <h3>
                  {user.firstName} {user.lastName}
                </h3>

                <p>{user.email}</p>

                <div className={styles.actions}>
                  <button
                    onClick={async () => {
                      await ownerApi.deleteUser(user.id);
                      fetchAll();
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "reviews" && (
          <div className={styles.grid}>
            {reviews.map((review) => (
              <div key={review.id} className={styles.card}>
                <h3>
                  { review.order.ticket.title }
                </h3>
                <h2>
                  {review.order.user.firstName} {review.order.user.lastName}
                  
                </h2>
                <p>{review.content}</p>

                <div className={styles.actions}>
                  <button
                    onClick={async () => {
                      await ownerApi.deleteReview(review.id);
                      fetchAll();
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "orders" && (
          <div className={styles.grid}>
            {orders.map((order) => (
              <div key={order.id} className={styles.card}>
                <h3>Заказ #{order.id}</h3>

                <p>
                  {order.ticket?.title} <br />
                  {order.user.firstName} {order.user.lastName}
                </p>

                <span>
                  {order.totalPrice} ₽
                </span>
              </div>
            ))}
          </div>
        )}

        {activeTab === "documents" && (
          <div className={styles.grid}>
            {documents.map((doc) => (
              <div key={doc.id} className={styles.card}>
                <h3>Документ #{doc.id}</h3>

                <p>{doc.type}</p>
                <p>{doc.order.ticket.title}</p>
                <p>{doc.order.user.firstName} {doc.order.user.lastName}</p>
                <p>номер заказа: {doc.order.id}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === "promotions" && (
          <>
            <div className={styles.createCard}>
              <h2>Создать акцию</h2>

              <input
                placeholder="Название"
                value={promotionForm.title}
                onChange={(e) =>
                  setPromotionForm({
                    ...promotionForm,
                    title: e.target.value,
                  })
                }
              />

              <textarea
                placeholder="Описание"
                value={promotionForm.description}
                onChange={(e) =>
                  setPromotionForm({
                    ...promotionForm,
                    description: e.target.value,
                  })
                }
              />

              <input
                placeholder="Скидка"
                value={promotionForm.discount}
                onChange={(e) =>
                  setPromotionForm({
                    ...promotionForm,
                    discount: e.target.value,
                  })
                }
              />

              <button onClick={createPromotion}>
                + Создать
              </button>
            </div>

            <div className={styles.grid}>
              {promotions.map((promotion) => (
                <div key={promotion.id} className={styles.card}>
                  <h3>{promotion.title} (ID {promotion.id})</h3>

                  <p>{promotion.description}</p>

                  <span>
                    {promotion.discount}%
                  </span>

                  <div className={styles.actions}>
                    <button
                      onClick={async () => {
                        await ownerApi.deletePromotion(
                          promotion.id
                        );
                        fetchAll();
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};