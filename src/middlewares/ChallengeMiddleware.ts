import { IMiddleware } from "./IMiddleware";

export class ChallengeMiddleware implements IMiddleware{
    middleware({ req: {body: { challenge } }, res, next }){
        if(challenge){
            return res.json(challenge);
        }
        return next();
    }
}