require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const taskRoute = require('./routes/taskRoute');
const userRoute = require('./routes/userRoute')

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error(err));

// Use the routers for specific API endpoints
app.use('/api/users',userRoute);
app.use('/api/tasks',taskRoute); 


// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});