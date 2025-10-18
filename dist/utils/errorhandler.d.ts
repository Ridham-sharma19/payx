declare class ApiError extends Error {
    statusCode: number;
    data: any;
    success: boolean;
    errors: string[];
    constructor(statusCode: number, message?: string, errors?: string[], stack?: string);
}
export { ApiError };
//# sourceMappingURL=errorhandler.d.ts.map