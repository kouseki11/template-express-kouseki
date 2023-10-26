const jwt = require('jsonwebtoken')
const secretKey = process.env.SECRET_KEY;

// Middleware function
const userOrganization = (req, res, next) => {
  // Get the token from the Authorization header
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  // Check if a token is provided
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, secretKey);

    // Attach the decoded token payload to the request object for further use
    req.user = decoded;

    // Call the next middleware or route handler
    next();
  } catch (error) {
    console.error('Failed to authenticate token:', error);
    res.status(403).json({ error: 'Failed to authenticate token' });
  }
};

module.exports = userOrganization