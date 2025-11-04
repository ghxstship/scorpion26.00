import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
}

/**
 * Send an email using Resend
 */
export async function sendEmail({
  to,
  subject,
  html,
  from = process.env.EMAIL_FROM || 'noreply@scorpion26.com',
  replyTo,
}: EmailOptions) {
  try {
    if (!resend) {
      console.warn('Resend not configured - email not sent');
      return { success: false, error: 'Email service not configured' };
    }

    const { data, error } = await resend.emails.send({
      from,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      ...(replyTo && { replyTo }),
    });

    if (error) {
      console.error('Email send error:', error);
      throw new Error(error.message);
    }

    return { success: true, data };
  } catch (error: any) {
    console.error('Failed to send email:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Email templates
 */
export const emailTemplates = {
  welcome: (name: string, loginUrl: string) => ({
    subject: 'Welcome to Scorpion26!',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Scorpion26!</h1>
            </div>
            <div class="content">
              <p>Hi ${name},</p>
              <p>Welcome to Scorpion26! We're excited to have you join our fitness community.</p>
              <p>Get started by logging in to your dashboard:</p>
              <a href="${loginUrl}" class="button">Go to Dashboard</a>
              <p>If you have any questions, feel free to reach out to our support team.</p>
              <p>Best regards,<br>The Scorpion26 Team</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Scorpion26. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  passwordReset: (resetUrl: string) => ({
    subject: 'Reset Your Password',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
            .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Reset Your Password</h1>
            </div>
            <div class="content">
              <p>We received a request to reset your password.</p>
              <p>Click the button below to create a new password:</p>
              <a href="${resetUrl}" class="button">Reset Password</a>
              <div class="warning">
                <strong>Security Note:</strong> This link will expire in 1 hour. If you didn't request this reset, please ignore this email.
              </div>
              <p>Best regards,<br>The Scorpion26 Team</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Scorpion26. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  workoutReminder: (name: string, workoutName: string, workoutUrl: string) => ({
    subject: `Time for your workout: ${workoutName}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>💪 Workout Reminder</h1>
            </div>
            <div class="content">
              <p>Hi ${name},</p>
              <p>Don't forget about your scheduled workout today:</p>
              <h2 style="color: #667eea;">${workoutName}</h2>
              <p>You've got this! Let's crush it together.</p>
              <a href="${workoutUrl}" class="button">Start Workout</a>
              <p>Stay strong,<br>The Scorpion26 Team</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Scorpion26. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  subscriptionConfirmation: (name: string, planName: string, amount: string) => ({
    subject: 'Subscription Confirmed - Welcome!',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
            .details { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Subscription Confirmed!</h1>
            </div>
            <div class="content">
              <p>Hi ${name},</p>
              <p>Thank you for subscribing to Scorpion26!</p>
              <div class="details">
                <h3>Subscription Details:</h3>
                <p><strong>Plan:</strong> ${planName}</p>
                <p><strong>Amount:</strong> ${amount}</p>
              </div>
              <p>You now have full access to all our premium features.</p>
              <a href="${process.env.NEXT_PUBLIC_BASE_URL}/member/dashboard" class="button">Go to Dashboard</a>
              <p>Best regards,<br>The Scorpion26 Team</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Scorpion26. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  supportTicketNotification: (ticketId: string, userName: string, userEmail: string, subject: string, description: string, priority: string) => ({
    subject: `New Support Ticket: ${subject}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
            .details { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
            .priority-high { color: #dc3545; font-weight: bold; }
            .priority-medium { color: #ffc107; font-weight: bold; }
            .priority-low { color: #28a745; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎫 New Support Ticket</h1>
            </div>
            <div class="content">
              <p>A new support ticket has been submitted:</p>
              <div class="details">
                <p><strong>Ticket ID:</strong> ${ticketId}</p>
                <p><strong>User:</strong> ${userName} (${userEmail})</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Priority:</strong> <span class="priority-${priority}">${priority.toUpperCase()}</span></p>
                <p><strong>Description:</strong></p>
                <p>${description}</p>
              </div>
              <a href="${process.env.NEXT_PUBLIC_BASE_URL}/admin/support" class="button">View Ticket</a>
              <p>Please respond to this ticket as soon as possible.</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Scorpion26. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),
};
