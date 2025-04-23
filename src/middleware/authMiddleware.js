import jwt from "jsonwebtoken";

// Verify if the token is valid and attach user info to req
export const verifyToken = (req, res, next) => {
    const token = req.cookies?.token;

    if (!token) {
        return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // contains user id and role
        next();
    } catch (error) {
        return res.status(401).json({ error: "Invalid or expired token" });
    }
};

// Check if user has one of the allowed roles
export const checkRole = (roles) => (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({ error: "Access denied: insufficient permissions" });
    }
    next();
};