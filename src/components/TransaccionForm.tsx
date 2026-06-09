"use client";
import { useState } from 'react';
import api from '@/api/axios';

export default function TransaccionForm({ onGuardado }: { onGuardado: () => void }) {
  const [formData, setFormData] = useState({
    tipo: 'gasto',
    monto: '',
    categoria: '',
    descripcion: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/transacciones', formData);
      // Limpiamos el formulario tras enviar
      setFormData({ tipo: 'gasto', monto: '', categoria: '', descripcion: '' });
      // Avisamos al padre (page.tsx) para que refresque los datos
      onGuardado();
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h2 className="text-lg font-bold mb-4">Nueva Transacción</h2>
      <div className="grid grid-cols-1 gap-4">
        <select 
          className="p-2 border rounded"
          value={formData.tipo}
          onChange={(e) => setFormData({...formData, tipo: e.target.value})}
        >
          <option value="gasto">Gasto</option>
          <option value="ingreso">Ingreso</option>
        </select>
        
        <input 
          type="number" placeholder="Monto" className="p-2 border rounded"
          value={formData.monto}
          onChange={(e) => setFormData({...formData, monto: e.target.value})}
          required
        />
        
        <input 
          type="text" placeholder="Categoría" className="p-2 border rounded"
          value={formData.categoria}
          onChange={(e) => setFormData({...formData, categoria: e.target.value})}
          required
        />
        
        <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition">
          Guardar
        </button>
      </div>
    </form>
  );
}