import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'

dotenv.config();

const ProtectAdmin = express.Router();
const SECRET_KEY = process.env.SECRET_KEY;

const verifyToken = async (req, res, next) => {
  const token = req.cookies.token;


  //console.log('Token:', token);

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = await jwt.verify(token, SECRET_KEY);

    console.log('Decoded Token:', decoded);

    req.decoded = decoded;
    
    next();
  } catch (error) {
    console.error('Token Verification Error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

ProtectAdmin.get('/', verifyToken, (req, res) => {
  const decoded = req.decoded; 
  const isAuthenticated = decoded !== undefined;

  if (decoded) {
   // console.log('User role:', decoded.role);
    //res.json( decoded.role);
    res.json({isAuthenticated});

  } else {
    console.log('No decoded information available');
    res.status(401).json({ message: 'Unauthorized' });
  }
});

export default ProtectAdmin;
