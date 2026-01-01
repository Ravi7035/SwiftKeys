import jwt from "jsonwebtoken";

export const generateToken=(userId,res)=>
{
    const jwtSecret = process.env.JWT_SECRET || "fallback_secret_key_development_only";
    console.log("Generating token for userId:", userId, "using secret:", jwtSecret ? "defined" : "fallback");

    const token=jwt.sign({userId}, jwtSecret,
        {
            expiresIn:"10d"
        }
    );
    res.cookie("jwt",token,{
        sameSite:"lax",
        maxAge:10*24*60*60*1000,
        httpOnly:true,
        secure:process.env.NODE_ENV ==="Production"
    });
    console.log("Token generated and cookie set with maxAge:", 10*24*60*60*1000);
    return token
}
