import { Router } from "express";
import { issueController } from "./issue.controller";
import { authMiddleware } from "../../middleware/auth.middleware";


const router = Router()

router.post(
  "/",
  authMiddleware,
  issueController.createIssue
);
router.get('/',issueController.getIssues);
router.get('/:id',issueController.getOneIssue)

export const issueRoutes = router;