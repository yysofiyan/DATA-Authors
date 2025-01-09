
interface StatCardProps {
  title: string;
  value: number;
  description: string;
}

export function StatCard({ title, value, description }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-3xl font-bold text-indigo-600 mb-2">{value}</p>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}