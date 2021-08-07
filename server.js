
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import userRoutes from "./routes/user.js";

const app = express();

// config
app.use(express.json({ limit: '30mb', extended: true }))
app.use(express.urlencoded({ limit: '30mb', extended: true }))
app.use(cors());

// routes
// app.use('/plan', planRoutes);
app.use("/api/users", userRoutes);

app.get('/', (req, res) => {
  res.send("Welcome to MealPal API!");
});

// db config
const CONNECTION_URL = process.env.MONGODB_URI || "mongodb://127.0.0.1/mealpal"
const PORT = process.env.PORT|| 8080;
mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => console.log(`Server Running on ${CONNECTION_URL} : ${PORT}`)))
  .catch((error) => console.log(`${error} did not connect`));