interface MetricsTableProps {
  scopusMetrics: {
    articles: number;
    citations: number;
    citedDocs: number;
    hIndex: number;
    i10Index: number;
    gIndex: number;
  };
  gsMetrics: {
    articles: number;
    citations: number;
    citedDocs: number;
    hIndex: number;
    i10Index: number;
    gIndex: number;
  };
}

export function MetricsTable({ scopusMetrics, gsMetrics }: MetricsTableProps) {
  const metrics = [
    { label: 'Articles', scopus: scopusMetrics.articles, gs: gsMetrics.articles },
    { label: 'Citations', scopus: scopusMetrics.citations, gs: gsMetrics.citations },
    { label: 'Cited Documents', scopus: scopusMetrics.citedDocs, gs: gsMetrics.citedDocs },
    { label: 'H-Index', scopus: scopusMetrics.hIndex, gs: gsMetrics.hIndex },
    { label: 'i10-Index', scopus: scopusMetrics.i10Index, gs: gsMetrics.i10Index },
    { label: 'G-Index', scopus: scopusMetrics.gIndex, gs: gsMetrics.gIndex },
  ];

  return (
    <div className="bg-white rounded-lg p-6 shadow hover:shadow-lg transition-shadow mb-8">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Research Metrics</h3>
      <table className="w-full text-left">
        <thead>
          <tr className="border-b">
            <th className="py-2">Metric</th>
            <th className="py-2">Scopus</th>
            <th className="py-2">Google Scholar</th>
          </tr>
        </thead>
        <tbody>
          {metrics.map((metric, index) => (
            <tr key={index} className="border-b last:border-b-0">
              <td className="py-2 text-gray-600">{metric.label}</td>
              <td className="py-2 text-indigo-600">{metric.scopus}</td>
              <td className="py-2 text-green-600">{metric.gs}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
