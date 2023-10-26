const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;

const isAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ message: 'No token provided. You do not have permission.' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided. You do not have permission.' });
    }

    const decoded = jwt.verify(token, secretKey);

    // Check if the user has the "admin" role
    if (decoded && decoded.role === 'admin') {
      // User is an admin, allow access to the route
      next();
    } else {
      res.status(403).json({ message: 'You do not have permission to access this resource.' });
    }
  
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error while checking admin permission.' });
  }
};

module.exports = isAdmin;
