export const findRole = (...roles) => (req, res, next) => {
    const user = req.user;
    if (!roles.includes(user.role)) {
        return res.status(403).json({
            success: false,
            message: "Authorized!",
        });
    }
    next();
};
//# sourceMappingURL=findRole.js.map