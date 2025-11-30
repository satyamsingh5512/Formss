# FormSS - Modern Form Builder Platform

A full-featured, production-ready Google Forms-style platform built with Next.js 14, TypeScript, and modern technologies.

## 🚀 Features

### ✅ Implemented
- **Authentication**: Google OAuth with NextAuth
- **Dashboard**: Form management with search, filter, and pagination
- **Form Builder**: Drag-and-drop builder with 10+ question types
- **Public Forms**: Clean, responsive form submission pages
- **Analytics**: Real-time charts and statistics
- **Export**: CSV export functionality
- **Database**: PostgreSQL with Prisma ORM
- **UI/UX**: Modern design system with Tailwind + shadcn/ui

### 📋 Question Types
- Short Text
- Long Text (Textarea)
- Multiple Choice
- Checkboxes
- Dropdown
- Linear Scale (1-10)
- Date
- Time
- File Upload
- Section Break

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **Charts**: Recharts
- **Drag & Drop**: @dnd-kit
- **Forms**: React Hook Form + Zod

## 📁 Project Structure

```
formss/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/
│   │   ├── forms/
│   │   │   ├── [id]/
│   │   │   │   ├── questions/
│   │   │   │   ├── analytics/
│   │   │   │   └── export/
│   │   └── public/[publicId]/
│   ├── dashboard/
│   │   ├── [formId]/
│   │   │   ├── builder/
│   │   │   ├── analytics/
│   │   │   └── responses/
│   │   └── new/
│   ├── form/[publicFormId]/
│   ├── auth/signin/
│   └── layout.tsx
├── components/
│   ├── ui/ (shadcn components)
│   ├── form-builder/
│   ├── sidebar.tsx
│   └── providers.tsx
├── lib/
│   ├── auth.ts
│   ├── prisma.ts
│   ├── utils.ts
│   └── constants.ts
├── prisma/
│   └── schema.prisma
└── types/
    └── index.ts
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Google OAuth credentials

### 1. Clone and Install

```bash
cd /home/satym/Documents/projects/formss
npm install
```

### 2. Environment Setup

Create `.env` file:

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/formss"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### 3. Database Setup

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database
npm run db:push

# (Optional) Open Prisma Studio
npm run db:studio
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🔑 Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Go to Credentials → Create OAuth 2.0 Client ID
5. Add authorized redirect URI:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
6. Copy Client ID and Secret to `.env`

## 📊 Database Schema

```prisma
model User {
  id     String @id @default(cuid())
  email  String @unique
  name   String?
  forms  Form[]
}

model Form {
  id          String     @id @default(cuid())
  title       String
  description String?
  creatorId   String
  creator     User       @relation(fields: [creatorId], references: [id])
  questions   Question[]
  responses   Response[]
  isActive    Boolean    @default(true)
  isPublished Boolean    @default(false)
  publicId    String     @unique
}

model Question {
  id          String  @id @default(cuid())
  formId      String
  form        Form    @relation(fields: [formId], references: [id])
  type        String
  label       String
  required    Boolean @default(false)
  options     Json?
  order       Int
}

model Response {
  id        String   @id @default(cuid())
  formId    String
  form      Form     @relation(fields: [formId], references: [id])
  answers   Json
  createdAt DateTime @default(now())
}
```

## 🎨 Design System

### Colors

```css
Primary: #2563EB (Blue)
Secondary: #6366F1 (Indigo)
Background Light: #F9FAFB
Text: #1F2937
```

### Components

- Fully rounded corners (rounded-xl, rounded-2xl)
- Smooth hover animations
- Subtle shadows
- Consistent spacing

## 📝 API Routes

### Forms
- `GET /api/forms` - List all forms
- `POST /api/forms` - Create new form
- `GET /api/forms/[id]` - Get form details
- `PATCH /api/forms/[id]` - Update form
- `DELETE /api/forms/[id]` - Delete form

### Questions
- `POST /api/forms/[id]/questions` - Add question
- `PUT /api/forms/[id]/questions` - Update all questions

### Responses
- `POST /api/public/[publicId]` - Submit response
- `GET /api/forms/[id]/analytics` - Get analytics
- `GET /api/forms/[id]/export` - Export CSV

## 🏗️ Architecture

### Frontend
- Server Components for data fetching
- Client Components for interactivity
- Optimistic UI updates
- Skeleton loaders

### Backend
- API Routes with Next.js
- Prisma for type-safe database access
- Zod for validation
- NextAuth for authentication

### State Management
- React hooks (useState, useEffect)
- Zustand for complex state (optional)
- Server state via SWR/React Query (optional)

## 📦 Build for Production

```bash
npm run build
npm start
```

## 🚢 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Environment Variables
Set these in your deployment platform:
- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test
```

## 📖 Usage Guide

### Creating a Form

1. Sign in with Google
2. Click "Create New Form"
3. Add title and description
4. Click "Create Form"

### Building a Form

1. Add questions using the "+" button
2. Choose question type from dropdown
3. Configure options and settings
4. Reorder with drag & drop
5. Toggle "Required" for mandatory fields
6. Click "Publish" when ready

### Collecting Responses

1. Copy public form link
2. Share with respondents
3. View responses in real-time
4. Export to CSV

### Viewing Analytics

1. Go to form analytics page
2. View overview statistics
3. See per-question breakdowns
4. Visualize data with charts

## 🎯 Roadmap

- [ ] Email notifications
- [ ] Form templates
- [ ] Conditional logic
- [ ] File uploads
- [ ] Webhooks
- [ ] API access
- [ ] Team collaboration
- [ ] Custom branding

## 🤝 Contributing

This is a standalone project. Feel free to fork and customize.

## 📄 License

MIT License

## 🙏 Credits

Built with:
- Next.js
- Tailwind CSS
- shadcn/ui
- Prisma
- NextAuth

---

**Made with ❤️ for modern form building**
# Formss
