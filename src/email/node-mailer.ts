import nodemailer from "nodemailer";
import { env } from "../config/env.js";

const transporter = nodemailer.createTransport({
    host: env.EMAIL_HOST,
    port: env.EMAIL_PORT,
    secure: true,
    auth: {
        user: env.EMAIL_USER,
        pass: env.EMAIL_PASS,
    },
});

export const sendMail = async (to: string, subject: string, html: string) => {
    await transporter.sendMail({
        from: env.NO_REPLY_EMAIL,
        to,
        subject,
        html,
    });
};

export const sendVerificationEmail = async (email: string, userId: number, token: string) => {
    await transporter.sendMail({
        from: env.NO_REPLY_EMAIL,
        to: email,
        subject: "Verify your email - CineBook",
        html: `
        <div style="font-family: sans-serif; background-color: #0A0A0A; padding: 40px; color: white; border-radius: 8px;">
            <h2 style="color: #E50914; margin-bottom: 20px;">Welcome to CineBook!</h2>
            <p style="color: #ccc; font-size: 16px;">We are excited to have you on board. Please click the button below to verify your email address securely and activate your account.</p>
            <a href="${env.CLIENT_URL}/?userId=${userId}&token=${token}" style="display: inline-block; background-color: #E50914; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 20px;">
                Verify Email Address
            </a>
            <p style="color: #666; font-size: 12px; margin-top: 40px;">If you did not request this, please ignore this email.</p>
        </div>
        `,
    });
};
