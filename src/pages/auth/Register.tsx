import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Shield, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import { tamilNaduDistricts } from '../../data/mockTamilNaduDistricts';

type RegisterFormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  district: string;
  latitude: number;
  longitude: number;
};

const Register = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [locationDetected, setLocationDetected] = useState(false);
  
  const { 
    register, 
    handleSubmit,
    setValue, 
    watch,
    formState: { errors } 
  } = useForm<RegisterFormData>({
    defaultValues: {
      latitude: 13.0827,
      longitude: 80.2707,
    }
  });
  
  const password = watch('password');
  
  const detectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setValue('latitude', position.coords.latitude);
          setValue('longitude', position.coords.longitude);
          setLocationDetected(true);
        },
        (error) => {
          console.error("Error getting location:", error);
          setError("Could not detect your location. Please enter manually.");
        }
      );
    } else {
      setError("Geolocation is not supported by your browser. Please enter location manually.");
    }
  };
  
  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        district: data.district,
        latitude: data.latitude,
        longitude: data.longitude,
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Shield className="h-12 w-12 text-primary-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Register for Disaster Management System
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Create an account to help Tamil Nadu during disasters
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 rounded-md bg-error-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-error-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-error-800">{error}</h3>
                </div>
              </div>
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                  {...register('name', { 
                    required: 'Name is required',
                    minLength: {
                      value: 2,
                      message: 'Name must be at least 2 characters'
                    }
                  })}
                />
                {errors.name && (
                  <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                  {...register('password', { 
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                />
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  type="password"
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                  {...register('confirmPassword', { 
                    required: 'Please confirm your password',
                    validate: value => value === password || 'Passwords do not match'
                  })}
                />
                {errors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-600">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="district" className="block text-sm font-medium text-gray-700">
                District
              </label>
              <div className="mt-1">
                <select
                  id="district"
                  className={`block w-full px-3 py-2 border ${
                    errors.district ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                  {...register('district', { 
                    required: 'Please select your district'
                  })}
                >
                  <option value="">Select a district</option>
                  {tamilNaduDistricts.map((district) => (
                    <option key={district.id} value={district.name}>
                      {district.name}
                    </option>
                  ))}
                </select>
                {errors.district && (
                  <p className="mt-2 text-sm text-red-600">{errors.district.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-gray-700">
                  Your Location
                </label>
                <button
                  type="button"
                  onClick={detectLocation}
                  className="text-sm text-primary-600 hover:text-primary-500"
                >
                  Detect my location
                </button>
              </div>
              
              {locationDetected && (
                <p className="text-xs text-green-600">
                  Location detected successfully!
                </p>
              )}
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="latitude" className="block text-xs font-medium text-gray-500">
                    Latitude
                  </label>
                  <input
                    id="latitude"
                    type="number"
                    step="any"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    {...register('latitude', { 
                      required: 'Latitude is required'
                    })}
                  />
                </div>
                <div>
                  <label htmlFor="longitude" className="block text-xs font-medium text-gray-500">
                    Longitude
                  </label>
                  <input
                    id="longitude"
                    type="number"
                    step="any"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    {...register('longitude', { 
                      required: 'Longitude is required'
                    })}
                  />
                </div>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                variant="primary"
                fullWidth
                isLoading={isLoading}
              >
                Register
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Already have an account?</span>
              </div>
            </div>

            <div className="mt-6">
              <Link to="/login">
                <Button
                  type="button"
                  variant="outline"
                  fullWidth
                >
                  Sign in
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;