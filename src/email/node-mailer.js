import nodemailer from "nodemailer";
import { env } from "../config/env";
const transporter = nodemailer.createTransport({
    host: env.EMAIL_HOST,
    port: env.EMAIL_PORT,
    secure: true,
    auth: {
        user: env.EMAIL_USER,
        pass: env.EMAIL_PASS,
    },
});

const sendMail = async (to, subject, html) => {
    await transporter.sendMail({
        from: `${env.EMAIL_USER}`,
        to,
        subject,
        html,
    });
};

const sendVerificationEmail = async (email, token) => {
    await transporter.sendMail({
        from: `${env.EMAIL_USER}`,
        to: email,
        subject: "Verify your email",
        html: `<a href="${env.CLIENT_URL}/verify-email?token=${token}">Verify your email</a>`,
    });
};

export { sendMail, sendVerificationEmail };