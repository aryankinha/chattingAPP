import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

// Verify RESEND_API_KEY is loaded
if (!process.env.RESEND_API_KEY) {
  console.error("❌ RESEND_API_KEY is not defined in environment variables");
} else {
  console.log("✅ RESEND_API_KEY loaded:", process.env.RESEND_API_KEY.substring(0, 10) + "...");
}

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOTPEmail = async (email, otp) => {
  try {
    console.log(`📧 Attempting to send OTP to: ${email}`);
    
    const result = await resend.emails.send({
      from: "onboarding@resend.dev", // Safe Resend test address
      to: email,
      subject: "Your MyChatApp OTP Code",
      html: `
      <div style="
        max-width: 450px;
        margin: auto;
        background: #ffffff;
        padding: 25px;
        border-radius: 12px;
        font-family: Arial, sans-serif;
        border: 1px solid #eee;
      ">
        <div style="text-align: center;">
          <div style="
            width: 60px;
            height: 60px;
            margin: auto;
            background: #FE795F;
            border-radius: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 28px;
            font-weight: bold;
          ">
            🔐
          </div>

          <h2 style="color: #3d3636; margin-top: 20px;">
            Your Verification Code
          </h2>

          <p style="color: #3d3636; font-size: 15px;">
            Use the OTP below to complete your signup on <strong>MyChatApp</strong>.
          </p>

          <div style="
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 6px;
            color: #FE795F;
            margin: 25px 0;
          ">
            ${otp}
          </div>

          <p style="color: #3d3636; font-size: 14px;">
            This code is valid for <strong>5 minutes</strong>.  
            If you did not request this, you can safely ignore this email.
          </p>

          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />

          <p style="color: #999; font-size: 12px;">
            © ${new Date().getFullYear()} MyChatApp — All Rights Reserved.
          </p>
        </div>
      </div>
      `,
    });
    
    console.log("✅ OTP email sent successfully to:", email);
    console.log("📬 Resend response:", result);
    return { success: true, data: result };
    
  } catch (error) {
    console.error("❌ Error sending OTP email:");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Full error:", error);
    
    // Don't crash the server, return error info
    return { 
      success: false, 
      error: error.message || "Failed to send OTP email" 
    };
  }
};
