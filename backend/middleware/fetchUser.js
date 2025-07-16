import jwt from 'jsonwebtoken';
const code = process.env.JWT_SECRET|| '1234'; // Fallback for testing
const fetchUser = async (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        return res.status(401).json({ error: "Please authenticate using a valid token" });
    }

    try {
        const decoded = jwt.verify(token," "+ process.env.JWT_SECRET);
        req.userId = decoded.userId; // ✅ This is the correct field
        console.log("fetched user", req.userId);
        next();
    } catch (error) {
        return res.status(401).json({ error: "Invalid or expired token" });
    }
};

export default fetchUser;
