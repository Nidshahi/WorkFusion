import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/user.js';
dotenv.config();
export const verifyToken = async(req, res, next) => {
  try {
    // Get the token from headers
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findById(decoded.userId);
    // Attach user info (e.g., userId and role) to the request object
    req.userId = decoded.userId; // Manager or user ID
    req.role = decoded.role;
    req.email=decoded.email; // User's role, if required
    req.user=user;
    
    console.log('hello this is me',user)
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};
