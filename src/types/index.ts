export type UserRole = 'owner' | 'trainer' | 'member';

export type FitnessGoal =
  | 'weight_loss'
  | 'weight_gain'
  | 'muscle_building'
  | 'general_fitness'
  | 'endurance';

export type FitnessExperience = 'beginner' | 'intermediate' | 'advanced';

export type EquipmentAccess =
  | 'full_gym'
  | 'dumbbells_only'
  | 'bodyweight'
  | 'bands_and_mats';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  password?: string;
  phone: string;
  age: number;
  gender?: 'male' | 'female' | 'other';
  profilePhoto?: string;
  heightCm: number;
  weightKg: number;
  fitnessGoal: FitnessGoal;
  fitnessExperience: FitnessExperience;
  preferredWorkoutDays: string[];
  availableEquipment: EquipmentAccess;
  gymId: string;
  gymCode?: string;
  trainerId?: string;
  trainerName?: string;
  joinStatus: 'active' | 'pending' | 'inactive';
  joinedDate: string;
  membershipPlan: 'Standard' | 'Pro Athlete' | 'Premium VIP' | 'Staff';
  isProfilePublic: boolean;
  allowLeaderboard: boolean;
}

export interface Gym {
  id: string;
  name: string;
  code: string;
  ownerId: string;
  address: string;
  phone: string;
  email: string;
  announcement: string;
}

export interface FitnessAssessment {
  id: string;
  memberId: string;
  memberName: string;
  trainerId: string;
  trainerName: string;
  date: string;
  weightKg: number;
  bodyFatPercentage?: number;
  chestCm?: number;
  waistCm?: number;
  hipsCm?: number;
  armCm?: number;
  thighCm?: number;
  restingHeartRateBpm?: number;
  systolicBP?: number;
  diastolicBP?: number;
  pushupsCount?: number;
  plankSeconds?: number;
  goalDiscussionNotes: string;
  trainerRecommendations: string;
  nextAssessmentDate?: string;
}

export interface Exercise {
  id: string;
  name: string;
  category: 'Chest' | 'Back' | 'Legs' | 'Shoulders' | 'Arms' | 'Core' | 'Cardio';
  sets: number;
  reps: string;
  restSec: number;
  tempo?: string;
  notes?: string;
}

export interface WorkoutDay {
  dayNumber: number;
  dayName: string;
  title: string;
  focus: string;
  isRestDay: boolean;
  warmUp: string;
  coolDown: string;
  exercises: Exercise[];
  trainerTips: string;
}

export interface WorkoutPlan {
  id: string;
  memberId: string;
  memberName: string;
  trainerId: string;
  trainerName: string;
  goal: FitnessGoal;
  experienceLevel: FitnessExperience;
  title: string;
  description: string;
  durationWeeks: number;
  schedule: WorkoutDay[];
  safetyWarnings: string[];
  medicalDisclaimer: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkoutLog {
  id: string;
  memberId: string;
  workoutPlanId?: string;
  dayNumber: number;
  date: string;
  completedExercises: string[];
  durationMinutes: number;
  perceivedExertion: number; // 1-10
  notes: string;
  completed: boolean;
}

export type ProductCategory =
  | 'protein_food'
  | 'protein_powder'
  | 'mass_gainer'
  | 'sports_nutrition'
  | 'fitness_accessory'
  | 'gym_equipment';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  image: string;
  description: string;
  price: number;
  inStock: boolean;
  stockQuantity: number;
  ingredients?: string;
  intendedUse: string;
  manufacturer: string;
  precautions?: string;
  isSupplement: boolean;
}

export interface ProductRecommendation {
  id: string;
  memberId: string;
  memberName: string;
  trainerId: string;
  trainerName: string;
  productId: string;
  productName: string;
  productCategory: ProductCategory;
  productImage: string;
  recommendedDate: string;
  reason: string;
  precautions: string;
  dosageOrUsage: string;
  acknowledgedByMember: boolean;
}

export interface CommunityPost {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  authorAvatar: string;
  title: string;
  content: string;
  category: 'announcement' | 'achievement' | 'challenge' | 'discussion';
  likes: number;
  likedByCurrentUser?: boolean;
  createdAt: string;
  pinned?: boolean;
}

export interface CommunityChallenge {
  id: string;
  title: string;
  description: string;
  category: 'consistency' | 'strength' | 'cardio';
  targetMetric: string;
  startDate: string;
  endDate: string;
  participantsCount: number;
  joined: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  memberId: string;
  memberName: string;
  avatar: string;
  workoutsCompletedThisMonth: number;
  streakDays: number;
  badge: string;
  isPublic: boolean;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  date: string;
  type: 'assessment' | 'plan' | 'recommendation' | 'community' | 'approval' | 'system';
}
