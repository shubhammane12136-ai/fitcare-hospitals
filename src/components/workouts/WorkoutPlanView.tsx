import React, { useState } from 'react';
import {
  Dumbbell,
  Clock,
  Flame,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Sparkles,
  Info,
  ChevronDown,
  ChevronUp,
  Shield,
  HeartPulse,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { storage } from '../../db/storage';
import { WorkoutPlan, WorkoutDay, Exercise } from '../../types';

export const WorkoutPlanView: React.FC = () => {
  const { currentUser } = useAuth();
  const allPlans = storage.getWorkoutPlans();

  // Pick default plan based on role
  let initialPlan = allPlans[0];
  if (currentUser?.role === 'member') {
    const memberPlan = allPlans.find((p) => p.memberId === currentUser.id);
    if (memberPlan) initialPlan = memberPlan;
  }

  const [selectedPlanId, setSelectedPlanId] = useState<string>(initialPlan?.id || '');
  const [activeDayIndex, setActiveDayIndex] = useState<number>(0);
  const [expandedExerciseId, setExpandedExerciseId] = useState<string | null>(null);

  const plan = allPlans.find((p) => p.id === selectedPlanId) || allPlans[0];
  const currentDay: WorkoutDay | undefined = plan?.schedule[activeDayIndex] || plan?.schedule[0];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header & Plan Selector */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              {plan?.goal.replace('_', ' ')}
            </span>
            <span className="text-xs text-slate-400">· {plan?.experienceLevel} Level</span>
            <span className="text-xs text-slate-400">· {plan?.durationWeeks} Weeks Duration</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white font-['Outfit'] mt-1">
            {plan?.title || 'Personalized Workout Plan'}
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            {plan?.description}
          </p>
          {plan?.memberName && (
            <p className="text-xs text-slate-300 mt-2">
              <span className="text-slate-500">Assigned to:</span>{' '}
              <strong className="text-white">{plan.memberName}</strong>
            </p>
          )}
        </div>

        {/* Plan Switcher for Coaches / Owner */}
        {(currentUser?.role === 'owner' || currentUser?.role === 'trainer') && allPlans.length > 1 && (
          <div className="flex flex-col gap-1 text-xs">
            <label className="text-slate-400 font-medium">Select Member Plan:</label>
            <select
              value={selectedPlanId}
              onChange={(e) => {
                setSelectedPlanId(e.target.value);
                setActiveDayIndex(0);
              }}
              className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              {allPlans.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} ({p.memberName || 'Template'})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Safety & Medical Warnings Banner */}
      <div className="p-4 bg-slate-900/90 border border-amber-900/40 rounded-2xl space-y-2">
        <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider">
          <AlertTriangle className="w-4 h-4" />
          <span>Safety Guidelines & Clinical Precautions</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-300">
          {plan?.safetyWarnings?.map((warning, idx) => (
            <div key={idx} className="flex items-start gap-2 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
              <span className="text-amber-400 font-bold">·</span>
              <span>{warning}</span>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-slate-400 italic pt-1 border-t border-slate-800/60">
          Medical Disclaimer: {plan?.medicalDisclaimer}
        </p>
      </div>

      {/* Schedule Tabs */}
      {plan?.schedule && plan.schedule.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
            {plan.schedule.map((day, idx) => {
              const isActive = idx === activeDayIndex;
              return (
                <button
                  key={day.dayNumber}
                  onClick={() => setActiveDayIndex(idx)}
                  className={`px-4 py-2.5 rounded-xl border text-left transition-all whitespace-nowrap shrink-0 flex items-center gap-2.5 ${
                    isActive
                      ? 'bg-emerald-500/15 border-emerald-500/60 text-white shadow-sm'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <Calendar className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                  <div>
                    <span className="text-xs font-bold block">{day.dayName}</span>
                    <span className="text-[10px] text-slate-400 block truncate max-w-[140px]">
                      {day.title}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Day Workout Schedule */}
          {currentDay && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-white font-['Outfit']">
                    {currentDay.dayName}: {currentDay.title}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {currentDay.isRestDay
                      ? 'Active recovery day. Focus on hydration, mobility, and tissue restoration.'
                      : `${currentDay.exercises.length} programmed exercises · ${currentDay.warmUp || 'Dynamic warm-up'} · ${currentDay.coolDown || 'Cool-down stretches'}`}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 font-mono">
                    {currentDay.isRestDay ? 'Rest & Recovery' : `${currentDay.exercises.length} Exercises`}
                  </span>
                </div>
              </div>

              {/* Warm-up & Cool-down Strips */}
              {!currentDay.isRestDay && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentDay.warmUp && (
                    <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl flex items-start gap-3">
                      <Flame className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs font-semibold text-white block">Pre-Workout Warm-up (5-8 min)</span>
                        <p className="text-xs text-slate-400 mt-0.5">{currentDay.warmUp}</p>
                      </div>
                    </div>
                  )}
                  {currentDay.coolDown && (
                    <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl flex items-start gap-3">
                      <HeartPulse className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs font-semibold text-white block">Post-Workout Cool-down & Decompress</span>
                        <p className="text-xs text-slate-400 mt-0.5">{currentDay.coolDown}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Exercise Cards */}
              {currentDay.isRestDay ? (
                <div className="p-10 text-center bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
                  <Shield className="w-10 h-10 text-emerald-400 mx-auto" />
                  <h3 className="text-base font-semibold text-white">Scheduled Rest & Muscle Recovery</h3>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    Muscles repair and grow stronger during recovery. Ensure adequate protein intake (1.6-2.0g per kg body weight), quality sleep, and light walking or mobility work.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {currentDay.exercises.map((ex, idx) => {
                    const isExpanded = expandedExerciseId === ex.id;
                    return (
                      <div
                        key={ex.id}
                        className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden transition-all hover:border-slate-700"
                      >
                        <div
                          onClick={() => setExpandedExerciseId(isExpanded ? null : ex.id)}
                          className="p-4 flex items-center justify-between gap-4 cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-7 h-7 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-xs font-bold font-mono text-emerald-400 shrink-0">
                              {idx + 1}
                            </span>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="text-sm font-semibold text-white">
                                  {ex.name}
                                </h3>
                                <span className="text-[10px] uppercase font-mono px-2 py-0.2 rounded bg-slate-950 text-slate-400 border border-slate-800">
                                  {ex.category}
                                </span>
                              </div>
                              <div className="mt-1 flex items-center gap-3 text-xs text-slate-400 font-mono">
                                <span>{ex.sets} sets × {ex.reps} reps</span>
                                <span>·</span>
                                <span>{ex.restSec}s rest</span>
                                {ex.tempo && (
                                  <>
                                    <span>·</span>
                                    <span>Tempo: {ex.tempo}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <button
                              type="button"
                              className="text-slate-400 hover:text-white p-1"
                              aria-label="Expand instructions"
                            >
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        {/* Detailed instructions & cues */}
                        {isExpanded && (
                          <div className="px-4 pb-4 pt-2 border-t border-slate-800/80 bg-slate-950/60 text-xs space-y-3">
                            {ex.notes && (
                              <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-emerald-300/90 text-[11px] flex items-start gap-2">
                                <Info className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                <span>Execution Cue: {ex.notes}</span>
                              </div>
                            )}

                            {currentDay.trainerTips && (
                              <div className="text-[11px] text-slate-400">
                                <span className="font-semibold text-slate-300">Daily Coach Focus: </span>
                                {currentDay.trainerTips}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
