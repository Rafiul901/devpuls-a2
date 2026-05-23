import { issueInService } from "./issue.service";
const createIssue = async (req, res) => {
    try {
        const user = req.user;
        const result = await issueInService.issueIntoDB(req.body, user.id);
        res.status(201).json({
            success: true,
            message: "Issue created successfully",
            data: result,
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
const getIssues = async (req, res) => {
    try {
        const result = await issueInService.getIssuesDB(req.query);
        res.status(200).json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
const getOneIssue = async (req, res) => {
    try {
        const result = await issueInService.singleIssueDB(Number(req.params.id));
        res.status(200).json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error.message,
        });
    }
};
const updateIssue = async (req, res) => {
    try {
        const user = req.user;
        const result = await issueInService.updateIssueDB(Number(req.params.id), req.body, user);
        res.status(200).json({
            success: true,
            message: "Issue is Updated!",
            data: result,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
const deleteTheIssue = async (req, res) => {
    try {
        await issueInService.deleteIssueDB(Number(req.params.id));
        res.status(200).json({
            success: true,
            message: "Issue deleted successfully",
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error.message,
        });
    }
};
export const issueController = {
    createIssue,
    getIssues,
    getOneIssue,
    updateIssue,
    deleteTheIssue
};
//# sourceMappingURL=issue.controller.js.map