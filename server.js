const app = require('./app');
const mongoose = require('mongoose');

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
