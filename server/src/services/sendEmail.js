import { BrevoClient } from "@getbrevo/brevo";

const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY,
});

export const sendEmail = async ({ to, name, subject, htmlContent }) => {
  const response = await brevo.transactionalEmails.sendTransacEmail({
    sender: {
      email: process.env.EMAIL_FROM,
      name: process.env.EMAIL_FROM_NAME,
    },
    to: [
      {
        email: to,
        name,
      },
    ],
    subject,
    htmlContent,
  });

  return response;
};
