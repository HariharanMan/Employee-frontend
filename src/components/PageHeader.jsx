export default function PageHeader({ title, subtitle }) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-purple-700">{title}</h2>
      <p className="text-gray-600">{subtitle}</p>
    </div>
  );
}
