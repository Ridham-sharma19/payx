import { Request, Response, NextFunction, RequestHandler } from 'express';
declare const AsyncHandler: (fn: RequestHandler) => (req: Request, res: Response, next: NextFunction) => void;
export { AsyncHandler };
//# sourceMappingURL=asynhandler.d.ts.map