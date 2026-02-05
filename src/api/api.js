import axios from "axios";
const apiUrl = import.meta.env.VITE_BACKEND_URL;

const API = axios.create({
  baseURL: `${apiUrl}/api`
});

export const signup = (data) => API.post("/auth/signup", data);
export const login = (data) => API.post("/auth/login", data);
export const getProfile = (token) =>
  API.get("/user/profile", { headers: { Authorization: `Bearer ${token}` } });
export const updateWallet = (token, amount) =>
  API.put("/users/profile", { amount }, { headers: { Authorization: `Bearer ${token}` } });

// Wallet APIs
export const earnCredits = (token, amount) =>
  API.post("/user/wallet/earn", { amount }, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const spendCredits = (token, amount) =>
  API.post("/user/wallet/spend", { amount }, {
    headers: { Authorization: `Bearer ${token}` },
  });
