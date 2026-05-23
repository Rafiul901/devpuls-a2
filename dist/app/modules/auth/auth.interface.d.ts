export interface SignPayload {
    name: string;
    email: string;
    password: string;
    role?: "controller" | "maintainer";
}
export interface UserResponse {
    id: number;
    name: string;
    email: string;
    role: string;
    created_at: Date;
    updated_at: Date;
}
//# sourceMappingURL=auth.interface.d.ts.map