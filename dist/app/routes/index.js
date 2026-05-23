import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.route";
import { issueRoutes } from "../modules/issues/issue.route";
const router = Router();
router.use('/auth', authRoutes);
export default router;
router.use('/issues', issueRoutes);
//# sourceMappingURL=index.js.map