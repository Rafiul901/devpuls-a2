import { pool } from "../../../db";
import bcrypt from "bcrypt";
import config from "../../../config";
import jwt from "jsonwebtoken";
const userInDB = async (payload) => {
    const { name, email, password, role } = payload;
    const existingUser = await pool.query(`SELECT * FROM users WHERE email=$1`, [email]);
    if (existingUser.rows.length > 0) {
        throw new Error("Already exists!");
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(`
      INSERT INTO users(name, email, password, role)
      VALUES($1, $2, $3, $4)
      RETURNING
      id,
      name,
      email,
      role,
      created_at,
      updated_at
    `, [name, email, hashPassword, role || "contributor"]);
    return result.rows[0];
};
const loginUser = async (payload) => {
    const { email, password } = payload;
    const userResult = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
    const user = userResult.rows[0];
    if (!user) {
        throw new Error("User not found");
    }
    const passwordMatched = await bcrypt.compare(password, user.password);
    if (!passwordMatched) {
        throw new Error("Incorrect password");
    }
    const jwtPayload = {
        id: user.id,
        name: user.name,
        role: user.role,
    };
    const token = jwt.sign(jwtPayload, config.jwt_secret, {
        expiresIn: config.jwt_expires_in,
    });
    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            created_at: user.created_at,
            updated_at: user.updated_at,
        },
    };
};
export const authService = {
    userInDB,
    loginUser
};
//# sourceMappingURL=auth.service.js.map