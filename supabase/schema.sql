-- ==============================================================================
-- 1. PROFILES (Public profile details for each Auth User)
-- ==============================================================================
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  avatar_url text,
  company_name text,
  website text,
  updated_at timestamptz
);

-- Trigger: Automatically create a profile when a new User signs up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$;

-- Bind trigger to auth.users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- RLS for Profiles
alter table public.profiles enable row level security;

drop policy if exists "Users can select their own profile" on public.profiles;
create policy "Users can select their own profile" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile" on public.profiles
  for update using (auth.uid() = id);

-- ==============================================================================
-- 2. ACCOUNTS (Companies/Organizations)
-- ==============================================================================
create table if not exists public.accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  name text not null,
  website text,
  industry text,
  status text default 'Active', -- Active, Churned, etc.
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Index for performance
create index if not exists accounts_user_id_idx on public.accounts(user_id);

-- RLS for Accounts
alter table public.accounts enable row level security;

drop policy if exists "accounts_select_own" on public.accounts;
create policy "accounts_select_own" on public.accounts for select using (auth.uid() = user_id);

drop policy if exists "accounts_insert_own" on public.accounts;
create policy "accounts_insert_own" on public.accounts for insert with check (auth.uid() = user_id);

drop policy if exists "accounts_update_own" on public.accounts;
create policy "accounts_update_own" on public.accounts for update using (auth.uid() = user_id);

drop policy if exists "accounts_delete_own" on public.accounts;
create policy "accounts_delete_own" on public.accounts for delete using (auth.uid() = user_id);

-- ==============================================================================
-- 2.5. LEADS (Potential Customers)
-- ==============================================================================
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  name text not null,
  company text,
  email text,
  phone text,
  value numeric default 0,
  stage text default 'New', -- New, Contacted, Qualified, Proposal, Won, Lost
  tags text[] default '{}',
  last_activity timestamptz default now(),
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Index for performance
create index if not exists leads_user_id_idx on public.leads(user_id);

-- RLS for Leads
alter table public.leads enable row level security;

drop policy if exists "leads_all_own" on public.leads;
create policy "leads_all_own" on public.leads
  for all using (auth.uid() = user_id);

-- ==============================================================================
-- 3. LISTS (For grouping Leads, e.g., "Q3 Outreach")
-- ==============================================================================
create table if not exists public.lists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  name text not null,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.lists enable row level security;

drop policy if exists "lists_all_own" on public.lists;
create policy "lists_all_own" on public.lists
  for all using (auth.uid() = user_id);

-- ==============================================================================
-- 4. LIST_LEADS (Many-to-Many Join Table)
-- ==============================================================================
create table if not exists public.list_leads (
  list_id uuid references public.lists(id) on delete cascade,
  lead_id uuid references public.leads(id) on delete cascade,
  added_at timestamptz not null default now(),
  primary key (list_id, lead_id)
);

-- RLS for Join Table (Check ownership of the parent List)
alter table public.list_leads enable row level security;

drop policy if exists "list_leads_select_own" on public.list_leads;
create policy "list_leads_select_own" on public.list_leads
  for select using (
    exists (select 1 from public.lists where id = list_leads.list_id and user_id = auth.uid())
  );

drop policy if exists "list_leads_insert_own" on public.list_leads;
create policy "list_leads_insert_own" on public.list_leads
  for insert with check (
    exists (select 1 from public.lists where id = list_leads.list_id and user_id = auth.uid())
  );

drop policy if exists "list_leads_delete_own" on public.list_leads;
create policy "list_leads_delete_own" on public.list_leads
  for delete using (
    exists (select 1 from public.lists where id = list_leads.list_id and user_id = auth.uid())
  );

-- ==============================================================================
-- 5. INVOICES (Financials linked to Accounts)
-- ==============================================================================
DO $$ BEGIN
    CREATE TYPE public.invoice_status AS ENUM ('Draft', 'Sent', 'Paid', 'Overdue', 'Void');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  account_id uuid references public.accounts(id) on delete set null,
  invoice_number text not null,
  amount numeric not null default 0,
  currency text default 'USD',
  status public.invoice_status not null default 'Draft',
  due_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.invoices enable row level security;

drop policy if exists "invoices_all_own" on public.invoices;
create policy "invoices_all_own" on public.invoices
  for all using (auth.uid() = user_id);

-- ==============================================================================
-- 6. SUBSCRIPTIONS (Recurring billing linked to Accounts)
-- ==============================================================================
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  account_id uuid references public.accounts(id) on delete cascade,
  plan_name text not null, -- e.g. "Pro Plan"
  status text not null default 'active', -- active, canceled, trial
  billing_cycle text default 'monthly',
  amount numeric not null,
  start_date timestamptz default now(),
  renew_date timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.subscriptions enable row level security;

drop policy if exists "subscriptions_all_own" on public.subscriptions;
create policy "subscriptions_all_own" on public.subscriptions
  for all using (auth.uid() = user_id);

-- ==============================================================================
-- 6.5. TASKS (To-dos linked to Leads)
-- ==============================================================================
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  lead_id uuid references public.leads(id) on delete cascade,
  title text not null,
  description text,
  priority text default 'Medium', -- Low, Medium, High
  status text default 'Todo', -- Todo, In Progress, Done
  due_date timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Index for performance
create index if not exists tasks_user_id_idx on public.tasks(user_id);
create index if not exists tasks_lead_id_idx on public.tasks(lead_id);

-- RLS for Tasks
alter table public.tasks enable row level security;

drop policy if exists "tasks_all_own" on public.tasks;
create policy "tasks_all_own" on public.tasks
  for all using (auth.uid() = user_id);

-- ==============================================================================
-- 7. UPDATE TRIGGERS (Apply auto-timestamp to all new tables)
-- ==============================================================================

-- Helper function to update updated_at timestamp
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_accounts_updated_at on public.accounts;
create trigger set_accounts_updated_at before update on public.accounts
  for each row execute function public.set_updated_at();

drop trigger if exists set_leads_updated_at on public.leads;
create trigger set_leads_updated_at before update on public.leads
  for each row execute function public.set_updated_at();

drop trigger if exists set_lists_updated_at on public.lists;
create trigger set_lists_updated_at before update on public.lists
  for each row execute function public.set_updated_at();

drop trigger if exists set_invoices_updated_at on public.invoices;
create trigger set_invoices_updated_at before update on public.invoices
  for each row execute function public.set_updated_at();

drop trigger if exists set_subscriptions_updated_at on public.subscriptions;
create trigger set_subscriptions_updated_at before update on public.subscriptions
  for each row execute function public.set_updated_at();

drop trigger if exists set_tasks_updated_at on public.tasks;
create trigger set_tasks_updated_at before update on public.tasks
  for each row execute function public.set_updated_at();