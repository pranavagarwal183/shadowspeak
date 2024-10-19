import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { username, code } = await request.json();
        
        // Validate incoming data
        if (!username || !code) {
            return Response.json({
                success: false,
                message: "Username and verification code are required."
            }, {
                status: 400
            });
        }

        const decodedUsername = decodeURIComponent(username);
        const user = await UserModel.findOne({ username: decodedUsername });

        if (!user) {
            console.error("User not found for username:", decodedUsername);
            return Response.json({
                success: false,
                message: "User not found"
            }, {
                status: 404  // Changed to 404
            });
        } 

        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

        if (isCodeValid && isCodeNotExpired) {
            user.isVerified = true;
            await user.save();
            return Response.json({
                success: true,
                message: "Account verified successfully"
            }, {
                status: 200
            });
        } else if (!isCodeNotExpired) {
            return Response.json({
                success: false,
                message: "Verification code has expired. Please sign up again to get a new code"
            }, {
                status: 400
            });
        } else { 
            return Response.json({
                success: false,
                message: "Incorrect verification code"
            }, {
                status: 400
            });
        }

    } catch (error) {
        console.error("Error verifying user:", error);
        return Response.json({
            success: false,
            message: "Error verifying user"
        }, {
            status: 500
        });
    }
}
