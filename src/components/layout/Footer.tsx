import { Shield } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Shield className="h-6 w-6 text-primary-600 mr-2" />
            <p className="text-sm text-gray-600">
              Tamil Nadu Disaster Management System
            </p>
          </div>
          
          <div className="flex space-x-6 text-xs text-gray-500">
            <a href="#" className="hover:text-gray-900">Privacy Policy</a>
            <a href="#" className="hover:text-gray-900">Terms of Service</a>
            <a href="#" className="hover:text-gray-900">Contact</a>
          </div>
          
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Government of Tamil Nadu
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;