import React, { useState } from 'react';
import { X, Activity, Heart, ShieldCheck, Save, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { storage } from '../../db/storage';
import { UserProfile, FitnessAssessment } from '../../types';

interface AssessmentModalProps {
  member: UserProfile | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AssessmentModal: React.FC<AssessmentModalProps> = ({
  member,
  isOpen,
  onClose,
}) => {
  const { currentUser, refreshState } = useAuth();

  if (!isOpen || !member) return null;

  const [weightKg, setWeightKg] = useState<number>(member.weightKg || 70);
  const [bodyFat, setBodyFat] = useState<number>(18);
  const [waistCm, setWaistCm] = useState<number>(80);
  const [chestCm, setChestCm] = useState<number>(100);
  const [hipsCm, setHipsCm] = useState<number>(98);
  const [armCm, setArmCm] = useState<number>(34);
  const [restingHR, setRestingHR] = useState<number>(68);
  const [systolicBP, setSystolicBP] = useState<number>(118);
  const [diastolicBP, setDiastolicBP] = useState<number>(78);
  const [pushups, setPushups] = useState<number>(25);
  const [plankSec, setPlankSec] = useState<number>(60);
  const [goalNotes, setGoalNotes] = useState('');
  const [recommendations, setRecommendations] = useState('');
  const [nextDate, setNextDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    return d.toISOString().split('T')[0];
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setIsSubmitting(true);
    storage.addAssessment({
      memberId: member.id,
      memberName: member.fullName,
      trainerId: currentUser.id,
      trainerName: currentUser.fullName,
      date: new Date().toISOString().split('T')[0],
      weightKg: Number(weightKg),
      bodyFatPercentage: Number(bodyFat),
      waistCm: Number(waistCm),
      chestCm: Number(chestCm),
      hipsCm: Number(hipsCm),
      armCm: Number(armCm),
      restingHeartRateBpm: Number(restingHR),
      systolicBP: Number(systolicBP),
      diastolicBP: Number(diastolicBP),
      pushupsCount: Number(pushups),
      plankSeconds: Number(plankSec),
      goalDiscussionNotes: goalNotes || 'Discussed training adherence and positive progressive adaptation.',
      trainerRecommendations: recommendations || 'Continue progressive overload and prioritize protein intake with balanced rest.',
      nextAssessmentDate: nextDate,
    });

    setIsSubmitting(false);
    refreshState();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white font-['Outfit']">
                Record Fitness Assessment
              </h3>
              <p className="text-xs text-slate-400">
                Evaluation for <strong className="text-white">{member.fullName}</strong> · Confidential Record
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-5 text-xs">
          {/* Respectful Assessment Principle Note */}
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-start gap-2.5 text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-slate-300">Goal-Oriented Policy:</strong> Assessments focus on functional capability, stamina, and physiological markers. Maintain an encouraging, respectful environment without judgment based on appearance.
            </p>
          </div>

          {/* Section 1: Core Physical Measurements */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-bold text-cyan-400 mb-3">
              1. Body Composition & Circumferences
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Weight (kg) *</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Body Fat (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={bodyFat}
                  onChange={(e) => setBodyFat(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Waist (cm)</label>
                <input
                  type="number"
                  step="0.5"
                  value={waistCm}
                  onChange={(e) => setWaistCm(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Chest (cm)</label>
                <input
                  type="number"
                  step="0.5"
                  value={chestCm}
                  onChange={(e) => setChestCm(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Hips (cm)</label>
                <input
                  type="number"
                  step="0.5"
                  value={hipsCm}
                  onChange={(e) => setHipsCm(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Flexed Arm (cm)</label>
                <input
                  type="number"
                  step="0.5"
                  value={armCm}
                  onChange={(e) => setArmCm(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Cardiovascular & Physical Stamina */}
          <div className="border-t border-slate-800 pt-4">
            <h4 className="text-xs uppercase tracking-wider font-bold text-cyan-400 mb-3">
              2. Cardiovascular & Stamina Indicators
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Resting HR (bpm)</label>
                <input
                  type="number"
                  value={restingHR}
                  onChange={(e) => setRestingHR(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Systolic BP</label>
                <input
                  type="number"
                  value={systolicBP}
                  onChange={(e) => setSystolicBP(Number(e.target.value))}
                  placeholder="120"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Diastolic BP</label>
                <input
                  type="number"
                  value={diastolicBP}
                  onChange={(e) => setDiastolicBP(Number(e.target.value))}
                  placeholder="80"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Plank Hold (sec)</label>
                <input
                  type="number"
                  value={plankSec}
                  onChange={(e) => setPlankSec(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Goal Discussion & Trainer Recommendations */}
          <div className="border-t border-slate-800 pt-4 space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-bold text-cyan-400">
              3. Goal Discussion & Action Plan
            </h4>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Discussion of Member Goals & Preferred Improvements
              </label>
              <textarea
                rows={2}
                value={goalNotes}
                onChange={(e) => setGoalNotes(e.target.value)}
                placeholder="Discussed energy levels, strength milestones, recovery quality, and nutrition balance..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Trainer Guidance & Programming Recommendations
              </label>
              <textarea
                rows={2}
                value={recommendations}
                onChange={(e) => setRecommendations(e.target.value)}
                placeholder="Prescribed load adjustments, mobility drills, and targeted supplement/protein advice..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Next Follow-Up Check-In Date
              </label>
              <input
                type="date"
                value={nextDate}
                onChange={(e) => setNextDate(e.target.value)}
                className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-400 hover:text-white bg-slate-800 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg flex items-center gap-1.5 shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Saving...' : 'Save Assessment Record'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
