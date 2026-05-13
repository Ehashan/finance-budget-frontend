# Finance Budget Frontend

Frontend application for the Personal Finance & Budget Tracking System.

This application provides a user-friendly interface for managing personal finances, including transaction tracking, budget management, category management, and dashboard analytics.

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
```

---

## Installation

Clone repository, move into project folder, and install dependencies:

```bash
git clone https://github.com/your-username/finance-budget-frontend.git && cd finance-budget-frontend && npm install
```

---

## Environment Variables

Create a `.env` file in the project root and add:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## Run Frontend

Start the development server:

```bash
npm run dev
```

Application will run at:

```bash
http://localhost:5173
```

---

## Build for Production

Create production build:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

---

## Backend Requirement

Make sure the backend server is running.

Default backend API:

```bash
http://localhost:5000/api
```

---

## Quick Start (One Command)

Complete setup and run in one command:

```bash
git clone https://github.com/your-username/finance-budget-frontend.git && cd finance-budget-frontend && npm install && npm run dev
```




## Future Improvements

- Financial analytics dashboard
- Charts and reports
- Dark mode support
- Export to PDF / Excel
- Recurring transactions
- Notifications

---

## Author

**Eranda Hashan**
