const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) return res.status(401).json({ error: 'Access denied. No token provided.' });

  const token = authHeader.split(' ')[1]; 
  if (!token) return res.status(401).json({ error: 'Access denied. Invalid token format.' });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; 
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token.' });
  }
};

const verifySupporter = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user?.role && req.user.role.toUpperCase() !== 'SUPPORTER') {
      return res.status(403).json({ error: 'Access denied. Supporter authentication required.' });
    }
    next();
  });
};

const verifyNgo = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user?.role && req.user.role.toUpperCase() !== 'NGO') {
      return res.status(403).json({ error: 'Access denied. NGO authentication required.' });
    }
    next();
  });
};

verifyToken.verifyToken = verifyToken;
verifyToken.verifySupporter = verifySupporter;
verifyToken.verifyNgo = verifyNgo;

module.exports = verifyToken;