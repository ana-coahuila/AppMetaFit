import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import { User, Settings, LogOut } from 'lucide-react';

const Profile: React.FC = () => {
  const { user, logout, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [age, setAge] = useState(user?.age.toString() || '');
  const [weight, setWeight] = useState(user?.weight.toString() || '');
  const [height, setHeight] = useState(user?.height.toString() || '');
  const [weightGoal, setWeightGoal] = useState(user?.weightGoal.toString() || '');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  if (!user) {
    return null;
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }
    
    if (!age || parseInt(age) < 18 || parseInt(age) > 100) {
      newErrors.age = 'La edad debe estar entre 18 y 100 años';
    }
    
    if (!weight || parseFloat(weight) < 40 || parseFloat(weight) > 300) {
      newErrors.weight = 'El peso debe estar entre 40 y 300 kg';
    }
    
    if (!height || parseInt(height) < 120 || parseInt(height) > 250) {
      newErrors.height = 'La altura debe estar entre 120 y 250 cm';
    }
    
    if (!weightGoal || parseFloat(weightGoal) < 40 || parseFloat(weightGoal) > 300) {
      newErrors.weightGoal = 'El objetivo de peso debe estar entre 40 y 300 kg';
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      updateUserProfile({
        name,
        age: parseInt(age),
        weight: parseFloat(weight),
        height: parseInt(height),
        weightGoal: parseFloat(weightGoal)
      });
      
      setIsEditing(false);
    }
  };
  
  const handleCancel = () => {
    setName(user.name);
    setAge(user.age.toString());
    setWeight(user.weight.toString());
    setHeight(user.height.toString());
    setWeightGoal(user.weightGoal.toString());
    setErrors({});
    setIsEditing(false);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Tu Perfil</h1>
        <div className="bg-metafit-blue p-2 rounded-full">
          <User size={24} className="text-gray-800" />
        </div>
      </div>
      
      <Card>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div className="h-16 w-16 bg-metafit-green rounded-full flex items-center justify-center mr-4">
              <span className="text-2xl font-bold text-gray-800">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>
          
          {!isEditing && (
            <Button
              onClick={() => setIsEditing(true)}
              variant="outline"
              className="flex items-center"
            >
              <Settings size={16} className="mr-2" />
              Editar
            </Button>
          )}
        </div>
        
        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <Input
              id="name"
              label="Nombre completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              error={errors.name}
            />
            
            <Input
              id="age"
              label="Edad (años)"
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              min={18}
              max={100}
              required
              error={errors.age}
            />
            
            <Input
              id="weight"
              label="Peso actual (kg)"
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              min={40}
              max={300}
              step={0.1}
              required
              error={errors.weight}
            />
            
            <Input
              id="height"
              label="Altura (cm)"
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              min={120}
              max={250}
              required
              error={errors.height}
            />
            
            <Input
              id="weightGoal"
              label="Objetivo de peso (kg)"
              type="number"
              value={weightGoal}
              onChange={(e) => setWeightGoal(e.target.value)}
              min={40}
              max={300}
              step={0.1}
              required
              error={errors.weightGoal}
            />
            
            <div className="flex space-x-3 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="primary"
              >
                Guardar cambios
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Edad</p>
                <p className="font-medium">{user.age} años</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">Altura</p>
                <p className="font-medium">{user.height} cm</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">Peso actual</p>
                <p className="font-medium">{user.weight} kg</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">Objetivo de peso</p>
                <p className="font-medium">{user.weightGoal} kg</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">IMC</p>
                <p className="font-medium">{user.bmi}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">Clasificación</p>
                <p className="font-medium">
                  {user.bmi > 40 ? 'Obesidad grado III' : 
                   user.bmi > 35 ? 'Obesidad grado II' : 
                   user.bmi > 30 ? 'Obesidad grado I' : 
                   user.bmi > 25 ? 'Sobrepeso' : 'Normal'}
                </p>
              </div>
            </div>
          </div>
        )}
      </Card>
      
      <Card>
        <h3 className="text-lg font-medium mb-4">Configuración de la cuenta</h3>
        
        <Button
          onClick={logout}
          variant="outline"
          className="flex items-center text-red-600 border-red-200 hover:bg-red-50"
        >
          <LogOut size={16} className="mr-2" />
          Cerrar sesión
        </Button>
      </Card>
    </div>
  );
};

export default Profile;