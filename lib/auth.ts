import { betterAuth } from "better-auth";
import { emailOTP } from "better-auth/plugins";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { Resend } from "resend";
import { getAuthDatabaseSync } from "./mongodb";

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  database: mongodbAdapter(getAuthDatabaseSync()),
  emailAndPassword: {
    enabled: false,
  },
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        if (process.env.RESEND_API_KEY === 'CONSOLE') {
          console.log(`Sending OTP to ${email}: ${otp}`);
          return;
        }
        
        await resend.emails.send({
          from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
          to: email,
          subject: type === "sign-in" 
            ? "Votre code de connexion" 
            : "Votre code de vérification",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>Code de vérification</h2>
              <p>Votre code de vérification est :</p>
              <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 20px 0;">
                ${otp}
              </div>
              <p>Ce code expirera dans 10 minutes.</p>
              <p>Si vous n'avez pas demandé ce code, ignorez cet email.</p>
            </div>
          `,
        });
      },
      // Configuration du code OTP à 6 chiffres
      otpLength: 6,
      expiresIn: 600, // 10 minutes en secondes
    }),
  ],
});

export type Session = typeof auth.$Infer.Session;
