import { ReactNode } from 'react';
import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from 'lucide-react';

interface AlertProps {
  children: ReactNode;
  title?: string;
  variant?: 'info' | 'success' | 'warning' | 'error';
  onClose?: () => void;
  className?: string;
}

const Alert = ({
  children,
  title,
  variant = 'info',
  onClose,
  className = '',
}: AlertProps) => {
  const variantClasses = {
    info: 'bg-secondary-50 text-secondary-800 border-secondary-200',
    success: 'bg-success-50 text-success-800 border-success-200',
    warning: 'bg-warning-50 text-warning-800 border-warning-200',
    error: 'bg-error-50 text-error-800 border-error-200',
  };
  
  const iconClasses = {
    info: 'text-secondary-500',
    success: 'text-success-500',
    warning: 'text-warning-500',
    error: 'text-error-500',
  };
  
  const Icon = {
    info: Info,
    success: CheckCircle,
    warning: AlertTriangle,
    error: AlertCircle,
  }[variant];
  
  return (
    <div className={`rounded-md border p-4 ${variantClasses[variant]} ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <Icon className={`h-5 w-5 ${iconClasses[variant]}`} />
        </div>
        <div className="ml-3 flex-1">
          {title && (
            <h3 className="text-sm font-medium">{title}</h3>
          )}
          <div className={title ? 'mt-2 text-sm' : 'text-sm'}>
            {children}
          </div>
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                onClick={onClose}
                className={`
                  inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2
                  ${variant === 'info' ? 'text-secondary-500 hover:bg-secondary-100 focus:ring-secondary-600' : ''}
                  ${variant === 'success' ? 'text-success-500 hover:bg-success-100 focus:ring-success-600' : ''}
                  ${variant === 'warning' ? 'text-warning-500 hover:bg-warning-100 focus:ring-warning-600' : ''}
                  ${variant === 'error' ? 'text-error-500 hover:bg-error-100 focus:ring-error-600' : ''}
                `}
              >
                <span className="sr-only">Dismiss</span>
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alert;