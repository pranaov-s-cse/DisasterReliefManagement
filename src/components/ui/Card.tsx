import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  footer?: ReactNode;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
}

const Card = ({
  children,
  title,
  subtitle,
  footer,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  footerClassName = '',
}: CardProps) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm overflow-hidden ${className}`}>
      {/* Card Header */}
      {(title || subtitle) && (
        <div className={`px-4 py-5 sm:px-6 border-b border-gray-200 ${headerClassName}`}>
          {title && <h3 className="text-lg font-medium leading-6 text-gray-900">{title}</h3>}
          {subtitle && <p className="mt-1 max-w-2xl text-sm text-gray-500">{subtitle}</p>}
        </div>
      )}
      
      {/* Card Body */}
      <div className={`px-4 py-5 sm:p-6 ${bodyClassName}`}>
        {children}
      </div>
      
      {/* Card Footer */}
      {footer && (
        <div className={`px-4 py-4 sm:px-6 bg-gray-50 border-t border-gray-200 ${footerClassName}`}>
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;