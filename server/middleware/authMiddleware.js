const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authMiddleware = async(req, res, next) => {
    try {

        const token = req.cookies.taskifyyUserToken;

        if (!token) {
            return res.status(401).json({
                success: false,
                error: "Authorization denied: No token provided"
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded || !decoded.id) {
            return res.status(401).json({
                success: false,
                error: "Invalid token: User ID missing"
            });
        }

        // Find user
        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
            return res.status(404).json({
                success: false,
                error: "User not found"
            });
        }

        // Attach user
        req.user = user;
        next();

    } catch (error) {
        console.error("Auth middleware error:", error);

        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                success: false,
                error: "Invalid token"
            });
        }

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                error: "Token expired"
            });
        }

        return res.status(500).json({
            success: false,
            error: "Internal server error"
        });
    }
};

module.exports = authMiddleware;