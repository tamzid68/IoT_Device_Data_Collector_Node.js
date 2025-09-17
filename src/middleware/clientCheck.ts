import { Request, Response, NextFunction } from 'express';

export const checkClient = (req: Request, res: Response, next: NextFunction) => {
    const userAgent = req.headers['user-agent'];

    if (!userAgent) {
        // While some might consider a missing user-agent a red flag,
        // for an IoT API, it might be acceptable. If it's required, a 400 is appropriate.
        // If not, you could just proceed. For this review, we'll treat it as a bad request.
        return res.status(400).json({ message: 'Client user-agent header is missing.' });
    }

    if (isBlockedAgent(userAgent)) {
        return res.status(403).json({ message: 'Forbidden: Access from this client is blocked.' });
    }

    return next();
};

const isBlockedAgent = (userAgent: string | string[]): boolean => {
    const agents = Array.isArray(userAgent) ? userAgent : [userAgent];
    return agents.some(agent => blockedPatterns.some(pattern => pattern.test(agent)));
};

const blockedPatterns: RegExp[] = [
    /curl/i,
    /wget/i,
    /python-requests/i,
    /java/i,
    /php/i,
    /python/i,
    /go-http-client/i,
    /ruby/i,
    /httpclient/i
];

export default checkClient;