import nodemailer from 'nodemailer';
import {WELCOME_EMAIL_TEMPLATE, NEWS_SUMMARY_EMAIL_TEMPLATE} from "@/lib/nodemailer/templates";

// Check if email credentials are configured
const isEmailConfigured = () => {
    return !!(process.env.NODEMAILER_EMAIL && process.env.NODEMAILER_PASSWORD);
};

// Create transporter only if credentials are available
export const transporter = isEmailConfigured()
    ? nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.NODEMAILER_EMAIL!,
            pass: process.env.NODEMAILER_PASSWORD!,
        }
    })
    : null;

export const sendWelcomeEmail = async ({ email, name, intro }: WelcomeEmailData) => {
    // Check if email is configured
    if (!isEmailConfigured() || !transporter) {
        console.warn('⚠️  Email not configured. Skipping welcome email.');
        console.warn('📧 To enable emails, please configure NODEMAILER_EMAIL and NODEMAILER_PASSWORD in .env');
        console.warn('📖 See SETUP_EMAIL.md for instructions');
        return { success: false, error: 'Email not configured' };
    }

    try {
        const htmlTemplate = WELCOME_EMAIL_TEMPLATE
            .replace('{{name}}', name)
            .replace('{{intro}}', intro);

        const mailOptions = {
            from: `"Signalist" <signalist@jsmastery.pro>`,
            to: email,
            subject: `Welcome to Signalist - your stock market toolkit is ready!`,
            text: 'Thanks for joining Signalist',
            html: htmlTemplate,
        }

        await transporter.sendMail(mailOptions);
        console.log(`✅ Welcome email sent to ${email}`);
        return { success: true };
    } catch (error) {
        console.error('❌ Failed to send welcome email:', error);
        return { success: false, error: 'Failed to send email' };
    }
}

export const sendNewsSummaryEmail = async (
    { email, date, newsContent }: { email: string; date: string; newsContent: string }
): Promise<{ success: boolean; error?: string }> => {
    // Check if email is configured
    if (!isEmailConfigured() || !transporter) {
        console.warn('⚠️  Email not configured. Skipping news summary email.');
        console.warn('📧 To enable emails, please configure NODEMAILER_EMAIL and NODEMAILER_PASSWORD in .env');
        console.warn('📖 See SETUP_EMAIL.md for instructions');
        return { success: false, error: 'Email not configured' };
    }

    try {
        const htmlTemplate = NEWS_SUMMARY_EMAIL_TEMPLATE
            .replace('{{date}}', date)
            .replace('{{newsContent}}', newsContent);

        const mailOptions = {
            from: `"Signalist News" <signalist@jsmastery.pro>`,
            to: email,
            subject: `📈 Market News Summary Today - ${date}`,
            text: `Today's market news summary from Signalist`,
            html: htmlTemplate,
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ News summary email sent to ${email}`);
        return { success: true };
    } catch (error) {
        console.error('❌ Failed to send news summary email:', error);
        return { success: false, error: 'Failed to send email' };
    }
};
