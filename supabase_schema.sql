-- ── Barista Coffee Shop Supabase Database Schema ──

-- Drop existing triggers/functions if they exist
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists handle_new_user();

-- 1. Create Profiles Table
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  email text,
  avatar_url text,
  created_at timestamptz default now()
);

-- Enable RLS for Profiles
alter table public.profiles enable row level security;

-- Profiles Policies
create policy "Public profiles are viewable by everyone" on public.profiles
  for select using (true);

create policy "Users can update their own profiles" on public.profiles
  for update using (auth.uid() = id);

-- Trigger to automatically create profiles row on user registration
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.email,
    coalesce(new.raw_user_meta_data->>'avatar_url', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 2. Create Products Table
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  image_url text,
  price numeric not null,
  category text not null,
  created_at timestamptz default now()
);

-- Enable RLS for Products
alter table public.products enable row level security;

-- Products Policies
create policy "Products are viewable by everyone" on public.products
  for select using (true);


-- 3. Create Cart Items Table
create table if not exists public.cart_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  product_id uuid references public.products on delete cascade not null,
  quantity integer not null default 1 check (quantity > 0),
  created_at timestamptz default now()
);

-- Enable RLS for Cart Items
alter table public.cart_items enable row level security;

-- Cart Items Policies
create policy "Users can view their own cart items" on public.cart_items
  for select using (auth.uid() = user_id);

create policy "Users can insert their own cart items" on public.cart_items
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own cart items" on public.cart_items
  for update using (auth.uid() = user_id);

create policy "Users can delete their own cart items" on public.cart_items
  for delete using (auth.uid() = user_id);


-- 4. Create Favorites Table
create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  product_id uuid references public.products on delete cascade not null,
  created_at timestamptz default now(),
  unique (user_id, product_id)
);

-- Enable RLS for Favorites
alter table public.favorites enable row level security;

-- Favorites Policies
create policy "Users can view their own favorites" on public.favorites
  for select using (auth.uid() = user_id);

create policy "Users can add their own favorites" on public.favorites
  for insert with check (auth.uid() = user_id);

create policy "Users can remove their own favorites" on public.favorites
  for delete using (auth.uid() = user_id);


-- 5. Create Contact Messages Table
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  created_at timestamptz default now()
);

-- Enable RLS for Contact Messages
alter table public.contact_messages enable row level security;

-- Contact Messages Policies
create policy "Anyone can insert contact messages" on public.contact_messages
  for insert with check (true);


-- 6. Create Orders Table
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  total_amount numeric not null,
  status text not null default 'pending',
  created_at timestamptz default now()
);

-- Enable RLS for Orders
alter table public.orders enable row level security;

-- Orders Policies
create policy "Users can view their own orders" on public.orders
  for select using (auth.uid() = user_id);

create policy "Users can insert their own orders" on public.orders
  for insert with check (auth.uid() = user_id);


-- ── Populate Products Table with Demo Data ──
insert into public.products (name, price, category, image_url, description) values
('Signature Espresso', 3.5, 'Coffee', 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=600&q=80', 'Rich, full-bodied espresso with a velvety crema.'),
('Caramel Latte', 4.5, 'Coffee', 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&q=80', 'Smooth latte with house-made caramel drizzle.'),
('Matcha Latte', 5.0, 'Specialty', 'https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?w=600&q=80', 'Ceremonial-grade matcha with oat milk.'),
('Avocado Toast', 8.0, 'Food', 'https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?auto=format&fit=crop&w=600&q=80', 'Smashed avocado on sourdough with chilli flakes.'),
('Cold Brew', 4.0, 'Coffee', 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=600&q=80', '24-hour slow-steeped cold brew, served over ice.'),
('Almond Croissant', 3.5, 'Food', 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&q=80', 'Flaky, buttery croissant filled with almond cream.'),
('Flat White', 4.0, 'Coffee', 'https://images.unsplash.com/photo-1497636577773-f1231844b336?w=600&q=80', 'Double ristretto with steamed micro-foam milk.'),
('Chocolate Cake', 6.0, 'Food', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80', 'Decadent dark chocolate cake with ganache glaze.');
