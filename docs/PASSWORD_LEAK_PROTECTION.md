# Password Leak Protection Setup

## Status
✅ **Documentation** - See instructions below  
⏳ **Pending** - Requires manual enable in Supabase Dashboard

## What is Password Leak Protection?

Supabase Auth integrates with HaveIBeenPwned.org to prevent users from using passwords that have been compromised in known data breaches.

When a user tries to sign up or change their password, Supabase checks against HaveIBeenPwned's database. If the password has been leaked, the signup/password change is rejected with a clear error message.

## Enable This Feature

### Steps
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your Aquivis project
3. Navigate to **Authentication** → **Settings** (or **Configuration** → **Auth**)
4. Scroll down to **Password Security** section
5. Enable **"Prevent use of compromised passwords"** or **"Leaked Password Protection"**
6. Click **Save**

### Notes
- This feature is free
- It uses the HaveIBeenPwned API (rate limited but Supabase handles this)
- Works automatically once enabled — no code changes needed
- Users will see error: "Password has been found in known data breaches"

## Benefits

### Security
- Prevents users from using weak/compromised passwords
- Reduces account takeover risk
- Better security posture

### Trust & Compliance
- Shows users you care about security
- Helps with security audits/certifications
- Professional appearance

### User Education
- Forces users to think about password strength
- Encourages use of password managers
- Can include link to HaveIBeenPwned in error message

## Impact

### On Users
- Most users won't be affected (use unique passwords)
- ~5-10% might hit this on signup
- Easy fix: use a different password

### On Your App
- Slightly higher friction on signup (barely noticeable)
- Better security posture
- No code changes required

## Testing

To test if it's working:
1. Enable the feature (per steps above)
2. Try to sign up with password: `123456` or `password`
3. Should be rejected with error message
4. Use a strong, unique password to sign up successfully

## Implementation Notes

No code changes needed. This is a Supabase Auth configuration setting only.

The error message from Supabase will be something like:
> "Password has been found in a data breach and should not be used"

You can customize the error handling in your signup/login forms if needed, but the default error is fine.

---

**Recommendation:** Enable this feature now. It's a security best practice with minimal downside.

