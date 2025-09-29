# Full Stack Personal Finance Tracker

[cite_start]A comprehensive personal finance application designed to help users manage their income, expenses, and gain insights through financial analytics[cite: 1, 3]. This project is built as a full-stack solution with robust user authentication and performance features.

---

## 🚀 Project Overview

[cite_start]The **Personal Finance Tracker** allows users to[cite: 3]:
* [cite_start]Manage and categorize their income and expense transactions[cite: 3, 24].
* [cite_start]View interactive financial analytics on a dashboard[cite: 3, 27].
* [cite_start]Utilize a **Role-Based Access Control (RBAC)** system to manage permissions[cite: 15].

---

## 🛠️ Tech Stack

### Frontend
* [cite_start]**Framework:** React 18+ [cite: 5]
* [cite_start]**Charting:** Chart.js or Recharts [cite: 9]

### Backend
* [cite_start]**Server:** Node.js with Express.js [cite: 6]
* [cite_start]**Database:** PostgreSQL [cite: 7]
* [cite_start]**Caching:** Redis [cite: 8, 62]

---

## ✨ Key Features

### 1. User Authentication & Authorization (RBAC)
[cite_start]The application includes JWT-based user registration and login with protected routes[cite: 12, 13, 14]. [cite_start]A robust **Role-Based Access Control (RBAC)** system manages user permissions[cite: 15, 75]:

| Role | Access Level | Permissions |
| :--- | :--- | :--- |
| **admin** | Full Access | [cite_start]Full access to all features, including user and data management[cite: 17, 78]. |
| **user** | Standard | [cite_start]Can manage (add, edit, delete) their own transactions and view their own analytics[cite: 18, 79, 23]. |
| **read-only** | View Only | [cite_start]Can view their own data (transactions and analytics) but cannot add, edit, or delete anything[cite: 19, 80, 26, 32]. |

### 2. Transaction Management
[cite_start]Users with `admin` or `user` roles can fully manage (add, edit, delete) income/expense transactions[cite: 23].
* [cite_start]Transaction categorization (e.g., Food, Transport, Entertainment)[cite: 24].
* [cite_start]Search and filter functionality[cite: 25].
* [cite_start]Pagination for large lists[cite: 35].

### 3. Dashboard and Analytics
[cite_start]All users, including `read-only`, can access the dashboard[cite: 32, 85]. [cite_start]Key analytics include[cite: 28, 29, 30]:
* [cite_start]Monthly/yearly spending overview[cite: 28].
* [cite_start]Category-wise expense breakdown (using a **Pie chart** [cite: 57][cite_start])[cite: 29].
* [cite_start]Income vs Expense trends (**Line chart** for monthly trends, **Bar chart** for income vs expenses)[cite: 30, 58, 59].

### 4. Performance & Security
* [cite_start]**Caching:** Redis is used to cache frequently accessed data, such as analytics (15 mins) and category lists (1 hour)[cite: 62, 63, 64].
* [cite_start]**Lazy Loading:** Implemented for route-based code splitting using `React.lazy()` and `React.Suspense`[cite: 50, 51, 52].
* [cite_start]**Rate Limiting:** Implemented via `express-rate-limit` for different endpoints (e.g., Auth: 5/15min, Transactions: 100/hr, Analytics: 50/hr)[cite: 66, 67, 69, 70, 71].
* [cite_start]**Security:** Measures are in place to prevent attacks like XSS and SQL Injection[cite: 73].

---

## ⚙️ Local Development Setup

Follow these instructions to get the project up and running on your local machine.

### Prerequisites
* Node.js (v18+)
* PostgreSQL
* Redis server instance

### 1. Clone the repository
```bash
git clone [YOUR_REPOSITORY_URL]
cd [project-root-directory]
