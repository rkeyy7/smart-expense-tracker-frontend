interface ResumenProps {
  titulo: string;
  monto: number;
  color: string;
}

export default function ResumenCard({ titulo, monto, color }: ResumenProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
      <h3 className="text-gray-500 text-sm font-medium">{titulo}</h3>
      <p className={`text-2xl font-bold mt-2 ${color}`}>
        ${monto.toLocaleString()}
      </p>
    </div>
  );
}