import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationnnEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse>{
    try {
        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: "Feedback: Verification Code",
            react: VerificationEmail({username,otp: verifyCode}),
          });
        return {success: false,message: "Verification email sent successfully"}
    } catch (emailError) {
        console.log("Error sending verification email",emailError)
        return {success: false,message: "Failed to send verification email"}
    }
}