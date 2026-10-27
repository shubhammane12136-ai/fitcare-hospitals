import React, { useState } from 'react';
import { X, Copy, Check, Database, Shield, RefreshCw, Key, Server } from 'lucide-react';
import { isSupabaseConfigured } from '../../db/supabaseClient';
import { storage } from '../../db/storage';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const DatabaseInspectorModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'sql' | 'rls' | 'firebase' | 'env' | 'status'>('firebase');
  const [copied, setCopied] = useState(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const sqlSchema = `-- =========================================================================
-- FitCare – Supabase PostgreSQL Schema (Run in Supabase SQL Editor)
-- =========================================================================

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
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CONFIDENTIAL FITNESS ASSESSMENTS
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

-- 4. PERSONALIZED WORKOUT PLANS
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
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. PRODUCTS INVENTORY & RECOMMENDATIONS
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  gym_id UUID REFERENCES public.gyms(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
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

CREATE TABLE IF NOT EXISTS public.product_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  trainer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  recommended_date DATE DEFAULT CURRENT_DATE,
  reason TEXT NOT NULL,
  precautions TEXT NOT NULL,
  dosage_or_usage TEXT NOT NULL,
  acknowledged_by_member BOOLEAN DEFAULT false
);`;

  const rlsPolicies = `-- =========================================================================
-- Supabase Row Level Security (RLS) Policies
-- =========================================================================

-- Enable RLS across sensitive healthcare and user tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fitness_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- 1. Personal Assessment Privacy (Visible ONLY to member and authorized gym staff)
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

-- 2. Member Workout Plans (Readable by member, editable by coaches/owners)
CREATE POLICY "Workout plans readable by member and staff"
  ON public.workout_plans FOR SELECT
  USING (
    auth.uid() = member_id OR
    auth.uid() = trainer_id OR
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'owner')
  );

-- 3. Product Catalog (Readable by all members, managed by staff)
CREATE POLICY "Products readable by all"
  ON public.products FOR SELECT
  USING (true);`;

  const envConfig = `# FitCare PostgreSQL & Firebase Configuration
# Supabase Database & Storage Setup
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-public-key"

# Firebase Authentication (Identity Management)
VITE_FIREBASE_API_KEY="your-firebase-api-key"
VITE_FIREBASE_AUTH_DOMAIN="your-app.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="fitcare-smart-gym"`;

  const firebaseConfigSnippet = `// =========================================================================
// FitCare – Attached Firebase Configuration & Security Rules
// =========================================================================

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCJjA9d3HWQDyhEEVedycMq-rKr2cwzVkk",
  authDomain: "fitcare-smartgym.firebaseapp.com",
  projectId: "fitcare-smartgym",
  storageBucket: "fitcare-smartgym.firebasestorage.app",
  messagingSenderId: "230025913559",
  appId: "1:230025913559:web:90470d93f46f211c3bbc92",
  measurementId: "G-0XLH7E3FXR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// -------------------------------------------------------------------------
// EXCLUSIVE GYM OWNER PORTAL RULE:
// -------------------------------------------------------------------------
// Authorized Gym Owner: varadsutar1703@gmail.com
// Password:             12136
//
// Access Control Policy:
// Only "varadsutar1703@gmail.com" is granted Gym Owner privileges.
// All other accounts attempting to access the owner portal are rejected.
`;

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleResetData = () => {
    storage.resetToDefaults();
    setResetMessage('Data restored to initial realistic baseline. Refresh to view changes.');
    setTimeout(() => {
      window.location.reload();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Database & Security Architecture</h3>
              <p className="text-xs text-slate-400">Supabase PostgreSQL Schema, RLS, and Environment Integration</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="px-6 pt-3 border-b border-slate-800 flex items-center gap-2">
          <button
            onClick={() => setActiveTab('firebase')}
            className={`px-3 py-1.5 text-xs font-medium rounded-t-lg transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'firebase'
                ? 'text-emerald-400 bg-slate-800/80 border-t border-x border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Firebase & Owner Portal
          </button>
          <button
            onClick={() => setActiveTab('sql')}
            className={`px-3 py-1.5 text-xs font-medium rounded-t-lg transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'sql'
                ? 'text-emerald-400 bg-slate-800/80 border-t border-x border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            PostgreSQL Schema
          </button>
          <button
            onClick={() => setActiveTab('rls')}
            className={`px-3 py-1.5 text-xs font-medium rounded-t-lg transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'rls'
                ? 'text-emerald-400 bg-slate-800/80 border-t border-x border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Row Level Security (RLS)
          </button>
          <button
            onClick={() => setActiveTab('env')}
            className={`px-3 py-1.5 text-xs font-medium rounded-t-lg transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'env'
                ? 'text-emerald-400 bg-slate-800/80 border-t border-x border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Environment Variables (.env)
          </button>
          <button
            onClick={() => setActiveTab('status')}
            className={`px-3 py-1.5 text-xs font-medium rounded-t-lg transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'status'
                ? 'text-emerald-400 bg-slate-800/80 border-t border-x border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Engine Status
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 font-mono text-xs">
          {activeTab === 'firebase' && (
            <div className="relative">
              <button
                onClick={() => handleCopy(firebaseConfigSnippet)}
                className="absolute top-2 right-2 flex items-center gap-1.5 px-2.5 py-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <pre className="p-4 bg-slate-950 rounded-lg border border-slate-800 text-slate-300 overflow-x-auto leading-relaxed">
                {firebaseConfigSnippet}
              </pre>
            </div>
          )}

          {activeTab === 'sql' && (
            <div className="relative">
              <button
                onClick={() => handleCopy(sqlSchema)}
                className="absolute top-2 right-2 flex items-center gap-1.5 px-2.5 py-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied SQL' : 'Copy SQL'}</span>
              </button>
              <pre className="p-4 bg-slate-950 rounded-lg border border-slate-800 text-slate-300 overflow-x-auto leading-relaxed">
                {sqlSchema}
              </pre>
            </div>
          )}

          {activeTab === 'rls' && (
            <div className="relative">
              <button
                onClick={() => handleCopy(rlsPolicies)}
                className="absolute top-2 right-2 flex items-center gap-1.5 px-2.5 py-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied RLS' : 'Copy RLS'}</span>
              </button>
              <pre className="p-4 bg-slate-950 rounded-lg border border-slate-800 text-slate-300 overflow-x-auto leading-relaxed">
                {rlsPolicies}
              </pre>
            </div>
          )}

          {activeTab === 'env' && (
            <div className="relative">
              <button
                onClick={() => handleCopy(envConfig)}
                className="absolute top-2 right-2 flex items-center gap-1.5 px-2.5 py-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <pre className="p-4 bg-slate-950 rounded-lg border border-slate-800 text-emerald-300 overflow-x-auto leading-relaxed">
                {envConfig}
              </pre>
            </div>
          )}

          {activeTab === 'status' && (
            <div className="space-y-4 font-sans text-sm">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${isSupabaseConfigured ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                  <div>
                    <p className="font-medium text-slate-200">Supabase Remote Backend Connection</p>
                    <p className="text-xs text-slate-400">
                      {isSupabaseConfigured
                        ? 'Connected to live Supabase PostgreSQL project'
                        : 'Using high-speed resilient local storage engine with full Supabase schema compliance'}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                  {isSupabaseConfigured ? 'Remote Connected' : 'Local Persistent Engine Active'}
                </span>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Storage State & Records</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="p-2.5 bg-slate-900/60 rounded border border-slate-800">
                    <p className="text-base font-bold text-white font-mono">{storage.getUsers().length}</p>
                    <p className="text-[11px] text-slate-400">Users & Staff</p>
                  </div>
                  <div className="p-2.5 bg-slate-900/60 rounded border border-slate-800">
                    <p className="text-base font-bold text-white font-mono">{storage.getProducts().length}</p>
                    <p className="text-[11px] text-slate-400">Catalog Products</p>
                  </div>
                  <div className="p-2.5 bg-slate-900/60 rounded border border-slate-800">
                    <p className="text-base font-bold text-white font-mono">{storage.getWorkoutPlans().length}</p>
                    <p className="text-[11px] text-slate-400">Active Workout Plans</p>
                  </div>
                  <div className="p-2.5 bg-slate-900/60 rounded border border-slate-800">
                    <p className="text-base font-bold text-white font-mono">{storage.getAssessments().length}</p>
                    <p className="text-[11px] text-slate-400">Assessments</p>
                  </div>
                </div>
              </div>

              {resetMessage && (
                <div className="p-3 bg-emerald-950/60 border border-emerald-800/80 rounded text-xs text-emerald-300">
                  {resetMessage}
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleResetData}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-rose-400 hover:text-white bg-rose-950/40 hover:bg-rose-900 border border-rose-800 rounded-lg transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset Seed Data</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950 flex justify-between items-center text-xs text-slate-400">
          <span>Row Level Security (RLS) protects all confidential member measurements</span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
