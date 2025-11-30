export default function Badge({ status }) {
  let color =
    status === "Present"
      ? "bg-green-200 text-green-700"
      : status === "Late"
      ? "bg-yellow-200 text-yellow-700"
      : "bg-red-200 text-red-700";

  return (
    <span className={`px-3 py-1 rounded-full font-semibold text-sm ${color}`}>
      {status}
    </span>
  );
}
