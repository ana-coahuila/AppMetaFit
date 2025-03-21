import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useHealth } from '../context/HealthContext';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import { TrendingUp, Plus } from 'lucide-react';

const Progress: React.FC = () => {
  const { user } = useAuth();
  const { weightRecords, addWeightRecord } = useHealth();
  const [newWeight, setNewWeight] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  
  if (!user) {
    return null;
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const weightValue = parseFloat(newWeight);
    if (isNaN(weightValue) || weightValue <= 0) {
      setError('Por favor ingresa un peso válido');
      return;
    }
    
    addWeightRecord(weightValue);
    setNewWeight('');
    setShowForm(false);
  };
  
  const sortedRecords = [...weightRecords].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  };
  
  const calculateProgress = () => {
    if (weightRecords.length < 2) return 0;
    
    const initialWeight = weightRecords[0].weight;
    const currentWeight = sortedRecords[0].weight;
    const goalWeight = user.weightGoal;
    
    if (initialWeight === goalWeight) return 100;
    
    const progress = ((initialWeight - currentWeight) / (initialWeight - goalWeight)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };
  
  const progressPercentage = calculateProgress().toFixed(1);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Tu Progreso</h1>
        <div className="bg-metafit-blue p-2 rounded-full">
          <TrendingUp size={24} className="text-gray-800" />
        </div>
      </div>
      
      <Card className="bg-gradient-to-r from-metafit-blue to-metafit-green">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Progreso hacia tu meta</h3>
            <p className="text-gray-700">
              Meta: {user.weightGoal} kg
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-700">Progreso</p>
            <p className="text-2xl font-bold text-gray-800">{progressPercentage}%</p>
          </div>
        </div>
        
        <div className="mt-4 bg-white bg-opacity-50 rounded-full h-2.5">
          <div 
            className="bg-metafit-green-dark h-2.5 rounded-full" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </Card>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-medium">Registro de peso</h3>
          <Button
            onClick={() => setShowForm(!showForm)}
            variant="primary"
            className="flex items-center"
          >
            <Plus size={18} className="mr-1" />
            Añadir
          </Button>
        </div>
        
        {showForm && (
          <div className="p-4 bg-gray-50 border-b">
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row md:items-end gap-4">
              <div className="flex-grow">
                <Input
                  id="newWeight"
                  label="Peso actual (kg)"
                  type="number"
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                  min={30}
                  max={300}
                  step={0.1}
                  required
                  error={error}
                />
              </div>
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                >
                  Guardar
                </Button>
              </div>
            </form>
          </div>
        )}
        
        <div className="p-4">
          {sortedRecords.length > 0 ? (
            <div className="space-y-4">
              {sortedRecords.map((record, index) => {
                const prevRecord = index < sortedRecords.length - 1 ? sortedRecords[index + 1] : null;
                const difference = prevRecord ? (record.weight - prevRecord.weight).toFixed(1) : null;
                const isLoss = difference && parseFloat(difference) < 0;
                
                return (
                  <div key={record.date} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{formatDate(record.date)}</p>
                      {index === 0 && <p className="text-xs text-gray-500">Más reciente</p>}
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">{record.weight} kg</p>
                      {difference && (
                        <p className={`text-sm ${isLoss ? 'text-green-600' : 'text-red-600'}`}>
                          {isLoss ? '' : '+'}
                          {difference} kg
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">No hay registros de peso</p>
            </div>
          )}
        </div>
      </div>
      
      <Card title="Estadísticas">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">Peso inicial</p>
            <p className="text-xl font-bold">
              {weightRecords.length > 0 ? weightRecords[0].weight : user.weight} kg
            </p>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">Peso actual</p>
            <p className="text-xl font-bold">
              {sortedRecords.length > 0 ? sortedRecords[0].weight : user.weight} kg
            </p>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">Peso objetivo</p>
            <p className="text-xl font-bold">{user.weightGoal} kg</p>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">IMC</p>
            <p className="text-xl font-bold">{user.bmi}</p>
            <p className="text-xs text-gray-500">
              {user.bmi > 30 ? 'Obesidad' : user.bmi > 25 ? 'Sobrepeso' : 'Normal'}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Progress;