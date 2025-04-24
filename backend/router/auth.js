import express from "express";
import pool from "../config.js";
import throwError from "../utils/throwError.js";
import errorMessages from "../utils/errorMessages.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

const findUserByName = async (name, columns = []) => {
  const sql = `SELECT ${
    columns.length ? columns.join(", ") : "*"
  } FROM users WHERE name = ?`;

  const [rows] = await pool.execute(sql, [name]);
  return rows[0] || null;
};

const userExists = async (columns) => {
  const sql = `SELECT id FROM users WHERE ${Object.keys(columns)
    .map((c) => `${c} = ?`)
    .join(" OR ")}`;

  const [rows] = await pool.execute(sql, Object.values(columns));
  return rows.length > 0;
};

const createUser = async ({ name, email, password, role }) => {
  await pool.execute(
    "INSERT INTO users(name, email, password, role) VALUES(?, ?, ?, ?)",
    [name, email, password, role]
  );
};

const generateToken = ({ id, role }) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET);

router.post("/login", async (req, res, next) => {
  try {
    const { name, password } = req.body;
    if (!name || !password) throwError(errorMessages.BAD_REQUEST);

    const user = await findUserByName(name, ["id", "password", "role"]);
    if (!user) throwError(errorMessages.NOT_FOUND);

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throwError(errorMessages.UNAUTHORIZED);

    res.send({ token: generateToken(user) });
  } catch (error) {
    next(error);
  }
});

router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password, role = "user" } = req.body;
    if (!name || !email || !password) throwError(errorMessages.BAD_REQUEST);

    const exists = await userExists({ name, email });
    if (exists) throwError(errorMessages.CONFLICT);

    const hash = await bcrypt.hash(password, 10);

    await createUser({ name, email, password: hash, role });

    const user = await findUserByName(name, ["id"]);
    res.send({ token: generateToken({ id: user.id, role }) });
  } catch (error) {
    next(error);
  }
});

export default router;
