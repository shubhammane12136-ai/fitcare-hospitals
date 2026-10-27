import React from 'react';
import { Dumbbell, Database, ShieldAlert, HeartHandshake } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface FooterProps {
  openDatabaseModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ openDatabaseModal }) => {
  const { gym } = useAuth();

  return (
    <footer className="mt-auto border-t border-slate-900 bg-slate-950 text-slate-400 text-xs">
      {/* Disclaimer Strip */}
      <div className="border-b border-slate-900/60 bg-slate-900/20 py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-start sm:items-center gap-2.5 text-[11px] text-slate-400 leading-relaxed">
          <ShieldAlert className="w-4 h-4 text-emerald-500/80 shrink-0 mt-0.5 sm:mt-0" />
          <p>
            <strong className="text-slate-300 font-medium">Healthcare & Clinical Notice:</strong> FitCare supports physical training management and goal tracking. Never disregard professional medical advice or delay seeking treatment because of workout routines or nutritional product listings.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="flex items-center gap-2 text-white font-semibold font-['Outfit']">
              <Dumbbell className="w-4 h-4 text-emerald-400" />
              <span>FitCare Management</span>
            </div>
            <span className="hidden sm:inline text-slate-700">·</span>
            <span className="text-slate-400">{gym.name}</span>
            <span className="hidden sm:inline text-slate-700">·</span>
            <span className="font-mono text-[11px] text-emerald-400/90">Gym Code: {gym.code}</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
            <button
              onClick={openDatabaseModal}
              className="flex items-center gap-1.5 text-slate-300 hover:text-emerald-400 transition-colors"
            >
              <Database className="w-3.5 h-3.5" />
              <span>Supabase Schema & RLS</span>
            </button>
            <span className="text-slate-700">·</span>
            <div className="flex items-center gap-1 text-slate-400">
              <HeartHandshake className="w-3.5 h-3.5 text-emerald-400" />
              <span>Goal-Oriented & Respectful Assessments</span>
            </div>
            <span className="text-slate-700">·</span>
            <span>&copy; {new Date().getFullYear()} FitCare Inc.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
