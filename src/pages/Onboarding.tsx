import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';
import { Activity } from 'lucide-react';

const Onboarding: React.FC = () => {
  const [step, setStep] = useState(1);
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [weightGoal, setWeightGoal] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { updateUserProfile } = useAuth();
  const navigate = useNavigate();
  
  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!age) {
      newErrors.age = 'La edad es requerida';
    } else if (parseInt(age) < 18 || parseInt(age) > 100) {
      newErrors.age = 'La edad debe estar entre 18 y 100 años';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!weight) {
      newErrors.weight = 'El peso es requerido';
    } else if (parseFloat(weight) < 40 || parseFloat(weight) > 300) {
      newErrors.weight = 'El peso debe estar entre 40 y 300 kg';
    }
    
    if (!height) {
      newErrors.height = 'La altura es requerida';
    } else if (parseInt(height) < 120 || parseInt(height) > 250) {
      newErrors.height = 'La altura debe estar entre 120 y 250 cm';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const validateStep3 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!weightGoal) {
      newErrors.weightGoal = 'El objetivo de peso es requerido';
    } else if (parseFloat(weightGoal) < 40 || parseFloat(weightGoal) > 300) {
      newErrors.weightGoal = 'El objetivo de peso debe estar entre 40 y 300 kg';
    } else if (parseFloat(weightGoal) >= parseFloat(weight)) {
      newErrors.weightGoal = 'El objetivo de peso debe ser menor que tu peso actual';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };
  
  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  const handleSubmit = () => {
    if (validateStep3()) {
      updateUserProfile({
        age: parseInt(age),
        weight: parseFloat(weight),
        height: parseInt(height),
        weightGoal: parseFloat(weightGoal)
      });
      
      navigate('/dashboard');
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-metafit-blue to-metafit-green flex flex-col justify-center items-center px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="flex justify-center mb-6">
            <div className="bg-metafit-blue p-3 rounded-full">
              <Activity size={40} className="text-gray-800" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
            Configuración Inicial
          </h2>
          
          <p className="text-center text-gray-600 mb-6">
            Necesitamos algunos datos para personalizar tu experiencia
          </p>
          
          <div className="flex justify-between mb-8">
            {[1, 2, 3].map((s) => (
              <div 
                key={s} 
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  s === step 
                    ? 'bg-metafit-blue text-gray-800 font-bold' 
                    : s < step 
                      ? 'bg-metafit-green text-gray-800' 
                      : 'bg-gray-200 text-gray-600'
                }`}
              >
                {s}
              </div>
            ))}
          </div>
          
          {step === 1 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">¿Cuál es tu edad?</h3>
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
            </div>
          )}
          
          {step === 2 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">¿Cuáles son tus medidas actuales?</h3>
              <Input
                id="weight"
                label="Peso (kg)"
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
            </div>
          )}
          
          {step === 3 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">¿Cuál es tu objetivo de peso?</h3>
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
              
              <p className="mt-4 text-sm text-gray-600">
                Este objetivo nos ayudará a personalizar tu plan de alimentación y ejercicios.
              </p>
            </div>
          )}
          
          <div className="mt-8 flex justify-between">
            {step > 1 ? (
              <Button
                onClick={handlePrevStep}
                variant="outline"
              >
                Anterior
              </Button>
            ) : (
              <div></div>
            )}
            
            {step < 3 ? (
              <Button
                onClick={handleNextStep}
                variant="primary"
              >
                Siguiente
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                variant="primary"
              >
                Finalizar
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;