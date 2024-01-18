const isAdmin = (req, res, next) => {
    const { user } = req; // Assuming user details are available in the request object
  
    if (user && user.role === 'admin') {
      // If user is an admin, proceed to the next middleware/route handler
      next();
    } else {
      // If user is not an admin, send a forbidden response (403)
      res.status(403).json({ message: 'Unauthorized. Admin access required.' });
    }
  };
  
  module.exports = isAdmin;
  