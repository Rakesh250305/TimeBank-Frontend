import axios from "axios";

const API = axios.create({
  // baseURL: "http://localhost:5000/api",
  baseURL: "https://timebank-backend-67l5.onrender.com/api" // backend deployed url
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
