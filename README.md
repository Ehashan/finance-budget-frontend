# Finance Budget Frontend

Frontend application for the Personal Finance & Budget Tracking System.

This application provides a user-friendly interface for managing personal finances, including transaction tracking, budget planning, category management, and dashboard analytics.

---

## Features

- User Registration & Login
- JWT Authentication
- Dashboard Overview
- Add / Edit / Delete Transactions
- Budget Management
- Category Management
- Protected Routes
- Responsive UI
- API Integration with Backend

---

## Technologies Used

- React.js
- Vite
- Tailwind CSS
- Axios
- React Router DOM
- Context API

---

## Project Structure

```bash
finance-budget-frontend/
│
├── src/
│   ├── components/
│   │   └── TransactionForm.jsx
│   │
│   ├── context/
│   │   └── AuthContext.jsx
│   │
│   ├── hooks/
│   │
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Transactions.jsx
│   │   ├── Budgets.jsx
│   │   ├── Categories.jsx
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   │
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
│
├── .env
├── package.json
├── vite.config.js
└── README.md