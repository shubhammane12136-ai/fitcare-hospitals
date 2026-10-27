import React, { useState } from 'react';
import {
  Users,
  Award,
  TrendingUp,
  Package,
  UserCheck,
  Search,
  Filter,
  Dumbbell,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Shield,
  Activity,
  ArrowUpRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { storage } from '../../db/storage';
import { UserProfile, FitnessGoal } from '../../types';
import { isAuthorizedOwnerEmail, DESIGNATED_OWNER, firebaseConfig } from '../../firebase/config';
import { Flame } from 'lucide-react';

interface OwnerDashboardProps {
  onOpenDirectoryTab: () => void;
  onOpenCatalogTab: () => void;
  onSelectMember: (member: UserProfile) => void;
}

const GOAL_COLORS: Record<string, string> = {
  muscle_building: '#10B981',
  weight_loss: '#06B6D4',
  general_fitness: '#8B5CF6',
  endurance: '#F59E0B',
  weight_gain: '#EC4899',
};

export const OwnerDashboard: React.FC<OwnerDashboardProps> = ({
  onOpenDirectoryTab,
  onOpenCatalogTab,
  onSelectMember,
}) => {
  const { currentUser, gym, refreshState } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [goalFilter, setGoalFilter] = useState<string>('all');
  const [selectedMemberForTrainer, setSelectedMemberForTrainer] = useState<UserProfile | null>(null);
  const [selectedTrainerId, setSelectedTrainerId] = useState<string>('');

  // STRICT SECURITY CHECK: Owner dashboard can NEVER be opened by another email
  if (!currentUser || currentUser.role !== 'owner' || !isAuthorizedOwnerEmail(currentUser.email)) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4">
        <div className="p-8 bg-slate-900 border border-rose-800/70 rounded-2xl shadow-2xl text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <Shield className="w-8 h-8" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/80 border border-rose-800 text-[11px] font-mono text-rose-300">
            <span>Security Policy: Single Owner Lock</span>
          </div>
          <h2 className="text-xl font-bold text-white font-['Outfit']">
            Owner Dashboard Access Restricted
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            The Gym Owner & Executive Console is strictly locked to the designated owner:
          </p>
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-emerald-400 font-bold text-sm">
            {DESIGNATED_OWNER.email}
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            You are currently signed in as <span className="text-slate-200 font-medium">{currentUser?.email || 'Guest'}</span> ({currentUser?.role || 'user'}). Only <span className="text-emerald-400">{DESIGNATED_OWNER.email}</span> with valid owner credentials can open this dashboard.
          </p>
        </div>
      </div>
    );
  }

  const users = storage.getUsers();
  const members = users.filter((u) => u.role === 'member');
  const trainers = users.filter((u) => u.role === 'trainer');
  const products = storage.getProducts();
  const workoutPlans = storage.getWorkoutPlans();
  const assessments = storage.getAssessments();

  const activeMembers = members.filter((m) => m.joinStatus === 'active');
  const assignedMembers = members.filter((m) => Boolean(m.trainerId));

  // Goal Distribution Data for Chart
  const goalCounts: Record<string, number> = {};
  members.forEach((m) => {
    goalCounts[m.fitnessGoal] = (goalCounts[m.fitnessGoal] || 0) + 1;
  });

  const goalChartData = Object.entries(goalCounts).map(([goal, count]) => ({
    name: goal.replace('_', ' '),
    count,
    color: GOAL_COLORS[goal] || '#10B981',
  }));

  // Aggregate monthly completions
  const completionData = [
    { month: 'Jan', rate: 76, sessions: 184 },
    { month: 'Feb', rate: 82, sessions: 220 },
    { month: 'Mar', rate: 89, sessions: 285 },
    { month: 'Apr (est)', rate: 91, sessions: 310 },
  ];

  // Filtered members list
  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.phone.includes(searchQuery);
    const matchesGoal = goalFilter === 'all' || m.fitnessGoal === goalFilter;
    return matchesSearch && matchesGoal;
  });

  const handleAssignTrainer = () => {
    if (!selectedMemberForTrainer || !selectedTrainerId) return;
    storage.assignTrainerToMember(selectedMemberForTrainer.id, selectedTrainerId);
    setSelectedMemberForTrainer(null);
    setSelectedTrainerId('');
    refreshState();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-slate-900 border border-slate-800 rounded-2xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-white font-['Outfit']">
                {gym.name}
              </h1>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                Gym Code: {gym.code}
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-center gap-1">
                <Flame className="w-3 h-3 text-amber-400" />
                Firebase: {firebaseConfig.projectId}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Owner Management Console · Centralized oversight for coaches, members, schedules & equipment
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenDirectoryTab}
            className="px-4 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors whitespace-nowrap"
          >
            Full Member Directory
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Active Memberships</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-white font-mono tabular-nums">
              {activeMembers.length}
            </span>
            <span className="text-[11px] text-slate-400">/ {members.length} registered</span>
          </div>
          <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>100% renewal this cycle</span>
          </p>
        </div>

        {/* KPI 2 */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Trainers On Staff</span>
            <Award className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-white font-mono tabular-nums">
              {trainers.length}
            </span>
            <span className="text-[11px] text-slate-400">Coaches Active</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {assignedMembers.length} of {members.length} trainees assigned
          </p>
        </div>

        {/* KPI 3 */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Active Workout Plans</span>
            <Dumbbell className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-white font-mono tabular-nums">
              {workoutPlans.length}
            </span>
            <span className="text-[11px] text-slate-400">Personalized</span>
          </div>
          <p className="text-[11px] text-emerald-400 mt-1">
            {assessments.length} logged assessments
          </p>
        </div>

        {/* KPI 4 */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Nutrition & Accessories</span>
            <Package className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-white font-mono tabular-nums">
              {products.length}
            </span>
            <span className="text-[11px] text-slate-400">Inventory Items</span>
          </div>
          <button
            onClick={onOpenCatalogTab}
            className="text-[11px] text-slate-300 hover:text-white mt-1 flex items-center gap-1 group"
          >
            <span>Manage Catalog</span>
            <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* Aggregate Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Fitness Goal Distribution */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Member Goals Distribution</h3>
              <p className="text-xs text-slate-400">Breakdown of member fitness priorities</p>
            </div>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={goalChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis
                  dataKey="name"
                  stroke="#64748B"
                  fontSize={10}
                  tickLine={false}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis stroke="#64748B" fontSize={10} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                />
                <Bar dataKey="count" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Completion Progress Trend */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Workout Completion & Adherence</h3>
              <p className="text-xs text-slate-400">Monthly aggregate sessions completed</p>
            </div>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={completionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="month" stroke="#64748B" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                />
                <Bar dataKey="sessions" fill="#06B6D4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Trainers & Roster Overview */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">Certified Coaching Staff</h3>
            <p className="text-xs text-slate-400">Trainers and their assigned member rosters</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {trainers.map((trainer) => {
            const trainees = members.filter((m) => m.trainerId === trainer.id);
            return (
              <div key={trainer.id} className="p-4 bg-slate-950 border border-slate-800/80 rounded-xl flex items-start gap-4">
                <img
                  src={trainer.profilePhoto || '/src/assets/images/avatar_trainer_marcus_1793118416135.jpg'}
                  alt={trainer.fullName}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-full object-cover border border-slate-700 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-white truncate">{trainer.fullName}</h4>
                    <span className="text-[11px] font-mono text-cyan-400 tabular-nums">
                      {trainees.length} Trainees
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 truncate">{trainer.email}</p>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">{trainer.phone}</p>
                  
                  <div className="mt-3 pt-2 border-t border-slate-800/60">
                    <p className="text-[10px] uppercase font-semibold text-slate-400 mb-1">Assigned Members:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {trainees.length === 0 ? (
                        <span className="text-xs text-slate-400 italic">No trainees assigned yet</span>
                      ) : (
                        trainees.map((t) => (
                          <button
                            key={t.id}
                            onClick={() => onSelectMember(t)}
                            className="text-[11px] px-2 py-0.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded border border-slate-800 transition-colors"
                          >
                            {t.fullName}
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Member Directory Preview & Quick Assignment */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-white">Registered Members Directory</h3>
            <p className="text-xs text-slate-400">Search members, monitor goals, and assign certified trainers</p>
          </div>

          <div className="flex items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search member name or email..."
                className="pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 w-48 sm:w-64"
              />
            </div>

            {/* Goal Filter */}
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
          </div>
        </div>

        {/* Directory Table */}
        <div className="overflow-x-auto border border-slate-800 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
              <tr>
                <th className="px-4 py-3">Member</th>
                <th className="px-4 py-3">Goal & Level</th>
                <th className="px-4 py-3">Assigned Trainer</th>
                <th className="px-4 py-3">Membership</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-900">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                    No members match the search query.
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={member.profilePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                          alt={member.fullName}
                          referrerPolicy="no-referrer"
                          className="w-8 h-8 rounded-full object-cover border border-slate-700 shrink-0"
                        />
                        <div>
                          <p className="font-semibold text-white">{member.fullName}</p>
                          <p className="text-[11px] text-slate-400">{member.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <span className="font-medium text-slate-200 capitalize">
                        {member.fitnessGoal.replace('_', ' ')}
                      </span>
                      <p className="text-[10px] text-slate-400 capitalize">{member.fitnessExperience}</p>
                    </td>

                    <td className="px-4 py-3">
                      {member.trainerName ? (
                        <div className="flex items-center gap-1.5 text-cyan-300 font-medium">
                          <Award className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{member.trainerName}</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedMemberForTrainer(member);
                            setSelectedTrainerId(trainers[0]?.id || '');
                          }}
                          className="px-2 py-0.5 bg-amber-950/60 hover:bg-amber-900 border border-amber-800 text-amber-300 rounded text-[11px] transition-colors"
                        >
                          + Assign Coach
                        </button>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      <span className="font-mono text-slate-300">{member.membershipPlan}</span>
                      <p className="text-[10px] text-slate-400 tabular-nums">Joined {member.joinedDate}</p>
                    </td>

                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedMemberForTrainer(member);
                            setSelectedTrainerId(member.trainerId || trainers[0]?.id || '');
                          }}
                          className="px-2.5 py-1 text-[11px] text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 transition-colors"
                        >
                          Change Coach
                        </button>
                        <button
                          onClick={() => onSelectMember(member)}
                          className="p-1 text-slate-400 hover:text-emerald-400 transition-colors"
                          title="View Profile Details"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Trainer Assignment Modal */}
      {selectedMemberForTrainer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl">
            <h3 className="text-base font-semibold text-white font-['Outfit'] mb-1">
              Assign Fitness Coach
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Select a certified trainer to manage workouts and fitness evaluations for{' '}
              <strong className="text-slate-200">{selectedMemberForTrainer.fullName}</strong>.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Available Trainers
                </label>
                <div className="space-y-2">
                  {trainers.map((t) => (
                    <label
                      key={t.id}
                      className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedTrainerId === t.id
                          ? 'bg-slate-800 border-emerald-500/80 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="trainer"
                          value={t.id}
                          checked={selectedTrainerId === t.id}
                          onChange={() => setSelectedTrainerId(t.id)}
                          className="text-emerald-500 focus:ring-emerald-500/30"
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
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setSelectedMemberForTrainer(null)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white bg-slate-800 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignTrainer}
                className="px-4 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors"
              >
                Save Assignment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
