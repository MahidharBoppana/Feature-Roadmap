export const verificationEmailTemplate = ({ name, verificationUrl }) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>Verify your email</title>
      </head>

      <body style="
        margin: 0;
        padding: 40px 20px;
        background: #f4f4f5;
        font-family: Arial, sans-serif;
      ">
        <div style="
          max-width: 600px;
          margin: 0 auto;
          background: #ffffff;
          padding: 40px;
          border-radius: 12px;
        ">

          <h1 style="margin-bottom: 20px;">
            Welcome to FeatureHub
          </h1>

          <p>
            Hi ${name},
          </p>

          <p>
            Thanks for creating your FeatureHub account.
            Please verify your email address to continue.
          </p>

          <div style="margin: 30px 0;">
            <a
              href="${verificationUrl}"
              style="
                display: inline-block;
                padding: 12px 24px;
                background: #18181b;
                color: white;
                text-decoration: none;
                border-radius: 8px;
              "
            >
              Verify Email
            </a>
          </div>

          <p>
            This verification link will expire in 15 minutes.
          </p>

          <p>
            If you didn't create this account,
            you can safely ignore this email.
          </p>

          <p style="
            margin-top: 30px;
            color: #71717a;
            font-size: 14px;
          ">
            FeatureHub
          </p>

        </div>
      </body>
    </html>
  `;
};

export const passwordResetEmailTemplate = ({ name, resetUrl }) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>Reset your password</title>
      </head>

      <body
        style="
          margin: 0;
          padding: 40px;
          font-family: Arial, sans-serif;
          background: #f5f5f5;
        "
      >
        <div
          style="
            max-width: 600px;
            margin: auto;
            background: white;
            padding: 40px;
            border-radius: 12px;
          "
        >
          <h2>Hello ${name},</h2>

          <p>
            We received a request to reset your
            FeatureHub password.
          </p>

          <p>
            Click the button below to create a new password.
          </p>

          <a
            href="${resetUrl}"
            style="
              display: inline-block;
              padding: 12px 20px;
              background: #000;
              color: #fff;
              text-decoration: none;
              border-radius: 8px;
            "
          >
            Reset Password
          </a>

          <p style="margin-top: 30px;">
            This link expires in 15 minutes.
          </p>

          <p>
            If you didn't request a password reset,
            you can safely ignore this email.
          </p>
        </div>
      </body>
    </html>
  `;
};
