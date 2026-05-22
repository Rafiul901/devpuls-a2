import { pool } from "../../../db";
import bcrypt from "bcrypt";
import type { SignPayload } from "./auth.interface";

const userInDB=async(payload:SignPayload)=>{
const {name,email,password,role}=payload;

const existingUser =await pool.query(
    `SELECT * FROM users WHERE email=$1`,[email]
)
if(existingUser.rows.length>0){
    throw new Error("Already exists!")
}
const hashPassword = await bcrypt.hash(password,10);

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
  return result.rows[0]
}
export const authService ={
    userInDB,
}