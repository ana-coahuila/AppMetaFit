import React, { useState } from 'react';
import { useHealth } from '../context/HealthContext';
import Button from '../components/Button';
import { Calendar, ChevronLeft, ChevronRight, Video } from 'lucide-react';

const Plan: React.FC = () => {
  const { recommendedMeals, recommendedExercises, dailyPlans } = useHealth();
  const [activeTab, setActiveTab] = useState<'plan' | 'meals' | 'exercises'>('plan');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
  };
  
  const getNextDay = (dateString: string) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1);
    return date.toISOString().split('T')[0];
  };
  
  const getPrevDay = (dateString: string) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() - 1);
    return date.toISOString().split('T')[0];
  };
  
  const selectedPlan = dailyPlans.find(plan => plan.date === selectedDate);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Tu Plan</h1>
        <div className="bg-metafit-blue p-2 rounded-full">
          <Calendar size={24} className="text-gray-800" />
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex border-b">
          <button
            className={`flex-1 py-3 text-center font-medium ${
              activeTab === 'plan' 
                ? 'text-metafit-blue-dark border-b-2 border-metafit-blue-dark' 
                : 'text-gray-600'
            }`}
            onClick={() => setActiveTab('plan')}
          >
            Plan Diario
          </button>
          <button
            className={`flex-1 py-3 text-center font-medium ${
              activeTab === 'meals' 
                ? 'text-metafit-blue-dark border-b-2 border-metafit-blue-dark' 
                : 'text-gray-600'
            }`}
            onClick={() => setActiveTab('meals')}
          >
            Recetas
          </button>
          <button
            className={`flex-1 py-3 text-center font-medium ${
              activeTab === 'exercises' 
                ? 'text-metafit-blue-dark border-b-2 border-metafit-blue-dark' 
                : 'text-gray-600'
            }`}
            onClick={() => setActiveTab('exercises')}
          >
            Ejercicios
          </button>
        </div>
        
        {activeTab === 'plan' && (
          <div className="p-4">
            <div className="flex items-center justify-between mb-6">
              <button 
                onClick={() => setSelectedDate(getPrevDay(selectedDate))}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <ChevronLeft size={20} />
              </button>
              
              <h3 className="text-lg font-medium capitalize">
                {formatDate(selectedDate)}
              </h3>
              
              <button 
                onClick={() => setSelectedDate(getNextDay(selectedDate))}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <ChevronRight size={20} />
              </button>
            </div>
            
            {selectedPlan ? (
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-800 mb-3">Comidas</h4>
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-600">Desayuno</span>
                        <span className="text-xs bg-metafit-green px-2 py-1 rounded-full">
                          {selectedPlan.meals.breakfast.calories} kcal
                        </span>
                      </div>
                      <p className="font-medium">{selectedPlan.meals.breakfast.name}</p>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-600">Almuerzo</span>
                        <span className="text-xs bg-metafit-green px-2 py-1 rounded-full">
                          {selectedPlan.meals.lunch.calories} kcal
                        </span>
                      </div>
                      <p className="font-medium">{selectedPlan.meals.lunch.name}</p>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-600">Cena</span>
                        <span className="text-xs bg-metafit-green px-2 py-1 rounded-full">
                          {selectedPlan.meals.dinner.calories} kcal
                        </span>
                      </div>
                      <p className="font-medium">{selectedPlan.meals.dinner.name}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-800 mb-3">Ejercicios</h4>
                  <div className="space-y-3">
                    {selectedPlan.exercises.map(exercise => (
                      <div key={exercise.id} className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium">{exercise.name}</span>
                          <span className="text-xs bg-metafit-blue px-2 py-1 rounded-full">
                            {exercise.duration} min
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{exercise.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center">
                <p className="text-gray-600 mb-4">No hay un plan para esta fecha</p>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'meals' && (
          <div className="p-4">
            <h3 className="text-lg font-medium mb-4">Recetas recomendadas</h3>
            <div className="space-y-6">
              {recommendedMeals.map(meal => (
                <div key={meal.id} className="border rounded-lg overflow-hidden">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={meal.imageUrl} 
                      alt={meal.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="font-medium text-lg mb-1">{meal.name}</h4>
                    <p className="text-gray-600 mb-3">{meal.description}</p>
                    
                    <div className="flex space-x-3 mb-4">
                      <div className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                        {meal.calories} kcal
                      </div>
                      <div className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                        P: {meal.protein}g
                      </div>
                      <div className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                        C: {meal.carbs}g
                      </div>
                      <div className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                        G: {meal.fat}g
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h5 className="font-medium mb-2">Ingredientes</h5>
                      <ul className="list-disc pl-5 space-y-1">
                        {meal.ingredients.map((ingredient, index) => (
                          <li key={index} className="text-sm text-gray-700">{ingredient}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="font-medium mb-2">Preparación</h5>
                      <ol className="list-decimal pl-5 space-y-1">
                        {meal.instructions.map((instruction, index) => (
                          <li key={index} className="text-sm text-gray-700">{instruction}</li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'exercises' && (
          <div className="p-4">
            <h3 className="text-lg font-medium mb-4">Ejercicios recomendados</h3>
            <div className="space-y-4">
              {recommendedExercises.map(exercise => (
                <div key={exercise.id} className="bg-white border rounded-lg p-4">
                  <div className="flex items-start">
                    <div className="h-12 w-12 rounded-full bg-metafit-green flex items-center justify-center flex-shrink-0 mr-4">
                      <Video size={24} className="text-gray-800" />
                    </div>
                    <div>
                      <h4 className="font-medium text-lg">{exercise.name}</h4>
                      <div className="flex space-x-3 my-2">
                        <span className="text-sm bg-metafit-blue px-2 py-1 rounded-full">
                          {exercise.duration} min
                        </span>
                        <span className="text-sm bg-gray-100 px-2 py-1 rounded-full">
                          {exercise.difficulty}
                        </span>
                        <span className="text-sm bg-gray-100 px-2 py-1 rounded-full">
                          ~{exercise.caloriesBurned} kcal
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">{exercise.description}</p>
                      <Button
                        variant="outline"
                        onClick={() => window.open(exercise.videoUrl, '_blank')}
                        className="flex items-center"
                      >
                        <Video size={16} className="mr-2" />
                        Ver video
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Plan;