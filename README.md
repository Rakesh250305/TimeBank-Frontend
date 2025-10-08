# 🕒 TimeBank Frontend

The **TimeBank Frontend** is a React-based web application that connects users who want to exchange time and skills.  
It provides a modern, user-friendly interface for signup, login, profile management, services, and community interaction.

---

## 🚀 Tech Stack

- **React.js (Vite)** – Frontend framework  
- **React Router DOM** – Navigation and routing  
- **Axios** – API communication  
- **Socket.io-client** – Real-time communication  
- **Tailwind CSS / CSS Modules** – Styling  
- **React Icons** – UI icons and visuals  

---

## 🧠 Key Features

✅ Step-by-step modern Signup (Personal, Academic, Address, Skills, Experience, Password)  
✅ User Login & Authentication (JWT-based)  
✅ Profile Page with skills, experience, and wallet  
✅ Services listing and creation  
✅ Notifications (real-time via Socket.io)  
✅ Footer with links (About, Contact, Privacy, Terms, Community)  
✅ Responsive UI  

---

## 📂 Folder Structure
TimeBank-frontend/
│
├── src/
│ ├── components/
│ │ ├── Navbar.jsx
│ │ ├── Footer.jsx
│ │ └── Home.jsx
│ │
│ ├── pages/
│ │ ├── Signup.jsx
│ │ ├── Login.jsx
│ │ ├── Profile.jsx
│ │ ├── Services.jsx
│ │ ├── About.jsx
│ │ ├── Contact.jsx
│ │ ├── Terms.jsx
│ │ ├── Privacy.jsx
│ │ └── Community.jsx
│ │
│ ├── assets/
│ │ └── default-profile.webp
│ │
│ ├── api/
│ │ └── api.js
│ │
│ ├── App.jsx
│ ├── main.jsx
│ └── App.css
│
├── package.json
└── vite.config.js

## ⚙️ Setup Instructions

### 1️⃣ Install Dependencies
# Terminal
- cd TimeBank-frontend
- npm install

# Run the frontend
- npm run dev

# Edit the API_URL inside src/api/api.js:
- export const API_URL = "http://localhost:5000/api";

## Author
# Rakesh Raikwar
- Final Year B.Tech CSE | Full-Stack Web Developer
- Email: rakesh.r250305@gmail.com
