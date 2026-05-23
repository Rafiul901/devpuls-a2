// src/app.ts
import express from "express";
import cors from "cors";

// src/app/routes/index.ts
import { Router as Router3 } from "express";

// src/app/modules/auth/auth.route.ts
import { Router } from "express";

// src/db/index.ts
import { Pool } from "pg";

// src/config/index.ts
import dotenv from "dotenv";
dotenv.config();
var config_default = {
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  jwt_secret: process.env.JWT_SECRET,
  jwt_expires_in: process.env.JWT_EXPIRES_IN
};

// src/db/index.ts
var pool = new Pool({
  connectionString: config_default.database_url
});

// src/app/modules/auth/auth.service.ts
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
var userInDB = async (payload) => {
  const { name, email, password, role } = payload;
  const existingUser = await pool.query(
    `SELECT * FROM users WHERE email=$1`,
    [email]
  );
  if (existingUser.rows.length > 0) {
    throw new Error("Already exists!");
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const result = await pool.query(
    `
      INSERT INTO users(name, email, password, role)
      VALUES($1, $2, $3, $4)
      RETURNING
      id,
      name,
      email,
      role,
      created_at,
      updated_at
    `,
    [name, email, hashPassword, role || "contributor"]
  );
  return result.rows[0];
};
var loginUser = async (payload) => {
  const { email, password } = payload;
  const userResult = await pool.query(
    `SELECT * FROM users WHERE email = $1`,
    [email]
  );
  const user = userResult.rows[0];
  if (!user) {
    throw new Error("User not found");
  }
  const passwordMatched = await bcrypt.compare(
    password,
    user.password
  );
  if (!passwordMatched) {
    throw new Error("Incorrect password");
  }
  const jwtPayload = {
    id: user.id,
    name: user.name,
    role: user.role
  };
  const token = jwt.sign(
    jwtPayload,
    config_default.jwt_secret,
    {
      expiresIn: config_default.jwt_expires_in
    }
  );
  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
      updated_at: user.updated_at
    }
  };
};
var authService = {
  userInDB,
  loginUser
};

// src/app/modules/auth/auth.controller.ts
var signup = async (req, res) => {
  try {
    const result = await authService.userInDB(req.body);
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
var login = async (req, res) => {
  try {
    const result = await authService.loginUser(req.body);
    res.status(200).json({
      success: true,
      message: "You logged in!",
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
      errors: error
    });
  }
};
var authController = {
  signup,
  login
};

// src/app/modules/auth/auth.route.ts
var router = Router();
router.post("/signup", authController.signup);
router.post("/login", authController.login);
var authRoutes = router;

// src/app/modules/issues/issue.route.ts
import { Router as Router2 } from "express";

// src/app/modules/issues/issue.service.ts
var issueIntoDB = async (payload, reporterId) => {
  const { title, description, type } = payload;
  const result = await pool.query(
    `
    INSERT INTO issues
    (title, description, type, reporter_id)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `,
    [title, description, type, reporterId]
  );
  return result.rows[0];
};
var getIssuesDB = async (query) => {
  const {
    sort = "newest",
    type,
    status
  } = query;
  let sql = `SELECT * FROM issues`;
  const conditions = [];
  const values = [];
  if (type) {
    values.push(type);
    conditions.push(
      `type = $${values.length}`
    );
  }
  if (status) {
    values.push(status);
    conditions.push(
      `status = $${values.length}`
    );
  }
  if (conditions.length > 0) {
    sql += ` WHERE ${conditions.join(
      " AND "
    )}`;
  }
  sql += sort === "oldest" ? ` ORDER BY created_at ASC` : ` ORDER BY created_at DESC`;
  const issuesResult = await pool.query(
    sql,
    values
  );
  const issues = issuesResult.rows;
  const reporterIds = [
    ...new Set(
      issues.map(
        (issue) => issue.reporter_id
      )
    )
  ];
  let users = [];
  if (reporterIds.length > 0) {
    const userQuery = `
      SELECT id, name, role
      FROM users
      WHERE id = ANY($1)
    `;
    const usersResult = await pool.query(userQuery, [
      reporterIds
    ]);
    users = usersResult.rows;
  }
  const finalData = issues.map(
    (issue) => {
      const reporter = users.find(
        (user) => user.id === issue.reporter_id
      );
      return {
        id: issue.id,
        title: issue.title,
        description: issue.description,
        type: issue.type,
        status: issue.status,
        reporter,
        created_at: issue.created_at,
        updated_at: issue.updated_at
      };
    }
  );
  return finalData;
};
var singleIssueDB = async (issueId) => {
  const issueResult = await pool.query(
    `SELECT * FROM issues WHERE id = $1`,
    [issueId]
  );
  const issue = issueResult.rows[0];
  if (!issue) {
    throw new Error(
      "Issue is not available"
    );
  }
  const reporterResult = await pool.query(
    `
      SELECT id, name, role
      FROM users
      WHERE id = $1
      `,
    [issue.reporter_id]
  );
  const reporter = reporterResult.rows[0];
  return {
    id: issue.id,
    title: issue.title,
    description: issue.description,
    type: issue.type,
    status: issue.status,
    reporter,
    created_at: issue.created_at,
    updated_at: issue.updated_at
  };
};
var updateIssueDB = async (issueId, payload, user) => {
  const issueResult = await pool.query(
    `SELECT * FROM issues WHERE id = $1`,
    [issueId]
  );
  const issue = issueResult.rows[0];
  if (!issue) {
    throw new Error(
      "Issue not found"
    );
  }
  if (user.role === "contributor") {
    if (issue.reporter_id !== user.id) {
      throw new Error(
        "You can update only your own issue"
      );
    }
    if (issue.status !== "open") {
      throw new Error(
        "You cannot update the issues"
      );
    }
  }
  const {
    title,
    description,
    type,
    status
  } = payload;
  const result = await pool.query(
    `
      UPDATE issues
      SET
      title = COALESCE($1, title),
      description = COALESCE($2, description),
      type = COALESCE($3, type),
      status = COALESCE($4, status),
      updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING *
      `,
    [
      title,
      description,
      type,
      status,
      issueId
    ]
  );
  return result.rows[0];
};
var deleteIssueDB = async (issueId) => {
  const issueResult = await pool.query(
    `SELECT * FROM issues WHERE id = $1`,
    [issueId]
  );
  const issue = issueResult.rows[0];
  if (!issue) {
    throw new Error(
      "Issue not found"
    );
  }
  await pool.query(
    `
    DELETE FROM issues
    WHERE id = $1
    `,
    [issueId]
  );
};
var issueInService = {
  issueIntoDB,
  getIssuesDB,
  singleIssueDB,
  updateIssueDB,
  deleteIssueDB
};

// src/app/modules/issues/issue.controller.ts
var createIssue = async (req, res) => {
  try {
    const user = req.user;
    const result = await issueInService.issueIntoDB(
      req.body,
      user.id
    );
    res.status(201).json({
      success: true,
      message: "Issue created successfully",
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
      errors: error
    });
  }
};
var getIssues = async (req, res) => {
  try {
    const result = await issueInService.getIssuesDB(
      req.query
    );
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
var getOneIssue = async (req, res) => {
  try {
    const result = await issueInService.singleIssueDB(
      Number(req.params.id)
    );
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};
var updateIssue = async (req, res) => {
  try {
    const user = req.user;
    const result = await issueInService.updateIssueDB(
      Number(req.params.id),
      req.body,
      user
    );
    res.status(200).json({
      success: true,
      message: "Issue is Updated!",
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
var deleteTheIssue = async (req, res) => {
  try {
    await issueInService.deleteIssueDB(
      Number(req.params.id)
    );
    res.status(200).json({
      success: true,
      message: "Issue deleted successfully"
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};
var issueController = {
  createIssue,
  getIssues,
  getOneIssue,
  updateIssue,
  deleteTheIssue
};

// src/app/middleware/auth.middleware.ts
import jwt2 from "jsonwebtoken";
var authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "NO Token!"
      });
    }
    const token = authHeader;
    const decoded = jwt2.verify(token, config_default.jwt_secret);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Expired ot invalid"
    });
  }
};

// src/app/middleware/findRole.ts
var findRole = (...roles) => (req, res, next) => {
  const user = req.user;
  if (!roles.includes(user.role)) {
    return res.status(403).json({
      success: false,
      message: "Authorized!"
    });
  }
  next();
};

// src/app/modules/issues/issue.route.ts
var router2 = Router2();
router2.post(
  "/",
  authMiddleware,
  issueController.createIssue
);
router2.get("/", issueController.getIssues);
router2.get("/:id", issueController.getOneIssue);
router2.patch("/:id", authMiddleware, issueController.updateIssue);
router2.delete("/:id", authMiddleware, findRole("maintainer"), issueController.deleteTheIssue);
var issueRoutes = router2;

// src/app/routes/index.ts
var router3 = Router3();
router3.use("/auth", authRoutes);
var routes_default = router3;
router3.use("/issues", issueRoutes);

// src/app.ts
var app = express();
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("The server is running...");
});
app.use("/api", routes_default);
var app_default = app;

// src/db/dataDB.ts
var dataDB = async () => {
  try {
    await pool.query(
      `
            CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role VARCHAR(20) DEFAULT 'contributor'
        CHECK (role IN ('contributor', 'maintainer')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
            `
    );
    await pool.query(`
            CREATE TABLE IF NOT EXISTS issues (
        id SERIAL PRIMARY KEY,
        title VARCHAR(150) NOT NULL,
        description TEXT NOT NULL
        CHECK (LENGTH(description) >= 20),
        type VARCHAR(50) NOT NULL
        CHECK (type IN ('bug', 'feature_request')),
        status VARCHAR(50) DEFAULT 'open'
        CHECK (status IN ('open', 'in_progress', 'resolved')),
        reporter_id INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
            
            `);
    console.log("Added to the table");
  } catch (error) {
    console.log(error);
  }
};

// src/server.ts
var startServer = async () => {
  try {
    await pool.query("SELECT NOW()");
    console.log("Database connected successfully");
    await dataDB();
    app_default.listen(config_default.port, () => {
      console.log(`Server running on port ${config_default.port}`);
    });
  } catch (error) {
    console.log(error);
  }
};
startServer();
