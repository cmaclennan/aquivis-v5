# API & Authentication Patterns

This document outlines the authentication and API patterns used in Aquivis v5.

## JWT Claims Pattern

### Overview
RLS (Row Level Security) requires `company_id` and `role` to be present in the JWT token claims. This is handled automatically via database triggers.

### Implementation

**Database Trigger** (`020_jwt_claims_update.sql`):
```sql
-- Function that updates user metadata when profile changes
create or replace function update_user_claims()
returns trigger
security definer
set search_path = public
language plpgsql
as $$
declare
  company_uuid uuid;
  user_role text;
begin
  select p.company_id, p.role into company_uuid, user_role
  from profiles p
  where p.id = NEW.id;
  
  if company_uuid is not null and user_role is not null then
    update auth.users
    set raw_user_meta_data = raw_user_meta_data || jsonb_build_object(
      'company_id', company_uuid::text,
      'role', user_role
    )
    where id = NEW.id;
  end if;
  
  return NEW;
end;
$$;

-- Trigger automatically fires on profile insert/update
create trigger trigger_update_user_claims
after insert or update of company_id, role on profiles
for each row
execute function update_user_claims();
```

### How It Works

1. **Onboarding**: When a user completes onboarding, a `company` is created and a `profile` is inserted with `company_id` and `role`.
2. **Trigger Fires**: The database trigger automatically updates the user's metadata in `auth.users`.
3. **JWT Updated**: On next authentication, the JWT includes `company_id` and `role` in `user_metadata`.
4. **RLS Functions**: `request_company_id()` and `request_role()` read these values from the JWT for RLS policies.

### RLS Helper Functions

```sql
-- Extract company_id from JWT
create or replace function request_company_id()
returns uuid
stable
language sql
as $$
  select (nullif(current_setting('request.jwt.claims', true), '')::json->>'company_id')::uuid;
$$;

-- Extract role from JWT
create or replace function request_role()
returns text
stable
language sql
as $$
  select coalesce(nullif(current_setting('request.jwt.claims', true), '')::json->>'role','');
$$;

-- Role helpers
create or replace function is_owner()
returns boolean stable language sql as $$ select request_role() = 'owner'; $$;

create or replace function is_manager()
returns boolean stable language sql as $$ select request_role() = 'manager'; $$;

create or replace function is_technician()
returns boolean stable language sql as $$ select request_role() = 'technician'; $$;
```

## Server-Side Utilities

### Location: `apps/web/lib/supabaseServer.ts`

**Purpose**: Create server-side Supabase clients with proper authentication handling.

**Key Functions**:

```typescript
// Create server client (useServiceRole = true for admin operations)
createServerClient(useServiceRole: boolean): SupabaseClient

// Get current user session
getServerSession(): Promise<Session | null>

// Get company_id from JWT metadata
getCompanyId(): Promise<string | null>

// Get user role from JWT metadata
getUserRole(): Promise<string | null>
```

**Usage in API Routes**:
```typescript
import { createServerClient } from '@/lib/supabaseServer';

export async function GET(req: NextRequest) {
  // For RLS-aware queries (respects user's company scoping)
  const supabase = createServerClient(false);
  
  // For admin operations (bypasses RLS)
  const supabaseAdmin = createServerClient(true);
}
```

## API Routes Pattern

### Structure
```
apps/web/app/api/
├── properties/
│   ├── route.ts                 # GET (list), POST (create)
│   └── [id]/
│       ├── route.ts            # GET (detail), PATCH (update)
│       └── units/
│           └── route.ts        # POST (create unit)
├── tasks/
│   ├── route.ts                 # GET (list with filters)
│   └── [id]/
│       └── route.ts             # PATCH (update status)
└── onboarding/
    └── complete/
        └── route.ts             # POST (complete onboarding)
```

### Standard Pattern

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabaseServer';

export async function GET(req: NextRequest) {
  try {
    const supabase = createServerClient(false);
    
    const { data, error } = await supabase
      .from('table_name')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

### Authentication
- RLS automatically scopes queries to the user's company via `request_company_id()`
- No manual filtering by `company_id` needed in queries
- Service role client only used for admin operations

## Client-Side Data Fetching

### Direct Supabase Client
For simple queries that respect RLS:

```typescript
import { supabase } from '@/lib/supabaseClient';

const { data, error } = await supabase
  .from('properties')
  .select('*');
```

### API Routes
For complex operations or when you need business logic:

```typescript
const response = await fetch('/api/properties', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const { data } = await response.json();
```

## Security Considerations

1. **RLS First**: Always rely on RLS for data isolation
2. **Service Role**: Only use service role for admin operations (onboarding, migrations)
3. **Token Validation**: Always validate authentication tokens
4. **Error Handling**: Never expose internal errors to clients
5. **Input Validation**: Validate all inputs before database operations

## Performance

1. **Indices**: Use indices defined in `010_indices.sql` for fast queries
2. **Selectivity**: Use `select()` to request only needed fields
3. **Limits**: Always use `.limit()` for list queries
4. **Ordering**: Order by indexed fields when possible

## RLS Policies

All tables with `company_id` automatically get RLS policies:
- **SELECT**: `company_id = request_company_id()`
- **INSERT**: `company_id = request_company_id()`
- **UPDATE**: `company_id = request_company_id()`

Special cases:
- **Profiles**: Role-based update policies
- **Services**: Technicians can write their own work
- **Companies**: Users can only select their own company

