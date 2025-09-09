# PayLater - Expense Tracking App

A modern, mobile-first expense tracking app for splitting bills with friends, built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Trip Management**: Create and manage trips/events with friends
- **Expense Tracking**: Add and split expenses easily
- **User Management**: Simple user management with password authentication
- **Balance Calculations**: Track who owes whom with automatic calculations
- **Mobile-First Design**: Responsive design optimized for mobile devices
- **QR Code Payments**: Upload QR codes for easy payment collection
- **Type Safety**: Full TypeScript support
- **Secure Authentication**: Password-protected access with environment variable configuration

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Form Handling**: React Hook Form + Zod
- **Icons**: Lucide React
- **Font**: Inter (Google Fonts)

## 📱 Design System

The authentication system follows the PayLater style guide:

- **Colors**: Indigo primary (#2563EB), semantic colors for feedback
- **Typography**: Inter font family, proper hierarchy
- **Spacing**: 8px baseline grid system
- **Components**: Rounded corners (rounded-xl), subtle shadows
- **Accessibility**: High contrast ratios, proper focus states

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Environment Setup

1. Create a `.env.local` file in the root directory:
   ```bash
   # PayLater App Configuration
   APP_PASSWORD=YourSecurePasswordHere
   
   # Database
   DATABASE_URL="file:./dev.db"
   
   # Next.js
   NEXTAUTH_SECRET=your-secret-key-here
   NEXTAUTH_URL=http://localhost:3000
   ```

2. For production deployment on Vercel, set these environment variables in your Vercel dashboard:
   - `APP_PASSWORD`: Your secure production password
   - `DATABASE_URL`: Your production database URL
   - `NEXTAUTH_SECRET`: A secure random string
   - `NEXTAUTH_URL`: Your production domain

   See [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md) for detailed configuration instructions.

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🎯 Core Functionality

### Trip Management
- Create trips with name, description, and dates
- Add members to trips easily
- View all your trips on the dashboard

### Expense Tracking
- Add expenses to trips with detailed information
- Split expenses equally, by percentage, or exact amounts
- Track who paid and who owes what

### User Management
- Add users by name (no authentication required)
- Manage user profiles and payment QR codes
- View user balances and payment history

## 📁 Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── api/               # API routes
│   │   ├── trips/         # Trip management endpoints
│   │   └── users/         # User management endpoints
│   ├── dashboard/         # Main dashboard page
│   └── trips/             # Trip detail pages
├── components/            # Reusable UI components
│   ├── trip/             # Trip-related components
│   ├── user/             # User-related components
│   └── ui/               # Base UI components
└── lib/                  # Utilities and stores
    ├── db.ts             # Database connection
    └── utils.ts          # Utility functions
```

## 🎨 Component Library

### Button
- **Variants**: Primary, Secondary, Danger
- **Sizes**: Small, Default, Large
- **States**: Loading, Disabled, Active

### Input
- **Features**: Labels, Error states, Helper text
- **Validation**: Real-time error display
- **Accessibility**: Proper ARIA labels

### Forms
- **Validation**: Zod schema validation
- **Error Handling**: User-friendly error messages
- **State Management**: React Hook Form integration

## 🔒 Security Features

- **Password Requirements**: Strong password validation
- **Input Sanitization**: XSS prevention
- **Form Validation**: Client and server-side validation
- **Error Boundaries**: Graceful error handling

## 📱 Mobile-First Design

- **Responsive Layout**: Works on all screen sizes
- **Touch-Friendly**: Large tap targets (48px minimum)
- **Accessibility**: Proper contrast ratios and focus states
- **Performance**: Optimized for mobile devices

## 🚧 Development Notes

### API Endpoints
The current implementation includes:
- `/api/trips` - Trip creation and management
- `/api/users` - User management and profiles

### Database
- SQLite database with Prisma ORM
- Simple user model without authentication
- Trip and expense tracking models

### Error Handling
- Client-side validation errors
- Network error handling
- Graceful fallbacks with error boundaries

## 🔮 Future Enhancements

- [ ] OCR receipt processing
- [ ] Real-time updates with WebSocket
- [ ] Push notifications
- [ ] PWA features (offline support)
- [ ] Advanced expense splitting options
- [ ] Export functionality for expense reports

## 📝 Contributing

1. Follow the established style guide
2. Ensure all components are mobile-first
3. Add proper TypeScript types
4. Include error handling
5. Test on multiple devices

## 📄 License

This project is part of the PayLater application suite.
