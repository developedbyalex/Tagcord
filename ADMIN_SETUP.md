# 🔧 Admin Panel Setup Guide

This guide explains how to set up and use the admin panel for Tagcord.gg.

## 🚀 Quick Setup

### 1. Database Migration

First, run the minimal admin migration in your Supabase Dashboard SQL Editor:

```sql
-- Copy and paste the contents of database-migration-admin-minimal.sql
```

This will:
- Add an `is_admin` column to the profiles table
- Create an index for admin queries
- Handle admin permissions at the application level (no complex RLS policies)

### 2. Make Your First Admin

Since there are no admins initially, you'll need to manually set the first admin in the Supabase Dashboard:

1. Go to your Supabase Dashboard
2. Navigate to Table Editor > profiles
3. Find your user profile
4. Set `is_admin` to `true`

Alternatively, you can use the API endpoint (requires service role key):

```bash
curl -X POST http://localhost:3000/api/admin/make-admin \
  -H "Content-Type: application/json" \
  -d '{"userId": "your-user-id"}'
```

### 3. Access the Admin Panel

Once you're an admin:
1. Sign in to Tagcord.gg
2. Click your profile picture in the top-right
3. You'll see an "Admin Panel" link in the dropdown
4. Click it to access the admin panel

## 🛠️ Admin Panel Features

### Server Management
- **View all servers**: See all submitted Discord tags with user information
- **Search servers**: Filter by tag name or username
- **Delete servers**: Remove inappropriate or broken server links
- **Pagination**: Navigate through large numbers of servers

### Security Features
- **Admin-only access**: Only users with `is_admin = true` can access
- **RLS policies**: Database-level security prevents unauthorized access
- **Confirmation dialogs**: Prevents accidental server deletions

## 🔐 Making Additional Admins

### Via Supabase Dashboard
1. Go to Table Editor > profiles
2. Find the user you want to make admin
3. Set `is_admin` to `true`

### Via API (Admin only)
```bash
curl -X POST http://localhost:3000/api/admin/make-admin \
  -H "Content-Type: application/json" \
  -d '{"userId": "target-user-id"}'
```

## 🎯 Best Practices

1. **Limit admin access**: Only give admin privileges to trusted users
2. **Monitor deletions**: Keep track of which servers are being removed
3. **Regular reviews**: Periodically review the admin panel for new submissions
4. **Backup data**: Consider backing up the database before major changes

## 🚨 Troubleshooting

### "Admin access required" error
- Ensure your user profile has `is_admin = true`
- Check that the database migration was run successfully
- Verify RLS policies are in place

### Can't see admin panel link
- Make sure you're signed in
- Check that your profile has `is_admin = true`
- Try refreshing the page

### Can't delete servers
- Verify you have admin privileges
- Check that the RLS policies allow admin deletions
- Ensure the server exists in the database

## 📝 Database Schema

The admin system adds these fields:

```sql
-- profiles table
is_admin BOOLEAN DEFAULT FALSE

-- RLS Policies
"Admins can delete any tags"
"Admins can view all profiles" 
"Admins can update any profile"
"Admins can view all tags with user info"
```

---

**Need help?** Check the main README.md or create an issue in the repository. 