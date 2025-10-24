# Email Configuration Guide (Nodemailer)

This application uses Nodemailer with Gmail to send emails for:
- Welcome emails when users sign up
- Daily market news summaries

## Prerequisites

- A Gmail account
- Gmail App Password (not your regular Gmail password)

## Step 1: Enable 2-Factor Authentication on Gmail

1. Go to your Google Account: https://myaccount.google.com/
2. Click on "Security" in the left sidebar
3. Under "How you sign in to Google", enable "2-Step Verification"
4. Follow the prompts to set it up

## Step 2: Generate an App Password

1. After enabling 2FA, go to: https://myaccount.google.com/apppasswords
2. You may need to sign in again
3. In the "App name" field, type something like "Stock Tracker App"
4. Click "Create"
5. Google will generate a 16-character password
6. **Copy this password** - you'll need it in the next step

## Step 3: Configure Your .env File

Open your `.env` file and add the following:

```env
NODEMAILER_EMAIL=your-email@gmail.com
NODEMAILER_PASSWORD=your-16-character-app-password
```

**Example:**
```env
NODEMAILER_EMAIL=john.doe@gmail.com
NODEMAILER_PASSWORD=abcd efgh ijkl mnop
```

**Important Notes:**
- Use your actual Gmail address for `NODEMAILER_EMAIL`
- Use the 16-character app password (with spaces) for `NODEMAILER_PASSWORD`
- Do NOT use your regular Gmail password
- Keep these credentials secure and never commit them to version control

## Step 4: Restart Your Development Server

After adding the credentials, restart your dev server:

```bash
npm run dev
```

## Testing Email Functionality

### Welcome Emails
1. Create a new account at `/sign-up`
2. Check the email inbox of the account you registered with
3. You should receive a personalized welcome email

### Daily News Summaries
The daily news summary is scheduled to run at 12:00 PM daily via cron.

To test it manually, you can trigger the Inngest function:
1. Visit your Inngest dashboard
2. Manually trigger the `app/send.daily.news` event

## Troubleshooting

### "Invalid login" error
- Make sure you're using an App Password, not your regular Gmail password
- Verify 2FA is enabled on your Google account
- Check that the email and password in `.env` are correct

### "Less secure app access" error
- This error occurs if you try to use your regular password
- You must use an App Password (see Step 2)

### Emails not being sent
- Check the server logs for errors
- Verify your `.env` file has the correct values
- Make sure your dev server has been restarted after adding credentials

### Port or connection errors
- Some networks block port 587 (SMTP)
- Try a different network or contact your network administrator

## Alternative Email Services

If you don't want to use Gmail, you can configure Nodemailer for other services:

### SendGrid
```env
NODEMAILER_HOST=smtp.sendgrid.net
NODEMAILER_PORT=587
NODEMAILER_USER=apikey
NODEMAILER_PASSWORD=your-sendgrid-api-key
```

### Outlook/Hotmail
```env
NODEMAILER_HOST=smtp.office365.com
NODEMAILER_PORT=587
NODEMAILER_USER=your-email@outlook.com
NODEMAILER_PASSWORD=your-password
```

You would need to update `lib/nodemailer/index.ts` to use these settings.

## Security Best Practices

1. **Never commit credentials** to version control
   - The `.env` file is already in `.gitignore`

2. **Use environment variables** in production
   - Most hosting providers (Vercel, Railway, etc.) allow you to set environment variables securely

3. **Rotate passwords periodically**
   - Generate a new App Password every few months

4. **Limit App Password scope**
   - Only generate App Passwords for apps you trust
   - Revoke App Passwords you're no longer using

## Production Deployment

When deploying to production:

1. Add the same environment variables to your hosting provider's dashboard
2. Consider using a dedicated email service like:
   - SendGrid (free tier: 100 emails/day)
   - Mailgun (free tier: 100 emails/day)
   - Amazon SES (pay-as-you-go)

3. These services offer better deliverability and analytics than Gmail

## Need Help?

- Nodemailer Documentation: https://nodemailer.com/
- Gmail App Passwords: https://support.google.com/accounts/answer/185833
- Gmail SMTP Settings: https://support.google.com/mail/answer/7126229
