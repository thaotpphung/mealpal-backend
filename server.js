import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import userRoutes from './src/routes/users.js';
import planRoutes from './src/routes/plans.js';
import weekRoutes from './src/routes/weeks.js';
import dayRoutes from './src/routes/days.js';
import mealRoutes from './src/routes/meals.js';

const app = express();

// config
app.use(express.json({ limit: '30mb', extended: true }));
app.use(express.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());

// routes
app.use('/api/users', userRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/weeks', weekRoutes);
app.use('/api/days', dayRoutes);
app.use('/api/meals', mealRoutes);
app.get('/', (req, res) => {
  res.send('Welcome to MealPal API!');
});

// db config
const CONNECTION_URL = process.env.MONGODB_URI || 'mongodb://127.0.0.1/mealpal';
const PORT = process.env.PORT || 5000;
mongoose
  .connect(CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() =>
    app.listen(PORT, () =>
      console.log(`Server Running on ${CONNECTION_URL} : ${PORT}`)
    )
  )
  .catch((error) => console.log(`${error} did not connect`));
