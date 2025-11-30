# FormSS Development Notes

## Project Overview
A complete Google Forms-style platform with modern UI/UX, built using:
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS + shadcn/ui
- Prisma + PostgreSQL
- NextAuth for authentication

## Architecture

### Frontend Structure
```
app/
├── dashboard/          # Protected routes
│   ├── page.tsx       # Forms list
│   ├── new/           # Create new form
│   └── [formId]/      # Form-specific pages
│       ├── builder/   # Drag-and-drop form builder
│       ├── analytics/ # Charts and statistics
│       └── responses/ # View individual responses
├── form/[publicId]/   # Public form submission
└── auth/signin/       # Authentication
```

### API Routes
```
/api/auth/[...nextauth]     # NextAuth handlers
/api/forms                  # CRUD operations
/api/forms/[id]/questions   # Question management
/api/forms/[id]/analytics   # Analytics data
/api/forms/[id]/export      # CSV export
/api/forms/[id]/responses   # Fetch responses
/api/public/[publicId]      # Public form access & submission
```

### Database Schema
- **User**: Authentication and ownership
- **Form**: Form metadata and settings
- **Question**: Individual questions with types and options
- **Response**: Submitted answers

## Key Features Implemented

### 1. Authentication
- Google OAuth via NextAuth
- Protected routes with middleware
- Session management

### 2. Dashboard
- Grid layout for forms
- Search and filter (frontend ready)
- Active/Inactive toggle
- Response count display
- Quick actions (Edit, Analytics, View)

### 3. Form Builder
- Drag-and-drop reordering (@dnd-kit)
- 10+ question types
- Real-time editing
- Option management for choice-based questions
- Linear scale configuration
- Required field toggle
- Duplicate/Delete questions
- Auto-save capability

### 4. Question Types
1. **Short Text**: Single-line input
2. **Long Text**: Multi-line textarea
3. **Multiple Choice**: Radio buttons
4. **Checkboxes**: Multi-select
5. **Dropdown**: Select menu
6. **Linear Scale**: 1-10 rating with labels
7. **Date**: Date picker
8. **Time**: Time picker
9. **File Upload**: File input (UI ready)
10. **Section Break**: Visual divider

### 5. Public Form Page
- Clean, responsive design
- Field validation
- Required field enforcement
- Thank you page
- Gradient background
- Mobile-optimized

### 6. Analytics
- Overview statistics
- Per-question breakdown
- Bar charts (Recharts)
- Pie charts
- Data tables with percentages
- Average calculation for linear scales
- Tabs for different views

### 7. Export
- CSV generation
- All responses included
- Question labels as headers
- Downloadable file

## Design System

### Colors
```css
Primary: #2563EB (Blue 600)
Secondary: #6366F1 (Indigo 500)
Background: #F9FAFB (Gray 50)
Text: #1F2937 (Gray 800)
Muted: #6B7280 (Gray 500)
```

### Components
- Fully rounded corners (rounded-xl, rounded-2xl)
- Subtle shadows with hover states
- Smooth transitions (ease-out)
- Card-based layouts
- Consistent spacing (4, 6, 8 units)

### Typography
- Font: Inter (Google Fonts)
- Headings: Bold, larger sizes
- Body: Regular weight
- Muted text for secondary info

## Installation & Setup

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Google OAuth credentials

### Quick Start
```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your credentials

# Generate Prisma Client
npm run db:generate

# Push schema to database
npm run db:push

# Run development server
npm run dev
```

### Environment Variables
```env
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl"
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
```

## Development Workflow

### Adding a New Question Type
1. Add constant to `lib/constants.ts`
2. Add label to `QUESTION_TYPE_LABELS`
3. Implement render logic in `QuestionBlock.tsx`
4. Implement public form logic in `app/form/[publicFormId]/page.tsx`
5. Update analytics if needed

### Modifying Database Schema
```bash
# Edit prisma/schema.prisma
# Then:
npm run db:push
# Or for migrations:
prisma migrate dev --name <migration_name>
```

### Adding New API Route
1. Create file in `app/api/...`
2. Implement GET/POST/PATCH/DELETE handlers
3. Add authentication check
4. Validate with Zod
5. Return NextResponse

## Testing Checklist

### Authentication
- [ ] Google sign-in works
- [ ] Session persists
- [ ] Middleware protects routes
- [ ] Sign out works

### Dashboard
- [ ] Forms list displays
- [ ] Create new form
- [ ] Toggle active/inactive
- [ ] Navigation works

### Form Builder
- [ ] Add questions
- [ ] Reorder with drag-and-drop
- [ ] Edit question text
- [ ] Change question type
- [ ] Add/edit options
- [ ] Toggle required
- [ ] Duplicate question
- [ ] Delete question
- [ ] Save form
- [ ] Publish form

### Public Form
- [ ] Form loads
- [ ] All question types render
- [ ] Validation works
- [ ] Required fields enforced
- [ ] Submission succeeds
- [ ] Thank you page shows

### Analytics
- [ ] Overview stats correct
- [ ] Charts render
- [ ] Data is accurate
- [ ] Export CSV works

## Performance Optimizations

### Implemented
- Server Components for data fetching
- Client Components only where needed
- Image optimization with Next.js Image
- CSS with Tailwind (JIT compilation)
- Prisma connection pooling

### Potential Improvements
- Add React Query for client state
- Implement pagination for large datasets
- Add skeleton loaders
- Image lazy loading
- Code splitting
- CDN for static assets

## Security Considerations

### Implemented
- NextAuth for secure authentication
- Middleware for route protection
- Database foreign keys and cascading
- Input validation with Zod
- SQL injection prevention (Prisma)

### Recommendations
- Add CSRF protection
- Rate limiting on API routes
- Input sanitization
- File upload validation
- Content Security Policy headers

## Deployment

### Vercel (Recommended)
```bash
vercel
# Follow prompts
# Set environment variables in dashboard
```

### Other Platforms
- Build: `npm run build`
- Start: `npm start`
- Ensure DATABASE_URL is accessible
- Set all environment variables

## Future Enhancements

### High Priority
- [ ] Email notifications
- [ ] Form templates
- [ ] Conditional logic (skip logic)
- [ ] File upload with storage

### Medium Priority
- [ ] Team collaboration
- [ ] Form folders/organization
- [ ] Duplicate forms
- [ ] Form themes/branding

### Low Priority
- [ ] Webhooks
- [ ] API access
- [ ] Advanced analytics
- [ ] White-labeling

## Common Issues & Solutions

### TypeScript Errors After Creating Files
**Solution**: Install dependencies first
```bash
npm install
```

### Prisma Client Not Found
**Solution**: Generate client
```bash
npm run db:generate
```

### Database Connection Failed
**Solution**: Check DATABASE_URL format
```
postgresql://USER:PASSWORD@HOST:PORT/DATABASE
```

### NextAuth Session Undefined
**Solution**: Check NEXTAUTH_URL and NEXTAUTH_SECRET

### Build Errors
**Solution**: 
1. Delete `.next` folder
2. Run `npm run build` again
3. Check for TypeScript errors

## API Documentation

### Forms API
```typescript
// List forms
GET /api/forms
Response: Form[]

// Create form
POST /api/forms
Body: { title: string, description?: string }
Response: Form

// Get form
GET /api/forms/[id]
Response: Form & { questions: Question[] }

// Update form
PATCH /api/forms/[id]
Body: Partial<Form>
Response: Form

// Delete form
DELETE /api/forms/[id]
Response: { success: boolean }
```

### Questions API
```typescript
// Update questions
PUT /api/forms/[id]/questions
Body: Question[]
Response: Question[]
```

### Public API
```typescript
// Get public form
GET /api/public/[publicId]
Response: Form & { questions: Question[] }

// Submit response
POST /api/public/[publicId]
Body: { answers: Record<string, any> }
Response: { success: boolean, responseId: string }
```

### Analytics API
```typescript
// Get analytics
GET /api/forms/[id]/analytics
Response: {
  overview: { totalResponses: number, lastResponse: Date }
  questions: QuestionAnalytics[]
}
```

## Code Style Guidelines

### TypeScript
- Use explicit types for function parameters
- Avoid `any` when possible
- Use interfaces for complex objects
- Enable strict mode

### React
- Functional components only
- Hooks for state management
- 'use client' for client components
- Server components by default

### CSS
- Tailwind classes preferred
- Custom CSS in globals.css
- Use design system colors
- Mobile-first responsive

### File Organization
- One component per file
- Co-locate related files
- Index files for easier imports
- Clear naming conventions

## Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [NextAuth Docs](https://next-auth.js.org)
- [Tailwind Docs](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)

### Tools
- [Prisma Studio](https://www.prisma.io/studio) - Database GUI
- [Vercel](https://vercel.com) - Deployment
- [NeonDB](https://neon.tech) - Serverless Postgres

---

**Last Updated**: November 2025
**Version**: 1.0.0
**Author**: FormSS Team
