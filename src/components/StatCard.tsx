import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
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
  formatter = (val) => {
    // Handle undefined/null values
    if (val === null || val === undefined) return 'N/A';
    // Handle both string and number values
    return typeof val === 'number' ? val.toLocaleString() : val.toString();
  }
}: StatCardProps) {
  const themeStyles = {
    default: 'text-black bg-white border-black',
    success: 'text-black bg-green-200 border-green-700',
    warning: 'text-black bg-yellow-200 border-yellow-700',
    info: 'text-black bg-blue-200 border-blue-700'
  };

  return (
    <div className={`border-4 ${themeStyles[theme]} p-4 shadow-[4px_4px_0_0_rgba(0,0,0,1)] flex flex-col h-full`}>
      <div className="flex items-center justify-between flex-1">
        <div>
          <p className="text-sm font-bold text-black">{title}</p>
          <p className={`text-xl font-bold mt-1`}>
            {formatter(value)}
          </p>
        </div>
        {icon && (
          <div className={`p-2 border-2 border-black flex-shrink-0`}>
            {icon}
          </div>
        )}
      </div>
      <p className="text-xs font-bold text-black mt-2">{description}</p>
    </div>
  );
}