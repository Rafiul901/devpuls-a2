import { Router } from "express";
import { issueController } from "./issue.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { findRole } from "../../middleware/findRole";
const router = Router();
router.post("/", authMiddleware, issueController.createIssue);
router.get('/', issueController.getIssues);
router.get('/:id', issueController.getOneIssue);
router.patch('/:id', authMiddleware, issueController.updateIssue);
router.delete('/:id', authMiddleware, findRole('maintainer'), issueController.deleteTheIssue);
export const issueRoutes = router;
//# sourceMappingURL=issue.route.js.map