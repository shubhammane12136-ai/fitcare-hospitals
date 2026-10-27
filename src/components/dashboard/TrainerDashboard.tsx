import React, { useState } from 'react';
import {
  Users,
  Award,
  Calendar,
  Activity,
  Heart,
  FileText,
  Plus,
  Dumbbell,
  Clock,
  CheckCircle,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { storage } from '../../db/storage';
import { UserProfile, FitnessAssessment } from '../../types';
import { calculateBMI, getBMICategory } from '../../utils/fitnessCalculators';

interface TrainerDashboardProps {
  onOpenAssessment: (member: UserProfile) => void;
  onOpenWorkoutEditor: (member: UserProfile) => void;
  onOpenProductRecommend?: (member: UserProfile) => void;
}

export const TrainerDashboard: React.FC<TrainerDashboardProps> = ({
  onOpenAssessment,
  onOpenWorkoutEditor,
}) => {
  const { currentUser } = useAuth();
  const allUsers = storage.getUsers();

  // Trainees assigned to this trainer
  const assignedTrainees = allUsers.filter(
    (u) => u.role === 'member' && u.trainerId === currentUser?.id
  );

  const [selectedMemberId, setSelectedMemberId] = useState<string>(
    assignedTrainees[0]?.id || ''
  );

  const selectedMember =
    assignedTrainees.find((m) => m.id === selectedMemberId) ||
    assignedTrainees[0];

  const assessments: FitnessAssessment[] = selectedMember
    ? storage.getAssessments(selectedMember.id)
    : [];

  const [feedbackNote, setFeedbackNote] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveFeedback = () => {
    if (!feedbackNote.trim() || !selectedMember || !currentUser) return;
    storage.addNotification({
      id: 'notif-' + Date.now(),
      userId: selectedMember.id,
      title: 'Coach Feedback from ' + currentUser.fullName,
      message: feedbackNote,
      read: false,
      date: new Date().toISOString().split('T')[0],
      type: 'assessment',
    });
    setSaveSuccess(true);
    setFeedbackNote('');
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const bmi = selectedMember
    ? calculateBMI(selectedMember.heightCm, selectedMember.weightKg)
    : 0;
  const bmiInfo = getBMICategory(bmi);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header Profile Strip */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={
              currentUser?.profilePhoto ||
              'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
            }
            alt={currentUser?.fullName || 'Trainer'}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-cyan-500/30"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-white font-['Outfit']">
                Coach {currentUser?.fullName}
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
                Certified Trainer
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Personalized training, respectful health evaluations & nutritional guidance
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs bg-slate-950 p-2.5 rounded-xl border border-slate-800">
          <Users className="w-4 h-4 text-cyan-400" />
          <span className="text-slate-300">Assigned Trainees:</span>
          <strong className="text-white font-mono text-sm">{assignedTrainees.length}</strong>
        </div>
      </div>

      {assignedTrainees.length === 0 ? (
        <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl">
          <Users className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white">No Trainees Assigned Yet</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            The Gym Owner will assign members to your coaching roster. You can also review member requests in the directory.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Trainee Roster */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center justify-between">
              <span>Your Trainee Roster</span>
              <span className="text-xs text-cyan-400 font-mono font-normal">
                {assignedTrainees.length} Active
              </span>
            </h3>

            <div className="space-y-2">
              {assignedTrainees.map((trainee) => {
                const isSelected = trainee.id === selectedMember?.id;
                return (
                  <button
                    key={trainee.id}
                    onClick={() => setSelectedMemberId(trainee.id)}
                    className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-center justify-between group ${
                      isSelected
                        ? 'bg-slate-800/90 border-cyan-500/80 shadow-md'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          trainee.profilePhoto ||
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
                        }
                        alt={trainee.fullName}
                        className="w-10 h-10 rounded-full object-cover border border-slate-700"
                      />
                      <div>
                        <p className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors">
                          {trainee.fullName}
                        </p>
                        <p className="text-[11px] text-slate-400 capitalize">
                          {trainee.fitnessGoal.replace('_', ' ')} · {trainee.fitnessExperience}
                        </p>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Selected Trainee Management */}
          {selectedMember && (
            <div className="lg:col-span-2 space-y-6">
              {/* Member Card */}
              <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={
                        selectedMember.profilePhoto ||
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
                      }
                      alt={selectedMember.fullName}
                      className="w-14 h-14 rounded-full object-cover border border-slate-700"
                    />
                    <div>
                      <h2 className="text-lg font-bold text-white font-['Outfit']">
                        {selectedMember.fullName}
                      </h2>
                      <p className="text-xs text-slate-400">
                        {selectedMember.email} · {selectedMember.phone || 'No phone'}
                      </p>
                      <div className="mt-1 flex items-center gap-2 text-[11px] text-cyan-300">
                        <span className="capitalize">{selectedMember.fitnessGoal.replace('_', ' ')}</span>
                        <span>·</span>
                        <span>{selectedMember.heightCm} cm</span>
                        <span>·</span>
                        <span>{selectedMember.weightKg} kg</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => onOpenAssessment(selectedMember)}
                      className="px-3.5 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Record Assessment</span>
                    </button>
                    <button
                      onClick={() => onOpenWorkoutEditor(selectedMember)}
                      className="px-3 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <Dumbbell className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Edit Workout Plan</span>
                    </button>
                  </div>
                </div>

                {/* Trainee Stats Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Reference BMI</span>
                    <p className="text-base font-bold text-white font-mono mt-0.5">{bmi}</p>
                    <span className="text-[10px] text-emerald-400">{bmiInfo.label}</span>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Equipment</span>
                    <p className="text-xs font-semibold text-white capitalize mt-1 truncate">
                      {selectedMember.availableEquipment.replace('_', ' ')}
                    </p>
                    <span className="text-[10px] text-slate-500">Facility access</span>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Schedule</span>
                    <p className="text-xs font-semibold text-white mt-1">
                      {selectedMember.preferredWorkoutDays.length} Days/Wk
                    </p>
                    <span className="text-[10px] text-cyan-400">Consistent</span>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Assessments</span>
                    <p className="text-base font-bold text-white font-mono mt-0.5">{assessments.length}</p>
                    <span className="text-[10px] text-slate-400">Recorded</span>
                  </div>
                </div>

                {/* Respectful Clinical Assessments Section */}
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-rose-400" />
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
                        Confidential Health & Stamina Evaluations
                      </h4>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">Protected by RLS</span>
                  </div>

                  {assessments.length === 0 ? (
                    <div className="p-4 text-center bg-slate-950 rounded-xl border border-slate-800">
                      <p className="text-xs text-slate-400">
                        No evaluations logged yet. Click <strong>Record Assessment</strong> to track resting HR, stamina, circumferences, and goals.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {assessments.slice(0, 3).map((a) => (
                        <div
                          key={a.id}
                          className="p-3.5 bg-slate-950 rounded-xl border border-slate-800/80 space-y-2 text-xs"
                        >
                          <div className="flex items-center justify-between text-[11px] text-slate-400">
                            <span className="font-semibold text-white">Date: {a.date}</span>
                            <span className="font-mono text-cyan-400">Resting HR: {a.restingHeartRateBpm || '--'} bpm</span>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-[11px]">
                            <div>
                              <span className="text-slate-500 block text-[10px]">Weight</span>
                              <span className="text-slate-200 font-semibold">{a.weightKg} kg</span>
                            </div>
                            <div>
                              <span className="text-slate-500 block text-[10px]">Blood Pressure</span>
                              <span className="text-slate-200">
                                {a.systolicBP && a.diastolicBP ? `${a.systolicBP}/${a.diastolicBP} mmHg` : 'Not recorded'}
                              </span>
                            </div>
                            <div>
                              <span className="text-slate-500 block text-[10px]">Push-up Stamina</span>
                              <span className="text-slate-200">{a.pushupsCount ? `${a.pushupsCount} reps` : '--'}</span>
                            </div>
                            <div>
                              <span className="text-slate-500 block text-[10px]">Plank Endurance</span>
                              <span className="text-slate-200">{a.plankSeconds ? `${a.plankSeconds}s` : '--'}</span>
                            </div>
                          </div>

                          {a.goalDiscussionNotes && (
                            <div className="pt-2 border-t border-slate-800/60 text-[11px] text-slate-300">
                              <span className="text-slate-500 block text-[10px] uppercase font-semibold">Trainee Goals & Notes:</span>
                              <p className="mt-0.5 leading-relaxed">{a.goalDiscussionNotes}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Trainer Coach Notes & Messaging */}
                <div className="pt-4 border-t border-slate-800 space-y-3">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-emerald-400" />
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
                      Send Coach Guidance & Form Feedback
                    </h4>
                  </div>
                  <textarea
                    rows={3}
                    value={feedbackNote}
                    onChange={(e) => setFeedbackNote(e.target.value)}
                    placeholder={`Write tailored feedback for ${selectedMember.fullName} (e.g. progressive overload adjustments, recovery recommendations)...`}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 leading-relaxed"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">
                      Feedback appears directly on member's daily dashboard
                    </span>
                    <button
                      onClick={handleSaveFeedback}
                      disabled={!feedbackNote.trim()}
                      className="px-4 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm transition-colors"
                    >
                      {saveSuccess ? 'Sent to Member!' : 'Send Coaching Note'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
