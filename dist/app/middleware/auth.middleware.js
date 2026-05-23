import jwt from "jsonwebtoken";
import config from "../../config/index.js";
export const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "NO Token!",
            });
        }
        const token = authHeader;
        const decoded = jwt.verify(token, config.jwt_secret);
        req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(401).json({
            success: false,
            message: "Expired ot invalid",
        });
    }
};
//# sourceMappingURL=auth.middleware.js.map