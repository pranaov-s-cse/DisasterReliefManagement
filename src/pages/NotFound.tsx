import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import Button from '../components/ui/Button';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Shield className="h-16 w-16 text-primary-600 mx-auto" />
        
        <h1 className="mt-6 text-4xl font-extrabold text-gray-900">404</h1>
        <h2 className="mt-2 text-2xl font-bold text-gray-800">Page Not Found</h2>
        
        <div className="mt-8">
          <p className="text-base text-gray-600">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="mt-8">
          <Link to="/">
            <Button variant="primary">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;