import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateBMI,
  getBMICategory,
  calculateBMR,
  calculateTargetCalories,
  calculateHeartRateZones,
  calculateStrengthDelta,
} from './fitnessCalculators';

test('calculateBMI calculates correct BMI', () => {
  // Height 180cm, Weight 75kg => 75 / (1.8^2) = 23.15 => 23.1
  const bmi = calculateBMI(180, 75);
  assert.equal(bmi, 23.1);

  // Zero handling
  assert.equal(calculateBMI(0, 75), 0);
  assert.equal(calculateBMI(180, 0), 0);
});

test('getBMICategory provides respectful, neutral feedback', () => {
  assert.equal(getBMICategory(22.5).label, 'Standard Reference');
  assert.equal(getBMICategory(17.5).label, 'Under Baseline');
  assert.equal(getBMICategory(28).label, 'Elevated Reference');
  assert.equal(getBMICategory(0).label, 'Pending Assessment');
});

test('calculateBMR applies Mifflin-St Jeor formula accurately', () => {
  // Male, 180cm, 80kg, age 30
  // (10 * 80) + (6.25 * 180) - (5 * 30) + 5 = 800 + 1125 - 150 + 5 = 1780
  const bmrMale = calculateBMR({
    heightCm: 180,
    weightKg: 80,
    age: 30,
    gender: 'male',
  });
  assert.equal(bmrMale, 1780);

  // Female, 165cm, 60kg, age 28
  // (10 * 60) + (6.25 * 165) - (5 * 28) - 161 = 600 + 1031.25 - 140 - 161 = 1330.25 => 1330
  const bmrFemale = calculateBMR({
    heightCm: 165,
    weightKg: 60,
    age: 28,
    gender: 'female',
  });
  assert.equal(bmrFemale, 1330);
});

test('calculateTargetCalories adjusts for goal safely', () => {
  const bmr = 1800; // Moderate activity TDEE = 1800 * 1.55 = 2790
  const weightLoss = calculateTargetCalories(bmr, 'weight_loss', 'moderate');
  assert.equal(weightLoss, 2790 - 450); // 2340

  const muscleGain = calculateTargetCalories(bmr, 'muscle_building', 'moderate');
  assert.equal(muscleGain, 2790 + 250); // 3040
});

test('calculateHeartRateZones calculates Tanaka formula and zones', () => {
  const zones = calculateHeartRateZones(30);
  // Max HR = 208 - (0.7 * 30) = 208 - 21 = 187
  assert.equal(zones.maxHR, 187);
  assert.equal(zones.fatBurnZone[0], Math.round(187 * 0.6));
  assert.equal(zones.aerobicZone[1], Math.round(187 * 0.85));
});

test('calculateStrengthDelta computes percentage increase', () => {
  const delta = calculateStrengthDelta([100, 100], [110, 120]);
  // (230 - 200) / 200 = 15%
  assert.equal(delta, 15);
});
