export declare const issueInService: {
    issueIntoDB: (payload: {
        title: string;
        description: string;
        type: "bug" | "feature_request";
    }, reporterId: number) => Promise<any>;
    getIssuesDB: (query: any) => Promise<{
        id: any;
        title: any;
        description: any;
        type: any;
        status: any;
        reporter: any;
        created_at: any;
        updated_at: any;
    }[]>;
    singleIssueDB: (issueId: number) => Promise<{
        id: any;
        title: any;
        description: any;
        type: any;
        status: any;
        reporter: any;
        created_at: any;
        updated_at: any;
    }>;
    updateIssueDB: (issueId: number, payload: any, user: any) => Promise<any>;
    deleteIssueDB: (issueId: number) => Promise<void>;
};
//# sourceMappingURL=issue.service.d.ts.map