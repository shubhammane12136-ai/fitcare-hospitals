import React, { useState } from 'react';
import { X, UserPlus, LogIn, Dumbbell, Shield, Award, User, Check, Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { FitnessGoal, FitnessExperience, EquipmentAccess } from '../../types';
import { calculateBMI, getBMICategory } from '../../utils/fitnessCalculators';
import { storage } from '../../db/storage';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register';
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
];

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultMode = 'register',
}) => {
  const { register, login, switchUser, gym, isFirebaseConnected } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('varadsutar1703@gmail.com');
  const [loginPassword, setLoginPassword] = useState('12136');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState<number>(28);
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [profilePhoto, setProfilePhoto] = useState(PRESET_AVATARS[0]);
  const [heightCm, setHeightCm] = useState<number>(175);
  const [weightKg, setWeightKg] = useState<number>(72);
  const [fitnessGoal, setFitnessGoal] = useState<FitnessGoal>('muscle_building');
  const [fitnessExperience, setFitnessExperience] = useState<FitnessExperience>('intermediate');
  const [preferredWorkoutDays, setPreferredWorkoutDays] = useState<string[]>(['Monday', 'Wednesday', 'Friday']);
  const [availableEquipment, setAvailableEquipment] = useState<EquipmentAccess>('full_gym');
  const [gymCode, setGymCode] = useState(gym.code);
  const [isProfilePublic, setIsProfilePublic] = useState(false);
  const [allowLeaderboard, setAllowLeaderboard] = useState(true);

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const currentBMI = calculateBMI(heightCm, weightKg);
  const bmiInfo = getBMICategory(currentBMI);

  const toggleDay = (day: string) => {
    if (preferredWorkoutDays.includes(day)) {
      setPreferredWorkoutDays(preferredWorkoutDays.filter((d) => d !== day));
    } else {
      setPreferredWorkoutDays([...preferredWorkoutDays, day]);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!loginEmail.trim()) {
      setError('Please provide your email address.');
      return;
    }
    setIsLoggingIn(true);
    const result = await login(loginEmail, loginPassword);
    setIsLoggingIn(false);
    if (!result.success) {
      setError(result.error || 'Authentication failed. Please check credentials.');
    } else {
      onClose();
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || !email.trim()) {
      setError('Please provide your full name and valid email address.');
      return;
    }
    if (heightCm <= 50 || heightCm > 250) {
      setError('Please enter a valid height in cm (50 - 250 cm).');
      return;
    }
    if (weightKg <= 20 || weightKg > 300) {
      setError('Please enter a valid weight in kg (20 - 300 kg).');
      return;
    }

    setIsSubmitting(true);
    const result = await register({
      fullName,
      email,
      phone,
      age: Number(age),
      gender,
      profilePhoto,
      heightCm: Number(heightCm),
      weightKg: Number(weightKg),
      fitnessGoal,
      fitnessExperience,
      preferredWorkoutDays,
      availableEquipment,
      gymId: gym.id,
      gymCode: gymCode.trim() || gym.code,
      role: 'member',
      membershipPlan: 'Standard',
      isProfilePublic,
      allowLeaderboard,
    });

    setIsSubmitting(false);
    if (!result.success) {
      setError(result.error || 'Registration failed.');
    } else {
      onClose();
    }
  };

  const allUsers = storage.getUsers();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Dumbbell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white font-['Outfit']">
                {mode === 'register' ? 'Member Registration' : 'Account Access'}
              </h3>
              <p className="text-xs text-slate-400">
                {mode === 'register'
                  ? 'Join FitCare & connect with certified trainers'
                  : 'Select an existing account or sign in'}
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

        {/* Tab switch */}
        <div className="px-6 pt-3 border-b border-slate-800 flex items-center gap-3">
          <button
            onClick={() => setMode('register')}
            className={`pb-2 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap shrink-0 ${
              mode === 'register'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            New Member Registration
          </button>
          <button
            onClick={() => setMode('login')}
            className={`pb-2 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap shrink-0 ${
              mode === 'login'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Switch / Quick Access Demo Accounts
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {error && (
            <div className="mb-4 p-3 bg-rose-950/50 border border-rose-800 rounded-lg text-xs text-rose-300">
              {error}
            </div>
          )}

          {mode === 'login' ? (
            <div className="space-y-5">
              {/* Firebase Connection & Security Notice */}
              <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-semibold text-white">Firebase Project Connected:</span>
                    <span className="font-mono text-emerald-400">fitcare-smartgym</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">v7.20.0+ SDK</span>
                </div>
                <div className="text-[11px] text-amber-300 bg-amber-950/40 p-2.5 rounded-lg border border-amber-800/60 flex items-start gap-2">
                  <Shield className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white">Owner Portal Access Policy:</span> Access to the Gym Owner Portal is exclusively restricted to <strong className="font-mono text-amber-200">varadsutar1703@gmail.com</strong> with password <strong className="font-mono text-amber-200">12136</strong>. Unauthorized accounts cannot access owner administrative features.
                  </div>
                </div>
              </div>

              {/* Email & Password Authentication Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-3.5 p-4 bg-slate-950/70 border border-slate-800 rounded-xl">
                <div className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                  Direct Firebase Credential Login
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Account Email
                    </label>
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="e.g. varadsutar1703@gmail.com"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="pt-1 flex items-center justify-between gap-3">
                  <div className="text-[11px] text-slate-400 font-mono">
                    Owner: varadsutar1703@gmail.com / 12136
                  </div>
                  <button
                    type="submit"
                    disabled={isLoggingIn}
                    className="px-5 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>{isLoggingIn ? 'Verifying with Firebase...' : 'Sign In'}</span>
                  </button>
                </div>
              </form>

              {/* Quick Fill Demo Credentials */}
              <div>
                <p className="text-xs font-semibold text-slate-300 mb-2">
                  Or Quick-Fill Profile Credentials:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setLoginEmail('varadsutar1703@gmail.com');
                      setLoginPassword('12136');
                    }}
                    className="p-2.5 text-left bg-slate-950 hover:bg-slate-800 border border-amber-800/40 rounded-xl text-xs transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-amber-300">Gym Owner</span>
                      <Shield className="w-3 h-3 text-amber-400" />
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono block truncate mt-1">varadsutar1703@gmail.com</span>
                    <span className="text-[10px] text-emerald-400 font-mono block">Pass: 12136</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setLoginEmail('sarah.jenkins@apexperformance.fit');
                      setLoginPassword('123456');
                    }}
                    className="p-2.5 text-left bg-slate-950 hover:bg-slate-800 border border-cyan-800/40 rounded-xl text-xs transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-cyan-300">Gym Trainer</span>
                      <Award className="w-3 h-3 text-cyan-400" />
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono block truncate mt-1">sarah.jenkins@...</span>
                    <span className="text-[10px] text-slate-400 font-mono block">Coach Access</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setLoginEmail('david.miller@example.com');
                      setLoginPassword('123456');
                    }}
                    className="p-2.5 text-left bg-slate-950 hover:bg-slate-800 border border-emerald-800/40 rounded-xl text-xs transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-emerald-300">Gym Member</span>
                      <User className="w-3 h-3 text-emerald-400" />
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono block truncate mt-1">david.miller@example.com</span>
                    <span className="text-[10px] text-slate-400 font-mono block">Member Access</span>
                  </button>
                </div>
              </div>

              {/* Roster Switcher */}
              <div className="pt-2 border-t border-slate-800">
                <p className="text-xs text-slate-400 mb-2">
                  Active directory accounts:
                </p>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {allUsers.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => {
                        switchUser(user.id);
                        onClose();
                      }}
                      className="w-full p-2.5 bg-slate-950 hover:bg-slate-800/80 border border-slate-800/80 rounded-xl flex items-center justify-between text-left transition-colors group"
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={user.profilePhoto || PRESET_AVATARS[0]}
                          alt={user.fullName}
                          referrerPolicy="no-referrer"
                          className="w-8 h-8 rounded-full object-cover border border-slate-700"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-semibold text-white group-hover:text-emerald-400 transition-colors">
                              {user.fullName}
                            </span>
                            <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded border ${
                              user.role === 'owner' ? 'text-amber-400 bg-amber-950/60 border-amber-800/50' :
                              user.role === 'trainer' ? 'text-cyan-400 bg-cyan-950/60 border-cyan-800/50' :
                              'text-emerald-400 bg-emerald-950/60 border-emerald-800/50'
                            }`}>
                              {user.role}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 font-mono">{user.email}</p>
                        </div>
                      </div>
                      <LogIn className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="space-y-5">
              {/* Section 1: Basic Identity */}
              <div>
                <h4 className="text-xs uppercase tracking-wider font-bold text-emerald-400 mb-3">
                  1. Personal & Contact Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Jordan Hayes"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jordan.hayes@example.com"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(555) 019-2834"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Age
                      </label>
                      <input
                        type="number"
                        min="14"
                        max="99"
                        value={age}
                        onChange={(e) => setAge(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Gender
                      </label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value as any)}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Non-binary / Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Avatar Selection */}
                <div className="mt-3">
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Select Profile Photo
                  </label>
                  <div className="flex items-center gap-3">
                    {PRESET_AVATARS.map((url, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setProfilePhoto(url)}
                        className={`w-10 h-10 rounded-full overflow-hidden border-2 transition-all ${
                          profilePhoto === url
                            ? 'border-emerald-400 scale-110 shadow-lg'
                            : 'border-slate-800 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={url} alt={`Preset ${i}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Section 2: Physical Measurements & Baseline */}
              <div className="border-t border-slate-800 pt-4">
                <h4 className="text-xs uppercase tracking-wider font-bold text-emerald-400 mb-3">
                  2. Physical Baseline & Measurements
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Height (cm) *
                    </label>
                    <input
                      type="number"
                      value={heightCm}
                      onChange={(e) => setHeightCm(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Current Weight (kg) *
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={weightKg}
                      onChange={(e) => setWeightKg(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                </div>

                {/* Real-time respectful BMI Reference Indicator */}
                <div className="mt-3 p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-start gap-3">
                  <Heart className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-200">
                        Baseline Reference BMI: <span className="font-mono text-emerald-400">{currentBMI}</span>
                      </span>
                      <span className="text-xs text-slate-400 font-medium">({bmiInfo.label})</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                      {bmiInfo.advice}
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 3: Goals, Experience & Equipment */}
              <div className="border-t border-slate-800 pt-4">
                <h4 className="text-xs uppercase tracking-wider font-bold text-emerald-400 mb-3">
                  3. Fitness Goals & Available Setup
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Primary Fitness Goal *
                    </label>
                    <select
                      value={fitnessGoal}
                      onChange={(e) => setFitnessGoal(e.target.value as FitnessGoal)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="muscle_building">Muscle Building / Hypertrophy</option>
                      <option value="weight_loss">Weight Loss / Body Composition</option>
                      <option value="weight_gain">Weight Gain / Caloric Surplus</option>
                      <option value="general_fitness">General Fitness & Mobility</option>
                      <option value="endurance">Cardiovascular Endurance</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Fitness Experience Level *
                    </label>
                    <select
                      value={fitnessExperience}
                      onChange={(e) => setFitnessExperience(e.target.value as FitnessExperience)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="beginner">Beginner (0 - 6 months)</option>
                      <option value="intermediate">Intermediate (6 months - 2 years)</option>
                      <option value="advanced">Advanced (2+ years dedicated)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Available Equipment
                    </label>
                    <select
                      value={availableEquipment}
                      onChange={(e) => setAvailableEquipment(e.target.value as EquipmentAccess)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="full_gym">Full Commercial Gym (Barbells, Racks, Cables)</option>
                      <option value="dumbbells_only">Dumbbells & Adjustable Bench</option>
                      <option value="bands_and_mats">Resistance Bands & Yoga Mat</option>
                      <option value="bodyweight">Bodyweight / Calisthenics Only</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Gym Joining Code *
                    </label>
                    <input
                      type="text"
                      value={gymCode}
                      onChange={(e) => setGymCode(e.target.value)}
                      placeholder="e.g. APEX-2026"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white font-mono uppercase focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Workout Days */}
                <div className="mt-3">
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Preferred Workout Schedule
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {DAYS_OF_WEEK.map((day) => {
                      const selected = preferredWorkoutDays.includes(day);
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => toggleDay(day)}
                          className={`px-2.5 py-1 text-xs rounded-md border transition-colors whitespace-nowrap shrink-0 ${
                            selected
                              ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-medium'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          {day.slice(0, 3)}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Privacy Preferences */}
                <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                    <input
                      type="checkbox"
                      checked={allowLeaderboard}
                      onChange={(e) => setAllowLeaderboard(e.target.checked)}
                      className="rounded border-slate-800 text-emerald-500 focus:ring-emerald-500/30"
                    />
                    <span>Opt-in to voluntary gym workout consistency leaderboard</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                    <input
                      type="checkbox"
                      checked={isProfilePublic}
                      onChange={(e) => setIsProfilePublic(e.target.checked)}
                      className="rounded border-slate-800 text-emerald-500 focus:ring-emerald-500/30"
                    />
                    <span>Display profile in Community members directory (Health metrics remain strictly confidential)</span>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>{isSubmitting ? 'Registering...' : 'Complete Registration'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
