import type { Request, Response } from "express";
import { issueInService } from "./issue.service";


const createIssue = async (
  req: Request,
  res: Response
) => {
  try {
    const user = (req as any).user;

    const result =
      await issueInService.issueIntoDB(
        req.body,
        user.id
      );

    res.status(201).json({
      success: true,
      message: "Issue created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
      errors: error,
    });
  }
};

export const issueController = {
  createIssue,
};