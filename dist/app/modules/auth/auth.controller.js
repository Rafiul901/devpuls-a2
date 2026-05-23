import { authService } from "./auth.service";
const signup = async (req, res) => {
    try {
        const result = await authService.userInDB(req.body);
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: result,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
const login = async (req, res) => {
    try {
        const result = await authService.loginUser(req.body);
        res.status(200).json({
            success: true,
            message: "You logged in!",
            data: result
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
            errors: error,
        });
    }
};
export const authController = {
    signup,
    login
};
//# sourceMappingURL=auth.controller.js.map