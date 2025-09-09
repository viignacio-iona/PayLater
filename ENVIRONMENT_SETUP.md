# Environment Setup Guide

## Authentication Configuration

The PayLater app uses environment variables for secure configuration. Here's how to set up authentication for different environments:

### Local Development (.env.local)

Create a `.env.local` file in the root directory:

```bash
# PayLater App Configuration
APP_PASSWORD=YourSecurePasswordHere

# Database
DATABASE_URL="file:./dev.db"

# Next.js
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
```

### Production (Vercel)

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add the following variables:

```
APP_PASSWORD = YourSecureProductionPassword
DATABASE_URL = your-production-database-url
NEXTAUTH_SECRET = your-production-secret-key
NEXTAUTH_URL = https://your-domain.vercel.app
```

### Environment Variables Reference

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `APP_PASSWORD` | Password for app authentication | Yes | `PayLater2024!` |
| `DATABASE_URL` | Database connection string | Yes | `file:./dev.db` |
| `NEXTAUTH_SECRET` | Secret for NextAuth.js | Yes | - |
| `NEXTAUTH_URL` | Base URL for the application | Yes | - |

### Security Best Practices

1. **Use strong passwords** - At least 12 characters with mixed case, numbers, and symbols
2. **Never commit .env files** - They are already in .gitignore
3. **Use different passwords** for development and production
4. **Rotate passwords regularly** for production environments
5. **Use Vercel's environment variable encryption** for production secrets

### Example Strong Passwords

- `PayLater2024!SecureApp`
- `MyApp@2024#Production`
- `SecurePayLater$2024!`

### Troubleshooting

If authentication fails:
1. Check that the environment variable is set correctly
2. Restart the development server after changing .env files
3. Verify the password matches exactly (case-sensitive)
4. Check Vercel logs for environment variable issues in production
