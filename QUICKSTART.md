# 🚀 Quick Start Guide - Formlytic

Get your form builder running in 5 minutes!

## Prerequisites
- ✅ Node.js 18 or higher
- ✅ PostgreSQL database
- ✅ Google account (for OAuth setup)

## Step 1: Install Dependencies

```bash
cd /home/satym/Documents/projects/formss
npm install
```

## Step 2: Setup Environment

```bash
cp .env.example .env
```

Edit `.env` and add:

```env
# Database (required)
DATABASE_URL="postgresql://username:password@localhost:5432/formss"

# NextAuth (required)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="run: openssl rand -base64 32"

# Google OAuth (required)
GOOGLE_CLIENT_ID="your-client-id-here"
GOOGLE_CLIENT_SECRET="your-client-secret-here"
```

## Step 3: Google OAuth Setup

1. **Go to**: https://console.cloud.google.com/
2. **Create** a new project (or select existing)
3. **Enable** Google+ API
4. **Go to** Credentials → Create Credentials → OAuth 2.0 Client ID
5. **Application Type**: Web application
6. **Add Authorized Redirect URI**:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
7. **Copy** Client ID and Secret to `.env`

## Step 4: Setup Database

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database
npm run db:push
```

## Step 5: Run the App

```bash
npm run dev
```

Visit: **http://localhost:3000**

## ✨ You're Done!

- Sign in with Google
- Create your first form
- Start collecting responses!

## Common Issues

### "Cannot find module 'next'"
**Fix**: Run `npm install`

### "PrismaClient is unable to connect"
**Fix**: Check your DATABASE_URL in `.env`

### "Failed to fetch NextAuth session"
**Fix**: Verify NEXTAUTH_URL and NEXTAUTH_SECRET are set

### TypeScript errors
**Fix**: Normal until dependencies are installed

## Project Structure

```
formss/
├── app/                  # Next.js app directory
│   ├── dashboard/        # Dashboard pages
│   ├── form/            # Public forms
│   └── api/             # API routes
├── components/          # React components
├── lib/                 # Utilities & config
├── prisma/             # Database schema
└── types/              # TypeScript types
```

## Next Steps

### 1. Create Your First Form
- Click "Create New Form"
- Add questions
- Publish it

### 2. Customize Design
- Edit `tailwind.config.ts` for colors
- Modify `app/globals.css` for styles

### 3. Deploy to Production
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### 4. Add Features
- See `DEVELOPMENT.md` for architecture
- Check `README.md` for detailed docs

## Need Help?

- 📚 Full docs: `README.md`
- 🛠️ Developer guide: `DEVELOPMENT.md`
- 🐛 Issues: Check console for errors
- 📊 Database: Run `npm run db:studio` to view data

## Testing the Setup

### 1. Test Authentication
- Visit http://localhost:3000
- Click "Continue with Google"
- Should redirect to dashboard

### 2. Test Form Creation
- Click "Create New Form"
- Add title and description
- Should open form builder

### 3. Test Form Builder
- Add different question types
- Drag to reorder
- Click "Save" then "Publish"

### 4. Test Public Form
- Copy public form link
- Open in incognito/private window
- Submit a response

### 5. Test Analytics
- Go back to dashboard
- Click "Analytics" on your form
- View charts and data

## Production Checklist

Before deploying:

- [ ] Change NEXTAUTH_URL to production URL
- [ ] Generate new NEXTAUTH_SECRET
- [ ] Use production database
- [ ] Set up Google OAuth for production domain
- [ ] Enable HTTPS
- [ ] Test all features in production

## Performance Tips

- Use serverless PostgreSQL (NeonDB, Supabase)
- Enable Vercel Analytics
- Add caching where appropriate
- Optimize images
- Use ISR for public forms

## Security Checklist

- [ ] Environment variables secured
- [ ] Database credentials not in code
- [ ] CORS configured properly
- [ ] Rate limiting on API routes
- [ ] Input validation everywhere
- [ ] SQL injection protection (Prisma handles this)

---

**Estimated Setup Time**: 5-10 minutes

**Difficulty**: Beginner-friendly

**Support**: Check documentation files for help

Happy form building! 🎉
