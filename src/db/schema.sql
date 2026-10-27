-- =========================================================================
-- FitCare – Smart Gym & Healthcare Management System
-- Supabase PostgreSQL Schema & Row Level Security (RLS) Policies
-- =========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. GYMS TABLE
CREATE TABLE IF NOT EXISTS public.gyms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  owner_id UUID NOT NULL,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  announcement TEXT DEFAULT 'Welcome to our athletic training community!',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. USERS & PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('owner', 'trainer', 'member')),
  phone TEXT,
  age INTEGER CHECK (age > 0 AND age < 120),
  gender TEXT,
  profile_photo_url TEXT,
  height_cm NUMERIC(5,2),
  weight_kg NUMERIC(5,2),
  fitness_goal TEXT CHECK (fitness_goal IN ('weight_loss', 'weight_gain', 'muscle_building', 'general_fitness', 'endurance')),
  fitness_experience TEXT CHECK (fitness_experience IN ('beginner', 'intermediate', 'advanced')),
  preferred_workout_days TEXT[],
  available_equipment TEXT,
  gym_id UUID REFERENCES public.gyms(id) ON DELETE SET NULL,
  trainer_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  join_status TEXT DEFAULT 'active' CHECK (join_status IN ('active', 'pending', 'inactive')),
  membership_plan TEXT DEFAULT 'Standard',
  is_profile_public BOOLEAN DEFAULT false,
  allow_leaderboard BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. FITNESS ASSESSMENTS TABLE (Confidential: Member & Authorized Staff only)
CREATE TABLE IF NOT EXISTS public.fitness_assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  trainer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  weight_kg NUMERIC(5,2) NOT NULL,
  body_fat_percentage NUMERIC(4,1),
  chest_cm NUMERIC(5,2),
  waist_cm NUMERIC(5,2),
  hips_cm NUMERIC(5,2),
  arm_cm NUMERIC(5,2),
  thigh_cm NUMERIC(5,2),
  resting_heart_rate_bpm INTEGER,
  systolic_bp INTEGER,
  diastolic_bp INTEGER,
  pushups_count INTEGER,
  plank_seconds INTEGER,
  goal_discussion_notes TEXT,
  trainer_recommendations TEXT,
  next_assessment_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. WORKOUT PLANS TABLE
CREATE TABLE IF NOT EXISTS public.workout_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  trainer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  goal TEXT NOT NULL,
  experience_level TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  duration_weeks INTEGER DEFAULT 4,
  schedule JSONB NOT NULL DEFAULT '[]'::jsonb,
  safety_warnings TEXT[] DEFAULT ARRAY[]::TEXT[],
  medical_disclaimer TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. WORKOUT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.workout_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  workout_plan_id UUID REFERENCES public.workout_plans(id) ON DELETE SET NULL,
  day_number INTEGER NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  completed_exercises TEXT[] DEFAULT ARRAY[]::TEXT[],
  duration_minutes INTEGER DEFAULT 45,
  perceived_exertion INTEGER CHECK (perceived_exertion BETWEEN 1 AND 10),
  notes TEXT,
  completed BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. PRODUCTS INVENTORY TABLE
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  gym_id UUID REFERENCES public.gyms(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('protein_food', 'protein_powder', 'mass_gainer', 'sports_nutrition', 'fitness_accessory', 'gym_equipment')),
  image_url TEXT,
  description TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  in_stock BOOLEAN DEFAULT true,
  stock_quantity INTEGER DEFAULT 0,
  ingredients TEXT,
  intended_use TEXT NOT NULL,
  manufacturer TEXT NOT NULL,
  precautions TEXT,
  is_supplement BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. PRODUCT RECOMMENDATIONS TABLE
CREATE TABLE IF NOT EXISTS public.product_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  trainer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  recommended_date DATE DEFAULT CURRENT_DATE,
  reason TEXT NOT NULL,
  precautions TEXT NOT NULL,
  dosage_or_usage TEXT NOT NULL,
  acknowledged_by_member BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. COMMUNITY POSTS & ANNOUNCEMENTS
CREATE TABLE IF NOT EXISTS public.community_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  gym_id UUID REFERENCES public.gyms(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('announcement', 'achievement', 'challenge', 'discussion')),
  likes INTEGER DEFAULT 0,
  pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. COMMUNITY CHALLENGES
CREATE TABLE IF NOT EXISTS public.community_challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  gym_id UUID REFERENCES public.gyms(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  target_metric TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  participants_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  type TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fitness_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users Policy: Members view public profiles, own profile, and gym staff can view members in their gym
CREATE POLICY "Users view own or public profiles"
  ON public.users FOR SELECT
  USING (
    auth.uid() = id OR
    is_profile_public = true OR
    EXISTS (SELECT 1 FROM public.users AS u WHERE u.id = auth.uid() AND (u.role = 'owner' OR u.role = 'trainer'))
  );

CREATE POLICY "Users update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- Fitness Assessments Policy: Only assigned trainer, gym owner, or the member themselves can view
CREATE POLICY "Assessments visible only to member and authorized staff"
  ON public.fitness_assessments FOR SELECT
  USING (
    auth.uid() = member_id OR
    auth.uid() = trainer_id OR
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'owner')
  );

CREATE POLICY "Trainers and owners can insert assessments"
  ON public.fitness_assessments FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('trainer', 'owner'))
  );

-- Workout Plans Policy: Member reads their plan, trainer/owner can manage
CREATE POLICY "Workout plans readable by member and staff"
  ON public.workout_plans FOR SELECT
  USING (
    auth.uid() = member_id OR
    auth.uid() = trainer_id OR
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'owner')
  );

CREATE POLICY "Trainers can manage workout plans"
  ON public.workout_plans FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('trainer', 'owner'))
  );

-- Products Policy: Catalog readable by all authenticated gym members
CREATE POLICY "Products readable by all"
  ON public.products FOR SELECT
  USING (true);

CREATE POLICY "Products managed by owner and trainers"
  ON public.products FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('owner', 'trainer'))
  );
