import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number; // Changed to support string values
  description: string;
  icon?: ReactNode;
  theme?: 'default' | 'success' | 'warning' | 'info';
  formatter?: (value: string | number) => string;
}

export function StatCard({ 
  title, 
  value, 
  description, 
  icon, 
  theme = 'default',
  formatter = (val) => val.toLocaleString()
}: StatCardProps) {
  const themeStyles = {
    default: 'text-indigo-600',
    success: 'text-green-600',
    warning: 'text-amber-600',
    info: 'text-blue-600'
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
      <div className="flex items-center gap-3 mb-2">
        {icon && <div className={themeStyles[theme]}>{icon}</div>}
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
      <p className={`text-3xl font-bold ${themeStyles[theme]} mb-2`}>
        {formatter(value)}
      </p>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}