import React, { useState } from 'react';
import {
  Dumbbell,
  Shield,
  Award,
  Users,
  Activity,
  ArrowRight,
  CheckCircle2,
  Lock,
  ChevronRight,
  Database,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface LandingPageProps {
  onOpenAuthModal: (mode?: 'login' | 'register') => void;
  onOpenDatabaseModal: () => void;
  onEnterDashboard: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenAuthModal,
  onOpenDatabaseModal,
  onEnterDashboard,
}) => {
  const { gym, currentUser, quickSwitchRole } = useAuth();
  const [invitationCodeInput, setInvitationCodeInput] = useState('');
  const [codeVerified, setCodeVerified] = useState<boolean | null>(null);

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (invitationCodeInput.trim().toUpperCase() === gym.code.toUpperCase()) {
      setCodeVerified(true);
      setTimeout(() => onOpenAuthModal('register'), 600);
    } else {
      setCodeVerified(false);
    }
  };

  return (
    <div className="space-y-16 animate-in fade-in duration-200">
      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-950">
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/hero_gym_modern_1793118414840.jpg"
            alt="FitCare Performance Facility"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-20 sm:py-28 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium">
            <Dumbbell className="w-3.5 h-3.5" />
            <span>Smart Gym & Healthcare Management</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight font-['Outfit'] max-w-4xl mx-auto leading-tight sm:leading-tight">
            Centralized Training, Clinical Tracking & Community for High-Performance Gyms
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Connecting gym owners, certified personal trainers, and registered gym members through one secure system. Personalized workout schedules, respectful fitness assessments, and clean sports nutrition.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => onOpenAuthModal('register')}
              className="w-full sm:w-auto px-6 py-3 text-sm font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <span>Join As A Gym Member</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onEnterDashboard}
              className="w-full sm:w-auto px-6 py-3 text-sm font-semibold text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-700 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <span>Open Staff & Member Dashboard</span>
            </button>
          </div>

          {/* Quick Joining Code Input */}
          <div className="pt-6 max-w-md mx-auto">
            <form onSubmit={handleVerifyCode} className="flex items-center gap-2 p-1.5 bg-slate-900/90 border border-slate-800 rounded-xl">
              <input
                type="text"
                value={invitationCodeInput}
                onChange={(e) => {
                  setInvitationCodeInput(e.target.value);
                  setCodeVerified(null);
                }}
                placeholder="Enter Gym Joining Code (e.g. APEX-2026)..."
                className="flex-1 bg-transparent px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none font-mono uppercase"
              />
              <button
                type="submit"
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors whitespace-nowrap"
              >
                Join Gym
              </button>
            </form>
            {codeVerified === true && (
              <p className="text-xs text-emerald-400 mt-2">Code verified for {gym.name}! Opening registration...</p>
            )}
            {codeVerified === false && (
              <p className="text-xs text-rose-400 mt-2">Invalid code. Try using "{gym.code}".</p>
            )}
          </div>
        </div>
      </section>

      {/* Role Previews & Architecture */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold text-white font-['Outfit']">
            Tailored Experiences For Every Role
          </h2>
          <p className="text-xs text-slate-400 max-w-lg mx-auto">
            Switch effortlessly between owner administrative controls, trainer programming tools, and member fitness tracking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Gym Owner */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between space-y-4 hover:border-slate-700 transition-colors">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white font-['Outfit']">
                Gym Owner & Admin
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Oversee total registered members, active trainer rosters, product inventory, and aggregate completion metrics.
              </p>
              <ul className="text-xs text-slate-300 space-y-1.5 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Searchable member directory & filters</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Assign trainers to registered trainees</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Aggregate progress and volume charts</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => {
                quickSwitchRole('owner');
                onEnterDashboard();
              }}
              className="w-full py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Explore as Owner (Varad Sutar)</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2: Gym Trainer */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between space-y-4 hover:border-slate-700 transition-colors">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white font-['Outfit']">
                Certified Trainer
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Evaluate member progress, conduct goal discussions, program custom multi-week workout plans, and recommend nutrition.
              </p>
              <ul className="text-xs text-slate-300 space-y-1.5 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Assigned member coaching roster</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Record respectful health & stamina assessments</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Custom exercise sets, reps & rest editor</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => {
                quickSwitchRole('trainer');
                onEnterDashboard();
              }}
              className="w-full py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Explore as Coach (Marcus Cole)</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 3: Gym Member */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between space-y-4 hover:border-slate-700 transition-colors">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white font-['Outfit']">
                Gym Member / User
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Access your personalized workout schedule, tick off daily exercises in real-time, view body composition charts, and join community quests.
              </p>
              <ul className="text-xs text-slate-300 space-y-1.5 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Interactive daily workout checklist</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Private weight & stamina progress charts</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Trainer feedback & supplement guidance</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => {
                quickSwitchRole('member');
                onEnterDashboard();
              }}
              className="w-full py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Explore as Member (David Miller)</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Security & RLS Banner */}
      <section className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Row Level Security & Medical Privacy</h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Strict PostgreSQL RLS ensures confidential body measurements and coach evaluations are only accessible to the assigned coach and member.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenDatabaseModal}
          className="px-4 py-2 text-xs font-mono text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
        >
          <Database className="w-3.5 h-3.5 text-emerald-400" />
          <span>Inspect Supabase Schema</span>
        </button>
      </section>
    </div>
  );
};
