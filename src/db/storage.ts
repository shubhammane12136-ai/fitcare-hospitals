import {
  UserProfile,
  Gym,
  FitnessAssessment,
  WorkoutPlan,
  WorkoutLog,
  Product,
  ProductRecommendation,
  CommunityPost,
  CommunityChallenge,
  LeaderboardEntry,
  AppNotification,
  UserRole,
  FitnessGoal,
} from '../types';

const STORAGE_KEY_PREFIX = 'fitcare_db_v1_';

// Initial Gym Seed
const INITIAL_GYM: Gym = {
  id: 'gym-apex-01',
  name: 'Apex Athletic Performance Center',
  code: 'APEX-2026',
  ownerId: 'user-owner-01',
  address: '450 Performance Way, Suite 100, Metro City',
  phone: '(555) 234-8900',
  email: 'contact@apexperformance.fit',
  announcement: 'Summer Strength & Endurance Invitational begins next week! Sign up in Community Challenges.',
};

// Initial Users Seed
const INITIAL_USERS: UserProfile[] = [
  {
    id: 'user-owner-01',
    email: 'varadsutar1703@gmail.com',
    fullName: 'Varad Sutar',
    role: 'owner',
    password: '12136',
    phone: '(555) 234-8901',
    age: 32,
    gender: 'male',
    profilePhoto: '/src/assets/images/avatar_gym_owner_1793118415848.jpg',
    heightCm: 178,
    weightKg: 76,
    fitnessGoal: 'muscle_building',
    fitnessExperience: 'advanced',
    preferredWorkoutDays: ['Monday', 'Wednesday', 'Friday'],
    availableEquipment: 'full_gym',
    gymId: 'gym-apex-01',
    gymCode: 'APEX-2026',
    joinStatus: 'active',
    joinedDate: '2023-01-15',
    membershipPlan: 'Staff',
    isProfilePublic: true,
    allowLeaderboard: true,
  },
  {
    id: 'user-trainer-01',
    email: 'sarah.jenkins@apexperformance.fit',
    fullName: 'Sarah Jenkins',
    role: 'trainer',
    phone: '(555) 234-8902',
    age: 31,
    gender: 'female',
    profilePhoto: '/src/assets/images/avatar_trainer_sarah_1793118416038.jpg',
    heightCm: 168,
    weightKg: 61,
    fitnessGoal: 'endurance',
    fitnessExperience: 'advanced',
    preferredWorkoutDays: ['Tuesday', 'Thursday', 'Saturday'],
    availableEquipment: 'full_gym',
    gymId: 'gym-apex-01',
    gymCode: 'APEX-2026',
    joinStatus: 'active',
    joinedDate: '2023-03-10',
    membershipPlan: 'Staff',
    isProfilePublic: true,
    allowLeaderboard: true,
  },
  {
    id: 'user-trainer-02',
    email: 'marcus.cole@apexperformance.fit',
    fullName: 'Marcus Cole',
    role: 'trainer',
    phone: '(555) 234-8903',
    age: 35,
    gender: 'male',
    profilePhoto: '/src/assets/images/avatar_trainer_marcus_1793118416135.jpg',
    heightCm: 184,
    weightKg: 88,
    fitnessGoal: 'muscle_building',
    fitnessExperience: 'advanced',
    preferredWorkoutDays: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
    availableEquipment: 'full_gym',
    gymId: 'gym-apex-01',
    gymCode: 'APEX-2026',
    joinStatus: 'active',
    joinedDate: '2023-02-01',
    membershipPlan: 'Staff',
    isProfilePublic: true,
    allowLeaderboard: true,
  },
  {
    id: 'user-member-01',
    email: 'david.miller@example.com',
    fullName: 'David Miller',
    role: 'member',
    phone: '(555) 891-4421',
    age: 29,
    gender: 'male',
    profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    heightCm: 180,
    weightKg: 78,
    fitnessGoal: 'muscle_building',
    fitnessExperience: 'intermediate',
    preferredWorkoutDays: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
    availableEquipment: 'full_gym',
    gymId: 'gym-apex-01',
    gymCode: 'APEX-2026',
    trainerId: 'user-trainer-02',
    trainerName: 'Marcus Cole',
    joinStatus: 'active',
    joinedDate: '2024-01-10',
    membershipPlan: 'Pro Athlete',
    isProfilePublic: true,
    allowLeaderboard: true,
  },
  {
    id: 'user-member-02',
    email: 'maya.lin@example.com',
    fullName: 'Maya Lin',
    role: 'member',
    phone: '(555) 712-3390',
    age: 26,
    gender: 'female',
    profilePhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    heightCm: 165,
    weightKg: 69,
    fitnessGoal: 'weight_loss',
    fitnessExperience: 'beginner',
    preferredWorkoutDays: ['Tuesday', 'Thursday', 'Saturday'],
    availableEquipment: 'full_gym',
    gymId: 'gym-apex-01',
    gymCode: 'APEX-2026',
    trainerId: 'user-trainer-01',
    trainerName: 'Sarah Jenkins',
    joinStatus: 'active',
    joinedDate: '2024-02-18',
    membershipPlan: 'Standard',
    isProfilePublic: true,
    allowLeaderboard: true,
  },
  {
    id: 'user-member-03',
    email: 'alex.rivera@example.com',
    fullName: 'Alex Rivera',
    role: 'member',
    phone: '(555) 902-8812',
    age: 34,
    gender: 'other',
    profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    heightCm: 175,
    weightKg: 72,
    fitnessGoal: 'general_fitness',
    fitnessExperience: 'intermediate',
    preferredWorkoutDays: ['Monday', 'Thursday'],
    availableEquipment: 'dumbbells_only',
    gymId: 'gym-apex-01',
    gymCode: 'APEX-2026',
    joinStatus: 'active',
    joinedDate: '2024-03-01',
    membershipPlan: 'Standard',
    isProfilePublic: false,
    allowLeaderboard: false,
  },
  {
    id: 'user-member-04',
    email: 'priya.patel@example.com',
    fullName: 'Priya Patel',
    role: 'member',
    phone: '(555) 431-7722',
    age: 32,
    gender: 'female',
    profilePhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    heightCm: 160,
    weightKg: 58,
    fitnessGoal: 'endurance',
    fitnessExperience: 'advanced',
    preferredWorkoutDays: ['Monday', 'Tuesday', 'Wednesday', 'Friday', 'Sunday'],
    availableEquipment: 'full_gym',
    gymId: 'gym-apex-01',
    gymCode: 'APEX-2026',
    trainerId: 'user-trainer-01',
    trainerName: 'Sarah Jenkins',
    joinStatus: 'active',
    joinedDate: '2023-11-05',
    membershipPlan: 'Premium VIP',
    isProfilePublic: true,
    allowLeaderboard: true,
  },
];

// Initial Products Seed
const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-01',
    name: 'Nexus Pure Whey Isolate (Vanilla / Chocolate)',
    category: 'protein_powder',
    image: '/src/assets/images/product_whey_isolate_1793118416422.jpg',
    description: 'Ultra-filtered cold-pressed whey isolate delivering 27g protein per scoop with zero added sugars. Fast-absorbing amino acid profile ideal for post-resistance recovery.',
    price: 54.99,
    inStock: true,
    stockQuantity: 42,
    ingredients: 'Cross-Flow Microfiltered Whey Protein Isolate, Natural Flavors, Sunflower Lecithin, Stevia Leaf Extract.',
    intendedUse: 'Supports muscle protein synthesis following resistance training or as a high-protein nutritional supplement.',
    manufacturer: 'Apex Nutrition Labs, ISO 9001 Certified',
    precautions: 'Contains milk derivatives. Not intended for use by persons under 18 or as a sole source of nutrition. Consult a physician before starting any supplementation.',
    isSupplement: true,
  },
  {
    id: 'prod-02',
    name: 'Creapure Micronized Creatine Monohydrate',
    category: 'sports_nutrition',
    image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&w=400&q=80',
    description: '100% pure German Creapure pharmaceutical grade creatine. Enhances cellular ATP resynthesis during short-burst, high-intensity muscular contractions.',
    price: 32.50,
    inStock: true,
    stockQuantity: 28,
    ingredients: '100% Micronized Creatine Monohydrate (5000mg per serving).',
    intendedUse: 'Assists high-intensity strength, sprint performance, and muscular power output.',
    manufacturer: 'Creapure AlzChem Trostberg GmbH',
    precautions: 'Maintain adequate hydration (at least 2.5-3L water daily). Individuals with pre-existing renal conditions should consult their physician before use.',
    isSupplement: true,
  },
  {
    id: 'prod-03',
    name: 'Organic Plant Power Blend (Pea, Hemp, Brown Rice)',
    category: 'protein_food',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80',
    description: 'Hypoallergenic complete plant protein blend with digestive enzymes and organic cacao. 24g bioavailable protein with zero dairy or soy.',
    price: 46.00,
    inStock: true,
    stockQuantity: 19,
    ingredients: 'Organic Yellow Pea Protein, Organic Brown Rice Protein, Organic Hemp Heart Protein, DigeZyme Enzyme Complex.',
    intendedUse: 'Wholesome dietary plant protein enrichment for daily muscle maintenance and balanced vegan nutrition.',
    manufacturer: 'TerraFlora Organics',
    precautions: 'Food supplement; should not replace a diverse, balanced diet. Store in a cool dry environment.',
    isSupplement: false,
  },
  {
    id: 'prod-04',
    name: 'Pro-Hex Heavy Resistance Loop Bands (5-Pack)',
    category: 'fitness_accessory',
    image: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?auto=format&fit=crop&w=400&q=80',
    description: 'Commercial 100% natural layered Malaysian latex bands ranging from 10 lbs to 65 lbs tension. Comes with mesh travel carry pouch and exercise manual.',
    price: 24.99,
    inStock: true,
    stockQuantity: 65,
    intendedUse: 'Mobility warm-up, glute activation, assisted pull-ups, and progressive rehabilitation exercises.',
    manufacturer: 'Apex Athletic Equipment Co.',
    precautions: 'Check bands before each use for micro-tears or surface fraying. Keep away from sharp corners or abrasive surfaces.',
    isSupplement: false,
  },
  {
    id: 'prod-05',
    name: 'HydroShield Insulated Stainless Steel Shaker (24oz)',
    category: 'gym_equipment',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=400&q=80',
    description: 'Double-walled vacuum insulated kitchen-grade 18/8 stainless steel bottle. Keeps shakes ice-cold for 24 hours with odorless, silent whisk mechanism.',
    price: 28.00,
    inStock: true,
    stockQuantity: 50,
    intendedUse: 'Cold fluid hydration and smooth lump-free protein and electrolyte blending.',
    manufacturer: 'Apex Athletic Equipment Co.',
    precautions: 'Do not use with boiling hot liquids under pressure. Dishwasher safe lid; hand wash bottle body recommended.',
    isSupplement: false,
  },
  {
    id: 'prod-06',
    name: 'ElectroPeak Balanced Hydration Electrolytes (Lemon Lime)',
    category: 'sports_nutrition',
    image: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=400&q=80',
    description: 'Clean electrolyte formula with sodium, potassium, and magnesium chelate. Zero artificial colors or artificial sweeteners.',
    price: 26.50,
    inStock: true,
    stockQuantity: 34,
    ingredients: 'Sodium Citrate, Potassium Chloride, Magnesium Malate, Citric Acid, Natural Lemon Lime Extract.',
    intendedUse: 'Prevents cramping and maintains fluid balance during prolonged athletic training or endurance sessions.',
    manufacturer: 'PeakPerform Labs',
    precautions: 'Not for individuals on medically restricted sodium diets without clinical approval.',
    isSupplement: true,
  },
];

// Initial Workout Plans Seed
const INITIAL_WORKOUT_PLANS: WorkoutPlan[] = [
  {
    id: 'plan-david-01',
    memberId: 'user-member-01',
    memberName: 'David Miller',
    trainerId: 'user-trainer-02',
    trainerName: 'Marcus Cole',
    goal: 'muscle_building',
    experienceLevel: 'intermediate',
    title: 'Hypertrophy & Progressive Overload Phase I',
    description: '4-day upper/lower undulating split focused on mechanical tension and compound strength foundations.',
    durationWeeks: 8,
    schedule: [
      {
        dayNumber: 1,
        dayName: 'Day 1 - Upper Power & Chest/Back Focus',
        title: 'Upper Strength & Mechanical Load',
        focus: 'Chest, Upper Back, Shoulders',
        isRestDay: false,
        warmUp: '5 min treadmill jog + Band face-pulls 2x15, Cat-cow and shoulder dislocates.',
        coolDown: 'Crossover arm stretch, doorway chest stretch, 5 min nasal breathing.',
        trainerTips: 'Prioritize a 2-second controlled lowering (eccentric) phase on compound lifts. Keep 1-2 reps in reserve (RIR 1-2).',
        exercises: [
          { id: 'ex-1', name: 'Barbell Flat Bench Press', category: 'Chest', sets: 4, reps: '6-8', restSec: 120, tempo: '3-0-1-0', notes: 'Maintain tight upper back retracting into bench.' },
          { id: 'ex-2', name: 'Chest-Supported T-Bar Row', category: 'Back', sets: 4, reps: '8-10', restSec: 90, tempo: '2-0-1-1', notes: 'Squeeze shoulder blades together at apex.' },
          { id: 'ex-3', name: 'Seated Dumbbell Shoulder Press', category: 'Shoulders', sets: 3, reps: '10-12', restSec: 90, notes: 'Elbows slightly tucked at 45 degrees.' },
          { id: 'ex-4', name: 'Incline Dumbbell Flyes to Press', category: 'Chest', sets: 3, reps: '12', restSec: 60, notes: 'Focus on full deep stretch across chest fibers.' },
          { id: 'ex-5', name: 'Overhead Cable Triceps Extensions', category: 'Arms', sets: 3, reps: '12-15', restSec: 60, notes: 'Keep elbows stationary near ears.' },
        ],
      },
      {
        dayNumber: 2,
        dayName: 'Day 2 - Lower Strength & Posterior Chain',
        title: 'Lower Body Strength & Knee Flexion',
        focus: 'Quadriceps, Hamstrings, Calves',
        isRestDay: false,
        warmUp: '5 min spin bike + Bodyweight Cossack squats, 90/90 hip mobility, glute bridges.',
        coolDown: 'Hamstring towel stretch, couch quad stretch, foam roll IT bands.',
        trainerTips: 'Ensure knee alignment over second toe during squats. Brace core before initiating descent.',
        exercises: [
          { id: 'ex-6', name: 'Barbell Back Squats', category: 'Legs', sets: 4, reps: '6-8', restSec: 150, tempo: '3-1-1-0', notes: 'Depth parallel or slightly below. Breathe and brace diaphragmatically.' },
          { id: 'ex-7', name: 'Romanian Deadlifts (Dumbbell/Barbell)', category: 'Legs', sets: 3, reps: '8-10', restSec: 90, notes: 'Hinge hips backward until hamstring tension peaks.' },
          { id: 'ex-8', name: 'Bulgarian Split Squats', category: 'Legs', sets: 3, reps: '10 per leg', restSec: 75, notes: 'Focus load on front heel and glute.' },
          { id: 'ex-9', name: 'Standing Machine Calf Raises', category: 'Legs', sets: 4, reps: '15', restSec: 45, notes: '2-second pause at bottom stretch.' },
        ],
      },
      {
        dayNumber: 3,
        dayName: 'Day 3 - Active Rest & Recovery',
        title: 'Rest & Tissue Restoration',
        focus: 'Recovery, Walking, Mobility',
        isRestDay: true,
        warmUp: 'Light 20-30 min walk outdoors in natural daylight.',
        coolDown: '15 minutes full body gentle flow and hydration.',
        trainerTips: 'Hit your hydration goal (3L) and consume balanced protein with complex carbohydrates.',
        exercises: [],
      },
      {
        dayNumber: 4,
        dayName: 'Day 4 - Upper Hypertrophy & Pull Focus',
        title: 'Upper Volume & Arm Conditioning',
        focus: 'Lats, Delts, Biceps, Core',
        isRestDay: false,
        warmUp: 'Scapular pull-ups, arm circles, light lat pull-down.',
        coolDown: 'Childs pose lat stretch, wrist extensions.',
        trainerTips: 'Focus on muscular pump and smooth mind-muscle connection.',
        exercises: [
          { id: 'ex-10', name: 'Wide-Grip Lat Pull-downs', category: 'Back', sets: 4, reps: '10-12', restSec: 75, notes: 'Pull down to clavicle, avoiding excessive backward lean.' },
          { id: 'ex-11', name: 'Incline Neutral Dumbbell Bench', category: 'Chest', sets: 3, reps: '10-12', restSec: 75, notes: 'Upper chest emphasis with neutral palms.' },
          { id: 'ex-12', name: 'Cable Lateral Raises', category: 'Shoulders', sets: 4, reps: '15', restSec: 45, notes: 'Lead with elbows to isolate lateral head.' },
          { id: 'ex-13', name: 'Incline Dumbbell Bicep Curls', category: 'Arms', sets: 3, reps: '12', restSec: 60, notes: 'Full elbow extension at bottom.' },
          { id: 'ex-14', name: 'Hanging Leg Raises', category: 'Core', sets: 3, reps: '12-15', restSec: 60, notes: 'Avoid swinging; initiate with lower abdominal curl.' },
        ],
      },
      {
        dayNumber: 5,
        dayName: 'Day 5 - Lower Posterior Chain & Hamstrings',
        title: 'Deadlift & Single-Leg Stability',
        focus: 'Hamstrings, Glutes, Core',
        isRestDay: false,
        warmUp: 'Hip openers, bird-dogs, kettlebell deadlift pattern.',
        coolDown: 'Pigeon stretch, piriformis seated stretch.',
        trainerTips: 'Quality of movement over maximal load. Stop set if spine neutral posture breaks.',
        exercises: [
          { id: 'ex-15', name: 'Conventional Trap Bar Deadlift', category: 'Back', sets: 4, reps: '5', restSec: 150, notes: 'Engage lats, drive ground away with leg press intention.' },
          { id: 'ex-16', name: 'Lying Hamstring Leg Curls', category: 'Legs', sets: 3, reps: '12', restSec: 60, notes: 'Keep hips pinned down against the pad.' },
          { id: 'ex-17', name: 'Walking Dumbbell Lunges', category: 'Legs', sets: 3, reps: '12 per leg', restSec: 75, notes: 'Upright torso; gentle knee tap.' },
        ],
      },
      {
        dayNumber: 6,
        dayName: 'Day 6 - Active Recovery & Mobility',
        title: 'Rest & Myofascial Release',
        focus: 'Joint Mobility',
        isRestDay: true,
        warmUp: 'Gentle swimming or walking.',
        coolDown: 'Deep diaphragmatic breathing session.',
        trainerTips: 'Enjoy downtime with friends or family. Muscle grows during recovery, not in the gym!',
        exercises: [],
      },
      {
        dayNumber: 7,
        dayName: 'Day 7 - Complete Rest',
        title: 'Total Rest & Weekly Review',
        focus: 'Mental & Physical Reset',
        isRestDay: true,
        warmUp: 'Relaxation and hydration.',
        coolDown: 'Prepare gear and meals for the upcoming week.',
        trainerTips: 'Log your weekly check-in notes for your trainer.',
        exercises: [],
      },
    ],
    safetyWarnings: [
      'Warm up thoroughly before loading weights.',
      'Always use safety collars and spotters on heavy barbell pressing.',
      'Stop immediately and notify staff if you experience sharp joint or tendon pain.',
    ],
    medicalDisclaimer: 'This exercise program is designed for general athletic conditioning. If you have any underlying cardiovascular, metabolic, or musculoskeletal condition, obtain clearance from your personal physician before beginning.',
    createdAt: '2024-02-01',
    updatedAt: '2024-03-15',
  },
  {
    id: 'plan-maya-01',
    memberId: 'user-member-02',
    memberName: 'Maya Lin',
    trainerId: 'user-trainer-01',
    trainerName: 'Sarah Jenkins',
    goal: 'weight_loss',
    experienceLevel: 'beginner',
    title: 'Fat Loss & Functional Metabolic Conditioning',
    description: '3-day full body circuit combining progressive resistance training with steady cardiovascular foundation.',
    durationWeeks: 6,
    schedule: [
      {
        dayNumber: 1,
        dayName: 'Day 1 - Full Body Foundation A',
        title: 'Total Body Resistance & Core Activation',
        focus: 'Legs, Push, Pull, Core',
        isRestDay: false,
        warmUp: '5 min brisk incline walk + Arm swings, high knees, bodyweight squats.',
        coolDown: 'Standing quad stretch, calf stretch, hamstring fold.',
        trainerTips: 'Pace your breathing: exhale on exertion (when lifting), inhale as you lower the weight smoothly.',
        exercises: [
          { id: 'ex-20', name: 'Goblet Squats (Kettlebell / Dumbbell)', category: 'Legs', sets: 3, reps: '12', restSec: 60, notes: 'Hold kettlebell at chest height; keep chest proud.' },
          { id: 'ex-21', name: 'Seated Cable Row (Neutral Grip)', category: 'Back', sets: 3, reps: '12', restSec: 60, notes: 'Pull toward belly button, avoiding shrugging shoulders.' },
          { id: 'ex-22', name: 'Dumbbell Incline Bench Press', category: 'Chest', sets: 3, reps: '12', restSec: 60, notes: 'Comfortable weight where reps 10-12 feel challenging.' },
          { id: 'ex-23', name: 'Standing Overhead Dumbbell Press', category: 'Shoulders', sets: 3, reps: '10', restSec: 60, notes: 'Engage core glutes so lower back does not arch.' },
          { id: 'ex-24', name: 'Plank Hold (Forearms)', category: 'Core', sets: 3, reps: '30-45 sec', restSec: 45, notes: 'Straight line from shoulders to ankles.' },
        ],
      },
      {
        dayNumber: 2,
        dayName: 'Day 2 - Aerobic Base Conditioning',
        title: 'Low-Impact Zone 2 Cardio & Mobility',
        focus: 'Heart Health & Caloric Burn',
        isRestDay: false,
        warmUp: '3 min light cycling.',
        coolDown: 'Foam rolling calves, quads, and thoracic spine.',
        trainerTips: 'Stay at conversational pace (you should be able to speak in short sentences without gasping).',
        exercises: [
          { id: 'ex-25', name: 'Zone 2 Incline Treadmill or Elliptical', category: 'Cardio', sets: 1, reps: '35 min', restSec: 0, notes: 'Heart rate target: 125-140 bpm. Steady rhythm.' },
          { id: 'ex-26', name: 'Bird Dog & Deadbug Core Sequence', category: 'Core', sets: 3, reps: '10 per side', restSec: 45, notes: 'Slow and controlled motor control.' },
        ],
      },
      {
        dayNumber: 3,
        dayName: 'Day 3 - Active Recovery',
        title: 'Rest & Daily Steps Target',
        focus: 'Active Recovery',
        isRestDay: true,
        warmUp: 'Gentle morning stretching.',
        coolDown: 'Evening relaxation.',
        trainerTips: 'Aim for 8,000 to 10,000 gentle daily steps and restful sleep.',
        exercises: [],
      },
      {
        dayNumber: 4,
        dayName: 'Day 4 - Full Body Foundation B',
        title: 'Posterior Strength & Postural Balance',
        focus: 'Hamstrings, Back, Arms',
        isRestDay: false,
        warmUp: '5 min rowing machine + Hip circles and band pull-aparts.',
        coolDown: 'Seated spinal twist, childs pose.',
        trainerTips: 'Notice strength progression from week to week! Write down weights used.',
        exercises: [
          { id: 'ex-27', name: 'Dumbbell Romanian Deadlift', category: 'Legs', sets: 3, reps: '12', restSec: 60, notes: 'Hips push straight back; neutral neck.' },
          { id: 'ex-28', name: 'Lat Pull-down (Medium Grip)', category: 'Back', sets: 3, reps: '12', restSec: 60, notes: 'Initiate pull by dropping scapulae down.' },
          { id: 'ex-29', name: 'Push-ups (Incline or Knee Modified)', category: 'Chest', sets: 3, reps: '8-10', restSec: 60, notes: 'Hands on bench for controlled depth.' },
          { id: 'ex-30', name: 'Farmer Walks (Moderate Dumbbells)', category: 'Core', sets: 3, reps: '40 meters', restSec: 60, notes: 'Tall posture, steady deliberate steps.' },
        ],
      },
      {
        dayNumber: 5,
        dayName: 'Day 5 - Moderate Conditioning & Stretch',
        title: 'Interval Cardio & Mobility',
        focus: 'Stamina & Flexibility',
        isRestDay: false,
        warmUp: '5 min dynamic leg swings.',
        coolDown: 'Total body stretch routine.',
        trainerTips: 'Keep a water bottle handy and stay hydrated throughout.',
        exercises: [
          { id: 'ex-31', name: 'Rowing Machine Intervals (1 min work, 1 min rest)', category: 'Cardio', sets: 6, reps: '1 min', restSec: 60, notes: 'Smooth leg drive, tall torso finish.' },
        ],
      },
      {
        dayNumber: 6,
        dayName: 'Day 6 - Weekend Recreation',
        title: 'Rest or Recreational Activity',
        focus: 'Recreation',
        isRestDay: true,
        warmUp: 'Outdoor walk or leisure bike ride.',
        coolDown: 'Gentle hydration.',
        trainerTips: 'Enjoy your weekend fitness activities!',
        exercises: [],
      },
      {
        dayNumber: 7,
        dayName: 'Day 7 - Rest & Nutrition Planning',
        title: 'Rest Day & Weekly Prep',
        focus: 'Rest',
        isRestDay: true,
        warmUp: 'Rest.',
        coolDown: 'Rest.',
        trainerTips: 'Review meal plan and set goals for the coming week.',
        exercises: [],
      },
    ],
    safetyWarnings: [
      'Stop if feeling dizzy or faint; drink water immediately.',
      'Perform exercises with controlled tempo before increasing resistance.',
    ],
    medicalDisclaimer: 'Always consult your physician before beginning any weight management or exercise program.',
    createdAt: '2024-02-20',
    updatedAt: '2024-03-10',
  },
];

// Initial Fitness Assessments Seed
const INITIAL_ASSESSMENTS: FitnessAssessment[] = [
  {
    id: 'asmt-01',
    memberId: 'user-member-01',
    memberName: 'David Miller',
    trainerId: 'user-trainer-02',
    trainerName: 'Marcus Cole',
    date: '2024-01-15',
    weightKg: 78.0,
    bodyFatPercentage: 17.5,
    chestCm: 101.5,
    waistCm: 84.0,
    hipsCm: 99.0,
    armCm: 35.5,
    thighCm: 57.0,
    restingHeartRateBpm: 66,
    systolicBP: 118,
    diastolicBP: 76,
    pushupsCount: 28,
    plankSeconds: 75,
    goalDiscussionNotes: 'David wants to add 4-5 kg of lean muscle mass while improving bench press and squat technique. Reports high motivation and 4 days available.',
    trainerRecommendations: 'Structured 4-day undulating hypertrophy split. Emphasize progressive overload with 10-15% surplus calories and 160g protein daily.',
    nextAssessmentDate: '2024-04-15',
  },
  {
    id: 'asmt-02',
    memberId: 'user-member-01',
    memberName: 'David Miller',
    trainerId: 'user-trainer-02',
    trainerName: 'Marcus Cole',
    date: '2024-03-20',
    weightKg: 80.2,
    bodyFatPercentage: 16.8,
    chestCm: 104.0,
    waistCm: 84.5,
    hipsCm: 99.5,
    armCm: 37.0,
    thighCm: 58.5,
    restingHeartRateBpm: 63,
    systolicBP: 116,
    diastolicBP: 74,
    pushupsCount: 36,
    plankSeconds: 95,
    goalDiscussionNotes: 'Outstanding progress over 9 weeks! Chest and arm circumferences increased by over 1.5 cm with minimal waist change. Strength markers are up across all lifts.',
    trainerRecommendations: 'Deload week next week, then transition into Phase II with heavier loading (5x5 on compound lifts). Continue Whey Isolate and Creatine supplementation.',
    nextAssessmentDate: '2024-05-20',
  },
  {
    id: 'asmt-03',
    memberId: 'user-member-02',
    memberName: 'Maya Lin',
    trainerId: 'user-trainer-01',
    trainerName: 'Sarah Jenkins',
    date: '2024-02-20',
    weightKg: 69.0,
    bodyFatPercentage: 28.5,
    chestCm: 92.0,
    waistCm: 79.0,
    hipsCm: 103.0,
    armCm: 29.0,
    thighCm: 59.0,
    restingHeartRateBpm: 74,
    systolicBP: 122,
    diastolicBP: 80,
    pushupsCount: 12,
    plankSeconds: 40,
    goalDiscussionNotes: 'Maya is enthusiastic about increasing energy levels and toning. Discussed sustainable lifestyle habits and avoiding crash diets.',
    trainerRecommendations: '3-day balanced full-body conditioning with enjoyable cardio. Target 500 kcal modest deficit through wholesome nutrition.',
    nextAssessmentDate: '2024-04-20',
  },
];

// Initial Product Recommendations Seed
const INITIAL_RECOMMENDATIONS: ProductRecommendation[] = [
  {
    id: 'rec-01',
    memberId: 'user-member-01',
    memberName: 'David Miller',
    trainerId: 'user-trainer-02',
    trainerName: 'Marcus Cole',
    productId: 'prod-01',
    productName: 'Nexus Pure Whey Isolate',
    productCategory: 'protein_powder',
    productImage: '/src/assets/images/product_whey_isolate_1793118416422.jpg',
    recommendedDate: '2024-01-20',
    reason: 'To help reach your 160g daily target conveniently right after training sessions.',
    precautions: 'Always mix with water or milk of choice. Not a substitute for whole food meals.',
    dosageOrUsage: '1 scoop (30g) in 300ml cold water within 45 minutes after workout.',
    acknowledgedByMember: true,
  },
  {
    id: 'rec-02',
    memberId: 'user-member-01',
    memberName: 'David Miller',
    trainerId: 'user-trainer-02',
    trainerName: 'Marcus Cole',
    productId: 'prod-02',
    productName: 'Creapure Micronized Creatine Monohydrate',
    productCategory: 'sports_nutrition',
    productImage: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&w=400&q=80',
    recommendedDate: '2024-01-20',
    reason: 'Proven support for cellular ATP resynthesis and progressive resistance strength.',
    precautions: 'Drink at least 3 liters of water throughout the day. Take consistently daily.',
    dosageOrUsage: '5g (1 level teaspoon) daily mixed into shake or juice.',
    acknowledgedByMember: true,
  },
  {
    id: 'rec-03',
    memberId: 'user-member-02',
    memberName: 'Maya Lin',
    trainerId: 'user-trainer-01',
    trainerName: 'Sarah Jenkins',
    productId: 'prod-04',
    productName: 'Pro-Hex Heavy Resistance Loop Bands (5-Pack)',
    productCategory: 'fitness_accessory',
    productImage: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?auto=format&fit=crop&w=400&q=80',
    recommendedDate: '2024-02-22',
    reason: 'Ideal for activating glutes and shoulders during your at-home or travel warmup routine.',
    precautions: 'Store in dry shade to preserve elastic latex longevity.',
    dosageOrUsage: 'Use green (light-medium) band for 15 lateral monster walks before lower body sessions.',
    acknowledgedByMember: false,
  },
];

// Initial Workout Logs Seed
const INITIAL_LOGS: WorkoutLog[] = [
  {
    id: 'log-01',
    memberId: 'user-member-01',
    workoutPlanId: 'plan-david-01',
    dayNumber: 1,
    date: '2024-03-25',
    completedExercises: ['ex-1', 'ex-2', 'ex-3', 'ex-4', 'ex-5'],
    durationMinutes: 55,
    perceivedExertion: 8,
    notes: 'Hit 85kg on bench press for 7 clean reps! Felt strong on T-bar row.',
    completed: true,
  },
  {
    id: 'log-02',
    memberId: 'user-member-01',
    workoutPlanId: 'plan-david-01',
    dayNumber: 2,
    date: '2024-03-27',
    completedExercises: ['ex-6', 'ex-7', 'ex-8', 'ex-9'],
    durationMinutes: 60,
    perceivedExertion: 9,
    notes: 'Squats felt deep and solid. Romanian deadlifts gave great hamstring stretch.',
    completed: true,
  },
  {
    id: 'log-03',
    memberId: 'user-member-02',
    workoutPlanId: 'plan-maya-01',
    dayNumber: 1,
    date: '2024-03-26',
    completedExercises: ['ex-20', 'ex-21', 'ex-22', 'ex-23', 'ex-24'],
    durationMinutes: 45,
    perceivedExertion: 7,
    notes: 'Loved the goblet squats! Held 12kg dumbbell with steady form.',
    completed: true,
  },
];

// Initial Community Posts Seed
const INITIAL_POSTS: CommunityPost[] = [
  {
    id: 'post-01',
    authorId: 'user-owner-01',
    authorName: 'Varad Sutar',
    authorRole: 'owner',
    authorAvatar: '/src/assets/images/avatar_gym_owner_1793118415848.jpg',
    title: 'New Olympic Lifting Platforms & Turf Expansion Ready!',
    content: 'We have completed the installation of 4 brand new Eleiko Olympic platforms and upgraded our 40-meter sprint turf. Open to all members starting today. Come test your speed and power!',
    category: 'announcement',
    likes: 38,
    createdAt: '2024-03-20',
    pinned: true,
  },
  {
    id: 'post-02',
    authorId: 'user-trainer-02',
    authorName: 'Marcus Cole',
    authorRole: 'trainer',
    authorAvatar: '/src/assets/images/avatar_trainer_marcus_1793118416135.jpg',
    title: 'Trainer Tip: The Power of the 2-Second Eccentric',
    content: 'Most muscle damage and hypertrophic signaling occurs during the lowering (eccentric) portion of a lift. Resist dropping the weight—control it down for two deliberate seconds and feel the difference.',
    category: 'discussion',
    likes: 24,
    createdAt: '2024-03-22',
  },
  {
    id: 'post-03',
    authorId: 'user-member-01',
    authorName: 'David Miller',
    authorRole: 'member',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    title: 'Celebrated 3 Months Consistent Training!',
    content: 'Huge shoutout to Coach Marcus for dialing in my form on squats and deadlifts. Down 1% body fat and up 2.2 kg of lean mass. Consistency really is everything.',
    category: 'achievement',
    likes: 29,
    createdAt: '2024-03-26',
  },
];

// Initial Challenges Seed
const INITIAL_CHALLENGES: CommunityChallenge[] = [
  {
    id: 'chal-01',
    title: 'Spring 20-Day Consistency Challenge',
    description: 'Log at least 20 verified workout sessions or active recovery walks throughout the month.',
    category: 'consistency',
    targetMetric: '20 Completed Sessions',
    startDate: '2024-04-01',
    endDate: '2024-04-30',
    participantsCount: 47,
    joined: true,
  },
  {
    id: 'chal-02',
    title: '100km Cardiovascular Endurance Quest',
    description: 'Accumulate 100km across running, rowing, or cycling in 30 days. Opt-in leaderboard tracks friendly progress.',
    category: 'cardio',
    targetMetric: '100 Kilometers',
    startDate: '2024-04-05',
    endDate: '2024-05-05',
    participantsCount: 31,
    joined: false,
  },
];

// Initial Leaderboard Seed
const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, memberId: 'user-member-04', memberName: 'Priya Patel', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80', workoutsCompletedThisMonth: 22, streakDays: 14, badge: 'Endurance Legend', isPublic: true },
  { rank: 2, memberId: 'user-member-01', memberName: 'David Miller', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', workoutsCompletedThisMonth: 19, streakDays: 11, badge: 'Iron Dedication', isPublic: true },
  { rank: 3, memberId: 'user-member-02', memberName: 'Maya Lin', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80', workoutsCompletedThisMonth: 16, streakDays: 8, badge: 'Consistency Rising', isPublic: true },
  { rank: 4, memberId: 'user-ext-05', memberName: 'Carlos Santos', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80', workoutsCompletedThisMonth: 15, streakDays: 6, badge: 'Gym Warrior', isPublic: true },
];

// Initial Notifications Seed
const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-01',
    userId: 'user-member-01',
    title: 'New Fitness Assessment Recorded',
    message: 'Coach Marcus Cole updated your body composition and progressive strength indicators.',
    read: false,
    date: '2024-03-20',
    type: 'assessment',
  },
  {
    id: 'notif-02',
    userId: 'user-member-01',
    title: 'Trainer Recommendation Added',
    message: 'Coach Marcus Cole recommended Nexus Pure Whey Isolate for post-workout recovery.',
    read: true,
    date: '2024-01-20',
    type: 'recommendation',
  },
  {
    id: 'notif-03',
    userId: 'user-owner-01',
    title: 'New Member Registration',
    message: 'Alex Rivera joined Apex Athletic Performance Center with code APEX-2026.',
    read: false,
    date: '2024-03-01',
    type: 'approval',
  },
];

class StorageService {
  private get<T>(key: string, defaultValue: T): T {
    try {
      const data = localStorage.getItem(STORAGE_KEY_PREFIX + key);
      if (!data) {
        localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(defaultValue));
        return defaultValue;
      }
      return JSON.parse(data);
    } catch {
      return defaultValue;
    }
  }

  private set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(value));
    } catch (e) {
      console.error('Storage write error:', e);
    }
  }

  // --- Gym ---
  getGym(): Gym {
    return this.get<Gym>('gym', INITIAL_GYM);
  }

  updateGym(gym: Partial<Gym>): Gym {
    const current = this.getGym();
    const updated = { ...current, ...gym };
    this.set('gym', updated);
    return updated;
  }

  // --- Users ---
  getUsers(): UserProfile[] {
    const users = this.get<UserProfile[]>('users', INITIAL_USERS);
    const ownerIndex = users.findIndex((u) => u.role === 'owner');
    if (ownerIndex >= 0) {
      if (users[ownerIndex].email !== 'varadsutar1703@gmail.com' || users[ownerIndex].password !== '12136') {
        users[ownerIndex].email = 'varadsutar1703@gmail.com';
        users[ownerIndex].fullName = 'Varad Sutar';
        users[ownerIndex].password = '12136';
        this.set('users', users);
      }
    } else {
      users.unshift(INITIAL_USERS[0]);
      this.set('users', users);
    }
    return users;
  }

  getUserById(id: string): UserProfile | undefined {
    return this.getUsers().find((u) => u.id === id);
  }

  getUserByEmail(email: string): UserProfile | undefined {
    return this.getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  saveUser(user: UserProfile): UserProfile {
    const users = this.getUsers();
    const index = users.findIndex((u) => u.id === user.id);
    if (index >= 0) {
      users[index] = user;
    } else {
      users.unshift(user);
    }
    this.set('users', users);
    return user;
  }

  assignTrainerToMember(memberId: string, trainerId: string): UserProfile | undefined {
    const users = this.getUsers();
    const member = users.find((u) => u.id === memberId);
    const trainer = users.find((u) => u.id === trainerId);
    if (!member || !trainer) return undefined;

    member.trainerId = trainer.id;
    member.trainerName = trainer.fullName;
    this.set('users', users);

    // Notify member
    this.addNotification({
      id: 'notif-' + Date.now(),
      userId: member.id,
      title: 'Trainer Assigned',
      message: `${trainer.fullName} has been assigned as your personal fitness coach.`,
      read: false,
      date: new Date().toISOString().split('T')[0],
      type: 'approval',
    });

    return member;
  }

  // --- Fitness Assessments ---
  getAssessments(memberId?: string): FitnessAssessment[] {
    const list = this.get<FitnessAssessment[]>('assessments', INITIAL_ASSESSMENTS);
    if (memberId) {
      return list.filter((a) => a.memberId === memberId);
    }
    return list;
  }

  addAssessment(assessment: Omit<FitnessAssessment, 'id'>): FitnessAssessment {
    const list = this.getAssessments();
    const newRecord: FitnessAssessment = {
      ...assessment,
      id: 'asmt-' + Date.now(),
    };
    list.unshift(newRecord);
    this.set('assessments', list);

    // Also update member's weightKg in profile
    const users = this.getUsers();
    const member = users.find((u) => u.id === assessment.memberId);
    if (member) {
      member.weightKg = assessment.weightKg;
      this.set('users', users);
    }

    // Notify member
    this.addNotification({
      id: 'notif-' + Date.now(),
      userId: assessment.memberId,
      title: 'New Fitness Assessment Logged',
      message: `Coach ${assessment.trainerName} added a new physical fitness and progress assessment.`,
      read: false,
      date: assessment.date,
      type: 'assessment',
    });

    return newRecord;
  }

  // --- Workout Plans ---
  getWorkoutPlans(memberId?: string): WorkoutPlan[] {
    const list = this.get<WorkoutPlan[]>('workout_plans', INITIAL_WORKOUT_PLANS);
    if (memberId) {
      return list.filter((p) => p.memberId === memberId);
    }
    return list;
  }

  saveWorkoutPlan(plan: WorkoutPlan): WorkoutPlan {
    const list = this.getWorkoutPlans();
    const idx = list.findIndex((p) => p.id === plan.id);
    if (idx >= 0) {
      list[idx] = { ...plan, updatedAt: new Date().toISOString().split('T')[0] };
    } else {
      list.unshift(plan);
    }
    this.set('workout_plans', list);

    // Notify member
    this.addNotification({
      id: 'notif-' + Date.now(),
      userId: plan.memberId,
      title: 'Workout Plan Updated',
      message: `Your coach updated your personalized schedule: "${plan.title}".`,
      read: false,
      date: new Date().toISOString().split('T')[0],
      type: 'plan',
    });

    return plan;
  }

  // --- Workout Logs ---
  getWorkoutLogs(memberId?: string): WorkoutLog[] {
    const list = this.get<WorkoutLog[]>('workout_logs', INITIAL_LOGS);
    if (memberId) {
      return list.filter((l) => l.memberId === memberId);
    }
    return list;
  }

  addWorkoutLog(log: Omit<WorkoutLog, 'id'>): WorkoutLog {
    const list = this.getWorkoutLogs();
    const newLog: WorkoutLog = {
      ...log,
      id: 'log-' + Date.now(),
    };
    list.unshift(newLog);
    this.set('workout_logs', list);

    // Update leaderboard if applicable
    const leaderboard = this.getLeaderboard();
    const entry = leaderboard.find((e) => e.memberId === log.memberId);
    if (entry) {
      entry.workoutsCompletedThisMonth += 1;
      entry.streakDays += 1;
      this.set('leaderboard', leaderboard);
    }

    return newLog;
  }

  // --- Products ---
  getProducts(): Product[] {
    return this.get<Product[]>('products', INITIAL_PRODUCTS);
  }

  saveProduct(product: Product): Product {
    const list = this.getProducts();
    const idx = list.findIndex((p) => p.id === product.id);
    if (idx >= 0) {
      list[idx] = product;
    } else {
      list.unshift(product);
    }
    this.set('products', list);
    return product;
  }

  // --- Product Recommendations ---
  getRecommendations(memberId?: string): ProductRecommendation[] {
    const list = this.get<ProductRecommendation[]>('recommendations', INITIAL_RECOMMENDATIONS);
    if (memberId) {
      return list.filter((r) => r.memberId === memberId);
    }
    return list;
  }

  addRecommendation(rec: Omit<ProductRecommendation, 'id'>): ProductRecommendation {
    const list = this.getRecommendations();
    const newRec: ProductRecommendation = {
      ...rec,
      id: 'rec-' + Date.now(),
    };
    list.unshift(newRec);
    this.set('recommendations', list);

    // Notify member
    this.addNotification({
      id: 'notif-' + Date.now(),
      userId: rec.memberId,
      title: 'Supplement & Nutrition Recommendation',
      message: `Coach ${rec.trainerName} recommended ${rec.productName}.`,
      read: false,
      date: rec.recommendedDate,
      type: 'recommendation',
    });

    return newRec;
  }

  acknowledgeRecommendation(recId: string): void {
    const list = this.getRecommendations();
    const item = list.find((r) => r.id === recId);
    if (item) {
      item.acknowledgedByMember = true;
      this.set('recommendations', list);
    }
  }

  // --- Community Posts ---
  getCommunityPosts(): CommunityPost[] {
    return this.get<CommunityPost[]>('community_posts', INITIAL_POSTS);
  }

  addCommunityPost(post: Omit<CommunityPost, 'id' | 'likes' | 'createdAt'>): CommunityPost {
    const list = this.getCommunityPosts();
    const newPost: CommunityPost = {
      ...post,
      id: 'post-' + Date.now(),
      likes: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    list.unshift(newPost);
    this.set('community_posts', list);
    return newPost;
  }

  toggleLikePost(postId: string): CommunityPost | undefined {
    const list = this.getCommunityPosts();
    const post = list.find((p) => p.id === postId);
    if (post) {
      if (post.likedByCurrentUser) {
        post.likes = Math.max(0, post.likes - 1);
        post.likedByCurrentUser = false;
      } else {
        post.likes += 1;
        post.likedByCurrentUser = true;
      }
      this.set('community_posts', list);
    }
    return post;
  }

  // --- Challenges ---
  getChallenges(): CommunityChallenge[] {
    return this.get<CommunityChallenge[]>('community_challenges', INITIAL_CHALLENGES);
  }

  toggleJoinChallenge(challengeId: string): CommunityChallenge | undefined {
    const list = this.getChallenges();
    const challenge = list.find((c) => c.id === challengeId);
    if (challenge) {
      challenge.joined = !challenge.joined;
      challenge.participantsCount += challenge.joined ? 1 : -1;
      this.set('community_challenges', list);
    }
    return challenge;
  }

  // --- Leaderboard ---
  getLeaderboard(): LeaderboardEntry[] {
    return this.get<LeaderboardEntry[]>('leaderboard', INITIAL_LEADERBOARD);
  }

  // --- Notifications ---
  getNotifications(userId: string): AppNotification[] {
    const list = this.get<AppNotification[]>('notifications', INITIAL_NOTIFICATIONS);
    return list.filter((n) => n.userId === userId || n.userId === 'all');
  }

  addNotification(notif: AppNotification): void {
    const list = this.get<AppNotification[]>('notifications', INITIAL_NOTIFICATIONS);
    list.unshift(notif);
    this.set('notifications', list);
  }

  markNotificationRead(notifId: string): void {
    const list = this.get<AppNotification[]>('notifications', INITIAL_NOTIFICATIONS);
    const notif = list.find((n) => n.id === notifId);
    if (notif) {
      notif.read = true;
      this.set('notifications', list);
    }
  }

  // Reset demo storage to fresh baseline
  resetToDefaults(): void {
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'gym');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'users');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'products');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'workout_plans');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'assessments');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'recommendations');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'workout_logs');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'community_posts');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'community_challenges');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'leaderboard');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'notifications');
  }
}

export const storage = new StorageService();
