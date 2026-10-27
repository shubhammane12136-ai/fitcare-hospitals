import React, { useState } from 'react';
import {
  Dumbbell,
  CheckCircle2,
  Calendar,
  TrendingUp,
  Award,
  Clock,
  Sparkles,
  Heart,
  ChevronRight,
  ShieldCheck,
  Check,
  Zap,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import { storage } from '../../db/storage';
import { calculateBMI, getBMICategory } from '../../utils/fitnessCalculators';

interface MemberDashboardProps {
  onOpenWorkoutsTab: () => void;
  onOpenCatalogTab: () => void;
  onOpenCommunityTab: () => void;
}

export const MemberDashboard: React.FC<MemberDashboardProps> = ({
  onOpenWorkoutsTab,
  onOpenCatalogTab,
  onOpenCommunityTab,
}) => {
  const { currentUser, refreshState } = useAuth();
  const [completedExerciseIds, setCompletedExerciseIds] = useState<string[]>([]);
  const [isLoggingWorkout, setIsLoggingWorkout] = useState(false);
  const [logNotes, setLogNotes] = useState('');
  const [exertionLevel, setExertionLevel] = useState<number>(7);
  const [workoutLoggedSuccess, setWorkoutLoggedSuccess] = useState(false);

  if (!currentUser) return null;

  const workoutPlans = storage.getWorkoutPlans(currentUser.id);
  const activePlan = workoutPlans[0];
  const assessments = storage.getAssessments(currentUser.id);
  const recommendations = storage.getRecommendations(currentUser.id);
  const workoutLogs = storage.getWorkoutLogs(currentUser.id);

  // Today's workout selection
  const todaySchedule = activePlan?.schedule.find((d) => !d.isRestDay) || activePlan?.schedule[0];

  const bmi = calculateBMI(currentUser.heightCm, currentUser.weightKg);
  const bmiInfo = getBMICategory(bmi);

  // Weight history for chart
  const weightChartData = assessments.length > 0
    ? [...assessments]
        .reverse()
        .map((a) => ({
          date: a.date.slice(5),
          weight: a.weightKg,
          bodyFat: a.bodyFatPercentage || null,
        }))
    : [
        { date: 'Initial', weight: currentUser.weightKg, bodyFat: 18 },
        { date: 'Current', weight: currentUser.weightKg, bodyFat: 17.5 },
      ];

  const toggleExerciseCheck = (exId: string) => {
    if (completedExerciseIds.includes(exId)) {
      setCompletedExerciseIds(completedExerciseIds.filter((id) => id !== exId));
    } else {
      setCompletedExerciseIds([...completedExerciseIds, exId]);
    }
  };

  const handleFinishDailyWorkout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!todaySchedule) return;

    storage.addWorkoutLog({
      memberId: currentUser.id,
      workoutPlanId: activePlan?.id,
      dayNumber: todaySchedule.dayNumber,
      date: new Date().toISOString().split('T')[0],
      completedExercises: completedExerciseIds,
      durationMinutes: 50,
      perceivedExertion: exertionLevel,
      notes: logNotes || 'Completed prescribed routine with steady form.',
      completed: true,
    });

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    setWorkoutLoggedSuccess(true);
    setIsLoggingWorkout(false);
    refreshState();
    setTimeout(() => setWorkoutLoggedSuccess(false), 5000);
  };

  const handleAcknowledgeRec = (recId: string) => {
    storage.acknowledgeRecommendation(recId);
    refreshState();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Member Welcome Strip */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.profilePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
            alt={currentUser.fullName}
            referrerPolicy="no-referrer"
            className="w-14 h-14 rounded-full object-cover border-2 border-emerald-500/40 shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-white font-['Outfit']">
                Welcome back, {currentUser.fullName.split(' ')[0]}
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                {currentUser.membershipPlan}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Goal:{' '}
              <strong className="text-emerald-400 capitalize">
                {currentUser.fitnessGoal.replace('_', ' ')}
              </strong>{' '}
              · Coach:{' '}
              <span className="text-slate-200 font-medium">
                {currentUser.trainerName || 'Assigned soon'}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenWorkoutsTab}
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors whitespace-nowrap"
          >
            View Full Workout Plan
          </button>
        </div>
      </div>

      {workoutLoggedSuccess && (
        <div className="p-4 bg-emerald-950/60 border border-emerald-700/80 rounded-xl flex items-center justify-between text-emerald-200 text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Great job! Workout logged successfully and streak updated in the gym community.</span>
          </div>
          <button
            onClick={onOpenCommunityTab}
            className="text-xs font-semibold underline hover:text-white"
          >
            Check Leaderboard
          </button>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Weight & BMI */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl">
          <span className="text-xs font-medium text-slate-400">Current Weight</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-white font-mono tabular-nums">
              {currentUser.weightKg}
            </span>
            <span className="text-xs text-slate-400">kg</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            BMI: <span className="font-mono text-emerald-400">{bmi}</span> ({bmiInfo.label})
          </p>
        </div>

        {/* Metric 2: Completed Workouts */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl">
          <span className="text-xs font-medium text-slate-400">Logged Sessions</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-white font-mono tabular-nums">
              {workoutLogs.length}
            </span>
            <span className="text-xs text-slate-400">Total</span>
          </div>
          <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <Zap className="w-3 h-3" />
            <span>Consistent commitment</span>
          </p>
        </div>

        {/* Metric 3: Weekly Target Schedule */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl">
          <span className="text-xs font-medium text-slate-400">Schedule</span>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-bold text-white font-mono tabular-nums">
              {currentUser.preferredWorkoutDays.length}
            </span>
            <span className="text-xs text-slate-400">Days / Wk</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 truncate">
            {currentUser.preferredWorkoutDays.map((d) => d.slice(0, 3)).join(', ')}
          </p>
        </div>

        {/* Metric 4: Coach Check-In */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl">
          <span className="text-xs font-medium text-slate-400">Trainer Status</span>
          <div className="mt-2 flex items-center gap-1.5">
            <Award className="w-5 h-5 text-cyan-400 shrink-0" />
            <span className="text-sm font-semibold text-white truncate">
              {currentUser.trainerName || 'Staff Assigned'}
            </span>
          </div>
          <p className="text-[11px] text-cyan-300 mt-1">
            {assessments[0]?.nextAssessmentDate
              ? `Next Check-in: ${assessments[0].nextAssessmentDate}`
              : 'Assessments up to date'}
          </p>
        </div>
      </div>

      {/* Main Grid: Daily Workout Checklist (Left) & Progress Charts (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Daily Exercise Checklist (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Dumbbell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white font-['Outfit']">
                  Today's Training Session
                </h3>
                <p className="text-xs text-slate-400">
                  {todaySchedule ? todaySchedule.dayName : 'Rest & Recovery Day'}
                </p>
              </div>
            </div>

            {todaySchedule && (
              <span className="text-xs font-mono text-emerald-400">
                {completedExerciseIds.length} / {todaySchedule.exercises.length} Complete
              </span>
            )}
          </div>

          {todaySchedule ? (
            <div className="space-y-4">
              {/* Focus & Warmup Tips */}
              <div className="p-3.5 bg-slate-950 border border-slate-800/80 rounded-xl space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-300 font-medium">
                  <span>Focus: {todaySchedule.focus}</span>
                </div>
                <p className="text-slate-400">
                  <strong className="text-slate-300">Warm-up:</strong> {todaySchedule.warmUp}
                </p>
                {todaySchedule.trainerTips && (
                  <p className="text-emerald-400/90 text-[11px]">
                    <strong>Coach Note:</strong> {todaySchedule.trainerTips}
                  </p>
                )}
              </div>

              {/* Interactive Exercise Checklist */}
              <div className="space-y-2">
                {todaySchedule.exercises.map((exercise) => {
                  const isChecked = completedExerciseIds.includes(exercise.id);

                  return (
                    <div
                      key={exercise.id}
                      onClick={() => toggleExerciseCheck(exercise.id)}
                      className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        isChecked
                          ? 'bg-emerald-950/20 border-emerald-600/50 text-emerald-200'
                          : 'bg-slate-950 border-slate-800 hover:bg-slate-800/40 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                            isChecked
                              ? 'bg-emerald-500 border-emerald-500 text-slate-950'
                              : 'border-slate-700 bg-slate-900'
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <div>
                          <p className={`text-xs font-bold ${isChecked ? 'line-through text-slate-400' : 'text-white'}`}>
                            {exercise.name}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {exercise.sets} sets × {exercise.reps} reps · {exercise.restSec}s rest
                            {exercise.tempo ? ` · Tempo: ${exercise.tempo}` : ''}
                          </p>
                          {exercise.notes && (
                            <p className="text-[10px] text-slate-500 mt-0.5">{exercise.notes}</p>
                          )}
                        </div>
                      </div>

                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                        {exercise.category}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Log Workout Form */}
              {!isLoggingWorkout ? (
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setIsLoggingWorkout(true)}
                    className="px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Log Workout Completion</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFinishDailyWorkout} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Log Workout Details
                  </h4>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">
                      Perceived Exertion (1 = Very Light, 10 = Maximum Effort): <span className="font-mono text-emerald-400 font-bold">{exertionLevel}</span>
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={exertionLevel}
                      onChange={(e) => setExertionLevel(Number(e.target.value))}
                      className="w-full accent-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">
                      Workout Notes (Weights used, reps hit, or sensations)
                    </label>
                    <textarea
                      rows={2}
                      value={logNotes}
                      onChange={(e) => setLogNotes(e.target.value)}
                      placeholder="e.g. Bench press felt smooth at 80kg, completed all prescribed sets."
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsLoggingWorkout(false)}
                      className="px-3 py-1.5 text-xs text-slate-400 hover:text-white bg-slate-800 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg"
                    >
                      Submit Workout
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-950 border border-slate-800/80 rounded-xl space-y-2">
              <Calendar className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-xs text-slate-300 font-medium">Scheduled Rest & Muscle Recovery</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Recovery is when muscular hypertrophy and cardiovascular remodeling occur. Hydrate, eat balanced whole foods, and take a light walk.
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Progress Charts & Trainer Feedback (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Progress Chart */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white">Body Weight & Composition</h3>
                <p className="text-[11px] text-slate-400">Measured over certified trainer assessments</p>
              </div>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>

            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weightChartData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                  <XAxis dataKey="date" stroke="#64748B" fontSize={10} tickLine={false} />
                  <YAxis domain={['auto', 'auto']} stroke="#64748B" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="#10B981"
                    strokeWidth={2}
                    dot={{ fill: '#10B981', r: 3 }}
                    name="Weight (kg)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Coach Comments & Guidance */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">Coach Feedback</h3>
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
            </div>

            {assessments.length > 0 && assessments[0].trainerRecommendations ? (
              <div className="p-3.5 bg-slate-950 border border-slate-800/80 rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-semibold text-cyan-300">From Coach {assessments[0].trainerName}</span>
                  <span className="font-mono">{assessments[0].date}</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  {assessments[0].trainerRecommendations}
                </p>
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">No formal coach comments logged yet.</p>
            )}

            {/* Recommended Products */}
            <div className="pt-2 border-t border-slate-800/60">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 mb-2 block">
                Assigned Supplements & Nutrition
              </span>
              {recommendations.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No active product recommendations.</p>
              ) : (
                <div className="space-y-2">
                  {recommendations.map((rec) => (
                    <div
                      key={rec.id}
                      className="p-3 bg-slate-950 border border-slate-800/80 rounded-xl flex items-start justify-between gap-3 text-xs"
                    >
                      <div className="flex items-start gap-2.5">
                        <img
                          src={rec.productImage || '/src/assets/images/product_whey_isolate_1793118416422.jpg'}
                          alt={rec.productName}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-lg object-cover border border-slate-800 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-white line-clamp-1">{rec.productName}</p>
                          <p className="text-[11px] text-slate-400">{rec.dosageOrUsage}</p>
                          <p className="text-[10px] text-emerald-400/90 mt-0.5 line-clamp-1">{rec.reason}</p>
                        </div>
                      </div>

                      {!rec.acknowledgedByMember ? (
                        <button
                          onClick={() => handleAcknowledgeRec(rec.id)}
                          className="px-2 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded text-[10px] shrink-0 transition-colors"
                        >
                          Acknowledge
                        </button>
                      ) : (
                        <span className="text-[10px] font-mono text-slate-500 shrink-0">Reviewed</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
