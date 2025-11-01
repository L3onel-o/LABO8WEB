// app.js
import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import cors from "cors";
import { pool } from "./database.js";
import userRoutes from "./routes/user.routes.js";
import verifyToken from "./middlewares/verifyToken.js";

const app = express();
const PORT = 5000;
const JWT_SECRET = "your_jwt_secret"; // Use a strong, secure key in production

app.use(express.json());
app.use(cors());

// Public endpoint to get a test token (for development only)
app.post("/get-test-token", (req, res) => {
  const { email } = req.body;
  
  const testUser = {
    id: 999,
    name: "Test User",
    email: email || "test@example.com"
  };

  const token = jwt.sign(
    {
      id: testUser.id,
      name: testUser.name,
      email: testUser.email
    },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
  
  res.status(200).json({ 
    token, 
    user: testUser,
    message: "Token generado (solo para desarrollo)"
  });
});

// Sign In endpoint
app.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1 LIMIT 1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const user = result.rows[0];

    // Verificar contraseña con bcrypt
    // const isPasswordValid = await bcrypt.compare(password, user.password);
    // if (!isPasswordValid) {
    //   return res.status(400).json({ message: "Credenciales inválidas" });
    // }

    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    res.status(200).json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.error("Error en /signin:", err);
    res.status(500).json({ message: "Error en el servidor", error: err.message });
  }
});

// Protected route example
app.get("/protected", verifyToken, (req, res) => {
  res.status(200).json({ message: "Protected data accessed", user: req.user });
});

// Mount user routes
app.use("/", userRoutes);

app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
