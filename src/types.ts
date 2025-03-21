export interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  weight: number;
  height: number;
  bmi: number;
  weightGoal: number;
}

export interface WeightRecord {
  date: string;
  weight: number;
}

export interface Meal {
  id: string;
  name: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  imageUrl: string;
  ingredients: string[];
  instructions: string[];
  tags: string[];
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
  videoUrl: string;
  duration: number;
  caloriesBurned: number;
  difficulty: 'Principiante' | 'Intermedio' | 'Avanzado';
  tags: string[];
}

export interface DailyPlan {
  date: string;
  meals: {
    breakfast: Meal;
    lunch: Meal;
    dinner: Meal;
    snacks: Meal[];
  };
  exercises: Exercise[];
  waterIntake: number;
  notes: string;
}