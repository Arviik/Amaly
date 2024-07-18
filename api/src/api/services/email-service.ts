import nodemailer from "nodemailer";
import { prisma } from "../../utils/prisma";
import crypto from "crypto";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendEmail = async (to: string, subject: string, body: string) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      text: body,
      html: `<p>${body}</p>`,
    });
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export const createInvitation = async (
  organizationId: number,
  email: string
) => {
  const token = crypto.randomBytes(20).toString("hex");
  const invitation = await prisma.invitations.create({
    data: {
      email,
      organizationId,
      token,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Expiration après 24h
    },
  });
  await sendEmail(
    email,
    "Invitation à rejoindre l'organisation",
    `Vous avez été invité à rejoindre une organisation. Cliquez sur le lien suivant pour accepter l'invitation : ${process.env.FRONTEND_URL}/accept-invitation/${invitation.token}`
  );
  return invitation;
};

export const createResetPasswordToken = async (email: string) => {
  const user = await prisma.users.findUnique({ where: { email } });
  if (!user) {
    throw new Error("User not found");
  }
  const token = crypto.randomBytes(20).toString("hex");
  await prisma.resetPasswordTokens.create({
    data: {
      userId: user.id,
      token,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // Expiration après 1h
    },
  });
  await sendEmail(
    email,
    "Réinitialisation de votre mot de passe",
    `Pour réinitialiser votre mot de passe, cliquez sur le lien suivant : ${process.env.FRONTEND_URL}/reset-password/${token}`
  );
};
