export default function StatCard({ label, value, color }) {
  return (
    <div className={`bg-white shadow border rounded-lg p-5 text-center ${color}`}>
      <h3 className="text-xl font-semibold">{label}</h3>
      <p className="text-4xl font-bold mt-2">{value}</p>
    </div>
  );
}
