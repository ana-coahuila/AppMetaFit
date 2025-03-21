import React, { createContext, useState, useContext, useEffect } from 'react';
import { WeightRecord, Meal, Exercise, DailyPlan } from '../types';
import { useAuth } from './AuthContext';

interface HealthContextType {
  weightRecords: WeightRecord[];
  recommendedMeals: Meal[];
  recommendedExercises: Exercise[];
  dailyPlans: DailyPlan[];
  addWeightRecord: (weight: number) => void;
  generateRecommendations: () => void;
}

const HealthContext = createContext<HealthContextType | undefined>(undefined);

export const HealthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [weightRecords, setWeightRecords] = useState<WeightRecord[]>([]);
  const [recommendedMeals, setRecommendedMeals] = useState<Meal[]>([]);
  const [recommendedExercises, setRecommendedExercises] = useState<Exercise[]>([]);
  const [dailyPlans, setDailyPlans] = useState<DailyPlan[]>([]);

  useEffect(() => {
    // Load data from localStorage
    if (user) {
      const storedWeightRecords = localStorage.getItem(`metafit_weight_${user.id}`);
      if (storedWeightRecords) {
        setWeightRecords(JSON.parse(storedWeightRecords));
      } else if (user.weight) {
        // Initialize with current weight if available
        const initialRecord: WeightRecord = {
          date: new Date().toISOString().split('T')[0],
          weight: user.weight
        };
        setWeightRecords([initialRecord]);
        localStorage.setItem(`metafit_weight_${user.id}`, JSON.stringify([initialRecord]));
      }

      const storedMeals = localStorage.getItem(`metafit_meals_${user.id}`);
      if (storedMeals) {
        setRecommendedMeals(JSON.parse(storedMeals));
      }

      const storedExercises = localStorage.getItem(`metafit_exercises_${user.id}`);
      if (storedExercises) {
        setRecommendedExercises(JSON.parse(storedExercises));
      }

      const storedPlans = localStorage.getItem(`metafit_plans_${user.id}`);
      if (storedPlans) {
        setDailyPlans(JSON.parse(storedPlans));
      }
    }
  }, [user]);

  const addWeightRecord = (weight: number) => {
    if (!user) return;
    
    const newRecord: WeightRecord = {
      date: new Date().toISOString().split('T')[0],
      weight
    };
    
    const updatedRecords = [...weightRecords, newRecord];
    setWeightRecords(updatedRecords);
    localStorage.setItem(`metafit_weight_${user.id}`, JSON.stringify(updatedRecords));
  };

  // Mock data for recommendations
  const mockMeals: Meal[] = [
    {
      id: '1',
      name: 'Ensalada de pollo con aguacate',
      description: 'Una ensalada rica en proteínas y grasas saludables, baja en carbohidratos.',
      calories: 350,
      protein: 30,
      carbs: 15,
      fat: 20,
      imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      ingredients: [
        '150g de pechuga de pollo a la plancha',
        '1 aguacate mediano',
        '2 tazas de lechuga mixta',
        '1 tomate mediano',
        '1 cucharada de aceite de oliva',
        'Jugo de limón al gusto',
        'Sal y pimienta al gusto'
      ],
      instructions: [
        'Cocinar la pechuga de pollo a la plancha con un poco de sal y pimienta.',
        'Lavar y cortar la lechuga y el tomate.',
        'Cortar el aguacate en cubos.',
        'Mezclar todos los ingredientes en un bowl.',
        'Aliñar con aceite de oliva, jugo de limón, sal y pimienta.'
      ],
      tags: ['alto en proteínas', 'bajo en carbohidratos', 'saludable']
    },
    {
      id: '2',
      name: 'Salmón al horno con verduras',
      description: 'Plato rico en ácidos grasos omega-3 y proteínas de alta calidad.',
      calories: 420,
      protein: 35,
      carbs: 10,
      fat: 25,
      imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      ingredients: [
        '180g de filete de salmón',
        '1 calabacín mediano',
        '1 pimiento rojo',
        '1 cebolla mediana',
        '2 cucharadas de aceite de oliva',
        'Jugo de limón',
        'Hierbas aromáticas (tomillo, romero)',
        'Sal y pimienta al gusto'
      ],
      instructions: [
        'Precalentar el horno a 180°C.',
        'Cortar las verduras en rodajas o trozos medianos.',
        'Colocar el salmón y las verduras en una bandeja para horno.',
        'Rociar con aceite de oliva, jugo de limón, sal, pimienta y hierbas.',
        'Hornear por 20-25 minutos hasta que el salmón esté cocido.'
      ],
      tags: ['rico en omega-3', 'bajo en carbohidratos', 'alto en proteínas']
    },
    {
      id: '3',
      name: 'Batido verde de proteínas',
      description: 'Batido nutritivo ideal para después del ejercicio o como desayuno.',
      calories: 250,
      protein: 20,
      carbs: 25,
      fat: 8,
      imageUrl: 'https://images.unsplash.com/photo-1556881286-fc6915169721?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      ingredients: [
        '1 scoop de proteína de suero de leche sin sabor',
        '1 plátano mediano',
        '1 puñado de espinacas',
        '1 cucharada de mantequilla de almendras',
        '250ml de leche de almendras sin azúcar',
        'Hielo al gusto'
      ],
      instructions: [
        'Añadir todos los ingredientes a una licuadora.',
        'Licuar hasta obtener una mezcla homogénea.',
        'Servir inmediatamente.'
      ],
      tags: ['alto en proteínas', 'post-entrenamiento', 'desayuno']
    }
  ];

  const mockExercises: Exercise[] = [
    {
      id: '1',
      name: 'Caminata de baja intensidad',
      description: 'Caminata a ritmo moderado, ideal para principiantes con obesidad.',
      videoUrl: 'https://www.youtube.com/watch?v=example1',
      duration: 30,
      caloriesBurned: 150,
      difficulty: 'Principiante',
      tags: ['cardio', 'bajo impacto', 'principiante']
    },
    {
      id: '2',
      name: 'Ejercicios acuáticos',
      description: 'Rutina de ejercicios en agua que reduce el impacto en las articulaciones.',
      videoUrl: 'https://www.youtube.com/watch?v=example2',
      duration: 45,
      caloriesBurned: 300,
      difficulty: 'Principiante',
      tags: ['acuático', 'bajo impacto', 'articulaciones']
    },
    {
      id: '3',
      name: 'Yoga para principiantes',
      description: 'Rutina de yoga adaptada para personas con obesidad, mejora flexibilidad y equilibrio.',
      videoUrl: 'https://www.youtube.com/watch?v=example3',
      duration: 20,
      caloriesBurned: 120,
      difficulty: 'Principiante',
      tags: ['yoga', 'flexibilidad', 'relajación']
    },
    {
      id: '4',
      name: 'Entrenamiento de fuerza con silla',
      description: 'Ejercicios de fuerza utilizando una silla como soporte.',
      videoUrl: 'https://www.youtube.com/watch?v=example4',
      duration: 25,
      caloriesBurned: 180,
      difficulty: 'Principiante',
      tags: ['fuerza', 'con silla', 'tonificación']
    }
  ];

  const generateRecommendations = () => {
    if (!user) return;
    
    // In a real app, this would make API calls to an AI service
    // For demo purposes, we'll use mock data
    
    setRecommendedMeals(mockMeals);
    setRecommendedExercises(mockExercises);
    
    // Generate a sample daily plan
    const today = new Date().toISOString().split('T')[0];
    const samplePlan: DailyPlan = {
      date: today,
      meals: {
        breakfast: mockMeals[2], // Batido verde
        lunch: mockMeals[0], // Ensalada de pollo
        dinner: mockMeals[1], // Salmón
        snacks: []
      },
      exercises: [mockExercises[0], mockExercises[2]], // Caminata y yoga
      waterIntake: 0,
      notes: ''
    };
    
    const updatedPlans = [...dailyPlans, samplePlan];
    setDailyPlans(updatedPlans);
    
    // Save to localStorage
    localStorage.setItem(`metafit_meals_${user.id}`, JSON.stringify(mockMeals));
    localStorage.setItem(`metafit_exercises_${user.id}`, JSON.stringify(mockExercises));
    localStorage.setItem(`metafit_plans_${user.id}`, JSON.stringify(updatedPlans));
  };

  return (
    <HealthContext.Provider value={{ 
      weightRecords, 
      recommendedMeals, 
      recommendedExercises, 
      dailyPlans,
      addWeightRecord,
      generateRecommendations
    }}>
      {children}
    </HealthContext.Provider>
  );
};

export const useHealth = () => {
  const context = useContext(HealthContext);
  if (context === undefined) {
    throw new Error('useHealth must be used within a HealthProvider');
  }
  return context;
};