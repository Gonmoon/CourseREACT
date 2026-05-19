import axios from "axios";

const API = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

export const ownerApi = {
  me: async () => {
    const { data } = await API.get("/users/me");
    return data;
  },

  getUsers: async () => {
    const { data } = await API.get("/usersAdmin");
    return data;
  },

  updateUser: async (id, body) => {
    const { data } = await API.put(`/usersAdmin/${id}`, body);
    return data;
  },

  deleteUser: async (id) => {
    const { data } = await API.delete(`/usersAdmin/${id}`);
    return data;
  },

  getTickets: async () => {
    const { data } = await API.get("/tickets");
    return data;
  },

  createTicket: async (body) => {
    const { data } = await API.post("/tickets", body);
    return data;
  },

  updateTicket: async (id, body) => {
    const { data } = await API.put(`/tickets/${id}`, body);
    return data;
  },

  deleteTicket: async (id) => {
    const { data } = await API.delete(`/tickets/${id}`);
    return data;
  },

  getPromotions: async () => {
    const { data } = await API.get("/promotions");
    return data;
  },

  createPromotion: async (body) => {
    const { data } = await API.post("/promotions", body);
    return data;
  },

  updatePromotion: async (id, body) => {
    const { data } = await API.put(`/promotions/${id}`, body);
    return data;
  },

  deletePromotion: async (id) => {
    const { data } = await API.delete(`/promotions/${id}`);
    return data;
  },

  getReviews: async () => {
    const { data } = await API.get("/reviews");
    return data;
  },

  updateReview: async (id, body) => {
    const { data } = await API.put(`/reviews/${id}`, body);
    return data;
  },

  deleteReview: async (id) => {
    const { data } = await API.delete(`/reviews/${id}`);
    return data;
  },

  getOrders: async () => {
    const { data } = await API.get("/orders");
    return data;
  },

  getDocuments: async () => {
    const { data } = await API.get("/documents");
    return data;
  },
};