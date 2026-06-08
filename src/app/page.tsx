"use client";
import { useEffect, useState } from 'react';
import api from '../api/axios';
import ResumenCard from '../components/ResumenCard';

export default function Home() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    api.get('/resumen')
      .then(res => setData(res.data))
      .catch(err => console.error("Error al traer datos:", err));
  }, []);

  if (!data) return <div className="p-10">Cargando dashboard...</div>;

  return (
    <main className="p-10 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Dashboard Financiero</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ResumenCard titulo="Ingresos" monto={data.ingresos_totales} color="text-green-600" />
        <ResumenCard titulo="Gastos" monto={data.gastos_totales} color="text-red-600" />
        <ResumenCard titulo="Balance" monto={data.balance_neto} color="text-blue-600" />
      </div>
    </main>
  );
}