import rateLimit from "../config/upstash.js";

const rateLimiter = async (req, res, next) => {
    try {
        const { success } = await rateLimit.limit("my-rate-limit"); 
        //in the limit method we can pass any unique identifier
        // like user id, ip address, etc
        //like, if u have user authentication implemented, use userId
        //since we don't have that, i just keep this is a string "my-rate-limit"
        //?why success is inside curly braces?
        // is because limit returns an object with success property 

        if (!success) {
            return res.status(429).json({ message: "Too many requests, please try again later." });
        }
        next();

    } catch (error) {
        console.error("Rate limiting error:", error);
        next(error);   
        //?next(error) is used to pass the error to the next middleware function  
    }
}

export default rateLimiter;