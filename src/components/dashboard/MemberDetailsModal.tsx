import React from 'react';
import {
  X,
  User,
  Activity,
  Award,
  Calendar,
  Lock,
  Dumbbell,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { storage } from '../../db/storage';
import { UserProfile } from '../../types';
import { calculateBMI, getBMICategory } from '../../utils/fitnessCalculators';

interface MemberDetailsModalProps {
  member: UserProfile | null;
  onClose: () => void;
  onOpenAssessmentModal?: (member: UserProfile) => void;
  onOpenWorkoutEditor?: (member: UserProfile) => void;
}

export const MemberDetailsModal: React.FC<MemberDetailsModalProps> = ({
  member,
  onClose,
  onOpenAssessmentModal,
}) => {
  const { currentUser } = useAuth();

  if (!member) return null;

  const isAuthorized =
    currentUser?.id === member.id ||
    currentUser?.role === 'owner' ||
    (currentUser?.role === 'trainer' && member.trainerId === currentUser.id);

  const assessments = storage.getAssessments(member.id);
  const bmi = calculateBMI(member.heightCm, member.weightKg);
  const bmiInfo = getBMICategory(bmi);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={member.profilePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
              alt={member.fullName}
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-full object-cover border border-slate-700"
            />
            <div>
              <h3 className="text-base font-bold text-white font-['Outfit']">{member.fullName}</h3>
              <p className="text-xs text-slate-400">
                {member.email} · {member.phone || 'No phone'}
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
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Membership</span>
              <p className="font-bold text-white font-mono mt-0.5">{member.membershipPlan}</p>
            </div>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Status</span>
              <p className="font-bold text-emerald-400 capitalize mt-0.5">{member.joinStatus}</p>
            </div>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Assigned Trainer</span>
              <p className="font-bold text-cyan-300 truncate mt-0.5">
                {member.trainerName || 'Unassigned'}
              </p>
            </div>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Joined Date</span>
              <p className="font-mono text-slate-300 mt-0.5">{member.joinedDate}</p>
            </div>
          </div>

          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Training Preferences
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div>
                <span className="text-slate-400">Primary Goal:</span>
                <p className="font-semibold text-emerald-400 capitalize mt-0.5">
                  {member.fitnessGoal.replace('_', ' ')}
                </p>
              </div>
              <div>
                <span className="text-slate-400">Experience:</span>
                <p className="text-slate-200 capitalize mt-0.5">{member.fitnessExperience}</p>
              </div>
              <div>
                <span className="text-slate-400">Equipment Access:</span>
                <p className="text-slate-200 capitalize mt-0.5">
                  {member.availableEquipment.replace('_', ' ')}
                </p>
              </div>
            </div>
            <div className="pt-2">
              <span className="text-slate-400">Preferred Days: </span>
              <span className="text-slate-200">{member.preferredWorkoutDays.join(', ')}</span>
            </div>
          </div>

          <div className="border border-slate-800 rounded-xl p-4 bg-slate-950/70 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Health & Fitness Measurements (Confidential)
                </h4>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                {isAuthorized ? 'Authorized Access' : 'Private'}
              </span>
            </div>

            {isAuthorized ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400">Height</span>
                    <p className="font-bold text-white font-mono">{member.heightCm} cm</p>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400">Weight</span>
                    <p className="font-bold text-emerald-400 font-mono">{member.weightKg} kg</p>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400">BMI</span>
                    <p className="font-bold text-white font-mono">{bmi}</p>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400">Classification</span>
                    <p className="font-medium text-slate-300 truncate">{bmiInfo.label}</p>
                  </div>
                </div>

                {assessments.length > 0 && (
                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800/80 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="font-semibold text-cyan-300">
                        Latest Assessment ({assessments[0].date}) by {assessments[0].trainerName}
                      </span>
                      {assessments[0].restingHeartRateBpm && (
                        <span className="font-mono">Resting HR: {assessments[0].restingHeartRateBpm} bpm</span>
                      )}
                    </div>
                    {assessments[0].goalDiscussionNotes && (
                      <p className="text-slate-300 italic">{assessments[0].goalDiscussionNotes}</p>
                    )}
                    {assessments[0].trainerRecommendations && (
                      <p className="text-emerald-300/90">{assessments[0].trainerRecommendations}</p>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 bg-slate-900/60 rounded-lg border border-slate-800 flex items-center gap-3 text-slate-400">
                <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                <p>
                  Confidential physical measurements and clinical assessment history are accessible only to the member, their assigned trainer, and gym administration.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950 flex justify-between items-center text-xs">
          <span className="text-slate-500 font-mono">ID: {member.id}</span>
          <div className="flex items-center gap-2">
            {isAuthorized && onOpenAssessmentModal && (
              <button
                onClick={() => {
                  onClose();
                  onOpenAssessmentModal(member);
                }}
                className="px-3 py-1.5 text-xs text-cyan-400 bg-cyan-950/40 border border-cyan-800 rounded-lg hover:bg-cyan-900 transition-colors"
              >
                + Record Assessment
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
