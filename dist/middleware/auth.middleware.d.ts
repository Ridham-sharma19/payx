import { IUserDocument } from "../models/user.mode.js";
declare global {
    namespace Express {
        interface Request {
            user?: IUserDocument;
        }
    }
}
export declare const verifyJwt: (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => void;
//# sourceMappingURL=auth.middleware.d.ts.map