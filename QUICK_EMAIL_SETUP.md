# Quick Email Setup Guide

## ⚡ 3-Minute Setup

### Step 1: Enable 2-Factor Authentication
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable "2-Step Verification" if not already enabled

### Step 2: Generate App Password
1. Go to [App Passwords](https://myaccount.google.com/apppasswords)
2. Sign in if prompted
3. In "App name" field, type: **Stock Tracker App**
4. Click **Create**
5. Copy the 16-character password (looks like: `abcd efgh ijkl mnop`)

### Step 3: Update .env File
Open your `.env` file and add:

```env
NODEMAILER_EMAIL=your-email@gmail.com
NODEMAILER_PASSWORD=abcd efgh ijkl mnop
```

**Example:**
```env
NODEMAILER_EMAIL=john.doe@gmail.com
NODEMAILER_PASSWORD=xyzw abcd efgh ijkl
```

### Step 4: Restart Server
```bash
# Press Ctrl+C to stop the server
npm run dev
```

---

## ✅ Test It

1. Create a new account at `/sign-up`
2. Check your email for the welcome message
3. Look for: "Welcome to Signalist - your stock market toolkit is ready!"

---

## 🚨 Common Issues

### "Invalid login" error
- Make sure you're using the **App Password**, not your regular Gmail password
- Verify 2FA is enabled on your Google account

### Email not received
- Check spam folder
- Verify credentials in `.env` are correct
- Check server logs for errors

---

## 📖 Need More Help?

See the detailed guide: [SETUP_EMAIL.md](./SETUP_EMAIL.md)

---

## 🔒 Security Note

⚠️ **NEVER commit your `.env` file to version control**
- The `.env` file is already in `.gitignore`
- Use environment variables in production (Vercel, Railway, etc.)
- Rotate App Passwords periodically

---

## 🎯 What Works Without Email?

Everything else works perfectly:
- ✅ Authentication (sign up, sign in, sign out)
- ✅ Stock search and viewing
- ✅ Watchlist management
- ✅ Price alerts creation/deletion
- ✅ All database operations

Only these features require email:
- ❌ Welcome emails (when users sign up)
- ❌ Daily news summary emails (12:00 PM daily)

**The app will work fine without email configured!**
