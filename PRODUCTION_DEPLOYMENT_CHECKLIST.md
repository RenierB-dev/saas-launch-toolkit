# 🚀 Production Deployment Checklist

## Before You Deploy to Production

### 1. Database Setup

- [ ] Run all migrations in Supabase production database:
  ```bash
  # In Supabase dashboard > SQL Editor, run migrations in order:
  - 001_initial_schema.sql
  - 002_pricing_and_launch_tables.sql
  - 003_fix_and_add_missing_tables.sql
  - 004_update_subscriptions_for_paddle.sql
  - 005_safe_paddle_migration.sql
  - 006_add_unique_constraints_and_fixes.sql
  ```

- [ ] Verify Row Level Security (RLS) is enabled on all tables
- [ ] Test database connection from production app
- [ ] Backup current database before going live

### 2. Paddle Configuration

- [ ] **CRITICAL**: Update `.env` with PRODUCTION Paddle credentials:
  ```
  PADDLE_API_KEY=pdl_live_apikey_YOUR_LIVE_KEY
  NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=live_YOUR_LIVE_TOKEN
  NEXT_PUBLIC_PADDLE_ENVIRONMENT=production
  ```

- [ ] Get production Price IDs from Paddle dashboard:
  ```
  NEXT_PUBLIC_PADDLE_PRICE_ID_ONETIME=pri_PRODUCTION_ONETIME
  NEXT_PUBLIC_PADDLE_PRICE_ID_MONTHLY=pri_PRODUCTION_MONTHLY
  ```

- [ ] **CRITICAL**: Get production webhook secret:
  ```
  PADDLE_WEBHOOK_SECRET=pdl_ntfset_PRODUCTION_SECRET
  ```

- [ ] Update webhook URL in Paddle dashboard:
  ```
  Old: https://your-ngrok-url.ngrok.io/api/webhooks/paddle
  New: https://yourdomain.com/api/webhooks/paddle
  ```

- [ ] Test webhook delivery with Paddle's webhook tester
- [ ] Verify SSL certificate on webhook endpoint

### 3. Supabase Configuration

- [ ] **SECURITY**: Move `SUPABASE_SERVICE_ROLE_KEY` from `.env.local` to server-only environment
- [ ] On Vercel/your platform: Add as SERVER-ONLY environment variable
- [ ] **CRITICAL**: Rotate service role key after removing from `.env.local`
- [ ] Update Supabase URL if using production instance:
  ```
  NEXT_PUBLIC_SUPABASE_URL=https://your-prod-project.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
  ```

- [ ] Verify RLS policies work with production data
- [ ] Enable Supabase auth email confirmations (if desired)

### 4. Environment Variables Checklist

Create a `.env.production` file with these values:

```bash
# Supabase Production
NEXT_PUBLIC_SUPABASE_URL=https://your-prod-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key_here

# Paddle Production (LIVE mode)
PADDLE_API_KEY=pdl_live_apikey_YOUR_LIVE_KEY_HERE
NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=live_YOUR_LIVE_CLIENT_TOKEN_HERE
NEXT_PUBLIC_PADDLE_ENVIRONMENT=production
NEXT_PUBLIC_PADDLE_PRICE_ID_ONETIME=pri_PRODUCTION_ONETIME_ID
NEXT_PUBLIC_PADDLE_PRICE_ID_MONTHLY=pri_PRODUCTION_MONTHLY_ID
PADDLE_WEBHOOK_SECRET=pdl_ntfset_PRODUCTION_WEBHOOK_SECRET

# App URL
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### 5. Code Changes

- [ ] Update app URL references if any
- [ ] Remove console.log statements from production code
- [ ] Verify error handling shows user-friendly messages
- [ ] Test all critical flows (signup, payment, dashboard)

### 6. Security Checklist

- [ ] ✅ Webhook signature verification is enabled
- [ ] ✅ Environment variables validated at startup
- [ ] ✅ RLS policies protect all user data
- [ ] ✅ UNIQUE constraint on subscriptions prevents duplicates
- [ ] Remove any test/debug routes or API endpoints
- [ ] Enable CORS restrictions if needed
- [ ] Add rate limiting to critical endpoints (webhook, signup)
- [ ] Set up monitoring/alerting (Sentry, LogRocket, etc.)

### 7. Testing Production Configuration

Before deploying, test locally with production settings:

```bash
# 1. Copy .env.production to .env.local (temporarily)
cp .env.production .env.local

# 2. Run local build
npm run build
npm start

# 3. Test complete flow:
- Sign up with real email
- Complete payment with test card (in Paddle sandbox first!)
- Verify webhook processes successfully
- Check subscription appears in dashboard
- Test all tools and features

# 4. Revert to sandbox config
# Don't commit .env.local with production keys!
```

### 8. Deployment Steps

- [ ] Build production bundle: `npm run build`
- [ ] Fix any TypeScript errors or warnings
- [ ] Deploy to hosting platform (Vercel, etc.)
- [ ] Set environment variables in platform dashboard
- [ ] Verify deployment successful
- [ ] Test production URL loads correctly

### 9. Post-Deployment Verification

- [ ] Test signup flow with real email
- [ ] Complete a test payment (use real card or Paddle test card)
- [ ] Verify webhook is received and processed
- [ ] Check Supabase database for subscription record
- [ ] Test dashboard loads with real data
- [ ] Verify all tools are accessible
- [ ] Test subscription cancellation
- [ ] Monitor logs for errors

### 10. Monitoring & Maintenance

- [ ] Set up uptime monitoring (UptimeRobot, Better Stack)
- [ ] Configure error tracking (Sentry)
- [ ] Set up log aggregation (LogDNA, Papertrail)
- [ ] Monitor webhook delivery rate in Paddle dashboard
- [ ] Set up alerts for failed payments/webhooks
- [ ] Plan for database backups

## ⚠️  CRITICAL REMINDERS

1. **NEVER** use LIVE Paddle keys in sandbox mode
2. **NEVER** commit `.env.local` with real credentials
3. **ALWAYS** rotate service role key after moving to production
4. **ALWAYS** test webhook signature verification before going live
5. **ALWAYS** backup database before running migrations
6. **ALWAYS** have a rollback plan

## 🆘 Rollback Plan

If something goes wrong in production:

1. **Immediate**: Revert deployment on platform
2. **Database**: Restore from backup if needed
3. **Paddle**: Disable webhook temporarily
4. **Users**: Add maintenance page
5. **Debug**: Check logs, identify issue
6. **Fix**: Apply fix in staging first
7. **Re-deploy**: With confidence

## 📞 Support Contacts

- Paddle Support: https://paddle.com/support
- Supabase Support: https://supabase.com/support
- Your hosting platform support

## ✅ Final Pre-Launch Checklist

- [ ] All environment variables set correctly
- [ ] Paddle in PRODUCTION mode
- [ ] Webhook URL updated in Paddle
- [ ] Database migrations run successfully
- [ ] End-to-end payment flow tested
- [ ] Error monitoring configured
- [ ] Team notified of launch
- [ ] Rollback plan in place

**You're ready to launch! 🚀**

---

*Last Updated: Add date when you complete checklist*
