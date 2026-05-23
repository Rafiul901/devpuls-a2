DevPulse – Backend API


⚡ Features
User authentication (Signup / Login)
JWT-based secure authentication
Role-based access control:
Contributor
Maintainer
Issue management system:
Create issue (bug / feature request)
View all issues
View single issue
Update issue with permission rules
Delete issue (maintainer only)
Filtering & sorting:
by type (bug / feature_request)
by status (open / in_progress / resolved)
sort by newest / oldest
Secure password hashing using bcrypt
Clean modular backend architecture
Raw SQL queries (no ORM)

🛠️ Tech Stack
Node.js (LTS)
Express.js
TypeScript
PostgreSQL (Neon DB)
pg (native PostgreSQL driver)
bcrypt
jsonwebtoken
dotenv

⚙️ Setup Instructions
1. Clone project
git clone <your-repo-url>
cd devpulse
2. Install dependencies
npm install
3. Create .env file
PORT=5000
DATABASE_URL=your_neon_db_url
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=1d
4. Run database tables

Tables are auto-created on server start OR via init script.

5. Run project
npm run dev
6. Base URL
http://localhost:5000/api

📡 API Endpoints
🔐 Auth Routes
Signup
POST /api/auth/signup
Login
POST /api/auth/login
 Issues Routes
Create Issue (Auth required)
POST /api/issues
Get All Issues
GET /api/issues

Query options:

?sort=newest|oldest
?type=bug|feature_request
?status=open|in_progress|resolved
Get Single Issue
GET /api/issues/:id
Update Issue (Auth required)
PATCH /api/issues/:id
Delete Issue (Maintainer only)
DELETE /api/issues/:id

🗄️ Database Schema Summary
| Field      | Type             | Description              |
| ---------- | ---------------- | ------------------------ |
| id         | SERIAL           | Primary key              |
| name       | VARCHAR          | User full name           |
| email      | VARCHAR (unique) | Login email              |
| password   | TEXT             | Hashed password          |
| role       | VARCHAR          | contributor / maintainer |
| created_at | TIMESTAMP        | Auto timestamp           |
| updated_at | TIMESTAMP        | Auto timestamp           |
