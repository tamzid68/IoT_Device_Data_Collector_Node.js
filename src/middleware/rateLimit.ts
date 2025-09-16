import rateLimit from 'express-rate-limit';

// Rate limiting middleware to limit repeated requests to public APIs and/or endpoints such as password reset.
const rateLimitMiddleware = rateLimit({
    windowMs: 10*1000,// 10 seconds
    max:5, // Limit each IP to 5 requests per `window` (here, per 10 seconds)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: 'Too many requests from this IP, please try again later.' 
});

export default rateLimitMiddleware;