/**
 * Pure logic calculations for FitCare health and fitness metrics.
 */

export interface BodyMetrics {
  heightCm: number;
  weightKg: number;
  age: number;
  gender?: 'male' | 'female' | 'other';
}

/**
 * Calculates Body Mass Index (BMI).
 * Returns BMI rounded to 1 decimal place.
 */
export function calculateBMI(heightCm: number, weightKg: number): number {
  if (heightCm <= 0 || weightKg <= 0) return 0;
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  return Math.round(bmi * 10) / 10;
}

/**
 * Returns a respectful, clinically grounded BMI classification.
 */
export function getBMICategory(bmi: number): {
  label: string;
  advice: string;
} {
  if (bmi <= 0) {
    return { label: 'Pending Assessment', advice: 'Enter valid measurements to calculate reference indicators.' };
  }
  if (bmi < 18.5) {
    return { label: 'Under Baseline', advice: 'Focus on balanced caloric surplus and resistance training to build lean tissue.' };
  }
  if (bmi < 25) {
    return { label: 'Standard Reference', advice: 'Healthy reference range. Maintain balanced nutrition and consistent exercise.' };
  }
  if (bmi < 30) {
    return { label: 'Elevated Reference', advice: 'Focus on cardiovascular conditioning, progressive strength training, and whole foods.' };
  }
  return { label: 'High Reference', advice: 'Consult with a fitness trainer and physician to create an individualized conditioning plan.' };
}

/**
 * Calculates Estimated Basal Metabolic Rate (BMR) using the Mifflin-St Jeor equation.
 */
export function calculateBMR(metrics: BodyMetrics): number {
  const { heightCm, weightKg, age, gender = 'male' } = metrics;
  if (heightCm <= 0 || weightKg <= 0 || age <= 0) return 0;

  // Mifflin - St Jeor: (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) + s
  // s = +5 for males, -161 for females
  const s = gender === 'female' ? -161 : 5;
  const bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age) + s;
  return Math.max(0, Math.round(bmr));
}

/**
 * Calculates estimated daily caloric expenditure based on fitness goal and activity multiplier.
 */
export function calculateTargetCalories(
  bmr: number,
  goal: 'weight_loss' | 'weight_gain' | 'muscle_building' | 'general_fitness' | 'endurance',
  activityLevel: 'sedentary' | 'moderate' | 'active' = 'moderate'
): number {
  if (bmr <= 0) return 0;
  
  const multipliers: Record<string, number> = {
    sedentary: 1.2,
    moderate: 1.55,
    active: 1.75,
  };
  
  const tdee = bmr * (multipliers[activityLevel] || 1.55);

  switch (goal) {
    case 'weight_loss':
      return Math.round(tdee - 450); // Safe modest deficit
    case 'weight_gain':
      return Math.round(tdee + 450); // Modest surplus
    case 'muscle_building':
      return Math.round(tdee + 250); // Lean mass surplus
    case 'endurance':
    case 'general_fitness':
    default:
      return Math.round(tdee);
  }
}

/**
 * Calculates Target Heart Rate (THR) training zones using the Tanaka formula (208 - 0.7 * age).
 */
export function calculateHeartRateZones(age: number): {
  maxHR: number;
  fatBurnZone: [number, number];
  aerobicZone: [number, number];
  peakZone: [number, number];
} {
  const validAge = age > 0 ? age : 30;
  const maxHR = Math.round(208 - (0.7 * validAge));
  
  return {
    maxHR,
    fatBurnZone: [Math.round(maxHR * 0.6), Math.round(maxHR * 0.7)],
    aerobicZone: [Math.round(maxHR * 0.7), Math.round(maxHR * 0.85)],
    peakZone: [Math.round(maxHR * 0.85), Math.round(maxHR * 0.95)],
  };
}

/**
 * Calculates composite strength score progress percentage between two measurements.
 */
export function calculateStrengthDelta(initialWeights: number[], latestWeights: number[]): number {
  if (!initialWeights.length || !latestWeights.length) return 0;
  const initialSum = initialWeights.reduce((a, b) => a + b, 0);
  const latestSum = latestWeights.reduce((a, b) => a + b, 0);
  if (initialSum <= 0) return 0;
  const delta = ((latestSum - initialSum) / initialSum) * 100;
  return Math.round(delta * 10) / 10;
}
