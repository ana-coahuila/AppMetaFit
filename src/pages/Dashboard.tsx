import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useHealth } from '../context/HealthContext';
import Card from '../components/Card';
import Button from '../components/Button';
import { Activity, Utensils, Video, TrendingUp, Plus } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { 
    weightRecords, 
    recommendedMeals, 
    recommendedExercises,
    dailyPlans,
    generateRecommendations 
  } = useHealth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (recommendedMeals.length === 0 || recommendedExercises.length === 0) {
      generateRecommendations();
    }
  }, [recommendedMeals.length, recommendedExercises.length, generateRecommendations]);
  
  if (!user) {
    return null;
  }
  
  const latestWeight = weightRecords.length > 0 
    ? weightRecords[weightRecords.length - 1].weight 
    : user.weight;
  
  const weightDifference = user.weight - latestWeight;
  const weightProgress = user.weight > 0 
    ? ((user.weight - latestWeight) / (user.weight - user.weightGoal) * 100).toFixed(1) 
    : '0';
  
  const todayPlan = dailyPlans.find(plan => 
    plan.date === new Date().toISOString().split('T')[0]
  );
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">
          Hola, {user.name.split(' ')[0]}
        </h1>
        <div className="bg-metafit-blue p-2 rounded-full">
          <Activity size={24} className="text-gray-800" />
        </div>
      </div>
      
      <Card className="bg-gradient-to-r from-metafit-blue to-metafit-green">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Tu progreso</h3>
            <p className="text-gray-700">
              {weightDifference > 0 
                ? `Has perdido ${weightDifference.toFixed(1)} kg` 
                : 'Comienza tu viaje'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-700">Objetivo: {user.weightGoal} kg</p>
            <p className="text-2xl font-bold text-gray-800">{weightProgress}%</p>
          </div>
        </div>
        
        <div className="mt-4 bg-white bg-opacity-50 rounded-full h-2.5">
          <div 
            className="bg-metafit-green-dark h-2.5 rounded-full" 
            style={{ width: `${Math.min(parseFloat(weightProgress), 100)}%` }}
          ></div>
        </div>
        
        <div className="mt-4 flex justify-end">
          <Button
            onClick={() => navigate('/progress')}
            variant="outline"
            className="bg-white bg-opacity-70"
          >
            Ver detalles
          </Button>
        </div>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card title="Plan de hoy">
          {todayPlan ? (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Comidas</h4>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <Utensils size={16} className="mr-2 text-gray-600" />
                    <span>Desayuno: {todayPlan.meals.breakfast.name}</span>
                  </li>
                  <li className="flex items-center">
                    <Utensils size={16} className="mr-2 text-gray-600" />
                    <span>Almuerzo: {todayPlan.meals.lunch.name}</span>
                  </li>
                  <li className="flex items-center">
                    <Utensils size={16} className="mr-2 text-gray-600" />
                    <span>Cena: {todayPlan.meals.dinner.name}</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Ejercicios</h4>
                <ul className="space-y-2">
                  {todayPlan.exercises.map(exercise => (
                    <li key={exercise.id} className="flex items-center">
                      <Video size={16} className="mr-2 text-gray-600" />
                      <span>{exercise.name} ({exercise.duration} min)</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <Button
                onClick={() => navigate('/plan')}
                variant="primary"
                fullWidth
              >
                Ver plan completo
              </Button>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-600 mb-4">No hay un plan para hoy</p>
              <Button
                onClick={generateRecommendations}
                variant="primary"
              >
                Generar plan
              </Button>
            </div>
          )}
        </Card>
        
        <Card title="Registro de peso">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600">Peso actual</p>
              <p className="text-xl font-bold">{latestWeight} kg</p>
            </div>
            <TrendingUp size={24} className="text-metafit-green-dark" />
          </div>
          
          <Button
            onClick={() => navigate('/progress')}
            variant="primary"
            fullWidth
            className="flex items-center justify-center"
          >
            <Plus size={18} className="mr-2" />
            Registrar peso
          </Button>
        </Card>
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Recomendaciones</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <h3 className="font-medium text-gray-800 mb-3">Recetas recomendadas</h3>
            <ul className="space-y-3">
              {recommendedMeals.slice(0, 2).map(meal => (
                <li key={meal.id} className="flex items-start">
                  <div className="h-16 w-16 rounded-md overflow-hidden flex-shrink-0 mr-3">
                    <img 
                      src={meal.imageUrl} 
                      alt={meal.name} 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium">{meal.name}</p>
                    <p className="text-sm text-gray-600">{meal.calories} kcal</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <Button
                onClick={() => navigate('/plan')}
                variant="outline"
                fullWidth
              >
                Ver todas las recetas
              </Button>
            </div>
          </Card>
          
          <Card>
            <h3 className="font-medium text-gray-800 mb-3">Ejercicios recomendados</h3>
            <ul className="space-y-3">
              {recommendedExercises.slice(0, 2).map(exercise => (
                <li key={exercise.id} className="flex items-start">
                  <div className="h-10 w-10 rounded-full bg-metafit-green flex items-center justify-center flex-shrink-0 mr-3">
                    <Video size={20} className="text-gray-800" />
                  </div>
                  <div>
                    <p className="font-medium">{exercise.name}</p>
                    <p className="text-sm text-gray-600">{exercise.duration} min • {exercise.difficulty}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <Button
                onClick={() => navigate('/plan')}
                variant="outline"
                fullWidth
              >
                Ver todos los ejercicios
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;