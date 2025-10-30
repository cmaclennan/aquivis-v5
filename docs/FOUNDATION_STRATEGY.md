# Foundation Strategy Analysis

## Password Leak Protection — Pros & Cons

### ✅ Pros
- **Security**: Prevents users from using compromised passwords (from data breaches)
- **Trust**: Shows users you care about their security
- **Compliance**: Can help with security certifications (SOC 2, etc.)
- **Free**: No cost to enable
- **Automatic**: Works out of the box once enabled

### ❌ Cons
- **User friction**: Legitimate users might be blocked if their password was leaked
- **Rate limiting**: HaveIBeenPwned API has rate limits (but Supabase handles this)
- **External dependency**: Relies on HaveIBeenPwned service availability
- **False positives**: Some legitimate passwords might be marked as leaked

### Recommendation
**Enable it.** The pros outweigh the cons. Most users won't hit this, and those who do will be forced to use better passwords. For a B2B SaaS like Aquivis, this is a no-brainer.

**How to Enable:**
1. Go to Supabase Dashboard → Authentication → Settings
2. Enable "Prevent use of compromised passwords"
3. No code changes needed

---

## Core Foundation Features — Strategic Analysis

You're absolutely right that foundation features are critical. Let's assess what belongs in the "base" vs what's app-specific.

### Foundation Layer (Reusable Base)
These are universal SaaS features that any app would need:

1. **✅ User Profile Management**
   - Edit name, email
   - Change password
   - Upload avatar
   - Two-factor authentication
   - **Status**: Not built yet

2. **✅ Company Settings**
   - Edit company name, timezone
   - Branding (logo, colors)
   - Billing address
   - **Status**: Company name/timezone done, needs UI

3. **✅ Team Management**
   - Invite team members
   - Manage roles (owner/manager/technician)
   - Remove users
   - View activity logs
   - **Status**: Schema supports it, no UI

4. **✅ Billing/Subscription** (Defer to M2 per plan)
   - Subscription plans
   - Payment processing
   - Usage limits
   - **Status**: Schema has billing_accounts table

5. **✅ Audit Logs**
   - Track who did what when
   - Compliance requirement
   - **Status**: Not built yet

6. **✅ Notifications**
   - Email notifications
   - In-app notifications
   - **Status**: Not built yet

### Application Layer (Aquivis-Specific)
These are domain-specific features:

1. **Properties & Units** — In progress
2. **Task Scheduling** — Planned
3. **Services & Water Tests** — In progress
4. **Bookings** — Schema exists
5. **Reports & Exports** — Planned

---

## Strategic Recommendation: Hybrid Approach

### Phase 1: Minimal Foundation (2-3 days)
Build JUST enough foundation to enable the app features:

1. **User Profile** (`/settings/profile`)
   - Edit name, email
   - Change password
   - Reason: Users need to manage their account

2. **Company Settings** (`/settings/company`)
   - Edit company name, timezone
   - Reason: Onboarding sets this, users should be able to update

3. **Basic Team Management** (`/settings/team`)
   - View team members
   - Invite new users (defer implementation)
   - Reason: Owners need to see their team

**Why this approach?**
- Gets us to a working state faster
- Foundation features don't depend on app features
- Enables testing of actual workflows
- Can iterate on foundation after app features work

### Phase 2: Complete App Core (2-3 days)
Now that we have minimal foundation, build the core app features:

4. **Properties Wizard** (already started)
5. **Task Generation** (per plan)
6. **Service Management** (already started)

### Phase 3: Enhance Foundation (1-2 days)
Backfill missing foundation features:

7. **Full Team Management**
8. **Audit Logs**
9. **Notifications**

### Phase 4: Advanced Features (M2+)
10. **Billing & Subscriptions**
11. **Advanced Reports**
12. **Customer Portal**

---

## Proposed Implementation Order

### ✅ Done (Base Built)
- Authentication & onboarding
- Database schema & RLS security
- Basic API routes (properties, tasks, services)
- Dashboard, properties, tasks pages with real data

### 🔄 Next Up (This Week)

**Day 1-2: Foundation Core**
1. User profile settings (`/settings/profile`)
2. Company settings (`/settings/company`)
3. Team list view (`/settings/team`)
4. Basic navigation to settings

**Day 3-4: App Core**
5. Properties creation wizard (`/properties/new`)
6. Task generation system
7. Service detail pages (`/services/:id`)

**Day 5: Polish**
8. Add proper validation (Zod)
9. Error handling improvements
10. Loading states everywhere

### 📅 Later (M2)
- Invite team members (email system)
- Full team management
- Billing integration
- Advanced reports
- Mobile app

---

## Why This Order?

1. **Foundation First (Days 1-2)**
   - Users need to manage their accounts
   - Company owners need to see their team
   - Enables actual usage of the app
   - Provides a solid base for everything else

2. **App Core (Days 3-4)**
   - The actual value proposition
   - Properties, services, tasks are why users sign up
   - Can't test properly without foundation though

3. **Polish (Day 5)**
   - Makes it production-ready
   - Better UX/error handling
   - Validation prevents bad data

---

## Benefits of This Approach

### ✅ Strategic
- Build a reusable foundation
- Similar pattern to other SaaS apps
- Foundation code can be reused in future projects
- Makes the app more complete

### ✅ Tactical
- Enables user testing sooner
- Provides fallback features if app features have issues
- Better user onboarding experience
- Professional first impression

### ✅ Technical
- Separates concerns (settings vs app logic)
- Makes adding team features later easier
- More maintainable codebase
- Better documentation structure

---

## What Gets Built First?

I recommend starting with foundation core (settings pages), then immediately building the app core (properties wizard), then polishing. This gives us:

1. **Working foundation** (2 days)
2. **Working app** (2 days)
3. **Production-ready** (1 day)

**Total: 5 days to a complete M1**

Does this align with your vision?

