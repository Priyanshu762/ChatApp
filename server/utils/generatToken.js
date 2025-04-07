import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (res, userId) => {
    console.log("JWT",process.env.JWT_SECRET);
    console.log("UserId:",userId);
    
    if(!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
    }

    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "30d" });
    console.log("Token:",token);
    // Set cookie with appropriate options
    res.cookie("jwt", token, {
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        httpOnly: true,
        // secure: process.env.NODE_ENV === 'production', // Only use secure in production
        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax', // Use lax in development
        path: "/", // Ensure cookie is available for all paths
    });

    return token; // Return token for debugging purposes
}

export default generateTokenAndSetCookie;