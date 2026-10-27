import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Award,
  CheckCircle,
  XCircle,
  ChevronRight,
  Shield,
  Dumbbell,
  Calendar,
  Lock,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { storage } from '../../db/storage';
import { UserProfile } from '../../types';
import { calculateBMI, getBMICategory } from '../../utils/fitnessCalculators';

interface MemberDirectoryViewProps {
  onSelectMember: (member: UserProfile) => void;
}

export const MemberDirectoryView: React.FC<MemberDirectoryViewProps> = ({ onSelectMember }) => {
  const { currentUser, refreshState } = useAuth();
  const [search, setSearch] = useState('');
  const [goalFilter, setGoalFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [assigningMember, setAssigningMember] = useState<UserProfile | null>(null);
  const [selectedTrainerId, setSelectedTrainerId] = useState('');

  const users = storage.getUsers();
  const members = users.filter((u) => u.role === 'member');
  const trainers = users.filter((u) => u.role === 'trainer');

  const filtered = members.filter((m) => {
    const matchesSearch =
      m.fullName.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      (m.phone && m.phone.includes(search));
    const matchesGoal = goalFilter === 'all' || m.fitnessGoal === goalFilter;
    const matchesStatus = statusFilter === 'all' || m.joinStatus === statusFilter;
    return matchesSearch && matchesGoal && matchesStatus;
  });

  const handleAssign = () => {
    if (!assigningMember || !selectedTrainerId) return;
    storage.assignTrainerToMember(assigningMember.id, selectedTrainerId);
    setAssigningMember(null);
    setSelectedTrainerId('');
    refreshState();
  };

  const isOwner = currentUser?.role === 'owner';

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-white font-['Outfit']">
              Member Directory
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
              {filtered.length} of {members.length} Members
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Registered gym roster, training assignments, and membership records
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email..."
              className="pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 w-48 sm:w-60"
            />
          </div>

          <select
            value={goalFilter}
            onChange={(e) => setGoalFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Goals</option>
            <option value="muscle_building">Muscle Building</option>
            <option value="weight_loss">Weight Loss</option>
            <option value="general_fitness">General Fitness</option>
            <option value="endurance">Endurance</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Memberships</option>
            <option value="pending">Pending Approval</option>
          </select>
        </div>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((member) => {
          const bmi = calculateBMI(member.heightCm, member.weightKg);
          const bmiInfo = getBMICategory(bmi);

          return (
            <div
              key={member.id}
              className="p-5 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl flex flex-col justify-between transition-all space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={member.profilePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                      alt={member.fullName}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-full object-cover border border-slate-700 shrink-0"
                    />
                    <div>
                      <h3 className="text-sm font-bold text-white">{member.fullName}</h3>
                      <p className="text-xs text-slate-400">{member.email}</p>
                      <p className="text-[10px] text-slate-500 font-mono">{member.phone}</p>
                    </div>
                  </div>

                  <span
                    className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded border ${
                      member.joinStatus === 'active'
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                        : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                    }`}
                  >
                    {member.joinStatus}
                  </span>
                </div>

                {/* Training Details */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Goal:</span>
                    <strong className="text-slate-200 capitalize">
                      {member.fitnessGoal.replace('_', ' ')}
                    </strong>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Equipment:</span>
                    <span className="text-slate-300 capitalize">
                      {member.availableEquipment.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Assigned Coach:</span>
                    {member.trainerName ? (
                      <span className="text-cyan-400 font-semibold flex items-center gap-1">
                        <Award className="w-3.5 h-3.5" />
                        {member.trainerName}
                      </span>
                    ) : (
                      <span className="text-amber-400 font-mono text-[11px]">Unassigned</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Membership Tier:</span>
                    <span className="font-mono text-slate-200">{member.membershipPlan}</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span>Joined: {member.joinedDate}</span>
                    <span>Code: {member.gymCode}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                {isOwner && (
                  <button
                    onClick={() => {
                      setAssigningMember(member);
                      setSelectedTrainerId(member.trainerId || trainers[0]?.id || '');
                    }}
                    className="px-2.5 py-1 text-[11px] text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
                  >
                    {member.trainerId ? 'Reassign Coach' : 'Assign Coach'}
                  </button>
                )}

                <button
                  onClick={() => onSelectMember(member)}
                  className="px-3 py-1 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors ml-auto flex items-center gap-1"
                >
                  <span>View Profile</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trainer Assign Modal */}
      {assigningMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-semibold text-white font-['Outfit']">
              Assign Coach to {assigningMember.fullName}
            </h3>

            <div className="space-y-2">
              {trainers.map((t) => (
                <label
                  key={t.id}
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedTrainerId === t.id
                      ? 'bg-slate-800 border-emerald-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="trainerAssign"
                      value={t.id}
                      checked={selectedTrainerId === t.id}
                      onChange={() => setSelectedTrainerId(t.id)}
                      className="text-emerald-500"
                    />
                    <div>
                      <p className="text-xs font-semibold">{t.fullName}</p>
                      <p className="text-[11px] text-slate-400">{t.email}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400">
                    {members.filter((m) => m.trainerId === t.id).length} Active
                  </span>
                </label>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setAssigningMember(null)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white bg-slate-800 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleAssign}
                className="px-4 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg"
              >
                Confirm Assignment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
