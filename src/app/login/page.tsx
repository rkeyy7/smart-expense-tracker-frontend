"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/api/axios'; // Asegúrate de que esta instancia tenga el interceptor configurado

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje({ texto: 'Cargando...', tipo: 'info' });

    try {
      const endpoint = isLogin ? '/login' : '/register';
      const res = await api.post(endpoint, formData);

      if (isLogin) {
        // CAMBIO CRUCIAL AQUÍ:
        // 1. Guardamos el TOKEN en lugar del ID
        localStorage.setItem('token', res.data.access_token);
        
        // 2. Limpiamos cualquier rastro del ID antiguo por seguridad
        localStorage.removeItem('user_id');

        setMensaje({ texto: '¡Login exitoso! Redirigiendo...', tipo: 'success' });
        
        // Redirigir al dashboard
        setTimeout(() => router.push('/'), 1000);
      } else {
        setMensaje({ texto: '¡Registro exitoso! Ahora inicia sesión.', tipo: 'success' });
        setIsLogin(true);
        setFormData({ email: '', password: '' });
      }
    } catch (error: any) {
      // El backend devuelve 'message' según tu código actual, ajustamos para capturar eso
      const errorMsg = error.response?.data?.message || 'Ocurrió un error. Intenta de nuevo.';
      setMensaje({ texto: errorMsg, tipo: 'error' });
    }
  };

  // ... (El resto de tu UI se mantiene igual)
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            {isLogin ? 'Bienvenido de nuevo' : 'Crea tu cuenta'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ... Tus inputs de email y password se quedan igual ... */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
            <input
              type="email"
              required
              className="w-full px-4 py-2 border text-gray-800 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="tu@correo.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input
              type="password"
              required
              className="w-full px-4 py-2 border text-gray-800 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          {mensaje.texto && (
            <div className={`p-3 rounded-lg text-sm ${
              mensaje.tipo === 'error' ? 'bg-red-50 text-red-600' : 
              mensaje.tipo === 'success' ? 'bg-green-50 text-green-600' : 
              'bg-blue-50 text-blue-600'
            }`}>
              {mensaje.texto}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition"
          >
            {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => { setIsLogin(!isLogin); setMensaje({ texto: '', tipo: '' }); }}
            className="text-blue-600 hover:underline text-sm font-medium"
          >
            {isLogin ? '¿No tienes cuenta? Regístrate aquí' : '¿Ya tienes cuenta? Inicia sesión'}
          </button>
        </div>
      </div>
    </div>
  );
}