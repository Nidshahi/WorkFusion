import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import userRoutes from './routes/userRoutes.js';  // Include the `.js` extension if needed
import dotenv from 'dotenv';

dotenv.config();  // Load environment variables

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection URL from environment variable
const mongoUrl = process.env.MONGO_URI;

// Function to start the server
const startServer = () => {
  app.listen(8000, () => {
    console.log('Server is running on port 8000');
  });
};

// Connect to MongoDB and then start the server
mongoose.connect("mongodb://localhost:27017/workfusion")
  .then(() => {
    console.log('Connected to MongoDB');
    startServer();
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

// Use the user routes for API requests
app.use('/api', userRoutes);
