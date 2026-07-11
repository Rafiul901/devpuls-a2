#  DevPulse

## 🌐 Live URL

(https://devpuls-a2.vercel.app/) 

---

## ⚡ Features

* User authentication (Signup / Login)
* JWT-based authentication
* Role-based access control (Contributor / Maintainer)
* Issue management system:

  * Create issues (bug / feature request)
  * View all issues
  * View single issue
  * Update issues with permissions
  * Delete issues (maintainer only)
* Filtering & sorting:

  * Filter by type (bug / feature_request)
  * Filter by status (open / in_progress / resolved)
  * Sort by newest / oldest
* Secure password hashing using bcrypt
* Modular backend architecture
* Raw SQL (no ORM used)

---

## 🛠️ Tech Stack

* Node.js (LTS)
* Express.js
* TypeScript
* PostgreSQL (Neon DB)
* pg (native driver)
* bcrypt
* jsonwebtoken
* dotenv

---

## ⚙️ Setup Instructions

### 1. Clone repository

```bash
git clone <repo-url>
cd devpulse
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create `.env` file

```
PORT=5000
DATABASE_URL=your_neon_connection_string
JWT_SECRET=your_secret
JWT_EXPIRES_IN=1d
```

### 4. Run project

```bash
npm run dev
```

---

## 📡 API Endpoints

### 🔐 Auth

* POST `/api/auth/signup`
* POST `/api/auth/login`

---

###  Issues

* POST `/api/issues` (Auth required)
* GET `/api/issues`
* GET `/api/issues/:id`
* PATCH `/api/issues/:id` (Auth required)
* DELETE `/api/issues/:id` (Maintainer only)

---

### Query Options (GET /issues)

```
?sort=newest|oldest
?type=bug|feature_request
?status=open|in_progress|resolved
```

---

## 🗄️ Database Schema

### users

* id (PK)
* name
* email (unique)
* password
* role (contributor / maintainer)
* created_at
* updated_at

---

### issues

* id (PK)
* title
* description
* type
* status
* reporter_id
* created_at
* updated_at

---

## 🧠 Role Permissions

### Contributor

* Create issues
* View issues
* Update own open issues only

### Maintainer

* Full access
* Delete any issue
* Update any issue

---

## ✅ Notes

* No ORM used (pure SQL)
* No JOIN used (manual mapping)
* JWT authentication implemented
* bcrypt password hashing used
